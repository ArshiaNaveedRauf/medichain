import { useState } from "react";
import { Copy, Check, PlusCircle, Search, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";
import { useWeb3 } from "../context/Web3Context";
import { useContract } from "../hooks/useContract";
import { truncateAddress } from "../utils/format";
import { isValidAddress } from "../utils/validation";
import Navbar from "../components/Navbar";
import RecordCard from "../components/RecordCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

const RECORD_TYPES = ["Diagnosis", "Prescription", "Lab Result", "Imaging", "Other"];

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

export default function DoctorDashboard() {
  const { account, doctorData, loading } = useWeb3();
  const { call, read } = useContract();
  const [tab, setTab] = useState("add");

  // Add Record form
  const [patientAddr, setPatientAddr] = useState("");
  const [recordType, setRecordType] = useState("Diagnosis");
  const [details, setDetails] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // View Records
  const [searchAddr, setSearchAddr] = useState("");
  const [fetchedRecords, setFetchedRecords] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!isValidAddress(patientAddr)) { toast.error("Invalid patient address."); return; }
    if (details.trim().length < 10) { toast.error("Details must be at least 10 characters."); return; }

    setAddLoading(true);
    const result = await call(
      (c) => c.addRecord(patientAddr, recordType, details.trim()),
      "Record added successfully!"
    );
    setAddLoading(false);
    if (result.success) {
      setPatientAddr("");
      setDetails("");
      setRecordType("Diagnosis");
    }
  };

  const handleFetchRecords = async (e) => {
    e.preventDefault();
    if (!isValidAddress(searchAddr)) { toast.error("Invalid patient address."); return; }
    setFetchError("");
    setFetchedRecords(null);
    setFetchLoading(true);
    const data = await read((c) => c.getPatientRecords(searchAddr));
    setFetchLoading(false);
    if (data !== null) {
      setFetchedRecords([...data].reverse());
    } else {
      setFetchError("Could not fetch records. You may not have access to this patient.");
    }
  };

  const inputClass = "w-full border border-border rounded-xl px-4 py-3 text-text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all bg-white text-sm";

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">

        {/* Header card */}
        <div className="bg-white border border-border rounded-3xl shadow-soft p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sage/20 flex items-center justify-center shrink-0">
              <Stethoscope size={24} className="text-sage-dark" />
            </div>
            <div>
              <p className="text-muted text-sm mb-0.5">Logged in as</p>
              <h1 className="text-2xl font-extrabold text-text-main">
                Dr. {doctorData?.name || "Doctor"}
              </h1>
              {doctorData?.specialization && (
                <p className="text-sage-dark font-semibold text-sm mb-1">{doctorData.specialization}</p>
              )}
              <div className="flex items-center gap-1 text-sm text-muted">
                <span className="font-mono">{truncateAddress(account, 10, 8)}</span>
                <CopyButton text={account} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-2xl p-1 mb-6 w-fit">
          {[
            { id: "add", label: "Add Record", icon: PlusCircle },
            { id: "view", label: "View Patient Records", icon: Search },
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

        {/* Add Record tab */}
        {tab === "add" && (
          <div className="bg-white border border-border rounded-3xl shadow-soft p-6 animate-fade-in">
            <h2 className="font-bold text-text-main text-lg mb-5">Add Medical Record</h2>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">Patient Wallet Address</label>
                <input
                  type="text"
                  value={patientAddr}
                  onChange={(e) => setPatientAddr(e.target.value)}
                  placeholder="0x…"
                  className={`${inputClass} font-mono`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">Record Type</label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  className={inputClass}
                >
                  {RECORD_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">
                  Details <span className="text-muted font-normal">(min 10 characters)</span>
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe the diagnosis, prescription, or findings…"
                  rows={5}
                  className={`${inputClass} resize-none`}
                  required
                  minLength={10}
                />
                <p className="text-xs text-muted mt-1 text-right">{details.length} chars</p>
              </div>
              <button
                type="submit"
                disabled={addLoading || loading}
                className="w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {addLoading ? <LoadingSpinner size={18} color="white" /> : <PlusCircle size={18} />}
                {addLoading ? "Adding Record…" : "Add Record"}
              </button>
            </form>
          </div>
        )}

        {/* View Records tab */}
        {tab === "view" && (
          <div className="animate-fade-in space-y-5">
            <div className="bg-white border border-border rounded-3xl shadow-soft p-6">
              <h2 className="font-bold text-text-main text-lg mb-4">Fetch Patient Records</h2>
              <form onSubmit={handleFetchRecords} className="flex gap-3">
                <input
                  type="text"
                  value={searchAddr}
                  onChange={(e) => setSearchAddr(e.target.value)}
                  placeholder="Patient wallet address (0x…)"
                  className="flex-1 border border-border rounded-xl px-4 py-3 text-text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all bg-white text-sm font-mono"
                />
                <button
                  type="submit"
                  disabled={fetchLoading || !searchAddr}
                  className="flex items-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold px-5 py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {fetchLoading ? <LoadingSpinner size={16} color="white" /> : <Search size={16} />}
                  Fetch
                </button>
              </form>
            </div>

            {fetchLoading && (
              <div className="flex justify-center py-12"><LoadingSpinner size={32} /></div>
            )}

            {fetchError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 text-sm font-medium">
                {fetchError}
              </div>
            )}

            {fetchedRecords !== null && !fetchLoading && (
              fetchedRecords.length === 0 ? (
                <EmptyState
                  message="No records found."
                  sub="This patient has no records, or you may not have access."
                />
              ) : (
                <div className="space-y-4">
                  {fetchedRecords.map((r, i) => (
                    <RecordCard key={`${r.id}-${i}`} record={r} />
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
