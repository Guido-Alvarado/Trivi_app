import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../componentes/tolbar/Toolbard";
import { Edit, Trash2, ChevronDown, ChevronUp, AlertTriangle, X, CloudUpload, CheckCircle } from "lucide-react";
import { getFirestore, doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import { app1, auth } from "../firebaseConfig";

export default function CarrerasGuardadas() {
  const navigate = useNavigate();
  
  const [carreras, setCarreras] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmptyListModal, setShowEmptyListModal] = useState(false);
  const [showAuthErrorModal, setShowAuthErrorModal] = useState(false);
  const [showUploadErrorModal, setShowUploadErrorModal] = useState(false);
  const [carreraToDelete, setCarreraToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const carrerasGuardadas = JSON.parse(localStorage.getItem("carrerasGuardadas")) || [];
    setCarreras(carrerasGuardadas);
  }, []);

  const handleDeleteClick = (id) => {
    setCarreraToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (carreraToDelete) {
      const nuevasCarreras = carreras.filter((c) => c.id !== carreraToDelete);
      setCarreras(nuevasCarreras);
      localStorage.setItem("carrerasGuardadas", JSON.stringify(nuevasCarreras));
      setShowDeleteModal(false);
      setCarreraToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCarreraToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/editar-carrera/${id}`);
  };

  const handleBack = () => {
    navigate("/carreras");
  };

  const handleUploadClick = () => {
    if (carreras.length === 0) {
      setShowEmptyListModal(true);
      return;
    }
    setShowUploadModal(true);
  };

  const confirmUpload = async () => {
    // Validar usuario antes de iniciar
    const user = auth.currentUser;
    if (!user) {
      setShowUploadModal(false);
      setShowAuthErrorModal(true);
      return;
    }

    setUploading(true);

    try {
      const db = getFirestore(app1);
      const docRef = doc(db, "UNSa", "carreras");
      
      // Preparar las carreras para subir con el formato requerido
      const carrerasParaSubir = carreras.map(c => ({
        Nombre: c.nombre,
        Año: c.anios, 
        Link: c.telegram,
        Votos: 0,
        idCreador: user.uid // Agregar ID del creador
      }));

      // Verificar si el documento existe
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          carreras: arrayUnion(...carrerasParaSubir)
        });
      } else {
        // Si no existe, crearlo
        await setDoc(docRef, {
          carreras: carrerasParaSubir
        });
      }

      // Limpiar local storage y estado
      localStorage.removeItem("carrerasGuardadas");
      setCarreras([]);
      
      setUploading(false);
      setShowUploadModal(false);
      setShowSuccessModal(true);

    } catch (error) {
      console.error("Error al subir carreras:", error);
      setUploading(false);
      setShowUploadModal(false);
      setShowUploadErrorModal(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 m-0 p-0">
      <Toolbar
        texto="Mis Carreras Guardadas"
        rightButtonIcon={CloudUpload}
        onRightButtonClick={handleUploadClick}
        onBackClick={handleBack}
        hideInfoButton={true}
      />

      <div className="p-4 max-w-3xl mx-auto">
        {carreras.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow">
            <p className="text-xl text-gray-500">
              No has guardado ninguna carrera todavía.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {carreras.map((carrera) => (
              <CarreraGuardadaItem
                key={carrera.id}
                carrera={carrera}
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar carrera?</h3>
              <p className="text-gray-500 mb-6">
                Esta acción no se puede deshacer.
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
                {uploading ? "Subiendo..." : "¿Subir carreras?"}
              </h3>
              <p className="text-gray-500 mb-6">
                {uploading 
                  ? "Por favor espera mientras subimos tus carreras a la nube..." 
                  : "Se subirán tus carreras guardadas a la nube. Por favor, revisa que todo esté correcto antes de continuar."}
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
                Tus carreras se han subido correctamente a la nube.
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
      {showEmptyListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lista Vacía</h3>
              <p className="text-gray-500 mb-6">
                No hay carreras guardadas para subir. Primero crea algunas carreras.
              </p>
              <button
                onClick={() => setShowEmptyListModal(false)}
                className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Error de Autenticación */}
      {showAuthErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sesión Requerida</h3>
              <p className="text-gray-500 mb-6">
                Debes iniciar sesión con Google para subir carreras a la nube.
              </p>
              <button
                onClick={() => setShowAuthErrorModal(false)}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Error de Subida */}
      {showUploadErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error al Subir</h3>
              <p className="text-gray-500 mb-6">
                Hubo un error al subir las carreras. Por favor, verifica tu conexión e intenta nuevamente.
              </p>
              <button
                onClick={() => setShowUploadErrorModal(false)}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition shadow-lg"
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

function CarreraGuardadaItem({ carrera, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg p-4 transition-all duration-300">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="font-bold text-lg">{carrera.nombre}</h3>
          <p className="text-gray-600 text-sm">{carrera.anios} Años</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(carrera.id);
            }}
            className="p-3 text-blue-600 hover:bg-blue-50 rounded-full transition active:scale-95"
            title="Editar"
          >
            <Edit size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(carrera.id);
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
        <div className="space-y-2">
          <p className="text-gray-700"><span className="font-bold">Duración:</span> {carrera.anios} años</p>
          {carrera.telegram && (
            <p className="text-gray-700">
              <span className="font-bold">Telegram:</span>{" "}
              <a 
                href={carrera.telegram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Unirse al grupo
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
