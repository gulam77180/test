import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheck, FaCrown, FaStar, FaShieldAlt, FaGem, FaClock } from "react-icons/fa";

export default function Subscription() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));

  // 🔥 MAX UI UPGRADED PLANS WITH DURATION
  const plans = [
    { 
      name: "Free", 
      price: 0, 
      duration: "Lifetime",
      icon: FaStar,
      color: "text-neutral-400",
      bgHover: "hover:border-neutral-500",
      features: ["Standard App Access", "Pay-per-service Booking", "Basic Service History", "Standard Support"] 
    },
    { 
      name: "Silver", 
      price: 999, 
      duration: "Valid for 365 Days",
      icon: FaShieldAlt,
      color: "text-blue-400",
      bgHover: "hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
      features: ["Priority Bay Booking", "5% Off on Spare Parts", "1 Free Car Wash/yr", "Standard Support"] 
    },
    { 
      name: "Gold", 
      price: 1999, 
      duration: "Valid for 365 Days",
      isPopular: true,
      icon: FaCrown,
      color: "text-yellow-400",
      bgHover: "border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.15)] hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(234,179,8,0.3)]",
      features: ["10% Off on Spare Parts", "Free Interior Detailing", "24/7 Roadside Assistance", "Priority Customer Care"] 
    },
    { 
      name: "Platinum", 
      price: 3999, 
      duration: "Valid for 365 Days",
      icon: FaGem,
      color: "text-purple-400",
      bgHover: "hover:border-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]",
      features: ["20% Off on Spare Parts", "Free Pickup & Drop", "Dedicated Master Mechanic", "VIP Lounge Access"] 
    }
  ];

  useEffect(() => {
    if (!user) {
        navigate("/login");
        return;
    }

    fetch("http://localhost/vehicle-service/api/getSubscription.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    })
    .then(res => res.json())
    .then(data => setCurrentPlan(data))
    .catch(err => console.error("Error fetching plan:", err));
  }, [user, navigate]);

  // 🔥 SEND TO PAYMENT PAGE
  const buyPlan = (plan) => {
    // Hum subscription ko cart mein ek special tag ('isSubscription') ke sath daalenge
    const subscriptionItem = {
      title: `${plan.name} Membership (1 Year)`,
      price: plan.price,
      qty: 1,
      isSubscription: true,
      planName: plan.name
    };
    
    sessionStorage.setItem("cart", JSON.stringify([subscriptionItem]));
    navigate("/payment");
  };

  const currentPlanName = currentPlan?.plan_name || "Free";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24 px-6 relative overflow-hidden font-sans selection:bg-red-600/30">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-yellow-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-red-500 text-sm font-bold uppercase tracking-widest mb-4">
              <FaCrown /> Premium Memberships
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
              Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Experience</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Unlock exclusive benefits, priority services, and massive discounts with our AutoService Club tiers.
            </p>
          </motion.div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, i) => {
            const isCurrent = currentPlanName.toLowerCase() === plan.name.toLowerCase();
            const Icon = plan.icon;

            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: isCurrent ? 0 : -10 }}
                className={`relative flex flex-col bg-neutral-900/40 backdrop-blur-xl p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden
                  ${isCurrent ? "border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.15)]" : `border-neutral-800 ${plan.bgHover}`}
                `}
              >
                {plan.isPopular && !isCurrent && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-b-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                    Most Popular
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-green-500 text-black px-4 py-1 rounded-b-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                    Active Plan
                  </div>
                )}

                <div className="mb-6 mt-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                    <Icon className={`text-3xl ${plan.color} opacity-80`} />
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-black text-white">₹{plan.price}</span>
                  <span className="text-neutral-500 text-sm font-medium"> / year</span>
                  
                  {/* 🔥 DURATION BADGE */}
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-neutral-400 bg-black/50 w-max px-3 py-1.5 rounded-lg border border-neutral-800">
                    <FaClock className="text-red-500" /> {plan.duration}
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-neutral-300 text-sm">
                      <FaCheck className="text-red-500 mt-1 shrink-0" size={12} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => buyPlan(plan)}
                  disabled={isCurrent}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 flex justify-center items-center gap-2
                    ${isCurrent 
                      ? "bg-green-500/10 text-green-500 border border-green-500/30 cursor-default" 
                      : plan.isPopular 
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-[1.02] active:scale-95" 
                        : "bg-neutral-800 text-white hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    }
                  `}
                >
                  {isCurrent ? "Currently Active" : plan.price === 0 ? "Downgrade" : "Upgrade & Pay"}
                </button>

              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
}