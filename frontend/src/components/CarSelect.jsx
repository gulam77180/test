import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaChevronLeft, FaCheck } from "react-icons/fa";

/* 🔥 IMPORTS */
import maruti from "../assets/brands/maruti.png";
import hyundai from "../assets/brands/hyundai.png";
import honda from "../assets/brands/honda.png";
import tata from "../assets/brands/tata.png";
import ford from "../assets/brands/ford.png";
import vw from "../assets/brands/volkswagen.png";
import mahindra from "../assets/brands/mahindra.png";
import toyota from "../assets/brands/toyota.png";
import skoda from "../assets/brands/skoda.png";
import bmw from "../assets/brands/bmw.png";
import renault from "../assets/brands/renault.png";

/* 🔥 DATA */
const brands = [
  { name: "Maruti Suzuki", logo: maruti, models: ["Swift","WagonR","Baleno","Alto","Dzire","Brezza","Ertiga","Celerio","Ignis","XL6"] },
  { name: "Hyundai", logo: hyundai, models: ["i10","i20","Creta","Venue","Verna","Alcazar","Tucson","Aura","Elantra","Kona"] },
  { name: "Honda", logo: honda, models: ["City","Amaze","WR-V","Jazz","Civic","BR-V","CR-V","Accord","Elevate","Mobilio"] },
  { name: "Tata", logo: tata, models: ["Nexon","Punch","Harrier","Safari","Tiago","Tigor","Altroz","Hexa","Indica","Nano"] },
  { name: "Ford", logo: ford, models: ["EcoSport","Endeavour","Figo","Aspire","Freestyle","Fiesta","Mustang","Fusion","Escape","Explorer"] },
  { name: "Volkswagen", logo: vw, models: ["Polo","Vento","Virtus","Taigun","Passat","Tiguan","Jetta","Beetle","Golf","Touareg"] },
  { name: "Mahindra", logo: mahindra, models: ["Scorpio","Thar","XUV300","XUV500","XUV700","Bolero","KUV100","Marazzo","Alturas","TUV300"] },
  { name: "Toyota", logo: toyota, models: ["Fortuner","Innova","Glanza","Urban Cruiser","Camry","Yaris","Corolla","Hilux","Vellfire","Land Cruiser"] },
  { name: "Skoda", logo: skoda, models: ["Rapid","Octavia","Superb","Kushaq","Slavia","Fabia","Yeti","Kodiaq","Laura","Citigo"] },
  { name: "BMW", logo: bmw, models: ["X1","X3","X5","3 Series","5 Series","7 Series","Z4","i4","i7","M4"] },
  { name: "Renault", logo: renault, models: ["Kwid","Triber","Duster","Kiger","Captur","Fluence","Lodgy","Pulse","Scala","Talisman"] }
];

export default function CarSelect({ highlight, onSelectionComplete }) {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Check storage on mount
  useEffect(() => {
    const savedCar = JSON.parse(localStorage.getItem("selectedCar"));
    if (savedCar && savedCar.brand && savedCar.model) {
      const brandObj = brands.find(b => b.name === savedCar.brand);
      if (brandObj) {
        setSelectedBrand(brandObj);
        setSelectedModel(savedCar.model);
      }
    }
  }, []);

  // Filtering Logic
  const filteredBrands = brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredModels = selectedBrand 
    ? selectedBrand.models.filter(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleReset = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSearchTerm("");
    localStorage.removeItem("selectedCar");
    window.dispatchEvent(new Event("showAllServices"));
  };

  const handleModelSelect = (m) => {
    setSelectedModel(m);
    localStorage.setItem("selectedCar", JSON.stringify({
      brand: selectedBrand.name,
      model: m
    }));
    
    // Call the prop if it exists (for Pricing.jsx integration)
    if (onSelectionComplete) {
      onSelectionComplete();
    }
  };

  // 🔥 Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div
      id="car-select"
      className={`relative bg-neutral-950/80 backdrop-blur-2xl p-6 rounded-[2rem] border transition-all duration-500 w-full overflow-hidden text-white
      ${highlight ? "border-red-500 shadow-[0_0_40px_rgba(220,38,38,0.4)]" : "border-neutral-800 shadow-2xl"}`}
    >
      {/* Subtle Glow inside the box */}
      <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-red-600/10 blur-[50px] rounded-full pointer-events-none -z-10"></div>

      {/* 🔥 HEADER */}
      <div className="flex items-center mb-6 relative z-10">
        {selectedBrand && (
          <button
            onClick={handleReset}
            className="w-8 h-8 mr-3 bg-neutral-900 hover:bg-red-600 border border-neutral-800 hover:border-red-500 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-all"
            title="Back to Brands"
          >
            <FaChevronLeft size={12} />
          </button>
        )}
        <h2 className="text-xl font-bold tracking-tight">
          {selectedBrand ? (
            <>Select <span className="text-red-500">{selectedBrand.name}</span> Model</>
          ) : (
            <>Select <span className="text-red-500">Manufacturer</span></>
          )}
        </h2>
      </div>

      {/* 🔥 SEARCH BAR (Now Fully Functional) */}
      <div className="relative mb-6 z-10">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={selectedBrand ? `Search ${selectedBrand.name} models...` : "Search brands..."}
          className="w-full pl-11 pr-4 py-3 bg-black border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-600 text-sm"
        />
      </div>

      <AnimatePresence mode="wait">
        {/* 🔥 BRANDS GRID */}
        {!selectedBrand && (
          <motion.div 
            key="brands"
            variants={containerVariants}
            initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-3 gap-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar relative z-10"
          >
            {filteredBrands.map((b, i) => (
              <motion.div
                variants={itemVariants}
                key={i}
                onClick={() => { setSelectedBrand(b); setSearchTerm(""); }}
                className="group cursor-pointer flex flex-col items-center justify-center p-3 bg-gradient-to-b from-neutral-800/40 to-neutral-900/40 border border-neutral-800/80 rounded-2xl hover:border-red-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white rounded-xl p-1.5 flex items-center justify-center mb-2 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors text-center w-full truncate">
                  {b.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 🔥 MODELS GRID */}
        {selectedBrand && (
          <motion.div 
            key="models"
            variants={containerVariants}
            initial="hidden" animate="visible" exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar relative z-10"
          >
            {filteredModels.map((m, i) => {
              const isSelected = selectedModel === m;
              return (
                <motion.div
                  variants={itemVariants}
                  key={i}
                  onClick={() => handleModelSelect(m)}
                  className={`relative cursor-pointer p-4 rounded-xl text-sm font-bold transition-all duration-300 border flex items-center justify-between
                    ${isSelected 
                      ? "bg-gradient-to-r from-red-600 to-red-800 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
                      : "bg-black border-neutral-800 hover:border-red-500/50 hover:bg-neutral-900 text-neutral-300"
                    }`}
                >
                  <span className="truncate pr-2">{m}</span>
                  {isSelected && <FaCheck className="shrink-0 text-white" size={12} />}
                </motion.div>
              );
            })}
            
            {filteredModels.length === 0 && (
              <div className="col-span-2 text-center py-8 text-neutral-500 text-sm">
                No models found matching "{searchTerm}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for custom scrollbar strictly for this component */}
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #dc2626; }
      `}</style>
    </div>
  );
}