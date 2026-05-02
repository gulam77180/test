import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLayerGroup, FaClock, FaWrench, FaCheckCircle, FaTimesCircle, FaUserCog, FaCar, FaInfoCircle, FaCrown } from "react-icons/fa";

const API = "http://localhost/vehicle-service/api/";

// 🔥 MAX UI DASHBOARD COMPONENT
function UserDashboard({ history }) {
  const total = history.length;
  const pending = history.filter(h => h.status === "pending").length;
  const progress = history.filter(h => h.status === "progress").length;
  const completed = history.filter(h => h.status === "completed").length;

  const stats = [
    { label: "Total Bookings", value: total, icon: FaLayerGroup, bg: "from-neutral-800 to-neutral-900", glow: "group-hover:shadow-neutral-500/20", text: "text-white" },
    { label: "Pending", value: pending, icon: FaClock, bg: "from-gray-800 to-gray-900", glow: "group-hover:shadow-gray-500/20", text: "text-gray-400" },
    { label: "In Progress", value: progress, icon: FaWrench, bg: "from-yellow-900/40 to-black", glow: "group-hover:shadow-yellow-500/20", text: "text-yellow-400" },
    { label: "Completed", value: completed, icon: FaCheckCircle, bg: "from-green-900/40 to-black", glow: "group-hover:shadow-green-500/20", text: "text-green-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
          className={`group bg-gradient-to-br ${stat.bg} p-6 rounded-3xl border border-neutral-800 transition-all duration-300 hover:-translate-y-1 shadow-lg ${stat.glow} flex items-center justify-between`}
        >
          <div>
            <p className="text-neutral-500 text-sm font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className={`text-4xl font-black ${stat.text}`}>{stat.value}</h3>
          </div>
          <div className={`p-4 rounded-full bg-black/50 border border-neutral-800 ${stat.text}`}>
            <stat.icon size={24} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const user_id = user?.id || sessionStorage.getItem("user_id");

    if (!user_id) return;

    try {
      const res = await fetch(API + "getUserBookings.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id })
      });
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    await fetch(API + "cancelBooking.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: id })
    });
    fetchHistory();
  };

  const statusConfig = {
    pending: { color: "bg-gray-500", text: "text-gray-300", border: "border-gray-500/30", bg: "bg-gray-500/10", width: "25%", icon: FaClock },
    progress: { color: "bg-yellow-500", text: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/10", width: "66%", icon: FaWrench },
    completed: { color: "bg-green-500", text: "text-green-400", border: "border-green-500/30", bg: "bg-green-500/10", width: "100%", icon: FaCheckCircle },
    cancelled: { color: "bg-red-500", text: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10", width: "100%", icon: FaTimesCircle },
  };

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24 px-6 relative overflow-hidden font-sans selection:bg-red-600/30">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-4">
            Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">History</span>
          </h1>
          <p className="text-neutral-400 mt-2">Track the status and legacy of your vehicle's maintenance.</p>
        </motion.div>

        <UserDashboard history={history} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="col-span-full text-center py-20 text-neutral-500">Loading your history...</div>
            ) : history.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full flex flex-col items-center justify-center py-20 bg-neutral-900/20 border border-neutral-800 rounded-3xl">
                <FaCar size={60} className="text-neutral-700 mb-4" />
                <h3 className="text-2xl font-bold text-neutral-300">No Services Yet</h3>
                <p className="text-neutral-500">You haven't booked any services with us.</p>
              </motion.div>
            ) : (
              history.map((b, index) => {
                // 🔥 DETECTION LOGIC: Subscription check
                const isSub = b.service?.toLowerCase().includes("membership");
                
                const conf = isSub ? { 
                    color: "bg-emerald-500", 
                    text: "text-emerald-400", 
                    border: "border-emerald-500/30", 
                    bg: "bg-emerald-500/10", 
                    width: "100%", 
                    icon: FaCrown 
                } : (statusConfig[b.status] || statusConfig.pending);
                
                const StatusIcon = conf.icon;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={b.id}
                    className={`relative bg-neutral-900/40 backdrop-blur-sm p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden group flex flex-col
                      ${isSub ? "border-emerald-900/50 hover:border-emerald-500/50" : (b.status === "cancelled" ? "border-red-900/50 hover:border-red-600/50" : "border-neutral-800 hover:border-neutral-600")}
                    `}
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${conf.bg} to-transparent`}></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div>
                        <h3 className={`text-lg font-bold mb-1 leading-tight transition-colors ${isSub ? 'text-emerald-400' : 'text-white group-hover:text-red-400'}`}>
                          {b.service || "Standard Maintenance"}
                        </h3>
                        <p className="text-sm font-mono text-neutral-500 flex items-center gap-2">
                          <FaClock size={12}/> {b.created_at ? new Date(b.created_at).toLocaleString() : (b.date || "—")}
                        </p>
                      </div>

                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${conf.border} ${conf.bg} ${conf.text} text-xs font-bold uppercase tracking-wider`}>
                        <StatusIcon size={10} />
                        {isSub ? "Active" : b.status}
                      </div>
                    </div>

                    <div className="mb-5 relative z-10">
                      <div className="flex justify-between text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-2">
                        <span>{isSub ? "Payment" : "Booked"}</span>
                        <span>{isSub ? "Activated" : "Done"}</span>
                      </div>
                      <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${conf.color} ${b.status === "progress" ? "animate-pulse" : ""}`}
                          style={{ width: conf.width }}
                        />
                      </div>
                    </div>

                    {/* Subscription Special Info */}
                    {isSub && (
                        <div className="mb-4 relative z-10 bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3 shadow-inner">
                            <p className="text-[11px] text-emerald-300/80 leading-relaxed font-medium">
                                ✨ Your digital benefits are now active. Check your profile to see your new VIP status.
                            </p>
                        </div>
                    )}

                    {/* Cancelled Info */}
                    {b.status === "cancelled" && !isSub && (
                      <div className="mb-4 relative z-10 bg-red-950/40 border border-red-900/50 rounded-xl p-3.5 flex items-start gap-3 shadow-inner">
                        <div className="bg-red-500/20 p-2 rounded-lg text-red-400 shrink-0"><FaInfoCircle size={14} /></div>
                        <div>
                          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Refund Initiated</p>
                          <p className="text-[11px] text-red-300/80 leading-relaxed font-medium">Your refund will reflect within 3-5 days.</p>
                        </div>
                      </div>
                    )}

                    {/* ... Bottom Row (Mechanic & Action) ... */}
<div className="flex justify-between items-end relative z-10 mt-auto pt-2 border-t border-neutral-800/50">
  <div className="flex-1">
    {isSub ? (
        <p className="text-emerald-500/80 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
            <FaCheckCircle /> Annual Activation Active
        </p>
    ) : b.mechanic_name ? (
                          <div className="flex items-center gap-2 text-sm text-neutral-400">
                            <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-blue-400"><FaUserCog size={12} /></div>
                            <span className="font-medium">{b.mechanic_name}</span>
                          </div>
                        ) : b.status === "cancelled" ? (
                          <p className="text-red-500/80 text-xs font-medium flex items-center gap-1.5"><FaTimesCircle /> Cancelled</p>
                        ) : (
                          <p className="text-neutral-600 text-xs italic">Assigning mechanic...</p>
                        )}
                      </div>

                      {/* CANCEL BUTTON (Hidden for Subscriptions) */}
                      {b.status === "pending" && !isSub && (
                        <button
                          onClick={() => cancelBooking(b.id)}
                          className="text-xs bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all shadow-[0_0_10px_rgba(220,38,38,0)] hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}