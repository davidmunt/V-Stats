import React from "react";
import { useFinishedSetsQuery } from "@/queries/set/useSetsFromMatch";

interface Props {
  matchSlug: string;
}

const FinishedSets: React.FC<Props> = ({ matchSlug }) => {
  const { data: sets, isLoading, isError } = useFinishedSetsQuery(matchSlug);

  if (isLoading || isError || !sets || sets.length === 0) return null;

  return (
    <div className="flex items-center gap-2 py-1 px-2 bg-black/20 rounded-lg w-fit">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-1">Sets:</span>
      <div className="flex gap-1.5">
        {sets.map((set) => {
          const localWon = set.local_points > set.visitor_points;

          return (
            <div key={set.id_set} className="flex items-center bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 shadow-sm">
              <span className="text-[10px] text-gray-400 font-medium mr-1">S{set.set_number}</span>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className={`${localWon ? "text-yellow-400 font-bold" : "text-gray-300"}`}>{set.local_points}</span>
                <span className="text-gray-600">-</span>
                <span className={`${!localWon ? "text-yellow-400 font-bold" : "text-gray-300"}`}>{set.visitor_points}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinishedSets;
