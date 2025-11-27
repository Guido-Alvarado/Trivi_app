import React from "react";
import CardInicio from "../componentes/card/CardInicio";
import CardsContainer from "../componentes/card/CardConteiner";
import AniosCard from "../componentes/card/AniosCard";
import PublicidadCarousel from "../componentes/card/PublicidadCarousel";

export default function Inicio() {
  const [carrera, setCarrera] = React.useState(null);

  React.useEffect(() => {
    const saved = localStorage.getItem("carreraSeleccionada");
    if (saved) {
      setCarrera(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 m-0 p-0">
      <CardInicio carrera={carrera} />
      <CardsContainer carrera={carrera} />
      <PublicidadCarousel />
      {carrera && <AniosCard cantidad={carrera.Año} />}
    </div>
  );
}
