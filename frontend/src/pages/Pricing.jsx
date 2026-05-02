import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import CarSelect from "../components/CarSelect";

export default function Pricing() {
  const navigate = useNavigate();
  
  const [selectedPlan, setSelectedPlan] = useState(null); 
  const [showCarModal, setShowCarModal] = useState(false); 

  // 🔥 Max UI Upgraded Packages
  const plans = [
    { 
      name: "Essential Care", 
      price: 999, 
      popular: false,
      desc: "Perfect for routine checkups and keeping your daily commute smooth.",
      features: [
        "Premium Oil Change", 
        "Fluid Level Top-up", 
        "30-Point Safety Inspection", 
        "Exterior Foam Wash", 
        "Battery Health Check"
      ] 
    },
    { 
      name: "Advanced Standard", 
      price: 2499, 
      popular: true,
      desc: "Comprehensive maintenance for long drives and peak reliability.",
      features: [
        "Fully Synthetic Oil Change", 
        "Brake Cleaning & Adjustment", 
        "50-Point Deep Inspection", 
        "AC Filter Cleaning", 
        "Interior Vacuum & Dash Polish",
        "Wheel Alignment Check"
      ] 
    },
    { 
      name: "Ultimate VIP", 
      price: 4999, 
      popular: false,
      desc: "The complete overhaul. Showroom condition, maximum performance.",
      features: [
        "Engine Flush & Treatment", 
        "Advanced Computer Diagnostics", 
        "100-Point Master Inspection", 
        "Full Car Spa & Ceramic Wax", 
        "Priority 24/7 Support",
        "Free Pickup & Drop Service"
      ] 
    }
  ];

  const handleSelectPlan = (plan) => {
    // 🔴 BUG FIXED: Hamesha modal khulega. Auto skip nahi hoga.
    setSelectedPlan(plan);
    setShowCarModal(true);
  };

  const handleCarSelectionComplete = () => {
    // Ye function tab chalega jab naye CarSelect component se "Confirm" ya "Select" hoga
    if (!selectedPlan) return;

    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const existing = cart.find((i) => i.title === selectedPlan.name);
    
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ 
          title: selectedPlan.name, 
          price: selectedPlan.price, 
          qty: 1,
          category: "package" 
      });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
    
    setShowCarModal(false);
    setSelectedPlan(null);
    navigate("/cart");
  };

  const closeModal = () => {
    setShowCarModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24 px-6 relative overflow-hidden font-sans selection:bg-red-600/30">
      
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-800/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-3xl mx-auto text-center mb-20 z-10 relative">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-red-500 font-bold tracking-widest uppercase text-sm mb-3">Transparent Pricing</h2>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Perfect Plan</span>
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            No hidden fees, no unnecessary upsells. Just pure automotive excellence tailored to your car's specific needs.
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-center relative z-10"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -15 }}
            className={`relative rounded-3xl p-8 backdrop-blur-sm transition-all duration-500 ${
              plan.popular 
                ? "bg-gradient-to-b from-neutral-900 to-black border-2 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.25)] md:-translate-y-4" 
                : "bg-neutral-900/40 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900/80"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-neutral-200"}`}>{plan.name}</h2>
              <p className="text-neutral-400 text-sm h-10 line-clamp-2 mb-6">{plan.desc}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black text-white">₹{plan.price}</span>
                <span className="text-neutral-500 font-medium">/service</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 min-h-[240px]">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-neutral-300">
                  <span className="text-red-500 mt-1 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSelectPlan(plan)}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 ${
                plan.popular 
                  ? "bg-red-600 text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]" 
                  : "bg-neutral-800 text-white hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
              }`}
            >
              Select {plan.name}
            </button>

          </motion.div>
        ))}
      </motion.div>

      {/* 🔥 OVERLAY MODAL FOR CAR SELECTION */}
      <AnimatePresence>
        {showCarModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md relative"
            >
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors bg-neutral-900 p-2 rounded-full border border-neutral-700"
              >
                <FaTimes size={16} />
              </button>

              <div className="text-center mb-4 relative z-10">
                <p className="text-neutral-300 text-sm font-bold bg-black/50 inline-block px-4 py-2 rounded-full border border-neutral-800 mb-2">
                  Adding <span className="text-red-500">{selectedPlan?.name}</span>
                </p>
              </div>

              {/* 🔥 MAGIC HERE: Call onSelectionComplete when done */}
              <CarSelect 
                highlight={false} 
                onSelectionComplete={handleCarSelectionComplete} 
              />

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}