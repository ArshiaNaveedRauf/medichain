import { useState, useEffect, useCallback } from "react";
import { Copy, Check, FileText, Users, Plus, Trash2, Bell, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useWeb3 } from "../context/Web3Context";
import { useContract } from "../hooks/useContract";
import { truncateAddress, formatDate } from "../utils/format";
import { isValidAddress } from "../utils/validation";
import Navbar from "../components/Navbar";
import RecordCard from "../components/RecordCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import CatLogo from "../components/CatLogo";

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
  const [recordsLoading, setRecordsLoading] = useState(false);

  // Access management
  const [grantedDoctors, setGrantedDoctors] = useState([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const [doctorInput, setDoctorInput] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);
  const [revokingAddr, setRevokingAddr] = useState(null);

  // Access requests
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [approvingAddr, setApprovingAddr] = useState(null);
  const [denyingAddr, setDenyingAddr] = useState(null);

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

  const fetchPendingRequests = useCallback(async () => {
    setRequestsLoading(true);
    const data = await read((c) => c.getPendingRequests());
    if (data) setPendingRequests([...data]);
    setRequestsLoading(false);
  }, [read]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);
  useEffect(() => { if (tab === "access") fetchGrantedDoctors(); }, [tab, fetchGrantedDoctors]);
  useEffect(() => { if (tab === "requests") fetchPendingRequests(); }, [tab, fetchPendingRequests]);

  // Also fetch pending count for badge on mount
  useEffect(() => { fetchPendingRequests(); }, [fetchPendingRequests]);

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!isValidAddress(doctorInput)) { toast.error("Invalid Ethereum address."); return; }
    const isDoc = await read((c) => c.isDoctor(doctorInput));
    if (!isDoc) { toast.error("That address is not a registered doctor."); return; }
    setGrantLoading(true);
    const result = await call((c) => c.grantAccess(doctorInput), "Access granted!");
    setGrantLoading(false);
    if (result.success) { setDoctorInput(""); fetchGrantedDoctors(); fetchPendingRequests(); }
  };

  const handleRevokeAccess = async (doctorAddr) => {
    setRevokingAddr(doctorAddr);
    const result = await call((c) => c.revokeAccess(doctorAddr), "Access revoked.");
    setRevokingAddr(null);
    if (result.success) fetchGrantedDoctors();
  };

  const handleApproveRequest = async (doctorAddr) => {
    setApprovingAddr(doctorAddr);
    const result = await call((c) => c.approveAccessRequest(doctorAddr), "Access approved!");
    setApprovingAddr(null);
    if (result.success) { fetchPendingRequests(); fetchGrantedDoctors(); }
  };

  const handleDenyRequest = async (doctorAddr) => {
    setDenyingAddr(doctorAddr);
    const result = await call((c) => c.denyAccessRequest(doctorAddr), "Request denied.");
    setDenyingAddr(null);
    if (result.success) fetchPendingRequests();
  };

  const inputClass = "flex-1 border border-border rounded-xl px-4 py-3 text-text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all bg-white text-sm font-mono";

  const tabs = [
    { id: "records", label: "My Records", icon: FileText },
    { id: "access", label: "Manage Access", icon: Users },
    {
      id: "requests",
      label: "Requests",
      icon: Bell,
      badge: pendingRequests.length > 0 ? pendingRequests.length : null,
    },
  ];

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
          {tabs.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === id ? "bg-sage text-white shadow-sm" : "text-muted hover:text-text-main"
              }`}
            >
              <Icon size={16} />
              {label}
              {badge && (
                <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                  tab === id ? "bg-white text-sage-dark" : "bg-pink text-rose-700"
                }`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Records tab */}
        {tab === "records" && (
          <div className="animate-fade-in">
            {recordsLoading ? (
              <div className="flex justify-center py-16"><LoadingSpinner size={32} /></div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 animate-fade-in">
                <div className="animate-float"><CatLogo size={120} sad /></div>
                <p className="text-text-main font-bold text-base mt-1">No records yet.</p>
                <p className="text-muted text-sm text-center max-w-xs leading-relaxed">
                  Your medical records will appear here once a doctor with access adds one.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((r, i) => <RecordCard key={`${r.id}-${i}`} record={r} />)}
              </div>
            )}
          </div>
        )}

        {/* Access tab */}
        {tab === "access" && (
          <div className="animate-fade-in space-y-6">
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

            <div className="bg-white border border-border rounded-3xl shadow-soft p-6">
              <h2 className="font-bold text-text-main mb-4">Doctors with Access</h2>
              {accessLoading ? (
                <div className="flex justify-center py-8"><LoadingSpinner size={24} /></div>
              ) : grantedDoctors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 animate-fade-in">
                  <div className="animate-float"><CatLogo size={110} sad /></div>
                  <p className="text-text-main font-bold text-base mt-1">No doctors have access yet.</p>
                  <p className="text-muted text-sm text-center max-w-xs leading-relaxed">
                    Use the form above to grant a doctor access to your records.
                  </p>
                </div>
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

        {/* Requests tab */}
        {tab === "requests" && (
          <div className="animate-fade-in">
            <div className="bg-white border border-border rounded-3xl shadow-soft p-6">
              <div className="flex items-center gap-2 mb-5">
                <Bell size={18} className="text-sage-dark" />
                <h2 className="font-bold text-text-main text-lg">Access Requests</h2>
                {pendingRequests.length > 0 && (
                  <span className="bg-pink text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {pendingRequests.length} pending
                  </span>
                )}
              </div>

              {requestsLoading ? (
                <div className="flex justify-center py-12"><LoadingSpinner size={28} /></div>
              ) : pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 animate-fade-in">
                  <div className="animate-float"><CatLogo size={110} desaturated /></div>
                  <p className="text-text-main font-bold text-base mt-1">No pending requests.</p>
                  <p className="text-muted text-sm text-center max-w-xs">
                    When a doctor requests access to your records, it will appear here for you to approve or deny.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {pendingRequests.map((addr) => (
                    <li key={addr} className="bg-cream border border-border rounded-2xl p-4 animate-slide-up">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-muted mb-1 font-medium">Doctor requesting access</p>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-sm text-text-main font-semibold">
                              {truncateAddress(addr, 12, 8)}
                            </span>
                            <CopyButton text={addr} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleDenyRequest(addr)}
                            disabled={denyingAddr === addr || approvingAddr === addr || loading}
                            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold px-3 py-2 rounded-xl hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-50"
                          >
                            {denyingAddr === addr ? <LoadingSpinner size={13} color="#ef4444" /> : <XCircle size={14} />}
                            Deny
                          </button>
                          <button
                            onClick={() => handleApproveRequest(addr)}
                            disabled={approvingAddr === addr || denyingAddr === addr || loading}
                            className="flex items-center gap-1.5 text-xs text-white bg-sage hover:bg-sage-dark font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                          >
                            {approvingAddr === addr ? <LoadingSpinner size={13} color="white" /> : <CheckCircle size={14} />}
                            Approve
                          </button>
                        </div>
                      </div>
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
