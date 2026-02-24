
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

const App: React.FC = () => {
  return (
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
          path="/admin/distributors" 
          element={
            <AdminLayout>
              <AdminDistributorPage />
            </AdminLayout>
          } 
        />

        {/* Website Routes */}
        <Route 
          path="/website-india/dev" 
          element={<WebsitePage key="india" siteTitle="India Website" initialLanguage="EN" />} 
        />
        <Route 
          path="/website-india/category/:id" 
          element={<StoreCategoryPage key="india-cat" country="India" initialLanguage="EN" />} 
        />
        <Route 
          path="/website-india/product/:productId" 
          element={<ProductDetailPage key="india-prod" country="India" initialLanguage="EN" />} 
        />

        <Route 
          path="/website-germany/dev" 
          element={<WebsitePage key="germany" siteTitle="Germany Website" initialLanguage="DE" isGermany={true} />} 
        />
        <Route 
          path="/website-germany/category/:id" 
          element={<StoreCategoryPage key="germany-cat" country="Germany" initialLanguage="DE" />} 
        />
        <Route 
          path="/website-germany/product/:productId" 
          element={<ProductDetailPage key="germany-prod" country="Germany" initialLanguage="DE" />} 
        />

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

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
