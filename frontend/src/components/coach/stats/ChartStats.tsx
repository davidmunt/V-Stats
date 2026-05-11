import type { chartStat } from "@/interfaces/stat.interface";

interface ChartStatsProps {
  stats?: chartStat | null;
  title: string;
  subtitle?: string;
}

const ACTIONS = [
  { key: "serve", label: "Saque", accent: "sky" },
  { key: "attack", label: "Ataque", accent: "amber" },
  { key: "block", label: "Bloqueo", accent: "emerald" },
  { key: "reception", label: "Recepción", accent: "rose" },
  { key: "colocacion", label: "Colocación", accent: "cyan" },
  { key: "defensa", label: "Defensa", accent: "slate" },
] as const;

type ActionKey = (typeof ACTIONS)[number]["key"];

const RESULTS = [
  { key: "double_plus", label: "++" },
  { key: "plus", label: "+" },
  { key: "minus", label: "-" },
  { key: "double_minus", label: "--" },
] as const;

type ResultKey = (typeof RESULTS)[number]["key"];

const ACCENT_STYLES: Record<string, { border: string; badge: string; chip: string }> = {
  sky: { border: "border-sky-200", badge: "bg-sky-50 text-sky-700", chip: "bg-sky-500" },
  amber: { border: "border-amber-200", badge: "bg-amber-50 text-amber-700", chip: "bg-amber-500" },
  emerald: { border: "border-emerald-200", badge: "bg-emerald-50 text-emerald-700", chip: "bg-emerald-500" },
  rose: { border: "border-rose-200", badge: "bg-rose-50 text-rose-700", chip: "bg-rose-500" },
  cyan: { border: "border-cyan-200", badge: "bg-cyan-50 text-cyan-700", chip: "bg-cyan-500" },
  slate: { border: "border-slate-200", badge: "bg-slate-100 text-slate-700", chip: "bg-slate-500" },
};

const RESULT_STYLES: Record<ResultKey, { label: string; text: string; track: string; bar: string }> = {
  double_plus: { label: "++", text: "text-emerald-700", track: "bg-emerald-50", bar: "bg-emerald-500" },
  plus: { label: "+", text: "text-yellow-700", track: "bg-yellow-50", bar: "bg-yellow-400" },
  minus: { label: "-", text: "text-orange-700", track: "bg-orange-50", bar: "bg-orange-500" },
  double_minus: { label: "--", text: "text-rose-700", track: "bg-rose-50", bar: "bg-rose-500" },
};

const formatPercentage = (value: number) => `${Math.round(value * 10) / 10}%`;

const getActionValue = (stats: chartStat, action: ActionKey, result: ResultKey) => {
  const key = `percentage_${action}_${result}` as keyof chartStat;
  return Number(stats[key] ?? 0);
};

const ChartStats = ({ stats, title, subtitle }: ChartStatsProps) => {
  const safeStats = stats ?? ({} as chartStat);

  const rows = ACTIONS.map((action) => {
    const values = RESULTS.map((result) => ({
      key: result.key,
      label: result.label,
      value: getActionValue(safeStats, action.key, result.key),
    }));

    return { action, values };
  });

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">{title}</h3>
          {subtitle && <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          {RESULTS.map((result) => {
            const styles = RESULT_STYLES[result.key];
            return (
              <span
                key={result.key}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${styles.text} ${styles.track}`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${styles.bar}`} />
                {styles.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-slate-50/80">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-100/90">
              <th className="sticky left-0 z-10 bg-slate-100/90 px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                Acción
              </th>
              {RESULTS.map((result) => {
                const styles = RESULT_STYLES[result.key];
                return (
                  <th
                    key={result.key}
                    className={`px-4 py-4 text-center text-[10px] font-black uppercase tracking-[0.25em] ${styles.text}`}
                  >
                    {styles.label}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rows.map(({ action, values }) => {
              const accentStyles = ACCENT_STYLES[action.accent];

              return (
                <tr key={action.key} className="border-t border-slate-200 odd:bg-white even:bg-slate-50/60">
                  <td className="sticky left-0 z-10 bg-inherit px-5 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <span className={`h-3.5 w-3.5 rounded-full ${accentStyles.chip}`} />
                      <div>
                        <p
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${accentStyles.badge}`}
                        >
                          {action.label}
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Distribución por resultado</p>
                      </div>
                    </div>
                  </td>

                  {values.map((item) => {
                    const resultStyles = RESULT_STYLES[item.key];
                    const width = Math.min(Math.max(item.value, 0), 100);

                    return (
                      <td key={`${action.key}-${item.key}`} className="px-4 py-4 align-middle">
                        <div className={`rounded-2xl border ${resultStyles.track} px-3 py-3 text-center shadow-sm`}>
                          <p className={`text-sm font-black ${resultStyles.text}`}>{formatPercentage(item.value)}</p>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/70">
                            <div className={`h-full rounded-full ${resultStyles.bar}`} style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChartStats;
