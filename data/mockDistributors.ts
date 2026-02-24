
import { Distributor } from '../types/distributor';

const STORAGE_KEY = 'radico_distributors';

export const mockDistributors: Distributor[] = [
  {
    id: 'dist-1',
    name: 'Hans Müller',
    email: 'Germany@gmail.com',
    phone: '+49 123 456789',
    address: {
      fullAddress: 'Berlin Street 123',
      state: 'Berlin',
      country: 'Germany',
      pincode: '10115'
    },
    assignedCountry: 'Germany',
    password: 'pass_germany',
    permissions: {
      canManageCategories: true,
      canManageProducts: true,
      canSetPrices: true
    },
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'dist-2',
    name: 'Rajesh Kumar',
    email: 'rajesh@radiomall.in',
    phone: '+91 98765 43210',
    address: {
      fullAddress: 'MG Road, Sector 15',
      state: 'Haryana',
      country: 'India',
      pincode: '122001'
    },
    assignedCountry: 'India',
    password: 'pass_india',
    permissions: {
      canManageCategories: false,
      canManageProducts: true,
      canSetPrices: true
    },
    status: 'active',
    createdAt: '2024-02-10T14:30:00Z'
  }
];

export const getDistributors = (): Distributor[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return mockDistributors;
};

export const saveDistributors = (distributors: Distributor[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(distributors));
};
