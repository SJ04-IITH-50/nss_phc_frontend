import React, { useEffect, useState } from "react";
import "../Styles/Doctor.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Doctor = () => {
  const [patients, setPatients] = useState([]);
  const [prescribedPatients, setPrescribedPatients] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const generatePDF = (index) => {
    const patient = prescribedPatients[index];
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(17);
    doc.setFont("helvetica", "bold");
    doc.text("Telangana PHC", 14, 20);
    doc.setLineWidth(0.4);
    doc.line(14, 24, 196, 24);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Prescription", 14, 30);
    doc.setLineWidth(0.4);
    doc.line(14, 34, 196, 34);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const details = [
      `Name: ${patient.name}`,
      `Age: ${patient.age}`,
      `Gender: ${patient.gender}`,
      `Aadhar Number: ${patient.aadhar_number}`,
    ];

    details.forEach((detail, i) => {
      doc.text(detail, 14, 40 + i * 10);
    });

    const complaintsString = patient.complaint.replace(/[{}"]/g, "").trim();
    const complaints = complaintsString.split(",").map((item) => item.trim());
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Complaint(s):", 14, 80);
    doc.setFont("helvetica", "normal");
    complaints.forEach((complaint, i) => {
      doc.text(`- ${complaint}`, 20, 90 + i * 10);
    });
    const medicinesString = patient.medicines_prescribed
      .replace(/[{}"]/g, "")
      .trim();
    const medicines = medicinesString.split(",").map((item) => item.trim());
    const startY = 92 + complaints.length * 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Medicines Prescribed:", 14, startY);
    doc.setFont("helvetica", "normal");

    medicines.forEach((medicine, i) => {
      doc.text(`- ${medicine}`, 20, startY + 10 + i * 10);
    });

    const listEndY = startY + 6 + medicines.length * 10;
    doc.setLineWidth(0.4);
    doc.line(14, listEndY + 10, 196, listEndY + 10);
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text("Date: " + new Date().toLocaleDateString(), 14, listEndY + 25);

    doc.save(`Prescription-${patient.name}.pdf`);
  };

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

          <h2 className="section-title">Download Prescription</h2>
          <div className="patients">
            {prescribedPatients.length === 0 ? (
              <p className="message">No prescribed patients available.</p>
            ) : (
              prescribedPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  className="patient-card"
                  onClick={() => generatePDF(index)}
                >
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
