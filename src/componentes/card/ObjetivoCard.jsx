import React from "react";
import { ChevronDown } from "lucide-react";

export default function ObjetivoCard() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full mt-8 mb-8 px-4">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div
          className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-5 cursor-pointer flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="font-bold text-2xl">Nuestro Objetivo</h2>
          <ChevronDown
            size={28}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className="p-6 text-gray-700 bg-gradient-to-br from-gray-50 to-white text-base leading-relaxed">
            La aplicación fue creada por estudiantes para que puedas subir y
            comprar apuntes fácilmente, conectar con profesores y encontrar
            servicios de fotocopiado cerca tuyo. Nuestro objetivo es facilitar
            el acceso a recursos educativos de calidad.
          </div>
        )}
      </div>
    </div>
  );
}
