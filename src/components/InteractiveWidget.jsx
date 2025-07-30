// src/components/InteractiveWidget.jsx
import React, { memo, useMemo, useCallback, useRef } from "react";
import { Rnd } from "react-rnd";
import { getResizeConfig, getLockAspectRatio } from "../utils/widgetUtils";
import { useWidgetInteractions } from "../hooks/useWidgetInteractions";
import ResizeIndicators from "./ResizeIndicators";
import Widget from "./Widget";

const InteractiveWidget = memo(
  ({
    widget,
    onUpdateWidget,
    onSelectWidget,
    onRemoveWidget,
    selectedId,
    isSelected,
    isEditing,
    onEnterEditMode,
    calculateSnap,
    clearGuides,
    canvasWidth = 960,
    canvasHeight = 540,
  }) => {
    // Usar el hook personalizado para manejar todas las interacciones
    const {
      isDragging,
      size,
      position,
      handleDragStart,
      handleDrag,
      handleDragStop,
      handleResizeStart,
      handleResizeStop,
      handleClick,
    } = useWidgetInteractions({
      widget,
      onUpdateWidget,
      onSelectWidget,
      onRemoveWidget,
      selectedId,
      calculateSnap,
      clearGuides,
      canvasWidth,
      canvasHeight,
    });

    // Memoizar las configuraciones para evitar recalculos
    const resizeConfig = useMemo(() => getResizeConfig(widget), [widget]);
    const lockAspectRatio = useMemo(() => getLockAspectRatio(widget), [widget]);

    // Manejar doble click para entrar en modo edición
    const handleDoubleClick = (e) => {
      e.stopPropagation();
      onEnterEditMode(widget.id);
    }; // Optimización de drag para evitar conflictos con snap
    const lastDragTimeRef = useRef(0);

    const optimizedHandleDrag = useCallback(
      (e, data) => {
        const now = Date.now();
        const timeSinceLastDrag = now - lastDragTimeRef.current;

        // Throttle simple a 60fps sin RAF para mantener precisión del snap
        if (timeSinceLastDrag < 16) return;

        lastDragTimeRef.current = now;
        handleDrag(e, data);
      },
      [handleDrag]
    );

    // Normalizar resizeConfig para los indicadores visuales
    const resizeIndicators = useMemo(() => {
      if (resizeConfig === true) {
        return {
          top: true,
          right: true,
          bottom: true,
          left: true,
          topLeft: true,
          topRight: true,
          bottomLeft: true,
          bottomRight: true,
        };
      } else if (resizeConfig === false) {
        return {
          top: false,
          right: false,
          bottom: false,
          left: false,
          topLeft: false,
          topRight: false,
          bottomLeft: false,
          bottomRight: false,
        };
      } else {
        return resizeConfig;
      }
    }, [resizeConfig]);

    return (
      <Rnd
        key={widget.id}
        minWidth={widget.minWidth || null}
        minHeight={widget.minHeight || null}
        size={size}
        position={position}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        onMouseDown={handleClick}
        onDoubleClick={handleDoubleClick}
        enableResizing={isEditing ? false : resizeConfig}
        disableDragging={isEditing}
        lockAspectRatio={lockAspectRatio}
        className={`interactive-widget ${isSelected ? "widget-selected" : ""} ${
          isDragging ? "dragging" : ""
        } ${isEditing ? "widget-editing" : ""}`}
        data-type={widget.type}
        dragHandleClassName="drag-handle"
        resizeHandleClasses={{
          left: "drag-handle-left",
          right: "drag-handle-right",
          top: "drag-handle-top",
          bottom: "drag-handle-bottom",
        }}
        enableUserSelectHack={true}
        onDrag={optimizedHandleDrag}
        onResize={null}
        dragGrid={[5, 5]}
        resizeGrid={[1, 1]}
      >
        {/* Renderizar el widget limpio sin lógica de interacción */}
        <Widget
          widget={widget}
          isEditing={isEditing}
          onUpdateWidget={onUpdateWidget}
        />

        {/* Indicadores visuales cuando está seleccionado y no está en modo edición */}
        <ResizeIndicators
          resizeIndicators={resizeIndicators}
          isVisible={isSelected && !isDragging && !isEditing}
        />
      </Rnd>
    );
  }
);

export default InteractiveWidget;
