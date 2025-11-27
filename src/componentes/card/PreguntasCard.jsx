import React from "react";
import PreguntasItem from "./PreguntasItem";

export default function PreguntasCard({ 
  numero, 
  materia, 
  unidadActiva, 
  terminoBusqueda, 
  preguntas, 
  onReport, 
  onToggleVote, 
  votedHistory, 
  pendingVotes, 
  filtroActivo = "todas",
  isAdmin = false,
  isDeleteMode = false,
  selectedToDelete = [],
  onToggleDelete
}) {
  // Filtra las preguntas según la unidad activa, el término de búsqueda y el filtro de votación.
  const preguntasFiltradas = preguntas.filter(
    (p) => {
      const textoPregunta = p.pregunta || p.texto || "";
      const creadorId = p.creador || "";
      const cumpleUnidad = p.unidad === unidadActiva;
      
      // Búsqueda por texto o por ID de creador
      const cumpleBusqueda = textoPregunta.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                             (creadorId && creadorId.toLowerCase().includes(terminoBusqueda.toLowerCase()));
      
      // Aplicar filtro de votación
      let cumpleFiltro = true;
      if (filtroActivo === "noVotadas") {
        cumpleFiltro = !votedHistory.includes(p.id);
      } else if (filtroActivo === "votadas") {
        cumpleFiltro = votedHistory.includes(p.id);
      }
      
      return cumpleUnidad && cumpleBusqueda && cumpleFiltro;
    }
  );

  return (
    <div className="w-full px-4 pb-8 mt-4">
      {preguntasFiltradas.length > 0 ? (
        preguntasFiltradas.map((pregunta) => (
          <PreguntasItem 
            key={pregunta.id} 
            pregunta={pregunta} 
            onReport={onReport}
            onToggleVote={onToggleVote}
            votedHistory={votedHistory}
            pendingVotes={pendingVotes}
            isAdmin={isAdmin}
            isDeleteMode={isDeleteMode}
            isSelected={selectedToDelete.includes(pregunta.id)}
            onToggleDelete={onToggleDelete}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 text-lg mt-8">
          No hay preguntas en esta unidad que coincidan con tu búsqueda.
        </p>
      )}
    </div>
  );
}