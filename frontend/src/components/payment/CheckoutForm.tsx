import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { useState } from "react";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      Swal.fire({
        title: "Error en el pago",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      Swal.fire({
        title: "¡Pago Realizado!",
        text: "Ahora tienes acceso a todas las funciones VIP.",
        icon: "success",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#1e293b",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload();
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-4 rounded-2xl border border-slate-200">
        <PaymentElement />
      </div>
      <button
        disabled={isProcessing || !stripe}
        className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50"
      >
        {isProcessing ? "Procesando..." : "PAGAR AHORA"}
      </button>
    </form>
  );
};
