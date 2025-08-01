import React, { useCallback } from "react";
import EditorCanvas from "./components/EditorCanvas";
import Toolbar from "./components/Toolbar";
import { useWidgetManager } from "./hooks/useWidgetManager";
import "./App.css";
import "./components/Widget.css";

function App() {
  const {
    widgets,
    selectedId,
    editingWidgetId,
    addWidget,
    updateWidget,
    removeWidget,
    clearAllWidgets,
    selectWidget,
    exitEditMode,
  } = useWidgetManager();

  const handleRemoveSelected = useCallback(() => {
    if (selectedId) {
      removeWidget(selectedId);
    }
  }, [selectedId, removeWidget]);

  return (
    <div className="flex justify-start w-full" style={{ padding: 20 }}>
      <Toolbar
        addWidget={addWidget}
        onClearAll={clearAllWidgets}
        onRemoveSelected={handleRemoveSelected}
        updateWidget={updateWidget}
        selectedId={selectedId}
        widgets={widgets}
      />
      <EditorCanvas
        widgets={widgets}
        onUpdateWidget={updateWidget}
        onSelectWidget={selectWidget}
        onRemoveWidget={removeWidget}
        selectedId={selectedId}
        editingWidgetId={editingWidgetId}
        onExitEditMode={exitEditMode}
      />
    </div>
  );
}

export default App;
