import { useParams, useNavigate } from "react-router-dom";
import { Plus, X, RefreshCw } from "lucide-react";
import MateriasCard from "../componentes/card/MateriasCard";
import Toolbar from "../componentes/tolbar/Toolbard";
import { useState } from "react";

export default function VistaMaterias() {
  const { anio } = useParams(); // obtiene el parámetro de la URL
  const navigate = useNavigate();
  const numero = parseInt(anio, 10); // lo convertimos a número
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showRefreshModal, setShowRefreshModal] = useState(false);

  const handleAddMateria = () => {
    navigate("/materias-propuestas");
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleInfoClick = () => {
    setShowInfoModal(true);
  };

  const handleCloseModal = () => {
    setShowInfoModal(false);
  };

  const handleRefreshClick = () => {
    setShowRefreshModal(true);
  };

  const confirmRefresh = () => {
    // Obtener la carrera seleccionada
    const carreraSeleccionada = JSON.parse(localStorage.getItem("carreraSeleccionada"));
    
    if (carreraSeleccionada) {
      const cacheKey = `materiasCandidatasCache_${carreraSeleccionada.Nombre}`;
      const timeKey = `materiasCandidatasCacheTime_${carreraSeleccionada.Nombre}`;
      
      // Eliminar del localStorage para forzar recarga desde Firebase
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(timeKey);

      // NUEVO: Eliminar todo el progreso de las unidades (quizProgress_...)
      // Iteramos sobre las claves para encontrar las de progreso y borrarlas
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("quizProgress_")) {
          localStorage.removeItem(key);
        }
      });
      
      setShowRefreshModal(false);
      
      // Recargar la página para que MateriasCard vuelva a cargar desde Firebase
      window.location.reload();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 m-0 p-0">
      <Toolbar
        texto={`Materias del Año ${numero}`}
        numero={numero}
        onBackClick={handleBack}
        onInfoClick={handleInfoClick}
        hideRightButton={true}
      />
      <MateriasCard numero={numero} />
      
      {/* Botón flotante para actualizar materias */}
      <button
        onClick={handleRefreshClick}
        className="fixed bottom-24 right-6 bg-orange-500 text-white p-4 rounded-full shadow-2xl hover:bg-orange-600 hover:scale-110 active:scale-95 transition-all duration-200 z-50"
        title="Actualizar materias validadas"
      >
        <RefreshCw size={28} />
      </button>

      {/* Botón flotante para agregar */}
      <button
        onClick={handleAddMateria}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-200 z-50"
        title="Proponer materia"
      >
        <Plus size={32} />
      </button>

      {/* Modal de Información */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Cabecera del Modal */}
            <div className="bg-green-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">Información</h3>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 flex flex-col gap-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-blue-800 font-medium mb-3">
                  ¿Qué puedes hacer aquí?
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Practicar:</strong> Pon a prueba tu conocimiento con las preguntas de opción múltiple o verdadero/falso ya guardadas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Agregar:</strong> Puedes agregar nuevas preguntas a las unidades de materias que aún no tienen contenido.</span>
                  </li>
                </ul>
              </div>
              
              <button
                onClick={handleCloseModal}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Actualización */}
      {showRefreshModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Actualizar materias?</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Se actualizarán las materias validadas desde Firebase.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-6 text-left">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>⚠️ Advertencia:</strong>
                </p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Se resetearán los puntajes de todas las unidades</li>
                  <li>Se perderá el progreso actual</li>
                  <li>Se cargarán las últimas materias validadas (≥20 votos)</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRefreshModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmRefresh}
                  className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition shadow-lg"
                >
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
