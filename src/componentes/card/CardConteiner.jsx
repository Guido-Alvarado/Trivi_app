import React from "react";
import { Printer, GraduationCap, FileText, Clock } from "lucide-react";
import MiddleCard from "../iconos/MidleCard";

export default function CardsContainer({ carrera }) {
  return (
    <div className="w-full max-w-5xl mx-auto mt-8 px-4">
      {/* Sección Próximamente */}
      <div className="relative">
        {/* Título Próximamente */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Próximamente</h2>
        </div>
        
        {/* Badge decorativo */}
        <div className="absolute -top-2 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
          Muy Pronto
        </div>

        {/* Contenedor de las cards con efecto deshabilitado */}
        <div className="relative">
          {/* Overlay semi-transparente */}
          <div className="absolute inset-0 bg-gray-100/60 backdrop-blur-[2px] rounded-2xl z-10 pointer-events-none"></div>
          
          {/* Grid de cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
            <MiddleCard
              icon={<Printer size={40} />}
              title="Fotocopiadoras"
              description="Encuentra las mejores fotocopiadoras."
            />
            {carrera && (
              <>
                <MiddleCard
                  icon={<GraduationCap size={40} />}
                  title="Particular"
                  description="Clases particulares a tu alcance."
                />
                <MiddleCard
                  icon={<FileText size={40} />}
                  title="Comprar/Vender Apuntes"
                  description="Sube o compra apuntes fácilmente."
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
