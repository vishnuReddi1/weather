import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user, setUser, setCurrentForm }) => {
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setCurrentForm(null);
  };

  // Helper: get first letter from name
  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="w-full h-16 px-6 flex justify-between items-center bg-gradient-to-r from-slate-800 via-blue-800 to-slate-900 text-white fixed top-0 z-20 shadow-lg">
      <h1 className="text-2xl font-bold">Weatherly</h1>

      <div className="relative flex items-center space-x-4">
        {!user ? (
          <>
            <button
              onClick={() => setCurrentForm("login")}
              className="px-4 py-2 rounded-lg bg-blue-700/80 backdrop-blur-sm border border-blue-500/30 hover:bg-blue-600 transition"
            >
              Log In
            </button>
            <button
              onClick={() => setCurrentForm("signup")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            {/* Profile Avatar with Initial */}
            <div
              className="relative"
              onMouseEnter={() => setShowProfile(true)}
              onMouseLeave={() => setShowProfile(false)}
            >
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:scale-105 transition-transform">
                {getInitial(user.name)}
              </button>

    <AnimatePresence>
  {showProfile && (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="absolute right-0 mt-3 w-72 bg-white text-slate-800 rounded-xl shadow-2xl z-30"
    >
      {/* Arrow */}
      <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 shadow-md"></div>

      {/* Content */}
      <div className="p-3 flex flex-col space-y-1 relative z-10">
        <p className="font-semibold text-base truncate">{user.name}</p>
        <p className="text-sm text-gray-600 truncate">{user.email}</p>
      </div>
    </motion.div>
  )}
</AnimatePresence>


            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
