import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  ThumbsUp,
  Flag,
  ChevronDown,
  ChevronUp,
  X,
  Copy,
} from "lucide-react";

export default function CardListas({ 
  numero, 
  items, 
  onToggleVoto, 
  votedHistory = [], 
  pendingVotes = [], 
  onReport,
  isDeleteMode = false,
  selectedToDelete = [],
  onToggleDelete,
  isAdmin = false
}) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);

  React.useEffect(() => {
    const saved = localStorage.getItem("carreraSeleccionada");
    if (saved) {
      setCarreraSeleccionada(JSON.parse(saved));
    }
  }, []);

  const toggleExpand = (index) => {
    if (isDeleteMode) return; // No expandir en modo eliminar
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleVotar = (item) => {
    if (item.Votos >= 20) return;
    if (onToggleVoto) {
      onToggleVoto(item);
    }
  };

  const handleSeleccionar = (item) => {
    if (item.Votos < 20) {
      return;
    }
    
    if (numero === 1) {
      localStorage.setItem("carreraSeleccionada", JSON.stringify(item));
      setCarreraSeleccionada(item);
    } else {
      alert("Materia guardada correctamente ✅");
    }
  };

  const handleDeseleccionar = (e) => {
    e.stopPropagation();
    localStorage.removeItem("carreraSeleccionada");
    setCarreraSeleccionada(null);
  };

  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    alert("ID copiado al portapapeles");
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => {
        const tiene20 = item.Votos >= 20;
        const isSelected = numero === 1 && carreraSeleccionada && carreraSeleccionada.Nombre === item.Nombre;
        const isMarkedForDeletion = selectedToDelete.includes(item.Nombre);
        
        // Verificar estados de voto
        const yaVoto = votedHistory.includes(item.Nombre);
        const esPendiente = pendingVotes.some(p => p.Nombre === item.Nombre);

        return (
          <div
            key={index}
            className={`bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 
              ${isSelected ? "ring-2 ring-green-500" : ""}
              ${isMarkedForDeletion ? "ring-2 ring-red-500 bg-red-50" : ""}
            `}
            onClick={() => {
              if (isDeleteMode && onToggleDelete) {
                onToggleDelete(item);
              }
            }}
          >
            {/* Header */}
            <div
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => !isDeleteMode && toggleExpand(index)}
            >
              <div className="flex items-center gap-3 overflow-hidden w-full">
                {isDeleteMode && (
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0
                    ${isMarkedForDeletion ? "bg-red-500 border-red-500" : "border-gray-300"}`}
                  >
                    {isMarkedForDeletion && <X size={16} className="text-white" />}
                  </div>
                )}
                
                <div className="overflow-hidden flex-1">
                  <h3 className="font-bold text-lg whitespace-nowrap animate-marquee">
                    {item.Nombre}
                  </h3>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm text-gray-500">
                      {numero === 1 ? `${item.Año} años` : ""}
                    </p>
                    <p className="text-xs text-gray-600">
                      Votos: {item.Votos}/20
                    </p>
                    {isAdmin && item.idCreador && (
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">
                          ID: {item.idCreador}
                        </p>
                        <button
                          onClick={(e) => copyToClipboard(item.idCreador, e)}
                          className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition active:scale-95"
                          title="Copiar ID"
                        >
                          <Copy size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!isDeleteMode && (
                <div className="flex items-center gap-3 ml-2">
                  {tiene20 ? (
                    <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                      <span className="hidden sm:inline">Listo</span>
                      <CheckCircle size={24} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-600 font-bold text-sm">
                      <span className="hidden sm:inline">Espera</span>
                      <Clock size={24} />
                    </div>
                  )}
                  {expandedIndex === index ? <ChevronUp /> : <ChevronDown />}
                </div>
              )}
            </div>

            {/* Contenido expandido */}
            <div
              className={`grid transition-all duration-500 ease-in-out ${
                expandedIndex === index
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 flex flex-col gap-3">
                  {/* Si es materia, mostrar unidades */}
                  {numero === 2 && item.Unidades && item.Unidades.length > 0 && (
                    <div className="pl-2 flex flex-col gap-1">
                      <p className="font-semibold">Unidades:</p>
                      {item.Unidades.map((u, i) => (
                        <span key={i} className="text-gray-600 text-sm">
                          - {u}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 mt-2">
                    {/* Botones Votar y Reportar solo si NO tiene 20 votos */}
                    {!tiene20 && (
                      <>
                        <button
                          onClick={() => handleVotar(item)}
                          disabled={yaVoto}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition
                            ${yaVoto 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : esPendiente 
                                  ? "bg-orange-100 text-orange-700 border border-orange-300" 
                                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                        >
                          {yaVoto ? "Votado" : esPendiente ? "En cola" : "Votar"} 
                          <ThumbsUp size={16} className={esPendiente ? "fill-current" : ""} />
                        </button>
                        
                        <button 
                          onClick={() => onReport && onReport(item)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        >
                          Reportar <Flag size={16} />
                        </button>
                      </>
                    )}

                    {/* Botón seleccionar / guardar */}
                    {isSelected && numero === 1 ? (
                      <button
                        onClick={handleDeseleccionar}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition font-bold bg-red-100 text-red-600 hover:bg-red-200 border border-red-200"
                      >
                        <X size={20} />
                        Deseleccionar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSeleccionar(item)}
                        disabled={!tiene20}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition font-bold
                          ${
                            tiene20
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        {numero === 1 ? "Seleccionar Carrera" : "Guardar Materia"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
