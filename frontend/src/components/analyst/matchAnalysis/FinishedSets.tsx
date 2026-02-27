import React from "react";
import { useFinishedSetsQuery } from "@/queries/set/useSetsFromMatch";

interface Props {
  matchSlug: string;
}

const FinishedSets: React.FC<Props> = ({ matchSlug }) => {
  const { data: sets, isLoading, isError } = useFinishedSetsQuery(matchSlug);

  if (isLoading || isError || !sets || sets.length === 0) return null;

  return (
    <div className="flex items-center gap-3 py-2 px-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 w-fit">
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mr-2">Sets:</span>
      <div className="flex gap-2">
        {sets.map((set) => {
          const localWon = set.local_points > set.visitor_points;
          return (
            <div
              key={set.slug_set}
              className="flex items-center bg-slate-800/50 border border-slate-700/50 rounded-xl px-2.5 py-1 shadow-inner"
            >
              <span className="text-[9px] text-slate-500 font-black mr-2">S{set.set_number}</span>
              <div className="flex items-center gap-1.5 text-xs font-mono tracking-tighter">
                <span className={`${localWon ? "text-blue-400 font-black" : "text-slate-500"}`}>{set.local_points}</span>
                <span className="text-slate-700 font-bold">:</span>
                <span className={`${!localWon ? "text-blue-400 font-black" : "text-slate-500"}`}>{set.visitor_points}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinishedSets;
