import { useState } from "react";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";
import { CategoriesList } from "./CategoriesList";
import { CategoryForm } from "./CategoryForm";

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
    <div className="bg-white rounded-lg shadow-sm min-h-[500px]">
      {view === "list" && <CategoriesList onCreate={handleCreate} onEdit={handleEdit} />}
      {view === "form" && <CategoryForm initialData={selectedCategory} onCancel={handleBackToList} onSuccess={handleBackToList} />}
    </div>
  );
};
