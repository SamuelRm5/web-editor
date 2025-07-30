// src/components/Widget.jsx
import React, { memo } from "react";
import { WidgetRenderer } from "./widgets";

const Widget = memo(({ widget, isEditing, onUpdateWidget }) => {
  return (
    <div className="widget-content absolute w-full h-full drag-handle">
      <WidgetRenderer
        widget={widget}
        isEditing={isEditing}
        onUpdateWidget={onUpdateWidget}
      />
    </div>
  );
});

export default Widget;
