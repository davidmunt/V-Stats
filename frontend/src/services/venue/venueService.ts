import apiClient from "@/services/apiClient";
import type { CreateVenueParam, UpdateVenueParam } from "./venueService.param";
import type { Venue } from "@/interfaces/venue.interface";

interface VenuesResponse {
  venues: Venue[];
}

interface SingleVenueResponse {
  venue: Venue;
}

export const createVenue = async ({ name, address, city, capacity, indoor }: CreateVenueParam): Promise<Venue> => {
  const response = await apiClient.post<SingleVenueResponse>("spring", "/api/venues", {
    name,
    address,
    city,
    capacity,
    indoor,
  });
  return response.data.venue;
};

export const updateVenue = async ({ slug, name, address, city, capacity, indoor, status, is_active }: UpdateVenueParam): Promise<Venue> => {
  const response = await apiClient.put<SingleVenueResponse>("spring", `/api/venues/${slug}`, {
    name,
    address,
    city,
    capacity,
    indoor,
    status,
    is_active,
  });
  return response.data.venue;
};

export const deleteVenue = async ({ slug_venue }: { slug_venue: string }): Promise<void> => {
  await apiClient.delete<void>("spring", `/api/venues/${slug_venue}`);
};

export const getMyVenues = async (): Promise<Venue[]> => {
  const response = await apiClient.get<VenuesResponse>("spring", `/api/venues`);
  return response.data.venues;
};

export const getVenueBySlug = async (slug: string): Promise<Venue> => {
  const response = await apiClient.get<SingleVenueResponse>("spring", `/api/venues/${slug}`);
  return response.data.venue;
};
