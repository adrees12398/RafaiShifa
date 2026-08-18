import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { Order, ContactMessage, Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';

// Standard Firebase config - loaded from environment variables,
// with hardcoded fallback values so Firestore works even in deployed
// environments (e.g. AI Studio/Cloud Run) that do not inject VITE_* vars.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDG0YsPiApnWw53FPXR0UulB9AVlidMr2Y',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'rafaishifa-a0591.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'rafaishifa-a0591',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'rafaishifa-a0591.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '288702974324',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:288702974324:web:d51143e594da57f4c64421',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-QSX0QTYTL6'
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Local persistence storage keys for instant local fallback & seamless sync
const LOCAL_ORDERS_KEY = 'rafaishifa_orders_v1';
const LOCAL_MESSAGES_KEY = 'rafaishifa_messages_v1';
const LOCAL_PRODUCTS_KEY = 'rafaishifa_products_v1';

// Get local stored orders
const getLocalOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(LOCAL_ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
};
// Timeout helper to prevent infinite hanging on Firestore operations
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);

    promise.then(
      (result) => {
        clearTimeout(timer);
        resolve(result);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
};

// Place Order to Firestore & Local state

// Place Order to Firestore & Local state
export async function createOrder(
  orderData: Omit<Order, 'id' | 'orderId' | 'createdAt' | 'status'>
): Promise<Order> {
  const generatedId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const nowIso = new Date().toISOString();

  const newOrder: Order = {
    ...orderData,
    id: generatedId,
    orderId: generatedId,
    status: 'Pending',
    createdAt: nowIso
  };

  // Save locally first for zero-latency response
  const existingLocal = getLocalOrders();
  saveLocalOrders([newOrder, ...existingLocal]);

  // Firestore Write
  try {
    console.log('🔵 Attempting Firestore write...', { projectId: firebaseConfig.projectId, collection: 'orders' });
    const ordersRef = collection(db, 'orders');
    const firestoreData = {
      orderId: generatedId,
      customerName: orderData.customerName,
      phone: orderData.phone,
      address: orderData.address,
      cartItems: orderData.cartItems,
      totalPrice: orderData.totalPrice,
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      notes: orderData.notes || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    };

    console.log('🔵 Writing order data:', firestoreData);
    const docRef = await withTimeout(addDoc(ordersRef, firestoreData), 45000);
    console.log('✅ Firestore write successful. Document ID:', docRef.id);
    newOrder.id = docRef.id;
  } catch (err) {
    console.error('❌ Firestore write failed:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`Firestore Error: ${errorMessage}. Please check Firebase Console rules.`);
  }

  return newOrder;
}

// Subscribe or Fetch Real-time Orders
export function subscribeOrders(onUpdate: (orders: Order[]) => void): () => void {
  let unsubscribe = () => {};

  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('✅ Firestore: Received', snapshot.size, 'orders');
        
        const firestoreOrders: Order[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            orderId: data.orderId || d.id,
            customerName: data.customerName || 'Anonymous',
            phone: data.phone || 'N/A',
            address: data.address || 'N/A',
            cartItems: data.cartItems || [],
            totalPrice: Number(data.totalPrice) || 0,
            status: data.status || 'Pending',
            paymentMethod: data.paymentMethod || 'Cash on Delivery',
            notes: data.notes || '',
            createdAt: data.createdAt || new Date().toISOString()
          };
        });

        // Merge with local orders in case of offline additions
        const local = getLocalOrders();
        const mergedMap = new Map<string, Order>();
        
        // Add local first
        local.forEach((o) => mergedMap.set(o.orderId || o.id, o));
        // Firestore overrides
        firestoreOrders.forEach((o) => mergedMap.set(o.orderId || o.id, o));

        const mergedList = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        console.log('📊 Total orders (merged):', mergedList.length);
        onUpdate(mergedList);
      },
      (error) => {
        console.error('❌ Firestore snapshot error:', error);
        console.warn('Reading local fallback...');
        onUpdate(getLocalOrders());
      }
    );
  } catch (e) {
    console.error('❌ Firestore connection error:', e);
    onUpdate(getLocalOrders());
  }

  return unsubscribe;
}

// Quick connection check to surface Firestore status in the admin dashboard.
// Uses the Firestore REST API directly (simple HTTPS GET) so it works even if
// the gRPC-Web transport is slow to establish, and returns clear error messages.
export async function checkFirestoreConnection(): Promise<{ ok: boolean; message: string }> {
  const { projectId, apiKey } = firebaseConfig;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/orders?pageSize=1&key=${apiKey}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      return { ok: true, message: 'Connected to Firestore' };
    }
    const body = await res.text();
    return { ok: false, message: `HTTP ${res.status}: ${body.slice(0, 300)}` };
  } catch (err) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: msg };
  }
}

// Update Order Status in Firestore & Local storage
export async function updateOrderStatusInDb(
  orderDocIdOrOrderId: string,
  newStatus: 'Pending' | 'Delivered' | 'Cancelled' | 'Processing'
): Promise<void> {
  // Update local storage
  const localOrders = getLocalOrders();
  const updatedLocal = localOrders.map((ord) => {
    if (ord.id === orderDocIdOrOrderId || ord.orderId === orderDocIdOrOrderId) {
      return { ...ord, status: newStatus };
    }
    return ord;
  });
  saveLocalOrders(updatedLocal);

  // Update Firestore
  try {
    const orderRef = doc(db, 'orders', orderDocIdOrOrderId);
    await withTimeout(updateDoc(orderRef, { status: newStatus }), 30000);
  } catch (e) {
    console.warn('Firestore update failed, saved to local cache:', e);
  }
}

// Send Contact Message
export async function sendContactMessage(
  msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>
): Promise<void> {
  const newMsg: ContactMessage = {
    ...msg,
    id: 'MSG-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'Unread'
  };

  // Local storage backup
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify([newMsg, ...existing]));
  } catch {}

  // Firestore
  try {
    const messagesRef = collection(db, 'messages');
    await withTimeout(addDoc(messagesRef, {
      ...msg,
      createdAt: new Date().toISOString(),
      status: 'Unread',
      timestamp: serverTimestamp()
    }), 30000);
  } catch (e) {
    console.warn('Firestore message save note:', e);
  }
}

// Fetch Messages
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  try {
    const messagesRef = collection(db, 'messages');
    const snapshot = await getDocs(messagesRef);
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ContactMessage, 'id'>)
      }));
    }
  } catch {}

  try {
    return JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
  } catch {
    return [];
  }
}

// Products Catalog Management
export function getStoredProducts(): Product[] {
  try {
    const cached = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products locally:', e);
  }
}
