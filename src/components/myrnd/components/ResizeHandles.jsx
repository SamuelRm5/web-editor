// src/components/myrnd/components/ResizeHandles.jsx
import React from "react";

const ResizeHandles = ({ enableResizing, onMouseDown, isDragging }) => {
  // Ocultar handles durante drag
  if (isDragging || !enableResizing) return null;

  const handles = [
    "topLeft",
    "top",
    "topRight",
    "right",
    "bottomRight",
    "bottom",
    "bottomLeft",
    "left",
  ];

  return (
    <>
      {handles.map((handle) => (
        <div
          key={handle}
          className={`resize-handle-container resize-handle-container-${handle}`}
          onMouseDown={(e) => onMouseDown(e, handle)}
        >
          <div
            className={`resize-handle-visual resize-handle-visual-${handle}`}
          />
        </div>
      ))}
    </>
  );
};

export default ResizeHandles;
