// src/components/SnapGuides.jsx
import React, { memo } from "react";

const SnapGuides = memo(({ activeGuides, canvasWidth, canvasHeight }) => {
  const { vertical, horizontal } = activeGuides;

  if (vertical.length === 0 && horizontal.length === 0) {
    return null;
  }

  const getGuideColor = (type) => {
    if (type.startsWith("canvas")) return "#3b82f6"; // Azul más suave para canvas
    return "#f59e0b"; // Naranja más suave para widgets
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9998, // Debajo de los botones de resize pero encima de widgets
      }}
    >
      {/* Guías verticales */}
      {vertical.map((guide, index) => (
        <div
          key={`vertical-${index}`}
          style={{
            position: "absolute",
            left: guide.x,
            top: 0,
            width: "1px",
            height: canvasHeight,
            backgroundColor: getGuideColor(guide.type),
            opacity: 0.6,
            animation: "fadeIn 0.15s ease-out",
          }}
        />
      ))}

      {/* Guías horizontales */}
      {horizontal.map((guide, index) => (
        <div
          key={`horizontal-${index}`}
          style={{
            position: "absolute",
            left: 0,
            top: guide.y,
            width: canvasWidth,
            height: "1px",
            backgroundColor: getGuideColor(guide.type),
            opacity: 0.6,
            animation: "fadeIn 0.15s ease-out",
          }}
        />
      ))}
    </div>
  );
});

export default SnapGuides;
