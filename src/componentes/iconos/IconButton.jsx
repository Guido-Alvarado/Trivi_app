import React from "react";

export default function IconButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 bg-white/95 text-cyan-700 rounded-2xl p-4 
                 hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl
                 border border-white/50"
    >
      <div className="text-cyan-600">{icon}</div>
      <span className="font-bold text-base text-gray-800">{label}</span>
    </button>
  );
}
