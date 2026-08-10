import React, { useState } from 'react';
import { FAQS } from '../data/initialData';
import { sendContactMessage } from '../lib/firebase';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MessageSquare, 
  HeartHandshake 
} from 'lucide-react';

export const HelpView: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  // Contact Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Query');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject,
        message: message.trim()
      });

      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header Banner */}
      <div className="bg-[#525A43] text-white rounded-3xl p-8 sm:p-12 border border-[#A1A696]/30 shadow-xl text-center max-w-4xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#A1A696] text-[#2F3428] uppercase tracking-wider inline-block">
          Customer Support & Medical Advice
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-white">
          How Can We Help You Today?
        </h1>
        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-xl mx-auto">
          Have questions about dosages, herbal ingredients, shipping, or want a free consultation with our Unani Hakeems? We are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* FAQs Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
            <HelpCircle className="w-5 h-5 text-[#525A43]" />
            <h2 className="text-xl font-bold text-[#2F3428] font-serif">
              Frequently Asked Questions (FAQs)
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-[#A1A696]/30 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 font-semibold text-[#2F3428] text-sm hover:bg-[#F9F9F6] transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#525A43]" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#2F3428]/80 border-t border-stone-100 leading-relaxed bg-[#F9F9F6]/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Consultation Highlight Box */}
          <div className="bg-white p-6 rounded-2xl border border-[#A1A696]/40 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#A1A696]/20 text-[#525A43] flex items-center justify-center font-bold shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#2F3428] text-sm">
                Need Personalized Hakeem Advice?
              </h3>
              <p className="text-xs text-[#2F3428]/80 mt-1">
                You can specify your symptoms in the contact form or call our clinical desk at <b>+92 300 4652599</b> for confidential guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#A1A696]/30 shadow-md space-y-6">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-xl font-bold text-[#2F3428] font-serif flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#525A43]" />
              <span>Send Us a Message</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Directly submit your query to our customer care and medical desk.
            </p>
          </div>

          {submitted ? (
            <div className="bg-[#A1A696]/15 p-6 rounded-2xl border border-[#A1A696]/40 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#525A43] mx-auto" />
              <h3 className="text-base font-bold text-[#2F3428]">
                Message Sent Successfully!
              </h3>
              <p className="text-xs text-[#2F3428] leading-relaxed">
                JazakAllah! Our support team or Hakeem advisor will respond to your email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-2 rounded-xl bg-[#525A43] text-white font-bold text-xs hover:bg-[#3F4633]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#2F3428] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mahmood"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-[#2F3428] focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2F3428] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rafaishifakhana122@gmail.com"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-[#2F3428] focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2F3428] mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 4652599"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-[#2F3428] focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2F3428] mb-1">
                  Subject Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-[#2F3428] focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                >
                  <option value="Product Query">Product Query & Availability</option>
                  <option value="Dosage Guidance">Dosage Guidance / Mizaj</option>
                  <option value="Hakeem Consultation">Book Hakeem Consultation</option>
                  <option value="Order Tracking">Order Status / Tracking</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2F3428] mb-1">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your health query or order question..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-[#2F3428] focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#525A43] text-white hover:bg-[#3F4633] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting to Database...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
