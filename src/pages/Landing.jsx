import { Shield, User, Wifi } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import CatLogo from "../components/CatLogo";
import ConnectWalletButton from "../components/ConnectWalletButton";

const FEATURES = [
  {
    icon: Shield,
    title: "Tamper-proof",
    desc: "Records are stored on Ethereum — immutable and cryptographically secured.",
  },
  {
    icon: User,
    title: "Patient-controlled",
    desc: "You decide which doctors can see your records. Revoke access anytime.",
  },
  {
    icon: Wifi,
    title: "Always accessible",
    desc: "Your records are on-chain, available anywhere, anytime, to those you trust.",
  },
];

export default function Landing() {
  const { isContractConfigured } = useWeb3();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Dev banner */}
      {!isContractConfigured && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-center text-xs py-2 px-4 font-medium">
          ⚠️ Contract not yet deployed — update <code className="bg-amber-100 px-1 rounded">src/config/contract.js</code> with your Remix address and ABI.
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center animate-fade-in">
        {/* Hero */}
        <div className="mb-6">
          <CatLogo size={180} />
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-text-main tracking-tight mb-4">
          Medi-Chain
        </h1>
        <p className="text-lg sm:text-xl text-muted max-w-md mb-10 leading-relaxed">
          Your medical records, on the blockchain.{" "}
          <span className="text-text-main font-semibold">Owned by you.</span>
        </p>

        {!window.ethereum ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-red-500 font-medium">MetaMask not detected.</p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold px-8 py-4 rounded-xl text-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Install MetaMask
            </a>
          </div>
        ) : (
          <ConnectWalletButton large />
        )}

        {/* Feature cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-border rounded-2xl p-5 text-left shadow-soft hover:shadow-card transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center mb-3">
                <Icon size={20} className="text-sage-dark" />
              </div>
              <h3 className="font-bold text-text-main mb-1">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
