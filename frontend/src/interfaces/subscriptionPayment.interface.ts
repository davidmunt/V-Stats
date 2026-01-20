export type PaymentStatus = "SUCCEEDED" | "PENDING" | "FAILED" | "REFUNDED";

export interface SubscriptionPayment {
  id_payment: string;
  id_user: string;
  amount: number;
  currency: string;
  payment_method: string;
  stripe_payment_id: string;
  created_at: Date;
  status: PaymentStatus;
  is_active: boolean;
}
