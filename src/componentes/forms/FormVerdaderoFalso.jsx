import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sanitizeText } from "../../utils/validation";
import AlertModal from "../modals/AlertModal";

/**
 * Componente `FormVerdaderoFalso`
 *
 * Formulario para CREAR o EDITAR una pregunta de "Verdadero o Falso".
 * Si recibe `preguntaParaEditar`, se inicializa en modo de edición.
 *
 * @param {object} props - Propiedades del componente.
 * @param {number} props.totalUnidades - Número total de unidades para el selector.
 * @param {object} [props.preguntaParaEditar] - La pregunta a editar (opcional).
 * @returns {JSX.Element}
 */
export default function FormVerdaderoFalso({
  totalUnidades,
  preguntaParaEditar,
  materia = "Sin Materia",
  unidadInicial = 1,
}) {
  const [afirmacion, setAfirmacion] = useState("");
  const [esVerdadero, setEsVerdadero] = useState(true);
  const [unidad, setUnidad] = useState(unidadInicial);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: "error", title: "", message: "" });
  const navigate = useNavigate();

  // `useEffect` para pre-llenar el formulario si se está editando.
  useEffect(() => {
    if (preguntaParaEditar) {
      setAfirmacion(preguntaParaEditar.texto);
      setEsVerdadero(preguntaParaEditar.respC === "Verdadero");
      setUnidad(preguntaParaEditar.unidad);
    }
  }, [preguntaParaEditar]);

  /**
   * Maneja el guardado de la pregunta, ya sea creando una nueva o actualizando una existente.
   */
  const handleSave = () => {
    if (!afirmacion.trim()) {
      setAlertConfig({
        type: "error",
        title: "Campo Requerido",
        message: "Por favor, escribe la afirmación."
      });
      setShowAlert(true);
      return;
    }

    const storageKey = `preguntasGuardadas_${materia}`;
    const preguntasGuardadas = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (preguntaParaEditar) {
      // MODO EDICIÓN: Actualiza la pregunta existente.
      const preguntasActualizadas = preguntasGuardadas.map((p) =>
        p.id === preguntaParaEditar.id
          ? {
              ...p,
              texto: afirmacion.trim(),
              respC: esVerdadero ? "Verdadero" : "Falso",
              resp1: !esVerdadero ? "Verdadero" : "Falso",
              unidad: parseInt(unidad),
            }
          : p
      );
      localStorage.setItem(
        storageKey,
        JSON.stringify(preguntasActualizadas)
      );
      setAlertConfig({
        type: "success",
        title: "¡Excelente!",
        message: "La pregunta ha sido actualizada con éxito."
      });
      setShowAlert(true);
      setTimeout(() => navigate("/preguntas-guardadas"), 1500);
    } else {
      // MODO CREACIÓN: Agrega una nueva pregunta.
      const nuevaPregunta = {
        id: Date.now(),
        texto: afirmacion.trim(),
        tipo: "Verdadero/Falso",
        respC: esVerdadero ? "Verdadero" : "Falso",
        resp1: !esVerdadero ? "Verdadero" : "Falso",
        resp2: "",
        unidad: parseInt(unidad),
        votos: 0,
        materia: materia,
      };
      // Usar clave específica por materia
      const storageKey = `preguntasGuardadas_${materia}`;
      const preguntasDeMateria = JSON.parse(localStorage.getItem(storageKey)) || [];
      
      localStorage.setItem(
        storageKey,
        JSON.stringify([...preguntasDeMateria, nuevaPregunta])
      );
      setAlertConfig({
        type: "success",
        title: "¡Excelente!",
        message: "La pregunta ha sido guardada con éxito."
      });
      setShowAlert(true);
      setTimeout(() => navigate("/preguntas-guardadas"), 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Campo para la afirmación */}
      <div>
        <label
          htmlFor="afirmacion"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Afirmación <span className="text-red-500">*</span>
        </label>
        <textarea
          id="afirmacion"
          value={afirmacion}
          onChange={(e) => setAfirmacion(sanitizeText(e.target.value))}
          placeholder="Ej: La Tierra es plana."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          required
        />
      </div>

      {/* Selección de respuesta (Verdadero o Falso) */}
      <div className="flex items-center gap-4">
        <span className="text-lg font-medium text-gray-700">
          La afirmación es:
        </span>
        <button
          onClick={() => setEsVerdadero(true)}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            esVerdadero
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Verdadero
        </button>
        <button
          onClick={() => setEsVerdadero(false)}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            !esVerdadero
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Falso
        </button>
      </div>

      {/* Selección de unidad */}
      <div>
        <label
          htmlFor="unidad"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Unidad <span className="text-red-500">*</span>
        </label>
        <select
          id="unidad"
          value={unidad}
          onChange={(e) => setUnidad(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {Array.from({ length: totalUnidades }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              Unidad {num}
            </option>
          ))}
        </select>
      </div>

      {/* Nota informativa */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p className="text-sm text-blue-700">
          <strong>Nota:</strong> Los campos marcados con <span className="text-red-500">*</span> son obligatorios. 
          No se permiten emojis ni caracteres especiales.
        </p>
      </div>

      {/* Botón de guardar */}
      <button
        onClick={handleSave}
        className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition transform active:scale-95"
      >
        {preguntaParaEditar ? "Actualizar Pregunta" : "Guardar Pregunta"}
      </button>

      {/* Modal de Alerta */}
      {showAlert && (
        <AlertModal
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
