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
    <div className="min-h-[600px] transition-all duration-300">
      {view === "list" && <CategoriesList onCreate={handleCreate} onEdit={handleEdit} />}

      {view === "form" && (
        <div className="w-full">
          <CategoryForm initialData={selectedCategory} onCancel={handleBackToList} onSuccess={handleBackToList} />
        </div>
      )}
    </div>
  );
};
