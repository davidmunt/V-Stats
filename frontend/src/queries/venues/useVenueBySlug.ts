import { useQuery } from "@tanstack/react-query";
import { getVenueBySlug } from "@/services/venue/venueService";
import type { Venue } from "@/interfaces/venue.interface";

export const VENUE_DETAIL_QUERY_KEY = (slug: string) => ["venues", "detail", slug];

export const useVenueBySlugQuery = (slug: string) => {
  return useQuery<Venue>({
    queryKey: VENUE_DETAIL_QUERY_KEY(slug),
    queryFn: () => getVenueBySlug(slug),
    enabled: !!slug,
  });
};
