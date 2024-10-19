import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PatientPrescription = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8001/api/pharmacist/prescription/${id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log(response);
        setPatient(response.data.prescription);
      } catch (err) {
        setError("Failed to retrieve patient details.");
        console.error(err);
      }
    };

    fetchPatientDetails();
  }, [id]);

  const handleMarkMedicinesDone = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8001/api/pharmacist/mark-medicines-done/${id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log("the details are ", response);
      setSuccess("Medicines marked as done for the patient.");
      navigate("/home");
    } catch (err) {
      setError("Failed to mark medicines as done.");
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
    <div className="prescription-details p-4">
      <h2 className="text-2xl font-bold mb-4">Prescription Details</h2>
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">{patient.name}</h3>
        <p className="text-gray-600">Age: {patient.age}</p>
        <p className="text-gray-600">OPID: {patient.OPid}</p>
        <p className="text-gray-600">
          Medicines: {patient.medicines_prescribed}
        </p>
      </div>

      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
        onClick={handleMarkMedicinesDone}
      >
        Mark Medicines as Done
      </button>
    </div>
  );
};

export default PatientPrescription;
