import { useAuthContext } from "@/hooks/useAuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, logoutDevice, user } = useAuthContext();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-6 h-16 flex justify-between items-center">
        <Link to={`/${user?.user_type}`} className="flex items-center gap-2 group">
          <img src="/2.png" alt="Logo V-Stats" className="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 sm:gap-6">
              <Link to={`/profile/${user.slug_user}`} className="flex items-center gap-3 group pl-4 border-l border-gray-100">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-gray-900 leading-none group-hover:text-blue-600 transition-colors">{user.name}</p>
                </div>
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt={`Avatar de ${user.name}`}
                  className="w-10 h-10 rounded-full ring-2 ring-transparent group-hover:ring-blue-500 transition-all object-cover shadow-sm"
                />
              </Link>

              <button
                onClick={logoutDevice}
                className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-100 active:scale-95"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
