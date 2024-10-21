import React, { useEffect, useState } from "react";
import '../Styles/Doctor.css';
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
    <div className="doctor-container">
      <div className="title-flex">
        <h1>Home Page</h1>
      </div>

      <div className="content-flex">
        <h2 className="welcome-title">Welcome, Doctor!</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="patients-section">
          <h2 className="section-title">Unprescribed Patients</h2>
          <div className="patients">
            {patients.length === 0 ? (
              <p className="message">No unprescribed patients available.</p>
            ) : (
              patients.map((patient) => (
                <div
                  key={patient.id}
                  className="patient-card"
                  onClick={() => handlePatientClick(patient.id)}
                >
                  <h3 className="patient-name">{patient.name}</h3>
                  <p className="patient-details">Age: {patient.age}</p>
                  <p className="patient-details">Gender: {patient.gender}</p>
                  <p className="patient-details">OPID: {patient.opid}</p>
                </div>
              ))
            )}
          </div>

          <h2 className="section-title">Prescribed Patients</h2>
          <div className="patients">
            {prescribedPatients.length === 0 ? (
              <p className="message">No prescribed patients available.</p>
            ) : (
              prescribedPatients.map((patient) => (
                <div key={patient.id} className="patient-card">
                  <h3 className="patient-name">{patient.name}</h3>
                  <p className="patient-details">Age: {patient.age}</p>
                  <p className="patient-details">Gender: {patient.gender}</p>
                  <p className="patient-details">OPID: {patient.opid}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Copyright© 2024</p>
      </footer>
    </div>
  );
};

export default Doctor;
