import type { Stat } from "@/interfaces/stat.interface";

interface HeatMapAvantagesProps {
  actions: Stat[];
  myTeamId: string;
}

export const HeatMapAvantages = ({ actions, myTeamId }: HeatMapAvantagesProps) => {
  const ofensivePoints = actions.filter((s) => s.id_point_for_team === myTeamId);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Mapa de calor puntos a favor</h3>
      </div>

      <div className="relative w-full aspect-[18/9] bg-orange-100 border-4 border-white rounded-2xl overflow-hidden shadow-inner">
        <div className="absolute left-1/2 inset-y-0 w-1.5 bg-slate-700/30 z-10"></div>
        <div className="absolute left-0 inset-y-0 w-1/2 bg-orange-200/20 pointer-events-none border-r-2 border-dashed border-white/50"></div>
        {ofensivePoints.map((stat, index) => (
          <div
            key={`heat-${index}`}
            className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              left: `${stat.end_x}%`,
              top: `${100 - stat.end_y}%`,
              background: `radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0) 70%)`,
            }}
          />
        ))}
        {ofensivePoints.map((stat, index) => (
          <div
            key={`dot-${index}`}
            className="absolute w-2 h-2 bg-red-600 rounded-full -translate-x-1/2 -translate-y-1/2 border border-white shadow-sm"
            style={{
              left: `${stat.end_x}%`,
              top: `${100 - stat.end_y}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
