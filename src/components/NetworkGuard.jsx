import { AlertTriangle } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import LoadingSpinner from "./LoadingSpinner";

export default function NetworkGuard({ children }) {
  const { account, isCorrectNetwork, switchToSepolia } = useWeb3();

  if (!account) return children;
  if (isCorrectNetwork) return children;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream/90 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-card border border-border p-10 max-w-sm w-full mx-4 text-center animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={32} className="text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-text-main mb-2">Wrong Network</h2>
        <p className="text-muted text-sm mb-6">
          You're on the wrong network. Please switch to <span className="font-semibold text-text-main">Sepolia Testnet</span> to use Medi-Chain.
        </p>
        <button
          onClick={switchToSepolia}
          className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Switch to Sepolia
        </button>
      </div>
    </div>
  );
}
