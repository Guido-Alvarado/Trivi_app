import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../componentes/tolbar/Toolbard";
import { Edit, Trash2, ChevronDown, ChevronUp, AlertTriangle, X, CloudUpload, CheckCircle, AlertCircle } from "lucide-react";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { app1, auth } from "../firebaseConfig";

export default function MateriasGuardadas() {
  const navigate = useNavigate();
  
  const [materias, setMaterias] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmptyModal, setShowEmptyModal] = useState(false);
  const [materiaToDelete, setMateriaToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  useEffect(() => {
    const materiasGuardadas = JSON.parse(localStorage.getItem("materiasGuardadas")) || [];
    setMaterias(materiasGuardadas);
  }, []);

  const handleDeleteClick = (id) => {
    setMateriaToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (materiaToDelete) {
      const nuevasMaterias = materias.filter((m) => m.id !== materiaToDelete);
      setMaterias(nuevasMaterias);
      localStorage.setItem("materiasGuardadas", JSON.stringify(nuevasMaterias));
      setShowDeleteModal(false);
      setMateriaToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMateriaToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/editar-materia/${id}`);
  };

  const handleBack = () => {
    navigate("/materias-propuestas");
  };

  const handleUploadClick = () => {
    if (materias.length === 0) {
      setShowEmptyModal(true);
      return;
    }
    setShowUploadModal(true);
  };

  const confirmUpload = async () => {
    const carreraSeleccionada = JSON.parse(localStorage.getItem("carreraSeleccionada"));
    const userUid = localStorage.getItem("user_uid");

    if (!carreraSeleccionada) {
      alert("Error: No hay carrera seleccionada.");
      setShowUploadModal(false);
      return;
    }

    if (!userUid) {
      alert("Error: Debes estar logueado para subir materias.");
      setShowUploadModal(false);
      return;
    }

    setUploading(true);

    try {
      const db = getFirestore(app1);
      const docRef = doc(db, "UNSa", carreraSeleccionada.Nombre);
      const docSnap = await getDoc(docRef);

      // Preparar las materias para subir con la estructura correcta
      const materiasParaSubir = materias.map(m => ({
        Nombre: m.nombre, // Mapear nombre -> Nombre
        Año: m.anio,      // Mapear anio -> Año
        Unidades: m.unidades, // Array de unidades
        Creador: userUid,
        Votos: 0
      }));

      let count = 0;

      if (docSnap.exists()) {
        const currentMaterias = docSnap.data().materias || [];
        
        // Filtrar las que ya existen por nombre para no duplicar
        const nuevasMaterias = materiasParaSubir.filter(nueva => 
          !currentMaterias.some(existente => existente.Nombre === nueva.Nombre)
        );

        if (nuevasMaterias.length === 0) {
          alert("Todas las materias ya existen en la nube.");
          setUploading(false);
          setShowUploadModal(false);
          return;
        } else {
          await updateDoc(docRef, {
            materias: [...currentMaterias, ...nuevasMaterias]
          });
          count = nuevasMaterias.length;
        }
      } else {
        // Si el documento no existe, crearlo con las materias iniciales
        await setDoc(docRef, {
          materias: materiasParaSubir
        });
        count = materiasParaSubir.length;
      }

      // Éxito: Limpiar datos locales y mostrar modal
      setUploadedCount(count);
      setMaterias([]);
      localStorage.setItem("materiasGuardadas", "[]");
      setShowUploadModal(false);
      setShowSuccessModal(true);

    } catch (error) {
      console.error("Error subiendo materias:", error);
      alert("Error al subir las materias. Intenta nuevamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 m-0 p-0">
      <Toolbar
        texto="Mis Materias Guardadas"
        rightButtonIcon={CloudUpload}
        onRightButtonClick={handleUploadClick}
        onBackClick={handleBack}
        hideInfoButton={true}
      />

      <div className="p-4 max-w-3xl mx-auto">
        {materias.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow">
            <p className="text-xl text-gray-500">
              No has guardado ninguna materia todavía.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {materias.map((materia) => (
              <MateriaGuardadaItem
                key={materia.id}
                materia={materia}
                onDelete={handleDeleteClick}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar materia?</h3>
              <p className="text-gray-500 mb-6">
                Esta acción no se puede deshacer. Se eliminarán todas las unidades asociadas.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition shadow-lg"
                >
                  Eliminar
                </button>
              </div>
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
                {uploading ? "Subiendo..." : "¿Subir materias?"}
              </h3>
              <p className="text-gray-500 mb-6">
                {uploading 
                  ? "Por favor espera mientras subimos tus materias a la nube..." 
                  : "Se subirán tus materias guardadas a la nube. Por favor, revisa que todo esté correcto antes de continuar."}
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
                Se han subido correctamente {uploadedCount} materias a la nube.
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

      {/* Modal de Lista Vacía */}
      {showEmptyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lista Vacía</h3>
              <p className="text-gray-500 mb-6">
                No tienes materias guardadas localmente para subir. Crea una nueva materia primero.
              </p>
              <button
                onClick={() => setShowEmptyModal(false)}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition shadow-lg"
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

function MateriaGuardadaItem({ materia, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg p-4 transition-all duration-300">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="font-bold text-lg">{materia.nombre}</h3>
          <p className="text-gray-600 text-sm">Año {materia.anio} • {materia.unidades.length} Unidades</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(materia.id);
            }}
            className="p-3 text-blue-600 hover:bg-blue-50 rounded-full transition active:scale-95"
            title="Editar"
          >
            <Edit size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(materia.id);
            }}
            className="p-3 text-red-600 hover:bg-red-50 rounded-full transition active:scale-95"
            title="Eliminar"
          >
            <Trash2 size={28} />
          </button>
          {expanded ? <ChevronUp size={32} className="text-gray-400" /> : <ChevronDown size={32} className="text-gray-400" />}
        </div>
      </div>

      <div className={`transition-all duration-500 overflow-hidden ${expanded ? "max-h-96 opacity-100 mt-4 pt-4 border-t border-gray-100" : "max-h-0 opacity-0"}`}>
        <h4 className="font-bold text-gray-700 mb-2 text-sm">Unidades:</h4>
        <ul className="space-y-2">
          {materia.unidades.map((unidad) => (
            <li key={unidad.numero} className="bg-gray-50 p-2 rounded border border-gray-100 text-sm flex gap-2">
              <span className="font-semibold text-gray-500">U{unidad.numero}:</span>
              <span className="text-gray-800">{unidad.titulo}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
