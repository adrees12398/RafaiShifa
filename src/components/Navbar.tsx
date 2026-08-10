import React, { useState } from 'react';
import { NavTab } from '../types';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ShieldCheck, 
  PhoneCall, 
  Search, 
  UserCheck 
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  isAdminLoggedIn,
  onOpenAdminModal,
  searchQuery,
  setSearchQuery
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navItems: { id: NavTab; label: string; urdu: string }[] = [
    { id: 'home', label: 'Home', urdu: 'صفحہ اول' },
    { id: 'blog', label: 'Tib Blog & Remedies', urdu: 'طب و علاج' },
    { id: 'help', label: 'Help & FAQs', urdu: 'مدد و سوالات' },
    { id: 'team', label: 'About & Our Hakeems', urdu: 'ہمارے اطبا' },
    { id: 'admin', label: 'Admin Dashboard', urdu: 'ایڈمن پینل' },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#525A43] text-white shadow-md border-b border-[#3F4633]">
      {/* Top Announcement Bar */}
      <div className="bg-[#3F4633] text-stone-100 text-xs py-1.5 px-4 border-b border-[#525A43]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#A1A696] animate-pulse"></span>
            <span> Authentic Unani & Tib-e-Nabvi Herbal Medicine Store</span>
            <span className="hidden md:inline text-[#A1A696] font-serif">| شفاء من اللہ</span>
          </div>
          <div className="flex items-center gap-4 text-stone-200">
            <a href="tel:+923004652599" className="flex items-center gap-1 hover:text-[#A1A696] transition-colors">
              <PhoneCall className="w-3.5 h-3.5 text-[#A1A696]" />
              <span>+92 300 4652599</span>
            </a>
            <div className="flex items-center gap-1 text-stone-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A1A696]" />
              <span>100% Pure & Organic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group py-2"
          >
            <div className="w-12 h-12 rounded-full bg-[#525A43] flex items-center justify-center shadow-md border-2 border-[#A1A696] group-hover:scale-105 transition-transform duration-200 overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-10 h-10">
                {/* Circular background */}
                <circle cx="50" cy="50" r="48" fill="#525A43" stroke="#A1A696" strokeWidth="2"/>
                
                {/* RSK Letters */}
                <text x="50" y="45" textAnchor="middle" fill="#A1A696" fontSize="32" fontWeight="bold" fontFamily="serif">RSK</text>
                
                {/* Mortar and Pestle icon */}
                <g transform="translate(50, 62)">
                  <ellipse cx="0" cy="8" rx="12" ry="3" fill="none" stroke="#A1A696" strokeWidth="1.5"/>
                  <path d="M -10 8 L -8 -5 Q 0 -12 8 -5 L 10 8" fill="none" stroke="#A1A696" strokeWidth="1.5"/>
                  <line x1="-3" y1="-2" x2="3" y2="2" stroke="#A1A696" strokeWidth="1.5"/>
                </g>
                
                {/* Decorative leaves */}
                <g fill="#A1A696" opacity="0.8">
                  <ellipse cx="25" cy="20" rx="4" ry="2" transform="rotate(-30 25 20)"/>
                  <ellipse cx="75" cy="20" rx="4" ry="2" transform="rotate(30 75 20)"/>
                </g>
              </svg>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-white font-serif">
                  Rafai<span className="text-[#A1A696]">Shifa</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#3F4633] text-[#A1A696] font-medium border border-[#A1A696]/30 hidden sm:inline-block">
                  طب و حکمت
                </span>
              </div>
              <p className="text-xs text-[#A1A696] tracking-wide font-sans">
                Unani & Islamic Herbal Solutions
              </p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-8 relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Kalonji, Majoon, Oil..."
              className="w-full bg-[#3F4633] border border-[#A1A696]/40 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-[#A1A696]/80 focus:outline-none focus:ring-2 focus:ring-[#A1A696] transition-all"
            />
            <Search className="w-4 h-4 text-[#A1A696] absolute left-3 top-2.5" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-[#A1A696] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all relative flex flex-col items-center ${
                    isActive 
                      ? 'bg-[#A1A696] text-[#2F3428] shadow-md font-extrabold' 
                      : 'text-white hover:bg-[#3F4633] hover:text-[#A1A696]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === 'admin' && isAdminLoggedIn && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#A1A696] ring-2 ring-[#525A43]"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            
            {/* Search Trigger for Mobile */}
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="p-2 rounded-lg text-[#A1A696] hover:text-white hover:bg-[#3F4633] lg:hidden"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Key Button if not on admin tab */}
            {activeTab !== 'admin' && (
              <button
                onClick={() => {
                  if (isAdminLoggedIn) {
                    setActiveTab('admin');
                  } else {
                    onOpenAdminModal();
                  }
                }}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  isAdminLoggedIn 
                    ? 'bg-[#3F4633] text-[#A1A696] border border-[#A1A696]/40 hover:bg-[#2F3428]' 
                    : 'text-[#A1A696] hover:text-white hover:bg-[#3F4633]'
                }`}
                title={isAdminLoggedIn ? "Admin Logged In" : "Admin Login"}
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden xl:inline">{isAdminLoggedIn ? "Admin Active" : "Admin"}</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative bg-[#A1A696] hover:bg-white text-[#2F3428] font-extrabold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2.5 transition-all transform active:scale-95 border border-white/20"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#2F3428]" />
              <span className="hidden sm:inline text-sm">Cart</span>
              <span className="bg-[#525A43] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#A1A696]">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-200 hover:text-white hover:bg-[#3F4633] md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {showSearchInput && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search herbal medicines, oils..."
                className="w-full bg-[#3F4633] border border-[#A1A696]/40 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white placeholder-[#A1A696] focus:outline-none focus:ring-2 focus:ring-[#A1A696]"
              />
              <Search className="w-4 h-4 text-[#A1A696] absolute left-3 top-3" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#3F4633] border-t border-[#525A43] px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#A1A696] text-[#2F3428] font-bold' 
                    : 'text-white hover:bg-[#525A43] hover:text-[#A1A696]'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs opacity-80 font-serif">{item.urdu}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
