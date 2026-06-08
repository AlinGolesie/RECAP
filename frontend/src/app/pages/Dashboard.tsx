import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Recycle, TrendingUp, Calendar, Award, Droplet, Leaf } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../../context/AppContext";
import { useMemo } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, scans } = useApp();

  const todayScans = useMemo(() => {
    const today = new Date();
    return scans.filter(scan => {
      const scanDate = new Date(scan.timestamp);
      return scanDate.toDateString() === today.toDateString();
    }).length;
  }, [scans]);

  const weeklyScans = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return scans.filter(scan => new Date(scan.timestamp) >= weekAgo).length;
  }, [scans]);

  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map(day => ({ day, bottles: 0 }));

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    scans.forEach(scan => {
      const scanDate = new Date(scan.timestamp);
      if (scanDate >= weekAgo) {
        const dayIndex = scanDate.getDay();
        data[dayIndex].bottles += 1;
      }
    });

    return data;
  }, [scans]);

  const totalVolumeL = useMemo(() => {
    return scans.reduce((sum, scan) => {
      const ml = parseInt(scan.bottleType) || 0;
      return sum + ml;
    }, 0) / 1000;
  }, [scans]);

  const co2Reduced = useMemo(() => {
    return ((user?.totalWeight || 0) / 1000 * 1.73).toFixed(2);
  }, [user?.totalWeight]);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Welcome back{user?.email ? `, ${user.email.split('@')[0].charAt(0).toUpperCase()}${user.email.split('@')[0].slice(1)}` : ''}!
          </h2>
          <p className="text-gray-400">You've recycled <span className="text-green-400 font-semibold">{user?.totalBottles || 0} bottle{(user?.totalBottles || 0) !== 1 ? 's' : ''}</span> so far — keep it up!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 border-yellow-500/20 shadow-xl shadow-yellow-400/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-900 text-sm mb-1 font-medium">Total Points</p>
                <p className="text-4xl font-bold">{user?.totalPoints || 0}</p>
              </div>
              <Award className="w-12 h-12 text-yellow-900/30" />
            </div>
          </Card>

          <Card className="border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Bottles</p>
                <p className="text-3xl font-bold text-gray-100">{user?.totalBottles || 0}</p>
              </div>
              <Recycle className="w-10 h-10 text-green-500" />
            </div>
          </Card>

          <Card className="border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Today</p>
                <p className="text-3xl font-bold text-gray-100">{todayScans}</p>
              </div>
              <Calendar className="w-10 h-10 text-green-500" />
            </div>
          </Card>

          <Card className="border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">This Week</p>
                <p className="text-3xl font-bold text-gray-100">{weeklyScans}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Weekly Progress</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData} key="weekly-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" key="grid" />
                <XAxis dataKey="day" stroke="#9CA3AF" key="x-axis" />
                <YAxis stroke="#9CA3AF" key="y-axis" />
                <Tooltip
                  key="tooltip"
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #1F2937',
                    borderRadius: '0.5rem',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="bottles" fill="#22C55E" radius={[8, 8, 0, 0]} key="bar" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="flex flex-col justify-center items-center text-center border-green-500/20">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <Recycle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Ready to Recycle?</h3>
            <p className="text-gray-400 mb-6">Scan your bottle to earn points</p>
            <Button onClick={() => navigate("/scan")} className="w-full">
              Scan Bottle
            </Button>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Environmental Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Recycle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-green-400">{((user?.totalWeight || 0) / 1000).toFixed(3)}kg</p>
              <p className="text-sm text-gray-400 mt-1">Plastic Recycled</p>
            </div>
            <div className="text-center p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Droplet className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-blue-400">{totalVolumeL.toFixed(2)}L</p>
              <p className="text-sm text-gray-400 mt-1">Bottle Volume Recycled</p>
            </div>
            <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Leaf className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-green-400">{co2Reduced}kg</p>
              <p className="text-sm text-gray-400 mt-1">CO₂ Saved</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
