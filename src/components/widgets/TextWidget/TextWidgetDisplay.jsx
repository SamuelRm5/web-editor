// src/components/widgets/TextWidget/TextWidgetDisplay.jsx
import React from "react";

const TextWidgetDisplay = ({ widget }) => {
  return (
    <div className="text-widget-display w-full h-full flex items-start p-2">
      <div
        className="text-gray-800 select-none w-full"
        style={{
          fontFamily: widget.fontFamily || "Arial",
          color: widget.color || "#000",
          fontSize: `${widget.fontSize || 16}px`,
          whiteSpace: "pre-wrap",
          lineHeight: "1.4",
          wordBreak: "break-word",
          overflow: "hidden",
          textOverflow: "ellipsis",
          // Propiedades de formato
          fontWeight: widget.bold ? "bold" : "normal",
          fontStyle: widget.italic ? "italic" : "normal",
          textDecoration:
            [
              widget.underlined ? "underline" : "",
              widget.strikethrough ? "line-through" : "",
            ]
              .filter(Boolean)
              .join(" ") || "none",
          textAlign: widget.align || "left",
        }}
      >
        {widget.content || "Texto vacío"}
      </div>
    </div>
  );
};

export default TextWidgetDisplay;
