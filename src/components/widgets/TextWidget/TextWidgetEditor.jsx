// src/components/widgets/TextWidget/TextWidgetEditor.jsx
import React from "react";
import { useTextWidgetEditor } from "./hooks/useTextWidgetEditor";

const TextWidgetEditor = ({ widget, onUpdateWidget }) => {
  // Usar el hook personalizado que contiene toda la lógica pesada
  const {
    textareaRef,
    isResizing,
    handleContentChange,
    handleInput,
    handleBlur,
    handleKeyDown,
  } = useTextWidgetEditor(widget, onUpdateWidget);

  return (
    <div className="text-widget-editor w-full h-full">
      <textarea
        ref={textareaRef}
        value={widget.content}
        onChange={handleContentChange}
        onInput={handleInput}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`
          w-full h-full border-none outline-none bg-transparent resize-none
          ${isResizing ? "overflow-hidden" : "overflow-hidden"}
        `}
        style={{
          fontFamily: widget.fontFamily || "Arial",
          color: widget.color || "#000",
          fontSize: `${widget.fontSize || 16}px`,
          lineHeight: "1.4",
          padding: "8px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          minHeight: "38px",
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
        placeholder="Escribe aquí..."
        autoFocus
      />
    </div>
  );
};

export default TextWidgetEditor;
