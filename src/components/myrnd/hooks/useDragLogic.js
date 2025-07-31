// src/components/myrnd/hooks/useDragLogic.js
import { useState, useRef, useCallback } from "react";

export const useDragLogic = ({
  disableDragging,
  dragHandleClassName,
  currentPosition,
  currentSize,
  applyBounds,
  onDragStart,
  onDrag,
  onDragStop,
  onMouseDown,
  checkOutOfBounds,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });

  const handleMouseDownDrag = useCallback(
    (e) => {
      if (disableDragging) return;

      // Verificar si el elemento clicado tiene la clase drag-handle
      const target = e.target;
      const isDragHandle = target.closest(`.${dragHandleClassName}`);
      if (!isDragHandle) return;

      e.preventDefault();
      e.stopPropagation();

      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        elementX: currentPosition.x,
        elementY: currentPosition.y,
      };

      setIsDragging(true);
      onDragStart &&
        onDragStart(e, {
          x: currentPosition.x,
          y: currentPosition.y,
        });

      onMouseDown && onMouseDown(e);
    },
    [
      disableDragging,
      dragHandleClassName,
      currentPosition,
      onDragStart,
      onMouseDown,
    ]
  );

  const handleMouseMoveDrag = useCallback(
    (e, setCurrentPosition) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      let newX = dragStartRef.current.elementX + deltaX;
      let newY = dragStartRef.current.elementY + deltaY;

      // Aplicar bounds
      const bounded = applyBounds({ x: newX, y: newY }, currentSize);
      const newPosition = bounded.position;

      // Solo actualizar estado local durante el movimiento
      setCurrentPosition(newPosition);

      // onDrag solo para compatibilidad externa
      onDrag && onDrag(e, newPosition);
    },
    [isDragging, onDrag, applyBounds, currentSize]
  );

  const handleMouseUpDrag = useCallback(
    (e) => {
      if (!isDragging) return;

      setIsDragging(false);

      // Verificar si está completamente fuera del canvas después del drag
      const isCompletelyOut = checkOutOfBounds(currentPosition, currentSize);
      if (isCompletelyOut) {
        // El elemento será eliminado, no llamar onDragStop
        return;
      }

      // Llamar onDragStop normalmente solo si no está fuera de bounds
      if (
        onDragStop &&
        currentPosition &&
        typeof currentPosition.x !== "undefined"
      ) {
        onDragStop(e, currentPosition);
      }
    },
    [isDragging, currentPosition, onDragStop, checkOutOfBounds, currentSize]
  );

  return {
    isDragging,
    handleMouseDownDrag,
    handleMouseMoveDrag,
    handleMouseUpDrag,
  };
};
