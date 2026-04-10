import { useState, useEffect, useRef } from "react";
import { useActualSetQuery } from "@/queries/set/useActualSet";
import { useMatchQuery } from "@/queries/match/useMatch";
import { useMatchLineupsQuery } from "@/queries/lineups/useMatchLineupsQuery";
import { StartAnalysing } from "./StartAnalysing";
import { Scoreboard } from "./Scoreboard";
import { AnalysisCourt } from "./AnalysisCourt";
import { ActionPanel } from "./ActionPanel";
import { SubstitutionPanel } from "./SubstitutionPanel";
import LoadingFallback from "@/components/LoadingFallback";
import type { LineupPosition } from "@/interfaces/lineupPosition.interface";
import Swal from "sweetalert2";
import { useFinishedSetsQuery } from "@/queries/set/useSetsFromMatch";
import { PostMatchStats } from "./PostMatchStats";

export const OtherTeamAnalysisManager = ({
  analystSlug,
  matchSlug,
  targetTeamSlug,
}: {
  analystSlug: string;
  matchSlug: string;
  targetTeamSlug: string | null;
}) => {
  const [selectedPosition, setSelectedPosition] = useState<LineupPosition | null>(null);
  // Aqui se guardara el lgud del partyo y el equipo seleccionado para analizar
  const { data: match, isLoading: isLoadingMatch } = useMatchQuery(matchSlug);
  const { data: actualSet, isLoading: isLoadingSet } = useActualSetQuery(matchSlug);
  const { data: lineups, isLoading: isLoadingMatchLineups } = useMatchLineupsQuery(matchSlug);
  const { data: finishedSetsData } = useFinishedSetsQuery(matchSlug);
  const previousMatchSlug = useRef<string | null>(null);
  const lastScore = useRef({ local: 0, visitor: 0 });
  const [showFinalStats, setShowFinalStats] = useState(false);
  const [finalScore, setFinalScore] = useState({ local: 0, visitor: 0 });
  const [finishedMatchSlug, setFinishedMatchSlug] = useState<string>("");

  const handleManualFinish = () => {
    // 1. Obtenemos el marcador actual de la referencia
    const { local, visitor } = lastScore.current;

    // 2. Seteamos los estados necesarios para mostrar PostMatchStats
    setFinishedMatchSlug(matchSlug);
    setFinalScore({ local, visitor });

    // 3. Mostramos el Swal que ya tenías definido
    Swal.fire({
      title: "¡Partido Finalizado!",
      html: `
      <div class="py-4">
        <div class="flex justify-center items-center gap-6 mb-2">
          <div class="text-center">
            <span class="block text-[10px] font-black text-gray-400 uppercase">Sets Local</span>
            <span class="text-4xl font-black text-slate-800">${local}</span>
          </div>
          <div class="text-2xl font-black text-gray-300 mt-4">-</div>
          <div class="text-center">
            <span class="block text-[10px] font-black text-gray-400 uppercase">Sets Visitante</span>
            <span class="text-4xl font-black text-slate-800">${visitor}</span>
          </div>
        </div>
        <p class="text-sm font-bold text-blue-600 uppercase tracking-widest mt-4">
          ${local > visitor ? "Victoria Local" : "Victoria Visitante"}
        </p>
      </div>
    `,
      icon: "success",
      confirmButtonText: "Ver Estadísticas Finales",
      confirmButtonColor: "#2563eb",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setShowFinalStats(true);
      }
    });
  };

  useEffect(() => {
    const isJustFinished =
      previousMatchSlug.current && (!match || match.status === "finished" || match.slug_match !== previousMatchSlug.current);

    if (isJustFinished) {
      if (showFinalStats) return;

      const { local, visitor } = lastScore.current;
      setFinishedMatchSlug(previousMatchSlug.current!);
      setFinalScore({ local, visitor });

      handleManualFinish();

      // Limpiamos la referencia para evitar que el Swal salte múltiples veces si el componente se re-renderiza
      previousMatchSlug.current = null;
    }

    // 2. MIENTRAS EL PARTIDO ESTÁ VIVO
    if (match && match.status === "live") {
      previousMatchSlug.current = match.slug_match;

      if (finishedSetsData) {
        const score = finishedSetsData.reduce(
          (acc, set) => {
            if (set.local_points > set.visitor_points) acc.local += 1;
            else if (set.visitor_points > set.local_points) acc.visitor += 1;
            return acc;
          },
          { local: 0, visitor: 0 },
        );
        lastScore.current = score;
      }
    }
  }, [match, finishedSetsData, showFinalStats]);

  // RENDERIZADO LÓGICO
  if (showFinalStats) {
    return (
      <PostMatchStats
        // Priorizamos el equipo que elegimos scoutear
        teamSlug={targetTeamSlug || match?.slug_team_local || ""}
        matchSlug={finishedMatchSlug || matchSlug}
        score={finalScore}
      />
    );
  }

  // 2. Fallbacks de carga y error habituales
  if (isLoadingMatch || isLoadingSet || isLoadingMatchLineups) return <LoadingFallback />;

  if (!match || !actualSet) {
    return <div className="p-8 text-center text-gray-500">No hay partido en curso.</div>;
  }

  // 3. Si el partido está pendiente de empezar
  if (match.status !== "live") {
    return <StartAnalysing match={match} analystSlug={analystSlug} />;
  }

  const formatLineup = (positions: LineupPosition[], teamSlug: string) => {
    const map: Record<number, LineupPosition> = {};
    positions.forEach((pos) => {
      map[pos.current_position] = {
        ...pos,
        slug_team: teamSlug,
      };
    });
    return map;
  };

  const homeLineupMap = lineups ? formatLineup(lineups.home.positions, lineups.home.slug_team) : {};

  const awayLineupMap = lineups ? formatLineup(lineups.away.positions, lineups.away.slug_team) : {};

  if (isLoadingMatch || isLoadingSet || isLoadingMatchLineups) return <LoadingFallback />;
  if (!match) return <div className="p-8 text-center text-gray-500">No se encontró el partido.</div>;

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto p-4">
      <Scoreboard matchSlug={match.slug_match} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <AnalysisCourt homeLineup={homeLineupMap} awayLineup={awayLineupMap} onPlayerClick={(player) => setSelectedPosition(player)} />
        </div>
        <div className="lg:col-span-4 h-full">
          {selectedPosition ? (
            <>
              <SubstitutionPanel
                slugLineup={
                  lineups?.home?.slug_team === selectedPosition.slug_team ? lineups.home.slug_lineup : lineups?.away?.slug_lineup || ""
                }
                selectedPosition={selectedPosition}
                allPositions={[...Object.values(homeLineupMap), ...Object.values(awayLineupMap)]}
                onSuccess={() => setSelectedPosition(null)}
              />

              <ActionPanel
                setSlug={actualSet.slug_set}
                selectedPosition={selectedPosition}
                teamLocalSlug={match.slug_team_local}
                teamVisitorSlug={match.slug_team_visitor}
                onSuccess={() => setSelectedPosition(null)}
                onFinishMatch={handleManualFinish}
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
