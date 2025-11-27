import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

/**
 * Componente `PreguntasGuardadasItem`
 *
 * Muestra una pregunta guardada con opciones para editar, eliminar y seleccionar.
 * Es una versión adaptada de `PreguntasItem` para la gestión local.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.pregunta - El objeto de la pregunta a mostrar.
 * @param {function} props.onDelete - Función a llamar para eliminar la pregunta.
 * @param {function} props.onEdit - Función a llamar para editar la pregunta.
 * @param {boolean} props.isSelected - Indica si el item está seleccionado.
 * @param {function} props.onSelect - Función a llamar cuando se selecciona/deselecciona.
 * @param {boolean} props.selectionMode - Indica si el modo de selección está activo.
 * @returns {JSX.Element}
 */
export default function PreguntasGuardadasItem({
  pregunta,
  onDelete,
  onEdit,
  isSelected,
  onSelect,
  selectionMode,
}) {
  const [open, setOpen] = useState(false);

  // Maneja el clic en el contenedor principal.
  // Si el modo de selección está activo, alterna la selección. Si no, abre/cierra el desplegable.
  const handleContainerClick = () => {
    if (selectionMode) {
      onSelect(pregunta.id);
    } else {
      setOpen(!open);
    }
  };

  return (
    <div
      className={`bg-white shadow rounded-lg p-4 mb-3 transition-all duration-300 w-full flex items-start gap-4 ${
        selectionMode ? "cursor-pointer" : ""
      } ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
      onClick={handleContainerClick}
    >
      {/* Checkbox para selección múltiple */}
      {selectionMode && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(pregunta.id)}
          className="mt-1 h-6 w-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()} // Evita que el clic en el checkbox propague al div
        />
      )}

      {/* Contenido principal de la tarjeta */}
      <div className="flex-grow">
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{pregunta.texto}</h3>
            <p className="text-gray-600 text-sm">{pregunta.tipo}</p>
          </div>
        </div>

        {/* Contenido desplegable */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            open ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <h4 className="font-semibold text-md mb-2">Respuestas:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>{pregunta.resp1}</li>
            {pregunta.resp2 && <li>{pregunta.resp2}</li>}
            <li className="font-bold">{pregunta.respC}</li>
          </ul>

          {/* Botones de acción */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(pregunta.id);
              }}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold transform transition-transform duration-150 active:scale-95"
            >
              <Edit size={18} /> Editar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(pregunta.id);
              }}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full font-semibold transform transition-transform duration-150 active:scale-95"
            >
              <Trash2 size={18} /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
