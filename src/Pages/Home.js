import React from "react";
import { useUser } from "../context/userContext";
import Doctor from "../Components/Doctor";
import Receptionist from "../Components/Receptionist";
import Pharmacist from "../Components/Pharmacist";
const Home = () => {
  const { user } = useUser();

  const renderContentBasedOnRole = () => {
    switch (user.role) {
      case "doctor":
        return <Doctor />;
      case "receptionist":
        return <Receptionist />;
      case "pharmacist":
        return <Pharmacist />;
      default:
        return <p>You are not allowed </p>;
    }
  };

  return (
    <div>
      {renderContentBasedOnRole()}
    </div>
  );
};

export default Home;
