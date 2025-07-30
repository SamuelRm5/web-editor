// src/components/widgets/CircleWidget.jsx
import React from "react";

const CircleWidget = ({ widget }) => {
  return (
    <div
      className="circle-widget w-full h-full rounded-full border-2 border-opacity-50"
      style={{
        backgroundColor: widget.color || "#10B981",
        borderColor: widget.color || "#10B981",
      }}
    />
  );
};

export default CircleWidget;
