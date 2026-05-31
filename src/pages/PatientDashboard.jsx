import { useState, useEffect, useCallback } from "react";
import { Copy, Check, FileText, Users, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useWeb3 } from "../context/Web3Context";
import { useContract } from "../hooks/useContract";
import { truncateAddress, formatDate } from "../utils/format";
import { isValidAddress } from "../utils/validation";
import Navbar from "../components/Navbar";
import RecordCard from "../components/RecordCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="ml-1 text-muted hover:text-sage-dark transition-colors"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export default function PatientDashboard() {
  const { account, patientData, loading } = useWeb3();
  const { call, read } = useContract();
  const [tab, setTab] = useState("records");

  // Records
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);

  // Access
  const [grantedDoctors, setGrantedDoctors] = useState([]);
  const [accessLoading, setAccessLoading] = useState(true);
  const [doctorInput, setDoctorInput] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);
  const [revokingAddr, setRevokingAddr] = useState(null);

  const fetchRecords = useCallback(async () => {
    setRecordsLoading(true);
    const data = await read((c) => c.getMyRecords());
    if (data) setRecords([...data].reverse());
    setRecordsLoading(false);
  }, [read]);

  const fetchGrantedDoctors = useCallback(async () => {
    setAccessLoading(true);
    const data = await read((c) => c.getGrantedDoctors());
    if (data) setGrantedDoctors([...data]);
    setAccessLoading(false);
  }, [read]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);
  useEffect(() => { if (tab === "access") fetchGrantedDoctors(); }, [tab, fetchGrantedDoctors]);

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!isValidAddress(doctorInput)) { toast.error("Invalid Ethereum address."); return; }
    // Check if doctor is registered
    const isDoc = await read((c) => c.isDoctor(doctorInput));
    if (!isDoc) { toast.error("That address is not a registered doctor."); return; }
    setGrantLoading(true);
    const result = await call((c) => c.grantAccess(doctorInput), "Access granted!");
    setGrantLoading(false);
    if (result.success) { setDoctorInput(""); fetchGrantedDoctors(); }
  };

  const handleRevokeAccess = async (doctorAddr) => {
    setRevokingAddr(doctorAddr);
    const result = await call((c) => c.revokeAccess(doctorAddr), "Access revoked.");
    setRevokingAddr(null);
    if (result.success) fetchGrantedDoctors();
  };

  const inputClass = "flex-1 border border-border rounded-xl px-4 py-3 text-text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all bg-white text-sm font-mono";

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">

        {/* Header card */}
        <div className="bg-white border border-border rounded-3xl shadow-soft p-6 mb-6">
          <p className="text-muted text-sm mb-1">Welcome back,</p>
          <h1 className="text-2xl font-extrabold text-text-main mb-1">
            {patientData?.name || "Patient"}
          </h1>
          {patientData?.dateOfBirth ? (
            <p className="text-muted text-sm mb-2">Born: {formatDate(patientData.dateOfBirth)}</p>
          ) : null}
          <div className="flex items-center gap-1 text-sm text-muted">
            <span className="font-mono">{truncateAddress(account, 10, 8)}</span>
            <CopyButton text={account} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-2xl p-1 mb-6 w-fit">
          {[
            { id: "records", label: "My Records", icon: FileText },
            { id: "access", label: "Manage Access", icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === id
                  ? "bg-sage text-white shadow-sm"
                  : "text-muted hover:text-text-main"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Records tab */}
        {tab === "records" && (
          <div className="animate-fade-in">
            {recordsLoading ? (
              <div className="flex justify-center py-16"><LoadingSpinner size={32} /></div>
            ) : records.length === 0 ? (
              <EmptyState
                message="No records yet."
                sub="They'll appear here when a doctor adds one."
              />
            ) : (
              <div className="space-y-4">
                {records.map((r, i) => (
                  <RecordCard key={`${r.id}-${i}`} record={r} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Access tab */}
        {tab === "access" && (
          <div className="animate-fade-in space-y-6">
            {/* Grant form */}
            <div className="bg-white border border-border rounded-3xl shadow-soft p-6">
              <h2 className="font-bold text-text-main mb-4">Grant Access to a Doctor</h2>
              <form onSubmit={handleGrantAccess} className="flex gap-3">
                <input
                  type="text"
                  value={doctorInput}
                  onChange={(e) => setDoctorInput(e.target.value)}
                  placeholder="Doctor's wallet address (0x…)"
                  className={inputClass}
                />
                <button
                  type="submit"
                  disabled={grantLoading || loading || !doctorInput}
                  className="flex items-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold px-5 py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {grantLoading ? <LoadingSpinner size={16} color="white" /> : <Plus size={16} />}
                  Grant
                </button>
              </form>
            </div>

            {/* Granted doctors list */}
            <div className="bg-white border border-border rounded-3xl shadow-soft p-6">
              <h2 className="font-bold text-text-main mb-4">Doctors with Access</h2>
              {accessLoading ? (
                <div className="flex justify-center py-8"><LoadingSpinner size={24} /></div>
              ) : grantedDoctors.length === 0 ? (
                <EmptyState
                  message="No doctors with access."
                  sub="You haven't granted access to any doctors yet."
                />
              ) : (
                <ul className="space-y-3">
                  {grantedDoctors.map((addr) => (
                    <li key={addr} className="flex items-center justify-between gap-3 p-3 bg-cream rounded-xl border border-border">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono text-sm text-text-main truncate">{truncateAddress(addr, 10, 8)}</span>
                        <CopyButton text={addr} />
                      </div>
                      <button
                        onClick={() => handleRevokeAccess(addr)}
                        disabled={revokingAddr === addr || loading}
                        className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {revokingAddr === addr ? <LoadingSpinner size={13} color="#ef4444" /> : <Trash2 size={13} />}
                        Revoke
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
