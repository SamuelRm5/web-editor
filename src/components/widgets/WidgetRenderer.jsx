// src/components/widgets/WidgetRenderer.jsx
import React from "react";
import ImageWidget from "./ImageWidget";
import RectangleWidget from "./RectangleWidget";
import CircleWidget from "./CircleWidget";
import StarWidget from "./StarWidget";

const WidgetRenderer = ({ widget }) => {
  switch (widget.type) {
    case "image":
      return <ImageWidget widget={widget} />;
    case "rectangle":
      return <RectangleWidget widget={widget} />;
    case "circle":
      return <CircleWidget widget={widget} />;
    case "star":
      return <StarWidget widget={widget} />;
    default:
      return (
        <div className="unknown-widget w-full h-full flex items-center justify-center bg-red-100 border-2 border-red-300 rounded">
          <span className="text-red-600 text-sm">
            Widget desconocido: {widget.type}
          </span>
        </div>
      );
  }
};

export default WidgetRenderer;
