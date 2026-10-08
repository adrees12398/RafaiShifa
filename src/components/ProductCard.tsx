import React from 'react';
import { Product } from '../types';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { getProductImageSrc } from '../lib/productImages';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  isInCart?: boolean;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  isInCart = false
}) => {
  const imageSrc = getProductImageSrc(product.imageUrl);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#A1A696]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      
      {/* Category Badge & Featured Tag */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#2F3428]/90 backdrop-blur-md text-[#A1A696] border border-[#A1A696]/30">
          {product.category}
        </span>
        {product.isFeatured && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#A1A696] text-[#2F3428] uppercase tracking-wider shadow-sm">
            Best Seller
          </span>
        )}
      </div>

      {/* Image Section */}
      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img 
          src={imageSrc} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 bg-stone-100"
          loading="lazy"
          onError={(e) => {
            // Fallback to default image if loading fails
            e.currentTarget.src = '/products/LiverBoost.jpeg';
          }}
        />
        <div className="absolute inset-0 bg-[#2F3428]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2.5 rounded-full bg-white text-[#2F3428] hover:bg-[#A1A696] font-semibold shadow-lg transition-colors flex items-center gap-1.5 text-xs"
          >
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Category badge */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-[#525A43] bg-[#525A43]/10 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Primary Urdu Name (Big & Readable) */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-[#2F3428] text-base sm:text-lg leading-snug font-serif group-hover:text-[#525A43] transition-colors cursor-pointer line-clamp-1"
          >
            {product.urduName || product.name}
          </h3>

          {/* English Subtitle */}
          <p className="text-xs text-stone-500 font-medium truncate">
            {product.name}
          </p>

          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Cash on Delivery Badge */}
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <span>🚚 پیسے گھر پہنچنے پر دیں (Cash on Delivery)</span>
          </div>
        </div>

        {/* Pricing & Order Action */}
        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-[#525A43]">
                Rs. {product.price}
              </span>
              <span className="text-[11px] font-bold text-stone-500 font-serif">
                ({product.price} روپے)
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-stone-400 line-through block">
                Rs. {product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all transform active:scale-95 shadow-sm cursor-pointer ${
              isInCart 
                ? 'bg-emerald-600 text-white' 
                : 'bg-[#525A43] text-white hover:bg-[#3F4633]'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>شامل ہو گیا</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>خریدیں / Order</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

// Memoize ProductCard to prevent unnecessary re-renders when product list changes
export const ProductCard = React.memo(ProductCardComponent, (prevProps, nextProps) => {
  // Only re-render if these specific props changed
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.name === nextProps.product.name &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.imageUrl === nextProps.product.imageUrl &&
    prevProps.isInCart === nextProps.isInCart
  );
});

ProductCard.displayName = 'ProductCard';
