import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import "../Styles/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentErrors = {};

    if (!email) {
      currentErrors.email = "Email is required";
    }
    if (!password) {
      currentErrors.password = "Password is required";
    }
    if (!hospitalId) {
      currentErrors.hospitalId = "Hospital ID is required";
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setErrors({});
    setErrorMessage("");

    try {
      const response = await fetch("https://nss-phc-backend.onrender.com/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, hospitalId }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log("The token is ", data.token);

        setUser({
          name: data.user.name,
          role: data.user.role,
          hospital_id: data.user.hospital_id,
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
    setHospitalId("");
  };

  return (
    <div className="login-container">
      <div className="title-flex">
        <h1>Telangana PHC Login</h1>
      </div>

      <div className="form-flex">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="hospitalId">Hospital ID</label>
            <input
              type="text"
              id="hospitalId"
              value={hospitalId}
              placeholder="Hospital ID"
              onChange={(e) => setHospitalId(e.target.value)}
            />
            {errors.hospitalId && (
              <span className="error">{errors.hospitalId}</span>
            )}
          </div>

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
        </form>
      </div>

      <footer className="footer">
        <p>Copyright© 2024</p>
      </footer>
    </div>
  );
};

export default LoginPage;
