import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const { data: user, isLoading } = useCurrentUserQuery();

  if (isLoading) return null;

  const menuButtons =
    user?.user_type === "admin"
      ? [
          { id: "leagues", label: "Mis Ligas" },
          { id: "categories", label: "Categorías" },
          { id: "venues", label: "Sedes" },
        ]
      : user?.user_type === "coach"
        ? [
            { id: "players", label: "Mis Jugadores" },
            { id: "lineup", label: "Plantilla Titular" },
            { id: "stats", label: "Estadísticas" },
            { id: "positionTable", label: "Tabla de Posiciones" },
            { id: "calendar", label: "Calendario de Partidos" },
          ]
        : user?.user_type === "analyst"
          ? [{ id: "match", label: "Empezar Análisis Partido" }]
          : [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 sticky top-16 h-[calc(100vh-64px)] flex flex-col hidden lg:flex">
      <div className="p-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Panel {user?.user_type}</h2>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1">
        {menuButtons.map((button) => {
          const is_active = currentView === button.id;

          return (
            <button
              key={button.id}
              onClick={() => onViewChange(button.id)}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group
                ${
                  is_active ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              {is_active && <span className="absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full" />}
              {button.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
