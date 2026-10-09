import React, { useState, useRef } from 'react';
import { Product, NavTab, CategoryFolderInfo } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialData';
import { ProductCard } from './ProductCard';
import { CategoryDetailView } from './CategoryDetailView';
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
  Check,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List
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
  imageUrl: string;
}

export const PREDEFINED_CATEGORY_FOLDERS: Record<string, CategoryFolderInfo> = {
  'All': {
    id: 'all',
    name: 'All',
    urduName: 'تمام ادویات کا مجموعہ',
    folderType: 'Master Catalog Archive (مرکزی مجموعہ)',
    folderTypeUrdu: 'مرکزی طبی مجموعہ',
    badge: 'Master Collection',
    description: 'Master directory containing every authenticated Unani remedy, prophetic formula, and herbal oil in the store.',
    focusArea: 'Full store inventory & comprehensive holistic healthcare',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  },
  'Tib-e-Nabvi Special': {
    id: 'tib-e-nabvi',
    name: 'Tib-e-Nabvi Special',
    urduName: 'طبِ نبوی خاص',
    folderType: 'Prophetic Medicine & Sunnah Formulations (نبوی و اسلامی طریقہ علاج)',
    folderTypeUrdu: 'سنتِ نبوی و اسلامی علاج',
    badge: 'Prophetic Cures',
    description: 'Pure cold-pressed Kalonji oil, Sidr honey blends, Talbina, and classical prophetic remedies.',
    focusArea: 'Immune revival, respiratory relief & prophetic sunnah cures',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
  },
  'Heart & Digestion': {
    id: 'heart-digestion',
    name: 'Heart & Digestion',
    urduName: 'امراضِ قلب و معدہ',
    folderType: 'Cardiovascular & Gastrointestinal Care (ہاضمہ، جگر اور امراضِ قلب)',
    folderTypeUrdu: 'ہاضمہ، جگر و امراضِ قلب',
    badge: 'Internal Health',
    description: 'LiverBoost, Gestrocare syrups, digestive enzyme formulas, and natural heart circulation tonics.',
    focusArea: 'Fatty liver, acidity, cholesterol, gastric relief & vascular circulation',
    imageUrl: '/products/LiverBoost.jpeg'
  },
  'Immunity & Daily Wellness': {
    id: 'immunity-wellness',
    name: 'Immunity & Daily Wellness',
    urduName: 'قوتِ مدافعت و عمومی صحت',
    folderType: 'Immune Defense & Vitality Restoration (قوتِ مدافعت و بحالیِ توانائی)',
    folderTypeUrdu: 'قوتِ مدافعت و بحالیِ توانائی',
    badge: 'Vitality Tonic',
    description: 'Herbal multivitamins, natural stamina tonics, and restorative compounds for daily energy and physical vitality.',
    focusArea: 'Daily stamina, physical weakness, fatigue & natural immune defense',
    imageUrl: '/products/jawahri.jpeg'
  },
  'Joint Care & Oils': {
    id: 'joint-care',
    name: 'Joint Care & Oils',
    urduName: 'جوڑوں کے امراض و روغنیات',
    folderType: 'Musculoskeletal Therapy & Pain Relief (جوڑوں، اعصاب و درد کش روغنیات)',
    folderTypeUrdu: 'جوڑوں، اعصاب و درد کش روغنیات',
    badge: 'Pain Relief',
    description: 'Roghan-e-Balsan, Zafrani oils, and warming herbal liniments for joint flexibility, arthritis, and nerves.',
    focusArea: 'Arthritis, back pain, sciatica, knee stiffness & nerve soothing',
    imageUrl: '/products/zafrani.jpeg'
  },
  'Herbal Teas & Extracts': {
    id: 'teas-extracts',
    name: 'Herbal Teas & Extracts',
    urduName: 'ہربل چائے و عرقیات',
    folderType: 'Botanical Decoctions & Pure Distillates (خالص عرقیات، ہربل قہوہ و جوشاندہ)',
    folderTypeUrdu: 'خالص عرقیات و ہربل قہوہ',
    badge: 'Pure Extracts',
    description: 'SlimAura botanical teas, detox infusions, and traditionally hydro-distilled pure botanical essences.',
    focusArea: 'Weight management, metabolic detox & deep organic cleansing',
    imageUrl: '/products/SlimAura.jpeg'
  }
};

interface HomeViewProps {
  products: Product[];
  categories?: CategoryFolderInfo[];
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  cartProductIds: string[];
  setActiveTab: (tab: NavTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategoryScreen?: string | null;
  setActiveCategoryScreen?: (cat: string | null) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  categories: propCategories = [],
  onAddToCart,
  onQuickView,
  cartProductIds,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  activeCategoryScreen: externalActiveCategoryScreen,
  setActiveCategoryScreen: externalSetActiveCategoryScreen
}) => {
  const [internalCategoryScreen, setInternalCategoryScreen] = useState<string | null>(null);
  const activeCategoryScreen = externalActiveCategoryScreen !== undefined ? externalActiveCategoryScreen : internalCategoryScreen;
  const setActiveCategoryScreen = externalSetActiveCategoryScreen || setInternalCategoryScreen;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [isCategoryGridExpanded, setIsCategoryGridExpanded] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleOpenCategory = (catName: string) => {
    setSelectedCategory(catName);
    setActiveCategoryScreen(catName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Master 'All' master directory entry
  const masterAllFolder: CategoryFolderInfo = PREDEFINED_CATEGORY_FOLDERS['All'];

  // Base list from Firestore / props or fallback to INITIAL_CATEGORIES
  const baseCategoryList = (propCategories && propCategories.length > 0)
    ? propCategories
    : INITIAL_CATEGORIES;

  // Ensure 'All' is at the beginning of the categories list
  const hasAllInList = baseCategoryList.some((c) => c.name.toLowerCase() === 'all');
  const categoryFolders: CategoryFolderInfo[] = [
    ...(hasAllInList ? [] : [masterAllFolder]),
    ...baseCategoryList
  ];

  const activeFolder = categoryFolders.find(
    (c) => c.name.toLowerCase() === selectedCategory.toLowerCase()
  ) || categoryFolders[0] || masterAllFolder;

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

  // Dedicated Category Screen View (When a specific category is clicked)
  if (activeCategoryScreen) {
    const screenCategoryInfo = categoryFolders.find(c => c.name === activeCategoryScreen) || activeFolder;
    return (
      <CategoryDetailView
        categoryInfo={screenCategoryInfo}
        allCategories={categoryFolders}
        products={products}
        onAddToCart={onAddToCart}
        onQuickView={onQuickView}
        cartProductIds={cartProductIds}
        onBack={() => {
          setActiveCategoryScreen(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={(catName) => {
          handleOpenCategory(catName);
        }}
      />
    );
  }

  return (
    <div className="space-y-8 pb-16 pt-2">
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

        {/* Pansaar-Style Quick Category Circles Bar (App-Style Story Avatars) */}
        <div className="mt-4 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-[#A1A696]/30 shadow-sm relative">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#525A43] font-serif flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A1A696]" />
                <span>Shop by Category (کیٹیگری منتخب کریں)</span>
              </span>
              <span className="text-[10px] bg-[#525A43]/10 text-[#525A43] px-2 py-0.5 rounded-full font-bold">
                {categoryFolders.length} کل شعبہ جات
              </span>
            </div>

            {/* View All Grid Toggle & Controls */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={() => setIsCategoryGridExpanded(!isCategoryGridExpanded)}
                className="text-[11px] font-bold text-[#525A43] hover:text-[#2F3428] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-stone-200 shadow-2xs"
                title={isCategoryGridExpanded ? "Switch to single line scroll" : "Show all categories in a grid"}
              >
                {isCategoryGridExpanded ? (
                  <>
                    <List className="w-3 h-3 text-[#525A43]" />
                    <span>ایک لائن (Scroll)</span>
                  </>
                ) : (
                  <>
                    <LayoutGrid className="w-3 h-3 text-[#525A43]" />
                    <span>تمام کیٹیگریز دیکھیں (All {categoryFolders.length})</span>
                  </>
                )}
              </button>

              {/* Arrow navigation buttons for horizontal scroll mode */}
              {!isCategoryGridExpanded && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scrollCategories('left')}
                    aria-label="Scroll categories left"
                    className="p-1 rounded-lg bg-stone-100 hover:bg-[#525A43] hover:text-white text-stone-600 transition-colors border border-stone-200 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => scrollCategories('right')}
                    aria-label="Scroll categories right"
                    className="p-1 rounded-lg bg-stone-100 hover:bg-[#525A43] hover:text-white text-stone-600 transition-colors border border-stone-200 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* If Grid Expanded: Show all categories in a clean multi-row responsive grid */}
          {isCategoryGridExpanded ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 pt-2">
              {categoryFolders.map((folder) => {
                const isSelected = selectedCategory === folder.name;
                const count = folder.name === 'All' 
                  ? products.length 
                  : products.filter(p => p.category === folder.name).length;

                return (
                  <button
                    key={folder.name}
                    onClick={() => handleOpenCategory(folder.name)}
                    className="group flex flex-col items-center text-center p-2 rounded-2xl hover:bg-stone-50 transition-all cursor-pointer focus:outline-none"
                  >
                    {/* Round Category Avatar with Ring */}
                    <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 transition-all duration-300 ${
                      isSelected 
                        ? 'ring-3 ring-[#525A43] ring-offset-2 scale-105 shadow-md bg-[#525A43]/15' 
                        : 'ring-1.5 ring-stone-200 group-hover:ring-[#A1A696] group-hover:scale-105 bg-stone-50'
                    }`}>
                      <img
                        src={folder.imageUrl}
                        alt={folder.name}
                        className="w-full h-full rounded-full object-cover bg-stone-100"
                        onError={(e) => {
                          e.currentTarget.src = '/products/LiverBoost.jpeg';
                        }}
                      />
                      {isSelected && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#525A43] text-white flex items-center justify-center text-[9px] shadow-sm border border-white font-bold">
                          ✓
                        </span>
                      )}
                    </div>

                    <span className={`mt-1.5 text-xs font-bold font-serif leading-tight transition-colors line-clamp-1 ${
                      isSelected ? 'text-[#525A43]' : 'text-[#2F3428] group-hover:text-[#525A43]'
                    }`}>
                      {folder.name === 'All' ? 'سب ادویات' : (folder.urduName || folder.name)}
                    </span>
                    <span className="text-[10px] text-stone-500 font-sans leading-none mt-0.5 truncate w-full">
                      {folder.name === 'All' ? 'All Products' : folder.name}
                    </span>
                    <span className={`mt-1 text-[8px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-[#525A43] text-white' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {count} {count === 1 ? 'dawa' : 'dawayi'}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Scrollable Row with Left/Right arrow overlay buttons and mouse wheel support */
            <div className="relative group/scroll">
              {/* Left Arrow Overlay Button for single-line scroll */}
              <button
                onClick={() => scrollCategories('left')}
                aria-label="Previous categories"
                className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 text-[#525A43] hover:bg-[#525A43] hover:text-white shadow-md border border-stone-200 flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div 
                ref={categoryScrollRef}
                onWheel={(e) => {
                  if (e.deltaY !== 0 && categoryScrollRef.current) {
                    categoryScrollRef.current.scrollLeft += e.deltaY;
                  }
                }}
                className="flex items-start gap-3 sm:gap-5 overflow-x-auto pb-2 scroll-smooth pt-1 px-4 scrollbar-thin scrollbar-thumb-stone-300 hover:scrollbar-thumb-[#525A43]"
              >
                {categoryFolders.map((folder) => {
                  const isSelected = selectedCategory === folder.name;
                  const count = folder.name === 'All' 
                    ? products.length 
                    : products.filter(p => p.category === folder.name).length;

                  return (
                    <button
                      key={folder.name}
                      onClick={() => handleOpenCategory(folder.name)}
                      className="group flex flex-col items-center text-center shrink-0 w-20 sm:w-24 cursor-pointer focus:outline-none transition-all"
                    >
                      {/* Round Category Avatar with Ring */}
                      <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 transition-all duration-300 ${
                        isSelected 
                          ? 'ring-3 ring-[#525A43] ring-offset-2 scale-105 shadow-md bg-[#525A43]/15' 
                          : 'ring-1.5 ring-stone-200 group-hover:ring-[#A1A696] group-hover:scale-105 bg-stone-50'
                      }`}>
                        <img
                          src={folder.imageUrl}
                          alt={folder.name}
                          className="w-full h-full rounded-full object-cover bg-stone-100"
                          onError={(e) => {
                            e.currentTarget.src = '/products/LiverBoost.jpeg';
                          }}
                        />
                        {isSelected && (
                          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#525A43] text-white flex items-center justify-center text-[9px] shadow-sm border border-white font-bold">
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Title & Badge */}
                      <span className={`mt-1.5 text-xs font-bold font-serif leading-tight line-clamp-1 transition-colors ${
                        isSelected ? 'text-[#525A43]' : 'text-[#2F3428] group-hover:text-[#525A43]'
                      }`}>
                        {folder.name === 'All' ? 'سب ادویات' : (folder.urduName || folder.name)}
                      </span>
                      <span className="text-[10px] text-stone-500 font-sans leading-none mt-0.5 truncate w-full">
                        {folder.name === 'All' ? 'All Products' : folder.name}
                      </span>
                      <span className={`mt-1 text-[8px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-[#525A43] text-white' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {count} {count === 1 ? 'dawa' : 'dawayi'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Arrow Overlay Button for single-line scroll */}
              <button
                onClick={() => scrollCategories('right')}
                aria-label="Next categories"
                className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 text-[#525A43] hover:bg-[#525A43] hover:text-white shadow-md border border-stone-200 flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Voice Note & Direct WhatsApp Order Banner for Illiterate / Elderly / Non-Tech Users */}
      <section className="max-w-4xl mx-auto w-full px-2 sm:px-4">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-[#525A43] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl border border-emerald-600/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-md text-emerald-300 flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
              <PhoneCall className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse text-emerald-300" />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-400 text-[#2F3428] font-black text-[10px] uppercase tracking-wider mb-1">
                آسان آرڈر سروس • Voice Order
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold font-serif leading-tight">
                پڑھنے یا آرڈر کرنے میں مشکل ہے؟
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 mt-0.5">
                واٹس ایپ پر صرف وائس میسج (آواز کا میسج) بھیجیں یا کال کریں — ہم خود آرڈر لکھ لیں گے!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <a
              href="https://wa.me/923004652599?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%DB%8C%DA%A9%D9%85!%20%D9%85%D8%AC%DA%BE%DB%92%20%D8%AF%D9%88%D8%A7%D8%A6%DB%8C%20%DA%A9%D8%A7%20%D8%A2%D8%B1%DA%88%D8%B1%20%DA%A9%D8%B1%D9%86%D8%A7%20%DB%81%DB%92"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-4 sm:px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <span>💬 واٹس ایپ پر آرڈر</span>
            </a>
            <a
              href="tel:+923004652599"
              className="px-4 sm:px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>📞 0300-4652599</span>
            </a>
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

      {/* Pansaar-Style Visual Category Collections Showcase */}
      <section id="category-folders-section" className="space-y-6 pt-2">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#525A43]/10 text-[#525A43] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#525A43]" />
              <span>طبی زمرہ جات اور بیماریاں | Health Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F3428] tracking-tight font-serif">
              اپنی بیماری یا ضرورت کا شعبہ چنیں
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl font-serif">
              جس بیماری کی دوائی چاہیے اس کیٹیگری پر کلک کریں، آگے تمام ادویات اور قیمتیں مل جائیں گی۔
            </p>
          </div>

          {/* Reset / All Categories Shortcut */}
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
              <span>تمام زمرہ جات دیکھیں ({products.length})</span>
            </button>
          )}
        </div>

        {/* Pansaar-Style Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-1">
          {categoryFolders.map((folder) => {
            const isSelected = selectedCategory === folder.name;
            const count = folder.name === 'All' 
              ? products.length 
              : products.filter(p => p.category === folder.name).length;

            return (
              <div
                key={folder.name}
                onClick={() => handleOpenCategory(folder.name)}
                className={`group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-xl transform hover:-translate-y-1 ${
                  isSelected 
                    ? 'border-[#525A43] ring-4 ring-[#525A43]/10 shadow-lg' 
                    : 'border-stone-200 hover:border-[#A1A696]'
                }`}
              >
                {/* Visual Image Header */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-stone-100">
                  <img
                    src={folder.imageUrl}
                    alt={folder.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = '/products/LiverBoost.jpeg';
                    }}
                  />
                  
                  {/* Dark Gradient Overlay for Crisp Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-between p-4 sm:p-5 text-white">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#2F3428] backdrop-blur-md shadow-sm">
                        {folder.badge || 'خالص یونانی دوا'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#525A43]/90 text-white backdrop-blur-md font-mono border border-white/20">
                        {count} {count === 1 ? 'دوا' : 'ادویات'}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-serif text-[#A1A696] font-bold block mb-0.5">
                        {folder.urduName}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-white leading-tight">
                        {folder.name === 'All' ? 'تمام ادویات (All Remedies)' : folder.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  
                  {/* Simple Urdu Classification / Focus */}
                  <div className={`p-3 rounded-xl border transition-all ${
                    isSelected 
                      ? 'bg-[#525A43]/10 border-[#525A43]/30' 
                      : 'bg-[#F9F9F6] border-[#A1A696]/20'
                  }`}>
                    <div className="text-xs sm:text-sm font-bold text-[#2F3428] font-serif leading-snug">
                      {folder.folderTypeUrdu || folder.urduName}
                    </div>
                    <div className="text-[11px] text-stone-500 font-sans mt-0.5 truncate">
                      {folder.name}
                    </div>
                  </div>

                  {/* Simple Benefit Description */}
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {folder.focusArea || folder.description}
                  </p>

                  {/* Cash on Delivery Trust Badge */}
                  <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 font-bold">
                    <span>🚚 کیش آن ڈیلیوری - دوائی ملنے پر پیسے دیں</span>
                  </div>

                  {/* Obvious Action Button */}
                  <div className="pt-2 border-t border-stone-100">
                    <div className="w-full py-2.5 px-4 rounded-xl bg-[#525A43] group-hover:bg-[#3F4633] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer">
                      <span>👉 تمام ادویات دیکھیں اور آرڈر کریں</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Search Results Section (Only visible when user actively searches on Home) */}
      {searchQuery ? (
        <section id="search-results-section" className="space-y-6 pt-2">
          <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-[#525A43]/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#525A43] text-white flex items-center justify-center shadow-sm shrink-0">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#525A43]/10 text-[#525A43]">
                  Search Results
                </span>
                <h3 className="text-base sm:text-lg font-bold font-serif text-[#2F3428] mt-1">
                  Found {filteredProducts.length} {filteredProducts.length === 1 ? 'remedy' : 'remedies'} for &ldquo;{searchQuery}&rdquo;
                </h3>
              </div>
            </div>

            <button
              onClick={() => setSearchQuery('')}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2F3428] text-xs font-bold flex items-center gap-1.5 transition-colors border border-stone-300 shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-stone-500" />
              <span>Clear Search</span>
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#2F3428]">
                No remedies matching &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Try checking for typos or tap any category folder above to explore our remedies.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 px-4 py-2 rounded-xl bg-[#525A43] text-white text-xs font-bold shadow-sm"
              >
                Clear Search &amp; View Folders
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
      ) : (
        /* When not searching, SINGLE ITEMS ARE HIDDEN FROM HOME SCREEN. Only category folders are shown! */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#A1A696]/30 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#525A43]/10 text-[#525A43] flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#2F3428]">
              Select Any Category Folder to View All Remedies
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto mt-1">
              Tap any category folder above to open its dedicated screen, view all formulation types (oils, syrups, majuns, powders), and explore complete remedies within that category.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categoryFolders.map((folder) => (
              <button
                key={folder.name}
                onClick={() => handleOpenCategory(folder.name)}
                className="px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-[#525A43] text-stone-700 hover:text-white text-xs font-bold transition-all cursor-pointer border border-stone-200 flex items-center gap-1.5 shadow-2xs"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>{folder.name === 'All' ? 'View Master Catalog' : folder.name}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}

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
