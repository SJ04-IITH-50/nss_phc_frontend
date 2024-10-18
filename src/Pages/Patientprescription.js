import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PatientPrescription = () => {
  const { id } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8001/api/pharmacist/prescription/${id}`,
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );
        setPrescription(response.data.prescription);
      } catch (err) {
        setError("Failed to retrieve prescription details.");
        console.error(err);
      }
    };

    fetchPrescriptionDetails();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!prescription) {
    return <p>Loading prescription details...</p>;
  }

  return (
    <div className="prescription-details p-4">
      <h2 className="text-2xl font-bold mb-4">Prescription Details</h2>
      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">
          {prescription.name}
        </h3>
        <p className="text-gray-600">Age: {prescription.age}</p>
        <p className="text-gray-600">OPID: {prescription.opid}</p>
        <p className="text-gray-600">Gender: {prescription.gender}</p>
        <p className="text-gray-600">Complaint: {prescription.complaint}</p>
        <p className="text-gray-600">
          Medicines Prescribed: {prescription.medicines_prescribed}
        </p>
      </div>
    </div>
  );
};

export default PatientPrescription;
