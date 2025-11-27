// Este es un archivo temporal con la implementación completa de VistaBD.jsx
// Copiar y pegar en VistaBD.jsx

import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Toolbar from "../componentes/tolbar/Toolbard";
import PreguntasCard from "../componentes/card/PreguntasCard";
import Buscador from "../componentes/elementos/Buscador";
import { Plus, X, Save, ThumbsUp, Check, CheckCircle, RefreshCw, Filter } from "lucide-react";
import ReportModal from "../componentes/modals/ReportModal";
import { auth, app1 } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export default function VistaBD() {
  const { numero } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { materia = "Materia Desconocida", totalUnidades = 0 } = location.state || {};

  const [unidadActiva, setUnidadActiva] = useState(1);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [itemToReport, setItemToReport] = useState(null);

  // Estados para votación
  const [pendingVotes, setPendingVotes] = useState([]);
  const [votedHistory, setVotedHistory] = useState([]);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showSuccessVoteModal, setShowSuccessVoteModal] = useState(false);

  // Estados para preguntas dinámicas
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Estados para filtrado
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState("todas");

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("votedHistoryPreguntas") || "[]");
    setVotedHistory(history);
  }, []);

  // Cargar preguntas desde caché o Firebase
  useEffect(() => {
    if (!materia || materia === "Materia Desconocida") {
      setLoading(false);
      return;
    }

    const carreraSeleccionada = JSON.parse(localStorage.getItem("carreraSeleccionada"));
    if (!carreraSeleccionada) {
      setLoading(false);
      return;
    }

    const cacheKey = `preguntasCache_${carreraSeleccionada.Nombre}_${materia}`;
    const timeKey = `preguntasCacheTime_${carreraSeleccionada.Nombre}_${materia}`;
    
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(timeKey);

    if (cachedData && cachedTime) {
      setPreguntas(JSON.parse(cachedData));
      setLastUpdate(Number(cachedTime));
      setLoading(false);
    } else {
      loadPreguntasFromFirebase();
    }
  }, [materia]);

  // Actualizar contador de tiempo
  useEffect(() => {
    if (!lastUpdate) return;
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - lastUpdate) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const loadPreguntasFromFirebase = async () => {
    if (!materia || materia === "Materia Desconocida") return;
    
    setLoading(true);
    try {
      const carreraSeleccionada = JSON.parse(localStorage.getItem("carreraSeleccionada"));
      
      if (!carreraSeleccionada) {
        console.error("No hay carrera seleccionada");
        setPreguntas([]);
        setLoading(false);
        return;
      }

      const db = getFirestore(app1);
      const materiaDocRef = doc(db, "UNSa", carreraSeleccionada.Nombre, "materias", materia);
      const materiaDocSnap = await getDoc(materiaDocRef);

      if (materiaDocSnap.exists()) {
        const data = materiaDocSnap.data();
        const preguntasFirebase = data.Preguntas || [];
        setPreguntas(preguntasFirebase);
        
        // Guardar en caché
        const now = Date.now();
        const cacheKey = `preguntasCache_${carreraSeleccionada.Nombre}_${materia}`;
        const timeKey = `preguntasCacheTime_${carreraSeleccionada.Nombre}_${materia}`;
        localStorage.setItem(cacheKey, JSON.stringify(preguntasFirebase));
        localStorage.setItem(timeKey, now.toString());
        setLastUpdate(now);
        setTimeElapsed(0);
      } else {
        setPreguntas([]);
      }
    } catch (error) {
      console.error("Error cargando preguntas:", error);
      setPreguntas([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeElapsed = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const unidadesBotones = Array.from({ length: totalUnidades }, (_, i) => i + 1);

  const handleSearchChange = (e) => {
    setTerminoBusqueda(e.target.value);
  };

  const handleAddQuestion = () => {
    if (auth.currentUser) {
      setShowWarningModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthContinue = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("user_uid", user.uid);
      setShowAuthModal(false);
      alert(`¡Bienvenido ${user.displayName || "Usuario"}! Ahora puedes agregar preguntas.`);
      setShowWarningModal(true);
    } catch (error) {
      console.error("Error login:", error);
      setShowAuthModal(false);
    }
  };

  const handleConfirmAddQuestion = () => {
    setShowWarningModal(false);
    navigate(`/crear-pregunta/${numero}`, { state: { totalUnidades, materia } });
  };

  const handleCloseWarningModal = () => {
    setShowWarningModal(false);
  };

  const handleReport = (pregunta) => {
    setItemToReport(pregunta);
    setShowReportModal(true);
  };

  const handleToggleVote = (pregunta) => {
    if (votedHistory.includes(pregunta.id)) return;

    setPendingVotes(prev => {
      const exists = prev.some(p => p.id === pregunta.id);
      if (exists) {
        return prev.filter(p => p.id !== pregunta.id);
      } else {
        return [...prev, pregunta];
      }
    });
  };

  const confirmVotes = async () => {
    if (pendingVotes.length === 0) return;
    setLoading(true);
    
    try {
      const carreraSeleccionada = JSON.parse(localStorage.getItem("carreraSeleccionada"));
      
      if (!carreraSeleccionada) {
        alert("Error: No hay carrera seleccionada.");
        setLoading(false);
        return;
      }

      const db = getFirestore(app1);
      const materiaDocRef = doc(db, "UNSa", carreraSeleccionada.Nombre, "materias", materia);
      const materiaDocSnap = await getDoc(materiaDocRef);

      if (materiaDocSnap.exists()) {
        const currentPreguntas = materiaDocSnap.data().Preguntas || [];
        
        const updatedPreguntas = currentPreguntas.map(p => {
          const isPending = pendingVotes.some(pv => pv.id === p.id);
          if (isPending) {
            return { ...p, votos: (p.votos || 0) + 1 };
          }
          return p;
        });

        await setDoc(materiaDocRef, { Preguntas: updatedPreguntas }, { merge: true });

        const newHistory = [...votedHistory, ...pendingVotes.map(p => p.id)];
        setVotedHistory(newHistory);
        localStorage.setItem("votedHistoryPreguntas", JSON.stringify(newHistory));
        
        setPendingVotes([]);
        setShowVoteModal(false);
        
        setPreguntas(updatedPreguntas);
        
        const cacheKey = `preguntasCache_${carreraSeleccionada.Nombre}_${materia}`;
        const timeKey = `preguntasCacheTime_${carreraSeleccionada.Nombre}_${materia}`;
        const now = Date.now();
        localStorage.setItem(cacheKey, JSON.stringify(updatedPreguntas));
        localStorage.setItem(timeKey, now.toString());
        setLastUpdate(now);
        
        setShowSuccessVoteModal(true);
      }
    } catch (error) {
      console.error("Error al registrar votos:", error);
      alert("Error al registrar votos");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReport = () => {
    console.log(`Reportando item ${itemToReport}`);
    setShowReportModal(false);
    setItemToReport(null);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setItemToReport(null);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 m-0 p-0">
      <Toolbar 
        texto={`Preguntas de ${materia}`} 
        numero={numero} 
        rightButtonIcon={Save}
        onRightButtonClick={() => navigate("/preguntas-guardadas")}
        hideInfoButton={true}
      />
      <Buscador value={terminoBusqueda} onChange={handleSearchChange} />
      
      {/* Botón de actualización */}
      <div className="px-4 mt-4">
        <button
          onClick={loadPreguntasFromFirebase}
          disabled={loading}
          className="w-full bg-white shadow-md rounded-lg p-3 flex items-center justify-between hover:shadow-lg transition disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            <RefreshCw size={20} className={`text-blue-600 ${loading ? "animate-spin" : ""}`} />
            <span className="font-semibold text-gray-700">
              {loading ? "Actualizando..." : "Actualizar lista"}
            </span>
          </div>
          {lastUpdate && !loading && (
            <span className="text-sm text-gray-500">
              Hace {formatTimeElapsed(timeElapsed)}
            </span>
          )}
        </button>
      </div>

      {/* Botón de filtro */}
      <div className="px-4 mt-2">
        <button
          onClick={() => setShowFilterModal(true)}
          className="w-full bg-white shadow-md rounded-lg p-3 flex items-center justify-between hover:shadow-lg transition"
        >
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-purple-600" />
            <span className="font-semibold text-gray-700">
              Filtrar preguntas
            </span>
          </div>
          {filtroActivo !== "todas" && (
            <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
              {filtroActivo === "noVotadas" ? "No votadas" : "Votadas"}
            </span>
          )}
        </button>
      </div>

      {totalUnidades === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-8">
          No hay unidades disponibles para esta materia.
        </p>
      ) : (
        <>
          <div className="flex gap-2 mt-2 overflow-x-auto px-4">
            {unidadesBotones.map((unidadNum) => (
              <button
                key={unidadNum}
                onClick={() => setUnidadActiva(unidadNum)}
                className={`flex-shrink-0 px-6 py-3 rounded-lg font-bold text-lg transition ${
                  unidadActiva === unidadNum
                    ? "bg-blue-600 text-white"
                    : "bg-white shadow"
                }`}
              >
                Unidad {unidadNum}
                <span className="ml-2 bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {preguntas.filter((p) => p.unidad === unidadNum).length}
                </span>
              </button>
            ))}
          </div>
          <PreguntasCard
            numero={numero}
            materia={materia}
            unidadActiva={unidadActiva}
            terminoBusqueda={terminoBusqueda}
            preguntas={preguntas}
            onReport={handleReport}
            onToggleVote={handleToggleVote}
            votedHistory={votedHistory}
            pendingVotes={pendingVotes}
            filtroActivo={filtroActivo}
          />
        </>
      )}

      {/* Modales... (continúa en siguiente mensaje debido a límite de longitud) */}
    </div>
  );
}
