import type { Stat } from "@/interfaces/stat.interface";

interface CourtTrajectoriesProps {
  stats: Stat[];
  title: string;
}

const CourtTrajectories = ({ stats, title }: CourtTrajectoriesProps) => {
  const validStats = stats?.filter((s) => !(s.start_x === 0 && s.start_y === 0 && s.end_x === 0 && s.end_y === 0)) || [];

  const getColor = (result: string) => {
    if (result === "++") return "#10b98166";
    if (result === "--") return "#ef4444";
    if (result === "+") return "#f5ff45";
    if (result === "-") return "#d97706";
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="mb-6 flex justify-between items-center px-2">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">{title}</h3>
        <div className="flex gap-3">
          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> + +
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div> +
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div> -
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
            <div className="w-2 h-2 rounded-full bg-red-500"></div> - -
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-[18/9] bg-orange-50 border-4 border-white rounded-[2rem] overflow-hidden shadow-inner">
        <div className="absolute left-1/2 inset-y-0 w-1 bg-slate-400/40 z-10 -translate-x-1/2"></div>
        <div className="absolute left-[33.33%] inset-y-0 w-0.5 bg-slate-400/20 z-10"></div>
        <div className="absolute right-[33.33%] inset-y-0 w-0.5 bg-slate-400/20 z-10"></div>
        <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" preserveAspectRatio="none">
          <defs>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b98166" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
            <marker id="arrow-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706" />
            </marker>
          </defs>

          {validStats.map((stat, index) => {
            const color = getColor(stat.result);
            const markerId = stat.result === "++" ? "url(#arrow-blue)" : stat.result === "--" ? "url(#arrow-red)" : "url(#arrow-orange)";

            return (
              <line
                key={`traj-${index}`}
                x1={`${stat.start_x}%`}
                y1={`${100 - stat.start_y}%`}
                x2={`${stat.end_x}%`}
                y2={`${100 - stat.end_y}%`}
                stroke={color}
                strokeWidth="2.5"
                opacity="0.8"
                markerEnd={markerId}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default CourtTrajectories;
