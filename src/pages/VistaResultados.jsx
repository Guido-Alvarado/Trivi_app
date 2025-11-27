import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trophy, XCircle, CheckCircle, Home, RotateCcw } from "lucide-react";

export default function VistaResultados() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener resultados del estado de navegación
  const { correctas = 0, incorrectas = 0, total = 0, materia, unidad } = location.state || {};
  
  const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0;

  // Guardar progreso al montar el componente
  useEffect(() => {
    if (materia && unidad && total > 0) {
      // Usamos unidad (que viene como "Unidad X" o "Unidad 1") tal cual se recibe
      // Asegurarse de que coincida con lo que espera UnidadItem (unidad.name)
      const progressKey = `quizProgress_${materia}_${unidad}`;
      
      // Solo actualizamos si el nuevo puntaje es mayor o igual (opcional, pero recomendado)
      // O simplemente sobrescribimos como pidió el usuario "actualice los puntos"
      localStorage.setItem(progressKey, porcentaje.toString());
    }
  }, [materia, unidad, total, porcentaje]);
  
  let mensaje = "";
  let color = "";
  
  if (porcentaje >= 90) {
    mensaje = "¡Excelente trabajo!";
    color = "text-green-600";
  } else if (porcentaje >= 70) {
    mensaje = "¡Muy bien!";
    color = "text-blue-600";
  } else if (porcentaje >= 50) {
    mensaje = "Buen intento";
    color = "text-yellow-600";
  } else {
    mensaje = "Sigue practicando";
    color = "text-red-600";
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-900 p-8 text-center">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Trophy size={48} className="text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Resultados</h1>
          <p className="text-slate-300">Resumen de tu práctica</p>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className={`text-4xl font-bold ${color} mb-2`}>{porcentaje}%</h2>
            <p className="text-xl font-medium text-gray-700">{mensaje}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center">
              <CheckCircle className="text-green-500 mb-2" size={32} />
              <span className="text-2xl font-bold text-gray-800">{correctas}</span>
              <span className="text-sm text-gray-500">Correctas</span>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col items-center">
              <XCircle className="text-red-500 mb-2" size={32} />
              <span className="text-2xl font-bold text-gray-800">{incorrectas}</span>
              <span className="text-sm text-gray-500">Incorrectas</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Intentar de nuevo
            </button>
            <button
              onClick={() => navigate(-2)}
              className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
