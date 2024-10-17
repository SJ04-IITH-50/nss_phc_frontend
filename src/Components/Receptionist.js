import React, { useState } from "react";
import axios from "axios";

const AddPatientForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    OPid: "",
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
        "http://localhost:8001/api/receptionist/add-patient",
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
        OPid: "",
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
    <div>
      <h2>Add Patient</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
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
          <label>OP ID:</label>
          <input
            type="text"
            name="OPid"
            value={formData.OPid}
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
            required
          />
        </div>
        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
};

export default AddPatientForm;
