import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  X, 
  Star, 
  ShoppingBag, 
  CheckCircle2, 
  ShieldAlert, 
  Leaf, 
  Info, 
  Plus, 
  Minus 
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

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

  const imageSrc = getImageSrc(product.imageUrl);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2F3428]/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200" onClick={onClose}>
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-[#A1A696]/30 relative" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 text-[#2F3428] hover:bg-stone-100 flex items-center justify-center shadow-md transition-all"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image & Badges */}
          <div className="bg-[#F9F9F6] p-4 sm:p-6 flex flex-col justify-between relative min-h-[250px] sm:min-h-[300px]">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md my-auto aspect-square bg-white">
              <img 
                src={imageSrc} 
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/products/LiverBoost.jpeg';
                }}
              />
            </div>

            <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
              <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#525A43] text-white">
                {product.category}
              </span>
              <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-[#A1A696]/20 text-[#525A43] flex items-center gap-1 border border-[#A1A696]/30">
                <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 100% Herbal
              </span>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between space-y-4 sm:space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs sm:text-sm font-serif font-bold text-[#525A43] bg-[#A1A696]/15 px-2 sm:px-2.5 py-0.5 rounded border border-[#A1A696]/30 truncate">
                  {product.urduName}
                </span>
                <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#525A43] shrink-0">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#A1A696] text-[#A1A696]" />
                  <span>{product.rating}</span>
                  <span className="text-stone-400 text-[10px] sm:text-xs font-normal">({product.reviewsCount})</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#2F3428] tracking-tight">
                {product.name}
              </h2>

              <div className="mt-2 sm:mt-3 flex items-baseline gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl font-black text-[#525A43]">
                  Rs. {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs sm:text-sm text-stone-400 line-through">
                    Rs. {product.originalPrice}
                  </span>
                )}
                <span className="text-[10px] sm:text-xs text-stone-500">/ {product.unit || 'unit'}</span>
              </div>

              <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-[#2F3428] leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Dosage Box */}
              <div className="mt-4 sm:mt-5 p-3 sm:p-3.5 bg-[#F9F9F6] rounded-xl border border-[#A1A696]/30 space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#525A43] font-bold text-[11px] sm:text-xs">
                  <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#525A43]" />
                  <span>Recommended Dosage (مقدارِ خوراک):</span>
                </div>
                <p className="text-[10px] sm:text-xs text-[#2F3428] font-medium pl-5 sm:pl-6">
                  {product.dosage}
                </p>
              </div>

              {/* Ingredients */}
              <div className="mt-3 sm:mt-4">
                <h4 className="text-[10px] sm:text-xs font-bold text-[#2F3428] uppercase tracking-wider mb-2">
                  Key Ingredients (اجزاء):
                </h4>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {product.ingredients.map((ing, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-stone-100 text-[#2F3428] border border-stone-200"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart Controls */}
            <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4 border-t border-stone-100">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-xs font-bold text-[#2F3428]">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 sm:p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <span className="px-3 sm:px-4 text-sm font-bold text-[#2F3428]">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 sm:p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className={`w-full py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  added 
                    ? 'bg-[#A1A696] text-[#2F3428]' 
                    : 'bg-[#525A43] text-white hover:bg-[#3F4633]'
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2F3428]" />
                    <span>Added {quantity} Item(s) to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Add to Cart - Rs. {product.price * quantity}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-stone-500 pt-1">
                <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#525A43]" />
                <span>Cash on Delivery Available | Fast Delivery Across Pakistan</span>
              </div>
            </div>

          </div>

        </div>

      </div>
      </div>
    </div>
  );
};
