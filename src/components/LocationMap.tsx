import React from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';

const STORE_NAME = 'Rafa i Shifa';
const STORE_ADDRESS = 'Dev Samaj Road, Sanat Nagar, Lahore, Pakistan';
const MAPS_QUERY = encodeURIComponent(`${STORE_NAME}, ${STORE_ADDRESS}`);
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`;

export const LocationMap: React.FC = () => {
  return (
    <section className="mt-8 sm:mt-12">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#A1A696]/40 shadow-sm overflow-hidden">
        
        {/* Section Header */}
        <div className="p-5 sm:p-7 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#525A43]">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <h2 className="text-lg sm:text-xl font-extrabold font-serif text-[#2F3428]">
                Visit Our Store
              </h2>
            </div>
            <p className="text-[11px] sm:text-sm text-stone-600 leading-relaxed">
              {STORE_ADDRESS}
            </p>
          </div>
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 sm:px-5 py-2.5 rounded-xl bg-[#525A43] text-white hover:bg-[#3F4633] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Navigation className="w-4 h-4 text-[#A1A696]" />
            <span>Get Directions</span>
          </a>
        </div>

        {/* Interactive Map */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 border-t border-[#A1A696]/30 bg-stone-100">
          <iframe
            title={`Rafa i Shifa Store Location - ${STORE_ADDRESS}`}
            src={`https://www.google.com/maps?q=${MAPS_QUERY}&z=16&output=embed`}
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Address Bar */}
        <div className="p-4 sm:p-5 bg-[#F9F9F6] border-t border-[#A1A696]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#525A43] text-white flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-extrabold text-[#2F3428]">{STORE_NAME}</div>
              <div className="text-[11px] sm:text-xs text-stone-600 truncate">{STORE_ADDRESS}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#525A43] font-bold shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
          </div>
        </div>

      </div>
    </section>
  );
};