// src/components/myrnd/components/ResizeHandles.jsx
import React from "react";

const ResizeHandles = ({
  enableResizing,
  onMouseDown,
  isDragging,
  handleConfig, // Configuración dinámica de handles
}) => {
  // Ocultar handles durante drag
  if (isDragging || !enableResizing) return null;

  // Usar configuración dinámica si está disponible
  const activeHandles = handleConfig || {
    topLeft: true,
    top: true,
    topRight: true,
    right: true,
    bottomRight: true,
    bottom: true,
    bottomLeft: true,
    left: true,
  };

  const allHandles = [
    "topLeft",
    "top",
    "topRight",
    "right",
    "bottomRight",
    "bottom",
    "bottomLeft",
    "left",
  ];

  // Filtrar solo los handles activos según la configuración
  const visibleHandles = allHandles.filter((handle) => activeHandles[handle]);

  return (
    <>
      {visibleHandles.map((handle) => (
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
