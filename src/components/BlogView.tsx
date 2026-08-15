import React, { useState } from 'react';
import { BlogPost } from '../types';
import { INITIAL_BLOGS } from '../data/initialData';
import { 
  BookOpen, 
  Clock, 
  User, 
  Search, 
  X, 
  Tag, 
  Share2, 
  Check 
} from 'lucide-react';

export const BlogView: React.FC = () => {
  const [blogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [copied, setCopied] = useState(false);

  const allTags = ['All', ...Array.from(new Set(blogs.flatMap((b) => b.tags)))];

  const filteredBlogs = blogs.filter((b) => {
    const matchesTag = selectedTag === 'All' || b.tags.includes(selectedTag);
    const matchesSearch = !searchQuery || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.titleUrdu && b.titleUrdu.includes(searchQuery));
    return matchesTag && matchesSearch;
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-[#525A43] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-[#A1A696]/30 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 sm:space-y-3 relative z-10">
          <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#A1A696] text-[#2F3428] inline-block uppercase tracking-wider">
            طب و حکمت سائنس
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif tracking-tight">
            Tib-e-Nabvi & Herbal Medicine Knowledge Base
          </h1>
          <p className="text-[11px] sm:text-xs md:text-sm text-stone-200 leading-relaxed">
            Evidence-backed research, prophetic healthcare guidelines, and holistic herbal wellness tips written by qualified Unani Hakeems.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:w-64 md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, remedies, herbs..."
            className="w-full bg-[#F9F9F6] border border-stone-300 rounded-lg sm:rounded-xl py-2 pl-9 pr-4 text-xs text-[#2F3428] focus:ring-2 focus:ring-[#A1A696] focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-[#525A43] text-white'
                  : 'bg-stone-100 text-[#2F3428] hover:bg-stone-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <article 
            key={blog.id}
            onClick={() => setSelectedBlog(blog)}
            className="bg-white rounded-2xl overflow-hidden border border-[#A1A696]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="aspect-video relative overflow-hidden bg-stone-100">
                <img 
                  src={blog.imageUrl} 
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2F3428]/90 backdrop-blur-md text-[#A1A696]">
                  {blog.category}
                </span>
              </div>

              <div className="p-5 space-y-3">
                {blog.titleUrdu && (
                  <span className="text-xs font-serif font-bold text-[#525A43] bg-[#A1A696]/15 px-2.5 py-0.5 rounded border border-[#A1A696]/30">
                    {blog.titleUrdu}
                  </span>
                )}

                <h3 className="font-bold text-[#2F3428] text-base leading-snug group-hover:text-[#525A43] transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-xs text-[#2F3428]/80 line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#525A43]" />
                <span className="text-[#2F3428] font-medium">{blog.author}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{blog.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-[#2F3428]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 my-8 relative">
            
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 flex items-center justify-center shadow-md transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-21/9 relative overflow-hidden bg-[#2F3428]">
              <img 
                src={selectedBlog.imageUrl} 
                alt={selectedBlog.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2F3428] via-[#2F3428]/40 to-transparent flex flex-col justify-end p-6 text-white space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#A1A696] text-[#2F3428] w-fit">
                  {selectedBlog.category}
                </span>
                {selectedBlog.titleUrdu && (
                  <span className="text-sm font-serif font-bold text-[#A1A696]">
                    {selectedBlog.titleUrdu}
                  </span>
                )}
                <h2 className="text-xl sm:text-2xl font-extrabold font-serif">
                  {selectedBlog.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#A1A696]/20 text-[#525A43] font-bold flex items-center justify-center">
                    <User className="w-4 h-4 text-[#525A43]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#2F3428] block">{selectedBlog.author}</span>
                    <span className="text-[10px] text-stone-500">{selectedBlog.authorRole}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {selectedBlog.date}
                  </span>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#2F3428] flex items-center gap-1 font-semibold"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#525A43]" /> : <Share2 className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Share'}</span>
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="prose max-w-none text-xs sm:text-sm text-[#2F3428] leading-relaxed whitespace-pre-line space-y-3">
                {selectedBlog.content}
              </div>

              {/* Article Tags */}
              <div className="pt-4 border-t border-stone-200 flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-[#525A43]" />
                {selectedBlog.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md bg-[#F9F9F6] text-[#2F3428] border border-stone-200 text-xs font-medium">
                    #{t}
                  </span>
                ))}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
