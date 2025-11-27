import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toolbar from "../componentes/tolbar/Toolbard";
import FormVerdaderoFalso from "../componentes/forms/FormVerdaderoFalso";
import FormOpcionMultiple from "../componentes/forms/FormOpcionMultiple";

/**
 * Componente `EditarPregunta`
 *
 * Esta página permite a los usuarios editar una pregunta existente.
 * Carga los datos de la pregunta desde el Local Storage y muestra el
 * formulario correspondiente para su modificación.
 *
 * @returns {JSX.Element} La interfaz de usuario para la edición de preguntas.
 */
export default function EditarPregunta() {
  const { id } = useParams(); // ID de la pregunta a editar.
  const navigate = useNavigate();

  // Estado para la pregunta que se está editando.
  const [pregunta, setPregunta] = useState(null);

  // Carga la pregunta desde el Local Storage cuando el componente se monta.
  useEffect(() => {
    const preguntasGuardadas =
      JSON.parse(localStorage.getItem("preguntasGuardadas")) || [];
    // Busca la pregunta por su ID.
    const preguntaAEditar = preguntasGuardadas.find((p) => p.id === parseInt(id));

    if (preguntaAEditar) {
      setPregunta(preguntaAEditar);
    } else {
      alert("Pregunta no encontrada.");
      navigate("/preguntas-guardadas"); // Redirige si no se encuentra.
    }
  }, [id, navigate]);

  /**
   * Renderiza el formulario correcto (`Verdadero/Falso` u `Opción Múltiple`)
   * y le pasa los datos de la pregunta para que se pre-llene.
   *
   * @returns {JSX.Element|null}
   */
  const renderFormulario = () => {
    if (!pregunta) {
      return <p>Cargando pregunta...</p>;
    }

    // Pasa la pregunta y un total de unidades (ej. 10) a los formularios.
    // Los formularios necesitarán ser adaptados para manejar la edición.
    switch (pregunta.tipo) {
      case "Verdadero/Falso":
        return (
          <FormVerdaderoFalso
            totalUnidades={10} // Asumimos un máximo o lo pasamos de otra forma.
            preguntaParaEditar={pregunta}
          />
        );
      case "Opción múltiple":
        return (
          <FormOpcionMultiple
            totalUnidades={10}
            preguntaParaEditar={pregunta}
          />
        );
      default:
        return <p>Tipo de pregunta no reconocido.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toolbar texto="Editar Pregunta" />

      <main className="p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Modificando Pregunta
          </h2>
          {renderFormulario()}
        </div>
      </main>
    </div>
  );
}
