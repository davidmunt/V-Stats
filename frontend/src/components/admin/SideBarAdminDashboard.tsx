interface AdminSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuButtons = [
  { id: "leagues", label: "Mis Ligas" },
  { id: "categories", label: "Categorías" },
  { id: "teams", label: "Equipos" },
];

const AdminSidebar = ({ currentView, onViewChange }: AdminSidebarProps) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0">
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Panel Admin</h2>
        <p className="text-xs text-gray-500 mt-1">Gestión de torneos</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {menuButtons.map((button) => {
          const isActive = currentView === button.id;

          return (
            <button
              key={button.id}
              onClick={() => onViewChange(button.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" // Estilo Activo
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900" // Estilo Inactivo
                }
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

export default AdminSidebar;
