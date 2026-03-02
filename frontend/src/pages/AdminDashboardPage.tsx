import { useState } from "react";
import { CategoriesManager } from "@/components/admin/category/CategoriesManager";
import { LeaguesManager } from "@/components/admin/league/LeaguesManager";
import { VenuesManager } from "@/components/admin/venue/VenuesManager";
import Sidebar from "@/components/reutilizables/SideBarDashboards";

const AdminDashboardPage = () => {
  const [currentView, setCurrentView] = useState<string>("leagues");

  return (
    <div className="flex w-full min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 w-full overflow-x-hidden">
        <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
          {currentView === "leagues" && <LeaguesManager />}
          {currentView === "categories" && <CategoriesManager />}
          {currentView === "venues" && <VenuesManager />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
