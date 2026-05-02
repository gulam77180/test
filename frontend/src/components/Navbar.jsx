import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUserAlt, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // 🔥 Active route track karne ke liye
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // 🔥 LIVE CART COUNT UPDATE
  useEffect(() => {
    const interval = setInterval(() => {
      const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
      setCartCount(cart.reduce((sum, item) => sum + (item.qty || 1), 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // 🔥 SCROLL DETECTION FOR GLASSMORPHISM
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    sessionStorage.clear(); // sab clear (user, cart, car)
    navigate("/login");
  };

  const handleProtectedRoute = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "History", path: "/history" },
    { name: "Packages", path: "/pricing" },
    { name: "Subscription", path: "/subscription" },
    { name: "Contact", path: "/contact" },
    
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled 
          ? "bg-black/80 backdrop-blur-lg border-neutral-800 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] py-3" 
          : "bg-transparent border-transparent py-5"
      } px-8 flex justify-between items-center`}
    >
      {/* 🚀 LOGO (Animated Glow) */}
      <div
        className="relative cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div className="absolute -inset-2 bg-red-600/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h1 className="relative text-2xl font-black tracking-tighter text-white transition-transform duration-300 group-hover:scale-105">
          Auto<span className="text-red-600">Service</span>
        </h1>
      </div>

      {/* 🚀 NAV LINKS (Framer Motion Active Indicator) */}
      <ul className="hidden md:flex gap-8 text-sm font-semibold items-center">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <li
              key={link.name}
              onClick={() => {
                if (link.path === "/") navigate("/");
                else handleProtectedRoute(link.path);
              }}
              className="relative cursor-pointer px-2 py-1 group text-neutral-300 hover:text-white transition-colors duration-300 uppercase tracking-widest text-xs"
            >
              {link.name}
              
              {/* Active Route glowing underline */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Hover underline (shows only when not active) */}
              {!isActive && (
                <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600/50 transition-all duration-300 group-hover:w-full"></div>
              )}
            </li>
          );
        })}
      </ul>

      {/* 🚀 RIGHT SIDE ACTIONS */}
      <div className="flex gap-6 items-center">
        
        {/* 🔥 CART ICON (Pulsing Badge) */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleProtectedRoute("/cart")}
          className="relative cursor-pointer text-neutral-300 hover:text-white transition-colors duration-300"
        >
          <FaShoppingCart size={22} />
          
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-2.5 -right-2.5 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-black shadow-[0_0_10px_rgba(220,38,38,0.5)]"
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 🔥 AUTH BUTTONS */}
        {!user ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 px-5 py-2 rounded-full text-sm font-bold hover:bg-white hover:text-black hover:border-white transition-all duration-300"
            >
              <FaSignInAlt /> Login
            </Link>
          </motion.div>
        ) : (
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/profile" 
                className="flex items-center gap-2 border border-neutral-700 px-4 py-2 rounded-full text-sm font-bold text-neutral-300 hover:text-white hover:border-red-500 hover:bg-red-500/10 transition-all duration-300"
              >
                <FaUserAlt size={12} /> Profile
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full text-sm font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-300"
            >
              <FaSignOutAlt size={14} /> Logout
            </motion.button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}