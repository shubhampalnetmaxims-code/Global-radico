
import { Banner } from '../types/banner';

const STORAGE_KEY = 'radico_banners';

export const initialBanners: Banner[] = [
  {
    id: 'b1',
    imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=1200&auto=format&fit=crop',
    title: 'Shine with Rich Black',
    subtitle: 'Long-lasting black hair color',
    placement: 'Top',
    countries: ['India'],
    isDefault: false,
    status: 'Active',
    createdAt: '2023-11-01'
  },
  {
    id: 'b2',
    imageUrl: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=1200&auto=format&fit=crop',
    title: 'Bold Burgundy Look',
    subtitle: 'Trendy burgundy shades for you',
    placement: 'Top',
    countries: ['India'],
    isDefault: false,
    status: 'Active',
    createdAt: '2023-11-02'
  },
  {
    id: 'b3',
    imageUrl: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1200&auto=format&fit=crop',
    title: 'Strahlendes Kastanienbraun',
    subtitle: 'Premium Haarfarbe für natürlichen Glanz',
    placement: 'Top',
    countries: ['Germany'],
    isDefault: false,
    status: 'Active',
    createdAt: '2023-11-03'
  },
  {
    id: 'b4',
    imageUrl: 'https://images.unsplash.com/photo-1516914915975-93fee9075881?q=80&w=1200&auto=format&fit=crop',
    title: 'Platinblond Perfektion',
    subtitle: 'Salon-Qualität für zuhause',
    placement: 'Top',
    countries: ['Germany'],
    isDefault: false,
    status: 'Active',
    createdAt: '2023-11-04'
  },
  {
    id: 'b5',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13df772ec2?q=80&w=1200&auto=format&fit=crop',
    title: 'Discover Your Perfect Hair Color',
    subtitle: 'Professional hair color range',
    placement: 'Top',
    countries: ['India', 'Germany'],
    isDefault: true,
    status: 'Active',
    createdAt: '2023-10-25'
  }
];

export const getBanners = (): Banner[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return initialBanners;
};

export const saveBanners = (banners: Banner[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
};
