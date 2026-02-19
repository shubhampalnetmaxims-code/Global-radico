
import { Category } from '../types/category';

const STORAGE_KEY = 'radico_categories';

export const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Organic Hair Colour',
    name_de: 'Bio-Haarfarbe',
    countries: ['India', 'Germany'],
    status: 'Active',
    createdAt: '2023-10-01',
    description: 'Natural and organic hair colouring solutions for vibrant results.',
    description_de: 'Natürliche und biologische Haarfarben für lebendige Ergebnisse.'
  },
  {
    id: '2',
    name: 'Hair Treatment',
    name_de: 'Haarpflege & Kuren',
    countries: ['India', 'Germany'],
    status: 'Active',
    createdAt: '2023-10-02',
    description: 'Revitalize and protect your hair with our professional organic treatments.',
    description_de: 'Revitalisieren und schützen Sie Ihr Haar mit unseren professionellen Bio-Behandlungen.'
  },
  {
    id: '3',
    name: 'Sunab Organic Hair Colour',
    name_de: 'Sunab Bio-Haarfarbe',
    countries: ['India', 'Germany'],
    status: 'Active',
    createdAt: '2023-10-03',
    description: 'Premium certified organic hair colour by Sunab.',
    description_de: 'Premium-zertifizierte Bio-Haarfarbe von Sunab.'
  }
];

export const getCategories = (): Category[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return initialCategories;
};

export const saveCategories = (categories: Category[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};
