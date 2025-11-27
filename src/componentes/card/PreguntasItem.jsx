import React, { useState } from "react";
import { CheckCircle2, Clock, ThumbsUp, Flag, Copy, X } from "lucide-react";

export default function PreguntasItem({ 
  pregunta, 
  onReport, 
  onToggleVote, 
  votedHistory = [], 
  pendingVotes = [],
  isAdmin = false,
  isDeleteMode = false,
  isSelected = false,
  onToggleDelete
}) {
  const [open, setOpen] = useState(false);

  const isApproved = (pregunta.votos || 0) >= 20;

  const yaVoto = votedHistory.includes(pregunta.id);
  const esPendiente = pendingVotes.some(p => p.id === pregunta.id);

  const handleVote = (e) => {
    e.stopPropagation();
    if (isApproved) return;
    onToggleVote && onToggleVote(pregunta);
  };

  const handleReportClick = (e) => {
    e.stopPropagation();
    onReport && onReport(pregunta);
  };

  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    alert("ID copiado al portapapeles");
  };

  // Compatibilidad con diferentes estructuras de datos
  const textoPregunta = pregunta.pregunta || pregunta.texto || "Pregunta sin texto";
  const creadorId = pregunta.creador || "Anónimo";
  const respuestaCorrecta = pregunta.correcta || pregunta.respC || "";
  const respuesta1 = pregunta.resp1 || "";
  const respuesta2 = pregunta.resp2 || "";
  const respuesta3 = pregunta.resp3 || "";

  return (
    <div
      className={`bg-white shadow rounded-lg p-4 mb-3 cursor-pointer transition-all duration-300 w-full
        ${isSelected ? "ring-2 ring-red-500 bg-red-50" : ""}
      `}
      onClick={() => {
        if (isDeleteMode && onToggleDelete) {
          onToggleDelete(pregunta);
        } else {
          setOpen(!open);
        }
      }}
    >
      {/* Cabecera del item, visible siempre. */}
      <div className="flex items-center justify-between gap-3">
        {isDeleteMode && (
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0
            ${isSelected ? "bg-red-500 border-red-500" : "border-gray-300"}`}
          >
            {isSelected && <X size={16} className="text-white" />}
          </div>
        )}

        {/* Texto de la pregunta y tipo. */}
        <div className="flex-1">
          <h3 className="font-bold text-lg">{textoPregunta}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {isAdmin && creadorId !== "Anónimo" && (
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">
                  ID: {creadorId}
                </p>
                <button
                  onClick={(e) => copyToClipboard(creadorId, e)}
                  className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition active:scale-95"
                  title="Copiar ID"
                >
                  <Copy size={20} />
                </button>
              </div>
            )}
            
            {!isAdmin && creadorId !== "Anónimo" && (
               <p className="text-gray-600 text-xs">
                 <span className="font-semibold">Creador:</span> Anónimo
               </p>
            )}

            {yaVoto && (
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                Ya votaste
              </span>
            )}
            {esPendiente && (
              <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full">
                En cola
              </span>
            )}
          </div>
        </div>

        {/* Icono de estado (Aprobado o Pendiente). */}
        <div className="flex flex-col items-center ml-4">
          {isApproved ? (
            <CheckCircle2 size={32} className="text-green-500" />
          ) : (
            <Clock size={32} className="text-yellow-500" />
          )}
          <span className="text-xs font-semibold mt-1">
            {pregunta.votos || 0} votos
          </span>
        </div>
      </div>

      {/* Contenido desplegable, se muestra si 'open' es true. */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          open && !isDeleteMode ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <h4 className="font-semibold text-md mb-2">Respuestas:</h4>
        {/* Lista de respuestas. */}
        <ul className="list-disc list-inside space-y-1">
          {respuesta1 && <li>{respuesta1}</li>}
          {respuesta2 && <li>{respuesta2}</li>}
          {respuesta3 && <li>{respuesta3}</li>}
          {/* La respuesta correcta se muestra en negrita. */}
          <li className="font-bold text-green-600">✓ {respuestaCorrecta}</li>
        </ul>

        {/* Botones de acción. */}
        <div className="flex gap-4 mt-4">
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
