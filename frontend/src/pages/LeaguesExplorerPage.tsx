import { FilterLeagues } from "@/components/user/league/FilterLeagues";
import { ListLeagues } from "@/components/user/league/ListLeagues";

const LeaguesExplorerPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-8 overflow-y-auto">
        <FilterLeagues />
        <ListLeagues />
      </main>
    </div>
  );
};

export default LeaguesExplorerPage;
