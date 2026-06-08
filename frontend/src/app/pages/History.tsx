import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Recycle, Award, TrendingUp } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function History() {
  const navigate = useNavigate();
  const { scans } = useApp();

  const totalPoints = scans.reduce((sum, scan) => sum + scan.points, 0);
  const successRate = scans.length > 0
    ? Math.round((scans.filter(s => s.success).length / scans.length) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Scan History</h2>
          <p className="text-gray-400">View all your recycling activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-500/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Scans</p>
                <p className="text-2xl font-bold text-gray-100">{scans.length}</p>
              </div>
            </div>
          </Card>

          <Card className="border-yellow-400/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Points Earned</p>
                <p className="text-2xl font-bold text-yellow-400">{totalPoints}</p>
              </div>
            </div>
          </Card>

          <Card className="border-green-500/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-gray-100">{successRate}%</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-100">Recent Activity</h3>
            <Button onClick={() => navigate("/scan")} variant="secondary">
              New Scan
            </Button>
          </div>

          {scans.length === 0 ? (
            <div className="text-center py-12">
              <Recycle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No scans yet. Start recycling to see your history!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Bottle</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Material</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Weight</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Points</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.map((scan) => (
                    <tr key={scan.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-4 text-sm text-gray-100">
                        {new Date(scan.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">
                        {new Date(scan.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20">
                          {(scan as any).bottleLabel || scan.bottleType}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">{(scan as any).material || "PET"}</td>
                      <td className="py-4 px-4 text-sm text-gray-400">{scan.weight}g</td>
                      <td className="py-4 px-4">
                        <span className="text-yellow-400 font-semibold">+{scan.points}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm border border-green-500/20">
                          ✓ Success
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
