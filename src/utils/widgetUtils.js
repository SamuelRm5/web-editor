// src/utils/widgetUtils.js
import {
  getWidgetResizeConfig,
  shouldLockAspectRatioForHandle,
} from "./widgetResizeConfig.js";

/**
 * Obtiene la configuración de resize handles para un widget
 * Ahora usa el sistema centralizado de configuración
 */
export const getResizeConfig = (widget) => {
  const config = getWidgetResizeConfig(widget.type);
  return config.handles;
};

/**
 * Determina si se debe mantener el aspect ratio para un widget
 * Ahora usa el sistema centralizado de configuración
 */
export const getLockAspectRatio = (widget) => {
  const config = getWidgetResizeConfig(widget.type);
  return (
    config.aspectRatio === true ||
    config.aspectRatio === "square" ||
    config.aspectRatio?.type === "conditional"
  );
};

/**
 * Obtiene las restricciones de tamaño para un widget
 * Nueva función que usa el sistema centralizado
 */
export const getWidgetConstraints = (widget) => {
  const config = getWidgetResizeConfig(widget.type);
  return config.constraints;
};

/**
 * Verifica si un handle específico debe mantener aspect ratio
 * Útil para el sistema "conditional" y manejo avanzado
 */
export const shouldLockAspectRatioForWidgetHandle = (widget, handle) => {
  return shouldLockAspectRatioForHandle(widget.type, handle);
};

/**
 * Función de conveniencia para obtener toda la configuración de un widget
 */
export const getFullWidgetConfig = (widget) => {
  return getWidgetResizeConfig(widget.type);
};
