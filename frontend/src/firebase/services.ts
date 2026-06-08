import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

export interface BottleType {
  id: string;
  name: string;
  weight: number;
  points: number;
}

export interface ScanRecord {
  id?: string;
  userId: string;
  bottleType: string;
  weight: number;
  points: number;
  timestamp: Date;
  success: boolean;
}

export interface UserData {
  uid: string;
  email: string;
  totalPoints: number;
  totalBottles: number;
  totalWeight: number;
  createdAt: Date;
}

export const bottleTypes: BottleType[] = [
  { id: 'pet', name: 'PET', weight: 15, points: 10 },
  { id: 'hdpe', name: 'HDPE', weight: 20, points: 10 },
  { id: 'pp', name: 'PP', weight: 25, points: 15 },
  { id: 'ldpe', name: 'LDPE', weight: 18, points: 10 },
  { id: 'ps', name: 'PS', weight: 12, points: 8 },
];

export async function createUserProfile(userId: string, email: string) {
  const userRef = doc(db, 'users', userId);
  const userData: UserData = {
    uid: userId,
    email,
    totalPoints: 0,
    totalBottles: 0,
    totalWeight: 0,
    createdAt: new Date(),
  };
  await setDoc(userRef, userData);
  return userData;
}

export async function getUserProfile(userId: string): Promise<UserData | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserData;
  }
  return null;
}

export async function addScanRecord(scanData: ScanRecord): Promise<string> {
  const scansRef = collection(db, 'scans');
  const docRef = await addDoc(scansRef, {
    ...scanData,
    timestamp: Timestamp.fromDate(scanData.timestamp),
  });
  return docRef.id;
}

export async function updateUserStats(
  userId: string,
  pointsToAdd: number,
  weightToAdd: number
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const currentData = userSnap.data() as UserData;
    await updateDoc(userRef, {
      totalPoints: currentData.totalPoints + pointsToAdd,
      totalBottles: currentData.totalBottles + 1,
      totalWeight: currentData.totalWeight + weightToAdd,
    });
  }
}

export async function getUserScans(userId: string): Promise<ScanRecord[]> {
  const scansRef = collection(db, 'scans');
  const q = query(
    scansRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(),
  } as ScanRecord));
}

export function getBottleTypeData(typeName: string): BottleType {
  return bottleTypes.find(bt => bt.name === typeName) || bottleTypes[0];
}

export function getRandomBottleType(): BottleType {
  return bottleTypes[Math.floor(Math.random() * bottleTypes.length)];
}

export interface RedemptionRecord {
  id?: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  rewardValue: string;
  pointsCost: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  type: 'cash' | 'voucher';
  voucherCode?: string;
}

export async function addRedemption(redemptionData: RedemptionRecord): Promise<string> {
  const redemptionsRef = collection(db, 'redemptions');
  const docRef = await addDoc(redemptionsRef, {
    ...redemptionData,
    timestamp: Timestamp.fromDate(redemptionData.timestamp),
  });
  return docRef.id;
}

export async function getUserRedemptions(userId: string): Promise<RedemptionRecord[]> {
  const redemptionsRef = collection(db, 'redemptions');
  const q = query(
    redemptionsRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(),
  } as RedemptionRecord));
}
