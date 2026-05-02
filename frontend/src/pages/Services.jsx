import CarSelect from "../components/CarSelect";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // 🔥 Add this

export default function Services() {
  const [highlightCar, setHighlightCar] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carSelected, setCarSelected] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  const [activeCategory, setActiveCategory] = useState("car");

  const categories = [
    { name: "Car Services", key: "car" },
    { name: "Batteries", key: "battery" },
    { name: "Wheel & Tyres", key: "tyres" },
    { name: "Denting & Painting", key: "denting" },
    { name: "Cleaning & Car Spa", key: "spa" },
    { name: "Car Inspections", key: "inspection" },
    { name: "Insurance Claims", key: "insurance" }
  ];

  useEffect(() => {
    // API Fetch
    fetch("http://localhost/vehicle-service/api/getServices.php")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const car = JSON.parse(localStorage.getItem("selectedCar"));
      if (car) {
        setSelectedCar(car);
        setCarSelected(true);
      } else {
        setSelectedCar(null);
        setCarSelected(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleShowAll = () => {
      setShowAllServices(true);
    };
  
    window.addEventListener("showAllServices", handleShowAll);
    return () => {
      window.removeEventListener("showAllServices", handleShowAll);
    };
  }, []);

  useEffect(() => {
    if (selectedCar && selectedCar.brand && selectedCar.model) {
      setShowAllServices(false);
      setCarSelected(true);
    } else {
      setCarSelected(false);
    }
  }, [selectedCar]);

  const handleSelectCar = () => {
    setHighlightCar(true);
    setTimeout(() => setHighlightCar(false), 1000);
  };

  const addToCart = (service) => {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const existing = cart.find((i) => i.title === service.title);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...service, qty: 1 });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
    // Pro tip: Tu yaha alert ki jagah custom toast use kar sakta hai future me!
    alert("Added to cart ✅"); 
  };

  const safeParseBrands = (value) => {
    if (!value) return {};
    if (typeof value !== "string") return value || {};
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  };

  const fixedSelectedCar = selectedCar
    ? {
        brand: (selectedCar.brand || "").toLowerCase(),
        model: (selectedCar.model || "").toLowerCase()
      }
    : null;

  const filteredServices = services
    .filter((s) => s.title && Number(s.price) > 0)
    .filter((s) => {
      const cat = (s.category || "").trim().toLowerCase();
      if (activeCategory === "car") {
        return !cat || cat === "car";
      }
      return cat === activeCategory;
    })
    .filter(s => {
      if (showAllServices) return true;
      if (!carSelected) return true;
      if (!selectedCar || !s.supported_brands) return false;
      if (!fixedSelectedCar || !s.supported_brands) return false;

      try {
        const parsed = safeParseBrands(s.supported_brands);
        const brand = fixedSelectedCar.brand;
        const model = fixedSelectedCar.model;

        const fixedBrand =
          brand.includes("maruti") ? "maruti" :
          brand.includes("hyundai") ? "hyundai" :
          brand.includes("honda") ? "honda" :
          brand.includes("tata") ? "tata" :
          brand.includes("ford") ? "ford" :
          brand.includes("volkswagen") ? "volkswagen" :
          brand.includes("mahindra") ? "mahindra" :
          brand.includes("toyota") ? "toyota" :
          brand.includes("skoda") ? "skoda" :
          brand.includes("bmw") ? "bmw" :
          brand.includes("renault") ? "renault" :
          brand;

        if (!parsed[fixedBrand]) return false;
        return parsed[fixedBrand].map((m) => String(m).toLowerCase()).includes(model);
      } catch {
        return false;
      }
    });

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-16 px-6 font-sans selection:bg-red-600/30">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center relative z-10">
        <motion.div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/20 blur-[100px] rounded-full -z-10"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
        />
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
          Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Services</span>
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Precision care for your vehicle. Select a category to explore our premium offerings.
        </p>
      </div>

      {/* Category Tabs (Animated) */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-5xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`relative px-6 py-2.5 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 overflow-hidden ${
              activeCategory === cat.key
                ? "text-white"
                : "text-neutral-400 hover:text-white bg-neutral-900/50 border border-neutral-800 hover:border-neutral-600"
            }`}
          >
            {activeCategory === cat.key && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Car Selection Status Banner */}
      <div className="flex justify-center mb-12">
        {!carSelected ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-8 py-3 rounded-2xl bg-neutral-900/50 border border-red-600/30 text-red-400 font-semibold flex items-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Select your car to see personalized services
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-900 border border-red-500 text-white font-bold flex items-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            <span className="text-xl">🚘</span>
            {selectedCar.brand.toUpperCase()} <span className="font-light text-red-200">|</span> {selectedCar.model.toUpperCase()}
          </motion.div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Services List */}
        <div className="flex-1">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredServices.length > 0 ? (
                filteredServices.map((s, i) => (
                  <motion.div
                    key={s.title + i} // Unique key ensures smooth enter/exit
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                    className="group relative bg-neutral-900/40 border border-neutral-800 hover:border-red-600/50 rounded-3xl p-5 flex flex-col sm:flex-row gap-6 overflow-hidden backdrop-blur-sm"
                  >
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    {/* Image Container with Zoom effect */}
                    <div className="w-full sm:w-48 h-40 rounded-xl overflow-hidden shrink-0 border border-neutral-800">
                      <img
                        src={s.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={s.title}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between py-2 z-10">
                      <div>
                        <h2 className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors duration-300">
                          {s.title}
                        </h2>
                        <p className="text-sm text-neutral-400 mt-2 leading-relaxed line-clamp-2">
                          {s.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                        <div className="bg-black/50 border border-neutral-800 px-4 py-1.5 rounded-lg">
                            <span className="text-xl font-extrabold text-white">
                                ₹{s.price}
                            </span>
                        </div>

                        {!carSelected ? (
                          <button
                            onClick={handleSelectCar}
                            className="px-6 py-2 border border-red-600 text-red-500 font-bold uppercase tracking-wide text-sm rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-[0_0_10px_rgba(220,38,38,0)] hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                          >
                            Select Car First
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart(s)}
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold uppercase tracking-wide text-sm rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex flex-col items-center justify-center py-20 text-neutral-500 col-span-full"
                >
                  <span className="text-6xl mb-4 grayscale opacity-50">🛠️</span>
                  <h3 className="text-2xl font-bold text-neutral-300">No Services Found</h3>
                  <p className="mt-2 text-center max-w-md">
                    We couldn't find any services in this category for your selected car. Try selecting a different category or vehicle.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Sidebar: Car Select Component */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="sticky top-28 z-20">
            {/* Glow effect strictly behind the component */}
            <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-0 transition-opacity duration-500 ${highlightCar ? 'bg-red-600 opacity-50' : ''}`}></div>
            <div className="relative">
                <CarSelect highlight={highlightCar} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}