import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaChartPie, FaTools, FaClipboardList, FaCarSide, FaSignOutAlt, 
  FaPlus, FaTrash, FaUserCog, FaCheckCircle, FaClock, FaWrench, 
  FaEdit, FaUsers, FaSearch, FaCrown, FaExclamationTriangle
} from "react-icons/fa";

const API = "http://localhost/vehicle-service/api/";

// 🔥 Helper function for safe JSON parsing
const safeParseBrands = (value) => {
  if (!value) return {};
  if (typeof value !== "string") return value || {};
  try { return JSON.parse(value); } catch { return {}; }
};

// 🔥 BRAND DATA FOR SERVICES
const brandData = [
  { name: "maruti", label: "Maruti Suzuki", models: ["Swift","WagonR","Baleno","Alto","Dzire","Brezza","Ertiga","Celerio","Ignis","XL6"] },
  { name: "hyundai", label: "Hyundai", models: ["i10","i20","Creta","Venue","Verna","Alcazar","Tucson","Aura","Elantra","Kona"] },
  { name: "honda", label: "Honda", models: ["City","Amaze","WR-V","Jazz","Civic","BR-V","CR-V","Accord","Elevate","Mobilio"] },
  { name: "tata", label: "Tata", models: ["Nexon","Punch","Harrier","Safari","Tiago","Tigor","Altroz","Hexa","Indica","Nano"] },
  { name: "ford", label: "Ford", models: ["EcoSport","Endeavour","Figo","Aspire","Freestyle","Fiesta","Mustang","Fusion","Escape","Explorer"] },
  { name: "volkswagen", label: "Volkswagen", models: ["Polo","Vento","Virtus","Taigun","Passat","Tiguan","Jetta","Beetle","Golf","Touareg"] },
  { name: "mahindra", label: "Mahindra", models: ["Scorpio","Thar","XUV300","XUV500","XUV700","Bolero","KUV100","Marazzo","Alturas","TUV300"] },
  { name: "toyota", label: "Toyota", models: ["Fortuner","Innova","Glanza","Urban Cruiser","Camry","Yaris","Corolla","Hilux","Vellfire","Land Cruiser"] },
  { name: "skoda", label: "Skoda", models: ["Rapid","Octavia","Superb","Kushaq","Slavia","Fabia","Yeti","Kodiaq","Laura","Citigo"] },
  { name: "bmw", label: "BMW", models: ["X1","X3","X5","3 Series","5 Series","7 Series","Z4","i4","i7","M4"] },
  { name: "renault", label: "Renault", models: ["Kwid","Triber","Duster","Kiger","Captur","Fluence","Lodgy","Pulse","Scala","Talisman"] }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // --- STATES ---
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [users, setUsers] = useState([]);
  const [allServices, setAllServices] = useState([]);
  
  // Search & Filter
  const [userSearch, setUserSearch] = useState("");
  const [category, setCategory] = useState("car");

  // Forms
  const [newMechanic, setNewMechanic] = useState({ name: "", skill: "", phone: "" });
  const [service, setService] = useState({ title: "", description: "", price: "", image: "", features: "", category: "car" });
  const [editingService, setEditingService] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState({});
  const [hoverBrand, setHoverBrand] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  // --- 🔥 LIVE DATA FETCHING (POLLING SYSTEM) ---
  const fetchAllData = async () => {
    try {
      const [bookRes, mechRes, servRes, userRes] = await Promise.all([
        fetch(API + "getBookings.php?t=" + Date.now()),
        fetch(API + "getMechanics.php?t=" + Date.now()),
        fetch(API + "getServices.php?t=" + Date.now()),
        fetch(API + "getUsers.php?t=" + Date.now())
      ]);

      setBookings(await bookRes.json());
      setMechanics(await mechRes.json());
      setAllServices(await servRes.json());
      
      const userData = await userRes.json();
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      console.error("Live Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchAllData(); // Initial load
    const intervalId = setInterval(fetchAllData, 3000); // 🔥 Update every 3 seconds!
    return () => clearInterval(intervalId); // Cleanup
  }, []);

  // --- ACTIONS ---
  const logout = () => { sessionStorage.clear(); navigate("/login"); };

  // Mechanic Actions
  const addMechanic = async () => {
    if (!newMechanic.name || !newMechanic.skill || !newMechanic.phone) return alert("Fill all fields");
    await fetch(API + "addMechanic.php", {
      method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(newMechanic)
    });
    setNewMechanic({ name: "", skill: "", phone: "" });
    fetchAllData();
  };

  const deleteMechanic = async (id) => {
    if (!window.confirm("Delete mechanic?")) return;
    await fetch(API + "deleteMechanic.php", {
      method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ id })
    });
    fetchAllData();
  };

  // Assignment Actions
  const assignMechanic = async (bookingId, mechanicId) => {
    if (!mechanicId) return;
    await fetch(API + "assignMechanic.php", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: bookingId, mechanic_id: mechanicId, status: "progress" })
    });
    fetchAllData();
  };

  const markCompleted = async (bookingId) => {
    await fetch(API + "updateStatus.php", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: bookingId, status: "completed" })
    });
    fetchAllData();
  };

  // Service Actions (With 0 Price Protection)
  const handleAddService = async () => {
    if (!service.title || !service.price || !service.features) return alert("Fill required fields");
    if (Number(service.price) <= 0) return alert("Price cannot be 0 or less!"); // 🔥 Protection

    const featuresArray = service.features.split(",").map(f => f.trim());
    const res = await fetch(API + "addService.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...service, features: featuresArray, supported_brands: JSON.stringify(selectedBrands) }),
    });
    const data = await res.json();
    if(data.success) { 
        setService({ title: "", description: "", price: "", image: "", features: "", category: category });
        setSelectedBrands({});
        fetchAllData(); 
    }
  };

  const handleUpdateService = async () => {
    if (Number(service.price) <= 0) return alert("Price cannot be 0 or less!"); // 🔥 Protection
    
    const featuresArray = service.features.split(",").map(f => f.trim());
    const res = await fetch(API + "updateService.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...service, id: editingService.id, features: featuresArray, supported_brands: JSON.stringify(selectedBrands) }),
    });
    const data = await res.json();
    if(data.success) {
      setEditingService(null);
      setService({ title: "", description: "", price: "", image: "", features: "", category: "car" });
      setSelectedBrands({});
      fetchAllData();
    }
  };

  // 🔥 Fix: Delete Service (For 0 Value cleanup)
  const deleteService = async (id) => {
    if(!window.confirm("Permanently delete this service?")) return;
    await fetch(API + "deleteService.php", {
      method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ id })
    });
    fetchAllData();
  };

  // User Management Actions
  const updateUserMembership = async (userId, newPlan) => {
    await fetch(API + "saveSubscription.php", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, plan_name: newPlan, price: 0 })
    });
    fetchAllData();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Permanent delete this user and their data?")) return;
    try {
      const res = await fetch(API + "deleteUser.php", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id })
      });
      const result = await res.json();
      if (result.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id)); // Optimistic UI update
        fetchAllData(); 
      } else { alert("Error: " + (result.error || result.message)); }
    } catch (err) { console.error("Delete call failed:", err); }
  };

  // Helpers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FaChartPie },
    { id: "users", label: "Users", icon: FaUsers },
    { id: "mechanics", label: "Mechanics", icon: FaUserCog },
    { id: "services", label: "Services", icon: FaTools },
    { id: "assignments", label: "Assignments", icon: FaClipboardList }
  ];

  const categories = [
    { name: "Car Services", key: "car" }, { name: "Batteries", key: "battery" }, { name: "Wheel & Tyres", key: "tyres" },
    { name: "Denting & Painting", key: "denting" }, { name: "Cleaning & Car Spa", key: "spa" },
    { name: "Car Inspections", key: "inspection" }, { name: "Insurance Claims", key: "insurance" }
  ];

  // Animation Variants
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505] text-white flex font-sans selection:bg-red-600/30 overflow-hidden">

      {/* 🔥 ADVANCED GLASS SIDEBAR */}
      <div className="w-72 bg-neutral-950/60 backdrop-blur-3xl border-r border-neutral-900/50 flex flex-col justify-between h-screen sticky top-0 z-50 shadow-[10px_0_40px_rgba(0,0,0,0.8)]">
        <div className="p-8">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-800 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)] border border-red-500/50">
              <FaCarSide className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-lg">Auto<span className="text-red-500">Admin</span></h1>
          </motion.div>
          <div className="space-y-3">
            {navItems.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-300 relative overflow-hidden group ${activeTab === tab.id ? "text-white shadow-[0_0_20px_rgba(220,38,38,0.15)]" : "text-neutral-500 hover:text-white hover:bg-white/5"}`}
              >
                {activeTab === tab.id && <motion.div layoutId="activeNav" className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent border-l-4 border-red-500 -z-10" />}
                <tab.icon size={20} className={activeTab === tab.id ? "text-red-500" : "text-neutral-600 group-hover:text-neutral-400 transition-colors"} />
                <span className="tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-8 border-t border-neutral-900/50">
          <button onClick={logout} className="w-full flex items-center justify-center gap-3 bg-neutral-900/50 hover:bg-red-600 text-neutral-400 hover:text-white px-4 py-4 rounded-2xl font-bold transition-all duration-300 border border-neutral-800 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] group">
            <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" /> Logout
          </button>
        </div>
      </div>

      {/* 🔥 MAIN CONTENT AREA */}
      <div className="flex-1 h-screen overflow-y-auto custom-scrollbar p-10 relative">
        {/* Dynamic Background Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-red-900/10 blur-[180px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-900/5 blur-[150px] rounded-full pointer-events-none"></div>

        <AnimatePresence mode="wait">
          
          {/* ================= DASHBOARD ================= */}
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }} className="space-y-10 relative z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-5xl font-black tracking-tight drop-shadow-md">System <span className="text-red-500">Status</span></h2>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Sync Active
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {[
                  { title: "Active Bookings", value: bookings.length, icon: FaClipboardList, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
                  { title: "Total Users", value: users.length, icon: FaUsers, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
                  { title: "Mechanics", value: mechanics.length, icon: FaUserCog, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
                  { title: "Services", value: allServices.length, icon: FaTools, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" }
                ].map((stat, i) => (
                  <motion.div variants={itemVariants} key={i} className={`bg-neutral-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border ${stat.border} flex items-center justify-between hover:-translate-y-2 transition-transform duration-300 shadow-2xl group`}>
                    <div>
                      <p className="text-neutral-500 font-black uppercase text-[10px] tracking-widest mb-2 group-hover:text-neutral-300 transition-colors">{stat.title}</p>
                      <h3 className="text-6xl font-black drop-shadow-lg">{stat.value}</h3>
                    </div>
                    <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform`}><stat.icon /></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= USERS MANAGEMENT ================= */}
          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-5xl font-black tracking-tight">Member <span className="text-red-500">Database</span></h2>
                <div className="relative w-80 group">
                  <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-red-500 transition-colors" />
                  <input placeholder="Search name or email..." className="w-full pl-14 pr-4 py-4 bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all text-sm font-medium shadow-xl" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                </div>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-[2rem] shadow-2xl backdrop-blur-xl overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-neutral-900/80 border-b border-neutral-800 text-neutral-500 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-8 py-6 rounded-tl-[2rem]">User Profile</th>
                      <th className="px-8 py-6">Contact Details</th>
                      <th className="px-8 py-6">Active Tier</th>
                      <th className="px-8 py-6 text-right rounded-tr-[2rem]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    <AnimatePresence>
                      {users.filter(u => (u.name || "").toLowerCase().includes(userSearch.toLowerCase()) || (u.email || "").toLowerCase().includes(userSearch.toLowerCase())).map((u) => (
                        <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={u.id} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center font-black text-xl text-neutral-400 group-hover:text-red-500 group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all uppercase">
                                {u.name ? u.name.charAt(0) : u.email.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-white text-base mb-1">{u.name || "Unknown User"}</p>
                                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">UID: #{u.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-bold text-neutral-300 mb-1">{u.email}</p>
                            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-2"><FaClock size={10}/> {u.phone || "No Phone"}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                              ${u.plan_name === "Platinum" ? "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : u.plan_name === "Gold" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]" : u.plan_name === "Silver" ? "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-neutral-800 border-neutral-700 text-neutral-500"}
                            `}>
                              <FaCrown size={12} /> {u.plan_name || "Free"}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button onClick={() => deleteUser(u.id)} className="w-10 h-10 bg-neutral-800/50 hover:bg-red-600 text-neutral-500 hover:text-white rounded-xl inline-flex items-center justify-center transition-all border border-neutral-700 hover:border-red-500 shadow-lg group/btn ml-auto" title="Delete User">
                              <FaTrash size={14} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ================= MECHANICS ================= */}
          {activeTab === "mechanics" && (
            <motion.div key="mechanics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative z-10">
              <h2 className="text-5xl font-black tracking-tight">Crew <span className="text-red-500">Registry</span></h2>
              <div className="grid xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1">
                  <div className="bg-neutral-900/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-neutral-800 shadow-2xl sticky top-10">
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><div className="p-2 bg-red-500/20 rounded-lg text-red-500"><FaPlus size={16}/></div> Recruit Mechanic</h3>
                    <div className="space-y-5">
                      <input placeholder="Mechanic Name" className="w-full p-4 bg-black/50 border border-neutral-800 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-sm font-medium transition-all" value={newMechanic.name} onChange={(e)=>setNewMechanic({...newMechanic,name:e.target.value})} />
                      <input placeholder="Core Skill (e.g. Engine Master)" className="w-full p-4 bg-black/50 border border-neutral-800 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-sm font-medium transition-all" value={newMechanic.skill} onChange={(e)=>setNewMechanic({...newMechanic,skill:e.target.value})} />
                      <input placeholder="Contact Phone" className="w-full p-4 bg-black/50 border border-neutral-800 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-sm font-medium transition-all" value={newMechanic.phone} onChange={(e)=>setNewMechanic({...newMechanic,phone:e.target.value})} />
                      <button onClick={addMechanic} className="w-full py-4 mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] active:scale-95">Initialize Deployment</button>
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-2 grid md:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {mechanics.map((m) => (
                      <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={m.id} className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-[2rem] flex items-center justify-between group hover:border-neutral-600 hover:bg-neutral-900/80 transition-all backdrop-blur-md shadow-xl">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-center text-2xl font-black text-neutral-500 group-hover:text-red-500 group-hover:border-red-500/50 transition-all uppercase shadow-inner">{m.name.charAt(0)}</div>
                          <div>
                            <h4 className="font-bold text-xl leading-none mb-2 text-white">{m.name}</h4>
                            <p className="text-[10px] text-red-500 font-black uppercase tracking-widest px-2 py-1 bg-red-500/10 rounded-md inline-block">{m.skill}</p>
                          </div>
                        </div>
                        <button onClick={()=>deleteMechanic(m.id)} className="w-12 h-12 bg-neutral-950 hover:bg-red-600 text-neutral-500 hover:text-white rounded-xl flex items-center justify-center transition-all border border-neutral-800 hover:border-red-500 shadow-lg group/btn"><FaTrash className="group-hover/btn:scale-110 transition-transform"/></button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= SERVICES ================= */}
          {activeTab === "services" && (
            <motion.div key="services" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <h2 className="text-5xl font-black tracking-tight">Service <span className="text-red-500">Catalog</span></h2>
                <button onClick={() => setShowAllServices(!showAllServices)} className="bg-neutral-900/80 hover:bg-white text-neutral-300 hover:text-black px-8 py-3.5 rounded-xl font-black transition-all border border-neutral-700 hover:border-white uppercase tracking-widest text-xs shadow-xl active:scale-95 flex items-center gap-2">
                  <FaClipboardList size={16}/> {showAllServices ? "Hide Database" : "Explore Database"}
                </button>
              </div>

              <div className="flex flex-wrap gap-3 overflow-x-auto pb-4 custom-scrollbar">
                {categories.map(cat => (
                  <button key={cat.key} onClick={() => { setCategory(cat.key); setService(prev => ({ ...prev, category: cat.key })); }} className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border ${category === cat.key ? "bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]" : "bg-neutral-900/60 text-neutral-500 border-neutral-800 hover:border-neutral-600 hover:text-white backdrop-blur-md"}`}>
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="grid xl:grid-cols-3 gap-8">
                {/* ADD/EDIT FORM */}
                <div className={`${showAllServices ? 'xl:col-span-2' : 'xl:col-span-3'} bg-neutral-900/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-neutral-800 shadow-2xl transition-all duration-500`}>
                  <h3 className="text-3xl font-black mb-8 flex items-center gap-3">
                    {editingService ? <><div className="p-2 bg-red-500/20 rounded-lg text-red-500"><FaEdit size={20}/></div> Modify Protocol</> : <><div className="p-2 bg-red-500/20 rounded-lg text-red-500"><FaPlus size={20}/></div> New Service Protocol</>}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input placeholder="Service Title" className="p-4 bg-black/60 border border-neutral-800 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-medium outline-none" value={service.title} onChange={(e)=>setService({...service,title:e.target.value})} />
                    <input type="number" placeholder="Market Price (₹)" className="p-4 bg-black/60 border border-neutral-800 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-medium outline-none" value={service.price} onChange={(e)=>setService({...service,price:e.target.value})} />
                    <input placeholder="Public Image URL" className="p-4 bg-black/60 border border-neutral-800 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-medium outline-none md:col-span-2" value={service.image} onChange={(e)=>setService({...service,image:e.target.value})} />
                    <textarea placeholder="Service Description..." rows="3" className="p-4 bg-black/60 border border-neutral-800 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-medium outline-none md:col-span-2 resize-none" value={service.description} onChange={(e)=>setService({...service,description:e.target.value})} />
                    <input placeholder="Key Features (Comma separated)" className="p-4 bg-black/60 border border-neutral-800 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-medium outline-none md:col-span-2" value={service.features} onChange={(e)=>setService({...service,features:e.target.value})} />

                    <div className="md:col-span-2 relative z-[60]">
                      <div onClick={() => setShowDropdown(!showDropdown)} className="p-5 bg-black/60 border border-neutral-800 rounded-xl cursor-pointer hover:border-red-500 hover:bg-neutral-900 transition-all flex justify-between items-center group">
                        <span className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors">
                          {Object.keys(selectedBrands).length === 0 ? "Assign Compatible Vehicle Models" : Object.keys(selectedBrands).filter(k => isNaN(k)).join(", ")}
                        </span>
                        <span className="text-neutral-600 group-hover:text-red-500 transition-colors">▼</span>
                      </div>
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} ref={dropdownRef} className="absolute bottom-full left-0 mb-4 w-full bg-neutral-950/95 border border-neutral-800 rounded-2xl shadow-[0_-10px_50px_rgba(0,0,0,0.9)] flex overflow-hidden h-80 z-[100] backdrop-blur-3xl">
                            <div className="w-1/2 border-r border-neutral-800/50 overflow-y-auto custom-scrollbar">
                              {brandData.map(b => (
                                <div key={b.name} onMouseEnter={() => setHoverBrand(b.name)} className={`p-4 cursor-pointer font-black text-xs uppercase tracking-widest transition-colors ${hoverBrand === b.name ? "bg-red-600/10 text-red-500 border-l-4 border-red-500" : "text-neutral-500 hover:bg-neutral-900 hover:text-white border-l-4 border-transparent"}`}>
                                  {b.label}
                                </div>
                              ))}
                            </div>
                            <div className="w-1/2 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-black/40">
                              {hoverBrand && (() => {
                                const models = brandData.find(b => b.name === hoverBrand)?.models || [];
                                return (
                                  <>
                                    <label className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer mb-3 hover:border-neutral-600 transition-colors">
                                      <input type="checkbox" className="w-4 h-4 accent-red-600" onChange={(e) => {
                                        const updated = { ...selectedBrands };
                                        if (e.target.checked) updated[hoverBrand] = [...models];
                                        else delete updated[hoverBrand];
                                        setSelectedBrands(updated);
                                      }} />
                                      <span className="text-[10px] font-black uppercase text-white tracking-widest">Toggle All Models</span>
                                    </label>
                                    {models.map(m => (
                                      <label key={m} className="flex items-center gap-3 p-2.5 hover:bg-neutral-900/80 rounded-lg cursor-pointer transition-colors group">
                                        <input type="checkbox" className="w-4 h-4 accent-red-600" checked={selectedBrands[hoverBrand]?.includes(m) || false} onChange={(e) => {
                                          const updated = { ...selectedBrands };
                                          if (!updated[hoverBrand]) updated[hoverBrand] = [];
                                          if (e.target.checked) updated[hoverBrand].push(m);
                                          else {
                                            updated[hoverBrand] = updated[hoverBrand].filter(x => x !== m);
                                            if (updated[hoverBrand].length === 0) delete updated[hoverBrand];
                                          }
                                          setSelectedBrands(updated);
                                        }} />
                                        <span className="text-sm font-medium text-neutral-400 group-hover:text-white transition-colors">{m}</span>
                                      </label>
                                    ))}
                                  </>
                                );
                              })()}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <button onClick={editingService ? handleUpdateService : handleAddService} className="w-full py-5 mt-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-black uppercase tracking-[0.15em] transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] active:scale-95">
                    {editingService ? "Confirm Modifications" : "Deploy New Protocol"}
                  </button>
                </div>

                {/* SERVICE LIST (CATALOG) - Added Delete Fix for 0 Value Services */}
                <AnimatePresence>
                  {showAllServices && (
                    <motion.div initial={{ opacity: 0, x: 20, width: 0 }} animate={{ opacity: 1, x: 0, width: "auto" }} exit={{ opacity: 0, x: 20, width: 0 }} className="xl:col-span-1">
                      <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-[2.5rem] h-[700px] overflow-y-auto custom-scrollbar backdrop-blur-2xl shadow-2xl relative">
                        <div className="sticky top-0 bg-neutral-950/80 backdrop-blur-md pt-2 pb-6 z-10 border-b border-neutral-800/50 mb-4">
                           <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">Database Engine</h3>
                           <p className="text-2xl font-black text-white mt-1">{category}</p>
                        </div>
                        <div className="space-y-4">
                          <AnimatePresence>
                            {allServices.filter(s => category === "car" ? (!s.category || s.category === "car") : s.category === category).map((s) => {
                              const isZeroPrice = Number(s.price) <= 0;
                              return (
                                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={s.id} className={`bg-black/40 border ${isZeroPrice ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-neutral-800'} p-5 rounded-2xl flex justify-between items-center group hover:border-red-500/50 transition-all`}>
                                  <div className="overflow-hidden pr-3">
                                    <span className={`font-bold text-sm block truncate transition-colors ${isZeroPrice ? 'text-orange-400' : 'text-neutral-300 group-hover:text-white'}`}>{s.title}</span>
                                    {isZeroPrice && <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1 mt-1"><FaExclamationTriangle/> Invalid Price (0)</span>}
                                  </div>
                                  <div className="flex gap-2 shrink-0">
                                    <button onClick={() => {
                                      setEditingService(s);
                                      setService({ ...s, features: Array.isArray(s.features) ? s.features.join(",") : (s.features || "") });
                                      setSelectedBrands(safeParseBrands(s.supported_brands));
                                    }} className="w-8 h-8 bg-neutral-800 hover:bg-white text-neutral-400 hover:text-black rounded-lg flex items-center justify-center transition-colors" title="Edit">
                                      <FaEdit size={12}/>
                                    </button>
                                    <button onClick={() => deleteService(s.id)} className="w-8 h-8 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg flex items-center justify-center transition-colors border border-red-500/20" title="Delete Cleanup">
                                      <FaTrash size={12}/>
                                    </button>
                                  </div>
                                </motion.div>
                              )
                            })}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ================= ASSIGNMENTS ================= */}
          {activeTab === "assignments" && (
            <motion.div key="assignments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative z-10">
              <h2 className="text-5xl font-black tracking-tight">Active <span className="text-red-500">Operations</span></h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {bookings.filter(b => b.status !== "cancelled").map((b) => {
                    const assignedMechanic = mechanics.find((m) => Number(m.id) === Number(b.mechanic_id));
                    const isPending = b.status === "pending";
                    const isProgress = b.status === "progress";

                    return (
                      <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={b.id} className="relative bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col group hover:border-neutral-600 transition-all hover:-translate-y-1">
                        <div className={`absolute top-0 left-0 w-full h-2 rounded-t-[2.5rem] ${isPending ? "bg-neutral-600" : isProgress ? "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]" : "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"}`} />
                        <div className="flex justify-between items-start mb-8 pt-2">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-red-500 transition-colors">{b.service}</h3>
                            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-lg inline-block border border-neutral-800">{b.name}</p>
                          </div>
                          <span className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border ${isPending ? "bg-neutral-800/80 border-neutral-700 text-neutral-400" : isProgress ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-500 animate-pulse" : "bg-emerald-500/20 border-emerald-500/40 text-emerald-500"}`}>
                            {isPending ? "Standby" : isProgress ? "Live" : "Done"}
                          </span>
                        </div>
                        <div className="mt-auto pt-6 border-t border-neutral-800/60 relative">
                          {!assignedMechanic ? (
                            <div className="relative">
                              <select onChange={(e) => assignMechanic(b.id, e.target.value)} className="w-full appearance-none bg-black/60 border border-neutral-700 hover:border-red-500 text-white px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer shadow-inner">
                                <option value="">Deploy Mechanic Unit</option>
                                {mechanics.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.skill})</option>)}
                              </select>
                              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-xs">▼</div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center bg-black/30 p-4 rounded-2xl border border-neutral-800/50">
                              <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]" />
                                <div>
                                  <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest mb-0.5">Assigned To</p>
                                  <p className="text-xs font-black text-white uppercase tracking-wider">{assignedMechanic.name}</p>
                                </div>
                              </div>
                              {isProgress && (
                                <button onClick={() => markCompleted(b.id)} className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-500 hover:text-black border border-emerald-500/40 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">Mission Complete</button>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Global Scrollbar Styles */}
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #262626; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #ef4444; }
      `}</style>
    </div>
  );
}