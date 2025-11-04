import { useEffect, useState } from "react";
import { getUserDashboard } from "../api/api";  
import UserNavbar from "./UserNavbar";

export default function UserDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const res = await getUserDashboard();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  return (
    <>

      <div style={{ padding: "25px" }}>
        {loading && <h3>Loading Dashboard...</h3>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {data && (
          <>
            <h2>Welcome {data.first_name} {data.last_name}</h2>
          </>
        )}
      </div>
    </>
  );
}
