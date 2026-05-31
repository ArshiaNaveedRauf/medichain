import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { formatTimestamp, truncateAddress } from "../utils/format";

const BADGE_COLORS = {
  Diagnosis: "bg-blue-100 text-blue-700",
  Prescription: "bg-purple-100 text-purple-700",
  "Lab Result": "bg-amber-100 text-amber-700",
  Imaging: "bg-indigo-100 text-indigo-700",
  Other: "bg-stone-100 text-stone-600",
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handle} className="ml-1 text-muted hover:text-sage-dark transition-colors">
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

export default function RecordCard({ record }) {
  const badgeClass = BADGE_COLORS[record.recordType] || BADGE_COLORS.Other;
  return (
    <div className="bg-white rounded-2xl border border-border shadow-soft p-5 animate-slide-up hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`text-xs font-700 px-3 py-1 rounded-full font-semibold ${badgeClass}`}>
          {record.recordType}
        </span>
        <span className="text-xs text-muted shrink-0">{formatTimestamp(record.timestamp)}</span>
      </div>
      <p className="text-text-main text-sm leading-relaxed mb-3">{record.details}</p>
      <div className="flex items-center gap-1 text-xs text-muted border-t border-border pt-3">
        <span>Dr.</span>
        <span className="font-mono">{truncateAddress(record.doctor)}</span>
        <CopyButton text={record.doctor} />
        <span className="ml-2 text-border">·</span>
        <span className="ml-2">Record #{String(record.id)}</span>
      </div>
    </div>
  );
}
