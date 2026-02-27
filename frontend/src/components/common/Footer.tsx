import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/2.png" alt="Logo" className="h-8 w-auto grayscale opacity-70" />
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Plataforma de análisis avanzado para entrenadores y analistas de voleibol profesional.
          </p>
        </div>

        <div className="flex flex-col md:items-center gap-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Desarrollado por</h4>
          <span className="text-lg font-bold text-slate-800">
            David <span className="text-blue-600">Muntean</span>
          </span>
          <div className="h-px w-12 bg-blue-200 my-2"></div>
          <p className="text-xs font-medium text-gray-400">Proyecto Final 2º DAW • 2026</p>
        </div>

        <div className="flex flex-col md:items-end gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Tecnologías</p>
            <p className="text-xs text-gray-400 mt-1">React • FastAPI • Spring Boot</p>
          </div>
          <p className="text-[10px] text-gray-400 text-right leading-tight max-w-[180px]">Inspirado en Thinkster.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-200/50">
        <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-[0.4em]">
          &copy; {new Date().getFullYear()} V-Stats — Visual Statistics Analysis
        </p>
      </div>
    </footer>
  );
};

export default Footer;
