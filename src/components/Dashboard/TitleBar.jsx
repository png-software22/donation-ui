import React from "react";
import "./TitleBar.css";

export default function TitleBar({ title }) {
  return (
    <div className="titlebar">
      <h3 className="title-text">{title}</h3>

      <div className="title-profile">
        <img
          src="https://i.pravatar.cc/40?img=12"
          className="profile-pic"
          alt="profile"
        />
        <span className="profile-name">Bhagwati Bhawan</span>
        <span className="profile-arrow">▼</span>
      </div>
    </div>
  );
}
