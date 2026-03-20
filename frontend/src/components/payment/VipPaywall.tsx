import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCreatePaymentMutation } from "@/mutations/payment/usePaymentMutation";
import { CheckoutForm } from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const VipPaywall = () => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const { mutate, isPending } = useCreatePaymentMutation();

  const handleStartPayment = () => {
    mutate(undefined, {
      onSuccess: (data: { clientSecret: string }) => setClientSecret(data.clientSecret),
    });
  };

  if (!clientSecret) {
    return (
      <div className="bg-slate-900 p-12 rounded-[3rem] text-center border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-black text-white uppercase italic mb-6">Desbloquear Análisis VIP</h2>
        <button
          onClick={handleStartPayment}
          disabled={isPending}
          className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:scale-105 transition-all disabled:opacity-50"
        >
          {isPending ? "Preparando pasarela..." : "Comprar acceso por 10€"}
        </button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "flat" } }}>
      <CheckoutForm />
    </Elements>
  );
};
