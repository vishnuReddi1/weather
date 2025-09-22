import React, { useState } from "react";
import { Mail, Lock, X } from "lucide-react";
import toast from "react-hot-toast";
import { login } from "../api/authService"; // ✅ Import our new service

const Login = ({ onLogin, onClose, switchToSignup }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(form.email, form.password); // ✅ Call our API service
      toast.success("✅ Login successful, welcome back!");
      onLogin(user);
      onClose();
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "❌ Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-black/60 backdrop-blur-xl p-8 rounded-2xl shadow-lg w-[90%] max-w-sm border border-white/30">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white hover:text-red-400"
      >
        <X size={22} />
      </button>

      <h2 className="text-2xl font-bold mb-4 text-white text-center">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center bg-black/40 px-3 py-2 rounded-lg">
          <Mail className="mr-2 text-gray-400" size={18} />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-transparent outline-none text-white"
            required
          />
        </div>

        <div className="flex items-center bg-black/40 px-3 py-2 rounded-lg">
          <Lock className="mr-2 text-gray-400" size={18} />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-transparent outline-none text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-300 mt-3">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={switchToSignup}
          className="text-blue-400 hover:underline"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;
