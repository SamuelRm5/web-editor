// src/hooks/useOptimizedDrag.js
import { useCallback } from "react";

export const useOptimizedDrag = (onUpdateWidget) => {
  const optimizedUpdate = useCallback(
    (id, updates) => {
      // Actualización inmediata sin requestAnimationFrame para evitar pestañeo
      onUpdateWidget(id, updates);
    },
    [onUpdateWidget]
  );

  return optimizedUpdate;
};
