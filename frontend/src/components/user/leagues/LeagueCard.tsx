import { useNavigate } from "react-router-dom";
import type { League } from "@/interfaces/league.interface";

interface LeagueCardProps {
  league: League;
}

export const LeagueCard = ({ league }: LeagueCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      <div className="h-40 bg-gray-100 overflow-hidden relative">
        <img
          src={league.image || "/placeholder-league.png"}
          alt={league.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase text-slate-700 shadow-sm">
            {league.slug_category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-1">{league.name}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-6">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
          {league.country}
        </div>

        <button
          onClick={() => navigate(`/league/${league.slug_league}`)}
          className="mt-auto w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 group/btn"
        >
          Explorar Liga
          <svg
            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
