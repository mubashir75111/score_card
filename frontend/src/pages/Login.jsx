import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await API.post("/users/login", {
        email,
        password,
      });

      // JWT token save
      localStorage.setItem("token", response.data.token);

      // User information save
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage(response.data.message);

      console.log("Logged in user:", response.data.user);
      console.log("Token:", response.data.token);

      // Login ke baad Home par jao
      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error);

      setMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div style={styles.field}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Signup Link */}
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    width: "350px",
    margin: "100px auto",
  },

  field: {
    marginBottom: "15px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "10px",
    cursor: "pointer",
  },
};

export default Login;
