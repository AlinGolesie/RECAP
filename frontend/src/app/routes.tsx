import { createBrowserRouter, Navigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ScanBottle from "./pages/ScanBottle";
import ResultSuccess from "./pages/ResultSuccess";
import ResultError from "./pages/ResultError";
import History from "./pages/History";
import Map from "./pages/Map";
import Rewards from "./pages/Rewards";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useApp();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "/scan",
    element: <ProtectedRoute><ScanBottle /></ProtectedRoute>,
  },
  {
    path: "/result/success",
    element: <ProtectedRoute><ResultSuccess /></ProtectedRoute>,
  },
  {
    path: "/result/error",
    element: <ProtectedRoute><ResultError /></ProtectedRoute>,
  },
  {
    path: "/history",
    element: <ProtectedRoute><History /></ProtectedRoute>,
  },
  {
    path: "/map",
    element: <ProtectedRoute><Map /></ProtectedRoute>,
  },
  {
    path: "/rewards",
    element: <ProtectedRoute><Rewards /></ProtectedRoute>,
  },
]);
