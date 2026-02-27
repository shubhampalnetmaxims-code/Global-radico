import { Product } from './product';
import { CountryCode } from './category';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  currency: string;
}

export interface User {
  id: string;
  mobile: string;
  name?: string;
  email?: string;
  countryCode: string;
}

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  isDefault: boolean;
}

export type OrderStatus = 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  address: Address;
  paymentMethod: string;
  status: OrderStatus;
  date: string;
}
