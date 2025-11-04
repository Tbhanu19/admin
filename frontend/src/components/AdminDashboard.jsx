import { useEffect, useState } from "react";
import { getAllUsers, getUserSessions, adminLogout } from "../api/api";
import CreateUserForm from "./CreateUserForm";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const loadUsersWithSessions = async () => {
    const res = await getAllUsers();
    const usersData = res.data;

    const updatedUsers = await Promise.all(
      usersData.map(async (u) => {
        const sessionRes = await getUserSessions(u.id);
        return {
          ...u,
          sessions: sessionRes.data.sessions || [], 
        };
      })
    );

    setUsers(updatedUsers);
  };

  useEffect(() => {
    loadUsersWithSessions();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      <CreateUserForm refreshUsers={loadUsersWithSessions} />

      <h3>Users List</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Total Logins</th>
            <th>Login Timestamps</th>
            <th>Logout Timestamps</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.email}</td>
              <td>{u.login_count}</td>

              <td>
                {u.sessions.map((s, i) => (
                  <div key={i}>{s.login}</div>
                ))}
              </td>

              <td>
                {u.sessions.map((s, i) => (
                  <div key={i}>{s.logout ?? "Still Active"}</div>
                ))}
              </td>

              <td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="logout-btn" onClick={async () => {
        await adminLogout();
        window.location.href = "/admin/login";
      }}>
        Logout
      </button>
    </div>
  );
}
