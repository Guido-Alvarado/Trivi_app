import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Toolbar from "../componentes/tolbar/Toolbard";
import PreguntasCard from "../componentes/card/PreguntasCard";
import Buscador from "../componentes/elementos/Buscador";
import { Plus, X, Save, ThumbsUp, Check, CheckCircle, RefreshCw, Filter, List, Star, CheckCheck, Trash2, AlertTriangle, ListChecks } from "lucide-react";
import ReportModal from "../componentes/modals/ReportModal";
import { auth, app1 } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export default function VistaBD() {
  const { numero } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Recuperar estado de navegación o fallback a localStorage
  const stateMateria = location.state?.materia;
  const [materia, setMateria] = useState(stateMateria || localStorage.getItem("materiaActiva") || "Materia Desconocida");
  const { totalUnidades = 0 } = location.state || {};

  useEffect(() => {
    if (stateMateria) {
      localStorage.setItem("materiaActiva", stateMateria);
      setMateria(stateMateria);
    }
  }, [stateMateria]);

  const [unidadActiva, setUnidadActiva] = useState(1);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [itemToReport, setItemToReport] = useState(null);

  // Estados para admin y borrado
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    // Verificar si es admin
    const adminStatus = localStorage.getItem("administrador") === "true";
    setIsAdmin(adminStatus);
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
    const sessionKey = `preguntasLoaded_${carreraSeleccionada.Nombre}_${materia}`;
    
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(timeKey);

    // Verificar si es una nueva sesión para esta materia
    const isNewSession = !sessionStorage.getItem(sessionKey);

    if (isNewSession) {
      // Es una nueva sesión, actualizar desde Firebase
      sessionStorage.setItem(sessionKey, "true");
      loadPreguntasFromFirebase();
    } else if (cachedData && cachedTime) {
      // Ya hay una sesión activa, usar cache
      setPreguntas(JSON.parse(cachedData));
      setLastUpdate(Number(cachedTime));
      setLoading(false);
    } else {
      // No hay cache, cargar desde Firebase
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

        // NUEVO: Guardar array de preguntas VALIDADAS para el Quiz
        // Solo preguntas con 20 o más votos
        const preguntasValidadas = preguntasFirebase.filter(p => (p.votos || 0) >= 20);
        localStorage.setItem(`${materia}preguntas`, JSON.stringify(preguntasValidadas));

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

  // Crear un array para los botones de las unidades.
  const unidadesBotones = Array.from(
    { length: totalUnidades },
    (_, i) => i + 1
  );

  // Manejador para el cambio en el input de búsqueda.
  const handleSearchChange = (e) => {
    setTerminoBusqueda(e.target.value);
  };

  // Manejador para el botón de agregar pregunta (abre el modal de advertencia).
  const handleAddQuestion = () => {
    if (auth.currentUser) {
      // Si ya está logueado, mostrar directamente la advertencia
      setShowWarningModal(true);
    } else {
      // Si no está logueado, mostrar modal de autenticación
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

  // Manejador para confirmar la navegación a crear pregunta.
  const handleConfirmAddQuestion = () => {
    setShowWarningModal(false);
    navigate(`/crear-pregunta/${numero}`, { state: { totalUnidades, materia, unidadSeleccionada: unidadActiva } });
  };

  // Manejador para cerrar el modal de advertencia.
  const handleCloseWarningModal = () => {
    setShowWarningModal(false);
  };

  // Manejadores para reporte
  const handleReport = (pregunta) => {
    setItemToReport(pregunta);
    setShowReportModal(true);
  };

  // Manejadores para votación
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
    // Aquí iría la lógica real de reporte (ej. llamada a Firebase)
    console.log(`Reportando item ${itemToReport}`);
    setShowReportModal(false);
    setItemToReport(null);
    // Opcional: Mostrar un toast de éxito
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setItemToReport(null);
  };

  // Handlers para administración y borrado
  const handleToggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedToDelete([]);
  };

  const handleToggleDeleteSelection = (pregunta) => {
    setSelectedToDelete(prev => {
      if (prev.includes(pregunta.id)) {
        return prev.filter(id => id !== pregunta.id);
      } else {
        return [...prev, pregunta.id];
      }
    });
  };

  const handleSelectAll = () => {
    // Filtrar las preguntas visibles actualmente (misma lógica que PreguntasCard)
    const preguntasVisibles = preguntas.filter(p => {
      const textoPregunta = p.pregunta || p.texto || "";
      const creadorId = p.creador || "";
      const cumpleUnidad = p.unidad === unidadActiva;
      const cumpleBusqueda = textoPregunta.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                             (creadorId && creadorId.toLowerCase().includes(terminoBusqueda.toLowerCase()));
      
      let cumpleFiltro = true;
      if (filtroActivo === "noVotadas") {
        cumpleFiltro = !votedHistory.includes(p.id);
      } else if (filtroActivo === "votadas") {
        cumpleFiltro = votedHistory.includes(p.id);
      }
      
      return cumpleUnidad && cumpleBusqueda && cumpleFiltro;
    });

    const allVisibleIds = preguntasVisibles.map(p => p.id);
    const allSelected = allVisibleIds.every(id => selectedToDelete.includes(id));

    if (allSelected) {
      // Deseleccionar las visibles
      setSelectedToDelete(prev => prev.filter(id => !allVisibleIds.includes(id)));
    } else {
      // Seleccionar las visibles que faltan
      const newSelection = [...selectedToDelete];
      allVisibleIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      setSelectedToDelete(newSelection);
    }
  };

  const confirmDelete = async () => {
    if (selectedToDelete.length === 0) return;
    setLoading(true);

    try {
      const carreraSeleccionada = JSON.parse(localStorage.getItem("carreraSeleccionada"));
      if (!carreraSeleccionada) return;

      const db = getFirestore(app1);
      const materiaDocRef = doc(db, "UNSa", carreraSeleccionada.Nombre, "materias", materia);
      const materiaDocSnap = await getDoc(materiaDocRef);

      if (materiaDocSnap.exists()) {
        const currentPreguntas = materiaDocSnap.data().Preguntas || [];
        
        // Filtrar preguntas
        const updatedPreguntas = currentPreguntas.filter(p => !selectedToDelete.includes(p.id));

        await setDoc(materiaDocRef, { Preguntas: updatedPreguntas }, { merge: true });

        // Actualizar estado local y cache
        setPreguntas(updatedPreguntas);
        const now = Date.now();
        const cacheKey = `preguntasCache_${carreraSeleccionada.Nombre}_${materia}`;
        const timeKey = `preguntasCacheTime_${carreraSeleccionada.Nombre}_${materia}`;
        localStorage.setItem(cacheKey, JSON.stringify(updatedPreguntas));
        localStorage.setItem(timeKey, now.toString());
        setLastUpdate(now);

        setShowDeleteModal(false);
        setIsDeleteMode(false);
        setSelectedToDelete([]);
        alert("Preguntas eliminadas correctamente.");
      }
    } catch (error) {
      console.error("Error al eliminar preguntas:", error);
      alert("Error al eliminar preguntas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 m-0 p-0">
      <Toolbar 
        texto={`Preguntas de ${materia}`} 
        numero={numero} 
        rightButtonIcon={Save}
        onRightButtonClick={() => navigate("/preguntas-guardadas", { state: { materia } })}
        hideInfoButton={true}
      />
      
      <div className="p-4 mt-4 flex items-center gap-2">
        <div className="flex-1">
          <Buscador value={terminoBusqueda} onChange={handleSearchChange} />
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            {isDeleteMode && (
              <button
                onClick={handleSelectAll}
                className="p-3 rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                title="Seleccionar todo"
              >
                <ListChecks size={24} />
              </button>
            )}
            <button
              onClick={handleToggleDeleteMode}
              className={`p-3 rounded-lg shadow-md transition-all duration-200 ${
                isDeleteMode 
                  ? "bg-red-600 text-white ring-2 ring-red-300" 
                  : "bg-white text-red-600 hover:bg-red-50"
              }`}
              title={isDeleteMode ? "Cancelar eliminar" : "Eliminar preguntas"}
            >
              {isDeleteMode ? <X size={24} /> : <Trash2 size={24} />}
            </button>
          </div>
        )}
      </div>
      
      {/* Botones de actualización y filtro */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {/* Botón de actualización */}
        <button
          onClick={loadPreguntasFromFirebase}
          disabled={loading}
          className="bg-white shadow-md rounded-lg p-3 flex flex-col items-center justify-center hover:shadow-lg transition disabled:opacity-50 min-h-[80px]"
        >
          <div className="flex items-center gap-2">
            <RefreshCw size={20} className={`text-blue-600 ${loading ? "animate-spin" : ""}`} />
            <span className="font-semibold text-gray-700">
              {loading ? "Actualizando..." : "Actualizar"}
            </span>
          </div>
          {lastUpdate && !loading && (
            <span className="text-xs text-gray-500 mt-1">
              Hace {formatTimeElapsed(timeElapsed)}
            </span>
          )}
        </button>

        {/* Botón de filtro */}
        <button
          onClick={() => setShowFilterModal(true)}
          className="bg-white shadow-md rounded-lg p-3 flex flex-col items-center justify-center hover:shadow-lg transition min-h-[80px]"
        >
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-purple-600" />
            <span className="font-semibold text-gray-700">
              Filtrar
            </span>
          </div>
          {filtroActivo !== "todas" && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold mt-1">
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
            isAdmin={isAdmin}
            isDeleteMode={isDeleteMode}
            selectedToDelete={selectedToDelete}
            onToggleDelete={handleToggleDeleteSelection}
          />
        </>
      )}

      {/* Modal de Autenticación */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">Autenticación Requerida</h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4 font-medium">
                Para agregar una nueva pregunta, necesitamos que inicies sesión con Google.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-gray-700 text-sm mb-2">
                  <strong>¿Por qué necesitamos esto?</strong>
                </p>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                  <li>Identificar a usuarios que no aportan contenido de calidad</li>
                  <li>Evitar spam y contenido malicioso</li>
                  <li>Saber qué usuario sube cada pregunta</li>
                  <li>Poder bloquear usuarios en caso de ser necesario</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAuthContinue}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Advertencia */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Cabecera del Modal */}
            <div className="bg-red-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">¡Advertencia!</h3>
              <button
                onClick={handleCloseWarningModal}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 flex flex-col gap-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-800 font-bold text-lg mb-2">
                  Política de uso estricta
                </p>
                <p className="text-gray-700 mb-2">
                  Cualquier pregunta que sea:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-2 pl-2">
                  <li>Fuera de contexto</li>
                  <li>Indebida u ofensiva</li>
                  <li>Creada para molestar (spam)</li>
                </ul>
                <p className="text-red-700 font-bold mt-2">
                  Resultará en el bloqueo permanente de tu usuario para subir más contenido.
                </p>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleCloseWarningModal}
                  className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmAddQuestion}
                  className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition shadow-md"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reporte */}
      {showReportModal && (
        <ReportModal
          onClose={handleCloseReportModal}
          onConfirm={handleConfirmReport}
        />
      )}

      {/* Modal de Confirmación de Votos */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">
                {loading ? "Procesando Votos..." : "Confirmar Votos"}
              </h3>
              {!loading && (
                <button onClick={() => setShowVoteModal(false)} className="text-white hover:bg-white/20 rounded-full p-1">
                  <X size={24} />
                </button>
              )}
            </div>
            <div className="p-6">
              {loading ? (
                // Estado de carga
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-semibold mb-2">Registrando votos...</p>
                  <p className="text-sm text-gray-500">Por favor espera un momento</p>
                </div>
              ) : (
                // Estado normal
                <>
                  <p className="text-gray-600 mb-4">Vas a votar por las siguientes preguntas:</p>
                  <ul className="bg-gray-50 rounded-lg p-4 mb-4 max-h-60 overflow-y-auto space-y-2">
                    {pendingVotes.map((vote, index) => {
                      const textoPregunta = vote.pregunta || vote.texto || "";
                      const textoCorto = textoPregunta.length > 6 
                        ? textoPregunta.substring(0, 6) + "..." 
                        : textoPregunta;
                      return (
                        <li key={index} className="flex items-center gap-2 text-gray-800 font-medium">
                          <ThumbsUp size={16} className="text-blue-500" />
                          {textoCorto}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="flex gap-3">
                    <button onClick={() => setShowVoteModal(false)} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                      Cancelar
                    </button>
                    <button onClick={confirmVotes} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2">
                      <Check size={20} /> Confirmar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-red-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <AlertTriangle size={24} />
                Confirmar Eliminación
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-white hover:bg-white/20 rounded-full p-1">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-800 font-medium mb-2">
                ¿Estás seguro de que deseas eliminar las siguientes preguntas?
              </p>
              <p className="text-red-600 text-sm mb-4 font-bold">
                Esta acción NO se puede deshacer.
              </p>
              <ul className="bg-red-50 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto space-y-2 border border-red-100">
                {selectedToDelete.map((id, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-800 font-medium">
                    <Trash2 size={16} className="text-red-500" />
                    <span className="truncate">
                      {preguntas.find(p => p.id === id)?.pregunta || preguntas.find(p => p.id === id)?.texto || "Pregunta sin texto"}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                  Cancelar
                </button>
                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition shadow-md flex items-center justify-center gap-2">
                  <Trash2 size={20} /> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito Votación */}
      {showSuccessVoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¡Votos Registrados!</h3>
              <p className="text-gray-500 mb-6">
                Gracias por contribuir. Tus votos ayudan a la comunidad a identificar las mejores preguntas.
              </p>
              <button
                onClick={() => setShowSuccessVoteModal(false)}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg"
              >
                Genial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Filtros */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-purple-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">Filtrar Preguntas</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">Selecciona cómo quieres ver las preguntas:</p>
              
              {/* Botones verticales */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setFiltroActivo("todas");
                    setShowFilterModal(false);
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition text-left flex items-center gap-4 ${
                    filtroActivo === "todas"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <List size={24} className="text-purple-600" />
                  <div className="flex-1">
                    <div className="font-bold text-lg">Todas las preguntas</div>
                    <div className="text-sm text-gray-600">Mostrar todas sin filtro</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setFiltroActivo("noVotadas");
                    setShowFilterModal(false);
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition text-left flex items-center gap-4 ${
                    filtroActivo === "noVotadas"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <Star size={24} className="text-purple-600" />
                  <div className="flex-1">
                    <div className="font-bold text-lg">No votadas</div>
                    <div className="text-sm text-gray-600">Solo preguntas que aún no has votado</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setFiltroActivo("votadas");
                    setShowFilterModal(false);
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition text-left flex items-center gap-4 ${
                    filtroActivo === "votadas"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <CheckCheck size={24} className="text-purple-600" />
                  <div className="flex-1">
                    <div className="font-bold text-lg">Votadas</div>
                    <div className="text-sm text-gray-600">Solo preguntas que ya votaste</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante para Votos Pendientes */}
      {pendingVotes.length > 0 && !isDeleteMode && (
        <button
          onClick={() => setShowVoteModal(true)}
          className="fixed bottom-24 right-6 bg-orange-500 text-white p-4 rounded-full shadow-2xl hover:bg-orange-600 hover:scale-110 active:scale-95 transition-all duration-200 z-50 flex items-center justify-center"
          title="Confirmar votos"
        >
          <ThumbsUp size={32} />
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {pendingVotes.length}
          </span>
        </button>
      )}

      {/* Botón flotante para Eliminar Seleccionados */}
      {isDeleteMode && selectedToDelete.length > 0 && (
        <button
          onClick={() => setShowDeleteModal(true)}
          className="fixed bottom-24 right-6 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 hover:scale-110 active:scale-95 transition-all duration-200 z-50 flex items-center justify-center animate-bounce"
          title="Eliminar seleccionados"
        >
          <Trash2 size={32} />
          <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-red-600">
            {selectedToDelete.length}
          </span>
        </button>
      )}

      {/* Botón flotante para agregar */}
      {!isDeleteMode && (
        <button
          onClick={handleAddQuestion}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-200 z-50"
          title="Agregar pregunta"
        >
          <Plus size={32} />
        </button>
      )}
    </div>
  );
}
