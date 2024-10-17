import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const Doctor = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");

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
              Authorization: ` ${token}`,
            },
          }
        );
        setPatients(response.data.patients);
      } catch (err) {
        setError("Failed to fetch patients.");
        console.error(err);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="patient-list">
      <h2 className="text-lg font-bold">
        Welcome, Doctor! Here are your patient details:
      </h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {patients.length === 0 ? (
          <p>No patients available.</p>
        ) : (
          patients.map((patient) => (
            <li key={patient.id} className="p-2 border-b">
              <strong>{patient.name}</strong> (Age: {patient.age}, Gender:{" "}
              {patient.gender}) - OPID: {patient.opid}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Doctor;
