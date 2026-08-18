import React, { useState, useEffect } from 'react';
import { Order, Product, ContactMessage } from '../types';
import { 
  subscribeOrders, 
  updateOrderStatusInDb, 
  fetchContactMessages, 
  saveStoredProducts,
  checkFirestoreConnection
} from '../lib/firebase';
import { 
  Lock, 
  KeyRound, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  DollarSign, 
  RefreshCw, 
  Search, 
  Eye, 
  Filter, 
  X, 
  MessageSquare, 
  Plus, 
  Package, 
  LogOut, 
  ShieldCheck,
  Trash2,
  Image as ImageIcon,
  Upload
} from 'lucide-react';

interface AdminViewProps {
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const AdminView: React.FC<AdminViewProps> = ({
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  products,
  setProducts
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Dashboard Tabs: 'orders' | 'products' | 'messages'
  const [adminTab, setAdminTab] = useState<'orders' | 'products' | 'messages'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');

  // Messages State
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Firestore connection status
  const [fsStatus, setFsStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [checkingFs, setCheckingFs] = useState(false);

  const runConnectionCheck = async (showLoading = false) => {
    if (showLoading) setCheckingFs(true);
    setFsStatus(await checkFirestoreConnection());
    if (showLoading) setCheckingFs(false);
  };

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdUrdu, setNewProdUrdu] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(500);
  const [newProdCategory, setNewProdCategory] = useState('Tib-e-Nabvi Special');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdDosage, setNewProdDosage] = useState('1 teaspoon twice daily');
  const [newProdImageUrl, setNewProdImageUrl] = useState('');

  // Real-time Firestore listener for live orders
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    // Request notification permission when admin logs in
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    setLoadingOrders(true);

    runConnectionCheck();
    
    // Track previous orders count for notification
    let previousOrdersCount = 0;

    const unsubscribe = subscribeOrders((liveOrders) => {
      // Check for new orders and show notification
      if (previousOrdersCount > 0 && liveOrders.length > previousOrdersCount) {
        const newOrder = liveOrders[0];
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('🛍️ New Order Alert!', {
            body: `Order ${newOrder.orderId} from ${newOrder.customerName} - Rs. ${newOrder.totalPrice}`,
            icon: '/products/LiverBoost.jpeg',
            tag: newOrder.orderId,
            requireInteraction: true
          });
        }
      }
      
      previousOrdersCount = liveOrders.length;
      setOrders(liveOrders);
      setLoadingOrders(false);
    });

    // Fetch Messages
    fetchContactMessages().then(setMessages);

    return () => unsubscribe();
  }, [isAdminLoggedIn]); // Removed orders.length dependency to prevent listener re-connection

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Admin123@') {
      setIsAdminLoggedIn(true);
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Invalid password. Please try again.');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: 'Pending' | 'Delivered' | 'Cancelled') => {
    await updateOrderStatusInDb(orderId, newStatus);
    
    const updatedOrders = orders.map((o) => 
      (o.id === orderId || o.orderId === orderId) ? { ...o, status: newStatus } : o
    );
    setOrders(updatedOrders);
    
    if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderId === orderId)) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    // Show notification when order is cancelled or delivered
    const order = orders.find(o => o.id === orderId || o.orderId === orderId);
    if (order && newStatus === 'Cancelled') {
      // In a real app, this would send SMS/WhatsApp to customer
      // For now, we'll show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('❌ Order Cancelled', {
          body: `Order ${order.orderId} has been cancelled. Customer: ${order.customerName} (${order.phone})`,
          icon: '/products/LiverBoost.jpeg',
          tag: `cancel-${orderId}`
        });
      }
      
      // Store cancelled notification for customer (localStorage simulation)
      try {
        const customerNotifications = JSON.parse(localStorage.getItem('customer_notifications') || '[]');
        customerNotifications.push({
          orderId: order.orderId,
          customerPhone: order.phone,
          message: `Your order ${order.orderId} has been cancelled. For inquiries, contact us at 0300-4652599`,
          timestamp: new Date().toISOString(),
          status: newStatus
        });
        localStorage.setItem('customer_notifications', JSON.stringify(customerNotifications));
      } catch (e) {
        console.error('Failed to save customer notification:', e);
      }
    } else if (order && newStatus === 'Delivered') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('✅ Order Delivered', {
          body: `Order ${order.orderId} marked as delivered to ${order.customerName}`,
          icon: '/products/LiverBoost.jpeg',
          tag: `delivered-${orderId}`
        });
      }
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProd: Product = {
      id: 'prod-' + Date.now(),
      name: newProdName.trim(),
      urduName: newProdUrdu.trim() || 'یونانی دوا',
      price: Number(newProdPrice),
      originalPrice: Number(newProdPrice) + 200,
      category: newProdCategory,
      description: newProdDesc.trim() || 'Pure organic herbal extract for wellness.',
      fullDescription: newProdDesc.trim() || 'Prepared according to authentic Unani Tib standards.',
      dosage: newProdDosage.trim() || 'As directed by Hakeem.',
      ingredients: ['100% Organic Botanical Extracts'],
      imageUrl: newProdImageUrl.trim() || '/products/LiverBoost.jpeg',
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: true,
      inStock: true,
      unit: 'Pack'
    };

    const updated = [newProd, ...products];
    setProducts(updated);
    saveStoredProducts(updated);

    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdUrdu('');
    setNewProdPrice(500);
    setNewProdDesc('');
    setNewProdImageUrl('');
  };

  const handleDeleteProduct = (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Create a local URL for preview and use
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      
      // Generate filename from product name or timestamp
      const fileName = newProdName.trim() 
        ? newProdName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') 
        : `product-${Date.now()}`;
      
      const extension = file.name.split('.').pop() || 'jpeg';
      const imagePath = `/products/${fileName}.${extension}`;
      
      // Set the image URL in the form
      setNewProdImageUrl(imagePath);
      
      // Store the image data in localStorage for demo (in production, upload to server)
      try {
        const productImages = JSON.parse(localStorage.getItem('product_images') || '{}');
        productImages[imagePath] = imageData;
        localStorage.setItem('product_images', JSON.stringify(productImages));
        
        alert(`Image ready! It will be saved as ${imagePath}\n\nNote: In production, this would upload to your server.`);
      } catch (e) {
        console.error('Failed to store image:', e);
        // Still set the image URL so form can be submitted
      }
    };
    
    reader.readAsDataURL(file);
  };

  // Metrics Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.totalPrice : 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesSearch = !orderSearchQuery || 
      o.orderId.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.includes(orderSearchQuery) ||
      o.address.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#525A43] text-white mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#2F3428] font-serif">
            RafaiShifa Admin Access
          </h2>
          <p className="text-xs text-stone-500">
            Protected management portal for viewing live Firestore orders and updating inventory.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#2F3428] mb-1">
              Admin Security Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-3 py-2.5 pl-9 rounded-xl border border-stone-300 text-xs text-[#2F3428] focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
              />
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#525A43] text-white hover:bg-[#3F4633] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Login to Admin Dashboard</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Admin Bar */}
      <div className="bg-[#525A43] text-white p-6 rounded-3xl border border-[#A1A696]/30 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A1A696] animate-pulse"></span>
            <h1 className="text-2xl font-extrabold font-serif">
              Live Admin Management Portal
            </h1>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                {pendingCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-stone-200 mt-1">
            Real-time synchronization active with Firebase Firestore (<code className="font-mono text-[#A1A696]">orders</code> collection).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {checkingFs ? (
              <span className="px-3 py-2 rounded-xl bg-[#3F4633] text-white border border-[#A1A696]/40 text-xs font-bold flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Checking...
              </span>
            ) : fsStatus ? (
              <button
                onClick={() => runConnectionCheck(true)}
                title="Check Firestore connection again"
                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors ${
                  fsStatus.ok
                    ? 'bg-[#A1A696]/20 text-[#A1A696] border-[#A1A696]/40 hover:bg-[#A1A696]/30'
                    : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${fsStatus.ok ? 'bg-emerald-400' : 'bg-red-500'} animate-pulse`}></span>
                {fsStatus.ok ? 'Firestore Connected' : 'Firestore Error'}
              </button>
            ) : (
              <button
                onClick={() => runConnectionCheck(true)}
                className="px-3 py-2 rounded-xl bg-[#3F4633] hover:bg-[#2F3428] text-white border border-[#A1A696]/40 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingFs ? 'animate-spin' : ''}`} />
                Check Firestore
              </button>
            )}
          </div>
          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="px-4 py-2 rounded-xl bg-[#3F4633] hover:bg-[#2F3428] text-white border border-[#A1A696]/40 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Firestore error banner */}
      {fsStatus && !fsStatus.ok && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs space-y-1.5 shadow-sm">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Firestore connection failed</p>
              <p className="font-mono break-all">{fsStatus.message}</p>
              <p className="mt-1 text-red-700">
                Is dauran orders localStorage me save hote hain lekin Firestore sync nahi hota. Firebase Console &gt; Firestore Database &gt; Rules me read/write allow karein aur dobara check karein.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#A1A696]/20 text-[#525A43] flex items-center justify-center font-bold shrink-0">
            <span className="text-2xl font-black">₹</span>
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium">Total Orders Revenue</span>
            <div className="text-xl font-black text-[#525A43]">
              Rs. {totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#A1A696]/20 text-[#525A43] flex items-center justify-center font-bold shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium">Total Orders</span>
            <div className="text-xl font-black text-[#2F3428]">
              {orders.length}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#525A43]/10 text-[#525A43] flex items-center justify-center font-bold shrink-0">
            <Clock className="w-6 h-6 text-[#525A43]" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium">Pending Delivery</span>
            <div className="text-xl font-black text-[#525A43]">
              {pendingCount}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#A1A696]/20 text-[#525A43] flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[#525A43]" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium">Delivered Orders</span>
            <div className="text-xl font-black text-[#525A43]">
              {deliveredCount}
            </div>
          </div>
        </div>

      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setAdminTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            adminTab === 'orders' 
              ? 'bg-[#525A43] text-white shadow-md' 
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Live Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            adminTab === 'products' 
              ? 'bg-[#525A43] text-white shadow-md' 
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Manage Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('messages')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            adminTab === 'messages' 
              ? 'bg-[#525A43] text-white shadow-md' 
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Customer Messages ({messages.length})</span>
        </button>
      </div>

      {/* TAB 1: LIVE ORDERS TABLE */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search Order ID, Name, Phone, Address..."
                className="w-full bg-[#F9F9F6] border border-stone-300 rounded-xl py-2 pl-9 pr-4 text-xs text-[#2F3428] focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <Filter className="w-4 h-4 text-stone-400" />
              {['All', 'Pending', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    statusFilter === st 
                      ? 'bg-[#525A43] text-white' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loadingOrders ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              Fetching live orders from Firestore...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs space-y-2">
              <p className="font-bold text-stone-800 text-sm">No orders found</p>
              <p>When customers place orders on the home page, they appear here live.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-stone-800 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Order ID</th>
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5">Address</th>
                    <th className="p-3.5">Total</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#525A43]">
                        {ord.orderId}
                      </td>
                      <td className="p-3.5 font-bold text-[#2F3428]">
                        {ord.customerName}
                      </td>
                      <td className="p-3.5 text-stone-800 font-mono">
                        {ord.phone}
                      </td>
                      <td className="p-3.5 max-w-xs truncate text-stone-600" title={ord.address}>
                        {ord.address}
                      </td>
                      <td className="p-3.5 font-black text-[#525A43]">
                        Rs. {ord.totalPrice}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          ord.status === 'Delivered' 
                            ? 'bg-[#A1A696]/20 text-[#525A43]' 
                            : ord.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-[#525A43]/10 text-[#2F3428]'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleStatusChange(ord.id, 'Delivered')}
                            className="p-1.5 rounded-lg bg-[#A1A696]/20 hover:bg-[#A1A696]/30 text-[#525A43] font-bold"
                            title="Mark as Delivered"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleStatusChange(ord.id, 'Cancelled')}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {adminTab === 'products' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#2F3428] font-serif">
                Herbal Medicine Catalog
              </h2>
              <p className="text-xs text-stone-500">
                Manage items listed in the store. Add new herbal formulas or edit prices.
              </p>
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#525A43] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#3F4633] shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Medicine</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              // Get image from localStorage if it's a local path
              const getImageSrc = (imageUrl: string) => {
                if (imageUrl.startsWith('/products/')) {
                  try {
                    const productImages = JSON.parse(localStorage.getItem('product_images') || '{}');
                    return productImages[imageUrl] || imageUrl;
                  } catch {
                    return imageUrl;
                  }
                }
                return imageUrl;
              };

              return (
                <div key={p.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center gap-3 relative group">
                  <img 
                    src={getImageSrc(p.imageUrl)} 
                    alt={p.name} 
                    className="w-16 h-16 rounded-xl object-cover bg-white shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = '/products/LiverBoost.jpeg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#2F3428] text-xs truncate">{p.name}</h4>
                    <p className="text-[11px] text-[#525A43] font-serif">{p.urduName}</p>
                    <div className="text-xs font-black text-[#525A43] mt-1">Rs. {p.price}</div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER MESSAGES */}
      {adminTab === 'messages' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#2F3428] font-serif border-b pb-3">
            Contact & Consultation Inquiries
          </h2>

          {messages.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              No customer inquiries submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#2F3428]">{m.name} ({m.email})</span>
                    <span className="text-[10px] text-stone-400">{m.createdAt}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#525A43]">Subject: {m.subject}</div>
                  <p className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200/60 leading-relaxed">
                    {m.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#2F3428]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3">
              <span className="text-xs font-mono font-bold text-[#525A43] bg-[#A1A696]/20 px-2 py-0.5 rounded">
                Order: {selectedOrder.orderId}
              </span>
              <h3 className="text-xl font-bold font-serif text-[#2F3428] mt-1">
                Order Details
              </h3>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="bg-stone-50 p-3 rounded-xl space-y-1">
                <div className="font-bold text-[#2F3428]">Customer: {selectedOrder.customerName}</div>
                <div>Phone: <a href={`tel:${selectedOrder.phone}`} className="font-mono text-[#525A43] font-bold">{selectedOrder.phone}</a></div>
                <div>Address: {selectedOrder.address}</div>
                <div>Payment Method: <strong>{selectedOrder.paymentMethod}</strong></div>
                {selectedOrder.notes && <div className="text-[#525A43]">Note: {selectedOrder.notes}</div>}
              </div>

              <div>
                <h4 className="font-bold text-[#2F3428] mb-2">Ordered Items:</h4>
                <div className="space-y-1.5">
                  {selectedOrder.cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between bg-stone-100 p-2 rounded-lg">
                      <span>{item.productName} (x{item.quantity})</span>
                      <span className="font-bold">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-[#2F3428] pt-2 border-t">
                <span>Total Amount:</span>
                <span className="text-[#525A43]">Rs. {selectedOrder.totalPrice}</span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'Delivered')}
                  className="flex-1 py-2 rounded-xl bg-[#525A43] text-white font-bold text-xs hover:bg-[#3F4633]"
                >
                  Mark Delivered
                </button>
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'Cancelled')}
                  className="flex-1 py-2 rounded-xl bg-red-100 text-red-800 font-bold text-xs hover:bg-red-200"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-[#2F3428]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl relative">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-serif text-[#2F3428] border-b pb-2">
              Add Herbal Medicine to Catalog
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#2F3428] mb-1">Product Name (English)</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Pure Kashmiri Saffron Extractions"
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2F3428] mb-1">Name in Urdu</label>
                <input
                  type="text"
                  value={newProdUrdu}
                  onChange={(e) => setNewProdUrdu(e.target.value)}
                  placeholder="e.g. زعفران خالص"
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#2F3428] mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2F3428] mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="Tib-e-Nabvi Special">Tib-e-Nabvi Special</option>
                    <option value="Immunity & Daily Wellness">Immunity & Daily Wellness</option>
                    <option value="Heart & Digestion">Heart & Digestion</option>
                    <option value="Joint Care & Oils">Joint Care & Oils</option>
                    <option value="Herbal Teas & Extracts">Herbal Teas & Extracts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2F3428] mb-1">Product Image</label>
                
                {/* File Upload Button */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 px-3 py-2 border-2 border-dashed border-[#525A43] rounded-lg hover:bg-stone-50 cursor-pointer transition-colors flex items-center justify-center gap-2 text-xs font-semibold text-[#525A43]">
                    <Upload className="w-4 h-4" />
                    <span>Upload from PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Manual URL Input */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={newProdImageUrl}
                    onChange={(e) => setNewProdImageUrl(e.target.value)}
                    placeholder="Or paste image URL: /products/product-name.jpeg"
                    className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                
                {/* Preview */}
                {newProdImageUrl && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-[#A1A696]/10 rounded-lg">
                    <ImageIcon className="w-4 h-4 text-[#525A43]" />
                    <span className="text-[10px] text-[#525A43] font-mono truncate">
                      {newProdImageUrl}
                    </span>
                  </div>
                )}
                
                <p className="text-[10px] text-stone-500 mt-1">
                  Upload image from your PC or use URL like <code className="bg-stone-100 px-1 rounded">/products/image.jpeg</code>
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#2F3428] mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Brief product description..."
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#525A43] text-white hover:bg-[#3F4633] font-bold text-xs"
              >
                Add Product to Store
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
