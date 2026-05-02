import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaHome, FaArrowRight, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  
  // 🔥 Better UX: In-UI Status Message instead of alerts
  const [status, setStatus] = useState({ type: null, msg: "" }); 
  
  const navigate = useNavigate();

  const register = async (e) => {
    e?.preventDefault();
    
    if (!data.name || !data.email || !data.password) {
      setStatus({ type: "error", msg: "Please fill all fields to continue." });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: null, msg: "" });

      const res = await fetch("http://localhost/vehicle-service/api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log("REGISTER RESPONSE:", result);

      // ✅ HANDLE BOTH CASES
      if (result.success || result.message === "User Registered") {
        setStatus({ type: "success", msg: "Account created successfully! Redirecting..." });

        // 🔥 SMALL DELAY (UI smooth redirect)
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setStatus({ type: "error", msg: result.message || "Registration failed. Please try again." });
        setLoading(false);
      }

    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setStatus({ type: "error", msg: "Server error. Please check your connection." });
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center font-sans selection:bg-red-600/30 overflow-hidden">
      
      {/* 🔥 CINEMATIC BACKGROUND (Matching Login but slightly different vibe) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-neutral-900/80 to-black z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=2000&auto=format&fit=crop" 
          alt="Premium Engine Background" 
          className="w-full h-full object-cover opacity-30 scale-105 blur-[2px]"
        />
      </div>

      {/* 🔥 BACK TO HOME BUTTON */}
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
      >
        <FaHome className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Home</span>
      </motion.button>

      {/* 🔥 GLASSMORPHISM REGISTER CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="relative z-10 bg-neutral-950/60 backdrop-blur-2xl border border-neutral-800 p-10 md:p-12 rounded-[2rem] w-[90%] max-w-[450px] shadow-[0_0_50px_rgba(0,0,0,0.5)] group"
      >
        {/* Subtle red glow behind the card */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-red-600/20 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"></div>

        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🏎️</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">Join the Elite</h2>
          <p className="text-neutral-400 text-sm">Create an account to track and manage your services.</p>
        </div>

        {/* 🔥 DYNAMIC STATUS MESSAGE TOAST */}
        <AnimatePresence>
          {status.type && (
            <motion.div 
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium border ${
                status.type === "error" 
                  ? "bg-red-950/50 border-red-900 text-red-400" 
                  : "bg-green-950/50 border-green-900 text-green-400"
              }`}>
                {status.type === "error" ? <FaExclamationTriangle className="shrink-0" /> : <FaCheckCircle className="shrink-0" />}
                <p>{status.msg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={register} className="space-y-4">
          
          {/* NAME INPUT */}
          <div className="space-y-1.5 relative">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Full Name</label>
            <div className="relative flex items-center">
              <FaUser className="absolute left-4 text-neutral-500" />
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-700"
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
          </div>

          {/* EMAIL INPUT */}
          <div className="space-y-1.5 relative">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Email Address</label>
            <div className="relative flex items-center">
              <FaEnvelope className="absolute left-4 text-neutral-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-700"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-1.5 relative">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Password</label>
            <div className="relative flex items-center">
              <FaLock className="absolute left-4 text-neutral-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-700 tracking-widest"
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading || status.type === "success"}
            className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 transform active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] mt-6 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-red-600 disabled:hover:text-white"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Engine...
              </span>
            ) : status.type === "success" ? (
              "Registered!"
            ) : (
              <>
                <span>Create Account</span>
                <FaArrowRight />
              </>
            )}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-sm text-neutral-500 mt-8 text-center font-medium">
          Already have the keys?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-white hover:text-red-500 cursor-pointer transition-colors border-b border-transparent hover:border-red-500 pb-0.5"
          >
            Sign in here
          </span>
        </p>

      </motion.div>
    </div>
  );
}