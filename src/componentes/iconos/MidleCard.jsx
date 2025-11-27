// MiddleCard.jsx
import React from "react";

export default function MiddleCard({ title, icon, description }) {
  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl p-6 gap-3
                    hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-gray-100">
      <div className="text-cyan-600">{icon}</div>
      <h2 className="font-bold text-xl text-gray-800">{title}</h2>
      <p className="text-gray-600 text-center text-sm">{description}</p>
    </div>
  );
}

