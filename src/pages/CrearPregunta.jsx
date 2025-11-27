import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Toolbar from "../componentes/tolbar/Toolbard";
import FormVerdaderoFalso from "../componentes/forms/FormVerdaderoFalso";
import FormOpcionMultiple from "../componentes/forms/FormOpcionMultiple";

/**
 * Componente `CrearPregunta`
 *
 * Esta página permite a los usuarios crear nuevos tipos de preguntas,
 * seleccionando entre "Verdadero/Falso" y "Opción Múltiple".
 *
 * @returns {JSX.Element} La interfaz de usuario para la creación de preguntas.
 */
export default function CrearPregunta() {
  // Obtiene el número de la materia desde los parámetros de la URL.
  const { numero } = useParams();
  const location = useLocation();

  // Extrae `totalUnidades`, `materia` y `unidadSeleccionada` del estado de la ubicación para pasarlo a los formularios.
  // Si no hay materia en el state, intentamos recuperarla del localStorage (persistencia)
  const state = location.state || {};
  const totalUnidades = state.totalUnidades || 5;
  const materia = state.materia || localStorage.getItem("materiaActiva") || "Sin Materia";
  const unidadSeleccionada = state.unidadSeleccionada || 1;

  // Estado para gestionar el tipo de pregunta seleccionada ('vf' o 'multiple').
  const [tipoPregunta, setTipoPregunta] = useState(null);

  /**
   * Renderiza el formulario correspondiente según el tipo de pregunta seleccionado.
   * @returns {JSX.Element|null} El componente del formulario o null si no se ha seleccionado ninguno.
   */
  const renderFormulario = () => {
    switch (tipoPregunta) {
      case "vf":
        return <FormVerdaderoFalso totalUnidades={totalUnidades} materia={materia} unidadInicial={unidadSeleccionada} />;
      case "multiple":
        return <FormOpcionMultiple totalUnidades={totalUnidades} materia={materia} unidadInicial={unidadSeleccionada} />;
      default:
        return (
          <p className="text-center text-gray-500">
            Por favor, selecciona un tipo de pregunta para comenzar.
          </p>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toolbar texto="Crear Nueva Pregunta" hideInfoButton={true} />

      <main className="p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Selecciona el Tipo de Pregunta
          </h2>

          {/* Botones para seleccionar el tipo de pregunta */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setTipoPregunta("vf")}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition ${
                tipoPregunta === "vf"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Verdadero/Falso
            </button>
            <button
              onClick={() => setTipoPregunta("multiple")}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition ${
                tipoPregunta === "multiple"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Opción Múltiple
            </button>
          </div>

          {/* Renderiza el formulario seleccionado */}
          <div className="mt-6">{renderFormulario()}</div>
        </div>
      </main>
    </div>
  );
}
