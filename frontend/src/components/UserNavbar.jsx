import React from "react";
import { useNavigate } from "react-router-dom";
import { userLogout } from "../api/api"; 

export default function UserNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await userLogout();      
      navigate("/user/login"); 
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>Smart Access</div>

      <ul style={styles.menu}>
        <li onClick={() => navigate("/user/dashboard")}>Home</li>
        <li onClick={() => navigate("/user/jobs")}>Find Jobs</li>
        <li onClick={() => navigate("/user/profile")}>Profile</li>
        <li style={styles.logout} onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    background: "#005bbb",
    color: "white",
    padding: "15px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  menu: {
    listStyle: "none",
    display: "flex",
    gap: "25px",
    fontSize: "18px",
    cursor: "pointer",
  },
  logout: {
    fontWeight: "bold",
    color: "yellow",
  },
};
