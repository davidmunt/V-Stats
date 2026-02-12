import { useLeaguesExplorerQuery } from "@/queries/leagues/useLeaguesExplorerQuery";

export const PaginationLeagues = () => {
  const { data, actions, isLoading } = useLeaguesExplorerQuery();

  if (isLoading || !data) return null;

  const { total_pages, page: currentPage } = data;

  if (total_pages <= 1) return null;

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= total_pages - 1;

  const btnBaseClass = "flex items-center justify-center p-2 rounded-lg border transition-all duration-200 font-bold text-sm shadow-sm";
  const btnEnabledClass =
    "bg-white border-gray-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95";
  const btnDisabledClass = "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed";

  return (
    <div className="flex flex-col items-center gap-4 mt-12 pb-10">
      <div className="flex items-center gap-2">
        <button
          onClick={() => actions.setPage(0)}
          disabled={isFirstPage}
          className={`${btnBaseClass} ${isFirstPage ? btnDisabledClass : btnEnabledClass}`}
          title="Primera página"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => actions.setPage(currentPage - 1)}
          disabled={isFirstPage}
          className={`${btnBaseClass} ${isFirstPage ? btnDisabledClass : btnEnabledClass} px-4`}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        <div className="px-6 py-2 bg-slate-100 rounded-full text-slate-600 text-xs font-black uppercase tracking-widest border border-slate-200 mx-2">
          Página {currentPage + 1} <span className="text-slate-400 mx-1">de</span> {total_pages}
        </div>

        <button
          onClick={() => actions.setPage(currentPage + 1)}
          disabled={isLastPage}
          className={`${btnBaseClass} ${isLastPage ? btnDisabledClass : btnEnabledClass} px-4`}
        >
          Siguiente
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => actions.setPage(total_pages - 1)}
          disabled={isLastPage}
          className={`${btnBaseClass} ${isLastPage ? btnDisabledClass : btnEnabledClass}`}
          title="Última página"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Total: {data.total} ligas encontradas</span>
    </div>
  );
};
