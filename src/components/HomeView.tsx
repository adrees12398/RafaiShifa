import React, { useState } from 'react';
import { Product, NavTab } from '../types';
import { ProductCard } from './ProductCard';
import { 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Leaf, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  PackageCheck, 
  SlidersHorizontal 
} from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  cartProductIds: string[];
  setActiveTab: (tab: NavTab) => void;
  searchQuery: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onAddToCart,
  onQuickView,
  cartProductIds,
  setActiveTab,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const categories = [
    'All',
    'Tib-e-Nabvi Special',
    'Immunity & Daily Wellness',
    'Heart & Digestion',
    'Joint Care & Oils',
    'Herbal Teas & Extracts'
  ];

  // Filtering & Sorting
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.urduName && p.urduName.includes(searchQuery)) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Banner Section */}
      <section className="relative bg-[#525A43] text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#A1A696]/30 my-2">
        
        {/* Decorative Background Accents */}
        <div className="absolute -right-12 -top-12 w-64 h-64 sm:w-96 sm:h-96 bg-[#A1A696]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-64 h-64 sm:w-96 sm:h-96 bg-[#A1A696]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#3F4633] border border-[#A1A696]/40 text-[#A1A696] text-[10px] sm:text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#A1A696]" />
              <span className="line-clamp-1">Authentic Unani & Prophetic Herbal Formulations</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-serif">
              Natural Healing with <br />
              <span className="text-[#A1A696]">
                RafaiShifa Tib Remedies
              </span>
            </h1>

            <p className="text-stone-200 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-sans mx-auto lg:mx-0">
              Discover pure, standardized Unani medicines, cold-pressed Kalonji oils, organic Talbina blends, and therapeutic Majoons crafted under the direction of master Hakeems.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#products-section"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-[#A1A696] hover:bg-white text-[#2F3428] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3 shadow-xl transition-all transform active:scale-95"
              >
                <span>Shop Herbal Products</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>

              <button
                onClick={() => setActiveTab('blog')}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-4 rounded-xl bg-[#3F4633] hover:bg-[#2F3428] text-white border border-[#A1A696]/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>Read Tib Guides & Remedies</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-4 sm:pt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t border-[#3F4633] max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#A1A696] shrink-0" />
                <div className="text-center sm:text-left">
                  <div className="text-[10px] sm:text-xs font-bold text-white">100% Pure</div>
                  <div className="text-[9px] sm:text-[10px] text-stone-200">No Steroids</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#A1A696] shrink-0" />
                <div className="text-center sm:text-left">
                  <div className="text-[10px] sm:text-xs font-bold text-white">Hakeem Certified</div>
                  <div className="text-[9px] sm:text-[10px] text-stone-200">Unani Formulas</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2">
                <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#A1A696] shrink-0" />
                <div className="text-center sm:text-left">
                  <div className="text-[10px] sm:text-xs font-bold text-white">Cash on Delivery</div>
                  <div className="text-[9px] sm:text-[10px] text-stone-200">Across Pakistan</div>
                </div>
              </div>
            </div>

          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-2xl sm:rounded-3xl overflow-hidden bg-[#3F4633] p-1 border border-[#A1A696]/40 shadow-2xl">
              <img 
                src={products.length > 0 ? products[0].imageUrl : '/products/LiverBoost.jpeg'} 
                alt="RafaiShifa Herbal Remedies"
                className="w-full aspect-4/3 object-cover rounded-xl sm:rounded-2xl shadow-md"
              />
              <div className="p-3 sm:p-4 bg-[#2F3428] rounded-xl sm:rounded-2xl mt-1 border border-[#A1A696]/30 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold text-[#A1A696] block font-serif truncate">
                    {products.length > 0 ? products[0].urduName : 'یونانی دوا'}
                  </span>
                  <span className="text-[10px] sm:text-xs text-white font-medium truncate block">
                    {products.length > 0 ? products[0].name : 'Herbal Medicine'}
                  </span>
                </div>
                <button 
                  onClick={() => products.length > 0 && onQuickView(products[0])}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#A1A696] text-[#2F3428] text-[10px] sm:text-xs font-extrabold hover:bg-white shrink-0"
                >
                  View Detail
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Prophetic Hadith Banner */}
      <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#A1A696]/40 text-center max-w-4xl mx-auto shadow-sm">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[#525A43] font-serif font-bold text-xs sm:text-sm mb-2">
          <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-[#525A43]" />
          <span className="text-[11px] sm:text-sm">فرمانِ نبوی صلی اللہ علیہ وسلم</span>
          <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-[#525A43]" />
        </div>
        <blockquote className="text-sm sm:text-base md:text-lg font-serif text-[#2F3428] font-bold italic leading-relaxed">
          &ldquo;عليكم بهذِهِ الحبَّةِ السَّوداءِ ، فإنَّ فيها شِفاءً من كلِّ داءٍ إلَّا السَّامَ&rdquo;
        </blockquote>
        <p className="text-[10px] sm:text-xs md:text-sm text-stone-700 mt-2 font-sans font-medium">
          &ldquo;Use this Black Seed (Kalonji), for indeed in it is a cure for every disease except death.&rdquo; — Sahih al-Bukhari
        </p>
      </section>

      {/* Catalog Products Section */}
      <section id="products-section" className="space-y-6 pt-4">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F3428] tracking-tight font-serif">
              Our Herbal Products & Remedies
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Explore pure Unani compounds, prophetic oils, and natural health supplements.
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-semibold text-stone-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-[#2F3428] font-medium focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#525A43] text-white shadow-md border border-[#A1A696]'
                  : 'bg-white text-[#2F3428] hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#2F3428]">No products found</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Try resetting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#525A43] text-white text-xs font-bold"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                isInCart={cartProductIds.includes(product.id)}
              />
            ))}
          </div>
        )}

      </section>

      {/* Lead Physician Banner: Dr. Hakeem Hafiz Mohsin Ali */}
      <section className="bg-[#525A43] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 text-white border border-[#A1A696]/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-[#A1A696] shrink-0 shadow-md bg-[#3F4633]">
            <img 
              src="/products/hakeem-mohsin-ali.jpg" 
              alt="Dr. Hakeem Hafiz Mohsin Ali"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-2 text-center lg:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-[#A1A696]">
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#3F4633] border border-[#A1A696]/40 text-white">
                Gold Medalist
              </span>
              <span className="hidden sm:inline">• 25+ Years Experience</span>
              <span className="hidden md:inline">• National Councillor – Islamabad</span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold font-serif text-white">
              Chief Physician: Dr. Hakeem Hafiz Mohsin Ali
            </h3>
            <p className="text-[11px] sm:text-xs md:text-sm text-stone-200 leading-relaxed max-w-3xl mx-auto lg:mx-0">
              DHMS, DUMS, Fazil-e-Tibb. Specializing in Liver & Digestive Disorders, Chronic Diseases, Men & Women&apos;s Health, and Unani & Homeopathic Medicine. Combining traditional wisdom with modern evidence-based healthcare.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('team')}
            className="w-full lg:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#A1A696] hover:bg-white text-[#2F3428] font-extrabold text-[10px] sm:text-xs shrink-0 flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap"
          >
            <span>Read Full Credentials & Bio</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </section>

      {/* Why Choose RafaiShifa Section */}
      <section className="bg-[#2F3428] text-white rounded-3xl p-8 sm:p-12 space-y-8 border border-[#A1A696]/30 shadow-xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#A1A696] uppercase tracking-widest bg-[#525A43] px-3 py-1 rounded-full border border-[#A1A696]/30">
            Purity & Authenticity
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Why Trust RafaiShifa Herbal Medicine?
          </h2>
          <p className="text-xs sm:text-sm text-stone-200">
            Combining centuries-old Islamic Unani medicinal wisdom with rigorous modern purity testing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#3F4633] p-6 rounded-2xl border border-[#A1A696]/20 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#A1A696]/20 text-[#A1A696] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">100% Organic Ingredients</h3>
            <p className="text-xs text-stone-200 leading-relaxed">
              We source raw herbs, Sidr honey, and Kashmiri saffron directly from certified growers, ensuring zero heavy metal contamination.
            </p>
          </div>

          <div className="bg-[#3F4633] p-6 rounded-2xl border border-[#A1A696]/20 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#A1A696]/20 text-[#A1A696] flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Classical Unani Ratios</h3>
            <p className="text-xs text-stone-200 leading-relaxed">
              Prepared under the direct supervision of qualified BUMS Hakeems following authentic classical texts like Al-Qanun fi al-Tibb.
            </p>
          </div>

          <div className="bg-[#3F4633] p-6 rounded-2xl border border-[#A1A696]/20 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#A1A696]/20 text-[#A1A696] flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Free Hakeem Consultation</h3>
            <p className="text-xs text-stone-200 leading-relaxed">
              Not sure about your Mizaj? Submit a consultation request and our expert medical advisors will guide your dosage.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
