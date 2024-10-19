import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const Doctor = () => {
  const [patients, setPatients] = useState([]);
  const [prescribedPatients, setPrescribedPatients] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:8001");

    socket.on("newPatient", (newPatient) => {
      setPatients((prevPatients) => [newPatient, ...prevPatients]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8001/api/doctor/view-patients",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const unprescribedPatients = response.data.patients.filter(
          (patient) => !patient.is_prescribed
        );
        const prescribedPatients = response.data.patients.filter(
          (patient) => patient.is_prescribed
        );

        setPatients(unprescribedPatients);
        setPrescribedPatients(prescribedPatients);
      } catch (err) {
        setError("Failed to fetch patients.");
        console.error(err);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <div className="patient-list p-4">
      <h2 className="text-2xl font-bold mb-4">
        Welcome, Doctor! Here are your patients:
      </h2>
      {error && <p className="error">{error}</p>}
      <h3 className="text-xl font-bold mb-4">Unprescribed Patients</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.length === 0 ? (
          <p>No unprescribed patients available.</p>
        ) : (
          patients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer"
              onClick={() => handlePatientClick(patient.id)}
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {patient.name}
              </h3>
              <p className="text-gray-600">Age: {patient.age}</p>
              <p className="text-gray-600">Gender: {patient.gender}</p>
              <p className="text-gray-600">OPID: {patient.opid}</p>
            </div>
          ))
        )}
      </div>
      <h3 className="text-xl font-bold mb-4 mt-6">Prescribed Patients</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prescribedPatients.length === 0 ? (
          <p>No prescribed patients available.</p>
        ) : (
          prescribedPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {patient.name}
              </h3>
              <p className="text-gray-600">Age: {patient.age}</p>
              <p className="text-gray-600">Gender: {patient.gender}</p>
              <p className="text-gray-600">OPID: {patient.opid}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Doctor;
