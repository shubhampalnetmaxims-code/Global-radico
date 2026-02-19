
import { CountryCode } from './category';

export type BannerPlacement = 'Top' | 'Middle';
export type BannerStatus = 'Active' | 'Inactive';

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  link?: string;
  placement: BannerPlacement;
  countries: CountryCode[];
  isDefault: boolean;
  status: BannerStatus;
  createdAt: string;
}
