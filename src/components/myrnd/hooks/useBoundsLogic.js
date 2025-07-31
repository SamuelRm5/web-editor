// src/components/myrnd/hooks/useBoundsLogic.js
import { useCallback } from "react";

export const useBoundsLogic = ({
  bounds,
  maxWidth,
  maxHeight,
  canvasWidth,
  canvasHeight,
  onOutOfBounds,
  widgetData,
}) => {
  // Función para aplicar bounds condicionalmente
  const applyBounds = useCallback(
    (newPosition, newSize) => {
      let { x, y } = newPosition;
      let { width, height } = newSize;

      // Aplicar límites de tamaño solamente
      if (maxWidth) width = Math.min(width, maxWidth);
      if (maxHeight) height = Math.min(height, maxHeight);

      // Solo aplicar bounds del canvas si bounds === true
      if (bounds === true) {
        // Restringir dentro del canvas
        x = Math.max(0, Math.min(x, canvasWidth - width));
        y = Math.max(0, Math.min(y, canvasHeight - height));
      } else if (bounds && typeof bounds === "object") {
        // Aplicar bounds personalizados (objeto con left, top, right, bottom)
        if (bounds.left !== undefined) {
          x = Math.max(x, bounds.left);
        }
        if (bounds.top !== undefined) {
          y = Math.max(y, bounds.top);
        }
        if (bounds.right !== undefined) {
          x = Math.min(x, bounds.right - width);
        }
        if (bounds.bottom !== undefined) {
          y = Math.min(y, bounds.bottom - height);
        }
      }
      // Si bounds === false o undefined, movimiento completamente libre

      return {
        position: { x, y },
        size: { width, height },
      };
    },
    [bounds, maxWidth, maxHeight, canvasWidth, canvasHeight]
  );

  // Función para detectar si está completamente fuera del canvas
  const checkOutOfBounds = useCallback(
    (position, size) => {
      // Solo verificar out of bounds si NO tiene bounds activados
      if (!onOutOfBounds || bounds === true) return false;

      // Validar que position y size sean válidos
      if (
        !position ||
        !size ||
        typeof position.x === "undefined" ||
        typeof position.y === "undefined"
      ) {
        console.warn("checkOutOfBounds called with invalid position or size:", {
          position,
          size,
        });
        return false;
      }

      const { x, y } = position;
      const { width, height } = size;

      // Verificar si el elemento está COMPLETAMENTE fuera del canvas
      const completelyOutLeft = x + width < 0;
      const completelyOutRight = x > canvasWidth;
      const completelyOutTop = y + height < 0;
      const completelyOutBottom = y > canvasHeight;

      const isCompletelyOut =
        completelyOutLeft ||
        completelyOutRight ||
        completelyOutTop ||
        completelyOutBottom;

      if (isCompletelyOut) {
        console.log(
          "Element completely out of bounds, deleting...",
          widgetData
        );
        onOutOfBounds(widgetData);
        return true;
      }

      return false;
    },
    [onOutOfBounds, canvasWidth, canvasHeight, bounds, widgetData]
  );

  return {
    applyBounds,
    checkOutOfBounds,
  };
};
