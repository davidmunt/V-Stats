import { useState } from "react";
import { CategoriesManager } from "@/components/admin/category/CategoriesManager";
import { LeaguesManager } from "@/components/admin/league/LeaguesManager";
import { VenuesManager } from "@/components/admin/venue/VenuesManager";
import Sidebar from "@/components/reutilizables/SideBarDashboards";

const AdminDashboardPage = () => {
  const [currentView, setCurrentView] = useState<string>("leagues");

  return (
    <div className="flex w-full">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {currentView === "leagues" && <LeaguesManager />}
          {currentView === "categories" && <CategoriesManager />}
          {currentView === "venues" && <VenuesManager />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
