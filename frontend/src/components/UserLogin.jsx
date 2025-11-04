
import { useState } from "react";
import { userLogin } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function UserLogin(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await userLogin(username, password);
      if (res.data?.redirect) navigate(res.data.redirect);
      else navigate("/user/dashboard");
    } catch (error) {
      setErr(error.response?.data?.detail || error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      {err && <p style={{color:'red'}}>{err}</p>}
      <form onSubmit={submit}>
        <input placeholder="email" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
