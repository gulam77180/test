import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCrown } from "react-icons/fa";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaCar, 
  FaCamera, 
  FaSave, 
  FaIdBadge,
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaUpload
} from "react-icons/fa";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activePlan, setActivePlan] = useState("Free");
  
  const [user, setUser] = useState(null);
  
  // 🔥 Max UI Detailed Form State
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    profilePic: null, // Holds the uploaded image URL
    cars: [
      { id: Date.now(), model: "", plate: "" } // Array to hold multiple cars
    ]
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
  
    if (sessionUser) {
      setUser(sessionUser);
  
      // 🔥 FETCH PROFILE
      fetch("http://localhost/vehicle-service/api/getProfile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: sessionUser.id })
      })
      .then(res => res.json())
      // ... inside useEffect fetch call ...
.then(data => {
  if (data) {
    const savedCars = data.cars_json ? JSON.parse(data.cars_json) : 
                     (data.car_model ? [{ id: Date.now(), model: data.car_model, plate: data.license_plate }] : [{ id: Date.now(), model: "", plate: "" }]);

    setFormData({
      phone: data.phone || "",
      address: data.address || "",
      profilePic: data.profile_pic || null, // 🔥 FIX: data.profilePic ko data.profile_pic kar diya
      cars: savedCars 
    });
  }
})
      .catch(err => console.error("Error loading profile:", err));
    }
  }, []);

  // 🔥 HANDLE IMAGE UPLOAD (Local Preview)
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (file) {
    // Check file size (optional but recommended)
    if (file.size > 2000000) { // 2MB limit
      alert("Image too big! Max 2MB allowed.");
      return;
    }
    const base64 = await convertToBase64(file);
    setFormData({ ...formData, profilePic: base64 }); // 🔥 Ab asli data store ho raha hai
  }
};

  // 🔥 MULTIPLE CARS LOGIC
  const addCar = () => {
    setFormData({
      ...formData,
      cars: [...formData.cars, { id: Date.now(), model: "", plate: "" }]
    });
  };

  const removeCar = (id) => {
    setFormData({
      ...formData,
      cars: formData.cars.filter(car => car.id !== id)
    });
  };

  const updateCar = (id, field, value) => {
    const updatedCars = formData.cars.map(car => 
      car.id === id ? { ...car, [field]: value } : car
    );
    setFormData({ ...formData, cars: updatedCars });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
    if (!sessionUser) return;
  
    setIsSaving(true);
    setSaveMessage("");
  
    try {
      const res = await fetch("http://localhost/vehicle-service/api/saveProfile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: sessionUser.id,
          phone: formData.phone,
          address: formData.address,
          cars_json: JSON.stringify(formData.cars),
          profile_pic: formData.profilePic // 🔥 Ye asli base64 string jayegi
        })
      });
  
      const result = await res.json();
      if(result.success) {
        setSaveMessage("Profile updated successfully! ✅");
      }
    } catch (err) {
      console.error(err);
      setSaveMessage("Error saving profile ❌");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center font-sans">
        <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <FaUser className="text-red-500 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-neutral-500 mb-6">Please login to view your profile.</p>
        <button onClick={() => navigate("/login")} className="bg-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-500 transition-all">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 relative overflow-hidden font-sans selection:bg-red-600/30">
      
      {/* Background Glow Elements */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-neutral-800/30 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-white transition-colors">
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            Driver <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Profile</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* 🔥 LEFT COL: USER IDENTITY CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="lg:col-span-4"
          >
            <div className="bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 rounded-[2rem] p-8 text-center relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900"></div>

              {/* 🔥 AVATAR UPLOAD SYSTEM */}
              <input 
                type="file" 
                accept="image/*" 
                hidden 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
              />
              
              <div 
                className="relative w-36 h-36 mx-auto mb-6 cursor-pointer group"
                onClick={() => fileInputRef.current.click()}
              >
                <div className="absolute inset-0 bg-red-600 rounded-full blur-lg opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative w-full h-full bg-black border-2 border-neutral-700 rounded-full flex items-center justify-center overflow-hidden group-hover:border-red-500 transition-colors shadow-2xl">
                  {formData.profilePic ? (
                    <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-6xl text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                  )}
                  
                  {/* Hover Camera Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <FaCamera className="text-white text-2xl mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Upload</span>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-1">{user.name}</h2>
              
              {/* 🔥 Dynamic Membership Badge (YAHAN AAYEGA) */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-widest mb-6
                ${activePlan === "Platinum" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                  activePlan === "Gold" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                  activePlan === "Silver" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                  "bg-neutral-500/10 border-neutral-500/20 text-neutral-400"}
              `}>
                <FaCrown /> {activePlan} Member
              </div>

              {/* Upload Button visible outside for clarity */}

              {/* Upload Button visible outside for clarity */}
              <button 
                onClick={() => fileInputRef.current.click()}
                className="w-full flex items-center justify-center gap-2 py-3 mb-6 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-sm font-bold text-neutral-300 transition-colors"
              >
                <FaUpload /> Change Profile Photo
              </button>

              <div className="space-y-4 text-left border-t border-neutral-800 pt-6">
                <div className="flex items-center gap-3 text-neutral-400">
                  <FaEnvelope className="text-red-500 shrink-0" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <FaPhoneAlt className="text-red-500 shrink-0" />
                  <span className="text-sm">{formData.phone || "No phone added"}</span>
                </div>
                <div className="flex items-start gap-3 text-neutral-400">
                  <FaCar className="text-red-500 shrink-0 mt-1" />
                  <span className="text-sm">
                    {formData.cars[0]?.model ? `${formData.cars.length} Vehicle(s) Registered` : "No vehicles added"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 🔥 RIGHT COL: DETAILS & MULTIPLE CARS FORM */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-[2rem] p-8 md:p-10 shadow-2xl relative">
              
              <h3 className="text-2xl font-bold mb-8 text-white">Update Information</h3>

              <form onSubmit={handleSave} className="space-y-8">
                
                {/* Personal Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Phone Number</label>
                    <div className="relative flex items-center group">
                      <FaPhoneAlt className="absolute left-4 text-neutral-500 group-focus-within:text-red-500 transition-colors" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Full Address</label>
                    <div className="relative flex items-center group">
                      <FaMapMarkerAlt className="absolute left-4 text-neutral-500 group-focus-within:text-red-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="123 Street, City, State"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-700"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-neutral-800" />

                {/* 🔥 MULTIPLE CARS SECTION */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaCar className="text-red-500" /> Your Garage
                  </h4>
                  
                  <div className="space-y-4">
                    <AnimatePresence>
                      {formData.cars.map((car, index) => (
                        <motion.div 
                          key={car.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0, scale: 0.9 }}
                          className="bg-black/40 border border-neutral-800 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center group focus-within:border-red-600/50 transition-colors"
                        >
                          <div className="w-full md:w-1/2 space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Vehicle Make & Model</label>
                            <input
                              type="text"
                              placeholder="e.g. BMW M4 Competition"
                              value={car.model}
                              onChange={(e) => updateCar(car.id, "model", e.target.value)}
                              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 text-white placeholder-neutral-700"
                            />
                          </div>
                          <div className="w-full md:w-1/2 space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">License Plate</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="MH 04 AB 1234"
                                value={car.plate}
                                onChange={(e) => updateCar(car.id, "plate", e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 text-white placeholder-neutral-700 uppercase"
                              />
                              {formData.cars.length > 1 && (
                                <button 
                                  type="button" 
                                  onClick={() => removeCar(car.id)}
                                  className="px-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/20 rounded-xl transition-all"
                                  title="Remove Vehicle"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <button 
                    type="button"
                    onClick={addCar}
                    className="mt-4 w-full border-2 border-dashed border-neutral-700 hover:border-red-500 hover:text-red-500 text-neutral-400 py-4 rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <FaPlus /> Add Another Vehicle
                  </button>
                </div>

                {/* Save Area */}
                <div className="pt-6 border-t border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-auto">
                    <AnimatePresence>
                      {saveMessage && (
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-green-400 text-sm font-bold tracking-wide"
                        >
                          {saveMessage}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-red-600 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 transform active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : <><FaSave /> Save Changes</>}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}