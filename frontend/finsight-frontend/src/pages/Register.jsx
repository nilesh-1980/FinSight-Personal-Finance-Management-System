import { useState } from "react";
import API from "../api";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const registerUser = async () => {
    try {
      const res = await API.post("/auth/register", user);
      alert(res.data);
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>

      <input
        type="text"
        placeholder="Enter Name"
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />

      <button onClick={registerUser}>Register</button>
      <p>
  Already have an account? <a href="/login">Login now</a>
</p>
    </div>
  );
}

export default Register;