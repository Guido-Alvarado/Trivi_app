import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, AlertCircle, X } from "lucide-react";

export default function UnidadItem({
  unidad,
  numero,
  materiaNombre,
  totalUnidades,
}) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({ puntos: 0, cantidad: 0 });
  const [showNoQuestionsModal, setShowNoQuestionsModal] = useState(false);
  const navigate = useNavigate();

  // Extraer número de unidad del string "Unidad X"
  const numeroUnidad = parseInt(unidad.name.replace("Unidad ", "")) || 1;

  // Cargar datos dinámicos al montar o cambiar materia
  useEffect(() => {
    if (!materiaNombre) return;

    // 1. Calcular Cantidad de Preguntas Validadas
    const storageKeyPreguntas = `${materiaNombre}preguntas`;
    const preguntasLocales = JSON.parse(localStorage.getItem(storageKeyPreguntas)) || [];
    const preguntasDeUnidad = preguntasLocales.filter(p => parseInt(p.unidad) === numeroUnidad);
    
    // 2. Obtener Progreso del Quiz
    // Usamos unidad.name ("Unidad 1") porque así es como se guarda en VistaQuiz
    const progressKey = `quizProgress_${materiaNombre}_${unidad.name}`;
    const progresoGuardado = localStorage.getItem(progressKey);

    setStats({
      cantidad: preguntasDeUnidad.length,
      puntos: progresoGuardado ? parseInt(progresoGuardado) : 0
    });

  }, [materiaNombre, unidad.Titulo, numeroUnidad]);

  const handleGoToAgregar = () => {
    navigate(`/vistabd/${numero}`, {
      state: {
        materia: materiaNombre,
        totalUnidades: totalUnidades,
        unidadSeleccionada: numeroUnidad
      },
    });
  };

  return (
    <>
      <div
        className="bg-white shadow rounded-lg p-4 mb-3 cursor-pointer transition-all duration-300"
      >
        {/* Cabecera del item (toggle al hacer clic aquí) */}
        <div
          className="flex items-center justify-between"
          onClick={() => setOpen(!open)}
        >
          <div>
            <h3 className="font-bold text-lg">{unidad.Titulo}</h3>
            <p className="text-gray-600 text-sm">{unidad.name}</p>
          </div>

          {/* Círculo de progreso grande */}
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#4caf50"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 36}
                strokeDashoffset={
                  2 * Math.PI * 36 * (1 - stats.puntos / 100)
                }
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-bold">
              {stats.puntos}%
            </span>
          </div>
        </div>

        {/* Contenido desplegable */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            open ? "max-h-60 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          {/* Cantidad de preguntas */}
          <p className="text-gray-700 font-medium mb-3">
            Preguntas disponibles: {stats.cantidad}
          </p>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleGoToAgregar();
              }}
              className="flex-1 bg-green-600 text-white px-4 py-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2
                        transform transition-transform duration-150 active:scale-95 shadow-md hover:bg-green-700"
            >
              <Plus size={20} />
              Agregar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (stats.cantidad === 0) {
                  setShowNoQuestionsModal(true);
                  return;
                }
                navigate(`/quiz/${numero}`, {
                  state: {
                    materia: materiaNombre,
                    unidad: unidad.name // Pasamos "Unidad X" para que coincida con la lógica de VistaQuiz
                  }
                });
              }}
              className={`flex-1 px-4 py-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2
                        transform transition-transform duration-150 active:scale-95 shadow-md ${
                          stats.cantidad > 0 
                            ? "bg-orange-500 text-white hover:bg-orange-600" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
            >
              <Play size={20} />
              Iniciar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Sin Preguntas */}
      {showNoQuestionsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Unidad sin preguntas</h3>
              <p className="text-gray-600 mb-6">
                Esta unidad aún no tiene preguntas validadas. ¿Te gustaría ser el primero en agregar una?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNoQuestionsModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowNoQuestionsModal(false);
                    handleGoToAgregar();
                  }}
                  className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
