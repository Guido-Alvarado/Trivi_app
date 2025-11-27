import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toolbar from "../componentes/tolbar/Toolbard";
import { Plus, Save, Trash2, CheckCircle, X } from "lucide-react";
import { sanitizeText } from "../utils/validation";
import AlertModal from "../componentes/modals/AlertModal";

export default function CrearCarrera() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [nombreCarrera, setNombreCarrera] = useState("");
  const [cantidadAnios, setCantidadAnios] = useState(1);
  const [enlaceTelegram, setEnlaceTelegram] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: "error", title: "", message: "" });

  const isEditing = Boolean(id);

  // Cargar datos si estamos en modo edición
  React.useEffect(() => {
    if (isEditing) {
      const carrerasGuardadas = JSON.parse(localStorage.getItem("carrerasGuardadas")) || [];
      const carreraAEditar = carrerasGuardadas.find(c => c.id === Number(id));
      
      if (carreraAEditar) {
        setNombreCarrera(carreraAEditar.nombre);
        setCantidadAnios(carreraAEditar.anios);
        setEnlaceTelegram(carreraAEditar.telegram || "");
      } else {
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Carrera no encontrada"
        });
        setShowAlert(true);
        setTimeout(() => navigate("/carreras-guardadas"), 1500);
      }
    }
  }, [id, isEditing, navigate]);

  const handleGoToSaved = () => {
    navigate("/carreras-guardadas");
  };

  const handleSave = () => {
    if (!nombreCarrera.trim()) {
      setAlertConfig({
        type: "error",
        title: "Campo Requerido",
        message: "Por favor ingresa el nombre de la carrera."
      });
      setShowAlert(true);
      return;
    }
    if (cantidadAnios < 1 || cantidadAnios > 10) {
      setAlertConfig({
        type: "error",
        title: "Valor Inválido",
        message: "La cantidad de años debe estar entre 1 y 10."
      });
      setShowAlert(true);
      return;
    }
    if (!enlaceTelegram.trim()) {
      setAlertConfig({
        type: "error",
        title: "Campo Requerido",
        message: "Por favor ingresa el enlace del grupo de Telegram."
      });
      setShowAlert(true);
      return;
    }

    const nuevaCarrera = {
      id: isEditing ? Number(id) : Date.now(),
      nombre: nombreCarrera,
      anios: cantidadAnios,
      telegram: enlaceTelegram.trim(),
    };

    const carrerasGuardadas = JSON.parse(localStorage.getItem("carrerasGuardadas")) || [];
    
    if (isEditing) {
      const nuevasCarreras = carrerasGuardadas.map(c => c.id === Number(id) ? nuevaCarrera : c);
      localStorage.setItem("carrerasGuardadas", JSON.stringify(nuevasCarreras));
    } else {
      localStorage.setItem("carrerasGuardadas", JSON.stringify([...carrerasGuardadas, nuevaCarrera]));
    }

    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/carreras-guardadas");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 m-0 p-0">
      <Toolbar
        texto={isEditing ? "Editar Carrera" : "Crear Nueva Carrera"}
        numero={0}
        rightButtonIcon={Save}
        onRightButtonClick={handleGoToSaved}
        hideInfoButton={true}
      />

      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="nombreCarrera">
            Nombre de la Carrera <span className="text-red-500">*</span>
          </label>
          <input
            id="nombreCarrera"
            type="text"
            value={nombreCarrera}
            onChange={(e) => setNombreCarrera(sanitizeText(e.target.value))}
            placeholder="Ej. Ingeniería en Sistemas"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="cantidadAnios">
            Cantidad de Años
          </label>
          <input
            id="cantidadAnios"
            type="number"
            min="1"
            max="10"
            value={cantidadAnios}
            onChange={(e) => setCantidadAnios(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="enlaceTelegram">
            Enlace de Grupo de Telegram <span className="text-red-500">*</span>
          </label>
          <input
            id="enlaceTelegram"
            type="url"
            value={enlaceTelegram}
            onChange={(e) => setEnlaceTelegram(e.target.value)}
            placeholder="https://t.me/..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {isEditing ? "Guardar Cambios" : "Guardar Carrera"}
          </button>
        </div>
      </div>

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300 transform scale-100">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Excelente!
              </h3>
              <p className="text-gray-600 mb-8">
                La carrera <span className="font-bold text-gray-800">"{nombreCarrera}"</span> ha sido {isEditing ? "actualizada" : "guardada"} correctamente.
              </p>
              <button
                onClick={handleCloseSuccessModal}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg active:scale-95"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alerta */}
      {showAlert && (
        <AlertModal
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
