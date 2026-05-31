import { useState } from "react";
import { Copy, Check, LogOut } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import CatLogo from "./CatLogo";
import { truncateAddress } from "../utils/format";

export default function Navbar() {
  const { account, role, disconnect } = useWeb3();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const roleBadge =
    role === "patient"
      ? "bg-pink/60 text-rose-700"
      : role === "doctor"
      ? "bg-sage/50 text-green-800"
      : "bg-stone-100 text-muted";

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <CatLogo size={40} />
          <span className="font-bold text-xl text-text-main tracking-tight">Medi-Chain</span>
        </div>

        {/* Right side */}
        {account && (
          <div className="flex items-center gap-2">
            {role && role !== "unregistered" && (
              <span className={`hidden sm:inline-block text-xs font-semibold px-3 py-1 rounded-full ${roleBadge}`}>
                {role === "patient" ? "Patient" : "Doctor"}
              </span>
            )}
            <div className="flex items-center gap-1 bg-cream border border-border rounded-xl px-3 py-1.5">
              <span className="font-mono text-sm text-text-main">{truncateAddress(account)}</span>
              <button onClick={handleCopy} className="ml-1 text-muted hover:text-sage-dark transition-colors">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <button
              onClick={disconnect}
              title="Disconnect"
              className="p-2 rounded-xl text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={17} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
