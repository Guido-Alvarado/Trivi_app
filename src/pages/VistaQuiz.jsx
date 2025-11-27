import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Clock, CheckCircle, XCircle, ArrowLeft, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

// Importar sonidos
import correctSoundFile from "../assets/correct-answer.mp3";
import wrongSoundFile from "../assets/wrong-answer.mp3";

export default function VistaQuiz() {
  const navigate = useNavigate();
  const { id } = useParams(); // id es el número de año
  const location = useLocation();
  
  // Obtener materia y unidad del estado de navegación
  const { materia, unidad } = location.state || {};

  const [indicePregunta, setIndicePregunta] = useState(0);
  const [correctas, setCorrectas] = useState(0);
  const [incorrectas, setIncorrectas] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(100);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [preguntasJuego, setPreguntasJuego] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNoQuestionsModal, setShowNoQuestionsModal] = useState(false);
  
  // Estados para el feedback visual
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);

  // Instancias de audio
  const playCorrectSound = () => {
    const audio = new Audio(correctSoundFile);
    audio.play().catch(e => console.error("Error playing sound:", e));
  };

  const playWrongSound = () => {
    const audio = new Audio(wrongSoundFile);
    audio.play().catch(e => console.error("Error playing sound:", e));
  };

  // Función para mezclar array (Fisher-Yates)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Cargar y preparar preguntas
  useEffect(() => {
    if (!materia || !unidad) {
      setError("Faltan datos de materia o unidad.");
      setLoading(false);
      return;
    }

    const storageKey = `${materia}preguntas`;
    const preguntasGuardadas = JSON.parse(localStorage.getItem(storageKey)) || [];

    // 1. Filtrar por unidad (extrayendo el número de "Unidad X")
    const numeroUnidad = parseInt(unidad.replace("Unidad ", ""));
    
    const preguntasFiltradas = preguntasGuardadas.filter(p => 
      parseInt(p.unidad) === numeroUnidad
    );

    if (preguntasFiltradas.length === 0) {
      // En lugar de setear error estático, activamos el modal de redirección
      setShowNoQuestionsModal(true);
      setLoading(false);
      return;
    }

    // 2. Adaptar estructura y mezclar opciones
    const preguntasAdaptadas = preguntasFiltradas.map(p => {
      // Recopilar respuestas incorrectas válidas (no vacías)
      const incorrectas = [p.resp1, p.resp2, p.resp3].filter(r => r && r.trim() !== "");
      const todasOpciones = [...incorrectas, p.correcta];
      
      return {
        id: p.id,
        tipo: incorrectas.length === 1 ? "Verdadero/Falso" : "Opción Múltiple",
        texto: p.pregunta || p.texto,
        opciones: shuffleArray(todasOpciones),
        respuestaCorrecta: p.correcta
      };
    });

    // 3. Mezclar el orden de las preguntas
    setPreguntasJuego(shuffleArray(preguntasAdaptadas));
    setLoading(false);
  }, [materia, unidad]);

  // ... (resto del código del timer) ...

  // Renderizado del Modal de Sin Preguntas
  if (showNoQuestionsModal) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white text-slate-900 rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="bg-orange-100 p-3 rounded-full mb-4">
              <AlertCircle size={48} className="text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Ups! Sin preguntas</h2>
            <p className="text-gray-600 mb-6">
              No hay preguntas validadas para la <strong>{unidad}</strong> de {materia}. 
              ¿Quieres ir al banco de preguntas para agregar o validar algunas?
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Volver
              </button>
              <button 
                onClick={() => navigate(`/vistabd/${id}`, { state: { materia, totalUnidades: 5 } })} // Asumimos 5 o lo que venga, redirige a VistaBD
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Ir al Banco
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Temporizador
  useEffect(() => {
    if (juegoTerminado || preguntasJuego.length === 0 || mostrarFeedback || loading || error) return;

    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 0) {
          clearInterval(intervalo);
          finalizarJuego();
          return 0;
        }
        return prev - 0.5; // Velocidad del timer
      });
    }, 100);

    return () => clearInterval(intervalo);
  }, [juegoTerminado, indicePregunta, preguntasJuego.length, mostrarFeedback, loading, error]);

  const finalizarJuego = (finalCorrectas = correctas, finalIncorrectas = incorrectas) => {
    setJuegoTerminado(true);
    const total = preguntasJuego.length;
    
    // Guardar progreso movido a VistaResultados
    navigate("/resultados", { 
      state: { 
        correctas: finalCorrectas, 
        incorrectas: finalIncorrectas + (total - (finalCorrectas + finalIncorrectas)), // Sumar no respondidas a incorrectas
        total: total,
        materia: materia, // Pasamos el contexto
        unidad: unidad    // Pasamos el contexto
      } 
    });
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xl">Cargando Quiz...</div>;
  
  if (error) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-8 text-center">
      <XCircle size={64} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">No se puede iniciar el Quiz</h2>
      <p className="text-gray-400 mb-6">{error}</p>
      <button onClick={() => navigate(-1)} className="bg-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
        Volver
      </button>
    </div>
  );

  const preguntaActual = preguntasJuego[indicePregunta];
  const totalPreguntas = preguntasJuego.length;

  const handleRespuesta = (respuesta, index) => {
    if (mostrarFeedback) return;
    
    setRespuestaSeleccionada(index);
    setMostrarFeedback(true);

    const esCorrecta = respuesta === preguntaActual.respuestaCorrecta;
    let nuevasCorrectas = correctas;
    let nuevasIncorrectas = incorrectas;

    if (esCorrecta) {
      nuevasCorrectas++;
      setCorrectas(nuevasCorrectas);
      playCorrectSound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b']
      });
    } else {
      nuevasIncorrectas++;
      setIncorrectas(nuevasIncorrectas);
      playWrongSound();
    }

    setTimeout(() => {
      setMostrarFeedback(false);
      setRespuestaSeleccionada(null);
      
      if (indicePregunta + 1 < totalPreguntas) {
        setIndicePregunta(prev => prev + 1);
        setTiempoRestante(100);
      } else {
        finalizarJuego(nuevasCorrectas, nuevasIncorrectas);
      }
    }, 1500);
  };

  // Función para determinar el estilo del botón
  const getButtonClass = (opcion, index) => {
    const baseClass = "border-2 p-6 rounded-xl text-lg font-semibold transition-all active:scale-95 text-center w-full ";
    
    if (!mostrarFeedback) {
      return baseClass + "bg-white/10 hover:bg-white/20 border-transparent hover:border-blue-500";
    }

    if (opcion === preguntaActual.respuestaCorrecta) {
      return baseClass + "bg-green-600 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]";
    }
    
    if (index === respuestaSeleccionada) {
      return baseClass + "bg-red-600 border-red-400 text-white";
    }

    return baseClass + "bg-white/5 border-transparent opacity-50";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header con contadores y tiempo */}
      <div className="p-4 bg-slate-800 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-4 font-bold text-lg">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={20} /> {correctas}
            </div>
            <div className="flex items-center gap-2 text-red-400">
              <XCircle size={20} /> {incorrectas}
            </div>
          </div>
          <div className="text-sm font-medium text-slate-400">
            {indicePregunta + 1}/{totalPreguntas}
          </div>
        </div>

        {/* Barra de tiempo */}
        <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${
              tiempoRestante > 50 ? 'bg-green-500' : tiempoRestante > 20 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${tiempoRestante}%` }}
          />
        </div>
      </div>

      {/* Área de Pregunta */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-semibold mb-4">
            {preguntaActual.tipo}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            {preguntaActual.texto}
          </h2>
        </div>

        {/* Opciones de Respuesta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {preguntaActual.opciones.map((opcion, index) => (
            <button
              key={index}
              onClick={() => handleRespuesta(opcion, index)}
              disabled={mostrarFeedback}
              className={getButtonClass(opcion, index)}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
