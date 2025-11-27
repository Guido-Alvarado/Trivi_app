import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../componentes/tolbar/Toolbard";
import Buscador from "../componentes/elementos/Buscador";
import CardListas from "../componentes/card/CardListas";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app1, auth } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Plus, RefreshCw, Save, X, ThumbsUp, Check, Trash2, AlertTriangle, ListChecks } from "lucide-react";
import ReportModal from "../componentes/modals/ReportModal";

export default function VistaCarreras() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Estados para admin y borrado
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estados para votación
  const [pendingVotes, setPendingVotes] = useState([]);
  const [votedHistory, setVotedHistory] = useState([]);
  const [showVoteModal, setShowVoteModal] = useState(false);
  
  // Estados para reporte
  const [showReportModal, setShowReportModal] = useState(false);
  const [itemToReport, setItemToReport] = useState(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("votedHistory") || "[]");
    setVotedHistory(history);
    
    // Verificar si es admin
    const adminStatus = localStorage.getItem("administrador") === "true";
    setIsAdmin(adminStatus);
  }, []);

  // Cargar carreras desde cache o Firebase
  useEffect(() => {
    const cachedData = localStorage.getItem("carrerasCache");
    const cachedTime = localStorage.getItem("carrerasCacheTime");

    // Verificar si es una nueva sesión (primera vez que abre la app)
    const isNewSession = !sessionStorage.getItem("carrerasLoaded");

    if (isNewSession) {
      // Es una nueva sesión, actualizar desde Firebase
      sessionStorage.setItem("carrerasLoaded", "true");
      loadCarrerasFromFirebase();
    } else if (cachedData && cachedTime) {
      // Ya hay una sesión activa, usar cache
      setCarreras(JSON.parse(cachedData));
      setLastUpdate(Number(cachedTime));
    } else {
      // No hay cache, cargar desde Firebase
      loadCarrerasFromFirebase();
    }
  }, []);

  // Actualizar contador de tiempo cada segundo
  useEffect(() => {
    if (!lastUpdate) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastUpdate) / 1000);
      setTimeElapsed(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  const loadCarrerasFromFirebase = async () => {
    setLoading(true);
    try {
      const db = getFirestore(app1);
      const docRef = doc(db, "UNSa", "carreras");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data().carreras || [];
        setCarreras(data);
        
        // Guardar en cache
        const now = Date.now();
        localStorage.setItem("carrerasCache", JSON.stringify(data));
        localStorage.setItem("carrerasCacheTime", now.toString());
        setLastUpdate(now);
        setTimeElapsed(0);
      } else {
        setCarreras([]);
      }
    } catch (error) {
      console.error("Error cargando carreras:", error);
      setCarreras([]);
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

  const handleToggleVote = (carrera) => {
    if (votedHistory.includes(carrera.Nombre)) return;

    setPendingVotes(prev => {
      const exists = prev.some(p => p.Nombre === carrera.Nombre);
      if (exists) {
        return prev.filter(p => p.Nombre !== carrera.Nombre);
      } else {
        return [...prev, carrera];
      }
    });
  };

  const confirmVotes = async () => {
    if (pendingVotes.length === 0) return;
    setLoading(true);
    
    try {
      const db = getFirestore(app1);
      const docRef = doc(db, "UNSa", "carreras");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data().carreras || [];
        
        // Actualizar votos en el array
        const updatedCarreras = currentData.map(c => {
          const isPending = pendingVotes.some(p => p.Nombre === c.Nombre);
          if (isPending) {
            return { ...c, Votos: (c.Votos || 0) + 1 };
          }
          return c;
        });

        await updateDoc(docRef, { carreras: updatedCarreras });

        // Actualizar historial local
        const newHistory = [...votedHistory, ...pendingVotes.map(p => p.Nombre)];
        setVotedHistory(newHistory);
        localStorage.setItem("votedHistory", JSON.stringify(newHistory));
        
        setPendingVotes([]);
        setShowVoteModal(false);
        
        // Actualizar estado local
        setCarreras(updatedCarreras);
        
        alert("¡Votos registrados correctamente!");
      }
    } catch (error) {
      console.error("Error al registrar votos:", error);
      alert("Error al registrar votos");
    } finally {
      setLoading(false);
    }
  };

  const handleReport = (carrera) => {
    setItemToReport(carrera);
    setShowReportModal(true);
  };

  const confirmReport = () => {
    // Aquí iría la lógica para enviar el reporte a Firebase
    console.log("Reportando:", itemToReport);
    setShowReportModal(false);
    setItemToReport(null);
    alert("Reporte enviado. Gracias por ayudarnos a mantener la comunidad segura.");
  };

  const handleToggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedToDelete([]); // Limpiar selección al cambiar modo
  };

  const handleToggleDeleteSelection = (carrera) => {
    setSelectedToDelete(prev => {
      if (prev.includes(carrera.Nombre)) {
        return prev.filter(nombre => nombre !== carrera.Nombre);
      } else {
        return [...prev, carrera.Nombre];
      }
    });
  };

  const handleSelectAll = () => {
    // Si ya están todos seleccionados (de los filtrados), deseleccionar todo
    // Si no, seleccionar todos los filtrados
    const allFilteredNames = carrerasFiltradas.map(c => c.Nombre);
    const allSelected = allFilteredNames.every(name => selectedToDelete.includes(name));

    if (allSelected) {
      // Deseleccionar los que están visibles actualmente
      setSelectedToDelete(prev => prev.filter(name => !allFilteredNames.includes(name)));
    } else {
      // Agregar los que faltan
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
    if (selectedToDelete.length === 0) return;
    setLoading(true);

    try {
      const db = getFirestore(app1);
      const docRef = doc(db, "UNSa", "carreras");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data().carreras || [];
        
        // Filtrar las carreras que NO están en la lista de eliminación
        const updatedCarreras = currentData.filter(c => !selectedToDelete.includes(c.Nombre));

        await updateDoc(docRef, { carreras: updatedCarreras });

        // Actualizar estado local
        setCarreras(updatedCarreras);
        
        // Actualizar caché
        const now = Date.now();
        localStorage.setItem("carrerasCache", JSON.stringify(updatedCarreras));
        localStorage.setItem("carrerasCacheTime", now.toString());
        setLastUpdate(now);

        setShowDeleteModal(false);
        setIsDeleteMode(false);
        setSelectedToDelete([]);
        alert("Carreras eliminadas correctamente.");
      }
    } catch (error) {
      console.error("Error al eliminar carreras:", error);
      alert("Error al eliminar carreras");
    } finally {
      setLoading(false);
    }
  };

  const carrerasFiltradas = carreras.filter((carrera) => {
    const searchTerm = search.toLowerCase();
    const nombreMatch = carrera.Nombre.toLowerCase().includes(searchTerm);
    const idMatch = carrera.idCreador && carrera.idCreador.toLowerCase().includes(searchTerm);
    return nombreMatch || idMatch;
  });

  const handleBack = () => {
    navigate("/");
  };

  const handleAddClick = () => {
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
      alert(`¡Bienvenido ${user.displayName || "Usuario"}! Ahora puedes agregar carreras.`);
      setShowWarningModal(true);
    } catch (error) {
      console.error("Error login:", error);
      setShowAuthModal(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Toolbar
        texto="Carreras"
        numero={1}
        rightButtonIcon={Save}
        onRightButtonClick={() => navigate("/carreras-guardadas")}
        onBackClick={handleBack}
        hideInfoButton={true}
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
              title={isDeleteMode ? "Cancelar eliminar" : "Eliminar carreras"}
            >
              {isDeleteMode ? <X size={24} /> : <Trash2 size={24} />}
            </button>
          </div>
        )}
      </div>

      {/* Botón de actualización */}
      <div className="px-4 mb-4">
        <button
          onClick={loadCarrerasFromFirebase}
          disabled={loading}
          className="w-full bg-white shadow-md rounded-lg p-3 flex items-center justify-between hover:shadow-lg transition disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            <RefreshCw size={20} className={`text-blue-600 ${loading ? "animate-spin" : ""}`} />
            <span className="font-semibold text-gray-700">
              {loading ? "Actualizando..." : "Actualizar carreras"}
            </span>
          </div>
          {lastUpdate && !loading && (
            <span className="text-sm text-gray-500">
              Hace {formatTimeElapsed(timeElapsed)}
            </span>
          )}
        </button>
      </div>

      <div className="p-4 mt-4">
        {loading && !carreras.length ? (
          <div className="flex justify-center items-center h-40 bg-white rounded-lg shadow-md">
            <p className="text-lg font-semibold animate-pulse">Cargando carreras...</p>
          </div>
        ) : (
          <CardListas 
            numero={1} 
            items={carrerasFiltradas} 
            onToggleVoto={handleToggleVote}
            onReport={handleReport}
            votedHistory={votedHistory}
            pendingVotes={pendingVotes}
            isDeleteMode={isDeleteMode}
            selectedToDelete={selectedToDelete}
            onToggleDelete={handleToggleDeleteSelection}
            isAdmin={isAdmin}
          />
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
                Para agregar una nueva carrera, necesitamos que inicies sesión con Google.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-gray-700 text-sm mb-2">
                  <strong>¿Por qué necesitamos esto?</strong>
                </p>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                  <li>Identificar a usuarios que no aportan contenido de calidad</li>
                  <li>Evitar spam y contenido malicioso</li>
                  <li>Saber qué usuario sube cada carrera</li>
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
                onClick={() => setShowWarningModal(false)}
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
                  Cualquier carrera que sea:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-2 pl-2">
                  <li>Falsa o inexistente</li>
                  <li>Con nombres ofensivos</li>
                  <li>Creada para molestar (spam)</li>
                </ul>
                <p className="text-red-700 font-bold mt-2">
                  Resultará en el bloqueo permanente de tu usuario para subir más contenido.
                </p>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => navigate("/crear-carrera")}
                  className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition shadow-md"
                >
                  Continuar
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
              <p className="text-gray-600 mb-4">Vas a votar por las siguientes carreras:</p>
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
                ¿Estás seguro de que deseas eliminar las siguientes carreras?
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
          onClick={handleAddClick}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-200 z-50"
          title="Agregar carrera"
        >
          <Plus size={32} />
        </button>
      )}
    </div>
  );
}
