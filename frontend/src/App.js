import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Import pages
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageUsers from "./components/admin/ManageUsers";
import ManageTeams from "./components/admin/ManageTeams";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Routes for admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-teams" element={<ManageTeams />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
