
export type CountryCode = 'India' | 'Germany';

export interface Category {
  id: string;
  name: string;
  name_de?: string; // German translation
  image?: string;
  description?: string;
  description_de?: string; // German translation
  countries: CountryCode[];
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export const AVAILABLE_COUNTRIES: CountryCode[] = ['India' as const, 'Germany' as const];
