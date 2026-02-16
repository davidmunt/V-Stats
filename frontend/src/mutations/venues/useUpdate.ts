import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVenue } from "@/services/venue/venueService";
import type { UpdateVenueParam } from "@/services/venue/venueService.param";
import type { Venue } from "@/interfaces/venue.interface";
import { VENUES_QUERY_KEY } from "@/queries/venues/useVenues";

export const useUpdateVenueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateVenueParam) => updateVenue(data),
    onSuccess: (updatedVenue) => {
      queryClient.setQueryData<Venue[]>(VENUES_QUERY_KEY, (oldVenues) => {
        if (!oldVenues) return [updatedVenue];
        return oldVenues.map((venue) => (venue.slug_venue === updatedVenue.slug_venue ? updatedVenue : venue));
      });
    },
  });
};
