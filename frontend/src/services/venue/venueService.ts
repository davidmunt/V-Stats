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
  const response = await apiClient.post<SingleVenueResponse>("/venue", {
    name,
    address,
    city,
    capacity,
    indoor,
  });
  return response.data.venue;
};

export const updateVenue = async ({ slug, name, address, city, capacity, indoor, status, is_active }: UpdateVenueParam): Promise<Venue> => {
  const response = await apiClient.put<SingleVenueResponse>(`/venue/${slug}`, {
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

export const deleteVenue = async ({ slug }: { slug: string }): Promise<void> => {
  await apiClient.delete<void>(`/venue/${slug}`);
};

export const getMyVenues = async (): Promise<Venue[]> => {
  const response = await apiClient.get<VenuesResponse>(`/venues`);
  return response.data.venues;
};

export const getVenueBySlug = async (slug: string): Promise<Venue> => {
  const response = await apiClient.get<SingleVenueResponse>(`/venue/${slug}`);
  return response.data.venue;
};
