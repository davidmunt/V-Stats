import { useState } from "react";

interface CoordinatePickerProps {
  onComplete: (coords: { start_x: number; start_y: number; end_x: number; end_y: number }) => void;
  onCancel: () => void;
}

export const CoordinatePicker = ({ onComplete, onCancel }: CoordinatePickerProps) => {
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round((1 - (e.clientY - rect.top) / rect.height) * 100);

    if (!start) {
      setStart({ x, y });
    } else {
      onComplete({
        start_x: start.x,
        start_y: start.y,
        end_x: x,
        end_y: y,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] p-10 w-full max-w-6xl shadow-2xl border border-white/10 flex flex-col gap-8">
        <div className="flex justify-between items-end border-b border-slate-100 pb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">GEOLOCALIZACIÓN DE ACCIÓN</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Precisión táctica sobre el terreno de juego</p>
          </div>
          <div className="flex gap-3">
            {start && (
              <button
                onClick={() => setStart(null)}
                className="px-6 py-2.5 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all"
              >
                Resetear Trayectoria
              </button>
            )}
            <button
              onClick={onCancel}
              className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Cerrar Analizador
            </button>
          </div>
        </div>

        <div
          onClick={handleClick}
          className="relative w-full aspect-[18/9] bg-slate-50 border-[12px] border-white rounded-[2rem] cursor-crosshair overflow-hidden shadow-2xl mx-auto ring-1 ring-slate-200"
        >
          <div className="absolute left-1/2 inset-y-0 w-3 bg-slate-900 z-10 flex items-center justify-center shadow-2xl">
            <div className="h-full w-px bg-white/20"></div>
            <span className="absolute rotate-90 whitespace-nowrap bg-slate-900 text-[10px] text-white px-5 py-1.5 rounded-full font-black tracking-[0.4em] uppercase">
              NET
            </span>
          </div>

          <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 opacity-10 pointer-events-none">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="border border-slate-400"></div>
            ))}
          </div>

          <div className="absolute inset-0 flex justify-between p-8 pointer-events-none">
            <span className="self-end text-[10px] font-black text-slate-200 uppercase tracking-[0.5em]">LADO — LOCAL</span>
            <span className="self-end text-[10px] font-black text-slate-200 uppercase tracking-[0.5em]">LADO — RIVAL</span>
          </div>

          {start && (
            <div
              className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: `${start.x}%`, top: `${100 - start.y}%` }}
            >
              <div className="absolute inset-0 rounded-full bg-blue-600/20 animate-ping"></div>
              <div className="absolute inset-2 bg-blue-600 rounded-full border-4 border-white shadow-2xl shadow-blue-500/50 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
