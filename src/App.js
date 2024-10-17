import React from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import Home from "./Pages/Home";
import { UserProvider } from "./context/userContext";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/home", element: <Home /> },
]);

const App = () => {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
};

export default App;
