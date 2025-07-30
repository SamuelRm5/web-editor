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
    case "diamond":
    case "triangle":
    case "pentagon":
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
  if (widget.type === "diamond") return true;
  if (widget.type === "pentagon") return true;
  // Para texto, rectángulos y triángulos, no mantener ratio
  return false;
};

export const getResizeButtons = (widget) => {
  const resizeConfig = getResizeConfig(widget);

  // Si resizeConfig es true, mostrar todos los botones
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
  }

  // Si resizeConfig es false, no mostrar ningún botón
  if (resizeConfig === false) {
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
  }

  // Si resizeConfig es un objeto, usar sus valores
  return {
    top: resizeConfig.top || false,
    right: resizeConfig.right || false,
    bottom: resizeConfig.bottom || false,
    left: resizeConfig.left || false,
    topLeft: resizeConfig.topLeft || false,
    topRight: resizeConfig.topRight || false,
    bottomLeft: resizeConfig.bottomLeft || false,
    bottomRight: resizeConfig.bottomRight || false,
  };
};
