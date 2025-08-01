// src/components/myrnd/MyRnd.jsx
import { useState, useEffect, useMemo } from "react";
import "./MyRnd.css";

// Hooks personalizados para lógica separada
import { useDragLogic, useResizeLogic, useBoundsLogic } from "./hooks";

// Componentes separados
import { ResizeHandles } from "./components";

// Importar el nuevo sistema de configuración
import { getWidgetResizeConfig } from "../../utils/widgetResizeConfig.js";

const MyRnd = ({
  children,
  size,
  position,
  minWidth = 50,
  minHeight = 50,
  maxWidth,
  maxHeight,
  bounds,
  enableResizing = true,
  disableDragging = false,
  lockAspectRatio = false,
  onDragStart,
  onDrag,
  onDragStop,
  onResizeStart,
  onResize,
  onResizeStop,
  onMouseDown,
  onDoubleClick,
  className = "",
  style = {},
  isSelected = false,
  dragHandleClassName = "drag-handle",
  rotation = 0,
  // Props para integrar canvas logic y widget data
  widgetData,
  canvasWidth = 960,
  canvasHeight = 540,
  onOutOfBounds,
}) => {
  const [currentSize, setCurrentSize] = useState(size);
  const [currentPosition, setCurrentPosition] = useState(position);

  // Obtener configuración centralizada del widget
  const resizeConfig = useMemo(() => {
    if (!widgetData?.type) return null;
    return getWidgetResizeConfig(widgetData.type);
  }, [widgetData?.type]);

  // Aplicar configuraciones dinámicas basadas en el tipo de widget
  const dynamicMinWidth = resizeConfig?.constraints?.minWidth || minWidth;
  const dynamicMinHeight = resizeConfig?.constraints?.minHeight || minHeight;
  const dynamicMaxWidth = resizeConfig?.constraints?.maxWidth || maxWidth;
  const dynamicMaxHeight = resizeConfig?.constraints?.maxHeight || maxHeight;
  const dynamicLockAspectRatio = resizeConfig?.aspectRatio || lockAspectRatio;

  // Actualizar estado interno cuando cambian las props SOLO si no estamos interactuando
  useEffect(() => {
    setCurrentSize(size);
  }, [size]);

  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  // Hooks de lógica separada
  const { applyBounds, checkOutOfBounds } = useBoundsLogic({
    bounds,
    maxWidth: dynamicMaxWidth,
    maxHeight: dynamicMaxHeight,
    canvasWidth,
    canvasHeight,
    onOutOfBounds,
    widgetData,
  });

  const {
    isDragging,
    handleMouseDownDrag,
    handleMouseMoveDrag,
    handleMouseUpDrag,
  } = useDragLogic({
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
  });

  const {
    isResizing,
    handleMouseDownResize,
    handleMouseMoveResize,
    handleMouseUpResize,
  } = useResizeLogic({
    enableResizing,
    currentSize,
    currentPosition,
    minWidth: dynamicMinWidth,
    minHeight: dynamicMinHeight,
    lockAspectRatio: dynamicLockAspectRatio,
    applyBounds,
    onResizeStart,
    onResize,
    onResizeStop,
    // Pasar configuración avanzada al hook
    widgetData,
    aspectRatioConfig: resizeConfig?.aspectRatio,
  });

  // Event listeners globales optimizados
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e) => {
      if (isDragging) {
        handleMouseMoveDrag(e, setCurrentPosition);
      } else if (isResizing) {
        handleMouseMoveResize(e, setCurrentSize, setCurrentPosition);
      }
    };

    const handleMouseUp = (e) => {
      if (isDragging) {
        handleMouseUpDrag(e);
      } else if (isResizing) {
        handleMouseUpResize(e);
      }
    };

    // Keyboard shortcuts para mejorar UX
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          // Cancelar operación actual
          if (isDragging || isResizing) {
            setCurrentPosition(position);
            setCurrentSize(size);
          }
          break;
        default:
          break;
      }
    };

    const options = { passive: false };

    document.addEventListener("mousemove", handleMouseMove, options);
    document.addEventListener("mouseup", handleMouseUp, options);
    document.addEventListener("keydown", handleKeyDown);

    // Mejorar UX durante interacciones
    document.body.style.userSelect = "none";
    document.body.style.cursor = isDragging ? "grabbing" : "resizing";
    document.body.style.webkitUserSelect = "none";
    document.body.style.touchAction = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove, options);
      document.removeEventListener("mouseup", handleMouseUp, options);
      document.removeEventListener("keydown", handleKeyDown);

      // Restaurar estilos
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      document.body.style.webkitUserSelect = "";
      document.body.style.touchAction = "";
    };
  }, [
    isDragging,
    isResizing,
    handleMouseMoveDrag,
    handleMouseMoveResize,
    handleMouseUpDrag,
    handleMouseUpResize,
    position,
    size,
  ]);

  // Optimizar transformStyle con useMemo
  const transformStyle = useMemo(
    () => ({
      position: "absolute",
      left: currentPosition.x,
      top: currentPosition.y,
      width: currentSize.width,
      height: currentSize.height,
      transform: `rotate(${rotation}deg)`,
      transformOrigin: "center center",
      willChange: isDragging || isResizing ? "transform" : "auto",
      ...style,
    }),
    [
      currentPosition.x,
      currentPosition.y,
      currentSize.width,
      currentSize.height,
      rotation,
      isDragging,
      isResizing,
      style,
    ]
  );

  // Optimización: Solo calcular overlayStyle cuando está seleccionado
  const overlayStyle = useMemo(() => {
    if (!isSelected) return null;
    return {
      position: "absolute",
      left: currentPosition.x,
      top: currentPosition.y,
      width: currentSize.width,
      height: currentSize.height,
      transform: `rotate(${rotation}deg)`,
      transformOrigin: "center center",
      zIndex: 1001, // Un nivel por encima del z-index base de widgets (1000)
      pointerEvents: "none",
    };
  }, [
    isSelected,
    currentPosition.x,
    currentPosition.y,
    currentSize.width,
    currentSize.height,
    rotation,
  ]);

  return (
    <>
      <div
        className={`myrnd ${isSelected ? "selected" : ""} ${className} ${
          isDragging ? "dragging" : ""
        } ${isResizing ? "resizing" : ""}`}
        style={transformStyle}
        onMouseDown={handleMouseDownDrag}
        onDoubleClick={onDoubleClick}
      >
        {/* Contenido */}
        {children}
      </div>

      {/* Overlay separado para resize handles - solo cuando está seleccionado */}
      {isSelected && (
        <div className="myrnd-overlay selected" style={overlayStyle}>
          <ResizeHandles
            enableResizing={enableResizing}
            onMouseDown={handleMouseDownResize}
            isDragging={isDragging}
            handleConfig={resizeConfig?.handles} // Pasar configuración dinámica
          />
        </div>
      )}
    </>
  );
};

export default MyRnd;
