import React from "react";

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const spinnerStyle = {
  width: "60px",
  height: "60px",
  border: "6px solid #f3f3f3",
  borderTop: "6px solid #091923ff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

export default function Loader() {
  return (
    <div style={overlayStyle}>
      <div style={spinnerStyle}></div>
    </div>
  );
}
