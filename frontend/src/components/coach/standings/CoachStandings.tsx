import { LeagueTable } from "@/components/admin/league/LeagueTable";

interface CoachStandingsProps {
  leagueSlug: string;
}

export const CoachStandings = ({ leagueSlug }: CoachStandingsProps) => {
  if (!leagueSlug) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
        Cargando información de la liga...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <LeagueTable leagueSlug={leagueSlug} />
    </div>
  );
};
