import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import WeatherApp from "./WeatherApp";
import signupVideo from "./assets/wather.mp4";
import { Toaster } from "react-hot-toast";

function AppRouter() {
  const [currentForm, setCurrentForm] = useState(null); // "signup" | "login" | null
  const [user, setUser] = useState(null);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video (only if not logged in) */}
      {!user && (
        <>
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={signupVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/fallback.jpg"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-pink-900/40" />
        </>
      )}

      {/* Navbar */}
      <Navbar user={user} setUser={setUser} setCurrentForm={setCurrentForm} />

      {/* Main Content */}
      <div className="relative z-10 flex justify-center items-center pt-20">
        {!user && currentForm === "signup" && (
          <Signup
            onSignup={setUser}
            onClose={() => setCurrentForm(null)}
            switchToLogin={() => setCurrentForm("login")}
          />
        )}
        {!user && currentForm === "login" && (
          <Login
            onLogin={setUser}
            onClose={() => setCurrentForm(null)}
            switchToSignup={() => setCurrentForm("signup")}
          />
        )}
        {user && <WeatherApp user={user} />}
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default AppRouter;
