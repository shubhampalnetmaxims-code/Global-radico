
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { getProducts, saveProducts } from '../data/mockProducts';
import { getCategories, saveCategories } from '../data/mockCategories';
import { DistributorProductPrice, Distributor } from '../types/distributor';
import { getDistributors } from '../data/mockDistributors';
import DistributorLayout from '../components/DistributorLayout';

interface DistributorDashboardProps {
  country: string;
  distributorEmail: string;
}

const DistributorDashboard: React.FC<DistributorDashboardProps> = ({ country, distributorEmail }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [distributor, setDistributor] = useState<Distributor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [distributorPrices, setDistributorPrices] = useState<DistributorProductPrice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingStockProduct, setEditingStockProduct] = useState<Product | null>(null);
  const [newPriceValue, setNewPriceValue] = useState<string>('');
  const [newStockValue, setNewStockValue] = useState<string>('');
  
  // Modals for CRUD
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    stock: ''
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  // Determine current tab from URL
  const currentTab = useMemo(() => {
    if (location.pathname.includes('/overview')) return 'overview';
    if (location.pathname.includes('/categories')) return 'categories';
    if (location.pathname.includes('/products')) return 'products';
    return 'overview';
  }, [location.pathname]);

  useEffect(() => {
    // Find distributor
    const allDistributors = getDistributors();
    const dist = allDistributors.find(d => d.email === distributorEmail);
    if (dist) setDistributor(dist);

    // Load products and filter by country
    const allProducts = getProducts();
    const countryProducts = allProducts.filter(p => p.countries.includes(country as any));
    setProducts(countryProducts);

    // Load categories
    const allCategories = getCategories();
    setCategories(allCategories);

    // Load distributor prices from localStorage
    const savedPrices = localStorage.getItem(`dist_prices_${country}`);
    if (savedPrices) {
      setDistributorPrices(JSON.parse(savedPrices));
    }
  }, [country, distributorEmail]);

  const handleSavePrice = () => {
    if (!editingProduct) return;

    const updatedPrices = [...distributorPrices];
    const existingIndex = updatedPrices.findIndex(p => p.productId === editingProduct.id);

    const currency = editingProduct.prices.find(p => p.country === country)?.currency || 'USD';

    if (existingIndex >= 0) {
      updatedPrices[existingIndex].newPrice = parseFloat(newPriceValue);
    } else {
      updatedPrices.push({
        productId: editingProduct.id,
        newPrice: parseFloat(newPriceValue),
        currency: currency
      });
    }

    setDistributorPrices(updatedPrices);
    localStorage.setItem(`dist_prices_${country}`, JSON.stringify(updatedPrices));
    setEditingProduct(null);
    setNewPriceValue('');
  };

  const handleAddProduct = () => {
    if (!distributor) return;
    const allProducts = getProducts();
    const newProduct: Product = {
      id: `prod-dist-${Date.now()}`,
      name: productForm.name,
      description: productForm.description,
      categoryId: productForm.categoryId,
      images: ['https://picsum.photos/seed/product/400/400'],
      status: 'Active',
      countries: [country as any],
      prices: [{
        country: country as any,
        amount: parseFloat(productForm.price),
        currency: country === 'India' ? 'INR' : 'EUR'
      }],
      stocks: [{
        country: country as any,
        amount: parseInt(productForm.stock) || 0
      }],
      createdAt: new Date().toISOString(),
      addedBy: distributor.id
    };

    const updated = [newProduct, ...allProducts];
    saveProducts(updated);
    setProducts(updated.filter(p => p.countries.includes(country as any)));
    setIsProductModalOpen(false);
    setProductForm({ name: '', description: '', categoryId: '', price: '', stock: '' });
  };

  const handleAddCategory = () => {
    if (!distributor) return;
    const allCategories = getCategories();
    const newCategory: Category = {
      id: `cat-dist-${Date.now()}`,
      name: categoryForm.name,
      description: categoryForm.description,
      countries: [country as any],
      status: 'Active',
      createdAt: new Date().toISOString(),
      addedBy: distributor.id
    };

    const updated = [newCategory, ...allCategories];
    saveCategories(updated);
    setCategories(updated);
    setIsCategoryModalOpen(false);
    setCategoryForm({ name: '', description: '' });
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const allProducts = getProducts();
      const updated = allProducts.filter(p => p.id !== id);
      saveProducts(updated);
      setProducts(updated.filter(p => p.countries.includes(country as any)));
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const allCategories = getCategories();
      const updated = allCategories.filter(c => c.id !== id);
      saveCategories(updated);
      setCategories(updated);
    }
  };

  const handleSaveStock = () => {
    if (!editingStockProduct) return;
    const allProducts = getProducts();
    const updated = allProducts.map(p => {
      if (p.id === editingStockProduct.id) {
        const stocks = [...(p.stocks || [])];
        const idx = stocks.findIndex(s => s.country === country);
        if (idx >= 0) {
          stocks[idx].amount = parseInt(newStockValue) || 0;
        } else {
          stocks.push({ country: country as any, amount: parseInt(newStockValue) || 0 });
        }
        return { ...p, stocks };
      }
      return p;
    });
    saveProducts(updated);
    setProducts(updated.filter(p => p.countries.includes(country as any)));
    setEditingStockProduct(null);
    setNewStockValue('');
  };

  const getDistPrice = (productId: string) => {
    return distributorPrices.find(p => p.productId === productId);
  };

  if (!distributor) return null;

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 mb-4">Welcome back, {distributor.name}!</h3>
        <p className="text-slate-500 font-medium">
          You are currently managing the <span className="text-indigo-600 font-bold">{country}</span> regional website.
        </p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Region</p>
            <p className="text-2xl font-black text-slate-900">{country}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Products</p>
            <p className="text-2xl font-black text-slate-900">{products.length}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Custom Prices Set</p>
            <p className="text-2xl font-black text-slate-900">{distributorPrices.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">Regional Website</h3>
          <p className="text-indigo-100 text-sm font-medium mb-6">View how your products appear to customers in {country}.</p>
          <button 
            onClick={() => navigate(country === 'India' ? '/website-india/dev' : '/website-germany/dev')}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
          >
            Visit {country} Website
          </button>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-10 rotate-12">🌐</div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Categories</h2>
          <p className="text-slate-500 text-sm font-medium">Manage product categories for {country}</p>
        </div>
        {distributor.permissions.canManageCategories && (
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all"
          >
            + Add Category
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 text-sm">{cat.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-mono text-slate-400">{cat.id}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                    cat.addedBy ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {cat.addedBy ? 'Distributor' : 'Admin'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {distributor.permissions.canManageCategories ? (
                    <div className="flex justify-end gap-2">
                      <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <span className="text-lg">✏️</span>
                      </button>
                      {cat.addedBy === distributor.id && (
                        <button 
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <span className="text-lg">🗑️</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Read Only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Products</h2>
          <p className="text-slate-500 text-sm font-medium">Manage pricing and inventory for {country}</p>
        </div>
        {distributor.permissions.canManageProducts && (
          <button 
            onClick={() => setIsProductModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all"
          >
            + Add Product
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Price</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Price</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Local Stock</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => {
              const basePrice = product.prices.find(p => p.country === country);
              const distPrice = getDistPrice(product.id);
              const localStock = product.stocks?.find(s => s.country === country)?.amount || 0;
              
              return (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-500">
                      {basePrice?.currency} {basePrice?.amount.toFixed(2)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {distPrice ? (
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-indigo-600">
                          {distPrice.currency} {distPrice.newPrice.toFixed(2)}
                        </p>
                        <span className="text-[8px] font-black bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Custom</span>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-slate-300 italic">Default</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-black ${localStock <= 5 ? 'text-red-500' : 'text-slate-900'}`}>
                        {localStock}
                      </p>
                      <button 
                        onClick={() => {
                          setEditingStockProduct(product);
                          setNewStockValue(localStock.toString());
                        }}
                        className="text-[10px] text-indigo-600 font-bold hover:underline"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                      product.addedBy ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {product.addedBy ? 'Distributor' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {distributor.permissions.canSetPrices && (
                        <button 
                          onClick={() => {
                            setEditingProduct(product);
                            setNewPriceValue(distPrice ? distPrice.newPrice.toString() : basePrice?.amount.toString() || '');
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all"
                        >
                          Edit Price
                        </button>
                      )}
                      {distributor.permissions.canManageProducts && (
                        <div className="flex gap-2">
                          <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2">
                            <span className="text-lg">✏️</span>
                          </button>
                          {product.addedBy === distributor.id && (
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-2"
                            >
                              <span className="text-lg">🗑️</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <DistributorLayout distributorName={distributor.name} country={country}>
      {currentTab === 'overview' && renderOverview()}
      {currentTab === 'categories' && renderCategories()}
      {currentTab === 'products' && renderProducts()}

      {/* Edit Price Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-900">Update Product Price</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <img src={editingProduct.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <p className="font-black text-slate-900">{editingProduct.name}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Base: {editingProduct.prices.find(p => p.country === country)?.currency} {editingProduct.prices.find(p => p.country === country)?.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Price ({editingProduct.prices.find(p => p.country === country)?.currency})</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    {editingProduct.prices.find(p => p.country === country)?.currency}
                  </span>
                  <input 
                    type="number"
                    step="0.01"
                    value={newPriceValue}
                    onChange={(e) => setNewPriceValue(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setEditingProduct(null)}
                className="flex-grow px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePrice}
                className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Stock Modal */}
      {editingStockProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-900">Update Stock Level</h3>
              <button onClick={() => setEditingStockProduct(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <img src={editingStockProduct.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <p className="font-black text-slate-900">{editingStockProduct.name}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Region: {country}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stock in {country}</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={newStockValue}
                    onChange={(e) => setNewStockValue(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs uppercase">Units</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setEditingStockProduct(null)}
                className="flex-grow px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveStock}
                className="flex-grow bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-900">Add New Product</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</label>
                <input 
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                <select 
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price ({country === 'India' ? 'INR' : 'EUR'})</label>
                  <input 
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</label>
                  <input 
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea 
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  rows={3}
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button onClick={() => setIsProductModalOpen(false)} className="flex-grow px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleAddProduct} className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all">Add Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-900">Add New Category</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Name</label>
                <input 
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea 
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  rows={3}
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button onClick={() => setIsCategoryModalOpen(false)} className="flex-grow px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleAddCategory} className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all">Add Category</button>
            </div>
          </div>
        </div>
      )}
    </DistributorLayout>
  );
};

export default DistributorDashboard;
