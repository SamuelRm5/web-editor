// src/components/Toolbar.jsx
import React, { useMemo } from "react";
import "./Toolbar.css";

// Función para crear imagen optimizada con dimensiones reales
const createOptimizedImage = (src, addWidget, updateWidget) => {
  // Crear el widget inmediatamente con dimensiones por defecto
  const widgetId = addWidget("image", { src: src });

  // Luego optimizar las dimensiones en background
  const img = new Image();
  img.onload = () => {
    // Calcular dimensiones optimizadas
    const maxWidth = 400;
    const maxHeight = 300;

    let { width, height } = img;

    // Si la imagen es muy grande, escalarla manteniendo proporciones
    if (width > maxWidth || height > maxHeight) {
      const scaleWidth = maxWidth / width;
      const scaleHeight = maxHeight / height;
      const scale = Math.min(scaleWidth, scaleHeight);

      width = Math.round(width * scale);
      height = Math.round(height * scale);

      // Actualizar las dimensiones del widget ya creado
      updateWidget(widgetId, { width, height });
    }
  };

  img.onerror = () => {
    console.warn("Error loading image for size calculation:", src);
  };

  img.src = src;

  return widgetId;
};

const Toolbar = ({
  addWidget,
  onClearAll,
  onRemoveSelected,
  updateWidget,
  selectedId,
  widgets,
}) => {
  const selectedWidget = useMemo(() => {
    return widgets.find((widget) => widget.id === selectedId);
  }, [widgets, selectedId]);

  const shapes = [
    { type: "rectangle", icon: "▭", label: "Rectángulo" },
    { type: "circle", icon: "○", label: "Círculo" },
    { type: "star", icon: "★", label: "Estrella" },
  ];

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3 className="toolbar-title">Widgets</h3>
        <div className="toolbar-group">
          <button
            className="toolbar-btn primary"
            onClick={() => addWidget("text")}
            title="Agregar texto"
          >
            <span className="btn-icon">T</span>
            <span className="btn-label">Texto</span>
          </button>
          <button
            className="toolbar-btn primary"
            onClick={() => addWidget("image")}
            title="Agregar imagen"
          >
            <span className="btn-icon">🖼️</span>
            <span className="btn-label">Imagen</span>
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <h3 className="toolbar-title">Formas</h3>
        <div className="toolbar-group shapes-grid">
          {shapes.map((shape) => (
            <button
              key={shape.type}
              className="toolbar-btn shape-btn"
              onClick={() => addWidget(shape.type)}
              title={shape.label}
            >
              <span className="shape-icon">{shape.icon}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <h3 className="toolbar-title">Acciones</h3>
        <div className="toolbar-group">
          {selectedId && (
            <button
              className="toolbar-btn danger"
              onClick={onRemoveSelected}
              title="Eliminar seleccionado"
            >
              <span className="btn-icon">🗑️</span>
              <span className="btn-label">Eliminar</span>
            </button>
          )}
          <button
            className="toolbar-btn secondary"
            onClick={onClearAll}
            title="Limpiar todo"
          >
            <span className="btn-icon">🔄</span>
            <span className="btn-label">Limpiar</span>
          </button>
        </div>
      </div>

      <div className="toolbar-section images">
        <h3 className="toolbar-title">Imágenes</h3>
        <div className="toolbar-group">
          <button
            className="toolbar-btn primary"
            onClick={() =>
              createOptimizedImage(
                "https://picsum.photos/300/200?random=1",
                addWidget,
                updateWidget
              )
            }
          >
            Imagen 1
          </button>
          <button
            className="toolbar-btn primary"
            onClick={() =>
              createOptimizedImage(
                "https://picsum.photos/300/200?random=2",
                addWidget,
                updateWidget
              )
            }
          >
            Imagen 2
          </button>
          <button
            className="toolbar-btn primary"
            onClick={() =>
              createOptimizedImage(
                "https://images.unsplash.com/photo-1500817487388-039e623edc21?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                addWidget,
                updateWidget
              )
            }
          >
            Imagen 3
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        {selectedWidget && (
          <div className="widget-config">
            <h3 className="toolbar-title">Transformaciones</h3>
            <label>
              Rotación: {selectedWidget.rotation || 0}°
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={selectedWidget.rotation || 0}
                onChange={(e) =>
                  updateWidget(selectedId, {
                    rotation: parseInt(e.target.value),
                  })
                }
                className="rotation-slider"
                title="Rotar widget"
              />
            </label>
            <div className="rotation-buttons">
              <button
                className="toolbar-btn secondary small"
                onClick={() =>
                  updateWidget(selectedId, {
                    rotation: ((selectedWidget.rotation || 0) - 15) % 360,
                  })
                }
                title="Rotar -15°"
              >
                ↺ -15°
              </button>
              <button
                className="toolbar-btn secondary small"
                onClick={() => updateWidget(selectedId, { rotation: 0 })}
                title="Resetear rotación"
              >
                ⟲ 0°
              </button>
              <button
                className="toolbar-btn secondary small"
                onClick={() =>
                  updateWidget(selectedId, {
                    rotation: ((selectedWidget.rotation || 0) + 15) % 360,
                  })
                }
                title="Rotar +15°"
              >
                ↻ +15°
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="toolbar-section">
        {selectedWidget?.type === "text" && (
          <div className="widget-config grid">
            <label>
              Fuente:
              <select
                value={selectedWidget.fontFamily}
                onChange={(e) =>
                  updateWidget(selectedId, { fontFamily: e.target.value })
                }
              >
                <option value="Arial">Arial</option>
                <option value="sans-serif">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </label>
            <label>
              Tamaño:
              <input
                type="number"
                className="border border-neutral-400 rounded px-2 py-1"
                value={selectedWidget.fontSize}
                onChange={(e) =>
                  updateWidget(selectedId, {
                    fontSize: parseInt(e.target.value) || 16,
                  })
                }
              />
            </label>
            <label>
              Color:
              <input
                type="color"
                value={selectedWidget.color}
                onChange={(e) =>
                  updateWidget(selectedId, { color: e.target.value })
                }
              />
            </label>

            {/* Controles de formato */}
            <div className="format-controls">
              <label className="format-label">Formato:</label>
              <div className="format-buttons">
                <button
                  className={`format-btn ${
                    selectedWidget.bold ? "active" : ""
                  }`}
                  onClick={() =>
                    updateWidget(selectedId, { bold: !selectedWidget.bold })
                  }
                  title="Negrita"
                >
                  <strong>B</strong>
                </button>
                <button
                  className={`format-btn ${
                    selectedWidget.italic ? "active" : ""
                  }`}
                  onClick={() =>
                    updateWidget(selectedId, { italic: !selectedWidget.italic })
                  }
                  title="Cursiva"
                >
                  <em>I</em>
                </button>
                <button
                  className={`format-btn ${
                    selectedWidget.underlined ? "active" : ""
                  }`}
                  onClick={() =>
                    updateWidget(selectedId, {
                      underlined: !selectedWidget.underlined,
                    })
                  }
                  title="Subrayado"
                >
                  <u>U</u>
                </button>
                <button
                  className={`format-btn ${
                    selectedWidget.strikethrough ? "active" : ""
                  }`}
                  onClick={() =>
                    updateWidget(selectedId, {
                      strikethrough: !selectedWidget.strikethrough,
                    })
                  }
                  title="Tachado"
                >
                  <s>S</s>
                </button>
              </div>
            </div>

            {/* Control de alineación */}
            <label>
              Alineación:
              <select
                value={selectedWidget.align || "left"}
                onChange={(e) =>
                  updateWidget(selectedId, { align: e.target.value })
                }
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
