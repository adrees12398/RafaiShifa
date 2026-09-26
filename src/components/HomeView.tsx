import React, { useState } from 'react';
import { Product, NavTab } from '../types';
import { ProductCard } from './ProductCard';
import { getProductImageSrc } from '../lib/productImages';
import { 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Leaf, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  PackageCheck, 
  SlidersHorizontal,
  Search,
  X,
  Folder,
  FolderOpen,
  FolderArchive,
  Layers,
  Activity,
  Check
} from 'lucide-react';

export interface CategoryFolderInfo {
  id: string;
  name: string;
  urduName: string;
  folderType: string;
  folderTypeUrdu: string;
  badge: string;
  description: string;
  focusArea: string;
}

export const PREDEFINED_CATEGORY_FOLDERS: Record<string, CategoryFolderInfo> = {
  'All': {
    id: 'all',
    name: 'All',
    urduName: 'تمام ادویات کا مرکزی فولڈر',
    folderType: 'Master Catalog Archive (مرکزی مجموعہ)',
    folderTypeUrdu: 'مرکزی طبی مجموعہ',
    badge: 'Master Archive',
    description: 'Master directory containing every authenticated Unani remedy, prophetic formula, and herbal oil in the store.',
    focusArea: 'Full store inventory & comprehensive holistic healthcare'
  },
  'Tib-e-Nabvi Special': {
    id: 'tib-e-nabvi',
    name: 'Tib-e-Nabvi Special',
    urduName: 'طبِ نبوی خاص',
    folderType: 'Prophetic Medicine & Sunnah Formulations (نبوی و اسلامی طریقہ علاج)',
    folderTypeUrdu: 'سنتِ نبوی و اسلامی علاج',
    badge: 'Prophetic Cures',
    description: 'Pure cold-pressed Kalonji oil, Sidr honey blends, Talbina, and classical prophetic remedies.',
    focusArea: 'Immune revival, respiratory relief & prophetic sunnah cures'
  },
  'Heart & Digestion': {
    id: 'heart-digestion',
    name: 'Heart & Digestion',
    urduName: 'امراضِ قلب و معدہ',
    folderType: 'Cardiovascular & Gastrointestinal Care (ہاضمہ، جگر اور امراضِ قلب)',
    folderTypeUrdu: 'ہاضمہ، جگر و امراضِ قلب',
    badge: 'Internal Health',
    description: 'LiverBoost, Gestrocare syrups, digestive enzyme formulas, and natural heart circulation tonics.',
    focusArea: 'Fatty liver, acidity, cholesterol, gastric relief & vascular circulation'
  },
  'Immunity & Daily Wellness': {
    id: 'immunity-wellness',
    name: 'Immunity & Daily Wellness',
    urduName: 'قوتِ مدافعت و عمومی صحت',
    folderType: 'Immune Defense & Vitality Restoration (قوتِ مدافعت و بحالیِ توانائی)',
    folderTypeUrdu: 'قوتِ مدافعت و بحالیِ توانائی',
    badge: 'Vitality Tonic',
    description: 'Herbal multivitamins, natural stamina tonics, and restorative compounds for daily energy and physical vitality.',
    focusArea: 'Daily stamina, physical weakness, fatigue & natural immune defense'
  },
  'Joint Care & Oils': {
    id: 'joint-care',
    name: 'Joint Care & Oils',
    urduName: 'جوڑوں کے امراض و روغنیات',
    folderType: 'Musculoskeletal Therapy & Pain Relief (جوڑوں، اعصاب و درد کش روغنیات)',
    folderTypeUrdu: 'جوڑوں، اعصاب و درد کش روغنیات',
    badge: 'Pain Relief',
    description: 'Roghan-e-Balsan, Zafrani oils, and warming herbal liniments for joint flexibility, arthritis, and nerves.',
    focusArea: 'Arthritis, back pain, sciatica, knee stiffness & nerve soothing'
  },
  'Herbal Teas & Extracts': {
    id: 'teas-extracts',
    name: 'Herbal Teas & Extracts',
    urduName: 'ہربل چائے و عرقیات',
    folderType: 'Botanical Decoctions & Pure Distillates (خالص عرقیات، ہربل قہوہ و جوشاندہ)',
    folderTypeUrdu: 'خالص عرقیات و ہربل قہوہ',
    badge: 'Pure Extracts',
    description: 'SlimAura botanical teas, detox infusions, and traditionally hydro-distilled pure botanical essences.',
    focusArea: 'Weight management, metabolic detox & deep organic cleansing'
  }
};

interface HomeViewProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  cartProductIds: string[];
  setActiveTab: (tab: NavTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onAddToCart,
  onQuickView,
  cartProductIds,
  setActiveTab,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const baseCategoryNames = [
    'All',
    'Tib-e-Nabvi Special',
    'Heart & Digestion',
    'Immunity & Daily Wellness',
    'Joint Care & Oils',
    'Herbal Teas & Extracts'
  ];

  const customCategories = Array.from(
    new Set(products.map((p) => p.category).filter((c) => c && !baseCategoryNames.includes(c)))
  );

  const categories = [...baseCategoryNames, ...customCategories];

  const categoryFolders: CategoryFolderInfo[] = categories.map((cat) => {
    if (PREDEFINED_CATEGORY_FOLDERS[cat]) {
      return PREDEFINED_CATEGORY_FOLDERS[cat];
    }
    return {
      id: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: cat,
      urduName: 'خصوصی طبی زمرہ',
      folderType: `Specialized Herbal Formulation (${cat})`,
      folderTypeUrdu: 'خصوصی طبی شعبہ',
      badge: 'Custom Category',
      description: `Specialized herbal preparations and remedies filed under ${cat}.`,
      focusArea: 'Targeted wellness and specialized treatment'
    };
  });

  const activeFolder = PREDEFINED_CATEGORY_FOLDERS[selectedCategory] || {
    id: selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: selectedCategory,
    urduName: 'خصوصی طبی زمرہ',
    folderType: `Specialized Herbal Formulation (${selectedCategory})`,
    folderTypeUrdu: 'خصوصی طبی شعبہ',
    badge: 'Category Folder',
    description: `Specialized herbal preparations filed under ${selectedCategory}.`,
    focusArea: 'Targeted wellness and specialized treatment'
  };

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
                src={products.length > 0 ? getProductImageSrc(products[0].imageUrl) : '/products/LiverBoost.jpeg'} 
                alt="RafaiShifa Herbal Remedies"
                className="w-full aspect-4/3 object-contain rounded-xl sm:rounded-2xl shadow-md"
                onError={(e) => {
                  e.currentTarget.src = '/products/LiverBoost.jpeg';
                }}
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

      {/* Modern Search & Discovery Bar */}
      <section id="search-bar-section" className="max-w-4xl mx-auto w-full px-2 sm:px-4">
        <div className="relative group">
          {/* Subtle Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#A1A696]/40 via-[#525A43]/30 to-[#A1A696]/40 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500 pointer-events-none" />

          {/* Search Input Container */}
          <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-[#A1A696]/40 group-hover:border-[#525A43]/60 focus-within:border-[#525A43] focus-within:ring-4 focus-within:ring-[#525A43]/10 shadow-xl transition-all duration-300 p-2 sm:p-2.5 flex items-center gap-2 sm:gap-3">
            {/* Search Icon */}
            <div className="pl-3 sm:pl-4 text-[#525A43] flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#525A43]" />
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search authentic medicine (e.g. Kalonji, LiverBoost, زعفران, Joint pain)..."
              className="flex-1 w-full bg-transparent text-xs sm:text-sm text-[#2F3428] placeholder-stone-400 font-medium focus:outline-none py-1.5 sm:py-2"
              aria-label="Search herbal products"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 sm:p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-[#2F3428] transition-colors shrink-0"
                title="Clear search"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Search Action CTA */}
            <a
              href="#products-section"
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#525A43] hover:bg-[#3F4633] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 hidden sm:inline" />
            </a>
          </div>
        </div>

        {/* Popular Trending Searches Chips */}
        <div className="mt-3 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-[#525A43] shrink-0 font-serif flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#A1A696]" />
            <span>Popular:</span>
          </span>
          {['LiverBoost', 'SlimAura', 'Zafran', 'Kalonji', 'Tilla-e-Azam', 'Growmax'].map((keyword) => {
            const isSelected = searchQuery.toLowerCase() === keyword.toLowerCase();
            return (
              <button
                key={keyword}
                onClick={() => {
                  setSearchQuery(isSelected ? '' : keyword);
                  if (!isSelected) {
                    setSelectedCategory('All');
                  }
                  const el = document.getElementById('products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-[#525A43] text-white border-[#525A43] shadow-sm'
                    : 'bg-white hover:bg-stone-50 text-[#2F3428] border-stone-200'
                }`}
              >
                {keyword}
              </button>
            );
          })}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors shrink-0 border border-red-200"
            >
              Reset ✕
            </button>
          )}
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

      {/* Interactive Category Folders Section */}
      <section id="category-folders-section" className="space-y-6 pt-2">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#525A43]/10 text-[#525A43] text-xs font-bold mb-2">
              <Folder className="w-3.5 h-3.5 text-[#525A43]" />
              <span>Medical Categories & Folders | طبی زمرہ جات</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F3428] tracking-tight font-serif">
              Browse by Category Folders
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Each folder represents a distinct therapeutic branch of Unani &amp; Prophetic medicine. Open any folder to explore its remedies, clinical classification, and ingredients.
            </p>
          </div>

          {/* Reset / All Folders Shortcut */}
          {selectedCategory !== 'All' && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                const el = document.getElementById('products-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2F3428] text-xs font-bold flex items-center gap-2 transition-all border border-stone-300 shadow-2xs cursor-pointer"
            >
              <FolderArchive className="w-4 h-4 text-[#525A43]" />
              <span>Show All Folders ({products.length})</span>
            </button>
          )}
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-1">
          {categoryFolders.map((folder) => {
            const isSelected = selectedCategory === folder.name;
            const count = folder.name === 'All' 
              ? products.length 
              : products.filter(p => p.category === folder.name).length;

            return (
              <div
                key={folder.name}
                onClick={() => {
                  setSelectedCategory(folder.name);
                  const el = document.getElementById('products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative text-left cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                {/* Physical Folder Tab Flap on Top */}
                <div className="flex items-end">
                  <div className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-t-2xl text-[11px] font-extrabold flex items-center gap-2 border-t-2 border-x-2 transition-all ${
                    isSelected
                      ? 'bg-[#525A43] text-white border-[#525A43] shadow-sm'
                      : 'bg-[#dedfd9] text-[#2F3428] border-stone-300 group-hover:bg-[#A1A696]/30'
                  }`}>
                    {isSelected ? (
                      <FolderOpen className="w-4 h-4 text-[#A1A696]" />
                    ) : (
                      <Folder className="w-4 h-4 text-[#525A43]" />
                    )}
                    <span className="uppercase tracking-wider font-mono text-[10px] sm:text-[11px]">
                      {folder.badge}
                    </span>
                  </div>
                  
                  {/* Folder Tab Notch Transition */}
                  <div className={`h-2 flex-1 border-b-2 transition-colors ${
                    isSelected ? 'border-[#525A43]' : 'border-stone-200'
                  }`} />
                </div>

                {/* Main Folder Body */}
                <div className={`p-5 sm:p-6 rounded-b-3xl rounded-tr-3xl border-2 transition-all flex flex-col justify-between flex-1 space-y-4 shadow-sm ${
                  isSelected
                    ? 'bg-white border-[#525A43] ring-4 ring-[#525A43]/10 shadow-xl'
                    : 'bg-white border-stone-200 group-hover:border-[#A1A696] group-hover:shadow-md'
                }`}>
                  
                  {/* Folder Title & Remedies Count */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className={`text-base sm:text-lg font-bold font-serif leading-tight transition-colors ${
                          isSelected ? 'text-[#525A43]' : 'text-[#2F3428] group-hover:text-[#525A43]'
                        }`}>
                          {folder.name === 'All' ? 'All Herbal Categories' : folder.name}
                        </h3>
                        <div className="text-xs font-serif font-semibold text-[#525A43] mt-0.5">
                          {folder.urduName}
                        </div>
                      </div>

                      {/* Remedies Count Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 font-mono ${
                        count > 0 
                          ? 'bg-[#A1A696]/20 text-[#525A43] border border-[#A1A696]/40' 
                          : 'bg-stone-100 text-stone-400'
                      }`}>
                        {count} {count === 1 ? 'Remedy' : 'Remedies'}
                      </span>
                    </div>

                    {/* Prominent "Which Type of Folder is it" Callout Box */}
                    <div className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                      isSelected 
                        ? 'bg-[#525A43]/10 border-[#525A43]/30' 
                        : 'bg-[#F9F9F6] border-[#A1A696]/20 group-hover:border-[#A1A696]/40'
                    }`}>
                      <div className="flex items-center justify-between text-[10px] text-[#525A43] font-bold uppercase tracking-wider mb-1">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#525A43]" />
                          <span>Which Type of Folder is it:</span>
                        </span>
                        <span className="font-serif normal-case text-stone-500 text-[10px]">{folder.folderTypeUrdu}</span>
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-[#2F3428] leading-snug">
                        {folder.folderType}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {folder.description}
                    </p>

                    {/* Focus Area Pill */}
                    <div className="text-[11px] text-[#525A43] bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-100 flex items-start gap-1.5">
                      <span className="font-bold shrink-0">Focus:</span>
                      <span className="text-stone-700 leading-tight">{folder.focusArea}</span>
                    </div>
                  </div>

                  {/* Folder Status / Open Action */}
                  <div className="pt-2 border-t border-stone-100">
                    {isSelected ? (
                      <div className="w-full py-2.5 px-4 rounded-xl bg-[#525A43] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                        <FolderOpen className="w-4 h-4 text-[#A1A696]" />
                        <span>Folder is Open &amp; Active</span>
                        <Check className="w-4 h-4 text-[#A1A696]" />
                      </div>
                    ) : (
                      <div className="w-full py-2.5 px-4 rounded-xl bg-stone-100 group-hover:bg-[#525A43] text-[#2F3428] group-hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all">
                        <Folder className="w-4 h-4" />
                        <span>Open Folder</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Catalog Products Section */}
      <section id="products-section" className="space-y-6 pt-4">
        
        {/* Active Folder Header Banner */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-[#525A43]/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#525A43] text-[#A1A696] flex items-center justify-center shadow-sm shrink-0">
              <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#A1A696]/20 text-[#525A43] border border-[#A1A696]/40">
                  Folder Type: {activeFolder.folderType}
                </span>
                <span className="text-xs text-stone-500 font-serif">
                  ({activeFolder.urduName})
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-[#2F3428] mt-1">
                Currently Opened Folder: <span className="text-[#525A43] font-black">{activeFolder.name === 'All' ? 'All Herbal Categories' : activeFolder.name}</span>
                <span className="text-xs font-normal text-stone-500 ml-2">
                  ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found)
                </span>
              </h3>
            </div>
          </div>

          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2F3428] text-xs font-bold flex items-center gap-1.5 transition-colors border border-stone-300 shrink-0 cursor-pointer"
            >
              <FolderArchive className="w-3.5 h-3.5 text-[#525A43]" />
              <span>Show All Folders</span>
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2F3428] tracking-tight font-serif">
              Products in this Category
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Pure Unani compounds, prophetic oils, and natural health supplements inside this folder.
            </p>
            {searchQuery && (
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#525A43]/10 text-[#525A43] border border-[#525A43]/20">
                  <Search className="w-3 h-3" />
                  <span>Found {filteredProducts.length} result{filteredProducts.length === 1 ? '' : 's'} for &ldquo;{searchQuery}&rdquo;</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 p-0.5 hover:bg-[#525A43]/20 rounded-full transition-colors"
                    aria-label="Clear active search"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}
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

        {/* Category Quick Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isCatSelected = selectedCategory === cat;
            const catCount = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isCatSelected
                    ? 'bg-[#525A43] text-white shadow-md border border-[#A1A696]'
                    : 'bg-white text-[#2F3428] hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {isCatSelected ? (
                  <FolderOpen className="w-3.5 h-3.5 text-[#A1A696]" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isCatSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                  {catCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#2F3428]">
              {searchQuery ? `No products matching "${searchQuery}"` : 'No products found'}
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              {searchQuery
                ? 'Try checking for typos, using general terms, or explore our popular remedies above.'
                : 'Try resetting your search query or selecting a different category.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#525A43] hover:bg-[#3F4633] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-grid-item">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                  isInCart={cartProductIds.includes(product.id)}
                />
              </div>
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
