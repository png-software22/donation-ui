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
  FiLogOut,
} from "react-icons/fi";
import { USER_KEY } from "../../constant";

export default function Sidebar({ onMenuSelect, activeMenu }) {
  const [open, setOpen] = useState(true);

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <FiHome size={18} /> },
    { key: "add-donation", label: "Add Donor", icon: <FiUsers size={18} /> },
    {
      key: "donations",
      label: "Manage Donations",
      icon: <FiUsers size={18} />,
    },
    { key: "expenses", label: "Expenses", icon: <FiFileText size={18} /> },
    { key: "reports", label: "Reports", icon: <FiLayers size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    window.location.href = "/";
  };

  return (
    <div className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="sidebar-header">
        {open && <h4 className="sidebar-title">Dharamshala</h4>}

        <button onClick={() => setOpen(!open)} className="toggle-btn">
          {open ? (
            <FiArrowLeftCircle size={24} />
          ) : (
            <FiArrowRightCircle size={24} />
          )}
        </button>
      </div>

      <Nav vertical pills className="menu-container">
        {menuItems.map((item) => (
          <NavItem
            key={item.key}
            className={`menu-item ${activeMenu === item.key ? "active" : ""} ${
              !open ? "center-icon" : ""
            }`}
            onClick={() => onMenuSelect(item.key)}
          >
            {item.icon}
            {open && <span className="menu-text">{item.label}</span>}
            {!open && <span className="tooltip">{item.label}</span>}
          </NavItem>
        ))}
      </Nav>

      <div className="logout-container">
        <div
          className={`logout-btn ${!open ? "center-icon" : ""}`}
          onClick={handleLogout}
        >
          <FiLogOut size={20} />
          {open && <span className="menu-text">Logout</span>}
          {!open && <span className="tooltip">Logout</span>}
        </div>
      </div>
    </div>
  );
}
