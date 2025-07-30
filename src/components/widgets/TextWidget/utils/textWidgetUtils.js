// src/components/widgets/TextWidget/textWidgetUtils.js
// Utilidades compartidas para el auto-resize de widgets de texto

let tempElement = null;

export const calculateTextHeight = (
  content,
  fontSize,
  fontFamily = "Arial",
  width = 200,
  bold = false,
  italic = false
) => {
  try {
    // Validar parámetros
    if (typeof content !== "string") content = String(content || "");
    if (typeof fontSize !== "number" || fontSize <= 0) fontSize = 16;
    if (typeof width !== "number" || width <= 0) width = 200;

    // Reutilizar el elemento temporal para optimizar performance
    if (!tempElement) {
      tempElement = document.createElement("div");
      tempElement.style.position = "absolute";
      tempElement.style.visibility = "hidden";
      tempElement.style.top = "-9999px";
      tempElement.style.left = "-9999px";
      tempElement.style.height = "auto";
      tempElement.style.whiteSpace = "pre-wrap";
      tempElement.style.wordBreak = "break-word";
      tempElement.style.boxSizing = "border-box";
      document.body.appendChild(tempElement);
    }

    // Configurar estilos para el cálculo actual
    tempElement.style.width = `${width - 16}px`; // -16px por el padding
    tempElement.style.fontSize = `${fontSize}px`;
    tempElement.style.fontFamily = fontFamily;
    tempElement.style.lineHeight = "1.4";
    tempElement.style.padding = "8px";
    tempElement.style.fontWeight = bold ? "bold" : "normal";
    tempElement.style.fontStyle = italic ? "italic" : "normal";
    tempElement.textContent = content || "Texto vacío";

    const height = tempElement.scrollHeight;

    // Altura mínima basada en fontSize
    const minHeight = fontSize * 1.4 + 16; // lineHeight + padding

    return Math.max(height, minHeight);
  } catch (error) {
    console.warn("Error en calculateTextHeight:", error);
    // Retornar altura por defecto en caso de error
    return fontSize * 1.4 + 16;
  }
};

export const shouldAutoResize = (currentHeight, newHeight) => {
  // Solo auto-resize si la diferencia es significativa
  return Math.abs(currentHeight - newHeight) > 3;
};

// Cleanup al desmontar la aplicación
export const cleanupTextUtils = () => {
  if (tempElement && tempElement.parentNode) {
    tempElement.parentNode.removeChild(tempElement);
    tempElement = null;
  }
};

// Auto-cleanup cuando la página se cierra
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", cleanupTextUtils);
}
