import React from 'react';
import { NavTab } from '../types';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  HeartHandshake 
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#525A43] text-stone-100 pt-16 pb-8 border-t-4 border-[#A1A696]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#3F4633]">
          <div className="flex items-center gap-4 bg-[#3F4633]/60 p-4 rounded-xl border border-[#A1A696]/20">
            <div className="w-12 h-12 rounded-lg bg-[#A1A696]/20 text-[#A1A696] flex items-center justify-center shrink-0 border border-[#A1A696]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Pure Unani Herbs</h4>
              <p className="text-xs text-[#A1A696]">Formulated according to authentic classical Tib-e-Nabvi literature.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#3F4633]/60 p-4 rounded-xl border border-[#A1A696]/20">
            <div className="w-12 h-12 rounded-lg bg-[#A1A696]/20 text-[#A1A696] flex items-center justify-center shrink-0 border border-[#A1A696]/30">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Nationwide Express Delivery</h4>
              <p className="text-xs text-[#A1A696]">Delivered directly to your doorstep with Cash on Delivery (COD).</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#3F4633]/60 p-4 rounded-xl border border-[#A1A696]/20">
            <div className="w-12 h-12 rounded-lg bg-[#A1A696]/20 text-[#A1A696] flex items-center justify-center shrink-0 border border-[#A1A696]/30">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Qualified Hakeem Guidance</h4>
              <p className="text-xs text-[#A1A696]">Personalized consultation for your Mizaj and health conditions.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#525A43] flex items-center justify-center border-2 border-[#A1A696] overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-8 h-8">
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
              <span className="text-2xl font-bold font-serif text-white tracking-tight">
                Rafai<span className="text-[#A1A696]">Shifa</span>
              </span>
            </div>
            <p className="text-xs text-stone-200 leading-relaxed">
              RafaiShifa is dedicated to preserving the rich heritage of Islamic Unani medicine and Prophetic healing remedies (Tib-e-Nabvi), delivering pure, standardized herbal health compounds.
            </p>
            <div className="p-2.5 rounded-lg bg-[#3F4633] border border-[#A1A696]/30 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A1A696]" />
                <span>Official Government Registrations</span>
              </div>
              <div className="text-stone-200 font-mono text-[10px]">
                <div>• NCT Reg No: <span className="text-[#A1A696] font-bold">QH-30989-A</span></div>
                <div>• PHC Reg No: <span className="text-[#A1A696] font-bold">R-21465</span></div>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[#A1A696] font-serif text-sm">شفاء من اللہ</span>
              <span className="text-stone-300 text-xs">— Health is from Allah</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#A1A696] font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#3F4633] pb-2">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-200">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-[#A1A696] transition-colors">
                  Home & Product Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('blog')} className="hover:text-[#A1A696] transition-colors">
                  Tib Blog & Natural Remedies
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('help')} className="hover:text-[#A1A696] transition-colors">
                  Help & Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('team')} className="hover:text-[#A1A696] transition-colors">
                  Our Expert Hakeems & Medical Panel
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-[#A1A696] transition-colors text-[#A1A696] font-semibold">
                  Admin Dashboard Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Herbal Specialties */}
          <div>
            <h3 className="text-[#A1A696] font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#3F4633] pb-2">
              Popular Remedies
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-200">
              <li className="flex items-center gap-1.5"><span className="text-[#A1A696]">•</span> Liverbost</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A1A696]">•</span> Gestrocare</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A1A696]">•</span> SlimAura</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A1A696]">•</span> Majon E jawahari</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A1A696]">•</span> Rogan E Zafran</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A1A696]">•</span> TILA E Azam</li>
              <li className="flex items-center gap-1.5"><span className="text-[#A1A696]">•</span> Growmax hair tonic</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-[#A1A696] font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#3F4633] pb-2">
              Get In Touch
            </h3>
            <ul className="space-y-3 text-xs text-stone-200">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A1A696] shrink-0 mt-0.5" />
                <span>Dev Samaj Road, Sanat Nagar, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#A1A696] shrink-0" />
                <a href="tel:03004652599" className="hover:text-[#A1A696] transition-colors">03004652599</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#A1A696] shrink-0" />
                <a href="mailto:rafaishifakhana122@gmail.com" className="hover:text-[#A1A696] transition-colors">rafaishifakhana122@gmail.com</a>
              </li>
            </ul>
            <div className="mt-5 p-3 rounded-lg bg-[#3F4633] border border-[#A1A696]/30 text-xs text-stone-200">
              <span className="font-semibold text-[#A1A696] block mb-1">Consultation Hours:</span>
              Mon - Sat: 9:00 AM - 8:00 PM (PKT)
            </div>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-[#3F4633] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-300 text-center md:text-left">
          <p>© {new Date().getFullYear()} RafaiShifa Tib & Herbal Medicine Store. All rights reserved.</p>
          <p className="max-w-md text-[11px] text-stone-300/80">
            Disclaimer: These herbal preparations are dietary supplements and Unani formulations. They are intended for wellness and supporting natural health balance (Mizaj).
          </p>
        </div>

      </div>
    </footer>
  );
};
