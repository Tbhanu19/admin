import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

import UserLogin from "./components/UserLogin";
import UserDashboard from "./components/UserDashboard";
import FindJobs from "./components/FindJobs";
import UserProfile from "./components/UserProfile";

import UserLayout from "./layouts/UserLayout"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Navigate to="/user/login" />} />

       
        <Route path="/admin/login" element={<AdminLogin />} />

        
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

       
        <Route path="/user/login" element={<UserLogin />} />

       
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="jobs" element={<FindJobs />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
