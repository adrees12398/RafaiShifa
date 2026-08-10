/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavTab, Product, CartItem } from './types';
import { getStoredProducts } from './lib/firebase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { BlogView } from './components/BlogView';
import { HelpView } from './components/HelpView';
import { TeamView } from './components/TeamView';
import { AdminView } from './components/AdminView';
import { CartModal } from './components/CartModal';
import { ProductDetailModal } from './components/ProductDetailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load Initial Products & Stored Cart
  useEffect(() => {
    setProducts(getStoredProducts());
    try {
      const savedCart = localStorage.getItem('rafaishifa_cart_v1');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Cart load error:', e);
    }
  }, []);

  // Save Cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('rafaishifa_cart_v1', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Cart save error:', e);
    }
  }, [cartItems]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartProductIds = cartItems.map((item) => item.product.id);

  return (
    <div className="min-h-screen bg-[#F9F9F6] text-[#2F3428] font-sans flex flex-col justify-between selection:bg-[#A1A696] selection:text-[#2F3428]">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminModal={() => setActiveTab('admin')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && (
          <HomeView
            products={products}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setSelectedProduct(p)}
            cartProductIds={cartProductIds}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'blog' && <BlogView />}

        {activeTab === 'help' && <HelpView />}

        {activeTab === 'team' && <TeamView />}

        {activeTab === 'admin' && (
          <AdminView
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            products={products}
            setProducts={setProducts}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Cart Drawer / Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Product Detail Quick View Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

    </div>
  );
}
