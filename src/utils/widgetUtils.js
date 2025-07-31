// src/utils/widgetUtils.js

export const getResizeConfig = (widget) => {
  switch (widget.type) {
    case "text":
      return {
        top: false,
        right: true,
        bottom: false,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      };
    case "image":
    case "rectangle":
    case "circle":
    case "star":
      return true; // Formas geométricas pueden redimensionarse libremente
    default:
      return true;
  }
};

export const getLockAspectRatio = (widget) => {
  // Mantener aspect ratio para imágenes y formas circulares/simétricas
  if (widget.type === "image") return true;
  if (widget.type === "circle") return true;
  if (widget.type === "star") return true;

  // Para texto y rectángulos, no mantener ratio
  return false;
};
