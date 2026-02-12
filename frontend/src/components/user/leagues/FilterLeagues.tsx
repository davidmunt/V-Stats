import { useLeaguesExplorerQuery } from "@/queries/leagues/useLeaguesExplorerQuery";
import { SearchInput } from "./SearchInput";
import { CategorySelect } from "./CategorySelect";

export const FilterLeagues = () => {
  const { qInput, filters, actions } = useLeaguesExplorerQuery();

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <SearchInput value={qInput} onChange={actions.setSearch} />

        <CategorySelect value={filters.category} onChange={actions.setCategory} />

        <button
          onClick={actions.clearFilters}
          className="p-3 text-gray-500 hover:text-red-600 transition-colors font-medium flex items-center gap-2"
          title="Limpiar filtros"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span className="hidden lg:inline">Limpiar</span>
        </button>
      </div>

      {/* Badge de estado (informativo) */}
      <div className="flex gap-2">
        {filters.q && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold animate-fade-in">
            Buscando: "{filters.q}"
          </span>
        )}
        {filters.category && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Categoría: {filters.category}
          </span>
        )}
      </div>
    </div>
  );
};
