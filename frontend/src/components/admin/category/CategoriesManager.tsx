import { useState } from "react";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";
import { CategoriesList } from "@/components/admin/category/CategoriesList";
import { CategoryForm } from "@/components/admin/category/CategoryForm";

//componente principal que controla el componente visible de las categorias
export const CategoriesManager = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedCategory, setSelectedCategory] = useState<CategoryLeague | null>(null);

  const handleCreate = () => {
    setSelectedCategory(null);
    setView("form");
  };

  const handleEdit = (category: CategoryLeague) => {
    setSelectedCategory(category);
    setView("form");
  };

  const handleBackToList = () => {
    setSelectedCategory(null);
    setView("list");
  };

  return (
    <div className="w-full min-h-[600px] transition-all duration-300 ease-in-out">
      {view === "list" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CategoriesList onCreate={handleCreate} onEdit={handleEdit} />
        </div>
      )}

      {view === "form" && (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl p-4 md:p-8 animate-in zoom-in-95 duration-300">
          <CategoryForm initialData={selectedCategory} onCancel={handleBackToList} onSuccess={handleBackToList} />
        </div>
      )}
    </div>
  );
};
