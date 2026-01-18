import { useAuthContext } from "@/hooks/useAuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  // Extraemos también 'user' para saludar
  const { isAuthenticated, logout, user } = useAuthContext();

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo o Título */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          Mi Liga App
        </Link>

        {/* Zona de usuario */}
        <div>
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Hola, <span className="font-semibold">{user.name}</span>
              </span>

              <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            // Opcional: Mostrar botón de login si no está autenticado
            <Link to="/auth" className="text-blue-600 font-semibold">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
