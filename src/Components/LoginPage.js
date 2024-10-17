import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import "../Styles/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8001/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log("thye tken is ", data.token);

        setUser({
          name: data.user.name,
          role: data.user.role,
        });
        navigate("/home");
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (err) {
      setErrorMessage("An error occurred while logging in");
    }

    setEmail("");
    setPassword("");
  };
  return (
    <div className="login-container">
      <div className="title-flex">
        <h1>Telangana PHC Login</h1>
      </div>

      <div className="form-flex">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="login-button">
            Sign In
          </button>

          <div className="forgot-password">
            <a href="">Forgot password?</a>
          </div>
        </form>
      </div>

      <footer className="footer">
        <p>Copyright© 2024</p>
      </footer>
    </div>
  );
};

export default LoginPage;
