import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PatientPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [complaint, setComplaint] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [otherComplaint, setOtherComplaint] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleComplaintChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setComplaint((prev) => [...prev, value]);
    } else {
      setComplaint((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleMedicinesChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMedicines((prev) => [...prev, value]);
    } else {
      setMedicines((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    let finalComplaint = [...complaint];
    if (finalComplaint.includes("Others")) {
      finalComplaint = finalComplaint.map((item) =>
        item === "Others" ? otherComplaint : item
      );
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8001/api/doctor/patient/update/${id}`,
        { complaint: finalComplaint, medicines },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setSuccess("Patient details updated successfully.");
      setPatient(response.data.patient);
      setComplaint([]);
      setMedicines([]);
      setOtherComplaint("");

      navigate("/home");
    } catch (err) {
      setError("Failed to update patient details.");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8001/api/doctor/patient/${id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setPatient(response.data.patient);
        setComplaint(response.data.patient.complaint || []);
        setMedicines(response.data.patient.medicines_prescribed || []);
      } catch (err) {
        setError("Failed to retrieve patient details.");
        console.error(err);
      }
    };

    fetchPatientDetails();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!patient) {
    return <p>Loading patient details...</p>;
  }

  return (
    <div className="patient-details p-4">
      <h2 className="text-2xl font-bold mb-4">Patient Details</h2>
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">{patient.name}</h3>
        <p className="text-gray-600">Age: {patient.age}</p>
        <p className="text-gray-600">OPID: {patient.opid}</p>
        <p className="text-gray-600">Gender: {patient.gender}</p>
      </div>

      <h3 className="text-xl font-bold mt-6 mb-2">
        Update Patient Information
      </h3>

      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleUpdatePatient} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700">Complaint:</label>
          <div className="flex flex-col">
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Fever"
                checked={complaint.includes("Fever")}
                onChange={handleComplaintChange}
                className="mr-2"
              />
              Fever
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Diarrhea"
                checked={complaint.includes("Diarrhea")}
                onChange={handleComplaintChange}
                className="mr-2"
              />
              Diarrhea
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Cough"
                checked={complaint.includes("Cough")}
                onChange={handleComplaintChange}
                className="mr-2"
              />
              Cough
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Cold"
                checked={complaint.includes("Cold")}
                onChange={handleComplaintChange}
                className="mr-2"
              />
              Cold
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Others"
                checked={complaint.includes("Others")}
                onChange={handleComplaintChange}
                className="mr-2"
              />
              Others
            </label>
            {complaint.includes("Others") && (
              <textarea
                value={otherComplaint}
                onChange={(e) => setOtherComplaint(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-2"
                rows="4"
                placeholder="Please specify the complaint"
              />
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Medicines Prescribed:</label>
          <div className="flex flex-col">
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Dolo 65"
                checked={medicines.includes("Dolo 65")}
                onChange={handleMedicinesChange}
                className="mr-2"
              />
              Dolo 65
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Paracetamol"
                checked={medicines.includes("Paracetamol")}
                onChange={handleMedicinesChange}
                className="mr-2"
              />
              Paracetamol
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Cough Syrup"
                checked={medicines.includes("Cough Syrup")}
                onChange={handleMedicinesChange}
                className="mr-2"
              />
              Cough Syrup
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Patient
        </button>
      </form>
    </div>
  );
};

export default PatientPage;
