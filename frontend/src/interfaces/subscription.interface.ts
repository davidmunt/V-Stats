export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";

export interface Subscription {
  id_subscription: string;
  id_user: string;
  start_date: Date;
  end_date: Date;
  auto_renew: boolean;
  active: boolean;
  created_at: Date;
  status: SubscriptionStatus;
  is_active: boolean;
}
