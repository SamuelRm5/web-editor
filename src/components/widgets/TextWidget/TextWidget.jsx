// src/components/widgets/TextWidget/TextWidget.jsx
import React, { useEffect, useMemo, useCallback } from "react";
import TextWidgetEditor from "./TextWidgetEditor";
import TextWidgetDisplay from "./TextWidgetDisplay";
import { calculateTextHeight, shouldAutoResize } from "./utils/textWidgetUtils";

/**
 *
 * Este componente se divide en dos subcomponentes:
 * TextWidgetEditor para el modo de edición
 * TextWidgetDisplay para el modo de visualización.
 * Ambos utilizan funciones para actualizar el widget y calcular la altura del texto.
 *
 * @param {Object} param0
 * @param {Object} param0.widget - The widget data.
 * @param {boolean} param0.isEditing - Whether the widget is in editing mode.
 * @param {Function} param0.onUpdateWidget - Callback to update the widget.
 * @returns
 */

const TextWidget = ({ widget, isEditing, onUpdateWidget }) => {
  // Memoizar las propiedades que afectan el tamaño
  const textProperties = useMemo(
    () => ({
      content: widget.content,
      fontSize: widget.fontSize || 16,
      fontFamily: widget.fontFamily || "Arial",
      width: widget.width || 200,
      bold: widget.bold,
      italic: widget.italic,
    }),
    [
      widget.content,
      widget.fontSize,
      widget.fontFamily,
      widget.width,
      widget.bold,
      widget.italic,
    ]
  );

  // Función memoizada para calcular la altura
  const calculateHeight = useCallback(() => {
    return calculateTextHeight(
      textProperties.content,
      textProperties.fontSize,
      textProperties.fontFamily,
      textProperties.width,
      textProperties.bold,
      textProperties.italic
    );
  }, [textProperties]);

  // Auto-resize solo en modo visualización y cuando sea necesario
  useEffect(() => {
    if (!isEditing && onUpdateWidget) {
      const newHeight = calculateHeight();

      if (shouldAutoResize(widget.height, newHeight)) {
        onUpdateWidget(widget.id, { height: newHeight });
      }
    }
  }, [isEditing, onUpdateWidget, widget.id, widget.height, calculateHeight]);

  if (isEditing) {
    return <TextWidgetEditor widget={widget} onUpdateWidget={onUpdateWidget} />;
  }

  return <TextWidgetDisplay widget={widget} />;
};

export default TextWidget;
