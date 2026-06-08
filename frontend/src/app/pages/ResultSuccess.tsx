import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { CheckCircle, Award } from "lucide-react";

export default function ResultSuccess() {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState({ bottleType: 'PET', weight: 15, points: 10 });

  useEffect(() => {
    const lastScan = localStorage.getItem('lastScanResult');
    if (lastScan) {
      setScanResult(JSON.parse(lastScan));
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-100 mb-2">Bottle Detected Successfully!</h2>
            <p className="text-gray-400">Great job! You're helping the environment</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 rounded-xl p-8 mb-6 shadow-xl shadow-yellow-400/20">
            <Award className="w-16 h-16 mx-auto mb-4 text-yellow-900/30" />
            <p className="text-lg mb-2 text-yellow-900 font-medium">Points Earned</p>
            <p className="text-6xl font-bold">+{scanResult.points}</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-400 mb-1">Bottle Type</p>
                <p className="font-semibold text-gray-100">{scanResult.bottleType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Weight</p>
                <p className="font-semibold text-gray-100">{scanResult.weight}g</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Date</p>
                <p className="font-semibold text-gray-100">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Time</p>
                <p className="font-semibold text-gray-100">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          <Button onClick={() => navigate("/dashboard")} className="w-full">
            Back to Dashboard
          </Button>
        </Card>
      </main>
    </div>
  );
}
