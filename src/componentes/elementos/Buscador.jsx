// Buscador.jsx
import React from "react";
import { Search } from "lucide-react";

export default function Buscador({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="flex items-center bg-white rounded-xl shadow-md px-5 py-4 w-full max-w-md mx-auto my-4 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
      <Search className="text-gray-400 mr-3" size={28} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full outline-none text-gray-700 text-lg placeholder-gray-400 font-medium"
      />
    </div>
  );
}
