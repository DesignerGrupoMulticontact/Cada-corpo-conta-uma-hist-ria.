'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface SlideData {
  id: number;
  text: string;
  highlights: string[]; 
  source: string;
}

const SLIDES: SlideData[] = [
  { 
    id: 1, 
    text: "55% das mulheres portuguesas vivem com stress elevado.", 
    highlights: ["55%"],
    source: "Marktest/Medicare, 2025",
  },
  { 
    id: 2, 
    text: "38% das mulheres portuguesas têm depressão ou ansiedade.", 
    highlights: ["38%"],
    source: "Sociedade Portuguesa de Ginecologia",
  },
  { 
    id: 3, 
    text: "Mais de metade sente que não estava preparada para a menopausa.", 
    highlights: ["Mais de metade"],
    source: "Return On Ideias/Wells, 2024",
  },
  { 
    id: 4, 
    text: "73% desistiram de tirar fotografias por insegurança.", 
    highlights: ["73%"],
    source: "Estudo Dove, 2023",
  },
  { 
    id: 5, 
    text: "Estas são histórias reais. Escritas por mulheres reais sobre corpos reais.", 
    highlights: ["histórias reais", "mulheres reais", "corpos reais"],
    source: "", 
  }
];

export const IntroOverlay: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const lastScrollTime = useRef(0);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    if (index < SLIDES.length - 1) {
      setIsAnimating(true);
      setIndex(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 650); 
    } else {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }
  }, [index, isAnimating, onComplete]);

  const handlePrev = useCallback(() => {
    if (isAnimating || index === 0) return;
    setIsAnimating(true);
    setIndex(prev => prev - 1);
    setTimeout(() => setIsAnimating(false), 650);
  }, [index, isAnimating]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNext, handlePrev]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < 700) return; 
      if (Math.abs(e.deltaY) > 20) {
        lastScrollTime.current = now;
        e.deltaY > 0 ? handleNext() : handlePrev();
      }
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleNext, handlePrev]);

  const currentSlide = SLIDES[index];

  const contentWords = useMemo(() => {
    const text = currentSlide.text;
    const highlights = currentSlide.highlights || [];
    
    if (highlights.length === 0) {
        return text.split(/\s+/).map(w => ({ text: w, isHighlight: false }));
    }

    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${highlights.map(escapeRegExp).join('|')})`, 'g');
    
    const parts = text.split(regex);
    const finalWords: { text: string; isHighlight: boolean }[] = [];

    parts.forEach(part => {
        if (!part) return;
        const isHighlight = highlights.includes(part);
        const subWords = part.trim().split(/\s+/).filter(w => w.length > 0);
        
        subWords.forEach(sw => {
            finalWords.push({ text: sw, isHighlight });
        });
    });

    return finalWords;
  }, [currentSlide]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      filter: 'blur(10px)',
      scale: 1.05,
      transition: { duration: 0.5, ease: "easeInOut" as const }
    }
  };

  const wordVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      filter: 'blur(12px)',
      scale: 0.85
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      scale: 1,
      transition: { 
        type: "spring" as const,
        damping: 25,
        stiffness: 120,
        mass: 1
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(40px)', scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#F9FAFB] flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="relative z-10 w-full max-w-5xl px-8 md:px-12 flex flex-col items-center text-center">
             <AnimatePresence mode="wait">
                <motion.div
                   key={currentSlide.id}
                   variants={containerVariants}
                   initial="hidden"
                   animate="visible"
                   exit="exit"
                   className="flex flex-col items-center"
                >
                   <div className="flex flex-wrap justify-center gap-x-[0.4em] gap-y-3 max-w-4xl mb-8 md:mb-12 perspective-[1000px]">
                      {contentWords.map((wordObj, i) => (
                        <motion.span
                            key={i}
                            variants={wordVariants}
                            className={`inline-block text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] md:leading-[1.2] ${
                                wordObj.isHighlight 
                                ? "bg-clip-text text-transparent bg-gradient-to-r from-[#6BAE2E] via-[#2A9D8F] via-[#0872B1] to-[#6BAE2E] bg-[length:300%_auto]" 
                                : "text-gray-900"
                            }`}
                            animate={wordObj.isHighlight ? {
                                backgroundPosition: ["0% center", "300% center"],
                            } : {}}
                            transition={wordObj.isHighlight ? {
                                duration: 8, 
                                repeat: Infinity,
                                ease: "linear"
                            } : {}}
                        >
                            {wordObj.text}
                        </motion.span>
                      ))}
                   </div>

                   {currentSlide.source && (
                       <motion.div 
                          variants={wordVariants}
                          className="flex items-center gap-2"
                       >
                          <div className="h-px w-8 bg-gray-300" />
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">
                            {currentSlide.source}
                          </span>
                          <div className="h-px w-8 bg-gray-300" />
                       </motion.div>
                   )}
                </motion.div>
             </AnimatePresence>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center gap-6 z-20"
          >
             <div className="flex gap-3">
                {SLIDES.map((_, i) => (
                    <div 
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                            i === index 
                                ? 'w-8 bg-gradient-to-r from-[#6BAE2E] to-[#0872B1]'
                                : 'w-1.5 bg-gray-200'
                        }`}
                    />
                ))}
             </div>

             <div className="flex items-center gap-4">
                 <button
                    onClick={handlePrev}
                    disabled={index === 0}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                        index === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                    }`}
                 >
                    <ArrowLeft size={20} />
                 </button>

                 <button
                    onClick={handleNext}
                    className="group relative flex items-center gap-3 pl-6 pr-5 py-3 bg-gradient-to-r from-[#6BAE2E] to-[#0872B1] text-white rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#6BAE2E]/20"
                 >
                    <span className="text-sm font-bold tracking-wide">
                        {index === SLIDES.length - 1 ? "Começar" : "Continuar"}
                    </span>
                    <ChevronRight size={16} className="text-white/80 group-hover:text-white transition-colors" />
                 </button>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};