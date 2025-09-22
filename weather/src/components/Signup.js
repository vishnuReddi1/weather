import React, { useState } from "react";
import { User, Mail, Lock, Home, Phone, Eye, EyeOff, X } from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../api/apiConfig";

const Signup = ({ onClose, switchToLogin }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwdError = validatePassword(form.password);
    if (pwdError) {
      toast.error(pwdError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast.success("✅ Successfully saved your data!");
        setForm({ name: "", phone: "", address: "", email: "", password: "" });
        setTimeout(() => onClose(), 1500);
      } else {
        const errorData = await response.text();
        toast.error(errorData || "❌ Signup failed");
      }
    } catch (err) {
      toast.error("❌ Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white/20 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm border border-white/30">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white hover:text-red-400"
      >
        <X size={22} />
      </button>

      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Join Weatherly
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* name */}
        <div className="flex items-center bg-white/20 px-3 py-2 rounded-lg border border-white/30">
          <User className="mr-2 text-white" size={18} />
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-transparent outline-none text-white placeholder-gray-200 text-sm"
          />
        </div>

        {/* phone */}
        <div className="flex items-center bg-white/20 px-3 py-2 rounded-lg border border-white/30">
          <Phone className="mr-2 text-white" size={18} />
          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            className="w-full bg-transparent outline-none text-white placeholder-gray-200 text-sm"
          />
        </div>

        {/* address */}
        <div className="flex items-center bg-white/20 px-3 py-2 rounded-lg border border-white/30">
          <Home className="mr-2 text-white" size={18} />
          <input
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
            className="w-full bg-transparent outline-none text-white placeholder-gray-200 text-sm"
          />
        </div>

        {/* email */}
        <div className="flex items-center bg-white/20 px-3 py-2 rounded-lg border border-white/30">
          <Mail className="mr-2 text-white" size={18} />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full bg-transparent outline-none text-white placeholder-gray-200 text-sm"
          />
        </div>

        {/* password */}
        <div className="flex items-center bg-white/20 px-3 py-2 rounded-lg border border-white/30">
          <Lock className="mr-2 text-white" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full bg-transparent outline-none text-white placeholder-gray-200 text-sm"
          />
          <button
            type="button"
            className="text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-semibold text-white shadow-md mt-2 disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      {/* Message to login */}
      <p className="text-sm text-center text-gray-200 mt-3">
        Already have an account?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="text-blue-400 hover:underline"
        >
          Log in
        </button>
      </p>
    </div>
  );
};

export default Signup;
