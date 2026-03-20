import { useMutation } from "@tanstack/react-query";
import { createPaymentIntent } from "@/services/payment/paymentService";

export const useCreatePaymentMutation = () => {
  return useMutation({
    mutationFn: createPaymentIntent,
    onError: (error) => {
      console.error("Error al contactar con el servidor de pagos", error);
    },
  });
};
