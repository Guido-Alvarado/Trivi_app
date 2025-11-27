import React, { useState } from "react";
import { ThumbsUp, Flag, CheckCircle2, Clock, ChevronDown, ChevronUp, Copy, X } from "lucide-react";

export default function MateriaCandidataItem({ 
  materia, 
  onToggleVote, 
  votedHistory = [], 
  pendingVotes = [], 
  onReport,
  isAdmin = false,
  isDeleteMode = false,
  isSelected = false,
  onToggleDelete
}) {
  const [expanded, setExpanded] = useState(false);

  // Usar propiedades con mayúscula según estructura Firebase
  const nombre = materia.Nombre || materia.nombre;
  const votos = materia.Votos || materia.votos || 0;
  const unidades = materia.Unidades || materia.unidades || [];
  const idCreador = materia.idCreador || materia.Creador; // Unificar nombres de propiedad

  const isApproved = votos >= 20;
  const yaVoto = votedHistory.includes(nombre);
  const esPendiente = pendingVotes.some(p => (p.Nombre || p.nombre) === nombre);

  const handleVote = (e) => {
    e.stopPropagation();
    if (isApproved) return;
    onToggleVote && onToggleVote(materia);
  };

  const handleReportClick = (e) => {
    e.stopPropagation();
    onReport && onReport(materia);
  };

  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    alert("ID copiado al portapapeles");
  };

  return (
    <div 
      className={`bg-white shadow rounded-lg p-4 mb-3 w-full cursor-pointer transition-all duration-300 
        ${isSelected ? "ring-2 ring-red-500 bg-red-50" : ""}
      `}
      onClick={() => {
        if (isDeleteMode && onToggleDelete) {
          onToggleDelete(materia);
        } else {
          setExpanded(!expanded);
        }
      }}
    >
      <div className="flex items-center justify-between gap-3">
        {isDeleteMode && (
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0
            ${isSelected ? "bg-red-500 border-red-500" : "border-gray-300"}`}
          >
            {isSelected && <X size={16} className="text-white" />}
          </div>
        )}

        <div className="flex-1">
          <h3 className="font-bold text-lg">{nombre}</h3>
          
          {isAdmin && idCreador && (
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">
                ID: {idCreador}
              </p>
              <button
                onClick={(e) => copyToClipboard(idCreador, e)}
                className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition active:scale-95"
                title="Copiar ID"
              >
                <Copy size={20} />
              </button>
            </div>
          )}
          
          {!idCreador && materia.autor && (
            <p className="text-gray-600 text-sm">Propuesta por: {materia.autor}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            {isApproved ? (
              <CheckCircle2 size={28} className="text-green-500" />
            ) : (
              <Clock size={28} className="text-yellow-500" />
            )}
            <span className="text-xs font-semibold mt-1">
              {votos} votos
            </span>
          </div>
          {!isDeleteMode && (
            expanded ? <ChevronUp size={24} className="text-gray-400" /> : <ChevronDown size={24} className="text-gray-400" />
          )}
        </div>
      </div>
      
      <div className={`transition-all duration-500 overflow-hidden ${expanded && !isDeleteMode ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
        <div className="mb-4">
          <h4 className="font-bold text-gray-700 mb-2">Unidades:</h4>
          <ul className="space-y-2">
            {unidades.length > 0 ? (
              unidades.map((unidad, index) => (
                <li key={index} className="bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="font-semibold text-sm text-gray-500 block">Unidad {unidad.numero}:</span>
                  <span className="text-gray-800">{unidad.titulo}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm italic">Sin unidades definidas</li>
            )}
          </ul>
        </div>

        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
          {!isApproved && (
            <>
              <button
                onClick={handleVote}
                disabled={yaVoto}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-150 active:scale-95 ${
                  yaVoto
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : esPendiente
                      ? "bg-orange-100 text-orange-700 border border-orange-300"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                <ThumbsUp size={20} className={esPendiente ? "fill-current" : ""} />
                {yaVoto ? "Votado" : esPendiente ? "En cola" : "Votar"}
              </button>
              <button
                onClick={handleReportClick}
                className="flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-150 active:scale-95 bg-red-100 text-red-600 hover:bg-red-200"
              >
                <Flag size={20} />
                Reportar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
