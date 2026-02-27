import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, User, Address, Order } from '../types/ecommerce';
import { CountryCode } from '../types/category';
import { Language } from './SiteHeader';

interface CountryData {
  cart: CartItem[];
  user: User | null;
  users: User[];
  addresses: Address[];
  orders: Order[];
  language: Language;
}

interface CartContextType {
  // Current country data accessors
  cart: CartItem[];
  user: User | null;
  users: User[];
  addresses: Address[];
  orders: Order[];
  language: Language;
  country: CountryCode;
  
  // Actions (they will operate on the current country)
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  login: (user: User) => void;
  logout: () => void;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  addOrder: (order: Order) => void;
  setCountry: (country: CountryCode) => void;
  setLanguage: (lang: Language) => void;
  allData: Record<CountryCode, CountryData>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [country, setCountryState] = useState<CountryCode>(() => {
    return (localStorage.getItem('radico_current_country') as CountryCode) || 'India';
  });

  const [allData, setAllData] = useState<Record<CountryCode, CountryData>>(() => {
    const saved = localStorage.getItem('radico_multi_country_data');
    if (saved) return JSON.parse(saved);

    // Enhanced mock data
    const mockProducts = [
      { id: '1', name: 'Organic Henna', images: ['/placeholder.jpg'], categoryId: 'Hair' },
      { id: '2', name: 'Natural Indigo Powder', images: ['/placeholder.jpg'], categoryId: 'Hair' },
      { id: '3', name: 'Herbal Shampoo', images: ['/placeholder.jpg'], categoryId: 'Hair' },
    ];

    const mockIndiaAddress1 = {
      id: 'addr-in-1', fullName: 'Priya Sharma', addressLine1: '123, MG Road', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001', country: 'India', mobile: '9876543210', isDefault: true
    };
    const mockIndiaAddress2 = {
      id: 'addr-in-2', fullName: 'Rahul Verma', addressLine1: '456, SV Road', city: 'Delhi', state: 'Delhi', postalCode: '110001', country: 'India', mobile: '9876543211', isDefault: false
    };
    const mockGermanyAddress1 = {
      id: 'addr-de-1', fullName: 'Klaus Müller', addressLine1: 'Musterstraße 45', city: 'Berlin', state: 'Berlin', postalCode: '10115', country: 'Germany', mobile: '015123456789', isDefault: true
    };
    const mockGermanyAddress2 = {
      id: 'addr-de-2', fullName: 'Anna Schmidt', addressLine1: 'Hauptstraße 10', city: 'Munich', state: 'Bavaria', postalCode: '80331', country: 'Germany', mobile: '015123456780', isDefault: false
    };

    const mockIndiaUsers: User[] = [
      { id: 'user-in-1', name: 'Priya Sharma', mobile: '+919876543210', countryCode: 'India' },
      { id: 'user-in-2', name: 'Rahul Verma', mobile: '+919876543211', countryCode: 'India' },
      { id: 'user-in-3', name: 'Amit Kumar', mobile: '+919876543212', countryCode: 'India' }
    ];

    const mockGermanyUsers: User[] = [
      { id: 'user-de-1', name: 'Klaus Müller', mobile: '+4915123456789', countryCode: 'Germany' },
      { id: 'user-de-2', name: 'Anna Schmidt', mobile: '+4915123456780', countryCode: 'Germany' },
      { id: 'user-de-3', name: 'Lukas Weber', mobile: '+4915123456781', countryCode: 'Germany' }
    ];

    return {
      India: {
        cart: [],
        user: mockIndiaUsers[0],
        users: mockIndiaUsers,
        addresses: [mockIndiaAddress1, mockIndiaAddress2],
        orders: [
          {
            id: 'ORD-IN-001', userId: 'user-in-1', items: [{ productId: '1', quantity: 2, price: 500, currency: 'INR', product: mockProducts[0] }],
            total: 1180, subtotal: 1000, tax: 180, currency: 'INR', address: mockIndiaAddress1, paymentMethod: 'Razorpay', status: 'Delivered', date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
          },
          {
            id: 'ORD-IN-002', userId: 'user-in-1', items: [{ productId: '2', quantity: 1, price: 700, currency: 'INR', product: mockProducts[1] }],
            total: 826, subtotal: 700, tax: 126, currency: 'INR', address: mockIndiaAddress1, paymentMethod: 'Razorpay', status: 'Processing', date: new Date().toISOString()
          },
          {
            id: 'ORD-IN-003', userId: 'user-in-1', items: [{ productId: '3', quantity: 1, price: 650, currency: 'INR', product: mockProducts[2] }, { productId: '1', quantity: 1, price: 500, currency: 'INR', product: mockProducts[0] }],
            total: 1357, subtotal: 1150, tax: 207, currency: 'INR', address: mockIndiaAddress1, paymentMethod: 'Razorpay', status: 'Paid', date: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
          },
          {
            id: 'ORD-IN-004', userId: 'user-in-2', items: [{ productId: '1', quantity: 1, price: 500, currency: 'INR', product: mockProducts[0] }],
            total: 590, subtotal: 500, tax: 90, currency: 'INR', address: mockIndiaAddress2, paymentMethod: 'Razorpay', status: 'Delivered', date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
          },
          {
            id: 'ORD-IN-005', userId: 'user-in-3', items: [{ productId: '2', quantity: 3, price: 700, currency: 'INR', product: mockProducts[1] }],
            total: 2478, subtotal: 2100, tax: 378, currency: 'INR', address: mockIndiaAddress1, paymentMethod: 'Razorpay', status: 'Shipped', date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
          }
        ],
        language: 'EN'
      },
      Germany: {
        cart: [],
        user: mockGermanyUsers[0],
        users: mockGermanyUsers,
        addresses: [mockGermanyAddress1, mockGermanyAddress2],
        orders: [
          {
            id: 'ORD-DE-001', userId: 'user-de-1', items: [{ productId: '3', quantity: 3, price: 15, currency: 'EUR', product: mockProducts[2] }],
            total: 53.1, subtotal: 45, tax: 8.1, currency: 'EUR', address: mockGermanyAddress1, paymentMethod: 'Stripe', status: 'Shipped', date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
          },
          {
            id: 'ORD-DE-002', userId: 'user-de-1', items: [{ productId: '1', quantity: 1, price: 12, currency: 'EUR', product: mockProducts[0] }, { productId: '2', quantity: 1, price: 18, currency: 'EUR', product: mockProducts[1] }],
            total: 35.4, subtotal: 30, tax: 5.4, currency: 'EUR', address: mockGermanyAddress1, paymentMethod: 'Stripe', status: 'Delivered', date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
          },
          {
            id: 'ORD-DE-003', userId: 'user-de-2', items: [{ productId: '2', quantity: 2, price: 18, currency: 'EUR', product: mockProducts[1] }],
            total: 42.48, subtotal: 36, tax: 6.48, currency: 'EUR', address: mockGermanyAddress2, paymentMethod: 'Stripe', status: 'Paid', date: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString()
          },
          {
            id: 'ORD-DE-004', userId: 'user-de-3', items: [{ productId: '1', quantity: 4, price: 12, currency: 'EUR', product: mockProducts[0] }],
            total: 56.64, subtotal: 48, tax: 8.64, currency: 'EUR', address: mockGermanyAddress1, paymentMethod: 'Stripe', status: 'Processing', date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
          }
        ],
        language: 'DE'
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('radico_current_country', country);
  }, [country]);

  useEffect(() => {
    localStorage.setItem('radico_multi_country_data', JSON.stringify(allData));
  }, [allData]);

  const currentData = allData[country] || { 
    cart: [], 
    user: null, 
    users: [],
    addresses: [], 
    orders: [], 
    language: country === 'Germany' ? 'DE' : 'EN' 
  };

  const updateCurrentData = useCallback((updates: Partial<CountryData>) => {
    setAllData(prev => {
      const existing = prev[country] || { 
        cart: [], 
        user: null, 
        users: [],
        addresses: [], 
        orders: [], 
        language: country === 'Germany' ? 'DE' : 'EN' 
      };
      return {
        ...prev,
        [country]: { ...existing, ...updates }
      };
    });
  }, [country]);

  const addToCart = useCallback((item: CartItem) => {
    setAllData(prev => {
      const countryData = prev[country] || { cart: [], user: null, users: [], addresses: [], orders: [], language: 'EN' };
      const prevCart = countryData.cart;
      const existing = prevCart.find(i => i.productId === item.productId);
      let newCart;
      if (existing) {
        newCart = prevCart.map(i => i.productId === item.productId 
          ? { ...i, quantity: i.quantity + item.quantity } 
          : i
        );
      } else {
        newCart = [...prevCart, item];
      }
      return {
        ...prev,
        [country]: { ...countryData, cart: newCart }
      };
    });
  }, [country]);

  const removeFromCart = useCallback((productId: string) => {
    updateCurrentData({ cart: currentData.cart.filter(i => i.productId !== productId) });
  }, [updateCurrentData, currentData.cart]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    updateCurrentData({ cart: currentData.cart.map(i => i.productId === productId ? { ...i, quantity } : i) });
  }, [updateCurrentData, currentData.cart, removeFromCart]);

  const clearCart = useCallback(() => updateCurrentData({ cart: [] }), [updateCurrentData]);

  const login = useCallback((userData: User) => updateCurrentData({ user: userData }), [updateCurrentData]);
  const logout = useCallback(() => updateCurrentData({ user: null }), [updateCurrentData]);

  const addAddress = useCallback((address: Address) => {
    setAllData(prev => {
      const countryData = prev[country] || { cart: [], user: null, users: [], addresses: [], orders: [], language: 'EN' };
      const prevAddresses = countryData.addresses;
      let newAddresses;
      if (address.isDefault) {
        newAddresses = [...prevAddresses.map(a => ({ ...a, isDefault: false })), address];
      } else {
        newAddresses = [...prevAddresses, address];
      }
      return {
        ...prev,
        [country]: { ...countryData, addresses: newAddresses }
      };
    });
  }, [country]);

  const updateAddress = useCallback((address: Address) => {
    updateCurrentData({ addresses: currentData.addresses.map(a => a.id === address.id ? address : a) });
  }, [updateCurrentData, currentData.addresses]);

  const deleteAddress = useCallback((id: string) => {
    updateCurrentData({ addresses: currentData.addresses.filter(a => a.id !== id) });
  }, [updateCurrentData, currentData.addresses]);

  const addOrder = useCallback((order: Order) => {
    setAllData(prev => {
      const countryData = prev[country] || { cart: [], user: null, users: [], addresses: [], orders: [], language: 'EN' };
      return {
        ...prev,
        [country]: { 
          ...countryData,
          orders: [order, ...countryData.orders],
          cart: [] 
        }
      };
    });
  }, [country]);

  const setLanguage = useCallback((lang: Language) => updateCurrentData({ language: lang }), [updateCurrentData]);

  const setCountry = useCallback((newCountry: CountryCode) => {
    setCountryState(newCountry);
  }, []);

  return (
    <CartContext.Provider value={{ 
      cart: currentData.cart,
      user: currentData.user,
      users: currentData.users,
      addresses: currentData.addresses,
      orders: currentData.orders,
      language: currentData.language,
      country,
      addToCart, removeFromCart, updateQuantity, clearCart,
      login, logout,
      addAddress, updateAddress, deleteAddress,
      addOrder,
      setCountry, setLanguage,
      allData
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
