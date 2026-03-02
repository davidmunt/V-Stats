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
            <div className="flex items-center gap-3 sm:gap-4">
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm group"
              >
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Logout</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100 active:scale-95 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                />
              </svg>
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
