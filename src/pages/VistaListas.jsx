import React, { useState, useEffect } from "react";
import Toolbar from "../componentes/tolbar/Toolbard";
import Buscador from "../componentes/elementos/Buscador";
import CardListas from "../componentes/card/CardListas";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app1 } from "../firebaseConfig";

export default function VistaItems() {
  const [numero, setNumero] = useState(null);
  const [search, setSearch] = useState("");
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(false); // loader solo para cards

  // Leer número seleccionado y cargar carreras si corresponde
  useEffect(() => {
    const init = async () => {
      const num = parseInt(localStorage.getItem("numeroSeleccionado"), 10);
      setNumero(num);

      if (num === 1) {
        setLoading(true);
        try {
          const db = getFirestore(app1);
          const docRef = doc(db, "UNSa", "carreras");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data().carreras || [];
            setCarreras(data);
          } else {
            setCarreras([]);
          }
        } catch (error) {
          console.error("Error cargando carreras:", error);
          setCarreras([]);
        } finally {
          setLoading(false);
        }
      }
    };

    init();
  }, []);

  // Datos fijos para materias
  const materias = [
    {
      Nombre: "Matemáticas",
      Año: 1,
      Votos: 10,
      Unidades: ["Álgebra", "Geometría"],
    },
    {
      Nombre: "Historia",
      Año: 1,
      Votos: 5,
      Unidades: ["Edad Media", "Edad Moderna"],
    },
  ];

  // Elegir items según número
  const items = numero === 1 ? carreras : materias;

  // Filtrado por buscador
  const itemsFiltrados = items.filter((item) =>
    item.Nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Toolbar texto={numero === 1 ? "Carreras" : "Materias"} numero={numero} />

      <div className="p-4 mt-4">
        <Buscador value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="p-4 mt-4">
        {numero === 1 && loading ? (
          <div className="flex justify-center items-center h-40 bg-white rounded-lg shadow-md">
            <p className="text-lg font-semibold animate-pulse">Cargando carreras...</p>
          </div>
        ) : (
          <CardListas numero={numero} items={itemsFiltrados} />
        )}
      </div>
    </div>
  );
}
