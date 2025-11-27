import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toolbar from "../componentes/tolbar/Toolbard";
import { Plus, Save, Trash2, CheckCircle, X } from "lucide-react";
import { sanitizeText } from "../utils/validation";
import AlertModal from "../componentes/modals/AlertModal";

export default function CrearMateria() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener ID si estamos editando
  const [nombreMateria, setNombreMateria] = useState("");
  const [anioSeleccionado, setAnioSeleccionado] = useState(1);
  const [unidades, setUnidades] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: "error", title: "", message: "" });

  const isEditing = Boolean(id);

  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);

  React.useEffect(() => {
    const carrera = JSON.parse(localStorage.getItem("carreraSeleccionada"));
    if (carrera) {
      setCarreraSeleccionada(carrera);
    }
  }, []);

  const aniosDisponibles = carreraSeleccionada 
    ? Array.from({ length: parseInt(carreraSeleccionada.Año) || 5 }, (_, i) => i + 1)
    : Array.from({ length: 5 }, (_, i) => i + 1);

  // Cargar datos si estamos en modo edición
  React.useEffect(() => {
    if (isEditing) {
      const materiasGuardadas = JSON.parse(localStorage.getItem("materiasGuardadas")) || [];
      const materiaAEditar = materiasGuardadas.find(m => m.id === Number(id));
      
      if (materiaAEditar) {
        setNombreMateria(materiaAEditar.nombre);
        setAnioSeleccionado(materiaAEditar.anio);
        setUnidades(materiaAEditar.unidades);
      } else {
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Materia no encontrada"
        });
        setShowAlert(true);
        setTimeout(() => navigate("/materias-guardadas"), 1500);
      }
    }
  }, [id, isEditing, navigate]);

  const handleAddUnidad = () => {
    setUnidades([...unidades, { numero: unidades.length + 1, titulo: "" }]);
  };

  const handleUnidadChange = (index, value) => {
    const nuevasUnidades = [...unidades];
    nuevasUnidades[index].titulo = sanitizeText(value);
    setUnidades(nuevasUnidades);
  };

  const handleRemoveUnidad = (index) => {
    const nuevasUnidades = unidades.filter((_, i) => i !== index).map((u, i) => ({ ...u, numero: i + 1 }));
    setUnidades(nuevasUnidades);
  };

  const handleGoToSaved = () => {
    navigate("/materias-guardadas");
  };

  const handleSave = () => {
    if (!nombreMateria.trim()) {
      setAlertConfig({
        type: "error",
        title: "Campo Requerido",
        message: "Por favor ingresa el nombre de la materia."
      });
      setShowAlert(true);
      return;
    }
    if (unidades.length === 0) {
      setAlertConfig({
        type: "error",
        title: "Unidades Requeridas",
        message: "Por favor agrega al menos una unidad."
      });
      setShowAlert(true);
      return;
    }
    if (unidades.some(u => !u.titulo.trim())) {
      setAlertConfig({
        type: "error",
        title: "Campos Incompletos",
        message: "Por favor completa el título de todas las unidades."
      });
      setShowAlert(true);
      return;
    }

    const nuevaMateria = {
      id: isEditing ? Number(id) : Date.now(),
      nombre: nombreMateria,
      anio: anioSeleccionado,
      unidades: unidades,
    };

    const materiasGuardadas = JSON.parse(localStorage.getItem("materiasGuardadas")) || [];
    
    if (isEditing) {
      const nuevasMaterias = materiasGuardadas.map(m => m.id === Number(id) ? nuevaMateria : m);
      localStorage.setItem("materiasGuardadas", JSON.stringify(nuevasMaterias));
    } else {
      localStorage.setItem("materiasGuardadas", JSON.stringify([...materiasGuardadas, nuevaMateria]));
    }

    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/materias-guardadas");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 m-0 p-0">
      <Toolbar
        texto={isEditing ? "Editar Materia" : "Crear Nueva Materia"}
        numero={0}
        rightButtonIcon={Save}
        onRightButtonClick={handleGoToSaved}
        hideInfoButton={true}
      />

      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="nombreMateria">
            Nombre de la Materia <span className="text-red-500">*</span>
          </label>
          <input
            id="nombreMateria"
            type="text"
            value={nombreMateria}
            onChange={(e) => setNombreMateria(sanitizeText(e.target.value))}
            placeholder="Ej. Historia del Arte"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="anioMateria">
            Año Correspondiente
          </label>
          <select
            id="anioMateria"
            value={anioSeleccionado}
            onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {aniosDisponibles.map((anio) => (
              <option key={anio} value={anio}>
                Año {anio}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Unidades</h3>
            <button
              onClick={handleAddUnidad}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 transition"
            >
              <Plus size={18} />
              Agregar Unidad
            </button>
          </div>

          {unidades.length === 0 ? (
            <p className="text-gray-500 text-center py-8 border-2 border-dashed rounded-lg">
              No hay unidades agregadas. Presiona "Agregar Unidad" para comenzar.
            </p>
          ) : (
            <div className="space-y-3">
              {unidades.map((unidad, index) => (
                <div key={index} className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <span className="font-bold text-gray-600 w-24 flex-shrink-0">
                    Unidad {unidad.numero}:
                  </span>
                  <input
                    type="text"
                    value={unidad.titulo}
                    onChange={(e) => handleUnidadChange(index, e.target.value)}
                    placeholder={`Título de la Unidad ${unidad.numero}`}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleRemoveUnidad(index)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                    title="Eliminar unidad"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {isEditing ? "Guardar Cambios" : "Guardar Materia"}
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
                La materia <span className="font-bold text-gray-800">"{nombreMateria}"</span> ha sido {isEditing ? "actualizada" : "guardada"} correctamente.
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
