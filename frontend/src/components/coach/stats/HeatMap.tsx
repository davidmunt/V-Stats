import type { Stat } from "@/interfaces/stat.interface";

interface HeatMapProps {
  stats: Stat[];
  title: string;
  mode: "for" | "against";
}

const HeatMap = ({ stats, title, mode }: HeatMapProps) => {
  const isFor = mode === "for";
  const dotColor = isFor ? "bg-emerald-600" : "bg-rose-600";
  const gradientColor = isFor ? "rgba(16, 185, 129, 0.4)" : "rgba(225, 29, 72, 0.4)";

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="mb-6 flex justify-between items-center px-2">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">{title}</h3>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">{stats.length} Registros</span>
      </div>

      <div className="relative w-full aspect-[18/9] bg-orange-50 border-4 border-white rounded-[2rem] overflow-hidden shadow-inner">
        <div className="absolute left-1/2 inset-y-0 w-1 bg-slate-400/40 z-10"></div>

        {stats.map((stat, index) => (
          <div key={`point-${index}`}>
            <div
              className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                left: `${stat.end_x}%`,
                top: `${100 - stat.end_y}%`,
                background: `radial-gradient(circle, ${gradientColor} 0%, transparent 70%)`,
              }}
            />
            <div
              className={`absolute w-2 h-2 ${dotColor} rounded-full -translate-x-1/2 -translate-y-1/2 border border-white shadow-sm`}
              style={{
                left: `${stat.end_x}%`,
                top: `${100 - stat.end_y}%`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeatMap;
