import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { collection, doc, onSnapshot, query, where, limit, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { onAuthChange, initializeUserSession } from '../firebase/auth';
import { UserData, ScanRecord } from '../firebase/services';

interface AppContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  scans: ScanRecord[];
  setScans: (scans: ScanRecord[]) => void;
  isAuthenticated: boolean;
  loading: boolean;
  updateUserPoints: (pointsDelta: number, bottlesDelta: number, weightDelta: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const userUnsubRef = useRef<(() => void) | null>(null);
  const scansUnsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthChange(async (firebaseUser) => {
      if (userUnsubRef.current) userUnsubRef.current();
      if (scansUnsubRef.current) scansUnsubRef.current();

      if (!firebaseUser) {
        setUser(null);
        setScans([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      await initializeUserSession(firebaseUser);

      userUnsubRef.current = onSnapshot(doc(db, 'users', firebaseUser.uid), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setUser({
            uid: snap.id,
            email: data.email || firebaseUser.email || '',
            totalPoints: data.totalPoints || 0,
            totalBottles: data.totalBottles || 0,
            totalWeight: data.totalWeight || 0,
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        }
        setLoading(false);
      });

      const scansQuery = query(
        collection(db, 'scans'),
        where('userId', '==', firebaseUser.uid),
        limit(50)
      );
      scansUnsubRef.current = onSnapshot(scansQuery, (snap) => {
        const docs = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          timestamp: d.data().timestamp?.toDate() || new Date(),
        } as ScanRecord));
        docs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setScans(docs);
      }, (err) => {
        console.error('Scans query failed:', err);
      });
    });

    return () => {
      unsubscribeAuth();
      if (userUnsubRef.current) userUnsubRef.current();
      if (scansUnsubRef.current) scansUnsubRef.current();
    };
  }, []);

  const updateUserPoints = async (pointsDelta: number, bottlesDelta: number, weightDelta: number) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const updates: Record<string, ReturnType<typeof increment>> = {
      totalPoints: increment(pointsDelta),
    };
    if (bottlesDelta !== 0) updates.totalBottles = increment(bottlesDelta);
    if (weightDelta !== 0) updates.totalWeight = increment(weightDelta);
    await updateDoc(userRef, updates);
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      scans,
      setScans,
      isAuthenticated: !!user,
      loading,
      updateUserPoints,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
