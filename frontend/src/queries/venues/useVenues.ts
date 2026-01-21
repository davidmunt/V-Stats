import { useQuery } from "@tanstack/react-query";
import { getMyVenues } from "@/services/venue/venueService";
import type { Venue } from "@/interfaces/venue.interface";

export const VENUES_QUERY_KEY = ["venues"];

export const useVenuesQuery = () => {
  return useQuery<Venue[]>({
    queryKey: VENUES_QUERY_KEY,
    queryFn: () => getMyVenues(),
  });
};
