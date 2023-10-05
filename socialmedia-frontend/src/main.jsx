import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NavBarContextProvider } from "./context/NavBarContext";
import { ContractContextProvider } from "./context/ContractContext";
import { UserContextProvider } from "./context/UserContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <NavBarContextProvider>
    <ContractContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </ContractContextProvider>
  </NavBarContextProvider>
);
