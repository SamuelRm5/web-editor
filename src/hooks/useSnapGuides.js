// src/hooks/useSnapGuides.js
import { useState, useCallback, useMemo } from "react";

const SNAP_THRESHOLD = 10; // pixels de distancia para activar el snap

// Función throttle en lugar de debounce para snap preciso
const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
  };
};

export const useSnapGuides = (canvasWidth, canvasHeight, widgets) => {
  const [activeGuides, setActiveGuides] = useState({
    vertical: [],
    horizontal: [],
  });

  // Calcular guías simples - solo canvas y bordes de widgets
  const availableGuides = useMemo(() => {
    const vertical = [
      { x: canvasWidth / 2, type: "canvas-center" }, // Solo centro del canvas
    ];

    const horizontal = [
      { y: canvasHeight / 2, type: "canvas-center" }, // Solo centro del canvas
    ];

    // Solo bordes de widgets (sin centros para evitar demasiadas líneas)
    widgets.forEach((widget) => {
      vertical.push(
        { x: widget.x, type: "widget-left", widgetId: widget.id },
        {
          x: widget.x + widget.width,
          type: "widget-right",
          widgetId: widget.id,
        }
      );

      horizontal.push(
        { y: widget.y, type: "widget-top", widgetId: widget.id },
        {
          y: widget.y + widget.height,
          type: "widget-bottom",
          widgetId: widget.id,
        }
      );
    });

    return { vertical, horizontal };
  }, [canvasWidth, canvasHeight, widgets]);

  // Función simplificada para calcular snap - OPTIMIZADA
  const calculateSnapInternal = useCallback(
    (draggedWidget, newX, newY) => {
      const draggedCenterX = newX + draggedWidget.width / 2;
      const draggedCenterY = newY + draggedWidget.height / 2;
      const draggedRight = newX + draggedWidget.width;
      const draggedBottom = newY + draggedWidget.height;

      let snappedX = newX;
      let snappedY = newY;
      const activeVertical = [];
      const activeHorizontal = [];

      // Solo una guía activa a la vez para evitar confusión
      let verticalSnapFound = false;
      let horizontalSnapFound = false;

      // Verificar snap horizontal (líneas verticales)
      for (const guide of availableGuides.vertical) {
        if (guide.widgetId === draggedWidget.id || verticalSnapFound) continue;

        const distances = [
          { pos: newX, snap: guide.x - newX, type: "left" },
          {
            pos: draggedCenterX,
            snap: guide.x - draggedCenterX,
            type: "center",
          },
          { pos: draggedRight, snap: guide.x - draggedRight, type: "right" },
        ];

        for (const dist of distances) {
          if (Math.abs(dist.snap) < SNAP_THRESHOLD) {
            snappedX = newX + dist.snap;
            activeVertical.push({
              x: guide.x,
              type: guide.type,
              widgetId: guide.widgetId,
            });
            verticalSnapFound = true;
            break;
          }
        }
      }

      // Verificar snap vertical (líneas horizontales)
      for (const guide of availableGuides.horizontal) {
        if (guide.widgetId === draggedWidget.id || horizontalSnapFound)
          continue;

        const distances = [
          { pos: newY, snap: guide.y - newY, type: "top" },
          {
            pos: draggedCenterY,
            snap: guide.y - draggedCenterY,
            type: "center",
          },
          { pos: draggedBottom, snap: guide.y - draggedBottom, type: "bottom" },
        ];

        for (const dist of distances) {
          if (Math.abs(dist.snap) < SNAP_THRESHOLD) {
            snappedY = newY + dist.snap;
            activeHorizontal.push({
              y: guide.y,
              type: guide.type,
              widgetId: guide.widgetId,
            });
            horizontalSnapFound = true;
            break;
          }
        }
      }

      // Actualizar guías activas
      setActiveGuides({
        vertical: activeVertical,
        horizontal: activeHorizontal,
      });

      return { x: snappedX, y: snappedY };
    },
    [availableGuides]
  );

  // Limpiar guías
  const clearGuides = useCallback(() => {
    setActiveGuides({ vertical: [], horizontal: [] });
  }, []);

  // 8ms para alta precisión
  const calculateSnap = useMemo(
    () => throttle(calculateSnapInternal, 8),
    [calculateSnapInternal]
  );

  return {
    activeGuides,
    calculateSnap,
    clearGuides,
  };
};
