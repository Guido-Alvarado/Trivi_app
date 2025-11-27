import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trash2, Edit, CloudUpload, CheckSquare, Square, X, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import Toolbar from "../componentes/tolbar/Toolbard";
import PreguntasGuardadasItem from "../componentes/card/PreguntasGuardadasItem";
import { getFirestore, doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { app1 } from "../firebaseConfig";

/**
 * Componente `PreguntasGuardadas`
 *
 * Página para ver, editar, eliminar y gestionar las preguntas guardadas
 * en el Local Storage. Incluye una funcionalidad de selección múltiple.
 *
 * @returns {JSX.Element}
 */
export default function PreguntasGuardadas() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Prioridad: State > LocalStorage > null
  const materia = location.state?.materia || localStorage.getItem("materiaActiva");

  const [preguntas, setPreguntas] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMinQuestionsModal, setShowMinQuestionsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  // Carga las preguntas desde el Local Storage al iniciar.
  const loadPreguntas = () => {
    if (materia) {
      const storageKey = `preguntasGuardadas_${materia}`;
      const preguntasMateria = JSON.parse(localStorage.getItem(storageKey)) || [];
      setPreguntas(preguntasMateria);
    } else {
      // Fallback a global si no hay materia (legacy)
      const todasLasPreguntas = JSON.parse(localStorage.getItem("preguntasGuardadas")) || [];
      setPreguntas(todasLasPreguntas);
    }
  };

  useEffect(() => {
    loadPreguntas();
  }, [materia]);

  // Maneja la eliminación de una sola pregunta.
  const handleDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  // Navega a la página de edición.
  const handleEdit = (id) => {
    navigate(`/editar-pregunta/${id}`);
  };

  // Maneja la selección de un item.
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Activa o desactiva el modo de selección.
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedIds([]);
  };

  // Elimina todas las preguntas seleccionadas.
  const handleDeleteSelected = () => {
    if (selectedIds.length > 0) {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    let idsAEliminar = [];

    if (itemToDelete) {
      idsAEliminar = [itemToDelete];
    } else {
      idsAEliminar = selectedIds;
    }

    if (materia) {
      const storageKey = `preguntasGuardadas_${materia}`;
      const preguntasMateria = JSON.parse(localStorage.getItem(storageKey)) || [];
      const nuevasPreguntas = preguntasMateria.filter(p => !idsAEliminar.includes(p.id));
      
      localStorage.setItem(storageKey, JSON.stringify(nuevasPreguntas));
      setPreguntas(nuevasPreguntas);
    } else {
      // Fallback legacy
      const todasLasPreguntas = JSON.parse(localStorage.getItem("preguntasGuardadas")) || [];
      const nuevasPreguntas = todasLasPreguntas.filter(p => !idsAEliminar.includes(p.id));
      localStorage.setItem("preguntasGuardadas", JSON.stringify(nuevasPreguntas));
      setPreguntas(nuevasPreguntas);
    }

    setSelectionMode(false);
    setSelectedIds([]);
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Maneja el click en el botón de subir
  const handleUploadClick = () => {
    if (preguntas.length < 10) {
      setShowMinQuestionsModal(true);
      return;
    }
    setShowUploadModal(true);
  };

  // Confirma la subida a Firebase
  const confirmUpload = async () => {
    const carreraSeleccionada = JSON.parse(localStorage.getItem("carreraSeleccionada"));
    const userUid = localStorage.getItem("user_uid");

    if (!carreraSeleccionada) {
      alert("Error: No hay carrera seleccionada.");
      setShowUploadModal(false);
      return;
    }

    if (!userUid) {
      alert("Error: Debes estar logueado para subir preguntas.");
      setShowUploadModal(false);
      return;
    }

    setUploading(true);

    try {
      const db = getFirestore(app1);
      
      // Usamos las preguntas actuales (ya son de la materia específica)
      const preguntasParaSubir = preguntas;
      let totalSubidas = 0;

      // Subir preguntas a la materia actual
      if (materia) {
        const materiaDocRef = doc(db, "UNSa", carreraSeleccionada.Nombre, "materias", materia);
        const materiaDocSnap = await getDoc(materiaDocRef);

        // Preparar preguntas con estructura Firebase
        const preguntasFirebase = preguntasParaSubir.map((p, index) => ({
          id: materiaDocSnap.exists() ? (materiaDocSnap.data().Preguntas?.length || 0) + index : index,
          creador: userUid,
          unidad: p.unidad || 1,
          pregunta: p.texto || p.pregunta,
          resp1: p.resp1 || "",
          resp2: p.resp2 || "",
          resp3: p.resp3 || "",
          correcta: p.respC || "",
          justif: p.justificacion || "",
          votos: 0
        }));

        if (materiaDocSnap.exists()) {
          await setDoc(materiaDocRef, {
            Preguntas: arrayUnion(...preguntasFirebase)
          }, { merge: true });
        } else {
          await setDoc(materiaDocRef, {
            Preguntas: preguntasFirebase
          });
        }
        totalSubidas = preguntasFirebase.length;

        // Limpiar localStorage específico
        const storageKey = `preguntasGuardadas_${materia}`;
        localStorage.setItem(storageKey, "[]");
      }

      setUploadedCount(totalSubidas);
      setPreguntas([]); // Limpiar la vista actual
      setShowUploadModal(false);
      setShowSuccessModal(true);

    } catch (error) {
      console.error("Error subiendo preguntas:", error);
      alert("Error al subir las preguntas. Intenta nuevamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toolbar 
        texto={materia ? `Preguntas de ${materia}` : "Mis Preguntas Guardadas"} 
        rightButtonIcon={CloudUpload}
        onRightButtonClick={handleUploadClick}
        hideInfoButton={true}
      />

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Barra de herramientas de la página */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-800">
              {selectionMode
                ? `${selectedIds.length} seleccionada(s)`
                : (materia ? `Preguntas de ${materia}` : "Mis Preguntas")}
            </h1>
            <div className="flex gap-4">
              <button
                onClick={toggleSelectionMode}
                className="font-semibold text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
              >
                {selectionMode ? "Cancelar" : "Seleccionar"}
              </button>
              {selectionMode && (
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.length === 0}
                  className="font-semibold text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
                >
                  Eliminar Selección
                </button>
              )}
            </div>
          </div>

          {/* Lista de preguntas */}
          <div className="space-y-4">
            {preguntas.length > 0 ? (
              preguntas.map((pregunta) => (
                <PreguntasGuardadasItem
                  key={pregunta.id}
                  pregunta={pregunta}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onSelect={handleSelect}
                  isSelected={selectedIds.includes(pregunta.id)}
                  selectionMode={selectionMode}
                />
              ))
            ) : (
              <div className="text-center bg-white p-8 rounded-lg shadow">
                <p className="text-xl text-gray-500">
                  No has guardado ninguna pregunta todavía.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-red-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">¡Confirmar Eliminación!</h3>
              <button
                onClick={cancelDelete}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
                <AlertTriangle size={24} className="text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-red-800 font-bold text-lg mb-2">
                    ¿Estás seguro?
                  </p>
                  <p className="text-gray-700">
                    Vas a eliminar <strong>{itemToDelete ? 1 : selectedIds.length}</strong> {itemToDelete || selectedIds.length === 1 ? 'pregunta' : 'preguntas'}. 
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition shadow-md"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Mínimo de Preguntas */}
      {showMinQuestionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mínimo 10 Preguntas</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Necesitas al menos <strong>10 preguntas</strong> guardadas para poder subirlas a Firebase.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Actualmente tienes: <strong>{preguntas.length}</strong> {preguntas.length === 1 ? 'pregunta' : 'preguntas'}
              </p>
              <button
                onClick={() => setShowMinQuestionsModal(false)}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Subida */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloudUpload size={32} className={`text-blue-600 ${uploading ? "animate-bounce" : ""}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {uploading ? "Subiendo..." : "¿Subir preguntas?"}
              </h3>
              <p className="text-gray-500 mb-6">
                {uploading 
                  ? "Por favor espera mientras subimos tus preguntas a Firebase..." 
                  : `Se subirán ${preguntas.length} preguntas a Firebase. Revisa que todo esté correcto.`}
              </p>
              {!uploading && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmUpload}
                    className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg"
                  >
                    Subir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¡Subida Exitosa!</h3>
              <p className="text-gray-500 mb-6">
                Se han subido correctamente {uploadedCount} preguntas a Firebase.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
