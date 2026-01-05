export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  cost: number;
  estimatedDays: number;
  isFree: boolean;
  minOrderAmount?: number;
}

export interface ShippingCalculation {
  method: ShippingMethod;
  cost: number;
  estimatedDeliveryDate: string;
}




