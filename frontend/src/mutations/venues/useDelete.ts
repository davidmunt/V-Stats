import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVenue } from "@/services/venue/venueService";
import type { Venue } from "@/interfaces/venue.interface";
import { VENUES_QUERY_KEY } from "@/queries/venues/useVenues";

export const useDeleteVenueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { slug: string }) => deleteVenue(data),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Venue[]>(VENUES_QUERY_KEY, (oldVenues) => {
        if (!oldVenues) return [];
        return oldVenues.filter((venue) => venue.slug !== variables.slug);
      });
    },
  });
};
