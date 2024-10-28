import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PatientPrescription = () => {
  const { id } = useParams();
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8001/api/pharmacist/prescription/${id}/medicines`,
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );
        setMedicines(response.data.medicines);
        console.log("the data is ", response.data);
      } catch (err) {
        setError("Failed to retrieve medicines.");
        console.error(err);
      }
    };

    fetchMedicines();
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
  const handleMedicineDone = async (medicineId, doneStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8001/api/pharmacist/medicine/${medicineId}/done`,
        { done: doneStatus },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setMedicines((prevMedicines) =>
        prevMedicines.map((medicine) =>
          medicine.id === medicineId
            ? { ...medicine, medicine_done: doneStatus }
            : medicine
        )
      );
    } catch (err) {
      console.error("Failed to update medicine status.", err);
    }
  };

  return (
    <div className="prescription-details p-4">
      <h2 className="text-2xl font-bold mb-4">Prescription Medicines</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {medicines.map((medicine) => (
          <li key={medicine.id} className="flex items-center mb-2">
            <span className="flex-grow">{medicine.medicine_name}</span>
            <input
              type="checkbox"
              checked={medicine.medicine_done}
              onChange={() =>
                handleMedicineDone(medicine.id, !medicine.medicine_done)
              }
            />
          </li>
        ))}
      </ul>
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleMarkMedicinesDone} 
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
      >
        Go to Home
      </button>
    </div>
  );
};

export default PatientPrescription;
