import { FilterLeagues } from "@/components/user/leagues/FilterLeagues";
import { ListLeagues } from "@/components/user/leagues/ListLeagues";
import { PaginationLeagues } from "@/components/user/leagues/PaginationLeagues";

const LeaguesExplorerPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-8 overflow-y-auto">
        <FilterLeagues />
        <ListLeagues />
        <PaginationLeagues />
      </main>
    </div>
  );
};

export default LeaguesExplorerPage;
