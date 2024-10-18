import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PatientPage = () => {
  const { id } = useParams(); 
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");

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
        <p className="text-gray-600">OPID: {patient.OPid}</p>
        <p className="text-gray-600">Gender: {patient.gender}</p>
      </div>
    </div>
  );
};

export default PatientPage;
