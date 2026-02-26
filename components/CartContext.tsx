import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, User, Address, Order } from '../types/ecommerce';
import { CountryCode } from '../types/category';
import { Language } from './SiteHeader';

interface CountryData {
  cart: CartItem[];
  user: User | null;
  addresses: Address[];
  orders: Order[];
  language: Language;
}

interface CartContextType {
  // Current country data accessors
  cart: CartItem[];
  user: User | null;
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [country, setCountryState] = useState<CountryCode>(() => {
    return (localStorage.getItem('radico_current_country') as CountryCode) || 'India';
  });

  const [allData, setAllData] = useState<Record<CountryCode, CountryData>>(() => {
    const saved = localStorage.getItem('radico_multi_country_data');
    if (saved) return JSON.parse(saved);
    return {
      India: { cart: [], user: null, addresses: [], orders: [], language: 'EN' },
      Germany: { cart: [], user: null, addresses: [], orders: [], language: 'DE' }
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
    addresses: [], 
    orders: [], 
    language: country === 'Germany' ? 'DE' : 'EN' 
  };

  const updateCurrentData = useCallback((updates: Partial<CountryData>) => {
    setAllData(prev => {
      const existing = prev[country] || { 
        cart: [], 
        user: null, 
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
      const countryData = prev[country] || { cart: [], user: null, addresses: [], orders: [], language: 'EN' };
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
      const countryData = prev[country] || { cart: [], user: null, addresses: [], orders: [], language: 'EN' };
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
      const countryData = prev[country] || { cart: [], user: null, addresses: [], orders: [], language: 'EN' };
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
      addresses: currentData.addresses,
      orders: currentData.orders,
      language: currentData.language,
      country,
      addToCart, removeFromCart, updateQuantity, clearCart,
      login, logout,
      addAddress, updateAddress, deleteAddress,
      addOrder,
      setCountry, setLanguage
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
