import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVenue } from "@/services/venue/venueService";
import type { CreateVenueParam } from "@/services/venue/venueService.param";
import type { Venue } from "@/interfaces/venue.interface";
import { VENUES_QUERY_KEY } from "@/queries/venues/useVenues";

export const useCreateVenueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVenueParam) => createVenue(data),
    onSuccess: (newVenue) => {
      queryClient.setQueryData<Venue[]>(VENUES_QUERY_KEY, (oldVenues) => {
        if (!oldVenues) return [newVenue];
        return [...oldVenues, newVenue];
      });
    },
  });
};
