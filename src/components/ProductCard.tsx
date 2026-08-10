import React from 'react';
import { Product } from '../types';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  isInCart = false
}) => {
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
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
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
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Urdu Title & Name */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-[#525A43] bg-[#A1A696]/15 px-2 py-0.5 rounded border border-[#A1A696]/30 font-serif">
              {product.urduName || 'یونانی دوا'}
            </span>
            <div className="flex items-center gap-1 text-xs text-[#525A43] font-bold">
              <Star className="w-3.5 h-3.5 fill-[#A1A696] text-[#A1A696]" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-[#2F3428] text-base leading-snug group-hover:text-[#525A43] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Order Action */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-[#525A43]">
                Rs. {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  Rs. {product.originalPrice}
                </span>
              )}
            </div>
            {product.unit && (
              <span className="text-[11px] text-stone-500 block">
                {product.unit}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all transform active:scale-95 shadow-sm ${
              isInCart 
                ? 'bg-[#A1A696] text-[#2F3428] hover:bg-white' 
                : 'bg-[#525A43] text-white hover:bg-[#3F4633]'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4 text-[#2F3428]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Order Now</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
