import { Wallet } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import LoadingSpinner from "./LoadingSpinner";

export default function ConnectWalletButton({ large = false }) {
  const { connect, connecting } = useWeb3();

  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed";
  const size = large
    ? "px-8 py-4 text-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg"
    : "px-5 py-2.5 text-sm";

  return (
    <button
      onClick={connect}
      disabled={connecting}
      className={`${base} ${size} bg-sage hover:bg-sage-dark text-white`}
    >
      {connecting ? <LoadingSpinner size={20} color="white" /> : <Wallet size={large ? 22 : 17} />}
      {connecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
