/**
 * Emergency Product Cleanup Script
 * 
 * Use this to completely clear all products from localStorage and Firestore
 * Run in browser console or call from React component
 */

import { db } from './lib/firebase';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';

/**
 * Clear all products from localStorage
 */
export function clearLocalStorageProducts(): void {
  try {
    localStorage.removeItem('rafaishifa_products_v2');
    localStorage.removeItem('rafaishifa_products_v1');
    localStorage.removeItem('product_images');
    console.log('✅ LocalStorage products cleared');
  } catch (e) {
    console.error('❌ Failed to clear localStorage:', e);
  }
}

/**
 * Clear all products from Firestore
 */
export async function clearFirestoreProducts(): Promise<void> {
  try {
    const catalogRef = doc(db, 'products/catalog');
    await setDoc(catalogRef, {
      items: [],
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Firestore products cleared');
  } catch (e) {
    console.error('❌ Failed to clear Firestore:', e);
    throw e;
  }
}

/**
 * Complete cleanup - localStorage + Firestore
 */
export async function clearAllProducts(): Promise<void> {
  console.log('🧹 Starting complete product cleanup...');
  
  // Step 1: Clear localStorage
  clearLocalStorageProducts();
  
  // Step 2: Clear Firestore
  try {
    await clearFirestoreProducts();
    console.log('✅ All products cleared successfully');
    console.log('🔄 Refreshing page in 2 seconds...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (e) {
    console.error('❌ Firestore cleanup failed. LocalStorage cleared but Firestore sync failed.');
    console.log('💡 Tip: Check Firebase Console manually or delete products through Admin Panel');
  }
}

// Make function available globally in browser console
if (typeof window !== 'undefined') {
  (window as any).clearAllProducts = clearAllProducts;
  (window as any).clearLocalProducts = clearLocalStorageProducts;
  (window as any).clearFirestoreProducts = clearFirestoreProducts;
}
