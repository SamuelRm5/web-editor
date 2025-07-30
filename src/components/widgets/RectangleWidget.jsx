// src/components/widgets/RectangleWidget.jsx
import React from "react";

const RectangleWidget = ({ widget }) => {
  return (
    <div
      className="rectangle-widget w-full h-full border-2 border-opacity-50"
      style={{
        backgroundColor: widget.color || "#3B82F6",
        borderColor: widget.color || "#3B82F6",
      }}
    />
  );
};

export default RectangleWidget;
