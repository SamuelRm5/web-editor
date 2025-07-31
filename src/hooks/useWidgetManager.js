// src/hooks/useWidgetManager.js
import { useState, useCallback } from "react";
import { createWidget } from "../utils/widgetFactory";

export const useWidgetManager = () => {
  const [widgets, setWidgets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingWidgetId, setEditingWidgetId] = useState(null);

  const addWidget = useCallback((type, overrides = {}) => {
    const newWidget = createWidget(type, overrides);
    setWidgets((prev) => [...prev, newWidget]);
    setSelectedId(newWidget.id); // Seleccionar el nuevo widget automáticamente
    return newWidget.id;
  }, []);

  const updateWidget = useCallback((id, updates) => {
    setWidgets((widgets) =>
      widgets.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  }, []);

  const removeWidget = useCallback((id) => {
    setWidgets((widgets) => widgets.filter((w) => w.id !== id));
    setSelectedId((currentSelected) =>
      currentSelected === id ? null : currentSelected
    );
  }, []);

  const clearAllWidgets = useCallback(() => {
    setWidgets([]);
    setSelectedId(null);
  }, []);

  const selectWidget = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const enterEditMode = useCallback((id) => {
    setEditingWidgetId(id);
  }, []);

  const exitEditMode = useCallback(() => {
    setEditingWidgetId(null);
  }, []);

  return {
    // State
    widgets,
    selectedId,
    editingWidgetId,

    // Actions
    addWidget,
    updateWidget,
    removeWidget,
    clearAllWidgets,
    selectWidget,
    enterEditMode,
    exitEditMode,
  };
};
