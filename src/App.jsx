import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useWeb3 } from "./context/Web3Context";
import NetworkGuard from "./components/NetworkGuard";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

function AppRouter() {
  const { account, role, isCorrectNetwork } = useWeb3();
  const navigate = useNavigate();

  useEffect(() => {
    if (!account) {
      navigate("/");
      return;
    }
    if (!isCorrectNetwork) return;
    if (role === "patient") navigate("/patient");
    else if (role === "doctor") navigate("/doctor");
    else if (role === "unregistered") navigate("/register");
  }, [account, role, isCorrectNetwork, navigate]);

  return (
    <NetworkGuard>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NetworkGuard>
  );
}

export default function App() {
  return <AppRouter />;
}
