import React, { useState } from "react";
import "../Styles/Receptionist.css";
import axios from "axios";

const AddPatientForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    aadhar_number: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log("Submitting form data:", formData);
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);

    try {
      const response = await axios.post(
        "https://nss-phc-backend.onrender.com/api/receptionist/add-patient",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      setSuccess(response.data.message);
      setFormData({
        name: "",
        age: "",
        gender: "",
        aadhar_number: "",
      });
    } catch (err) {
      console.error("Error while adding patient:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
        setError(err.response.data.message || "An error occurred");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="receptionist-container">
      <div className="title-flex">
        <h1>Home Page</h1>
      </div>

      <div className="form-flex">
        <div className="add-patient-form">
          <h2 className="form-title">Add Patient</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="PNS">PNS</option>
              </select>
            </div>
            <div>
              <label>Aadhar Number:</label>
              <input
                type="text"
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={handleChange}
                minLength="12"
                maxLength="12"
                required
              />
            </div>
            <button type="submit" className="add-patient-button">
              Add Patient
            </button>
          </form>
        </div>
      </div>

      <footer className="footer">
        <p>Copyright© 2024</p>
      </footer>
    </div>
  );
};

export default AddPatientForm;
