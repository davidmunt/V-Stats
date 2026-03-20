import apiClient from "@/services/apiClient";
import type { Payment } from "@/interfaces/payment.interface";

export const createPaymentIntent = async (): Promise<Payment> => {
  const response = await apiClient.post<Payment>("spring", "/api/payments/create-intent", { priceId: "vip_pack_2024" });
  return response.data;
};
