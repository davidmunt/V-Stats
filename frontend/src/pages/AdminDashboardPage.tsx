import { useState } from "react";
import AdminSidebar from "@/components/admin/SideBarAdminDashboard";
import { CategoriesManager } from "@/components/admin/categortyLeague/CategoriesManager";
import { LeaguesManager } from "@/components/admin/league/LeaguesManager";
import { VenuesManager } from "@/components/admin/venue/VenuesManager";

const AdminDashboardPage = () => {
  const [currentView, setCurrentView] = useState<string>("leagues");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 p-8 overflow-y-auto">
        {currentView === "leagues" && <LeaguesManager />}
        {currentView === "categories" && <CategoriesManager />}
        {currentView === "venues" && <VenuesManager />}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
