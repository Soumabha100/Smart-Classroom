// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import QueryProvider from "./context/QueryProvider.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <QueryProvider>
            <App />
          </QueryProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
