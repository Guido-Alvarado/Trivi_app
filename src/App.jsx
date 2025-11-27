import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getRedirectResult } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Inicio from "./pages/Inicio";
import VistaMaterias from "./pages/VistaMaterias";
import VistaBD from "./pages/VistaBD";
import CrearPregunta from "./pages/CrearPregunta";
import PreguntasGuardadas from "./pages/PreguntasGuardadas";
import EditarPregunta from "./pages/EditarPregunta";
import VistaMateriasCandidatas from "./pages/VistaMateriasCandidatas";
import CrearMateria from "./pages/CrearMateria";
import MateriasGuardadas from "./pages/MateriasGuardadas";
import VistaCarreras from "./pages/VistaCarreras";
import VistaQuiz from "./pages/VistaQuiz";
import VistaResultados from "./pages/VistaResultados";
import CrearCarrera from "./pages/CrearCarrera";
import CarrerasGuardadas from "./pages/CarrerasGuardadas";
import InstallPWA from "./componentes/pwa/InstallPWA";

function App() {
  // Manejar el resultado del redirect cuando vuelve de la autenticación
  // Manejar el resultado del redirect y estado de autenticación
  useEffect(() => {
    // 1. Verificar resultado del redirect (Login PWA)
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          console.log("Login exitoso por Redirect (PWA):", user.email);
          
          // Guardar datos críticos en localStorage inmediatamente
          localStorage.setItem("user_uid", user.uid);
          if (user.email === "guidoalvarado2019@gmail.com") {
            localStorage.setItem("administrador", "true");
          }
          
          // Forzar recarga suave si es necesario para actualizar UI
          // window.location.reload(); // Opcional, mejor dejar que React reaccione
        }
      } catch (error) {
        console.error("Error al procesar redirect:", error);
      }
    };

    handleRedirectResult();

    // 2. Escuchar cambios de estado globales (Persistencia)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Usuario autenticado detectado en App:", user.email);
        localStorage.setItem("user_uid", user.uid);
        if (user.email === "guidoalvarado2019@gmail.com") {
          localStorage.setItem("administrador", "true");
        }
      } else {
        // No borrar user_uid aquí para evitar parpadeos si está cargando,
        // dejar que los componentes individuales manejen el logout explícito
        console.log("No hay usuario autenticado activo");
      }
    });

    return () => unsubscribe();
  }, []);
  // Configuración para GitHub Pages
  // En desarrollo usa '/', en producción usa el nombre del repositorio
  const basename = import.meta.env.MODE === 'production' ? '/Trivi_app' : '';
  
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/materias/:anio" element={<VistaMaterias />} />
        <Route path="/vistabd/:numero" element={<VistaBD />} />
        <Route path="/crear-pregunta/:numero" element={<CrearPregunta />} />
        <Route path="/preguntas-guardadas" element={<PreguntasGuardadas />} />
        <Route path="/editar-pregunta/:id" element={<EditarPregunta />} />
        <Route path="/materias-propuestas" element={<VistaMateriasCandidatas />} />
        <Route path="/crear-materia" element={<CrearMateria />} />
        <Route path="/editar-materia/:id" element={<CrearMateria />} />
        <Route path="/materias-guardadas" element={<MateriasGuardadas />} />
        <Route path="/carreras" element={<VistaCarreras />} />
        <Route path="/crear-carrera" element={<CrearCarrera />} />
        <Route path="/editar-carrera/:id" element={<CrearCarrera />} />
        <Route path="/carreras-guardadas" element={<CarrerasGuardadas />} />
        <Route path="/quiz/:id" element={<VistaQuiz />} />
        <Route path="/resultados" element={<VistaResultados />} />
        {/* Otras rutas */}
      </Routes>
      
      {/* Componente de instalación PWA */}
      <InstallPWA />
    </Router>
  );
}

export default App;
