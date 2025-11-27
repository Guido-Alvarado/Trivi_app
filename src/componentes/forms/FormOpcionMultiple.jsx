import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sanitizeText } from "../../utils/validation";
import AlertModal from "../modals/AlertModal";

/**
 * Componente `FormOpcionMultiple`
 *
 * Formulario para CREAR o EDITAR una pregunta de "Opción Múltiple".
 * Si recibe `preguntaParaEditar`, se inicializa en modo de edición.
 *
 * @param {object} props - Propiedades del componente.
 * @param {number} props.totalUnidades - Número total de unidades para el selector.
 * @param {object} [props.preguntaParaEditar] - La pregunta a editar (opcional).
 * @returns {JSX.Element}
 */
export default function FormOpcionMultiple({
  totalUnidades,
  preguntaParaEditar,
  materia = "Sin Materia",
  unidadInicial = 1,
}) {
  const [pregunta, setPregunta] = useState("");
  const [respCorrecta, setRespCorrecta] = useState("");
  const [respIncorrecta1, setRespIncorrecta1] = useState("");
  const [respIncorrecta2, setRespIncorrecta2] = useState("");
  const [respIncorrecta3, setRespIncorrecta3] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [unidad, setUnidad] = useState(unidadInicial);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: "error", title: "", message: "" });
  const navigate = useNavigate();

  // `useEffect` para pre-llenar el formulario si se está editando.
  useEffect(() => {
    if (preguntaParaEditar) {
      setPregunta(preguntaParaEditar.texto);
      setRespCorrecta(preguntaParaEditar.respC);
      setRespIncorrecta1(preguntaParaEditar.resp1);
      setRespIncorrecta2(preguntaParaEditar.resp2);
      setRespIncorrecta3(preguntaParaEditar.resp3 || "");
      setJustificacion(preguntaParaEditar.justificacion || "");
      setUnidad(preguntaParaEditar.unidad);
    }
  }, [preguntaParaEditar]);

  // Manejadores con sanitización
  const handlePreguntaChange = (e) => {
    setPregunta(sanitizeText(e.target.value));
  };

  const handleRespCorrectaChange = (e) => {
    setRespCorrecta(sanitizeText(e.target.value));
  };

  const handleRespIncorrecta1Change = (e) => {
    setRespIncorrecta1(sanitizeText(e.target.value));
  };

  const handleRespIncorrecta2Change = (e) => {
    setRespIncorrecta2(sanitizeText(e.target.value));
  };

  const handleRespIncorrecta3Change = (e) => {
    setRespIncorrecta3(sanitizeText(e.target.value));
  };

  const handleJustificacionChange = (e) => {
    setJustificacion(sanitizeText(e.target.value));
  };

  /**
   * Maneja el guardado, ya sea creando o actualizando.
   */
  const handleSave = () => {
    // Validación de campos obligatorios
    if (!pregunta.trim()) {
      setAlertConfig({
        type: "error",
        title: "Campo Requerido",
        message: "Por favor, ingresa la pregunta."
      });
      setShowAlert(true);
      return;
    }
    if (!respCorrecta.trim()) {
      setAlertConfig({
        type: "error",
        title: "Campo Requerido",
        message: "Por favor, ingresa la respuesta correcta."
      });
      setShowAlert(true);
      return;
    }
    if (!respIncorrecta1.trim()) {
      setAlertConfig({
        type: "error",
        title: "Campo Requerido",
        message: "Por favor, ingresa la primera respuesta incorrecta."
      });
      setShowAlert(true);
      return;
    }
    if (!respIncorrecta2.trim()) {
      setAlertConfig({
        type: "error",
        title: "Campo Requerido",
        message: "Por favor, ingresa la segunda respuesta incorrecta."
      });
      setShowAlert(true);
      return;
    }
    if (!respIncorrecta3.trim()) {
      setAlertConfig({
        type: "error",
        title: "Campo Requerido",
        message: "Por favor, ingresa la tercera respuesta incorrecta."
      });
      setShowAlert(true);
      return;
    }

    const storageKey = `preguntasGuardadas_${materia}`;
    const preguntasGuardadas = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (preguntaParaEditar) {
      // MODO EDICIÓN
      const preguntasActualizadas = preguntasGuardadas.map((p) =>
        p.id === preguntaParaEditar.id
          ? {
              ...p,
              texto: pregunta.trim(),
              respC: respCorrecta.trim(),
              resp1: respIncorrecta1.trim(),
              resp2: respIncorrecta2.trim(),
              resp3: respIncorrecta3.trim(),
              justificacion: justificacion.trim(),
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
      // MODO CREACIÓN
      const nuevaPregunta = {
        id: Date.now(),
        texto: pregunta.trim(),
        tipo: "Opción múltiple",
        respC: respCorrecta.trim(),
        resp1: respIncorrecta1.trim(),
        resp2: respIncorrecta2.trim(),
        resp3: respIncorrecta3.trim(),
        justificacion: justificacion.trim(),
        unidad: parseInt(unidad),
        votos: 0,
        materia: materia,
      };
      localStorage.setItem(
        storageKey,
        JSON.stringify([...preguntasGuardadas, nuevaPregunta])
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
      {/* Campo para la pregunta */}
      <div>
        <label
          htmlFor="pregunta"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Pregunta <span className="text-red-500">*</span>
        </label>
        <textarea
          id="pregunta"
          value={pregunta}
          onChange={handlePreguntaChange}
          placeholder="Ej: ¿Cuál es la capital de Francia?"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
          rows="3"
          required
        />
      </div>

      {/* Campo para la respuesta correcta */}
      <div>
        <label
          htmlFor="respCorrecta"
          className="block text-lg font-medium text-green-600 mb-2"
        >
          Respuesta Correcta <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="respCorrecta"
          value={respCorrecta}
          onChange={handleRespCorrectaChange}
          placeholder="Ej: París"
          className="w-full p-3 border border-green-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
          required
        />
      </div>

      {/* Campos para las respuestas incorrectas */}
      <div>
        <label
          htmlFor="respIncorrecta1"
          className="block text-lg font-medium text-red-600 mb-2"
        >
          Respuesta Incorrecta 1 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="respIncorrecta1"
          value={respIncorrecta1}
          onChange={handleRespIncorrecta1Change}
          placeholder="Ej: Londres"
          className="w-full p-3 border border-red-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="respIncorrecta2"
          className="block text-lg font-medium text-red-600 mb-2"
        >
          Respuesta Incorrecta 2 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="respIncorrecta2"
          value={respIncorrecta2}
          onChange={handleRespIncorrecta2Change}
          placeholder="Ej: Berlín"
          className="w-full p-3 border border-red-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="respIncorrecta3"
          className="block text-lg font-medium text-red-600 mb-2"
        >
          Respuesta Incorrecta 3 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="respIncorrecta3"
          value={respIncorrecta3}
          onChange={handleRespIncorrecta3Change}
          placeholder="Ej: Madrid"
          className="w-full p-3 border border-red-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>

      {/* Campo de justificación (opcional) */}
      <div>
        <label
          htmlFor="justificacion"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Justificación <span className="text-gray-400 text-sm">(Opcional)</span>
        </label>
        <textarea
          id="justificacion"
          value={justificacion}
          onChange={handleJustificacionChange}
          placeholder="Explica por qué esta es la respuesta correcta (opcional)"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
          rows="2"
        />
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
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
