'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Heart as HeartIcon, MapPin, X, Share2, Check, Link as LinkIcon } from 'lucide-react';

interface TestimonialCardProps {
  text: string;
  onClose: () => void;
  icon: LucideIcon;
  author: string;
  location: string;
  tag: string;
  date: string;
}

function getRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `Há ${minutes} min`;
    if (hours < 24) return `Há ${hours} h`;
    if (days === 1) return 'Ontem';
    if (days < 30) return `Há ${days} dias`;
    
    return new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short' }).format(date);
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ text, onClose, icon: Icon, author, location, tag, date }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [reactionCount, setReactionCount] = useState(0);
  const [hasReacted, setHasReacted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setReactionCount(Math.floor(Math.random() * 74) + 12);
  }, []);

  const handleReaction = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!hasReacted) {
      setHasReacted(true);
      setReactionCount(prev => prev + 1);
    }
  };

  const getShareUrl = () => {
    if (typeof window === 'undefined') return 'https://www.myformula.pt/';
    const url = window.location.href;
    if (url.startsWith('blob:') || url.includes('localhost') || url.includes('127.0.0.1')) {
      return 'https://www.myformula.pt/';
    }
    return url;
  };

  const shareContent = {
    url: getShareUrl(),
    text: `"${text}" — ${author}.`,
    cta: 'Cada corpo conta uma história. Descobre a tua fórmula no MyFormula.'
  };

  const handleSocialShare = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin') => {
    let shareUrl = '';
    const encodedText = encodeURIComponent(`${shareContent.text}\n\n${shareContent.cta}`);
    const encodedUrl = encodeURIComponent(shareContent.url);

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const handleCopyLink = () => {
    const fullText = `${shareContent.text}\n${shareContent.cta}\n${shareContent.url}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
      setShowShareMenu(false);
    }, 2000);
  };

  return (
    <motion.div
      ref={cardRef}
      role="dialog"
      aria-label={`Testemunho de ${author}`}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative z-50 w-[340px] max-w-[95vw] max-h-[55vh] md:max-h-[75vh] flex flex-col cursor-default"
      onClick={(e) => {
        e.stopPropagation();
        if (showShareMenu) setShowShareMenu(false);
      }}
    >
      <div className="relative flex flex-col overflow-visible rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl h-full">
        <button 
          aria-label="Fechar"
          type="button"
          onClick={(e) => { 
            e.stopPropagation(); 
            onClose(); 
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all z-20 cursor-pointer"
        >
          <X size={20} aria-hidden="true" />
        </button>
        
        <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="flex items-center justify-between mb-4 pr-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-sm text-white font-bold uppercase shadow-sm shrink-0" aria-hidden="true">
                {author.charAt(0)}
                </div>
                <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-none mb-1">{author}</span>
                <div className="flex items-center gap-1 text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                    <MapPin size={10} aria-hidden="true" />
                    <span>{location}</span>
                    <span className="mx-0.5 opacity-50">•</span>
                    <span>{getRelativeTime(date)}</span>
                </div>
                </div>
            </div>
            </div>
            
            <div className="mb-4">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wide border border-primary/20 inline-flex items-center gap-1">
                <Icon size={10} aria-hidden="true" />
                {tag}
            </span>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed font-normal mb-6 relative">
            <span className="absolute -top-2 -left-1 text-4xl text-gray-200 font-serif leading-none select-none" aria-hidden="true">"</span>
            <span className="relative z-10">{text}</span>
            <span className="absolute -bottom-4 text-4xl text-gray-200 font-serif leading-none select-none" aria-hidden="true">"</span>
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100/50 relative">
            <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-900">{reactionCount.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-500 font-medium">mulheres</span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">sentiram o mesmo</span>
            </div>
            
            <div className="flex items-center gap-2">
                <div className="relative">
                    <AnimatePresence>
                    {showShareMenu && (
                        <motion.div
                        role="menu"
                        aria-label="Opções de partilha"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full right-0 mb-3 p-2 bg-gray-900 rounded-xl shadow-xl flex items-center gap-2 z-20 border border-gray-700"
                        >
                        <button 
                            role="menuitem"
                            onClick={() => handleSocialShare('whatsapp')}
                            className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors group"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        </button>
                        <button 
                            role="menuitem"
                            onClick={() => handleSocialShare('facebook')}
                            className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                        </button>
                        <button 
                            role="menuitem"
                            onClick={() => handleSocialShare('twitter')}
                            className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </button>
                        <button 
                            role="menuitem"
                            onClick={() => handleSocialShare('linkedin')}
                            className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                        </button>
                        <div className="w-px h-6 bg-gray-700 mx-1" role="presentation" />
                        <button 
                            role="menuitem"
                            onClick={handleCopyLink}
                            className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors"
                        >
                            {isCopied ? <Check size={16} className="text-green-400" aria-hidden="true" /> : <LinkIcon size={16} aria-hidden="true" />}
                        </button>
                        <div className="absolute top-full right-4 -mt-1 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900" aria-hidden="true"></div>
                        </motion.div>
                    )}
                    </AnimatePresence>

                <button 
                    aria-label="Partilhar"
                    aria-haspopup="menu"
                    aria-expanded={showShareMenu}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowShareMenu(!showShareMenu);
                    }}
                    className={`p-2.5 rounded-full transition-colors relative group ${showShareMenu ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                    title="Partilhar"
                    >
                    <Share2 size={18} aria-hidden="true" />
                    </button>
                </div>

                <motion.button 
                aria-label={hasReacted ? "Remover reação" : "Reagir (Não estás sozinha)"}
                aria-pressed={hasReacted}
                onClick={handleReaction}
                whileTap={{ scale: 0.92 }}
                animate={hasReacted ? { 
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.4, type: "spring", stiffness: 300 } 
                } : {}}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm border relative overflow-hidden ${
                    hasReacted 
                    ? 'bg-green-50 text-[#6BAE2E] border-[#6BAE2E]/20' 
                    : 'bg-gradient-to-r from-[#6BAE2E] to-[#2E8B57] text-white border-transparent hover:shadow-md shadow-[#6BAE2E]/20'
                }`}
                >
                <HeartIcon 
                    size={14} 
                    className={`transition-transform duration-300 ${hasReacted ? "fill-current scale-110" : "group-hover:scale-110"}`} 
                    aria-hidden="true"
                />
                <span className="relative z-10">Não estás sozinha</span>
                <AnimatePresence>
                    {hasReacted && (
                    <motion.span
                        initial={{ scale: 0, opacity: 0.6 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 rounded-full bg-[#6BAE2E]/30 z-0"
                        aria-hidden="true"
                    />
                    )}
                </AnimatePresence>
                </motion.button>
            </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};