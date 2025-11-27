import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Save, ThumbsUp, Check, RefreshCw, CheckCircle, Info, Trash2, AlertTriangle, ListChecks } from "lucide-react";
import Toolbar from "../componentes/tolbar/Toolbard";
import MateriaCandidataItem from "../componentes/card/MateriaCandidataItem";
import Buscador from "../componentes/elementos/Buscador";
import { auth, app1 } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import ReportModal from "../componentes/modals/ReportModal";

export default function VistaMateriasCandidatas() {
  const navigate = useNavigate();
  const [anioActivo, setAnioActivo] = useState(1);
  const [search, setSearch] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Estados para datos dinámicos
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);
  const [materiasCandidatas, setMateriasCandidatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Estados para admin y borrado
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estados para votación y reporte
  const [pendingVotes, setPendingVotes] = useState([]);
  const [votedHistory, setVotedHistory] = useState([]);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showSuccessVoteModal, setShowSuccessVoteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [itemToReport, setItemToReport] = useState(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("votedHistoryMaterias") || "[]");
    setVotedHistory(history);
    
    const carrera = JSON.parse(localStorage.getItem("carreraSeleccionada"));
    if (carrera) {
      setCarreraSeleccionada(carrera);
    } else {
      // Si no hay carrera seleccionada, redirigir o mostrar alerta
      alert("No hay carrera seleccionada");
      navigate("/");
    }

    // Verificar si es admin
    const adminStatus = localStorage.getItem("administrador") === "true";
    setIsAdmin(adminStatus);
  }, []);

  // Cargar materias desde cache o Firebase cuando tenemos la carrera
  useEffect(() => {
    if (!carreraSeleccionada) return;

    const cacheKey = `materiasCandidatasCache_${carreraSeleccionada.Nombre}`;
    const timeKey = `materiasCandidatasCacheTime_${carreraSeleccionada.Nombre}`;
    const sessionKey = `materiasLoaded_${carreraSeleccionada.Nombre}`;
    
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(timeKey);

    // Verificar si es una nueva sesión para esta carrera
    const isNewSession = !sessionStorage.getItem(sessionKey);

    if (isNewSession) {
      // Es una nueva sesión, actualizar desde Firebase
      sessionStorage.setItem(sessionKey, "true");
      loadMateriasFromFirebase();
    } else if (cachedData && cachedTime) {
      // Ya hay una sesión activa, usar cache
      setMateriasCandidatas(JSON.parse(cachedData));
      setLastUpdate(Number(cachedTime));
    } else {
      // No hay cache, cargar desde Firebase
      loadMateriasFromFirebase();
    }
  }, [carreraSeleccionada]);

  // Actualizar contador de tiempo
  useEffect(() => {
    if (!lastUpdate) return;
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - lastUpdate) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const loadMateriasFromFirebase = async () => {
    if (!carreraSeleccionada) return;
    setLoading(true);
    try {
      const db = getFirestore(app1);
      const docRef = doc(db, "UNSa", carreraSeleccionada.Nombre);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data().materias || [];
        setMateriasCandidatas(data);
        
        // Guardar en cache
        const now = Date.now();
        localStorage.setItem(`materiasCandidatasCache_${carreraSeleccionada.Nombre}`, JSON.stringify(data));
        localStorage.setItem(`materiasCandidatasCacheTime_${carreraSeleccionada.Nombre}`, now.toString());
        setLastUpdate(now);
        setTimeElapsed(0);
      } else {
        setMateriasCandidatas([]);
      }
    } catch (error) {
      console.error("Error cargando materias:", error);
      setMateriasCandidatas([]);
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

  // Generar botones de años dinámicamente
  const aniosBotones = carreraSeleccionada 
    ? Array.from({ length: parseInt(carreraSeleccionada.Año) || 5 }, (_, i) => i + 1)
    : [];

  const handleAddMateria = () => {
    if (auth.currentUser) {
      setShowWarningModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthContinue = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Detectar si la app está instalada como PWA
      const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                    window.navigator.standalone === true;
      
      // Solo en PWA instalada usar redirect
      if (isPWA) {
        await signInWithRedirect(auth, provider);
      } else {
        // En navegador (PC o Móvil), usar popup
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        localStorage.setItem("user_uid", user.uid);
        setShowAuthModal(false);
        alert(`¡Bienvenido ${user.displayName || "Usuario"}! Ahora puedes proponer materias.`);
        setShowWarningModal(true);
      }
    } catch (error) {
      console.error("Error login:", error);
      setShowAuthModal(false);
    }
  };

  const handleSavedMaterias = () => {
    navigate("/materias-guardadas");
  };

  const handleBack = () => {
    navigate("/materias/1");
  };

  const handleConfirmAddMateria = () => {
    setShowWarningModal(false);
    navigate("/crear-materia");
  };

  const handleCloseWarningModal = () => {
    setShowWarningModal(false);
  };

  // Handlers para votación
  const handleToggleVote = (materia) => {
    if (votedHistory.includes(materia.Nombre)) return; // Usar Nombre con mayúscula

    setPendingVotes(prev => {
      const exists = prev.some(p => p.Nombre === materia.Nombre);
      if (exists) {
        return prev.filter(p => p.Nombre !== materia.Nombre);
      } else {
        return [...prev, materia];
      }
    });
  };

  const confirmVotes = async () => {
    if (pendingVotes.length === 0 || !carreraSeleccionada) return;
    setLoading(true);
    
    try {
      const db = getFirestore(app1);
      const docRef = doc(db, "UNSa", carreraSeleccionada.Nombre);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentMaterias = docSnap.data().materias || [];
        
        // Actualizar votos en el array
        const updatedMaterias = currentMaterias.map(m => {
          const isPending = pendingVotes.some(p => p.Nombre === m.Nombre); // Usar Nombre con mayúscula
          if (isPending) {
            return { ...m, Votos: (m.Votos || 0) + 1 }; // Usar Votos con mayúscula
          }
          return m;
        });

        await updateDoc(docRef, { materias: updatedMaterias });

        // Actualizar historial local
        const newHistory = [...votedHistory, ...pendingVotes.map(p => p.Nombre)];
        setVotedHistory(newHistory);
        localStorage.setItem("votedHistoryMaterias", JSON.stringify(newHistory));
        
        setPendingVotes([]);
        setShowVoteModal(false);
        
        // Actualizar estado local y cache
        setMateriasCandidatas(updatedMaterias);
        const now = Date.now();
        localStorage.setItem(`materiasCandidatasCache_${carreraSeleccionada.Nombre}`, JSON.stringify(updatedMaterias));
        localStorage.setItem(`materiasCandidatasCacheTime_${carreraSeleccionada.Nombre}`, now.toString());
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

  // Handlers para reporte
  const handleReport = (materia) => {
    setItemToReport(materia);
    setShowReportModal(true);
  };

  const confirmReport = () => {
    console.log("Reportando:", itemToReport);
    setShowReportModal(false);
    setItemToReport(null);
    alert("Reporte enviado. Gracias por ayudarnos a mantener la comunidad segura.");
  };

  // Handlers para administración y borrado
  const handleToggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedToDelete([]);
  };

  const handleToggleDeleteSelection = (materia) => {
    setSelectedToDelete(prev => {
      if (prev.includes(materia.Nombre)) {
        return prev.filter(nombre => nombre !== materia.Nombre);
      } else {
        return [...prev, materia.Nombre];
      }
    });
  };

  const handleSelectAll = () => {
    const allFilteredNames = materiasFiltradas.map(m => m.Nombre);
    const allSelected = allFilteredNames.every(name => selectedToDelete.includes(name));

    if (allSelected) {
      setSelectedToDelete(prev => prev.filter(name => !allFilteredNames.includes(name)));
    } else {
      const newSelection = [...selectedToDelete];
      allFilteredNames.forEach(name => {
        if (!newSelection.includes(name)) {
          newSelection.push(name);
        }
      });
      setSelectedToDelete(newSelection);
    }
  };

  const confirmDelete = async () => {
    if (selectedToDelete.length === 0 || !carreraSeleccionada) return;
    setLoading(true);

    try {
      const db = getFirestore(app1);
      const docRef = doc(db, "UNSa", carreraSeleccionada.Nombre);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentMaterias = docSnap.data().materias || [];
        
        // Filtrar materias
        const updatedMaterias = currentMaterias.filter(m => !selectedToDelete.includes(m.Nombre));

        await updateDoc(docRef, { materias: updatedMaterias });

        // Actualizar estado local y cache
        setMateriasCandidatas(updatedMaterias);
        const now = Date.now();
        localStorage.setItem(`materiasCandidatasCache_${carreraSeleccionada.Nombre}`, JSON.stringify(updatedMaterias));
        localStorage.setItem(`materiasCandidatasCacheTime_${carreraSeleccionada.Nombre}`, now.toString());
        setLastUpdate(now);

        setShowDeleteModal(false);
        setIsDeleteMode(false);
        setSelectedToDelete([]);
        alert("Materias eliminadas correctamente.");
      }
    } catch (error) {
      console.error("Error al eliminar materias:", error);
      alert("Error al eliminar materias");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar materias por año activo y búsqueda
  const materiasFiltradas = materiasCandidatas.filter(m => {
    const porAnio = parseInt(m.Año) === anioActivo;
    const searchTerm = search.toLowerCase();
    const porNombre = m.Nombre.toLowerCase().includes(searchTerm);
    const porId = m.idCreador && m.idCreador.toLowerCase().includes(searchTerm);
    const porAutor = m.autor && m.autor.toLowerCase().includes(searchTerm);
    
    return porAnio && (porNombre || porId || porAutor);
  });

  return (
    <div className="w-full min-h-screen bg-gray-100 m-0 p-0">
      <Toolbar
        texto="Propuestas de Materias"
        numero={anioActivo}
        rightButtonIcon={Save}
        onRightButtonClick={handleSavedMaterias}
        onBackClick={handleBack}
        hideInfoButton={false}
        onInfoClick={() => setShowInfoModal(true)}
      />

      <div className="p-4 mt-4 flex items-center gap-2">
        <div className="flex-1">
          <Buscador value={search} onChange={(e) => setSearch(e.target.value)} />
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
              title={isDeleteMode ? "Cancelar eliminar" : "Eliminar materias"}
            >
              {isDeleteMode ? <X size={24} /> : <Trash2 size={24} />}
            </button>
          </div>
        )}
      </div>
      
      {/* Selector de Años Horizontal */}
      <div className="flex gap-2 mt-2 overflow-x-auto px-4 pb-2">
        {aniosBotones.map((anio) => (
          <button
            key={anio}
            onClick={() => setAnioActivo(anio)}
            className={`flex-shrink-0 px-6 py-3 rounded-lg font-bold text-lg transition ${
              anioActivo === anio
                ? "bg-blue-600 text-white"
                : "bg-white shadow"
            }`}
          >
            Año {anio}
          </button>
        ))}
      </div>

      {/* Botón de actualización */}
      <div className="px-4 mt-4">
        <button
          onClick={loadMateriasFromFirebase}
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

      {/* Lista de Materias Candidatas */}
      <div className="w-full px-4 pb-8 mt-4">
        {loading && !materiasCandidatas.length ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-lg font-semibold animate-pulse text-gray-500">Cargando propuestas...</p>
          </div>
        ) : materiasFiltradas.length > 0 ? (
          materiasFiltradas.map((materia, index) => (
            <MateriaCandidataItem 
              key={index} 
              materia={materia}
              onToggleVote={handleToggleVote}
              onReport={handleReport}
              votedHistory={votedHistory}
              pendingVotes={pendingVotes}
              isAdmin={isAdmin}
              isDeleteMode={isDeleteMode}
              isSelected={selectedToDelete.includes(materia.Nombre)}
              onToggleDelete={handleToggleDeleteSelection}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-8 opacity-70">
            <div className="bg-gray-200 p-4 rounded-full mb-3">
              <Plus size={32} className="text-gray-400" />
            </div>
            <p className="text-center text-gray-500 text-lg font-medium">
              No hay propuestas para el Año {anioActivo}
            </p>
            <p className="text-center text-gray-400 text-sm mt-1">
              ¡Sé el primero en proponer una materia!
            </p>
          </div>
        )}
      </div>

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
                Para proponer una nueva materia, necesitamos que inicies sesión con Google.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-gray-700 text-sm mb-2">
                  <strong>¿Por qué necesitamos esto?</strong>
                </p>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                  <li>Identificar a usuarios que no aportan contenido de calidad</li>
                  <li>Evitar spam y contenido malicioso</li>
                  <li>Saber qué usuario sube cada materia</li>
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
                  Cualquier materia que sea:
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
                  onClick={handleConfirmAddMateria}
                  className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition shadow-md"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Información (Validación) */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Info size={24} /> Información
              </h3>
              <button onClick={() => setShowInfoModal(false)} className="text-white hover:bg-white/20 rounded-full p-1">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-3">¿Cómo se validan las materias?</h4>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Para asegurar la calidad del contenido, todas las materias propuestas por la comunidad deben pasar por un proceso de validación.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                <div className="flex items-start gap-3 mb-2">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <p className="text-gray-800 font-medium">Objetivo: 20 Votos</p>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  Una materia necesita alcanzar un mínimo de <strong>20 votos positivos</strong> de la comunidad para ser considerada "Validada".
                </p>
              </div>
              <p className="text-gray-600 text-sm">
                Una vez validada, la materia podrá ser oficializada por los administradores y estará disponible para todos de forma permanente.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Votos */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">Confirmar Votos</h3>
              <button onClick={() => setShowVoteModal(false)} className="text-white hover:bg-white/20 rounded-full p-1">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Vas a votar por las siguientes materias:</p>
              <ul className="bg-gray-50 rounded-lg p-4 mb-4 max-h-60 overflow-y-auto space-y-2">
                {pendingVotes.map((vote, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-800 font-medium">
                    <ThumbsUp size={16} className="text-blue-500" />
                    {vote.Nombre}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <button onClick={() => setShowVoteModal(false)} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                  Cancelar
                </button>
                <button onClick={confirmVotes} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2">
                  <Check size={20} /> Confirmar
                </button>
              </div>
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
                ¿Estás seguro de que deseas eliminar las siguientes materias?
              </p>
              <p className="text-red-600 text-sm mb-4 font-bold">
                Esta acción NO se puede deshacer.
              </p>
              <ul className="bg-red-50 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto space-y-2 border border-red-100">
                {selectedToDelete.map((nombre, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-800 font-medium">
                    <Trash2 size={16} className="text-red-500" />
                    {nombre}
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
                Gracias por contribuir. Tus votos ayudan a la comunidad a elegir las mejores materias.
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

      {/* Modal de Reporte */}
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          onConfirm={confirmReport}
        />
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
          onClick={handleAddMateria}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-200 z-50"
          title="Proponer materia"
        >
          <Plus size={32} />
        </button>
      )}
    </div>
  );
}
