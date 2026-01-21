export interface CreateVenueParam {
  name: string;
  address: string;
  city: string;
  capacity: number;
  indoor: boolean;
}

export interface UpdateVenueParam {
  slug: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  indoor: boolean;
  status: string;
  is_active: boolean;
}
