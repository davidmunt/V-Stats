import { useState } from "react";
import type { Venue } from "@/interfaces/venue.interface";
import { VenuesList } from "./VenuesList";
import { VenueForm } from "./VenueForm";

// Componente principal que controla la vista de sedes/estadios
export const VenuesManager = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const handleCreate = () => {
    setSelectedVenue(null);
    setView("form");
  };

  const handleEdit = (venue: Venue) => {
    setSelectedVenue(venue);
    setView("form");
  };

  const handleBackToList = () => {
    setSelectedVenue(null);
    setView("list");
  };

  return (
    <div className="min-h-[600px] transition-all duration-300">
      {view === "list" && <VenuesList onCreate={handleCreate} onEdit={handleEdit} />}

      {view === "form" && (
        <div className="bg-white rounded-2xl">
          <VenueForm initialData={selectedVenue} onCancel={handleBackToList} onSuccess={handleBackToList} />
        </div>
      )}
    </div>
  );
};
