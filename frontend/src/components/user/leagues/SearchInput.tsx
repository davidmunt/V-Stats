interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <div className="relative flex-1">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        type="text"
        className="w-full py-3 pl-10 pr-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
        placeholder="Buscar ligas por nombre..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
