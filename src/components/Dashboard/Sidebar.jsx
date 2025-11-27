import { useState } from "react";
import { Nav, NavItem } from "reactstrap";
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiArrowLeftCircle,
  FiArrowRightCircle,
  FiLayers
} from "react-icons/fi";

export default function Sidebar({ onMenuSelect, activeMenu }) {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        height: "100vh",
        width: open ? "240px" : "80px",
        backgroundColor: "#4B49AC",
        transition: "0.3s",
        color: "white",
        paddingTop: "20px",
        position: "fixed",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: open ? "space-between" : "center",
          alignItems: "center",
          padding: "0 15px",
          marginBottom: "25px",
        }}
      >
        {open && <h4 style={{ margin: 0 }}>Dharamshala</h4>}

        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          {open ? <FiArrowLeftCircle size={24} /> : <FiArrowRightCircle size={24} />}
        </button>
      </div>

      <Nav vertical pills style={{ paddingLeft: "10px" }}>

        <NavItem
          onClick={() => onMenuSelect("dashboard")}
          style={{
            ...menuItemStyle,
            backgroundColor: activeMenu === "dashboard" ? "#6C63FF" : "transparent",
          }}
        >
          <FiHome size={18} />
          {open && <span style={textStyle}>Dashboard</span>}
        </NavItem>

        <NavItem
          onClick={() => onMenuSelect("donations")}
          style={{
            ...menuItemStyle,
            backgroundColor: activeMenu === "donations" ? "#6C63FF" : "transparent",
          }}
        >
          <FiUsers size={18} />
          {open && <span style={textStyle}>Donations</span>}
        </NavItem>

        <NavItem
          onClick={() => onMenuSelect("expenses")}
          style={{
            ...menuItemStyle,
            backgroundColor: activeMenu === "expenses" ? "#6C63FF" : "transparent",
          }}
        >
          <FiFileText size={18} />
          {open && <span style={textStyle}>Expenses</span>}
        </NavItem>

        <NavItem
          onClick={() => onMenuSelect("reports")}
          style={{
            ...menuItemStyle,
            backgroundColor: activeMenu === "reports" ? "#6C63FF" : "transparent",
          }}
        >
          <FiLayers size={18} />
          {open && <span style={textStyle}>Reports</span>}
        </NavItem>

      </Nav>
    </div>
  );
}

const menuItemStyle = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
  padding: "12px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  color: "white",
  fontSize: "16px",
  marginBottom: "10px",
  transition: "0.2s",
};

const textStyle = { marginLeft: "10px" };
