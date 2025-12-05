import { useState } from "react";
import { Nav, NavItem } from "reactstrap";
import "./sidebar.css";

import {
  FiHome,
  FiUsers,
  FiFileText,
  FiArrowLeftCircle,
  FiArrowRightCircle,
  FiLayers,
  FiLogOut
} from "react-icons/fi";

export default function Sidebar({ onMenuSelect, activeMenu }) {
  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="sidebar-header">
        {open && <h4 className="sidebar-title">Dharamshala</h4>}

        <button onClick={() => setOpen(!open)} className="toggle-btn">
          {open ? <FiArrowLeftCircle size={24} /> : <FiArrowRightCircle size={24} />}
        </button>
      </div>

      <Nav vertical pills className="menu-container">

        <NavItem
          className={`menu-item ${activeMenu === "dashboard" ? "active" : ""} ${!open ? "center-icon" : ""}`}
          onClick={() => onMenuSelect("dashboard")}
        >
          <FiHome size={18} />
          {open && <span className="menu-text">Dashboard</span>}
        </NavItem>

        {/* Add Donation */}
        <NavItem
          className={`menu-item ${activeMenu === "add-donation" ? "active" : ""} ${!open ? "center-icon" : ""}`}
          onClick={() => onMenuSelect("add-donation")}
        >
          <FiUsers size={18} />
          {open && <span className="menu-text">Add Donation</span>}
        </NavItem>

        {/* Donations List */}
        <NavItem
          className={`menu-item ${activeMenu === "donations" ? "active" : ""} ${!open ? "center-icon" : ""}`}
          onClick={() => onMenuSelect("donations")}
        >
          <FiUsers size={18} />
          {open && <span className="menu-text">Donations</span>}
        </NavItem>

        <NavItem
          className={`menu-item ${activeMenu === "expenses" ? "active" : ""} ${!open ? "center-icon" : ""}`}
          onClick={() => onMenuSelect("expenses")}
        >
          <FiFileText size={18} />
          {open && <span className="menu-text">Expenses</span>}
        </NavItem>

        <NavItem
          className={`menu-item ${activeMenu === "reports" ? "active" : ""} ${!open ? "center-icon" : ""}`}
          onClick={() => onMenuSelect("reports")}
        >
          <FiLayers size={18} />
          {open && <span className="menu-text">Reports</span>}
        </NavItem>
      </Nav>

      <div className="logout-container">
        <div
          className={`logout-btn ${!open ? "center-icon" : ""}`}
          onClick={handleLogout}
        >
          <FiLogOut size={20} />
          {open && <span className="menu-text">Logout</span>}
        </div>
      </div>
    </div>
  );
}
