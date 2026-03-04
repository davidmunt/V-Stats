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
            { id: "table", label: "Tabla de Posiciones" },
            { id: "calendar", label: "Calendario de Partidos" },
          ]
        : user?.user_type === "analyst"
          ? [{ id: "match", label: "Empezar Análisis Partido" }]
          : [];

  return (
    <aside
      className="
    hidden md:flex flex-col sticky top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300
    w-20 lg:w-64
  "
    >
      <div className="p-6 overflow-hidden">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap hidden lg:block">
          Panel {user?.user_type}
        </h2>
      </div>

      <nav className="flex-1 px-3 lg:px-4 flex flex-col gap-2">
        {menuButtons.map((button) => {
          const is_active = currentView === button.id;
          return (
            <button
              key={button.id}
              onClick={() => onViewChange(button.id)}
              className={`relative flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-4 lg:py-3 rounded-xl transition-all group
              ${is_active ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50"}
            `}
              title={button.label}
            >
              <span className="text-sm font-bold whitespace-nowrap hidden lg:block">{button.label}</span>
              {is_active && <span className="absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
