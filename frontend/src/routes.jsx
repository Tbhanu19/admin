import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserDashboard from "./components/UserDashboard";
import UserLogin from "./components/UserLogin";
import FindJobs from "./components/FindJobs";
import UserProfile from "./components/UserProfile";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/user/login" />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/jobs" element={<FindJobs />} />
      <Route path="/user/profile" element={<UserProfile />} />
    </Routes>
  );
}
