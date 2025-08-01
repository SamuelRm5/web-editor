// src/components/myrnd/hooks/useResizeLogic.js
import { useState, useRef, useCallback } from "react";
import { shouldLockAspectRatioForHandle } from "../../../utils/widgetResizeConfig.js";

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
  // Nuevos parámetros para el sistema mejorado
  widgetData,
  aspectRatioConfig,
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

      // Determinar si este handle específico debe mantener aspect ratio
      let shouldLockForThisHandle = lockAspectRatio;

      // Si tenemos configuración de aspect ratio avanzada, usarla
      if (aspectRatioConfig && widgetData) {
        if (aspectRatioConfig === "square") {
          shouldLockForThisHandle = true;
        } else if (aspectRatioConfig?.type === "conditional") {
          shouldLockForThisHandle = shouldLockAspectRatioForHandle(
            widgetData.type,
            resizeHandle
          );
        } else if (typeof aspectRatioConfig === "boolean") {
          shouldLockForThisHandle = aspectRatioConfig;
        }
      }

      // Determinar el nuevo tamaño y posición basado en el handle de redimensionamiento
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

          if (shouldLockForThisHandle) {
            const aspectRatio =
              resizeStartRef.current.width / resizeStartRef.current.height;

            if (aspectRatioConfig === "square") {
              // Para cuadrados, usar la dimensión más pequeña
              const newSize = Math.min(newWidth, newHeight);
              newWidth = newSize;
              newHeight = newSize;
            } else {
              newHeight = newWidth / aspectRatio;
            }

            newY =
              resizeStartRef.current.elementY +
              (resizeStartRef.current.height - newHeight);
          }
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

          if (shouldLockForThisHandle) {
            const aspectRatio =
              resizeStartRef.current.width / resizeStartRef.current.height;

            if (aspectRatioConfig === "square") {
              const newSize = Math.min(newWidth, newHeight);
              newWidth = newSize;
              newHeight = newSize;
            } else {
              newHeight = newWidth / aspectRatio;
            }

            newY =
              resizeStartRef.current.elementY +
              (resizeStartRef.current.height - newHeight);
          }
          break;

        case "bottomRight":
          newWidth = Math.max(minWidth, resizeStartRef.current.width + deltaX);
          newHeight = Math.max(
            minHeight,
            resizeStartRef.current.height + deltaY
          );

          if (shouldLockForThisHandle) {
            const aspectRatio =
              resizeStartRef.current.width / resizeStartRef.current.height;

            if (aspectRatioConfig === "square") {
              const newSize = Math.min(newWidth, newHeight);
              newWidth = newSize;
              newHeight = newSize;
            } else {
              newHeight = newWidth / aspectRatio;
            }
          }
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

          if (shouldLockForThisHandle) {
            const aspectRatio =
              resizeStartRef.current.width / resizeStartRef.current.height;

            if (aspectRatioConfig === "square") {
              const newSize = Math.min(newWidth, newHeight);
              newWidth = newSize;
              newHeight = newSize;
            } else {
              newHeight = newWidth / aspectRatio;
            }
          }
          break;

        // Handles laterales - NO aplicar lockAspectRatio automáticamente
        case "top":
          newHeight = Math.max(
            minHeight,
            resizeStartRef.current.height - deltaY
          );
          newY =
            resizeStartRef.current.elementY +
            (resizeStartRef.current.height - newHeight);

          // Solo aplicar aspect ratio si está configurado específicamente para este handle
          if (shouldLockForThisHandle) {
            const aspectRatio =
              resizeStartRef.current.width / resizeStartRef.current.height;
            newWidth = newHeight * aspectRatio;
          }
          break;

        case "bottom":
          newHeight = Math.max(
            minHeight,
            resizeStartRef.current.height + deltaY
          );

          if (shouldLockForThisHandle) {
            const aspectRatio =
              resizeStartRef.current.width / resizeStartRef.current.height;
            newWidth = newHeight * aspectRatio;
          }
          break;

        case "left":
          newWidth = Math.max(minWidth, resizeStartRef.current.width - deltaX);
          newX =
            resizeStartRef.current.elementX +
            (resizeStartRef.current.width - newWidth);

          if (shouldLockForThisHandle) {
            const aspectRatio =
              resizeStartRef.current.width / resizeStartRef.current.height;
            newHeight = newWidth / aspectRatio;
          }
          break;

        case "right":
          newWidth = Math.max(minWidth, resizeStartRef.current.width + deltaX);

          if (shouldLockForThisHandle) {
            const aspectRatio =
              resizeStartRef.current.width / resizeStartRef.current.height;
            newHeight = newWidth / aspectRatio;
          }
          break;
      }

      // Aplicar bounds con configuración inteligente
      let skipBounds = false;
      if (
        shouldLockForThisHandle &&
        (resizeHandle === "topLeft" || resizeHandle === "topRight")
      ) {
        skipBounds = true;
      }

      const bounded = skipBounds
        ? {
            position: { x: newX, y: newY },
            size: { width: newWidth, height: newHeight },
          }
        : applyBounds(
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
      aspectRatioConfig,
      widgetData,
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
