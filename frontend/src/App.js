import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./styles.css";

// AOS Animation
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import Services from "./pages/Services";
import History from "./pages/History";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import CarServices from "./pages/CarServices";
import Batteries from "./pages/Batteries";
import Tyres from "./pages/Tyres";
import Denting from "./pages/Denting";
import Spa from "./pages/Spa";
import Inspection from "./pages/Inspection";
import Insurance from "./pages/Insurance";
import Payment from "./pages/Payment";
import Subscription from "./pages/Subscription";

// Protected
import ProtectedAdmin from "./components/ProtectedAdmin";
import ProtectedRoute from "./components/ProtectedRoute";

// 🔥 NEW: Landing Page (before login)
import Landing from "./pages/Landing";


// 🔥 Layout

function Layout() {

  const hideNavbarRoutes = ["/login", "/register"];

  const location = useLocation();

  const user = JSON.parse(sessionStorage.getItem("user")); // 🔥 page change pe update

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* ✅ Navbar only after login & not on admin */}
      {user && !isAdminRoute && !hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <div className="bg-black min-h-screen">

        <Routes>

          {/* 🔥 ROOT LOGIC */}
          <Route path="/" element={user ? <Home /> : <Landing />} />
          {/* PUBLIC */}
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔥 PROTECTED USER ROUTES */}
          <Route path="/services" element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          } />

<Route path="/services/car" element={<CarServices />} />
<Route path="/services/batteries" element={<Batteries />} />
<Route path="/services/tyres" element={<Tyres />} />
<Route path="/services/denting" element={<Denting />} />
<Route path="/services/spa" element={<Spa />} />
<Route path="/services/inspection" element={<Inspection />} />
<Route path="/services/insurance" element={<Insurance />} />
<Route path="/payment" element={<Payment />} />
<Route path="/subscription" element={<Subscription />} />


          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={<Cart />} />

          {/* 🔥 ADMIN */}
          <Route path="/admin" element={
            <ProtectedAdmin>
              <AdminDashboard />
            </ProtectedAdmin>
          } />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen text-white text-2xl">
                404 | Page Not Found
              </div>
            }
          />

        </Routes>

      </div>
    </>
  );
}


// 🔥 MAIN APP
function App() {

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true
    });
  }, []);

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;