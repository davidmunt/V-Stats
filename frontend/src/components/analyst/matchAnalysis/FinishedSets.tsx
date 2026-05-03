import React from "react";
import { useFinishedSetsQuery } from "@/queries/set/useSetsFromMatch";

interface Props {
  matchSlug: string;
}

const FinishedSets: React.FC<Props> = ({ matchSlug }) => {
  const { data: sets, isLoading, isError } = useFinishedSetsQuery(matchSlug);

  if (isLoading || isError || !sets || sets.length === 0) return null;

  return (
    <div className="flex items-center gap-6">
      <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.25em] flex items-center gap-2">Historial</span>

      <div className="flex gap-2.5">
        {sets.map((set) => {
          const localWon = set.local_points > set.visitor_points;
          return (
            <div
              key={set.slug_set}
              className="flex items-center bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 transition-all group"
            >
              <span className="text-[10px] text-blue-100/70 font-black mr-3">S{set.set_number}</span>

              <div className="flex items-center gap-2 text-[13px] font-black tabular-nums tracking-tighter">
                <span className={`${localWon ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "text-white/60"}`}>
                  {set.local_points}
                </span>

                <span className="text-white/40 font-light mx-0.5">-</span>

                <span className={`${!localWon ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "text-white/60"}`}>
                  {set.visitor_points}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinishedSets;
