export interface Payment {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}
