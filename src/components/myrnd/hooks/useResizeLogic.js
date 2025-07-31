// src/components/myrnd/hooks/useResizeLogic.js
import { useState, useRef, useCallback } from "react";

export const useResizeLogic = ({
  enableResizing,
  currentSize,
  currentPosition,
  minWidth,
  minHeight,
  lockAspectRatio,
  applyBounds,
  onResizeStart,
  onResize,
  onResizeStop,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const resizeStartRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    elementX: 0,
    elementY: 0,
  });

  const handleMouseDownResize = useCallback(
    (e, handle) => {
      if (!enableResizing) return;

      e.preventDefault();
      e.stopPropagation();

      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: currentSize.width,
        height: currentSize.height,
        elementX: currentPosition.x,
        elementY: currentPosition.y,
      };

      setIsResizing(true);
      setResizeHandle(handle);
      onResizeStart &&
        onResizeStart(e, handle, {
          size: currentSize,
          position: currentPosition,
        });
    },
    [enableResizing, currentSize, currentPosition, onResizeStart]
  );

  const handleMouseMoveResize = useCallback(
    (e, setCurrentSize, setCurrentPosition) => {
      if (!isResizing || !resizeHandle) return;

      e.preventDefault();
      e.stopPropagation();

      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;
      let newX = resizeStartRef.current.elementX;
      let newY = resizeStartRef.current.elementY;

      // Calcular nuevas dimensiones según el handle
      switch (resizeHandle) {
        case "topLeft":
          newWidth = Math.max(minWidth, resizeStartRef.current.width - deltaX);
          newHeight = Math.max(
            minHeight,
            resizeStartRef.current.height - deltaY
          );
          newX =
            resizeStartRef.current.elementX +
            (resizeStartRef.current.width - newWidth);
          newY =
            resizeStartRef.current.elementY +
            (resizeStartRef.current.height - newHeight);
          break;
        case "top":
          newHeight = Math.max(
            minHeight,
            resizeStartRef.current.height - deltaY
          );
          newY =
            resizeStartRef.current.elementY +
            (resizeStartRef.current.height - newHeight);
          break;
        case "topRight":
          newWidth = Math.max(minWidth, resizeStartRef.current.width + deltaX);
          newHeight = Math.max(
            minHeight,
            resizeStartRef.current.height - deltaY
          );
          newY =
            resizeStartRef.current.elementY +
            (resizeStartRef.current.height - newHeight);
          break;
        case "right":
          newWidth = Math.max(minWidth, resizeStartRef.current.width + deltaX);
          break;
        case "bottomRight":
          newWidth = Math.max(minWidth, resizeStartRef.current.width + deltaX);
          newHeight = Math.max(
            minHeight,
            resizeStartRef.current.height + deltaY
          );
          break;
        case "bottom":
          newHeight = Math.max(
            minHeight,
            resizeStartRef.current.height + deltaY
          );
          break;
        case "bottomLeft":
          newWidth = Math.max(minWidth, resizeStartRef.current.width - deltaX);
          newHeight = Math.max(
            minHeight,
            resizeStartRef.current.height + deltaY
          );
          newX =
            resizeStartRef.current.elementX +
            (resizeStartRef.current.width - newWidth);
          break;
        case "left":
          newWidth = Math.max(minWidth, resizeStartRef.current.width - deltaX);
          newX =
            resizeStartRef.current.elementX +
            (resizeStartRef.current.width - newWidth);
          break;
      }

      // Lock aspect ratio si es necesario
      if (lockAspectRatio) {
        const aspectRatio =
          resizeStartRef.current.width / resizeStartRef.current.height;

        if (resizeHandle.includes("Left") || resizeHandle.includes("Right")) {
          if (resizeHandle.includes("Top") || resizeHandle.includes("Bottom")) {
            // Handle de esquina - mantener aspect ratio
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              newHeight = newWidth / aspectRatio;
            } else {
              newWidth = newHeight * aspectRatio;
            }
          } else {
            // Handle lateral - ajustar altura
            newHeight = newWidth / aspectRatio;
          }
        } else if (
          resizeHandle.includes("Top") ||
          resizeHandle.includes("Bottom")
        ) {
          // Handle superior/inferior - ajustar ancho
          newWidth = newHeight * aspectRatio;
        }

        // Reajustar posición si cambió el tamaño en handles de top/left
        if (resizeHandle.includes("Top")) {
          newY =
            resizeStartRef.current.elementY +
            (resizeStartRef.current.height - newHeight);
        }
        if (resizeHandle.includes("Left")) {
          newX =
            resizeStartRef.current.elementX +
            (resizeStartRef.current.width - newWidth);
        }
      }

      // Aplicar bounds
      const bounded = applyBounds(
        { x: newX, y: newY },
        { width: newWidth, height: newHeight }
      );
      const newSize = bounded.size;
      const newPosition = bounded.position;

      setCurrentSize(newSize);
      setCurrentPosition(newPosition);

      onResize &&
        onResize(e, resizeHandle, {
          size: newSize,
          position: newPosition,
        });
    },
    [
      isResizing,
      resizeHandle,
      minWidth,
      minHeight,
      lockAspectRatio,
      onResize,
      applyBounds,
    ]
  );

  const handleMouseUpResize = useCallback(
    (e) => {
      if (!isResizing) return;

      setIsResizing(false);
      setResizeHandle(null);
      onResizeStop &&
        onResizeStop(e, resizeHandle, {
          size: currentSize,
          position: currentPosition,
        });
    },
    [isResizing, resizeHandle, currentSize, currentPosition, onResizeStop]
  );

  return {
    isResizing,
    resizeHandle,
    handleMouseDownResize,
    handleMouseMoveResize,
    handleMouseUpResize,
  };
};
