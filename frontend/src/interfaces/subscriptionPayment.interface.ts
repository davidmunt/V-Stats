export type PaymentStatus = "SUCCEEDED" | "PENDING" | "FAILED" | "REFUNDED";

export interface SubscriptionPayment {
  id_payment: number;
  id_user: number;
  amount: number;
  currency: string;
  payment_method: string;
  stripe_payment_id: string;
  created_at: Date;
  status: PaymentStatus;
  is_active: boolean;
}
