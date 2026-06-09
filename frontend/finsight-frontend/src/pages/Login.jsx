import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const loginUser = async () => {
    try {
      const res = await API.post("/auth/login", login);

      localStorage.setItem("email", res.data.email);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("Login Successful");
     window.location.href = "/";
    } catch (error) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e) => setLogin({ ...login, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setLogin({ ...login, password: e.target.value })}
      />

      <button onClick={loginUser}>Login</button>
      <p>
  Don't have an account <a href="/register">Register now</a>
</p>
<p>
  <a href="/forgot-password">
    Forgot Password?
  </a>
</p>
    </div>
  );
}

export default Login;