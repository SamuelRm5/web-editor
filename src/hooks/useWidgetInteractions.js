// src/hooks/useWidgetInteractions.js
import { useState, useCallback, useMemo } from "react";
import { useOptimizedDrag } from "./useOptimizedDrag";

export const useWidgetInteractions = ({
  widget,
  onUpdateWidget,
  onSelectWidget,
  onRemoveWidget,
  selectedId,
  calculateSnap,
  clearGuides,
  canvasWidth = 960,
  canvasHeight = 540,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const optimizedUpdate = useOptimizedDrag(onUpdateWidget);

  // Función para verificar si el widget está completamente fuera del canvas
  const isCompletelyOutOfBounds = useCallback(
    (x, y, width, height) => {
      return (
        x + width <= 0 || // Completamente a la izquierda
        x >= canvasWidth || // Completamente a la derecha
        y + height <= 0 || // Completamente arriba
        y >= canvasHeight // Completamente abajo
      );
    },
    [canvasWidth, canvasHeight]
  );

  // Drag handlers
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDrag = useCallback(
    (e, d) => {
      // Solo mostrar guías durante el drag, no actualizar posición
      if (calculateSnap) {
        calculateSnap(widget, d.x, d.y);
      }
    },
    [widget, calculateSnap]
  );

  const handleDragStop = useCallback(
    (e, d) => {
      setIsDragging(false);
      clearGuides?.();

      // Verificar si el widget está completamente fuera del canvas
      if (isCompletelyOutOfBounds(d.x, d.y, widget.width, widget.height)) {
        // Eliminar el widget si está completamente fuera
        onRemoveWidget?.(widget.id);
        return;
      }

      // Aplicar snap solo al final del drag
      if (calculateSnap) {
        const snappedPosition = calculateSnap(widget, d.x, d.y);
        optimizedUpdate(widget.id, snappedPosition);
      } else {
        optimizedUpdate(widget.id, { x: d.x, y: d.y });
      }
    },
    [
      widget,
      optimizedUpdate,
      calculateSnap,
      clearGuides,
      isCompletelyOutOfBounds,
      onRemoveWidget,
    ]
  );

  // Resize handlers
  const handleResizeStart = useCallback(() => {
    // No need to track resize state
  }, []);

  const handleResizeStop = useCallback(
    (e, direction, ref, delta, position) => {
      const newWidth = parseInt(ref.style.width, 10);
      const newHeight = parseInt(ref.style.height, 10);

      // Verificar si el widget está completamente fuera del canvas después del resize
      if (
        isCompletelyOutOfBounds(position.x, position.y, newWidth, newHeight)
      ) {
        // Eliminar el widget si está completamente fuera
        onRemoveWidget?.(widget.id);
        return;
      }

      optimizedUpdate(widget.id, {
        width: newWidth,
        height: newHeight,
        x: position.x,
        y: position.y,
      });
    },
    [widget.id, optimizedUpdate, isCompletelyOutOfBounds, onRemoveWidget]
  );

  // Click handler
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation(); // Evitar que el click se propague al canvas
      onSelectWidget(widget.id);
    },
    [widget.id, onSelectWidget]
  );

  // Computed values
  const isSelected = widget.id === selectedId;

  // Memoizar el tamaño y posición para evitar recrear objetos
  const size = useMemo(
    () => ({ width: widget.width, height: widget.height }),
    [widget.width, widget.height]
  );

  const position = useMemo(
    () => ({ x: widget.x, y: widget.y }),
    [widget.x, widget.y]
  );

  return {
    // State
    isDragging,
    isSelected,
    size,
    position,

    // Handlers
    handleDragStart,
    handleDrag,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
    handleClick,
  };
};
