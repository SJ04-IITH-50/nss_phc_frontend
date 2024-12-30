import React, { useEffect, useState } from "react";
import "../Styles/Pharmacist.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const Pharmacist = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [donePrescriptions, setDonePrescriptions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("https://nss-phc-backend.onrender.com");
    socket.on("updatedPrescription", (updatedPrescription) => {
      if (updatedPrescription.medicines_done) {
        setDonePrescriptions((prev) => [updatedPrescription, ...prev]);
        setPrescriptions((prev) =>
          prev.filter((p) => p.id !== updatedPrescription.id)
        );
      } else {
        setPrescriptions((prev) => [updatedPrescription, ...prev]);
      }
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
          "https://nss-phc-backend.onrender.com/api/pharmacist/view-prescriptions",
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
    <div className="pharmacist-container">
      <div className="title-flex">
        <h1>Home Page</h1>
      </div>

      <div className="content-flex">
        <h2 className="welcome-title">Welcome, Pharmacist!</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="prescription-section">
          <h2 className="section-title">Pending Prescriptions</h2>
          <div className="prescriptions">
            {prescriptions.length === 0 ? (
              <p className="message">No pending prescriptions available.</p>
            ) : (
              prescriptions.map((prescription, index) => (
                <div
                  key={index}
                  className="prescription-card"
                  onClick={() => handlePrescriptionClick(prescription.id)}
                >
                  <h3 className="prescription-name">{prescription.name}</h3>
                  <p className="prescription-details">
                    Age: {prescription.age}
                  </p>
                  <p className="prescription-details">
                    Gender: {prescription.gender}
                  </p>
                  <p className="prescription-details">
                    OPID: {prescription.opid}
                  </p>
                  <p className="prescription-details">
                    Medicines: {prescription.medicines_prescribed}
                  </p>
                </div>
              ))
            )}
          </div>

          <h2 className="section-title">Medicines Done Patients</h2>
          <div className="prescriptions">
            {donePrescriptions.length === 0 ? (
              <p className="message">
                No patients have completed their prescriptions yet.
              </p>
            ) : (
              donePrescriptions.map((prescription, index) => (
                <div key={index} className="prescription-card">
                  <h3 className="prescription-name">{prescription.name}</h3>
                  <p className="prescription-details">
                    Age: {prescription.age}
                  </p>
                  <p className="prescription-details">
                    Gender: {prescription.gender}
                  </p>
                  <p className="prescription-details">
                    OPID: {prescription.opid}
                  </p>
                  <p className="prescription-details">
                    Medicines: {prescription.medicines_prescribed}
                  </p>
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

export default Pharmacist;
