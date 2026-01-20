import { useState } from "react";
import AdminSidebar from "@/components/admin/SideBarAdminDashboard";
import { CategoriesManager } from "@/components/admin/CategortyLeague/CategoriesManager";

const AdminDashboardPage = () => {
  const [currentView, setCurrentView] = useState<string>("leagues");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 p-8 overflow-y-auto">
        {currentView === "leagues" && (
          <div>
            {/* AQUÍ IRÁ EL COMPONENTE: <AdminLeaguesList /> */}
            <h1 className="text-2xl font-bold mb-4">Gestión de Ligas</h1>
            <div className="p-10 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-center">
              Aquí cargaremos el componente de Ligas
            </div>
          </div>
        )}
        {currentView === "categories" && <CategoriesManager />}
        {currentView === "teams" && (
          <div>
            {/* AQUÍ IRÁ EL COMPONENTE: <AdminTeamsList /> */}
            <h1 className="text-2xl font-bold mb-4">Gestión de Equipos</h1>
            <div className="p-10 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-center">
              Aquí cargaremos el componente de Equipos
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
