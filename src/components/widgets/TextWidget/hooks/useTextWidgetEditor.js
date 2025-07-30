// src/components/widgets/TextWidget/useTextWidgetEditor.js
// Hook personalizado que contiene toda la lógica pesada de TextWidgetEditor
import { useRef, useCallback, useEffect, useState } from "react";

export const useTextWidgetEditor = (widget, onUpdateWidget) => {
  const textareaRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  // Función optimizada para auto-resize del textarea usando scrollHeight real
  const autoResizeHeight = useCallback(
    (textarea, content, selectionStart, selectionEnd) => {
      if (!textarea || isResizing) return;

      setIsResizing(true);

      // Usar posiciones pasadas como parámetro o las actuales del textarea
      const cursorStart =
        selectionStart !== undefined ? selectionStart : textarea.selectionStart;
      const cursorEnd =
        selectionEnd !== undefined ? selectionEnd : textarea.selectionEnd;
      const scrollTop = textarea.scrollTop;

      // Reset height para calcular scrollHeight correcto
      textarea.style.height = "auto";

      // Usar el scrollHeight real del textarea
      const scrollHeight = textarea.scrollHeight;
      const currentFontSize = widget.fontSize || 16;
      const minHeight = currentFontSize * 1.4 + 16; // lineHeight + padding
      const newHeight = Math.max(scrollHeight, minHeight);

      // Aplicar nueva altura al textarea
      textarea.style.height = `${newHeight}px`;

      // Actualizar widget height solo si cambió significativamente
      if (Math.abs(widget.height - newHeight) > 3) {
        onUpdateWidget(widget.id, {
          height: newHeight,
          content: content,
        });
      } else {
        // Solo actualizar contenido si la altura no cambió
        onUpdateWidget(widget.id, { content: content });
      }

      // Restaurar posición del cursor DESPUÉS de todos los cambios
      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = cursorStart;
          textarea.selectionEnd = cursorEnd;
          textarea.scrollTop = scrollTop;
        }
      }, 0);

      setIsResizing(false);
    },
    [widget.id, widget.fontSize, widget.height, onUpdateWidget, isResizing]
  );

  // Función para limpiar saltos de línea al final del contenido
  const cleanTrailingNewlines = useCallback((content) => {
    if (!content) return content;

    // Eliminar todos los saltos de línea al final
    return content.replace(/\n+$/, "");
  }, []);

  // Auto-resize y focus SOLO al montar el componente (entrar en modo edición)
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      // Timeout para asegurar que el DOM esté listo
      const timeout = setTimeout(() => {
        autoResizeHeight(textarea, textarea.value);
        // Focus al final del texto SOLO al entrar en modo edición
        textarea.focus();
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [autoResizeHeight]); // Solo ejecutar al mount y cuando cambie autoResizeHeight

  // Auto-resize cuando cambia el contenido (SIN mover cursor)
  useEffect(() => {
    if (textareaRef.current && !isResizing) {
      const textarea = textareaRef.current;
      const timeout = setTimeout(() => {
        autoResizeHeight(textarea, widget.content);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [widget.content, autoResizeHeight, isResizing]);

  // Auto-resize cuando cambian propiedades del texto (fontSize, fontFamily, bold, italic)
  useEffect(() => {
    if (textareaRef.current && !isResizing) {
      const textarea = textareaRef.current;
      const timeout = setTimeout(() => {
        autoResizeHeight(textarea, widget.content);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [
    widget.fontSize,
    widget.fontFamily,
    widget.bold,
    widget.italic,
    autoResizeHeight,
    isResizing,
    widget.content,
  ]);

  // Limpiar saltos de línea al final cuando el componente se desmonta
  useEffect(() => {
    const textarea = textareaRef.current;

    return () => {
      // Cleanup cuando el componente se desmonta (cambia de widget)
      try {
        if (textarea && textarea.value !== undefined) {
          const currentContent = textarea.value;
          const cleanedContent = cleanTrailingNewlines(currentContent);

          if (cleanedContent !== currentContent) {
            onUpdateWidget(widget.id, { content: cleanedContent });
          }
        }
      } catch (error) {
        console.warn("Error en cleanup:", error);
      }
    };
  }, [widget.id, onUpdateWidget, cleanTrailingNewlines]);

  // Handlers para el textarea
  const handleContentChange = useCallback(
    (e) => {
      const newContent = e.target.value;

      // Solo actualizar si el contenido realmente cambió
      if (newContent !== widget.content) {
        onUpdateWidget(widget.id, { content: newContent });
      }
    },
    [onUpdateWidget, widget.id, widget.content]
  );

  const handleInput = useCallback(
    (e) => {
      const textarea = e.target;
      const content = textarea.value;
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;

      // Auto-resize inmediato para mejor UX
      if (!isResizing) {
        autoResizeHeight(textarea, content, selectionStart, selectionEnd);
      }
    },
    [autoResizeHeight, isResizing]
  );

  const handleBlur = useCallback(
    (e) => {
      try {
        const currentContent = e.target.value;
        const cleanedContent = cleanTrailingNewlines(currentContent);

        // Solo actualizar si el contenido cambió después de la limpieza
        if (cleanedContent !== currentContent) {
          onUpdateWidget(widget.id, { content: cleanedContent });
        }
      } catch (error) {
        console.warn("Error en handleBlur:", error);
      }
    },
    [onUpdateWidget, widget.id, cleanTrailingNewlines]
  );

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      e.stopPropagation();
    }
  }, []);

  // Retornar toda la lógica y handlers necesarios
  return {
    textareaRef,
    isResizing,
    handleContentChange,
    handleInput,
    handleBlur,
    handleKeyDown,
  };
};
