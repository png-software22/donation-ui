import React, { useState } from "react";
import "./Dashboard.css";
import Expenses from "./Expenses";

const Dashboard = () => {
  const menuItems = ["Donations", "Expenses", "Reports"];
  const [selectedMenu, setSelectedMenu] = useState("Donations");

  return (
    <>
      <header className="header-section">dharamshala</header>

      <div className="layout">
        <div className="side-panel">
          <div className="vertical-menu">
            {menuItems.map((item) => (
              <div
                key={item}
                className={`item ${selectedMenu === item ? "selected" : ""}`}
                onClick={() => setSelectedMenu(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="main-section">
          {selectedMenu === "Donations" && (
            <div>We are in Donations</div>
          )}

          {selectedMenu === "Expenses" && (
            <Expenses goBack={() => setSelectedMenu("Donations")} />
          )}

          {selectedMenu === "Reports" && (
            <div>We are in Reports</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
