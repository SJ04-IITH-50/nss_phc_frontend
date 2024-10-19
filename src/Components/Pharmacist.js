import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const Pharmacist = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [donePrescriptions, setDonePrescriptions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:8001");

    socket.on("updatedPrescription", (updatedPrescription) => {
      setPrescriptions((prevPrescriptions) => [
        updatedPrescription,
        ...prevPrescriptions,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8001/api/pharmacist/view-prescriptions",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        const pendingPrescriptions = response.data.prescriptions.filter(
          (prescription) => !prescription.medicines_done
        );
        const donePrescriptions = response.data.prescriptions.filter(
          (prescription) => prescription.medicines_done
        );

        setPrescriptions(pendingPrescriptions);
        setDonePrescriptions(donePrescriptions);
      } catch (err) {
        setError("Failed to fetch prescriptions.");
        console.error(err);
      }
    };

    fetchPrescriptions();
  }, []);

  const handlePrescriptionClick = (id) => {
    navigate(`/prescription/${id}`);
  };

  return (
    <div className="prescription-list p-4">
      <h2 className="text-2xl font-bold mb-4">
        Welcome, Pharmacist! Here are the latest prescriptions:
      </h2>
      {error && <p className="error">{error}</p>}

      <h3 className="text-xl font-bold mb-4">Pending Prescriptions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prescriptions.length === 0 ? (
          <p>No pending prescriptions available.</p>
        ) : (
          prescriptions.map((prescription, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer"
              onClick={() => handlePrescriptionClick(prescription.id)}
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {prescription.name}
              </h3>
              <p className="text-gray-600">Age: {prescription.age}</p>
              <p className="text-gray-600">Gender: {prescription.gender}</p>
              <p className="text-gray-600">OPID: {prescription.OPid}</p>
              <p className="text-gray-600">
                Medicines: {prescription.medicines_prescribed}
              </p>
            </div>
          ))
        )}
      </div>

      <h3 className="text-xl font-bold mb-4 mt-6">Medicines Done Patients</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {donePrescriptions.length === 0 ? (
          <p>No patients have completed their prescriptions yet.</p>
        ) : (
          donePrescriptions.map((prescription, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {prescription.name}
              </h3>
              <p className="text-gray-600">Age: {prescription.age}</p>
              <p className="text-gray-600">Gender: {prescription.gender}</p>
              <p className="text-gray-600">OPID: {prescription.OPid}</p>
              <p className="text-gray-600">
                Medicines: {prescription.medicines_prescribed}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Pharmacist;
