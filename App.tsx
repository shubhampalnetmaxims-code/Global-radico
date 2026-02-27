
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import UnderDevelopment from './pages/UnderDevelopment';
import WebsitePage from './pages/WebsitePage';
import StoreCategoryPage from './pages/StoreCategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminCategoryPage from './pages/AdminCategoryPage';
import AdminBannerPage from './pages/AdminBannerPage';
import AdminProductPage from './pages/AdminProductPage';
import AdminDistributorPage from './pages/AdminDistributorPage';
import DistributorDashboard from './pages/DistributorDashboard';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import { useParams } from 'react-router-dom';
import DistributorLayout from './components/DistributorLayout';
import { CartProvider } from './components/CartContext';
import CartPage from './pages/CartPage';
import UserLoginPage from './pages/UserLoginPage';
import AddressManagementPage from './pages/AddressManagementPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import InvoicePage from './pages/InvoicePage';
import DistributorOrders from './pages/DistributorOrders';
import SuperAdminUsers from './pages/SuperAdminUsers';
import DistributorUsers from './pages/DistributorUsers';

import SuperAdminOrders from './pages/SuperAdminOrders';

const DistributorSessionWrapper: React.FC = () => {
  const { countryCode, tab } = useParams<{ countryCode: string; tab?: string }>();
  const sessionStr = localStorage.getItem('distributor_session');
  
  if (!sessionStr) {
    return <Navigate to="/distributor/login" replace />;
  }

  const session = JSON.parse(sessionStr);
  const country = countryCode?.charAt(0).toUpperCase() + countryCode?.slice(1).toLowerCase();

  // If the URL country doesn't match session country, redirect to correct one
  if (country !== session.country) {
    return <Navigate to={`/distributor/${session.country.toLowerCase()}/overview`} replace />;
  }

  if (!tab) {
    return <Navigate to={`/distributor/${countryCode}/overview`} replace />;
  }

  return <DistributorDashboard country={session.country} distributorEmail={session.email} />;
};

import { Outlet } from 'react-router-dom';
import { useCart } from './components/CartContext';
import { useEffect } from 'react';
import { CountryCode } from './types/category';

const CountryContextManager: React.FC<{ country: CountryCode }> = ({ country }) => {
  const { setCountry, country: currentCountry } = useCart();
  
  useEffect(() => {
    if (currentCountry !== country) {
      setCountry(country);
    }
  }, [country, currentCountry, setCountry]);

  // Prevent rendering children until the context country matches the route country
  // This avoids child components (like WebsitePage) from calling actions (like setLanguage)
  // on the "wrong" country's state during the transition.
  if (currentCountry !== country) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-xl" />
          <div className="h-2 w-24 bg-slate-50 rounded" />
        </div>
      </div>
    );
  }

  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <HashRouter>
        <Routes>
        <Route path="/" element={<Layout showNavbar={false}><LandingPage /></Layout>} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/login" 
          element={
            <Layout>
              <LoginPage 
                title="Admin Login" 
                fields={[{ name: 'username', label: 'Email', type: 'text' }, { name: 'password', label: 'Password', type: 'password' }]} 
                redirectPath="/admin/categories" 
                validUser="Radico@gmail.com"
                validPass="!@#$%^"
                loginType="admin"
              />
            </Layout>
          } 
        />
        <Route 
          path="/admin/dev" 
          element={
            <AdminLayout>
              <UnderDevelopment 
                title="Admin Panel" 
                subtitle="General dashboard stats are currently under development." 
              />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/categories" 
          element={
            <AdminLayout>
              <AdminCategoryPage />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <AdminLayout>
              <AdminProductPage />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/banners" 
          element={
            <AdminLayout>
              <AdminBannerPage />
            </AdminLayout>
          } 
        />
          <Route 
          path="/admin/orders" 
          element={
            <AdminLayout>
              <SuperAdminOrders />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/distributors" 
          element={
            <AdminLayout>
              <AdminDistributorPage />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <AdminLayout>
              <SuperAdminUsers />
            </AdminLayout>
          } 
        />

        {/* India Website Routes */}
        <Route path="/website-india" element={<CountryContextManager country="India" />}>
          <Route index element={<WebsitePage key="india" siteTitle="India Website" initialLanguage="EN" />} />
          <Route path="category/:id" element={<StoreCategoryPage key="india-cat" country="India" initialLanguage="EN" />} />
          <Route path="product/:productId" element={<ProductDetailPage key="india-prod" country="India" initialLanguage="EN" />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<UserLoginPage />} />
          <Route path="address" element={<AddressManagementPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<ProfilePage />} />
          <Route path="invoice" element={<InvoicePage />} />
        </Route>

        {/* Germany Website Routes */}
        <Route path="/website-germany" element={<CountryContextManager country="Germany" />}>
          <Route index element={<WebsitePage key="germany" siteTitle="Germany Website" initialLanguage="DE" isGermany={true} />} />
          <Route path="category/:id" element={<StoreCategoryPage key="germany-cat" country="Germany" initialLanguage="DE" />} />
          <Route path="product/:productId" element={<ProductDetailPage key="germany-prod" country="Germany" initialLanguage="DE" />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<UserLoginPage />} />
          <Route path="address" element={<AddressManagementPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<ProfilePage />} />
          <Route path="invoice" element={<InvoicePage />} />
        </Route>

        {/* Distributor Routes */}
        <Route 
          path="/distributor/login" 
          element={
            <Layout>
              <LoginPage 
                title="Distributor Login" 
                fields={[{ name: 'distributorId', label: 'Email/ID', type: 'text' }, { name: 'password', label: 'Password', type: 'password' }]} 
                redirectPath="/distributor/india" 
                loginType="distributor"
              />
            </Layout>
          } 
        />
        <Route 
          path="/distributor/germany/orders" 
          element={<DistributorLayout distributorName="Germany Distributor" country="Germany"><DistributorOrders /></DistributorLayout>} 
        />
        <Route 
          path="/distributor/germany/users" 
          element={<DistributorLayout distributorName="Germany Distributor" country="Germany"><DistributorUsers /></DistributorLayout>} 
        />
        <Route 
          path="/distributor/:countryCode" 
          element={<DistributorSessionWrapper />} 
        />
        <Route 
          path="/distributor/:countryCode/:tab" 
          element={<DistributorSessionWrapper />} 
        />
        <Route 
          path="/distributor/dev" 
          element={
            <Layout>
              <UnderDevelopment 
                title="Distributor Portal" 
                subtitle="Distributor panel is currently under development." 
              />
            </Layout>
          } 
        />

        {/* Legacy redirects or shared routes if needed */}
        <Route path="/cart" element={<Navigate to="/website-india/cart" replace />} />
        <Route path="/login" element={<Navigate to="/website-india/login" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
    </CartProvider>
  );
};

export default App;
