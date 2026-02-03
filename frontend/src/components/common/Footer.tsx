import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="text-2xl font-black text-blue-600 uppercase tracking-tighter flex items-center gap-2">
            V-STATS
          </Link>
          <p className="text-gray-400 text-xs font-medium mt-1">Análisis avanzado de voleibol</p>
        </div>

        <div className="text-center md:text-right">
          <span className="block text-sm font-bold text-slate-800">
            Hecho por <span className="text-blue-600">David Muntean</span>
          </span>
          <span className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">Proyecto Final 2º DAW • 2026</span>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <span className="text-[10px] text-gray-400 max-w-[200px] md:text-right leading-tight">
            Inspirado en Thinkster. Código y diseño bajo licencia MIT.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-gray-50 text-center">
        <p className="text-[10px] text-gray-300 font-medium uppercase tracking-[0.3em]">V-Stats &copy; Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
