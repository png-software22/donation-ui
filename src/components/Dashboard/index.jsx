import React, { useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const menuItems = ["Donations", "Expenses", "Reports"];
  const [selectedMenu, setSelectedMenu] = useState(menuItems[0]);
  console.log("Selected Menu:", selectedMenu);
  console.log("Menu Items:", menuItems);
console .log(selectedMenu === menuItems[0] && "We are in Donations");
  return (
    <>
  <header className="header-section">dharamshala</header>

  <div className="layout">
    <div className="side-panel">
      <div className="vertical-menu">
        {menuItems.map(item => (
          <div
            className={`item ${selectedMenu === item ? "selected" : ""}`}
            onClick={() => setSelectedMenu(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>

    <div className="main-section">
      {selectedMenu === menuItems[0] && "We are in Donations"}
      {selectedMenu === menuItems[1] && "We are in Expenses"}
      {selectedMenu === menuItems[2] && "We are in Reports"}
    </div>
  </div>
    </>
  );
};

export default Dashboard;






