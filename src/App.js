/*import logo from "./logo.svg";
import "./styles/App.css";
import Login from "./components/Auth/login";
import { BrowserRouter, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import { Route } from "react-router-dom";  // ✅ CORRECT
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return <Dashboard />;
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
} 


export default App;*/
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard";   // ✅ Only this import
import Login from "./components/Auth/login";               // If needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;



