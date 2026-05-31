import { useState } from "react";
import { User, Stethoscope, ArrowLeft } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import { useContract } from "../hooks/useContract";
import { dateInputToTimestamp } from "../utils/format";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";

export default function Register() {
  const { loading, refreshRole } = useWeb3();
  const { call } = useContract();
  const [selectedRole, setSelectedRole] = useState(null); // "patient" | "doctor"

  // Patient form state
  const [patientName, setPatientName] = useState("");
  const [dob, setDob] = useState("");

  // Doctor form state
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!patientName.trim() || !dob) return;
    const ts = dateInputToTimestamp(dob);
    const result = await call(
      (c) => c.registerPatient(patientName.trim(), ts),
      "Registered as patient!"
    );
    if (result.success) await refreshRole();
  };

  const handleRegisterDoctor = async (e) => {
    e.preventDefault();
    if (!doctorName.trim() || !specialization.trim()) return;
    const result = await call(
      (c) => c.registerDoctor(doctorName.trim(), specialization.trim()),
      "Registered as doctor!"
    );
    if (result.success) await refreshRole();
  };

  const inputClass =
    "w-full border border-border rounded-xl px-4 py-3 text-text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all bg-white";
  const btnClass =
    "w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-text-main text-center mb-2">Join Medi-Chain</h1>
        <p className="text-muted text-center mb-10">Create your on-chain identity to get started.</p>

        {!selectedRole ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Patient card */}
            <button
              onClick={() => setSelectedRole("patient")}
              className="group bg-white border-2 border-border hover:border-sage rounded-3xl p-8 text-center transition-all hover:shadow-card hover:-translate-y-0.5"
            >
              <div className="w-16 h-16 rounded-2xl bg-pink/30 group-hover:bg-pink/50 flex items-center justify-center mx-auto mb-4 transition-colors">
                <User size={32} className="text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-text-main mb-2">I'm a Patient</h2>
              <p className="text-muted text-sm">
                Register to securely store and share your medical records.
              </p>
            </button>

            {/* Doctor card */}
            <button
              onClick={() => setSelectedRole("doctor")}
              className="group bg-white border-2 border-border hover:border-sage rounded-3xl p-8 text-center transition-all hover:shadow-card hover:-translate-y-0.5"
            >
              <div className="w-16 h-16 rounded-2xl bg-sage/20 group-hover:bg-sage/40 flex items-center justify-center mx-auto mb-4 transition-colors">
                <Stethoscope size={32} className="text-sage-dark" />
              </div>
              <h2 className="text-xl font-bold text-text-main mb-2">I'm a Doctor</h2>
              <p className="text-muted text-sm">
                Register to add and view medical records for your patients.
              </p>
            </button>
          </div>
        ) : (
          <div className="bg-white border border-border rounded-3xl shadow-soft p-8 animate-slide-up">
            <button
              onClick={() => setSelectedRole(null)}
              className="flex items-center gap-1.5 text-muted hover:text-text-main text-sm mb-6 transition-colors"
            >
              <ArrowLeft size={15} />
              Back
            </button>

            {selectedRole === "patient" ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-pink/30 flex items-center justify-center">
                    <User size={20} className="text-rose-500" />
                  </div>
                  <h2 className="text-xl font-bold text-text-main">Patient Registration</h2>
                </div>
                <form onSubmit={handleRegisterPatient} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Jane Doe"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className={btnClass}>
                    {loading ? <LoadingSpinner size={18} color="white" /> : <User size={17} />}
                    {loading ? "Registering…" : "Register as Patient"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center">
                    <Stethoscope size={20} className="text-sage-dark" />
                  </div>
                  <h2 className="text-xl font-bold text-text-main">Doctor Registration</h2>
                </div>
                <form onSubmit={handleRegisterDoctor} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="Dr. John Smith"
                      className={inputClass}
                      required
                    />
                  </div>
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
                  <button type="submit" disabled={loading} className={btnClass}>
                    {loading ? <LoadingSpinner size={18} color="white" /> : <Stethoscope size={17} />}
                    {loading ? "Registering…" : "Register as Doctor"}
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
