// src/components/InteractiveWidget.jsx
import React, { memo, useMemo, useCallback } from "react";
import { MyRnd } from "./myrnd";
import { getResizeConfig, getLockAspectRatio } from "../utils/widgetUtils";
import Widget from "./Widget";

const InteractiveWidget = memo(
  ({
    widget,
    onUpdateWidget,
    onSelectWidget,
    onRemoveWidget,
    isSelected,
    isEditing,
    onEnterEditMode,
    canvasWidth = 960,
    canvasHeight = 540,
  }) => {
    // Configuraciones memoizadas
    const resizeConfig = useMemo(() => getResizeConfig(widget), [widget]);
    const lockAspectRatio = useMemo(() => getLockAspectRatio(widget), [widget]);

    // Size y position derivados directamente del widget
    const size = useMemo(
      () => ({
        width: widget.width,
        height: widget.height,
      }),
      [widget.width, widget.height]
    );

    const position = useMemo(
      () => ({
        x: widget.x,
        y: widget.y,
      }),
      [widget.x, widget.y]
    );

    // Handlers optimizados para nuestro MyRnd - SOLO onDragStop actualiza
    const handleDragStart = useCallback(() => {
      onSelectWidget(widget.id);
    }, [onSelectWidget, widget.id]);

    const handleDrag = useCallback(() => {
      // Solo para compatibilidad - no hacer nada
    }, []);

    const handleDragStop = useCallback(
      (e, finalPosition) => {
        // Validar que finalPosition existe para evitar errores
        if (
          !finalPosition ||
          typeof finalPosition.x === "undefined" ||
          typeof finalPosition.y === "undefined"
        ) {
          console.warn(
            "handleDragStop called with invalid finalPosition:",
            finalPosition
          );
          return;
        }

        // ÚNICA actualización al final del drag
        onUpdateWidget(widget.id, {
          x: finalPosition.x,
          y: finalPosition.y,
        });
      },
      [widget, onUpdateWidget]
    );

    const handleResizeStart = useCallback(() => {
      // Preparar para resize
    }, []);

    const handleClick = useCallback(
      (e) => {
        e.stopPropagation();
        onSelectWidget(widget.id);
      },
      [onSelectWidget, widget.id]
    );

    const handleDoubleClick = useCallback(
      (e) => {
        e.stopPropagation();
        if (widget.type === "text") {
          onEnterEditMode(widget.id);
        }
      },
      [onEnterEditMode, widget.id, widget.type]
    );

    return (
      <MyRnd
        key={widget.id}
        size={size}
        position={position}
        minWidth={widget.minWidth || 50}
        minHeight={widget.minHeight || 50}
        bounds={widget.bounds}
        // Props esenciales para funcionalidad
        enableResizing={isEditing ? false : resizeConfig}
        resizeHandleConfig={resizeConfig}
        disableDragging={isEditing}
        lockAspectRatio={lockAspectRatio}
        rotation={widget.rotation || 0}
        // Props de canvas y bounds
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        widgetData={widget}
        onOutOfBounds={(widgetData) => {
          console.log("onOutOfBounds called with:", widgetData);
          onRemoveWidget(widgetData.id);
        }}
        // Props de interacción
        dragHandleClassName="drag-handle"
        isSelected={isSelected}
        className={`interactive-widget ${isEditing ? "editing" : ""}`}
        // Callbacks optimizados
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStart={handleResizeStart}
        onResize={() => {
          // NO actualizar durante resize, solo al final
        }}
        onResizeStop={(e, handle, data) => {
          // ÚNICA actualización al final del resize
          onUpdateWidget(widget.id, {
            x: data.position.x,
            y: data.position.y,
            width: data.size.width,
            height: data.size.height,
          });
        }}
        onMouseDown={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {/* Renderizar el widget limpio sin lógica de interacción */}
        <Widget
          widget={widget}
          isEditing={isEditing}
          onUpdateWidget={onUpdateWidget}
        />
      </MyRnd>
    );
  }
);

export default InteractiveWidget;
