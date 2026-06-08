import { useState } from "react";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import {
  Gift,
  Banknote,
  Coffee,
  ShoppingBag,
  Award,
  Check,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  value: string;
  type: "cash" | "voucher";
  icon: any;
  color: string;
}

const rewards: Reward[] = [
  {
    id: "cash-5",
    name: "£5 Cash",
    description: "Direct bank transfer to your account",
    pointsCost: 500,
    value: "£5.00",
    type: "cash",
    icon: Banknote,
    color: "green",
  },
  {
    id: "cash-10",
    name: "£10 Cash",
    description: "Direct bank transfer to your account",
    pointsCost: 1000,
    value: "£10.00",
    type: "cash",
    icon: Banknote,
    color: "green",
  },
  {
    id: "cash-20",
    name: "£20 Cash",
    description: "Direct bank transfer to your account",
    pointsCost: 2000,
    value: "£20.00",
    type: "cash",
    icon: Banknote,
    color: "green",
  },
  {
    id: "cafe-5",
    name: "Coffe Voucher",
    description: "£5 voucher for coffee shops",
    pointsCost: 450,
    value: "£5.00",
    type: "voucher",
    icon: Coffee,
    color: "amber",
  },
  {
    id: "cafe-10",
    name: "Meal Voucher",
    description: "£10 meal voucher for dining",
    pointsCost: 900,
    value: "£10.00",
    type: "voucher",
    icon: Coffee,
    color: "amber",
  },
  {
    id: "shop-15",
    name: "Store Voucher",
    description: "£15 voucher for bookstore",
    pointsCost: 1350,
    value: "£15.00",
    type: "voucher",
    icon: ShoppingBag,
    color: "blue",
  },
  {
    id: "shop-25",
    name: "Shopping Voucher",
    description: "£25 voucher for stores",
    pointsCost: 2250,
    value: "£25.00",
    type: "voucher",
    icon: ShoppingBag,
    color: "blue",
  },
  {
    id: "premium-50",
    name: "Premium Voucher",
    description: "£50 multi-use voucher",
    pointsCost: 4500,
    value: "£50.00",
    type: "voucher",
    icon: Gift,
    color: "purple",
  },
];

export default function Rewards() {
  const { user, updateUserPoints } = useApp();
  const [selectedReward, setSelectedReward] =
    useState<Reward | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redeemedReward, setRedeemedReward] =
    useState<Reward | null>(null);

  const handleRedeem = (reward: Reward) => {
    setSelectedReward(reward);
    setShowConfirm(true);
  };

  const confirmRedeem = () => {
    if (!selectedReward || !user) return;

    if (user.totalPoints >= selectedReward.pointsCost) {
      updateUserPoints(-selectedReward.pointsCost, 0, 0);
      setRedeemedReward(selectedReward);
      setShowConfirm(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setRedeemedReward(null);
      }, 5000);
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<
      string,
      { bg: string; border: string; icon: string; text: string }
    > = {
      green: {
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        icon: "text-green-500",
        text: "text-green-400",
      },
      amber: {
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        icon: "text-amber-500",
        text: "text-amber-400",
      },
      blue: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        icon: "text-blue-500",
        text: "text-blue-400",
      },
      purple: {
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        icon: "text-purple-500",
        text: "text-purple-400",
      },
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Rewards Store
          </h2>
          <p className="text-gray-400">
            Exchange your points for cash and vouchers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 border-yellow-500/20 shadow-xl shadow-yellow-400/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-900 text-sm mb-1 font-medium">
                  Your Points
                </p>
                <p className="text-4xl font-bold">
                  {user?.totalPoints || 0}
                </p>
              </div>
              <Award className="w-12 h-12 text-yellow-900/30" />
            </div>
          </Card>

          <Card className="border-green-500/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Banknote className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  Cash Value
                </p>
                <p className="text-2xl font-bold text-gray-100">
                  £{((user?.totalPoints || 0) / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-amber-500/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  Available Rewards
                </p>
                <p className="text-2xl font-bold text-gray-100">
                  {
                    rewards.filter(
                      (r) =>
                        (user?.totalPoints || 0) >=
                        r.pointsCost,
                    ).length
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>

        {showSuccess && redeemedReward && (
          <Card className="mb-6 bg-green-500/10 border-green-500/20">
            <div className="flex items-center gap-4">
              <Check className="w-8 h-8 text-green-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-400 mb-1">
                  Redemption Successful!
                </h3>
                <p className="text-gray-300">
                  You've successfully redeemed{" "}
                  <strong>{redeemedReward.name}</strong>.
                  {redeemedReward.type === "cash"
                    ? " The funds will be transferred to your account within 2-3 business days."
                    : " Your voucher code has been sent to your email."}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">
            Available Rewards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewards.map((reward) => {
              const Icon = reward.icon;
              const colors = getColorClasses(reward.color);
              const canAfford =
                (user?.totalPoints || 0) >= reward.pointsCost;

              return (
                <Card
                  key={reward.id}
                  className={`${colors.border} ${!canAfford ? "opacity-60" : ""}`}
                >
                  <div
                    className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <Icon
                      className={`w-6 h-6 ${colors.icon}`}
                    />
                  </div>

                  <h4 className="font-semibold text-gray-100 mb-1">
                    {reward.name}
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    {reward.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-lg font-bold ${colors.text}`}
                    >
                      {reward.value}
                    </span>
                    <span className="text-sm text-gray-500">
                      {reward.pointsCost} pts
                    </span>
                  </div>

                  <Button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    className="w-full text-sm"
                  >
                    {canAfford ? "Redeem" : "Not Enough Points"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                How Rewards Work
              </h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>
                  • <strong>Point Value:</strong> 100 points =
                  £1.00
                </li>
                <li>
                  • <strong>Cash Transfers:</strong> Funds are
                  transferred within 2-3 business days to your
                  registered bank account
                </li>
                <li>
                  • <strong>Vouchers:</strong> Digital voucher
                  codes are sent to your email instantly and can
                  be used at participating locations
                </li>
                <li>
                  • <strong>Expiry:</strong> Vouchers are valid
                  for 12 months from redemption date
                </li>
                <li>
                  • <strong>No Refunds:</strong> Points cannot
                  be refunded once redeemed
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </main>

      {showConfirm && selectedReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-100 mb-4">
              Confirm Redemption
            </h3>

            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to redeem{" "}
                <strong className="text-green-400">
                  {selectedReward.name}
                </strong>
                ?
              </p>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Reward Value:
                  </span>
                  <span className="text-gray-100 font-semibold">
                    {selectedReward.value}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Points Cost:
                  </span>
                  <span className="text-yellow-400 font-semibold">
                    {selectedReward.pointsCost} pts
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Current Balance:
                    </span>
                    <span className="text-gray-100">
                      {user?.totalPoints || 0} pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      After Redemption:
                    </span>
                    <span className="text-green-400 font-semibold">
                      {(user?.totalPoints || 0) -
                        selectedReward.pointsCost}{" "}
                      pts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={confirmRedeem}
                className="flex-1"
              >
                Confirm
              </Button>
              <Button
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedReward(null);
                }}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}