import React from 'react';
import { INITIAL_TEAM } from '../data/initialData';
import { 
  Award, 
  CheckCircle2, 
  Phone,
  Medal,
  Activity,
  Heart,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const headPhysician = INITIAL_TEAM.find(m => m.isHeadPhysician) || INITIAL_TEAM[0];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header */}
      <div className="bg-[#525A43] text-white rounded-3xl p-8 sm:p-12 border border-[#A1A696]/30 shadow-xl text-center max-w-4xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#A1A696] text-[#2F3428] uppercase tracking-wider inline-block">
          طبیبِ اعلیٰ - اطبائے یونانی و ہومیوپیتھک
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight">
          Our Chief Hakeem & Lead Physician
        </h1>
        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-xl mx-auto">
          Meet Chief Physician Dr. Hakeem Hafiz Mohsin Ali, Gold Medalist and National Councillor, committed to authentic natural healing and Prophetic Tibb.
        </p>
      </div>

      {/* Featured Chief Physician Section: Dr. Hakeem Hafiz Mohsin Ali */}
      <section className="bg-white rounded-3xl overflow-hidden border border-[#A1A696]/40 shadow-xl relative">
        <div className="bg-[#525A43] text-white px-8 py-5 flex items-center justify-between border-b border-[#A1A696]/30">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-[#A1A696]" />
            <span className="text-xs font-extrabold text-[#A1A696] uppercase tracking-wider font-serif">
              Lead Physician & Chief Consultant
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#A1A696] text-[#2F3428]">
            Gold Medalist
          </span>
        </div>

        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Photo & Quick Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#A1A696]/50 shadow-lg aspect-4/5 bg-stone-100">
              <img 
                src={headPhysician.imageUrl} 
                alt={headPhysician.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2F3428] via-[#2F3428]/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="inline-block px-2.5 py-1 rounded-md bg-[#A1A696] text-[#2F3428] text-[11px] font-bold w-max mb-1">
                  National Councillor – Islamabad
                </div>
                <h2 className="text-2xl font-extrabold font-serif text-white">
                  {headPhysician.name}
                </h2>
                <p className="text-xs text-[#A1A696] font-medium">
                  {headPhysician.title}
                </p>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-[#A1A696]/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#525A43] text-white flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#525A43] font-bold uppercase">Clinical Practice</div>
                  <div className="text-xs font-extrabold text-[#2F3428]">25+ Years Exp.</div>
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-[#A1A696]/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#A1A696] text-[#2F3428] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#2F3428] font-bold uppercase">Honor</div>
                  <div className="text-xs font-extrabold text-[#2F3428]">Gold Medalist</div>
                </div>
              </div>
            </div>

            {/* Book Session Button */}
            <a 
              href="tel:+923004652599"
              className="w-full py-3.5 rounded-xl bg-[#525A43] text-white hover:bg-[#3F4633] font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Phone className="w-4 h-4 text-[#A1A696]" />
              <span>Book Consultation with Dr. Hafiz Mohsin Ali</span>
            </a>
          </div>

          {/* Detailed Info Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* About Narrative Block */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#525A43] border-b border-stone-200 pb-2">
                <Stethoscope className="w-5 h-5 text-[#525A43]" />
                <h3 className="text-xl font-extrabold font-serif text-[#2F3428]">
                  About Dr. Hakeem Hafiz Mohsin Ali
                </h3>
              </div>
              <div className="text-sm text-[#2F3428] leading-relaxed space-y-3">
                {headPhysician.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-[#2F3428] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Official Registration Numbers Block */}
            <div className="bg-[#525A43] text-white p-5 rounded-2xl border border-[#A1A696]/40 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-[#A1A696]/30 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#A1A696]" />
                  <h4 className="font-extrabold text-sm text-white font-serif tracking-wide">
                    Official Council Registrations & Licensing
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#A1A696] text-[#2F3428]">
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* NCT Registration */}
                <div className="bg-[#3F4633] p-3.5 rounded-xl border border-[#A1A696]/30 flex flex-col justify-between space-y-1">
                  <div className="text-[#A1A696] text-[11px] font-bold flex justify-between items-center">
                    <span>National Council for Tibb (NCT)</span>
                    <span className="font-serif">این سی ٹی</span>
                  </div>
                  <div className="text-sm font-black text-white font-mono flex items-center gap-1.5 pt-1">
                    <span className="text-[#A1A696]">Reg No:</span>
                    <span className="bg-[#525A43] px-2 py-0.5 rounded text-white border border-[#A1A696]/30">QH-30989-A</span>
                  </div>
                  <div className="text-[10px] text-stone-300 font-serif dir-rtl text-right">
                    این سی ٹی رجسٹریشن نمبر: QH-30989-A
                  </div>
                </div>

                {/* PHC Registration */}
                <div className="bg-[#3F4633] p-3.5 rounded-xl border border-[#A1A696]/30 flex flex-col justify-between space-y-1">
                  <div className="text-[#A1A696] text-[11px] font-bold flex justify-between items-center">
                    <span>Punjab Healthcare Commission (PHC)</span>
                    <span className="font-serif">پی ایچ سی</span>
                  </div>
                  <div className="text-sm font-black text-white font-mono flex items-center gap-1.5 pt-1">
                    <span className="text-[#A1A696]">Reg No:</span>
                    <span className="bg-[#525A43] px-2 py-0.5 rounded text-white border border-[#A1A696]/30">R-21465</span>
                  </div>
                  <div className="text-[10px] text-stone-300 font-serif dir-rtl text-right">
                    پی ایچ سی رجسٹریشن نمبر: R-21465
                  </div>
                </div>
              </div>
            </div>

            {/* Qualifications & Credentials List */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-[#2F3428] font-bold text-sm">
                <Award className="w-4 h-4 text-[#525A43] shrink-0" />
                <span>Qualifications & Credentials</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2F3428]">
                {headPhysician.credentialsList?.map((cred, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs">
                    <span className="text-[#525A43] font-bold text-base leading-none">•</span>
                    <span className="font-semibold text-[#2F3428]">{cred}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinical Practice */}
            <div className="bg-[#525A43]/10 p-4 rounded-2xl border border-[#525A43]/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#525A43] text-white flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#525A43] block">Clinical Practice</span>
                <span className="text-sm font-extrabold text-[#2F3428]">• 25+ Years of Professional Clinical Experience</span>
              </div>
            </div>

            {/* Specialty Focus List */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#2F3428] font-bold text-sm">
                <Heart className="w-4 h-4 text-[#525A43] shrink-0" />
                <span>Specialty Focus</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {headPhysician.specialtiesList?.map((spec, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A1A696]/20 text-[#2F3428] text-xs font-bold border border-[#A1A696]/50 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#525A43]" />
                    <span>{spec}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

