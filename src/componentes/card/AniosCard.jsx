import { useNavigate } from "react-router-dom";

export default function AniosCard({ cantidad }) {
  const años = Array.from({ length: cantidad }, (_, i) => i + 1);
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 pt-0 pb-8">
      <h2 className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-center font-bold text-2xl rounded-t-2xl p-5 shadow-lg">
        Años
      </h2>

      <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
        {años.map((año) => (
          <button
            key={año}
            onClick={() => navigate(`/materias/${año}`)}
            className="flex-shrink-0 bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl py-4 px-8 font-bold text-lg text-gray-800
                       hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-gray-100"
          >
            {`AÑO ${año}`}
          </button>
        ))}
      </div>
    </div>
  );
}
