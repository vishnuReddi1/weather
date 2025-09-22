// src/api/authService.js
import { API_BASE_URL } from "./apiConfig";

// ✅ No double prefix. Just use API_BASE_URL directly.
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || `Login failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Server not reachable");
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || `Register failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Register error:", error);
    throw new Error("Server not reachable");
  }
};
