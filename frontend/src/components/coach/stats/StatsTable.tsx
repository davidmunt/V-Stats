import type { Stat } from "@/interfaces/stat.interface";

interface StatsTableProps {
  actions: Stat[];
  myTeamId: string;
}

interface ActionSummary {
  total: number;
  points: number;
  errors: number;
  efficiency: number;
}

export const StatsTable = ({ actions, myTeamId }: StatsTableProps) => {
  const getSummaryByAction = (type: string): ActionSummary => {
    const filtered = actions.filter((a) => a.action_type.toLowerCase() === type.toLowerCase());
    const total = filtered.length;
    if (total === 0) return { total: 0, points: 0, errors: 0, efficiency: 0 };

    const points = filtered.filter((a) => a.id_point_for_team === myTeamId).length;
    const errors = filtered.filter((a) => a.id_point_for_team !== myTeamId && a.id_point_for_team !== null).length;

    return {
      total,
      points,
      errors,
      efficiency: Math.round((points / total) * 100),
    };
  };

  const actionTypes = ["SERVE", "ATTACK", "BLOCK", "RECEPTION"];

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Resumen tactico de acciones</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-4 font-black text-[10px] text-gray-400 uppercase tracking-widest">Acción</th>
              <th className="pb-4 font-black text-[10px] text-gray-400 uppercase tracking-widest text-center">Total</th>
              <th className="pb-4 font-black text-[10px] text-gray-400 uppercase tracking-widest text-center">Puntos (++)</th>
              <th className="pb-4 font-black text-[10px] text-gray-400 uppercase tracking-widest text-center">Errores (--)</th>
              <th className="pb-4 font-black text-[10px] text-gray-400 uppercase tracking-widest text-right">Efectividad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {actionTypes.map((type) => {
              const summary = getSummaryByAction(type);
              return (
                <tr key={type} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-bold text-slate-700">{type}</td>
                  <td className="py-4 text-center font-medium text-slate-600">{summary.total}</td>
                  <td className="py-4 text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">+{summary.points}</span>
                  </td>
                  <td className="py-4 text-center">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-bold">-{summary.errors}</span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: `${summary.efficiency}%` }}></div>
                      </div>
                      <span className="font-black text-blue-600 text-sm w-10">{summary.efficiency}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Ef. Global</p>
          <p className="text-xl font-black text-slate-800">
            {actions.length > 0 ? Math.round((actions.filter((a) => a.id_point_for_team === myTeamId).length / actions.length) * 100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};
