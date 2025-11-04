import { useEffect, useState } from "react";
import { getUserDashboard } from "../api/api";
import UserNavbar from "./UserNavbar";

export default function UserProfile() {
  const [user, setUser] = useState(null);

  const loadData = async () => {
    try {
      const res = await getUserDashboard();
      setUser(res.data);
    } catch (err) {
      console.log("Error loading user profile:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>

      <div style={styles.container}>
        <h2 style={styles.title}>User Profile</h2>

        {user ? (
          <div style={styles.card}>
            <p><strong>First Name:</strong> {user.first_name}</p>
            <p><strong>Last Name:</strong> {user.last_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: "30px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  card: {
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
    width: "350px",
    fontSize: "18px",
    lineHeight: "32px",
  }
};
