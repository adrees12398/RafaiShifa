import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { 
  ArrowLeft, 
  ChevronRight, 
  Layers, 
  Sparkles, 
  SlidersHorizontal, 
  Search, 
  X, 
  Check, 
  Leaf, 
  Droplet, 
  Package, 
  ShieldCheck, 
  PhoneCall, 
  FolderOpen,
  FolderArchive
} from 'lucide-react';
import type { CategoryFolderInfo } from './HomeView';

export interface CategorySubType {
  id: string;
  name: string;
  urduName: string;
  description: string;
  keywords: string[];
  badge?: string;
  iconType?: 'oil' | 'paste' | 'powder' | 'syrup' | 'pill' | 'tea' | 'leaf';
}

// Master map of subtypes for each category
export const CATEGORY_SUB_TYPES: Record<string, CategorySubType[]> = {
  'Tib-e-Nabvi Special': [
    {
      id: 'prophetic-oils',
      name: 'Prophetic & Cold-Pressed Oils',
      urduName: 'روغنیاتِ نبوی',
      description: 'Cold-pressed Kalonji oil, pure Balsan oil, and wild olive oil extracts.',
      keywords: ['oil', 'roghan', 'kalonji', 'balsan', 'olive', 'تیل', 'روغن'],
      badge: 'Sunnah Oils',
      iconType: 'oil'
    },
    {
      id: 'sidr-honey',
      name: 'Sidr Honey & Royal Pastes',
      urduName: 'شہد سدر اور معجونات',
      description: 'Pure Yemeni Sidr honey, Black seed infused honey, and therapeutic Sunnah pastes.',
      keywords: ['honey', 'sidr', 'majun', 'paste', 'شہد', 'معجون'],
      badge: 'Pure Honey',
      iconType: 'paste'
    },
    {
      id: 'herbal-seeds',
      name: 'Herbal Seeds, Grains & Talbina',
      urduName: 'حبوب، بیج و تلبینہ',
      description: 'Pure Nigella Sativa seeds, Fenugreek (Methi), and roasted barley Talbina.',
      keywords: ['seed', 'talbina', 'methi', 'grain', 'barley', 'تلبینہ', 'بیج'],
      badge: 'Organic Seeds',
      iconType: 'leaf'
    },
    {
      id: 'sunnah-tonics',
      name: 'Sunnah Tonics & Restoratives',
      urduName: 'مقویات و اکسیرِ نبوی',
      description: 'Holistic vitality preparations crafted according to prophetic healing traditions.',
      keywords: ['tonic', 'syrup', 'elixir', 'vitality', 'شربت', 'اکسیر'],
      badge: 'Vitality Tonic',
      iconType: 'syrup'
    }
  ],
  'Heart & Digestion': [
    {
      id: 'digestive-syrups',
      name: 'Digestive Syrups & Tonics',
      urduName: 'ہاضمہ سیرپ و شربت',
      description: 'Carminative elixirs, Gestrocare syrups, and natural gastric soothe formulations.',
      keywords: ['syrup', 'gestrocare', 'digest', 'gas', 'acidity', 'شربت', 'ہاضم'],
      badge: 'Gastric Care',
      iconType: 'syrup'
    },
    {
      id: 'liver-boost',
      name: 'Liver & Hepatic Care Formulations',
      urduName: 'مقوی جگر و صفراوی فارمولا',
      description: 'LiverBoost compounds, fatty liver detox, and bile balancing preparations.',
      keywords: ['liver', 'liverboost', 'jigar', 'hepatic', 'جگر', 'صفرا'],
      badge: 'Liver Vitality',
      iconType: 'pill'
    },
    {
      id: 'digestive-safoof',
      name: 'Digestive Safoof & Chooran',
      urduName: 'ہاضم سفوف و پھکی',
      description: 'Herbal powders, classical digestive churns, and bowel regulation powders.',
      keywords: ['safoof', 'powder', 'chooran', 'digestive', 'سفوف', 'پھکی'],
      badge: 'Herbal Churan',
      iconType: 'powder'
    },
    {
      id: 'cardio-tablets',
      name: 'Cardiovascular Qurs & Tablets',
      urduName: 'حبوب و ادویات برائے قلب',
      description: 'Herbal circulation tablets, natural cholesterol balance, and heart vitality Qurs.',
      keywords: ['heart', 'cardio', 'qurs', 'tablet', 'blood', 'circulation', 'دل', 'حبوب'],
      badge: 'Cardio Health',
      iconType: 'pill'
    }
  ],
  'Immunity & Daily Wellness': [
    {
      id: 'vitality-majuns',
      name: 'Vitality Majuns & Electuaries',
      urduName: 'معجون و خمیرہ جات',
      description: 'Jawahri, Majun Salab, Royal Jelly, and rich herbal stamina pastes.',
      keywords: ['majun', 'jawahri', 'khamira', 'salab', 'معجون', 'خمیرہ'],
      badge: 'Royal Majun',
      iconType: 'paste'
    },
    {
      id: 'herbal-vitamins',
      name: 'Herbal Multi-Vitamins & Capsules',
      urduName: 'ہربل وٹامنز و کیپسول',
      description: 'Pure Moringa, Ashwagandha, and organic herbal botanical capsules.',
      keywords: ['capsule', 'vitamin', 'moringa', 'ashwagandha', 'کیپسول', 'وٹامن'],
      badge: 'Botanical Cap',
      iconType: 'pill'
    },
    {
      id: 'stamina-tonics',
      name: 'Natural Stamina & Nerve Tonics',
      urduName: 'مقوی اعصاب و توانائی کے شربت',
      description: 'Physical endurance elixirs, anti-fatigue tonics, and mental focus formulas.',
      keywords: ['stamina', 'energy', 'nerve', 'tonic', 'طاقت', 'اعصاب'],
      badge: 'Nerve Stamina',
      iconType: 'syrup'
    },
    {
      id: 'kushta-minerals',
      name: 'Kushta & Compound Minerals',
      urduName: 'کشتہ جات و معدنی اکسیر',
      description: 'Classical Unani mineral calcinations and restorative Bhasmas.',
      keywords: ['kushta', 'mineral', 'gold', 'silver', 'bhasma', 'کشتہ'],
      badge: 'Pure Bhasma',
      iconType: 'leaf'
    }
  ],
  'Joint Care & Oils': [
    {
      id: 'medicated-liniments',
      name: 'Medicated Liniments & Massage Oils',
      urduName: 'درد کش تیل و مساج آئل',
      description: 'Zafrani oil, Balsan liniments, and warming botanical extracts for joints & nerves.',
      keywords: ['oil', 'zafrani', 'balsan', 'liniment', 'massage', 'تیل', 'روغن'],
      badge: 'Massage Oil',
      iconType: 'oil'
    },
    {
      id: 'joint-majun',
      name: 'Joint Restorative Majun & Pastes',
      urduName: 'معجون سورنجان و ازراقی',
      description: 'Classical anti-inflammatory Majoons for uric acid, joint stiffness, and sciatica.',
      keywords: ['majun', 'suranjan', 'paste', 'معجون', 'سورنجان'],
      badge: 'Joint Majun',
      iconType: 'paste'
    },
    {
      id: 'pain-relief-tablets',
      name: 'Herbal Pain Relief Tablets (Hab)',
      urduName: 'حب وجع المفاصل و درد کی گولیاں',
      description: 'Natural anti-arthritic herbal pills for backache, knee pain, and swelling.',
      keywords: ['tablet', 'hab', 'pill', 'pain', 'arthritis', 'حبوب', 'درد'],
      badge: 'Pain Relief Hab',
      iconType: 'pill'
    },
    {
      id: 'warming-balms',
      name: 'Warming Balms & Herbal Poultices',
      urduName: 'درد کش مرہم و لیپ',
      description: 'Topical soothing balms and penetrating herbal poultices for muscular ache.',
      keywords: ['balm', 'ointment', 'lep', 'poultice', 'مرہم', 'لیپ'],
      badge: 'Herbal Balm',
      iconType: 'leaf'
    }
  ],
  'Herbal Teas & Extracts': [
    {
      id: 'slimming-teas',
      name: 'Metabolic & Slimming Teas',
      urduName: 'ہربل قہوہ و فیٹ برنر',
      description: 'SlimAura botanical teas, green tea blends, and thermogenic metabolism boosters.',
      keywords: ['tea', 'slimaura', 'slim', 'fat', 'kahwa', 'چائے', 'قہوہ'],
      badge: 'Slimming Brew',
      iconType: 'tea'
    },
    {
      id: 'pure-distillates',
      name: 'Pure Hydro-Distillates (Arqiyyat)',
      urduName: 'خالص عرقیات و کشیدہ عرق',
      description: 'Traditionally hydro-distilled Arq Kasni, Arq Mako, and pure rose water.',
      keywords: ['arq', 'distillate', 'kasni', 'mako', 'rose', 'water', 'عرق'],
      badge: 'Pure Arq',
      iconType: 'syrup'
    },
    {
      id: 'joshanda-decoctions',
      name: 'Herbal Joshanda & Decoctions',
      urduName: 'جوشاندہ و دیسی قہوہ',
      description: 'Traditional soothing herbal infusions for throat, cough, and chest reset.',
      keywords: ['joshanda', 'decoction', 'cough', 'infusion', 'جوشاندہ'],
      badge: 'Herbal Joshanda',
      iconType: 'tea'
    },
    {
      id: 'metabolic-powders',
      name: 'Metabolic Detox Powders',
      urduName: 'ڈیٹوکس سفوف و ہربل پاؤڈر',
      description: 'Gut cleansing botanical powders and metabolic regulation blends.',
      keywords: ['powder', 'detox', 'cleanse', 'safoof', 'سفوف', 'ڈیٹوکس'],
      badge: 'Detox Safoof',
      iconType: 'powder'
    }
  ]
};

// Generic fallback subtypes for any custom category
const DEFAULT_SUB_TYPES: CategorySubType[] = [
  {
    id: 'syrups-tonics',
    name: 'Herbal Syrups & Tonics',
    urduName: 'شربت و مقویات',
    description: 'Liquid herbal preparations and classical tonics.',
    keywords: ['syrup', 'tonic', 'liquid', 'شربت'],
    badge: 'Herbal Syrups',
    iconType: 'syrup'
  },
  {
    id: 'medicated-oils',
    name: 'Medicated Oils & Liniments',
    urduName: 'طبی روغنیات',
    description: 'Therapeutic herbal oils and topical remedies.',
    keywords: ['oil', 'roghan', 'liniment', 'روغن', 'تیل'],
    badge: 'Herbal Oils',
    iconType: 'oil'
  },
  {
    id: 'powders-safoof',
    name: 'Herbal Powders & Safoof',
    urduName: 'سفوف و پھکی',
    description: 'Ground medicinal herbs and classical powders.',
    keywords: ['powder', 'safoof', 'سفوف'],
    badge: 'Herbal Safoof',
    iconType: 'powder'
  },
  {
    id: 'capsules-tablets',
    name: 'Capsules & Herbal Tablets',
    urduName: 'کیپسول و حبوب',
    description: 'Standardized botanical extract pills and tablets.',
    keywords: ['capsule', 'tablet', 'hab', 'کیپسول', 'حبوب'],
    badge: 'Tablets & Caps',
    iconType: 'pill'
  }
];

interface CategoryDetailViewProps {
  categoryInfo: CategoryFolderInfo;
  allCategories: CategoryFolderInfo[];
  products: Product[];
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  cartProductIds: string[];
  onBack: () => void;
  onSelectCategory: (catName: string) => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  categoryInfo,
  allCategories,
  products,
  onAddToCart,
  onQuickView,
  cartProductIds,
  onBack,
  onSelectCategory
}) => {
  const [selectedSubTypeId, setSelectedSubTypeId] = useState<string>('all');
  const [searchInCat, setSearchInCat] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Available subtypes for this category
  const subTypes: CategorySubType[] = useMemo(() => {
    return CATEGORY_SUB_TYPES[categoryInfo.name] || DEFAULT_SUB_TYPES;
  }, [categoryInfo.name]);

  // All products belonging to this category
  const categoryProducts = useMemo(() => {
    if (categoryInfo.name === 'All') return products;
    return products.filter((p) => p.category === categoryInfo.name);
  }, [products, categoryInfo.name]);

  // Check which products belong to a specific subtype
  const isProductInSubType = (product: Product, subType: CategorySubType): boolean => {
    const textToMatch = `${product.name} ${product.description || ''} ${product.fullDescription || ''} ${product.dosage || ''} ${(product.ingredients || []).join(' ')}`.toLowerCase();
    return subType.keywords.some((kw) => textToMatch.includes(kw.toLowerCase()));
  };

  // Filtered products based on selected subtype and internal search
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      // SubType filter
      if (selectedSubTypeId !== 'all') {
        const activeSubType = subTypes.find((s) => s.id === selectedSubTypeId);
        if (activeSubType && !isProductInSubType(product, activeSubType)) {
          return false;
        }
      }

      // Search query filter
      if (searchInCat.trim()) {
        const query = searchInCat.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesUrdu = product.urduName && product.urduName.includes(query);
        const matchesDesc = (product.description || '').toLowerCase().includes(query);
        if (!matchesName && !matchesUrdu && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [categoryProducts, selectedSubTypeId, searchInCat, sortBy, subTypes]);

  // Calculate counts for each subtype
  const subTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    subTypes.forEach((st) => {
      counts[st.id] = categoryProducts.filter((p) => isProductInSubType(p, st)).length;
    });
    return counts;
  }, [categoryProducts, subTypes]);

  const activeSubTypeObj = subTypes.find((s) => s.id === selectedSubTypeId);

  // Helper icon renderer
  const renderSubTypeIcon = (iconType?: string) => {
    switch (iconType) {
      case 'oil':
        return <Droplet className="w-5 h-5 text-amber-500" />;
      case 'paste':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'syrup':
        return <Droplet className="w-5 h-5 text-rose-500" />;
      case 'powder':
        return <Layers className="w-5 h-5 text-amber-600" />;
      case 'pill':
        return <Package className="w-5 h-5 text-indigo-500" />;
      case 'tea':
        return <Leaf className="w-5 h-5 text-emerald-500" />;
      default:
        return <Leaf className="w-5 h-5 text-[#525A43]" />;
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      
      {/* Top Breadcrumb & Back Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#A1A696]/30 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 font-medium">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-[#525A43] text-[#2F3428] hover:text-white font-bold transition-all border border-stone-200 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← تمام کیٹیگریز پر واپس جائیں (Back)</span>
          </button>
          <ChevronRight className="w-4 h-4 text-stone-300" />
          <span className="text-stone-400">Categories</span>
          <ChevronRight className="w-4 h-4 text-stone-300" />
          <span className="font-bold text-[#525A43] truncate max-w-[200px] sm:max-w-none">
            {categoryInfo.name}
          </span>
        </div>

        {/* Quick Switch to Other Categories Dropdown / Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Quick Switch:
          </span>
          {allCategories
            .filter((c) => c.name !== 'All' && c.name !== categoryInfo.name)
            .slice(0, 4)
            .map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  onSelectCategory(cat.name);
                  setSelectedSubTypeId('all');
                  setSearchInCat('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors shrink-0 border border-stone-200"
              >
                {cat.name}
              </button>
            ))}
        </div>
      </div>

      {/* Hero Category Header (Pansaar-Style Cover Banner) */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#525A43]/30 bg-[#2F3428] text-white">
        
        {/* Background Image with Dark Gradient Layer */}
        <div className="absolute inset-0">
          <img
            src={categoryInfo.imageUrl}
            alt={categoryInfo.name}
            className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
            onError={(e) => {
              e.currentTarget.src = '/products/LiverBoost.jpeg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2F3428] via-[#2F3428]/85 to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/95 text-[#2F3428] shadow-sm">
                {categoryInfo.badge}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#A1A696]/30 text-white backdrop-blur-md border border-white/20">
                {categoryProducts.length} {categoryProducts.length === 1 ? 'Remedy' : 'Remedies'} in Catalog
              </span>
            </div>

            <div>
              <span className="text-sm sm:text-base font-serif text-[#A1A696] font-bold block mb-1">
                {categoryInfo.urduName}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white tracking-tight leading-tight">
                {categoryInfo.name}
              </h1>
            </div>

            {/* Category Type Callout Box (Pansaar Category Classification) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-stone-100 max-w-xl">
              <div className="flex items-center justify-between text-[11px] text-[#A1A696] font-bold uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#A1A696]" />
                  <span>Category Type & Classification:</span>
                </span>
                <span className="font-serif normal-case text-white/80">{categoryInfo.folderTypeUrdu}</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white leading-snug">
                {categoryInfo.folderType}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {categoryInfo.description}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-[#A1A696]">
              <span className="font-bold text-white">Target Focus:</span>
              <span className="text-stone-300">{categoryInfo.focusArea}</span>
            </div>

          </div>

          {/* Return Home Shortcut Button */}
          <div className="self-stretch sm:self-auto shrink-0 flex flex-col gap-2">
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-[#2F3428] hover:bg-[#A1A696] hover:text-[#2F3428] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home View</span>
            </button>
            <div className="text-center sm:text-right text-[11px] text-stone-400">
              Free nationwide delivery on orders &gt; Rs. 3000
            </div>
          </div>
        </div>

      </section>

      {/* ALL TYPES OF THIS CATEGORY (PRIMARY FEATURE REQUEST) */}
      <section className="space-y-4 pt-2">
        
        {/* Section Heading */}
        <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#525A43]/10 text-[#525A43] text-xs font-bold mb-1.5">
              <Layers className="w-3.5 h-3.5 text-[#525A43]" />
              <span>Category Types & Formulations | اقسام و اقسامِ ادویات</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2F3428] font-serif">
              All Types in {categoryInfo.name}
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Select any formulation type below to instantly filter matching remedies and compounds.
            </p>
          </div>

          {selectedSubTypeId !== 'all' && (
            <button
              onClick={() => setSelectedSubTypeId('all')}
              className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2F3428] text-xs font-bold flex items-center gap-1.5 border border-stone-300 cursor-pointer transition-all"
            >
              <FolderArchive className="w-3.5 h-3.5 text-[#525A43]" />
              <span>Reset Type Filter (Show All)</span>
            </button>
          )}
        </div>

        {/* Quick Filter Pill Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSubTypeId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              selectedSubTypeId === 'all'
                ? 'bg-[#525A43] text-white shadow-md border border-[#A1A696]'
                : 'bg-white text-[#2F3428] hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>All Types</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
              selectedSubTypeId === 'all' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
            }`}>
              {categoryProducts.length}
            </span>
          </button>

          {subTypes.map((st) => {
            const isSelected = selectedSubTypeId === st.id;
            const count = subTypeCounts[st.id] || 0;

            return (
              <button
                key={st.id}
                onClick={() => setSelectedSubTypeId(st.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#525A43] text-white shadow-md border border-[#A1A696]'
                    : 'bg-white text-[#2F3428] hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>{st.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid of All Types Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {subTypes.map((st) => {
            const isSelected = selectedSubTypeId === st.id;
            const count = subTypeCounts[st.id] || 0;

            return (
              <div
                key={st.id}
                onClick={() => setSelectedSubTypeId(isSelected ? 'all' : st.id)}
                className={`group p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#525A43]/10 border-[#525A43] shadow-md ring-2 ring-[#525A43]/20'
                    : 'bg-white border-stone-200 hover:border-[#A1A696] hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs ${
                      isSelected ? 'bg-[#525A43] text-white' : 'bg-stone-100 group-hover:bg-[#525A43]/10'
                    }`}>
                      {renderSubTypeIcon(st.iconType)}
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#525A43] text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-serif text-[#525A43] font-bold block mb-0.5">
                      {st.urduName}
                    </span>
                    <h3 className="font-extrabold text-[#2F3428] text-sm leading-snug group-hover:text-[#525A43] transition-colors">
                      {st.name}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {st.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className={`font-bold ${isSelected ? 'text-[#525A43]' : 'text-stone-500'}`}>
                    {isSelected ? 'Active Type' : 'Filter by this Type'}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-[#525A43] text-white' : 'bg-stone-100 text-stone-400 group-hover:text-[#525A43]'
                  }`}>
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* PRODUCTS SECTION SHOWING REMEDIES OF THIS CATEGORY / TYPE */}
      <section className="space-y-5 pt-4">
        
        {/* Active Filter Bar & Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#525A43]/10 text-[#525A43]">
                {selectedSubTypeId === 'all' ? 'All Types Selected' : 'Filtered by Type'}
              </span>
              <span className="text-xs text-stone-500">
                Found {filteredProducts.length} {filteredProducts.length === 1 ? 'remedy' : 'remedies'}
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif text-[#2F3428] mt-1">
              {activeSubTypeObj ? (
                <>
                  Showing: <span className="text-[#525A43] font-black">{activeSubTypeObj.name}</span>
                  <span className="text-xs font-serif text-stone-500 ml-2">({activeSubTypeObj.urduName})</span>
                </>
              ) : (
                <>
                  Showing All Remedies in <span className="text-[#525A43] font-black">{categoryInfo.name}</span>
                </>
              )}
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* In-Category Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchInCat}
                onChange={(e) => setSearchInCat(e.target.value)}
                placeholder="Search in this category..."
                className="pl-8 pr-7 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2F3428] focus:ring-2 focus:ring-[#525A43] focus:outline-none w-full sm:w-56"
              />
              {searchInCat && (
                <button
                  onClick={() => setSearchInCat('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-[#2F3428] font-bold focus:ring-2 focus:ring-[#525A43] focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 sm:p-12 text-center border border-stone-200 space-y-3 shadow-2xs">
            <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#2F3428]">
              {searchInCat 
                ? `No remedies matching "${searchInCat}"` 
                : `No remedies currently listed under ${activeSubTypeObj?.name || 'this type'}`}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              You can reset the formulation type filter to view all remedies in {categoryInfo.name}, or contact our Hakeem for custom compound preparations.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedSubTypeId('all');
                  setSearchInCat('');
                }}
                className="px-4 py-2 rounded-xl bg-[#525A43] hover:bg-[#3F4633] text-white text-xs font-bold transition-colors shadow-sm"
              >
                Show All {categoryInfo.name} Remedies ({categoryProducts.length})
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2F3428] text-xs font-bold transition-colors border border-stone-200"
              >
                Explore Other Categories
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id}>
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

      {/* Explore Other Categories Slider */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-lg font-bold font-serif text-[#2F3428]">
              Explore Other Herbal Categories
            </h3>
            <p className="text-xs text-stone-500">
              Discover authentic formulations across our complete Tibb and herbal collection.
            </p>
          </div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-[#525A43] hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {allCategories
            .filter((c) => c.name !== 'All' && c.name !== categoryInfo.name)
            .map((cat) => (
              <div
                key={cat.name}
                onClick={() => {
                  onSelectCategory(cat.name);
                  setSelectedSubTypeId('all');
                  setSearchInCat('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group p-3 rounded-2xl border border-stone-200 hover:border-[#525A43] bg-stone-50 hover:bg-white transition-all cursor-pointer text-center space-y-2 hover:shadow-md"
              >
                <div className="w-12 h-12 mx-auto rounded-full overflow-hidden border border-stone-200 bg-white">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/products/LiverBoost.jpeg';
                    }}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-serif text-stone-500 block">
                    {cat.urduName}
                  </span>
                  <h4 className="text-xs font-bold text-[#2F3428] group-hover:text-[#525A43] line-clamp-1">
                    {cat.name}
                  </h4>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Free Hakeem Guidance Callout */}
      <section className="bg-gradient-to-r from-[#525A43] to-[#3F4633] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#A1A696] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A1A696]" />
            <span>Personalized Herbal Consultation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif">
            Not sure which remedy suits your Mizaj?
          </h3>
          <p className="text-xs sm:text-sm text-stone-200 max-w-xl">
            Our qualified Hakeem Dr. Hafiz Mohsin Ali (Fazil-e-Tibb, DHMS) is available on WhatsApp for direct medical diagnosis and custom prescriptions.
          </p>
        </div>

        <a
          href="https://wa.me/923004652599?text=Hello%20Hakeem%20Sahab,%20I%20need%20guidance%20regarding%20remedies%20in%20the%20category:%20"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 rounded-2xl bg-white text-[#2F3428] hover:bg-[#A1A696] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 text-[#525A43]" />
          <span>WhatsApp Consultation</span>
        </a>
      </section>

    </div>
  );
};
