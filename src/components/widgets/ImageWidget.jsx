// src/components/widgets/ImageWidget.jsx
import React from "react";

const ImageWidget = ({ widget }) => {
  return (
    <div className="image-widget w-full h-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
      <span className="text-gray-500 text-2xl select-none">
        {widget.content}
      </span>
    </div>
  );
};

export default ImageWidget;
