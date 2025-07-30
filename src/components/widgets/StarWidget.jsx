// src/components/widgets/StarWidget.jsx
import React from "react";

const StarWidget = ({ widget }) => {
  return (
    <div className="star-widget w-full h-full">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="drop-shadow-sm"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={widget.color || "#EF4444"} />
            <stop offset="100%" stopColor={widget.color || "#DC2626"} />
          </linearGradient>
        </defs>
        <path
          d="M50 5 L65 35 L95 35 L73 55 L80 90 L50 70 L20 90 L27 55 L5 35 L35 35 Z"
          fill="url(#starGradient)"
          stroke={widget.color || "#EF4444"}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default StarWidget;
