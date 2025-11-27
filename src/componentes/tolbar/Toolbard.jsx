// Toolbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Save, Plus } from "lucide-react"; // Importa el ícono `Save` y `Plus`

export default function Toolbar({ texto, numero, rightButtonIcon: RightButtonIcon, onRightButtonClick, hideRightButton, onInfoClick, onBackClick, hideInfoButton }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const handleInfo = () => {
    if (onInfoClick) {
      onInfoClick();
    } else {
      // Fallback o comportamiento por defecto si no se pasa la prop
      alert(`Número recibido: ${numero}`);
    }
  };

  // Navega a la página de preguntas guardadas.
  const handleGoToSaved = () => {
    navigate("/preguntas-guardadas");
  };

  return (
    <div className="bg-green-600 text-white flex items-center justify-between p-4 w-full">
      {/* Botón para volver */}
      <button
        onClick={handleBack}
        className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
      >
        <ArrowLeft size={32} />
      </button>

      {/* Título */}
      <h2 className="text-2xl font-bold text-center flex-1 mx-4">{texto}</h2>

      {/* Contenedor para los botones de la derecha */}
      <div className="flex items-center gap-2">
        {/* Botón derecho configurable o por defecto para preguntas guardadas */}
        {!hideRightButton && (
          RightButtonIcon ? (
            <button
              onClick={onRightButtonClick}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
              aria-label="Acción personalizada"
            >
              <RightButtonIcon size={32} />
            </button>
          ) : (
            <button
              onClick={handleGoToSaved}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
              aria-label="Preguntas guardadas"
            >
              <Save size={32} />
            </button>
          )
        )}

        {/* Botón de información */}
        {!hideInfoButton && (
          <button
            onClick={handleInfo}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
            aria-label="Información"
          >
            <Info size={32} />
          </button>
        )}
      </div>
    </div>
  );
}
