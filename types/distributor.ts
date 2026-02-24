
export interface DistributorPermissions {
  canManageCategories: boolean;
  canManageProducts: boolean;
  canSetPrices: boolean;
}

export interface DistributorAddress {
  fullAddress: string;
  state: string;
  country: string;
  pincode: string;
}

export interface Distributor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: DistributorAddress;
  assignedCountry: string; // e.g., 'India', 'Germany'
  password: string;
  permissions: DistributorPermissions;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
}

export interface DistributorProductPrice {
  productId: string;
  newPrice: number;
  currency: string;
}
