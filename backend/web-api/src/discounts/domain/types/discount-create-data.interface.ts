export interface DiscountCreateData {
  name: string;
  percentage: number;
  description: string;
  validFrom: Date;
  validTo: Date;
}
