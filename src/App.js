import React from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import Home from "./Pages/Home";
import PatientPage from "./Pages/Patient";
import PatientPrescription from "./Pages/Patientprescription";
import { UserProvider } from "./context/userContext";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/home", element: <Home /> },
  { path: "/patient/:id", element: <PatientPage /> },
  { path: "/prescription/:id", element: <PatientPrescription /> },
]);

const App = () => {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
};

export default App;
