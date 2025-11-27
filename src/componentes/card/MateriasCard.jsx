import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UnidadItem from "./UnidadesItem";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app1 } from "../../firebaseConfig";

export default function MateriasCard({ numero }) {
  const navigate = useNavigate();
  const [materiasValidadas, setMateriasValidadas] = useState([]);
  const [materiaActiva, setMateriaActiva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarMaterias = async () => {
      setLoading(true);
      try {
        const carreraSeleccionada = JSON.parse(localStorage.getItem("carreraSeleccionada"));
        
        if (!carreraSeleccionada) {
          setError("No hay carrera seleccionada.");
          setLoading(false);
          return;
        }

        // Intentar cargar desde cache primero para velocidad
        const cacheKey = `materiasCandidatasCache_${carreraSeleccionada.Nombre}`;
        const cachedData = localStorage.getItem(cacheKey);
        let materiasData = [];

        if (cachedData) {
          materiasData = JSON.parse(cachedData);
        } else {
          // Si no hay cache, ir a Firebase (aunque idealmente ya debería estar en cache desde la otra vista)
          const db = getFirestore(app1);
          const docRef = doc(db, "UNSa", carreraSeleccionada.Nombre);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            materiasData = docSnap.data().materias || [];
          }
        }

        // Filtrar materias: Votos >= 20 y Año coincidente
        const filtradas = materiasData.filter(m => {
          // Asegurar que comparamos números con números
          const anioMateria = parseInt(m.Año);
          const anioVista = parseInt(numero);
          const votos = parseInt(m.Votos || 0);
          
          return votos >= 20 && anioMateria === anioVista;
        });

        setMateriasValidadas(filtradas);
        
        if (filtradas.length > 0) {
          setMateriaActiva(filtradas[0]);
        }

      } catch (err) {
        console.error("Error cargando materias:", err);
        setError("Error al cargar las materias.");
      } finally {
        setLoading(false);
      }
    };

    cargarMaterias();
  }, [numero]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center text-red-500 font-bold">
        {error}
      </div>
    );
  }

  if (materiasValidadas.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500 text-lg">
          No hay materias validadas para el Año {numero} todavía.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Las materias deben tener al menos 20 votos para aparecer aquí.
        </p>
        <button 
          onClick={() => navigate("/materias-propuestas")}
          className="mt-4 text-blue-600 font-bold hover:underline"
        >
          Ir a votar materias
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-0 pb-8">
      {/* Selector de Materias Horizontal */}
      <div className="flex gap-2 mt-2 overflow-x-auto px-4 pb-2">
        {materiasValidadas.map((materia) => (
          <button
            key={materia.Nombre}
            onClick={() => setMateriaActiva(materia)}
            className={`flex-shrink-0 px-6 py-3 rounded-lg font-bold text-lg transition ${
              materiaActiva?.Nombre === materia.Nombre
                ? "bg-green-600 text-white"
                : "bg-white shadow"
            }`}
          >
            {materia.Nombre}
          </button>
        ))}
      </div>

      {/* Lista de Unidades de la Materia Activa */}
      <div className="mt-4 px-4">
        {materiaActiva && materiaActiva.Unidades && materiaActiva.Unidades.length > 0 ? (
          materiaActiva.Unidades.map((unidad, i) => {
            // Transformar datos para UnidadItem
            const unidadData = {
              Titulo: unidad.titulo, // Título grande: Nombre de la unidad
              name: `Unidad ${unidad.numero}`, // Texto pequeño: Unidad X
              puntos: 0, // Por ahora 0 como solicitado
              CantidadPreg: 0 // Por ahora 0 como solicitado
            };

            return (
              <UnidadItem
                key={`${materiaActiva.Nombre}-${unidad.numero}`}
                unidad={unidadData}
                numero={numero}
                materiaNombre={materiaActiva.Nombre}
                totalUnidades={materiaActiva.Unidades.length}
              />
            );
          })
        ) : (
          <div className="text-center p-8 text-gray-500">
            Esta materia no tiene unidades definidas.
          </div>
        )}
      </div>
    </div>
  );
}
