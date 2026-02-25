import { useCategoryLeaguesQuery } from "@/queries/category/useCategories";

interface CategorySelectProps {
  value: string;
  onChange: (slug: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const { data: categories, isLoading } = useCategoryLeaguesQuery();

  return (
    <select
      className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[200px] text-gray-700 disabled:bg-gray-50"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
    >
      <option value="">Todas las categorías</option>

      {categories?.map((cat) => (
        //cambiar de slug a slug_...
        <option key={cat.slug_category} value={cat.slug_category}>
          {cat.name}
        </option>
      ))}
    </select>
  );
};
