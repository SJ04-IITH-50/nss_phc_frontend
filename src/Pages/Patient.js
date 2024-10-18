import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PatientPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [complaint, setComplaint] = useState("");
  const [medicines, setMedicines] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

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
        console.log("the patient", response.data);
        setComplaint(response.data.patient.complaint || "");
        setMedicines(response.data.patient.medicines_prescribed || "");
      } catch (err) {
        setError("Failed to retrieve patient details.");
        console.error(err);
      }
    };

    fetchPatientDetails();
  }, [id]);

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8001/api/doctor/patient/update/${id}`,
        { complaint, medicines },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log("the patient", patient);
      setSuccess("Patient details updated successfully.");
      setPatient(response.data.patient);

      setComplaint("");
      setMedicines("");
      navigate("/home");
    } catch (err) {
      setError("Failed to update patient details.");
      console.error(err);
    }
  };

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
          <textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Medicines Prescribed:</label>
          <textarea
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            required
          />
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
