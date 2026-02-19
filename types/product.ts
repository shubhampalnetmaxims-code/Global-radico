
import { CountryCode } from './category';

export interface ProductPrice {
  country: CountryCode;
  amount: number;
  currency: string;
}

export type ProductStatus = 'Active' | 'Inactive';

export interface Product {
  id: string;
  name: string;
  name_de?: string;
  description: string;
  description_de?: string;
  categoryId: string;
  images: string[];
  status: ProductStatus;
  countries: CountryCode[];
  prices: ProductPrice[];
  createdAt: string;
  stock: number; // Added stock property
  
  // FAQ fields
  howToUse?: string;
  howToUse_de?: string;
  whatsInside?: string;
  whatsInside_de?: string;
  ingredients?: string;
  ingredients_de?: string;
  benefits?: string;
  benefits_de?: string;
}
