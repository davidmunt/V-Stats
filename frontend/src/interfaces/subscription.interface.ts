export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";

export interface Subscription {
  slug_subscription: string;
  slug_user: string;
  start_date: Date;
  end_date: Date;
  auto_renew: boolean;
  active: boolean;
  created_at: Date;
  status: SubscriptionStatus;
  is_active: boolean;
}
