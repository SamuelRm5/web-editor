// src/components/widgets/ImageWidget.jsx
import React, { useState } from "react";

const ImageWidget = ({ widget }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e) => {
    console.error("Error loading image:", widget.src, e);
    setImageLoading(false);
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
        <div className="text-center">
          <div>❌ Error cargando imagen</div>
          <div className="text-xs mt-1 break-all px-2">{widget.src}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500 animate-spin">🔄</div>
        </div>
      )}
      <img
        src={widget.src}
        alt="Image Widget"
        className="w-full h-full"
        style={{
          objectFit: "cover", // Usar cover para llenar el contenedor sin espacios
          objectPosition: "center",
          display: imageLoading ? "none" : "block",
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default ImageWidget;
