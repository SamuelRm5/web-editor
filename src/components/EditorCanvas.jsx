// src/components/EditorCanvas.jsx
import React, { memo, useCallback } from "react";
import InteractiveWidget from "./InteractiveWidget";
import SnapGuides from "./SnapGuides";
import { useSnapGuides } from "../hooks/useSnapGuides";
import { canvasStyles } from "../styles/editorCanvas.styles";

const EditorCanvas = memo(
  ({
    widgets,
    onUpdateWidget,
    onSelectWidget,
    onRemoveWidget,
    selectedId,
    editingWidgetId,
    onEnterEditMode,
    onExitEditMode,
  }) => {
    // Hook para manejo de guías de snap
    const { activeGuides, calculateSnap, clearGuides } = useSnapGuides(
      canvasStyles.width,
      canvasStyles.height,
      widgets.filter((w) => w.id !== selectedId) // Excluir el widget seleccionado
    );

    // Función para manejar click en el canvas (deseleccionar y salir del modo edición)
    const handleCanvasClick = useCallback(
      (e) => {
        // Solo deseleccionar si se hace click directamente en el canvas, no en un widget
        if (e.target === e.currentTarget) {
          onSelectWidget(null);
          onExitEditMode(); // Salir del modo edición
          clearGuides();
        }
      },
      [onSelectWidget, onExitEditMode, clearGuides]
    );

    // Función para manejar selección de widgets (salir del modo edición al seleccionar otro)
    const handleWidgetSelect = useCallback(
      (widgetId) => {
        // Si hay un widget en modo edición y se selecciona otro, salir del modo edición
        if (editingWidgetId && editingWidgetId !== widgetId) {
          onExitEditMode();
        }
        onSelectWidget(widgetId);
      },
      [editingWidgetId, onExitEditMode, onSelectWidget]
    );

    return (
      <div style={canvasStyles} onClick={handleCanvasClick}>
        {widgets.map((widget) => {
          // OPTIMIZACIÓN: Calcular booleanos una sola vez
          const isSelected = selectedId === widget.id;
          const isEditing = editingWidgetId === widget.id;

          return (
            <InteractiveWidget
              key={widget.id}
              widget={widget}
              onUpdateWidget={onUpdateWidget}
              onSelectWidget={handleWidgetSelect}
              onRemoveWidget={onRemoveWidget}
              isSelected={isSelected}
              isEditing={isEditing}
              onEnterEditMode={onEnterEditMode}
              calculateSnap={calculateSnap}
              clearGuides={clearGuides}
              canvasWidth={canvasStyles.width}
              canvasHeight={canvasStyles.height}
            />
          );
        })}

        {/* Guías de snap */}
        <SnapGuides
          activeGuides={activeGuides}
          canvasWidth={canvasStyles.width}
          canvasHeight={canvasStyles.height}
        />
      </div>
    );
  }
);

export default EditorCanvas;
