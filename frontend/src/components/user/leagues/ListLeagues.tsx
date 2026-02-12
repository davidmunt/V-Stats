import { useLeaguesExplorerQuery } from "@/queries/leagues/useLeaguesExplorerQuery";
import { LeagueCard } from "./LeagueCard";

export const ListLeagues = () => {
  const { data, isLoading, error } = useLeaguesExplorerQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1400px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-50 rounded-2xl text-red-600 max-w-2xl mx-auto">
        Hubo un error al obtener las ligas. Por favor, intenta de nuevo.
      </div>
    );
  }

  const leagues = data?.leagues || [];

  if (leagues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-slate-600">No se encontraron ligas...</p>
        <p className="text-sm">Prueba a cambiar los filtros o el término de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-[1400px]">
        {leagues.map((league) => (
          <LeagueCard key={league.slug} league={league} />
        ))}
      </div>
    </div>
  );
};
