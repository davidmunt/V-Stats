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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-5xl shadow-2xl border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            {start && (
              <button
                onClick={() => setStart(null)}
                className="px-4 py-2 bg-orange-100 text-red-600 rounded-lg font-bold text-sm hover:bg-red-200 transition-all"
              >
                Reiniciar Puntos
              </button>
            )}
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* CANCHA HORIZONTAL COMPLETA */}
        <div
          onClick={handleClick}
          className="relative w-full aspect-[18/9] bg-orange-200 border-[6px] border-white rounded-xl cursor-crosshair overflow-hidden shadow-2xl mx-auto"
        >
          {/* LÍNEAS DE FONDO Y BANDAS (Decorativo) */}
          <div className="absolute inset-2 border-2 border-white/30 pointer-events-none"></div>

          {/* CAMPO PROPIO (Izquierda) */}
          <div className="absolute left-0 w-1/2 h-full border-r-4 border-white">
            {/* Línea de 3m Propia */}
            <div className="absolute right-[33%] inset-y-0 w-0.5 bg-white/40"></div>
            <span className="absolute bottom-4 left-4 text-[10px] font-black text-orange-800/40 uppercase">Mi Campo</span>
          </div>

          {/* CAMPO RIVAL (Derecha) */}
          <div className="absolute right-0 w-1/2 h-full">
            {/* Línea de 3m Rival */}
            <div className="absolute left-[33%] inset-y-0 w-0.5 bg-white/40"></div>
            <span className="absolute bottom-4 right-4 text-[10px] font-black text-orange-800/40 uppercase text-right">Campo Rival</span>
          </div>

          {/* RED CENTRAL (X = 50) */}
          <div className="absolute left-1/2 inset-y-0 w-2 bg-slate-800 z-10 flex items-center justify-center">
            <div className="h-full w-px bg-white/20"></div>
            <span className="absolute rotate-90 whitespace-nowrap bg-slate-800 text-[10px] text-white px-3 py-1 rounded-full font-black tracking-widest uppercase">
              RED
            </span>
          </div>

          {/* Trayectoria Visual (Línea entre puntos) */}
          {start && (
            <div
              className="absolute w-6 h-6 bg-blue-600 rounded-full border-4 border-white -translate-x-1/2 -translate-y-1/2 shadow-2xl z-20"
              style={{ left: `${start.x}%`, top: `${100 - start.y}%` }}
            >
              <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75"></div>
            </div>
          )}

          {/* Rejilla Táctica de Referencia */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 opacity-5 pointer-events-none">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="border border-black"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
