import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
