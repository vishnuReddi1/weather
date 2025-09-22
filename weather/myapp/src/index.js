import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./AppRouter";   // <-- use AppRouter now
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

// Optional: measure performance
reportWebVitals();
