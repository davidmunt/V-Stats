import { useAuthContext } from "@/hooks/useAuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, logout, user } = useAuthContext();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        <Link to={`/${user?.user_type}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/2.png" alt="Logo" className="h-10 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-6">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <Link to={`/profile/${user.id}`} className="flex items-center gap-3 group border-r border-gray-200 pr-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{user.name}</p>
                  <p className="text-xs text-gray-500">Mi Perfil</p>
                </div>
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-all object-cover shadow-sm"
                />
              </Link>

              <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-sm active:scale-95"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
