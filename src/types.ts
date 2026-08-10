export type NavTab = 'home' | 'blog' | 'help' | 'team' | 'admin';

export interface Product {
  id: string;
  name: string;
  urduName?: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  fullDescription: string;
  dosage: string;
  ingredients: string[];
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  inStock: boolean;
  unit?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  cartItems: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Delivered' | 'Cancelled' | 'Processing';
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer / JazzCash / EasyPaisa';
  notes?: string;
  createdAt: string; // ISO string or format
}

export interface BlogPost {
  id: string;
  title: string;
  titleUrdu?: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  qualification: string;
  credentialsList?: string[];
  experience: string;
  specialty: string;
  specialtiesList?: string[];
  bio: string;
  imageUrl: string;
  isHeadPhysician?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt?: string;
  status?: 'Unread' | 'Read';
}
