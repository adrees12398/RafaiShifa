import React, { useState, useEffect } from 'react';
import { Order, Product, ContactMessage, CategoryFolderInfo } from '../types';
import { 
  subscribeOrders, 
  updateOrderStatusInDb, 
  fetchContactMessages, 
  saveStoredProducts,
  checkFirestoreConnection,
  saveCategoriesToDb,
  getStoredCategories
} from '../lib/firebase';
import { uploadProductImage } from '../lib/cloudinary';
import { INITIAL_CATEGORIES } from '../data/initialData';

// Convert a base64 data URL (old localStorage format) into a File for upload.
function dataUrlToFile(dataUrl: string, name = 'product-image'): File {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const binary = atob(parts[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], name, { type: mime });
}
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
  Pencil,
  Image as ImageIcon,
  Upload,
  Layers
} from 'lucide-react';

interface AdminViewProps {
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories?: CategoryFolderInfo[];
  setCategories?: React.Dispatch<React.SetStateAction<CategoryFolderInfo[]>>;
  onLogout?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  products,
  setProducts,
  categories: propCategories,
  setCategories: propSetCategories,
  onLogout
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Dashboard Tabs: 'orders' | 'products' | 'categories' | 'messages'
  const [adminTab, setAdminTab] = useState<'orders' | 'products' | 'categories' | 'messages'>('orders');

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
  const [fsErrorDismissed, setFsErrorDismissed] = useState(false);

  const runConnectionCheck = async (showLoading = false) => {
    if (showLoading) setCheckingFs(true);
    setFsErrorDismissed(false);
    setFsStatus(await checkFirestoreConnection());
    if (showLoading) setCheckingFs(false);
  };

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isMigratingImages, setIsMigratingImages] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdUrdu, setNewProdUrdu] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(500);
  const [newProdCategory, setNewProdCategory] = useState('Tib-e-Nabvi Special');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdDosage, setNewProdDosage] = useState('1 teaspoon twice daily');
  const [newProdImageUrl, setNewProdImageUrl] = useState('');

  // Categories Management State
  const [internalCategories, setInternalCategories] = useState<CategoryFolderInfo[]>(() => {
    return (propCategories && propCategories.length > 0) ? propCategories : getStoredCategories();
  });

  // Keep internal categories state synced whenever propCategories changes from cloud
  useEffect(() => {
    if (propCategories && propCategories.length > 0) {
      setInternalCategories(propCategories);
    }
  }, [propCategories]);

  const categoriesList = (propCategories && propCategories.length > 0) ? propCategories : internalCategories;

  const updateCategories = (newCats: CategoryFolderInfo[]) => {
    setInternalCategories(newCats);
    if (propSetCategories) {
      propSetCategories(newCats);
    }
    saveCategoriesToDb(newCats);
  };

  // Quick Add Category State (Inline Bar)
  const [quickCatName, setQuickCatName] = useState('');
  const [quickCatUrdu, setQuickCatUrdu] = useState('');

  // Product Modal Custom Category on-the-fly State
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [customCategoryUrduInput, setCustomCategoryUrduInput] = useState('');

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryFolderInfo | null>(null);
  const [catName, setCatName] = useState('');
  const [catUrduName, setCatUrduName] = useState('');
  const [catFolderType, setCatFolderType] = useState('');
  const [catFolderTypeUrdu, setCatFolderTypeUrdu] = useState('');
  const [catBadge, setCatBadge] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catFocusArea, setCatFocusArea] = useState('');
  const [catImageUrl, setCatImageUrl] = useState('');
  const [isUploadingCatImage, setIsUploadingCatImage] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');

  // Real-time Firestore listener for live orders
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    // Request notification permission when admin logs in
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    setLoadingOrders(true);

    runConnectionCheck();
    
    // Track seen order IDs so notifications fire ONLY for genuinely new
    // orders - not on reconnects/flaps where the list temporarily shrinks
    // (e.g. Firestore errors falling back to local-only data).
    const seenOrderIds = new Set<string>();
    let isFirstSnapshot = true;

    const unsubscribe = subscribeOrders((liveOrders) => {
      if (!isFirstSnapshot) {
        for (const order of liveOrders) {
          const key = order.orderId || order.id;
          if (!seenOrderIds.has(key)) {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('🛍️ New Order Alert!', {
                body: `Order ${order.orderId} from ${order.customerName} - Rs. ${order.totalPrice}`,
                icon: '/products/LiverBoost.jpeg',
                tag: order.orderId
              });
            }
          }
        }
      }
      
      liveOrders.forEach((o) => seenOrderIds.add(o.orderId || o.id));
      isFirstSnapshot = false;
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
      try {
        sessionStorage.setItem('rafaishifa_admin_auth', 'true');
      } catch {}
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

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setNewProdName(p.name);
    setNewProdUrdu(p.urduName || '');
    setNewProdPrice(p.price);
    setNewProdCategory(p.category);
    setNewProdDesc(p.description);
    setNewProdDosage(p.dosage);
    setNewProdImageUrl(p.imageUrl);
    setShowAddProductModal(true);
  };

  const closeProductModal = () => {
    setShowAddProductModal(false);
    setEditingProduct(null);
    setNewProdName('');
    setNewProdUrdu('');
    setNewProdPrice(500);
    setNewProdDesc('');
    setNewProdDosage('1 teaspoon twice daily');
    setNewProdImageUrl('');
    setIsCustomCategoryMode(false);
    setCustomCategoryInput('');
    setCustomCategoryUrduInput('');
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setNewProdName('');
    setNewProdUrdu('');
    setNewProdPrice(500);
    setNewProdCategory(categoriesList[0]?.name || 'Tib-e-Nabvi Special');
    setNewProdDesc('');
    setNewProdDosage('1 teaspoon twice daily');
    setNewProdImageUrl('');
    setIsCustomCategoryMode(false);
    setCustomCategoryInput('');
    setCustomCategoryUrduInput('');
    setShowAddProductModal(true);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    // Resolve category name (either selected existing or custom typed by admin)
    let finalCategory = newProdCategory;
    if (isCustomCategoryMode && customCategoryInput.trim()) {
      const customName = customCategoryInput.trim();
      finalCategory = customName;

      // Auto-register new category if it doesn't already exist in categoriesList
      const existing = categoriesList.find((c) => c.name.toLowerCase() === customName.toLowerCase());
      if (!existing) {
        const autoCat: CategoryFolderInfo = {
          id: customName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
          name: customName,
          urduName: customCategoryUrduInput.trim() || 'خصوصی طبی زمرہ',
          folderType: `Specialized Herbal Formulation (${customName})`,
          folderTypeUrdu: 'خصوصی طبی شعبہ',
          badge: 'Custom Category',
          description: `Authentic Unani herbal preparations and remedies filed under ${customName}.`,
          focusArea: 'Targeted wellness and specialized treatment',
          imageUrl: newProdImageUrl.trim() || '/products/LiverBoost.jpeg'
        };
        const updatedCats = [...categoriesList, autoCat];
        updateCategories(updatedCats);
      }
    }

    // EDIT: update existing product and save
    if (editingProduct) {
      const newPrice = Number(newProdPrice) || editingProduct.price;
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: newProdName.trim(),
              urduName: newProdUrdu.trim() || p.urduName,
              price: newPrice,
              originalPrice:
                p.originalPrice && p.originalPrice > newPrice ? p.originalPrice : newPrice + 200,
              category: finalCategory,
              description: newProdDesc.trim() || p.description,
              dosage: newProdDosage.trim() || p.dosage,
              imageUrl: newProdImageUrl.trim() || p.imageUrl
            }
          : p
      );
      setProducts(updated);
      
      // Save locally + sync to Firestore (centralized)
      saveStoredProducts(updated);
      
      closeProductModal();
      return;
    }

    // ADD: create new product
    const newProd: Product = {
      id: 'prod-' + Date.now(),
      name: newProdName.trim(),
      urduName: newProdUrdu.trim() || 'یونانی دوا',
      price: Number(newProdPrice),
      originalPrice: Number(newProdPrice) + 200,
      category: finalCategory,
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
    
    // Save locally + sync to Firestore (centralized)
    saveStoredProducts(updated);

    closeProductModal();
  };

  const handleDeleteProduct = (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    // Optimistic update - immediately update UI
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    
    // Save to localStorage immediately
    try {
      localStorage.setItem('rafaishifa_products_v2', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save products locally:', e);
    }
    
    // Async Firestore sync in background (no state update needed - listener will handle)
    import('../lib/firebase').then(({ syncProductsToDb }) => {
      syncProductsToDb(updated).catch(err => {
        console.error('Firestore sync failed:', err);
      });
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORIES CRUD HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  // Inline Quick Add (1-Click)
  const handleQuickAddCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = quickCatName.trim();
    if (!trimmed) {
      alert('Please enter a Category Name.');
      return;
    }

    if (categoriesList.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      alert(`Category "${trimmed}" already exists.`);
      return;
    }

    const newCat: CategoryFolderInfo = {
      id: trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
      name: trimmed,
      urduName: quickCatUrdu.trim() || 'خصوصی طبی زمرہ',
      folderType: `Specialized Herbal Formulation (${trimmed})`,
      folderTypeUrdu: 'خصوصی طبی شعبہ',
      badge: 'Custom Category',
      description: `Authentic Unani herbal preparations and remedies filed under ${trimmed}.`,
      focusArea: 'Targeted wellness and specialized treatment',
      imageUrl: '/products/LiverBoost.jpeg'
    };

    const updated = [...categoriesList, newCat];
    updateCategories(updated);
    setQuickCatName('');
    setQuickCatUrdu('');
    alert(`Category "${trimmed}" added successfully! It is now live on the home screen.`);
  };

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatUrduName('');
    setCatFolderType('');
    setCatFolderTypeUrdu('');
    setCatBadge('Specialized Remedy');
    setCatDescription('');
    setCatFocusArea('');
    setCatImageUrl('/products/LiverBoost.jpeg');
    setShowCategoryModal(true);
  };

  const handleEditCategory = (c: CategoryFolderInfo) => {
    setEditingCategory(c);
    setCatName(c.name);
    setCatUrduName(c.urduName || '');
    setCatFolderType(c.folderType || '');
    setCatFolderTypeUrdu(c.folderTypeUrdu || '');
    setCatBadge(c.badge || '');
    setCatDescription(c.description || '');
    setCatFocusArea(c.focusArea || '');
    setCatImageUrl(c.imageUrl || '/products/LiverBoost.jpeg');
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCatName('');
    setCatUrduName('');
    setCatFolderType('');
    setCatFolderTypeUrdu('');
    setCatBadge('');
    setCatDescription('');
    setCatFocusArea('');
    setCatImageUrl('');
  };

  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      setIsUploadingCatImage(true);
      const url = await uploadProductImage(file);
      setCatImageUrl(url);
      alert('Category image uploaded successfully!');
      return;
    } catch (err) {
      console.warn('Cloudinary upload failed, using local reader fallback:', err);
    } finally {
      setIsUploadingCatImage(false);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCatImageUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      alert('Please enter a category name');
      return;
    }

    const trimmedName = catName.trim();

    if (editingCategory) {
      const oldName = editingCategory.name;
      const updatedList = categoriesList.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: trimmedName,
              urduName: catUrduName.trim() || c.urduName || trimmedName,
              folderType: catFolderType.trim() || c.folderType || `Specialized Treatment (${trimmedName})`,
              folderTypeUrdu: catFolderTypeUrdu.trim() || c.folderTypeUrdu || 'خصوصی طبی شعبہ',
              badge: catBadge.trim() || c.badge || 'Category',
              description: catDescription.trim() || c.description || `Herbal remedies and formulations for ${trimmedName}.`,
              focusArea: catFocusArea.trim() || c.focusArea || 'Specialized Unani therapeutic care',
              imageUrl: catImageUrl.trim() || c.imageUrl || '/products/LiverBoost.jpeg'
            }
          : c
      );

      // If category name was updated, update any products in this category
      if (oldName !== trimmedName) {
        const updatedProducts = products.map((p) =>
          p.category === oldName ? { ...p, category: trimmedName } : p
        );
        if (JSON.stringify(updatedProducts) !== JSON.stringify(products)) {
          setProducts(updatedProducts);
          saveStoredProducts(updatedProducts);
        }
      }

      updateCategories(updatedList);
      closeCategoryModal();
      alert(`Category "${trimmedName}" updated successfully!`);
      return;
    }

    // Adding new category
    if (categoriesList.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert(`A category named "${trimmedName}" already exists.`);
      return;
    }

    const newCategory: CategoryFolderInfo = {
      id: trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
      name: trimmedName,
      urduName: catUrduName.trim() || 'خصوصی طبی زمرہ',
      folderType: catFolderType.trim() || `Specialized Formulation (${trimmedName})`,
      folderTypeUrdu: catFolderTypeUrdu.trim() || 'خصوصی طبی شعبہ',
      badge: catBadge.trim() || 'Specialized',
      description: catDescription.trim() || `Authentic Unani and herbal treatments for ${trimmedName}.`,
      focusArea: catFocusArea.trim() || 'Targeted holistic healthcare and remedy formulations',
      imageUrl: catImageUrl.trim() || '/products/LiverBoost.jpeg'
    };

    const updatedList = [...categoriesList, newCategory];
    updateCategories(updatedList);
    closeCategoryModal();
    alert(`Category "${trimmedName}" created successfully!`);
  };

  const handleDeleteCategory = (catId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete category "${categoryName}"?\n\nRemedies in this category will remain in the catalog.`)) {
      return;
    }

    const updatedList = categoriesList.filter((c) => c.id !== catId && c.name !== categoryName);
    updateCategories(updatedList);
    alert(`Category "${categoryName}" removed.`);
  };

  const handleResetCategories = () => {
    if (!confirm('Are you sure you want to restore default herbal categories? Any custom categories will be replaced with standard categories.')) {
      return;
    }
    updateCategories(INITIAL_CATEGORIES);
    alert('Categories restored to defaults.');
  };

  // One-click migration: move old localStorage (base64) product images to
  // Cloudinary so they become permanent URLs visible on every device.
  const handleMigrateImages = async () => {
    let entries: [string, string][] = [];
    try {
      const stored = JSON.parse(localStorage.getItem('product_images') || '{}');
      entries = Object.entries(stored) as [string, string][];
    } catch {}

    if (entries.length === 0) {
      alert('No old local images found. All product images are already permanent.');
      return;
    }
    if (!confirm(`${entries.length} old local image(s) found.\n\nUpload them all to Cloudinary and attach to their products?\n\nAfter this, images will never disappear on any device.`)) return;

    setIsMigratingImages(true);
    try {
      const updated = [...products];
      let migrated = 0;
      for (const [path, dataUrl] of entries) {
        try {
          const file = dataUrlToFile(dataUrl);
          const url = await uploadProductImage(file);
          const idx = updated.findIndex((p) => p.imageUrl === path);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], imageUrl: url };
            migrated++;
          }
        } catch (err) {
          console.error('Image migration failed for:', path, err);
        }
      }
      setProducts(updated);
      saveStoredProducts(updated);
      localStorage.removeItem('product_images');
      alert(`Done! ${migrated} image(s) migrated to Cloudinary and saved to the cloud catalog.\n\nThey will now show on every device, permanently.`);
    } finally {
      setIsMigratingImages(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Preferred: upload to Cloudinary -> permanent URL, works on ALL devices
    try {
      setIsUploadingImage(true);
      const url = await uploadProductImage(file);
      setNewProdImageUrl(url);
      alert('Image uploaded! It will be visible on every device.');
      return;
    } catch (err) {
      console.warn('Cloudinary upload failed, using local fallback:', err);
    } finally {
      setIsUploadingImage(false);
    }

    // Fallback: local-only base64 (visible only in this browser)
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
        
        alert(`Image ready (THIS BROWSER ONLY)! It will be saved as ${imagePath}\n\nTip: Configure Cloudinary to make images visible on all devices.`);
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
                title={fsStatus.ok ? 'Firestore Connected' : `Firestore Error: ${fsStatus.message}`}
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
            onClick={() => {
              try {
                sessionStorage.removeItem('rafaishifa_admin_auth');
              } catch {}
              setIsAdminLoggedIn(false);
              if (onLogout) onLogout();
            }}
            className="px-4 py-2 rounded-xl bg-[#3F4633] hover:bg-[#2F3428] text-white border border-[#A1A696]/40 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Firestore error banner (dismissible, compact) */}
      {fsStatus && !fsStatus.ok && !fsErrorDismissed && (
        <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-800 pl-3.5 pr-2 py-2 rounded-xl text-[11px] shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-bold shrink-0">Firestore Error</span>
            <span className="font-mono truncate hidden sm:inline">{fsStatus.message}</span>
          </div>
          <button
            onClick={() => setFsErrorDismissed(true)}
            aria-label="Close"
            className="w-5 h-5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center shrink-0 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
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
          onClick={() => setAdminTab('categories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            adminTab === 'categories' 
              ? 'bg-[#525A43] text-white shadow-md' 
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Manage Categories ({categoriesList.length})</span>
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

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  console.log('🧪 Testing Firestore write...');
                  try {
                    await import('../lib/firebase').then(async ({ db }) => {
                      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
                      const testDoc = doc(db, 'test/connection');
                      await setDoc(testDoc, {
                        message: 'Test write from admin panel',
                        timestamp: serverTimestamp()
                      });
                      alert('✅ Firestore write test SUCCESSFUL!\n\nFirestore is working correctly.');
                    });
                  } catch (err) {
                    console.error('❌ Firestore test failed:', err);
                    const errorMsg = err instanceof Error ? err.message : String(err);
                    alert(`❌ Firestore test FAILED!\n\nError: ${errorMsg}\n\nCheck:\n1. Firebase config in .env\n2. Firestore rules\n3. Internet connection`);
                  }
                }}
                className="px-3 py-2.5 rounded-xl bg-blue-100 border-2 border-blue-300 text-blue-700 font-bold text-xs hover:bg-blue-200"
                title="Test Firestore connection"
              >
                Test Firestore
              </button>
              <button
                onClick={async () => {
                  if (!confirm('⚠️ WARNING: This will DELETE ALL PRODUCTS from localStorage and Firestore!\n\nAre you absolutely sure?')) return;
                  
                  try {
                    // Clear localStorage
                    localStorage.removeItem('rafaishifa_products_v2');
                    localStorage.removeItem('rafaishifa_products_v1');
                    localStorage.removeItem('product_images');
                    
                    // Clear state
                    setProducts([]);
                    
                    // Clear Firestore
                    await import('../lib/firebase').then(({ syncProductsToDb }) => {
                      return syncProductsToDb([]);
                    });
                    
                    alert('✅ All products cleared successfully!\n\nPage will reload in 2 seconds...');
                    setTimeout(() => window.location.reload(), 2000);
                  } catch (err) {
                    console.error('Failed to clear products:', err);
                    alert('❌ Failed to clear Firestore. Check console for details.');
                  }
                }}
                className="px-3 py-2.5 rounded-xl bg-red-100 border-2 border-red-300 text-red-700 font-bold text-xs hover:bg-red-200"
                title="Delete ALL products from everywhere"
              >
                Clear All Products
              </button>
              <button
                onClick={handleMigrateImages}
                disabled={isMigratingImages}
                className="px-3 py-2.5 rounded-xl bg-white border-2 border-[#A1A696] text-[#525A43] font-bold text-xs hover:bg-stone-50 disabled:opacity-50"
                title="Move old locally-stored images to Cloudinary so they show on every device"
              >
                {isMigratingImages ? 'Fixing Images...' : 'Fix Old Images'}
              </button>
              <button
                onClick={openAddCategoryModal}
                className="px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#525A43] text-[#525A43] font-bold text-xs flex items-center gap-1.5 hover:bg-stone-50 shadow-xs transition-colors"
                title="Add a custom category to the store"
              >
                <Layers className="w-4 h-4" />
                <span>+ Add Category</span>
              </button>
              <button
                onClick={openAddProductModal}
                className="px-4 py-2.5 rounded-xl bg-[#525A43] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#3F4633] shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Medicine</span>
              </button>
            </div>
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
                  
                  {/* Edit & Delete Buttons */}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditProduct(p)}
                      className="p-1.5 rounded-lg bg-[#A1A696]/20 hover:bg-[#A1A696]/30 text-[#525A43]"
                      title="Edit Product"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: MANAGE CATEGORIES */}
      {adminTab === 'categories' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#525A43]"></span>
                <h2 className="text-xl font-black text-[#2F3428] font-serif flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#525A43]" />
                  <span>Category Folders & Collections ({categoriesList.length})</span>
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Dynamically manage shop-by-category cards, folder types, Urdu names, and clinical scopes. All changes sync in real-time to the home screen.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleResetCategories}
                className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition-colors"
                title="Reset categories to default initial list"
              >
                Reset to Defaults
              </button>
              <button
                onClick={openAddCategoryModal}
                className="px-4 py-2.5 rounded-xl bg-[#525A43] hover:bg-[#3F4633] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Category</span>
              </button>
            </div>
          </div>

          {/* Quick Add Category Bar (Inline 1-Click) */}
          <form
            onSubmit={handleQuickAddCategory}
            className="bg-[#525A43]/5 border-2 border-dashed border-[#525A43]/30 rounded-2xl p-4 space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
              <span className="font-bold text-[#2F3428] text-xs flex items-center gap-1.5 font-serif">
                <Sparkles className="w-4 h-4 text-[#525A43]" />
                <span>Quick Add Any Category of Your Choice (اپنی مرضی کا نیا زمرہ شامل کریں)</span>
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                Immediately live on home screen and shop categories
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  required
                  value={quickCatName}
                  onChange={(e) => setQuickCatName(e.target.value)}
                  placeholder="Category Name (e.g. Skin Care, Hair Growth, Men Health)"
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  value={quickCatUrdu}
                  onChange={(e) => setQuickCatUrdu(e.target.value)}
                  placeholder="Urdu Name (optional e.g. امراضِ جلد)"
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-serif focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#525A43] hover:bg-[#3F4633] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Category</span>
                </button>
              </div>
            </div>
          </form>

          {/* Search bar for categories */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={categorySearchQuery}
              onChange={(e) => setCategorySearchQuery(e.target.value)}
              placeholder="Search categories by name, Urdu, classification, or ailments..."
              className="w-full bg-[#F9F9F6] border border-stone-300 rounded-xl py-2 pl-9 pr-4 text-xs text-[#2F3428] focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoriesList
              .filter((cat) => {
                if (!categorySearchQuery) return true;
                const q = categorySearchQuery.toLowerCase();
                return (
                  cat.name.toLowerCase().includes(q) ||
                  (cat.urduName && cat.urduName.includes(q)) ||
                  (cat.folderType && cat.folderType.toLowerCase().includes(q)) ||
                  (cat.focusArea && cat.focusArea.toLowerCase().includes(q)) ||
                  (cat.description && cat.description.toLowerCase().includes(q))
                );
              })
              .map((cat) => {
                const prodCount = products.filter(
                  (p) => p.category.toLowerCase() === cat.name.toLowerCase()
                ).length;

                return (
                  <div
                    key={cat.id || cat.name}
                    className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Category Header with Image */}
                      <div className="relative h-40 bg-stone-100 overflow-hidden">
                        <img
                          src={cat.imageUrl || '/products/LiverBoost.jpeg'}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/products/LiverBoost.jpeg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                        
                        {/* Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-[#525A43]/90 text-white text-[10px] font-bold tracking-wide shadow-sm backdrop-blur-xs">
                            {cat.badge || 'Remedy Folder'}
                          </span>
                        </div>

                        {/* Product Count Pill */}
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-[#2F3428] text-[10px] font-extrabold shadow-sm">
                            {prodCount} Remedies
                          </span>
                        </div>

                        {/* Title overlay */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h3 className="text-base font-extrabold font-serif leading-tight">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-[#A1A696] font-serif mt-0.5">
                            {cat.urduName}
                          </p>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-4 space-y-3 text-xs">
                        {/* Folder Type */}
                        <div className="bg-[#525A43]/5 border border-[#525A43]/15 rounded-xl p-2.5">
                          <span className="text-[10px] uppercase font-bold text-[#525A43] block">
                            Classification Type (فولڈر قسم)
                          </span>
                          <span className="font-semibold text-stone-800 text-[11px] block mt-0.5">
                            {cat.folderType || 'Specialized Unani Collection'}
                          </span>
                          {cat.folderTypeUrdu && (
                            <span className="text-[10px] text-[#525A43] font-serif block mt-0.5">
                              {cat.folderTypeUrdu}
                            </span>
                          )}
                        </div>

                        {/* Focus Area */}
                        {cat.focusArea && (
                          <div>
                            <span className="text-[10px] uppercase font-bold text-stone-500 block">
                              Focus Area / Clinical Scope
                            </span>
                            <p className="text-stone-700 text-[11px] mt-0.5 line-clamp-2">
                              {cat.focusArea}
                            </p>
                          </div>
                        )}

                        {/* Description */}
                        {cat.description && (
                          <div>
                            <span className="text-[10px] uppercase font-bold text-stone-500 block">
                              Description
                            </span>
                            <p className="text-stone-600 text-[11px] mt-0.5 line-clamp-2">
                              {cat.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-stone-400 font-mono truncate max-w-[120px]">
                        ID: {cat.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="px-3 py-1.5 rounded-lg bg-[#525A43] hover:bg-[#3F4633] text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
        <div className="fixed inset-0 h-dvh z-50 bg-[#2F3428]/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="flex min-h-full items-center justify-center p-4">
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
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 h-dvh z-50 bg-[#2F3428]/70 backdrop-blur-sm overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl relative">
            <button
              onClick={closeProductModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-serif text-[#2F3428] border-b pb-2">
              {editingProduct ? 'Edit Herbal Medicine' : 'Add Herbal Medicine to Catalog'}
            </h3>

            <form onSubmit={handleSubmitProduct} className="space-y-3 text-xs">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-[#2F3428]">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategoryMode(!isCustomCategoryMode)}
                      className="text-[10px] font-bold text-[#525A43] hover:underline"
                    >
                      {isCustomCategoryMode ? '← Pick Existing' : '+ Type New Category'}
                    </button>
                  </div>
                  {!isCustomCategoryMode ? (
                    <select
                      value={newProdCategory}
                      onChange={(e) => {
                        if (e.target.value === '__add_new__') {
                          setIsCustomCategoryMode(true);
                        } else {
                          setNewProdCategory(e.target.value);
                        }
                      }}
                      className="w-full p-2 border border-stone-300 rounded-lg text-xs bg-white"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat.id || cat.name} value={cat.name}>
                          {cat.name} {cat.urduName ? `(${cat.urduName})` : ''}
                        </option>
                      ))}
                      <option value="__add_new__" className="font-bold text-[#525A43]">
                        + Type New Custom Category...
                      </option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="Type your category (e.g. Skin Care)"
                      className="w-full p-2 border-2 border-[#525A43] rounded-lg text-xs bg-white focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {isCustomCategoryMode && (
                <div className="p-2.5 bg-[#525A43]/5 border border-[#525A43]/20 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-[#525A43] block">
                    ✨ Adding New Category of Your Choice: "{customCategoryInput || 'New Category'}"
                  </span>
                  <input
                    type="text"
                    value={customCategoryUrduInput}
                    onChange={(e) => setCustomCategoryUrduInput(e.target.value)}
                    placeholder="Urdu Name for this Category (Optional e.g. امراضِ جلد)"
                    className="w-full p-2 border border-stone-300 rounded-lg text-xs font-serif bg-white"
                  />
                  <p className="text-[10px] text-stone-500">
                    This new category will automatically be created in the store and appear on the home screen!
                  </p>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#2F3428] mb-1">Product Image</label>
                
                {/* File Upload Button */}
                <div className="flex items-center gap-2">
                  <label className={`flex-1 px-3 py-2 border-2 border-dashed border-[#525A43] rounded-lg hover:bg-stone-50 cursor-pointer transition-colors flex items-center justify-center gap-2 text-xs font-semibold text-[#525A43] ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingImage ? 'Uploading...' : 'Upload from PC'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploadingImage}
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
                disabled={isUploadingImage}
                className="w-full py-3 rounded-xl bg-[#525A43] text-white hover:bg-[#3F4633] font-bold text-xs disabled:opacity-50"
              >
                {isUploadingImage ? 'Uploading image...' : (editingProduct ? 'Save Changes' : 'Add Product to Store')}
              </button>
            </form>
          </div>
        </div>
        </div>
      {/* ADD / EDIT CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 h-dvh z-50 bg-[#2F3428]/70 backdrop-blur-sm overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-stone-200 shadow-2xl relative">
              <button
                onClick={closeCategoryModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>

              <h3 className="text-lg font-bold font-serif text-[#2F3428] border-b pb-2 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#525A43]" />
                <span>{editingCategory ? 'Update Category Details' : 'Add New Category'}</span>
              </h3>

              <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#2F3428] mb-1">
                      Category Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="e.g. Skin & Hair Care"
                      className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2F3428] mb-1">
                      Name in Urdu (اردو نام)
                    </label>
                    <input
                      type="text"
                      value={catUrduName}
                      onChange={(e) => setCatUrduName(e.target.value)}
                      placeholder="e.g. امراضِ جلد و بال"
                      className="w-full p-2.5 border border-stone-300 rounded-xl text-xs font-serif focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#2F3428] mb-1">
                      Badge / Tag (لیبل)
                    </label>
                    <input
                      type="text"
                      value={catBadge}
                      onChange={(e) => setCatBadge(e.target.value)}
                      placeholder="e.g. Daily Tonic, Skin Care"
                      className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2F3428] mb-1">
                      Classification Type Urdu (طبی نوعیت)
                    </label>
                    <input
                      type="text"
                      value={catFolderTypeUrdu}
                      onChange={(e) => setCatFolderTypeUrdu(e.target.value)}
                      placeholder="e.g. جلد و بالوں کی حفاظت"
                      className="w-full p-2.5 border border-stone-300 rounded-xl text-xs font-serif focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#2F3428] mb-1">
                    Folder Classification Type (English & Urdu description)
                  </label>
                  <input
                    type="text"
                    value={catFolderType}
                    onChange={(e) => setCatFolderType(e.target.value)}
                    placeholder="e.g. Dermatological Therapy & Hair Restoration (جلد و بال)"
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2F3428] mb-1">
                    Focus Area / Clinical Scope (علاج کا دائرہ کار)
                  </label>
                  <input
                    type="text"
                    value={catFocusArea}
                    onChange={(e) => setCatFocusArea(e.target.value)}
                    placeholder="e.g. Hair fall, dandruff, dry scalp, acne & skin glow"
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2F3428] mb-1">
                    Description (تفصیل)
                  </label>
                  <textarea
                    rows={2}
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    placeholder="Brief description of the remedies and herbs contained in this category..."
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#A1A696] focus:outline-none resize-none"
                  />
                </div>

                {/* Category Image */}
                <div>
                  <label className="block font-bold text-[#2F3428] mb-1">
                    Category Cover Image
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <label className={`flex-1 px-3 py-2 border-2 border-dashed border-[#525A43] rounded-xl hover:bg-stone-50 cursor-pointer transition-colors flex items-center justify-center gap-2 text-xs font-semibold text-[#525A43] ${isUploadingCatImage ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingCatImage ? 'Uploading Image...' : 'Upload Image from PC'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCatImageUpload}
                        className="hidden"
                        disabled={isUploadingCatImage}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={catImageUrl}
                    onChange={(e) => setCatImageUrl(e.target.value)}
                    placeholder="Or enter Image URL: /products/LiverBoost.jpeg or https://..."
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                  />
                  {catImageUrl && (
                    <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-stone-300 shadow-xs">
                      <img
                        src={catImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/products/LiverBoost.jpeg';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeCategoryModal}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#525A43] hover:bg-[#3F4633] text-white font-bold transition-all shadow-md active:scale-95"
                  >
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
