import { useState } from "react";
import { useNextMatchForAnalystQuery } from "@/queries/match/useNextMatchForAnalyst";
import { useActualSetQuery } from "@/queries/set/useActualSet";
import { useMatchLineupsQuery } from "@/queries/lineups/useMatchLineupsQuery";
import { StartAnalysing } from "./StartAnalysing";
import { Scoreboard } from "./Scoreboard";
import { AnalysisCourt } from "./AnalysisCourt";
import { ActionPanel } from "./ActionPanel";
import { SubstitutionPanel } from "./SubstitutionPanel";
import LoadingFallback from "@/components/LoadingFallback";
import type { LineupPosition } from "@/interfaces/lineupPosition.interface";
import { ButtonFinishMatch } from "./ButtonFinishMatch";

export const MatchAnalysisManager = ({ analystSlug }: { analystSlug: string }) => {
  const [selectedPosition, setSelectedPosition] = useState<LineupPosition | null>(null);
  const { data: match, isLoading: isLoadingMatch } = useNextMatchForAnalystQuery(analystSlug);
  const { data: actualSet, isLoading: isLoadingSet } = useActualSetQuery(match?.slug || "");
  const { data: lineups, isLoading: isLoadingMatchLineups } = useMatchLineupsQuery(match?.slug || "");

  if (isLoadingMatch || isLoadingSet || isLoadingMatchLineups) return <LoadingFallback />;
  if (!match || !actualSet) return <div className="p-8 text-center text-gray-500">No se encontraron los datos del partido.</div>;

  if (match.status !== "live") {
    return <StartAnalysing match={match} analystSlug={analystSlug} />;
  }

  if (String(match.status) === "finished") {
    return <ButtonFinishMatch />;
  }

  const formatLineup = (positions: LineupPosition[]) => {
    const map: Record<number, LineupPosition> = {};
    positions.forEach((pos) => {
      map[pos.current_position] = pos;
    });
    return map;
  };

  const homeLineupMap = lineups ? formatLineup(lineups.home.positions) : {};
  const awayLineupMap = lineups ? formatLineup(lineups.away.positions) : {};

  if (isLoadingMatch || isLoadingSet || isLoadingMatchLineups) return <LoadingFallback />;
  if (!match) return <div className="p-8 text-center text-gray-500">No se encontró el partido.</div>;

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto p-4">
      <Scoreboard matchSlug={match.slug} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <AnalysisCourt homeLineup={homeLineupMap} awayLineup={awayLineupMap} onPlayerClick={(player) => setSelectedPosition(player)} />
        </div>
        <div className="lg:col-span-4 h-full">
          {selectedPosition ? (
            <>
              <SubstitutionPanel
                idLineup={lineups?.home?.id_team === selectedPosition.id_team ? lineups.home.id_lineup : lineups?.away?.id_lineup || ""}
                selectedPosition={selectedPosition}
                allPositions={[...(lineups?.home?.positions || []), ...(lineups?.away?.positions || [])]}
                onSuccess={() => setSelectedPosition(null)}
              />

              <ActionPanel
                setSlug={actualSet.slug}
                selectedPosition={selectedPosition}
                teamLocalId={match.id_team_local}
                teamVisitorId={match.id_team_visitor}
                onSuccess={() => setSelectedPosition(null)}
              />
            </>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl h-[500px] flex flex-col items-center justify-center text-center p-8">
              <p className="text-gray-400 font-medium">Selecciona un jugador para registrar una accion</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
