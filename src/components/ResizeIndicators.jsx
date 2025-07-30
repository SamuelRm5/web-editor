// src/components/ResizeIndicators.jsx
import React, { memo } from "react";

const ResizeIndicators = memo(({ resizeIndicators, isVisible }) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Esquinas - Solo mostrar si el resize está habilitado */}
      {resizeIndicators.topLeft && (
        <div className="absolute -top-1 -left-1 w-2 h-2 border border-[#FF6010] bg-[#FFEDDA] rounded-sm pointer-events-none" />
      )}
      {resizeIndicators.topRight && (
        <div className="absolute -top-1 -right-1 w-2 h-2 border border-[#FF6010] bg-[#FFEDDA] rounded-sm pointer-events-none" />
      )}
      {resizeIndicators.bottomLeft && (
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-[#FF6010] bg-[#FFEDDA] rounded-sm pointer-events-none" />
      )}
      {resizeIndicators.bottomRight && (
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border border-[#FF6010] bg-[#FFEDDA] rounded-sm pointer-events-none" />
      )}

      {/* Puntos laterales - Solo mostrar si el resize está habilitado */}
      {resizeIndicators.top && (
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-5 h-1.5 border border-[#FF6010] bg-[#FFEDDA] rounded-sm pointer-events-none" />
      )}
      {resizeIndicators.bottom && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-1.5 border border-[#FF6010] bg-[#FFEDDA] rounded-sm pointer-events-none" />
      )}
      {resizeIndicators.left && (
        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1.5 h-5 border border-[#FF6010] bg-[#FFEDDA] rounded-sm pointer-events-none" />
      )}
      {resizeIndicators.right && (
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-5 border border-[#FF6010] bg-[#FFEDDA] rounded-sm pointer-events-none" />
      )}
    </>
  );
});

export default ResizeIndicators;
