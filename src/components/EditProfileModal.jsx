import { useState, useEffect } from "react";
import { X, User, Stethoscope, Save } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import { useContract } from "../hooks/useContract";
import { dateInputToTimestamp } from "../utils/format";
import LoadingSpinner from "./LoadingSpinner";

function timestampToDateInput(ts) {
  if (!ts) return "";
  const ms = typeof ts === "bigint" ? Number(ts) * 1000 : Number(ts) * 1000;
  if (!ms) return "";
  const d = new Date(ms);
  return d.toISOString().split("T")[0];
}

export default function EditProfileModal({ onClose, onSaved }) {
  const { role, patientData, doctorData, refreshRole, loading } = useWeb3();
  const { call } = useContract();

  // Patient fields
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  // Doctor fields
  const [specialization, setSpecialization] = useState("");

  useEffect(() => {
    if (role === "patient" && patientData) {
      setName(patientData.name || "");
      setDob(timestampToDateInput(patientData.dateOfBirth));
    }
    if (role === "doctor" && doctorData) {
      setName(doctorData.name || "");
      setSpecialization(doctorData.specialization || "");
    }
  }, [role, patientData, doctorData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    let result;
    if (role === "patient") {
      const ts = dob ? dateInputToTimestamp(dob) : 0;
      result = await call(
        (c) => c.updatePatient(name.trim(), ts),
        "Profile updated!"
      );
    } else {
      if (!specialization.trim()) return;
      result = await call(
        (c) => c.updateDoctor(name.trim(), specialization.trim()),
        "Profile updated!"
      );
    }

    if (result?.success) {
      await refreshRole();
      onSaved?.();
      onClose();
    }
  };

  const inputClass =
    "w-full border border-border rounded-xl px-4 py-3 text-text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-text-main/20 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-card border border-border w-full max-w-md animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              role === "patient" ? "bg-pink/30" : "bg-sage/20"
            }`}>
              {role === "patient"
                ? <User size={20} className="text-rose-500" />
                : <Stethoscope size={20} className="text-sage-dark" />
              }
            </div>
            <div>
              <h2 className="font-bold text-text-main text-lg leading-tight">Edit Profile</h2>
              <p className="text-muted text-xs">
                {role === "patient" ? "Update your patient details" : "Update your doctor profile"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-text-main hover:bg-cream transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "patient" ? "Jane Doe" : "Dr. John Smith"}
              className={inputClass}
              required
            />
          </div>

          {role === "patient" && (
            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          {role === "doctor" && (
            <div>
              <label className="block text-sm font-semibold text-text-main mb-1.5">Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Cardiology, General Practice"
                className={inputClass}
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border text-muted font-semibold hover:bg-cream transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size={17} color="white" /> : <Save size={17} />}
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
