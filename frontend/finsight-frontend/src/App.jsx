import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useState } from "react";
import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Budget from "./pages/Budget";
import Goals from "./pages/Goals";
import ExpenseAnalysis from "./pages/ExpenseAnalysis";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Recurring from "./pages/Recurring";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";


function App() {
  const isLogin = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.className = savedTheme;
}, []);
  return (
    <BrowserRouter>
      {!isLogin ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div className="app-layout">
          <button
            className={sidebarOpen ? "menu-toggle menu-open" : "menu-toggle"}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <Sidebar sidebarOpen={sidebarOpen} />

          <main className={sidebarOpen ? "main-content shift" : "main-content"}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/analysis" element={<ExpenseAnalysis />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/recurring" element={<Recurring />} />

              <Route
                path="/admin"
                element={
                  role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/" />
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;