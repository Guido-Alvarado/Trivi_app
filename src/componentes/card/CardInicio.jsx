import React from "react";
import { useNavigate } from "react-router-dom";
import { User, X, Info, Heart, Users, Briefcase, Code, Mail, LogOut, Crown } from "lucide-react";
import IconButton from "../iconos/IconButton";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function CardInicio({ carrera }) {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [showObjectiveModal, setShowObjectiveModal] = React.useState(false);
  const [showDonationModal, setShowDonationModal] = React.useState(false);
  const [showCreatorModal, setShowCreatorModal] = React.useState(false);
  const [showNoCareerModal, setShowNoCareerModal] = React.useState(false);
  const [tempName, setTempName] = React.useState("");

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem("user_uid", currentUser.uid);
        setUserName(currentUser.displayName || currentUser.email.split('@')[0]);
        
        // Verificación de administrador al recargar
        if (currentUser.email === "guidoalvarado2019@gmail.com") {
          localStorage.setItem("administrador", "true");
        }
      } else {
        localStorage.removeItem("user_uid");
        localStorage.removeItem("administrador");
        // Si se desloguea, volvemos al nombre guardado manualmente o vacío
        setUserName(localStorage.getItem("userName") || "");
      }
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (!user) {
      const savedName = localStorage.getItem("userName") || "";
      setUserName(savedName);
    }
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 20) return "Buenas tardes";
    return "Buenas noches";
  };

  const handleSaveName = () => {
    localStorage.setItem("userName", tempName);
    setUserName(tempName);
    setShowModal(false);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Detectar si la app está instalada como PWA
      const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                    window.navigator.standalone === true;
      
      if (isPWA) {
        // En PWA instalada, usar redirect (funciona mejor)
        await signInWithRedirect(auth, provider);
      } else {
        // En navegador normal, usar popup (mejor UX)
        const result = await signInWithPopup(auth, provider);
        
        // Verificación de administrador en login explícito
        if (result.user.email === "guidoalvarado2019@gmail.com") {
          localStorage.setItem("administrador", "true");
        }
        
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error login:", error);
      alert("Error al iniciar sesión con Google");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("administrador");
      setShowModal(false);
    } catch (error) {
      console.error("Error logout:", error);
    }
  };

  const handleClick = (tipo) => {
    if (tipo === "Grupos") {
      if (carrera && carrera.Link) {
        window.open(carrera.Link, "_blank");
      } else {
        setShowNoCareerModal(true);
      }
    } else {
      alert(`Función ${tipo} aún no implementada`);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 text-white rounded-b-3xl p-6 shadow-2xl">
      <h1 className="text-center text-3xl font-bold mb-6 drop-shadow-lg tracking-wide">
        {carrera ? carrera.Nombre : "TriviaApp"}
      </h1>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            setTempName(userName);
            setShowModal(true);
          }}
          className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition backdrop-blur-sm"
        >
          <User size={28} />
        </button>
        <span className="text-lg font-medium">
          {getGreeting()}{userName ? `, ${userName}` : ""}
        </span>
      </div>

      <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-6 mt-6 shadow-xl border border-white/20">
        {/* Primera fila: 2 iconos */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <IconButton
            icon={<Briefcase size={32} />}
            label="Carreras"
            onClick={() => navigate("/carreras")}
          />
          <IconButton
            icon={<Users size={32} />}
            label="Grupos"
            onClick={() => handleClick("Grupos")}
          />
        </div>
        
        {/* Segunda fila: 3 iconos */}
        <div className="grid grid-cols-3 gap-4">
          <IconButton
            icon={<Info size={32} />}
            label="Importante"
            onClick={() => setShowObjectiveModal(true)}
          />
          <IconButton
            icon={<Heart size={32} />}
            label="Donación"
            onClick={() => setShowDonationModal(true)}
          />
          <IconButton
            icon={<Code size={32} />}
            label="Creador"
            onClick={() => setShowCreatorModal(true)}
          />
        </div>
      </div>

      {/* Modal de Usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">Tu Nombre</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {!user ? (
                <>
                  <p className="text-gray-600 mb-4 text-sm text-center">
                    Ingresa tu nombre o inicia sesión para guardar tu progreso en la nube.
                  </p>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Ingresa tu nombre (Local)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 mb-4"
                  />
                  <button
                    onClick={handleSaveName}
                    className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition mb-4"
                  >
                    Guardar solo en este dispositivo
                  </button>
                  
                  <div className="relative flex py-2 items-center mb-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">O</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                    Iniciar sesión con Google
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} className="text-blue-600" />
                      )}
                    </div>
                    {/* Insignia de Administrador */}
                    {localStorage.getItem("administrador") === "true" && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce" title="Administrador">
                        <Crown size={16} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h4 className="text-xl font-bold text-gray-800">{user.displayName}</h4>
                    {localStorage.getItem("administrador") === "true" && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full border border-yellow-200">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-6">{user.email}</p>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-100 text-red-600 font-bold py-3 rounded-lg hover:bg-red-200 transition flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Objetivo */}
      {showObjectiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">Nuestro Objetivo</h3>
              <button
                onClick={() => setShowObjectiveModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">
                La aplicación fue creada por estudiantes para que puedas subir y
                comprar apuntes fácilmente, conectar con profesores y encontrar
                servicios de fotocopiado cerca tuyo. Nuestro objetivo es facilitar
                el acceso a recursos educativos de calidad.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Donación */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Heart size={24} />
                Apoya el Proyecto
              </h3>
              <button
                onClick={() => setShowDonationModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Esta aplicación fue desarrollada completamente con recursos propios por estudiantes
                que creen en el acceso libre a la educación. Invertimos tiempo, esfuerzo y recursos
                personales para crear una herramienta que beneficie a toda la comunidad estudiantil.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Si esta app te ha sido útil y deseas apoyar su desarrollo y mantenimiento,
                cualquier donación es muy apreciada y nos ayuda a seguir mejorando.
              </p>
              <button
                onClick={() => {
                  setShowDonationModal(false);
                  alert("Redirigiendo a opciones de contacto...");
                }}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-3 rounded-lg hover:from-pink-700 hover:to-rose-700 transition shadow-lg flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Contactarse para Donar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal del Creador */}
      {showCreatorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Code size={24} />
                Sobre el Creador
              </h3>
              <button
                onClick={() => setShowCreatorModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-3">Desarrollador Full Stack</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Soy un desarrollador apasionado por crear soluciones tecnológicas que resuelvan
                problemas reales. Especializado en desarrollo web y móvil, con experiencia en:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Aplicaciones web modernas (React, Node.js)</li>
                <li>Aplicaciones móviles nativas e híbridas</li>
                <li>Sistemas de gestión empresarial</li>
                <li>E-commerce y plataformas educativas</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6">
                ¿Tienes un negocio y necesitas una aplicación personalizada? ¡Contáctame!
                Puedo ayudarte a digitalizar tu negocio y llevar tus ideas al siguiente nivel.
              </p>
              <button
                onClick={() => {
                  setShowCreatorModal(false);
                  alert("Redirigiendo a opciones de contacto...");
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Contactar para Proyectos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal No Carrera */}
      {showNoCareerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-orange-500 p-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Info size={24} />
                Atención
              </h3>
              <button
                onClick={() => setShowNoCareerModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-6">
                Para acceder a los grupos de WhatsApp, primero debes seleccionar una carrera.
                Cada carrera tiene sus propios grupos oficiales.
              </p>
              <button
                onClick={() => {
                  setShowNoCareerModal(false);
                  navigate("/carreras");
                }}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition shadow-lg"
              >
                Ir a Seleccionar Carrera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
