import { useState, useEffect, useCallback } from "react";
import {
  Copy, Check, PlusCircle, Search, Stethoscope, Bell,
  ChevronDown, ChevronUp, Calendar, User, Hash,
  FlaskConical, Pill, ScanLine, FileText, Layers, Filter, Pencil
} from "lucide-react";
import toast from "react-hot-toast";
import { useWeb3 } from "../context/Web3Context";
import { useContract } from "../hooks/useContract";
import { truncateAddress, formatTimestamp, formatDate } from "../utils/format";
import { isValidAddress } from "../utils/validation";
import Navbar from "../components/Navbar";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import CatLogo from "../components/CatLogo";
import EditProfileModal from "../components/EditProfileModal";

const RECORD_TYPES = ["Diagnosis", "Prescription", "Lab Result", "Imaging", "Other"];

const TYPE_CONFIG = {
  Diagnosis:    { color: "bg-blue-100 text-blue-700 border-blue-200",   icon: Stethoscope, dot: "bg-blue-400" },
  Prescription: { color: "bg-purple-100 text-purple-700 border-purple-200", icon: Pill,        dot: "bg-purple-400" },
  "Lab Result": { color: "bg-amber-100 text-amber-700 border-amber-200",  icon: FlaskConical, dot: "bg-amber-400" },
  Imaging:      { color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: ScanLine,    dot: "bg-indigo-400" },
  Other:        { color: "bg-stone-100 text-stone-600 border-stone-200",  icon: FileText,     dot: "bg-stone-400" },
};

function CopyButton({ text, small }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="text-muted hover:text-sage-dark transition-colors ml-1"
    >
      {copied ? <Check size={small ? 12 : 14} /> : <Copy size={small ? 12 : 14} />}
    </button>
  );
}

// Rich expandable record card used in View tab
function DetailedRecordCard({ record, index }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TYPE_CONFIG[record.recordType] || TYPE_CONFIG.Other;
  const Icon = cfg.icon;

  return (
    <div
      className="bg-white border border-border rounded-2xl shadow-soft overflow-hidden animate-slide-up transition-shadow hover:shadow-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Type icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.color} border`}>
          <Icon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
              {record.recordType}
            </span>
            <span className="text-xs text-muted flex items-center gap-1">
              <Calendar size={11} />
              {formatTimestamp(record.timestamp)}
            </span>
            <span className="text-xs text-muted flex items-center gap-1">
              <Hash size={11} />
              Record {String(record.id)}
            </span>
          </div>
          <p className="text-sm text-text-main mt-1 truncate">{record.details}</p>
        </div>

        <div className="text-muted shrink-0">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border bg-cream/60 px-4 py-4 space-y-3 animate-fade-in">
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Full Details</p>
            <p className="text-sm text-text-main leading-relaxed whitespace-pre-wrap bg-white border border-border rounded-xl p-3">
              {record.details}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-border rounded-xl p-3">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Added by</p>
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs text-text-main">{truncateAddress(record.doctor, 8, 6)}</span>
                <CopyButton text={record.doctor} small />
              </div>
            </div>
            <div className="bg-white border border-border rounded-xl p-3">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Patient</p>
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs text-text-main">{truncateAddress(record.patient, 8, 6)}</span>
                <CopyButton text={record.patient} small />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// No-access panel with request button
function NoAccessPanel({ patientAddr, onRequestSent }) {
  const { account, loading } = useWeb3();
  const { call, read } = useContract();
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const [checkingRequest, setCheckingRequest] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      setCheckingRequest(true);
      const result = await read((c) => c.hasRequestedAccess(account, patientAddr));
      if (!cancelled) { setAlreadyRequested(!!result); setCheckingRequest(false); }
    }
    if (isValidAddress(patientAddr) && account) check();
    return () => { cancelled = true; };
  }, [patientAddr, account, read]);

  const handleRequest = async () => {
    setRequesting(true);
    const result = await call((c) => c.requestAccess(patientAddr), "Access request sent to patient!");
    setRequesting(false);
    if (result.success) { setAlreadyRequested(true); onRequestSent?.(); }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4 animate-fade-in">
      <div className="animate-float"><CatLogo size={110} sad /></div>
      <p className="text-text-main font-bold text-lg">No access to this patient</p>
      <p className="text-muted text-sm text-center max-w-xs leading-relaxed">
        You don't have permission to view or add records for this patient yet.
      </p>
      {checkingRequest ? <LoadingSpinner size={20} /> : alreadyRequested ? (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl px-5 py-3 text-sm font-semibold">
          <Bell size={16} />
          Request sent — waiting for patient approval
        </div>
      ) : (
        <button
          onClick={handleRequest}
          disabled={requesting || loading}
          className="flex items-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-soft"
        >
          {requesting ? <LoadingSpinner size={17} color="white" /> : <Bell size={17} />}
          {requesting ? "Sending request…" : "Request Access from Patient"}
        </button>
      )}
    </div>
  );
}

export default function DoctorDashboard() {
  const { account, doctorData, loading } = useWeb3();
  const { call, read } = useContract();
  const [tab, setTab] = useState("add");
  const [showEditModal, setShowEditModal] = useState(false);

  // Add Record
  const [patientAddr, setPatientAddr] = useState("");
  const [recordType, setRecordType] = useState("Diagnosis");
  const [details, setDetails] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [accessStatus, setAccessStatus] = useState(null);

  // View Records
  const [searchAddr, setSearchAddr] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);
  const [fetchedRecords, setFetchedRecords] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [viewAccessDenied, setViewAccessDenied] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // Live access check while typing patient address (Add tab)
  useEffect(() => {
    let cancelled = false;
    async function checkAccess() {
      if (!isValidAddress(patientAddr)) { setAccessStatus(null); return; }
      setAccessStatus("checking");
      const result = await read((c) => c.hasAccess(patientAddr, account));
      if (!cancelled) setAccessStatus(result ? "granted" : "denied");
    }
    const timer = setTimeout(checkAccess, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [patientAddr, account, read]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!isValidAddress(patientAddr)) { toast.error("Invalid patient address."); return; }
    if (details.trim().length < 10) { toast.error("Details must be at least 10 characters."); return; }
    setAddLoading(true);
    const result = await call((c) => c.addRecord(patientAddr, recordType, details.trim()), "Record added successfully!");
    setAddLoading(false);
    if (result.success) { setPatientAddr(""); setDetails(""); setRecordType("Diagnosis"); setAccessStatus(null); }
  };

  const handleFetchRecords = async (e) => {
    e.preventDefault();
    if (!isValidAddress(searchAddr)) { toast.error("Invalid patient address."); return; }
    setFetchedRecords(null);
    setPatientInfo(null);
    setViewAccessDenied(false);
    setActiveFilter("All");
    setFetchLoading(true);

    const hasAcc = await read((c) => c.hasAccess(searchAddr, account));
    if (!hasAcc) { setViewAccessDenied(true); setFetchLoading(false); return; }

    const [data, info] = await Promise.all([
      read((c) => c.getPatientRecords(searchAddr)),
      read((c) => c.patients(searchAddr)),
    ]);
    setFetchLoading(false);
    if (data !== null) {
      setFetchedRecords([...data].reverse());
      setPatientInfo(info);
    }
  };

  const resetView = () => {
    setSearchAddr("");
    setFetchedRecords(null);
    setPatientInfo(null);
    setViewAccessDenied(false);
    setActiveFilter("All");
  };

  // Filter records by type
  const filteredRecords = fetchedRecords
    ? activeFilter === "All" ? fetchedRecords : fetchedRecords.filter((r) => r.recordType === activeFilter)
    : [];

  // Get counts per type for filter pills
  const typeCounts = fetchedRecords
    ? RECORD_TYPES.reduce((acc, t) => { acc[t] = fetchedRecords.filter((r) => r.recordType === t).length; return acc; }, {})
    : {};

  const inputClass = "w-full border border-border rounded-xl px-4 py-3 text-text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all bg-white text-sm";

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">

        {/* Header card */}
        <div className="bg-white border border-border rounded-3xl shadow-soft p-6 mb-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sage/20 flex items-center justify-center shrink-0">
                <Stethoscope size={24} className="text-sage-dark" />
              </div>
              <div>
                <p className="text-muted text-sm mb-0.5">Logged in as</p>
                <h1 className="text-2xl font-extrabold text-text-main">Dr. {doctorData?.name || "Doctor"}</h1>
                {doctorData?.specialization && (
                  <p className="text-sage-dark font-semibold text-sm mb-1">{doctorData.specialization}</p>
                )}
                <div className="flex items-center gap-1 text-sm text-muted">
                  <span className="font-mono">{truncateAddress(account, 10, 8)}</span>
                  <CopyButton text={account} />
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-sage-dark hover:bg-sage/10 px-3 py-2 rounded-xl transition-colors border border-border shrink-0"
            >
              <Pencil size={14} /> Edit
            </button>
          </div>
        </div>

        {showEditModal && (
          <EditProfileModal onClose={() => setShowEditModal(false)} />
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-2xl p-1 mb-6 w-fit">
          {[{ id: "add", label: "Add Record", icon: PlusCircle }, { id: "view", label: "View Patient Records", icon: Search }]
            .map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === id ? "bg-sage text-white shadow-sm" : "text-muted hover:text-text-main"
                }`}>
                <Icon size={16} />{label}
              </button>
            ))}
        </div>

        {/* ── ADD RECORD TAB ── */}
        {tab === "add" && (
          <div className="bg-white border border-border rounded-3xl shadow-soft p-6 animate-fade-in">
            <h2 className="font-bold text-text-main text-lg mb-5">Add Medical Record</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">Patient Wallet Address</label>
                <div className="relative">
                  <input type="text" value={patientAddr} onChange={(e) => setPatientAddr(e.target.value)}
                    placeholder="0x…" className={`${inputClass} font-mono pr-10`} />
                  {accessStatus === "checking" && <div className="absolute right-3 top-1/2 -translate-y-1/2"><LoadingSpinner size={16} /></div>}
                  {accessStatus === "granted" && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Check size={16} className="text-sage-dark" /></div>}
                </div>
                {accessStatus === "granted" && (
                  <p className="text-sage-dark text-xs font-semibold mt-1.5 flex items-center gap-1"><Check size={12} /> You have access to this patient</p>
                )}
              </div>

              {accessStatus === "denied" && <NoAccessPanel patientAddr={patientAddr} />}

              {accessStatus !== "denied" && (
                <form onSubmit={handleAddRecord} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">Record Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {RECORD_TYPES.map((t) => {
                        const cfg = TYPE_CONFIG[t];
                        const Icon = cfg.icon;
                        return (
                          <button key={t} type="button" onClick={() => setRecordType(t)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                              recordType === t ? `${cfg.color} border-current shadow-sm` : "border-border text-muted hover:border-sage/50 bg-cream"
                            }`}>
                            <Icon size={18} />
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">
                      Details <span className="text-muted font-normal">(min 10 characters)</span>
                    </label>
                    <textarea value={details} onChange={(e) => setDetails(e.target.value)}
                      placeholder="Describe the diagnosis, prescription, or findings…"
                      rows={5} className={`${inputClass} resize-none`} minLength={10} />
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-xs ${details.length > 0 && details.length < 10 ? "text-red-400" : "text-muted"}`}>
                        {details.length < 10 && details.length > 0 ? `${10 - details.length} more characters needed` : ""}
                      </span>
                      <span className="text-xs text-muted">{details.length} chars</span>
                    </div>
                  </div>
                  <button type="submit"
                    disabled={addLoading || loading || !patientAddr || !details || accessStatus !== "granted"}
                    className="w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    {addLoading ? <LoadingSpinner size={18} color="white" /> : <PlusCircle size={18} />}
                    {addLoading ? "Adding Record…" : "Add Record"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── VIEW RECORDS TAB ── */}
        {tab === "view" && (
          <div className="animate-fade-in space-y-4">

            {/* Search bar */}
            <div className="bg-white border border-border rounded-3xl shadow-soft p-5">
              <h2 className="font-bold text-text-main mb-1">Patient Records Viewer</h2>
              <p className="text-muted text-xs mb-4">Enter a patient's wallet address to view their medical history.</p>
              <form onSubmit={handleFetchRecords} className="flex gap-3">
                <div className="relative flex-1">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input type="text" value={searchAddr}
                    onChange={(e) => { setSearchAddr(e.target.value); if (fetchedRecords || viewAccessDenied) resetView(); }}
                    placeholder="0x… patient wallet address"
                    className="w-full border border-border rounded-xl pl-9 pr-4 py-3 text-text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all bg-white text-sm font-mono" />
                </div>
                <button type="submit" disabled={fetchLoading || !searchAddr}
                  className="flex items-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shadow-soft">
                  {fetchLoading ? <LoadingSpinner size={16} color="white" /> : <Search size={16} />}
                  {fetchLoading ? "Loading…" : "Fetch Records"}
                </button>
              </form>
            </div>

            {fetchLoading && (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <LoadingSpinner size={36} />
                <p className="text-muted text-sm">Fetching records from blockchain…</p>
              </div>
            )}

            {/* No access */}
            {viewAccessDenied && isValidAddress(searchAddr) && (
              <div className="bg-white border border-border rounded-3xl shadow-soft p-6">
                <NoAccessPanel patientAddr={searchAddr} />
              </div>
            )}

            {/* Results */}
            {fetchedRecords !== null && !fetchLoading && (
              <>
                {/* Patient info card */}
                <div className="bg-white border border-border rounded-2xl shadow-soft p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink/30 flex items-center justify-center shrink-0">
                    <User size={22} className="text-rose-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text-main text-base">
                      {patientInfo?.name || "Unknown Patient"}
                    </p>
                    {patientInfo?.dateOfBirth ? (
                      <p className="text-muted text-xs">Born: {formatDate(patientInfo.dateOfBirth)}</p>
                    ) : null}
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-mono text-xs text-muted">{truncateAddress(searchAddr, 10, 8)}</span>
                      <CopyButton text={searchAddr} small />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-extrabold text-text-main">{fetchedRecords.length}</p>
                    <p className="text-xs text-muted">total records</p>
                  </div>
                </div>

                {fetchedRecords.length === 0 ? (
                  <EmptyState message="No records found." sub="This patient has no medical records yet." />
                ) : (
                  <>
                    {/* Filter pills */}
                    <div className="flex gap-2 flex-wrap items-center">
                      <Filter size={14} className="text-muted" />
                      {["All", ...RECORD_TYPES.filter((t) => typeCounts[t] > 0)].map((f) => {
                        const cfg = TYPE_CONFIG[f];
                        const count = f === "All" ? fetchedRecords.length : typeCounts[f];
                        return (
                          <button key={f} onClick={() => setActiveFilter(f)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                              activeFilter === f
                                ? f === "All" ? "bg-text-main text-white border-text-main" : `${cfg?.color} border-current`
                                : "bg-white border-border text-muted hover:border-sage/50"
                            }`}>
                            {f} <span className="opacity-70">({count})</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Record list */}
                    {filteredRecords.length === 0 ? (
                      <div className="text-center py-8 text-muted text-sm">No {activeFilter} records found.</div>
                    ) : (
                      <div className="space-y-3">
                        {filteredRecords.map((r, i) => (
                          <DetailedRecordCard key={`${r.id}-${i}`} record={r} index={i} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
