import { useState } from "react";
import { createUser } from "../api/api";

export default function CreateUserForm({ refreshUsers }) {
  const [first_name, setFirst] = useState("");
  const [last_name, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      await createUser({ first_name, last_name, email, password });
      setMsg("User Created Successfully!");
      setFirst("");
      setLast("");
      setEmail("");
      setPassword("");
      refreshUsers();
    } catch (err) {
      setMsg("Failed to create user");
    }
  };

  return (
    <form onSubmit={submit} className="create-user-form">
      <h3>Create New User</h3>

      <input
        type="text"
        placeholder="First Name"
        value={first_name}
        onChange={(e) => setFirst(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Last Name"
        value={last_name}
        onChange={(e) => setLast(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Create User</button>

      {msg && <p className="success-msg">{msg}</p>}
    </form>
  );
}
