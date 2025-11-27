import React, { useState, useEffect } from "react";

export default function PublicidadCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const anuncios = [
    {
      id: 1,
      title: "¡Nuevo Curso Disponible!",
      description: "Aprende programación desde cero",
      bgColor: "from-teal-500 to-cyan-600",
    },
    {
      id: 2,
      title: "Descuento Especial",
      description: "50% OFF en todos los cursos premium",
      bgColor: "from-blue-600 to-indigo-600",
    },
    {
      id: 3,
      title: "Únete a la Comunidad",
      description: "Miles de estudiantes ya están aprendiendo",
      bgColor: "from-cyan-600 to-blue-700",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % anuncios.length);
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, [anuncios.length]);

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Anuncios</h2>
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {anuncios.map((anuncio) => (
            <div
              key={anuncio.id}
              className={`min-w-full h-48 bg-gradient-to-r ${anuncio.bgColor} flex flex-col items-center justify-center text-white p-6`}
            >
              <h3 className="text-2xl font-bold mb-2">{anuncio.title}</h3>
              <p className="text-lg">{anuncio.description}</p>
            </div>
          ))}
        </div>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {anuncios.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
