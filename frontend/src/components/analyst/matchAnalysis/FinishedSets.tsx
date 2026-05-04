import React from "react";
import { useFinishedSetsQuery } from "@/queries/set/useSetsFromMatch";

interface Props {
  matchSlug: string;
}

const FinishedSets: React.FC<Props> = ({ matchSlug }) => {
  const { data: sets, isLoading, isError } = useFinishedSetsQuery(matchSlug);

  if (isLoading || isError || !sets || sets.length === 0) return null;

  return (
    <div className="flex gap-1.5">
      {sets.map((set) => {
        const localWon = set.local_points > set.visitor_points;
        return (
          <div
            key={set.slug_set}
            className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-lg px-2 py-0.5"
          >
            <span className="text-[8px] text-white/50 font-black">S{set.set_number}</span>
            <span className={`text-[11px] font-black tabular-nums ${localWon ? "text-white" : "text-white/50"}`}>
              {set.local_points}
            </span>
            <span className="text-white/30 text-[9px]">-</span>
            <span className={`text-[11px] font-black tabular-nums ${!localWon ? "text-white" : "text-white/50"}`}>
              {set.visitor_points}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default FinishedSets;
