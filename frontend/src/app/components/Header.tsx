import { useNavigate } from "react-router";
import { User, History, Recycle, MapPin, Gift, LogOut } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { logout } from "../../firebase/auth";

export function Header() {
  const navigate = useNavigate();
  const { user, setUser, setScans } = useApp();

  const displayName = user?.email
    ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
    : '';

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
            <Recycle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-green-500">RECAP</h1>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/rewards")}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Rewards"
          >
            <Gift className="w-6 h-6 text-gray-400 hover:text-green-500 transition-colors" />
          </button>
          <button
            onClick={() => navigate("/map")}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Map"
          >
            <MapPin className="w-6 h-6 text-gray-400 hover:text-green-500 transition-colors" />
          </button>
          <button
            onClick={() => navigate("/history")}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="History"
          >
            <History className="w-6 h-6 text-gray-400 hover:text-green-500 transition-colors" />
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Profile"
          >
            <User className="w-5 h-5 text-gray-400 hover:text-green-500 transition-colors" />
            {displayName && <span className="text-sm text-gray-300 hidden sm:block">{displayName}</span>}
          </button>
          <div className="w-px h-6 bg-gray-700 mx-1"></div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-900/20 rounded-lg transition-colors group"
            aria-label="Logout"
          >
            <LogOut className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
}
