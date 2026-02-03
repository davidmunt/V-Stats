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
          ? [{ id: "match", label: "Empezar analisis Partido" }]
          : [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Panel {user?.user_type}</h2>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2">
        {menuButtons.map((button) => {
          const is_active = currentView === button.id;

          return (
            <button
              key={button.id}
              onClick={() => onViewChange(button.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${is_active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}
              `}
            >
              {button.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
