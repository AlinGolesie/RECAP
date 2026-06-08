import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { XCircle, AlertCircle } from "lucide-react";

export default function ResultError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-100 mb-2">No Bottle Detected</h2>
            <p className="text-gray-400">Please try again</p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-400 mb-2 font-medium">Detection Failed</p>
            <p className="text-sm text-gray-300">
              We couldn't detect a plastic bottle in the image. Please ensure:
            </p>
            <ul className="text-sm text-gray-300 mt-3 space-y-1 text-left max-w-md mx-auto">
              <li>• The bottle is clearly visible in the frame</li>
              <li>• There is adequate lighting</li>
              <li>• The bottle label is facing the camera</li>
              <li>• Only one bottle is in the frame</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => navigate("/scan")} className="flex-1">
              Retry Scan
            </Button>
            <Button onClick={() => navigate("/dashboard")} variant="secondary">
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
