import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
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
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Manejar la inicialización de la autenticación
  useEffect(() => {
    let unsubscribe;

    const initAuth = async () => {
      try {
        // 1. Primero intentar procesar el resultado del redirect (crítico para PWA)
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          console.log("Login exitoso por Redirect (PWA):", user.email);
          localStorage.setItem("user_uid", user.uid);
          if (user.email === "guidoalvarado2019@gmail.com") {
            localStorage.setItem("administrador", "true");
          }
        }
      } catch (error) {
        console.error("Error al procesar redirect:", error);
      } finally {
        // 2. Suscribirse al estado de autenticación para confirmar el estado final
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log("Sesión confirmada:", user.email);
            localStorage.setItem("user_uid", user.uid);
            if (user.email === "guidoalvarado2019@gmail.com") {
              localStorage.setItem("administrador", "true");
            }
          } else {
            console.log("No hay sesión activa");
          }
          // 3. Solo ahora permitimos que la app se renderice
          setIsAuthReady(true);
        });
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Configuración para GitHub Pages
  const basename = import.meta.env.MODE === 'production' ? '/Trivi_app' : '';

  // Pantalla de carga mientras se verifica la sesión
  if (!isAuthReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">Verificando sesión...</p>
      </div>
    );
  }
  
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
