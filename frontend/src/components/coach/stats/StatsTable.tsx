import { useGeneralStatsTeamQuery } from "@/queries/stats/useGeneralStatsTeam";

interface StatsTableProps {
  slug_team: string;
}

export const StatsTable = ({ slug_team }: StatsTableProps) => {
  const { data: response, isLoading } = useGeneralStatsTeamQuery(slug_team);
  const statsData = response;

  if (isLoading || !statsData) return null;

  const categories = [
    { label: "Global", success: statsData.percentage_success, error: statsData.percentage_error },
    { label: "Saque", success: statsData.percentage_serve_success, error: statsData.percentage_serve_error },
    { label: "Recepción", success: statsData.percentage_reception_success, error: statsData.percentage_reception_error },
    { label: "Bloqueos", success: statsData.percentage_block_success, error: statsData.percentage_block_error },
    { label: "Ataque", success: statsData.percentage_attack_success, error: statsData.percentage_attack_error },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {categories.map((cat) => (
        <div key={cat.label} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{cat.label}</p>
            <p className="text-xl font-black text-slate-800 italic">
              {cat.success}%<span className="text-[9px] text-emerald-500 ml-1 uppercase font-bold tracking-tighter">éxito</span>
            </p>
          </div>

          <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
            <div style={{ width: `${cat.success}%` }} className="bg-emerald-500 h-full transition-all duration-700" />
            <div style={{ width: `${cat.error}%` }} className="bg-rose-500 h-full transition-all duration-700" />
          </div>
        </div>
      ))}
    </div>
  );
};
