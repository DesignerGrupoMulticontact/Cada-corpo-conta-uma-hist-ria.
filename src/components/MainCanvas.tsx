'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion';
import { Info, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { CTAButton } from '@/components/CTAButton';
import { ShareStoryModal } from '@/components/ShareStoryModal';
import { IntroOverlay } from '@/components/IntroOverlay';
import { ActivityToasts } from '@/components/ActivityToasts';
import { TESTIMONIALS, Testimonial } from '@/lib/constants';

// Dynamically import the map to avoid SSR issues with Leaflet
const PortugalMap = dynamic(() => import('@/components/PortugalMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#F9FAFB] animate-pulse" />
});

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    return isMobile;
};

const Counter = ({ value }: { value: number }) => {
  const spring = useSpring(0, { mass: 1, stiffness: 35, damping: 25 });
  const display = useTransform(spring, (current) => `+${Math.floor(current).toLocaleString()}`);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span 
        className="bg-clip-text text-transparent bg-gradient-to-r from-[#6BAE2E] to-[#0872B1]"
    >
        {display}
    </motion.span>
  );
};

export default function MainCanvas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [introActive, setIntroActive] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  
  const [pendingUserStory, setPendingUserStory] = useState<Testimonial | null>(null);
  const [toastOverrideStory, setToastOverrideStory] = useState<Testimonial | null>(null);

  const isMobile = useIsMobile();

  const BASE_COUNT = 2590;
  const currentCount = BASE_COUNT + (testimonials.length - TESTIMONIALS.length);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const mapX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const mapY = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const contentX = useTransform(smoothX, [-0.5, 0.5], [25, -25]);
  const contentY = useTransform(smoothY, [-0.5, 0.5], [25, -25]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || introActive) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth) - 0.5;
    const y = (e.clientY / innerHeight) - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleAddStory = (newStory: Testimonial) => {
    setTestimonials(prev => [...prev, newStory]);
    setPendingUserStory(newStory);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (pendingUserStory) {
        setToastOverrideStory(pendingUserStory);
        setPendingUserStory(null);
        setActiveStoryId(pendingUserStory.id);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 15 }
    },
  };

  return (
    <div 
      className="relative h-[100dvh] w-full bg-[#F9FAFB] text-gray-900 overflow-hidden font-sans selection:bg-primary/20 flex flex-col md:block"
      onMouseMove={handleMouseMove}
    >
      <IntroOverlay onComplete={() => setIntroActive(false)} />
      
      <ActivityToasts 
        isActive={!introActive} 
        testimonials={testimonials}
        onNavigate={(id) => setActiveStoryId(id)}
        userStory={toastOverrideStory}
      />
      
      <ShareStoryModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        onAddStory={handleAddStory}
      />

      <Header style={!isMobile ? { x: contentX, y: contentY } : undefined} />
      
      <div 
        className={`w-full h-full transition-all duration-1000 ${introActive ? 'blur-[16px] pointer-events-none scale-[1.02] brightness-75' : 'blur-0'}`}
      >
        <motion.main 
          className={`
              relative z-20 
              w-full flex-none
              pt-20 pb-4 px-6
              bg-[#F9FAFB] md:bg-transparent
              md:absolute md:inset-0 md:h-full md:flex md:flex-col md:justify-center md:px-16 lg:px-24 md:pointer-events-none md:pt-0
          `}
          style={!isMobile ? { x: contentX, y: contentY } : {}}
        >
          <div className="pointer-events-auto max-w-xl mx-auto md:mx-0 flex flex-col items-center md:items-start text-center md:text-left">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={!introActive ? "visible" : "hidden"}
              >
                  <motion.h1 
                    variants={itemVariants}
                    className="text-gray-900 mb-6 md:mb-10"
                  >
                    <span className="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.95] mb-3 md:mb-5">
                        <span>Cada corpo</span>
                        <span>conta uma</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6BAE2E] via-[#2A9D8F] to-[#0872B1]">
                            história.
                        </span>
                    </span>
                    <span className="block text-xl sm:text-2xl md:text-3xl font-medium text-gray-400 tracking-tight mt-1">
                        Qual é a tua?
                    </span>
                  </motion.h1>
                  
                  <motion.p 
                    variants={itemVariants}
                    className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 md:mb-12 leading-relaxed font-normal max-w-md mx-auto md:mx-0"
                  >
                    Estas são histórias reais. De mulheres reais.
                  </motion.p>
                  
                  <div className="flex flex-col items-center md:items-start gap-8 md:gap-12">
                      <motion.div variants={itemVariants} className="scale-90 md:scale-100 origin-center md:origin-left">
                           <CTAButton onClick={() => setIsModalOpen(true)} />
                      </motion.div>
                      
                      <motion.div 
                        variants={itemVariants}
                        className="flex items-center gap-4 md:gap-5 pt-4 md:pt-6 border-t border-gray-200/60 w-full max-w-xs md:max-w-full justify-center md:justify-start"
                      >
                          <div className="flex -space-x-3">
                          {[
                              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80",
                              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=64&h=64&q=80",
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
                              "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=64&h=64&q=80"
                          ].map((src, i) => (
                              <div key={i} className="w-9 h-9 md:w-11 md:h-11 rounded-full border-[3px] border-white shadow-sm overflow-hidden bg-gray-100">
                              <img 
                                  src={src} 
                                  alt={`Mulher real ${i+1}`} 
                                  className="w-full h-full object-cover" 
                              />
                              </div>
                          ))}
                          </div>
                          <div className="flex flex-col text-left justify-center">
                              <span className="text-xl md:text-2xl font-black leading-none mb-1 tracking-tight">
                                  <Counter value={currentCount} />
                              </span>
                              <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">de Histórias Reais</span>
                          </div>
                      </motion.div>
                  </div>
              </motion.div>
          </div>
        </motion.main>

        <motion.div 
          className={`
              relative z-0 
              flex-1 w-full min-h-0
              md:absolute md:inset-0 md:scale-[1.02]
          `}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1.02 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={!isMobile ? { x: mapX, y: mapY } : {}}
        >
          <PortugalMap 
            testimonials={testimonials} 
            activeId={activeStoryId}
            onActiveIdChange={setActiveStoryId}
          />
        </motion.div>

        {!isMobile && (
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#F9FAFB] via-[#F9FAFB] via-45% to-transparent pointer-events-none w-full md:w-[75%] lg:w-[65%]" />
        )}
        
        <motion.div 
          className="fixed top-6 right-6 md:right-12 z-50 hidden md:flex flex-col items-end gap-2"
          style={!isMobile ? { x: contentX, y: contentY } : {}}
        >
          <motion.button 
              onClick={() => setShowLegal(!showLegal)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm border
                  ${showLegal 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-lg' 
                      : 'bg-white/40 text-gray-400 border-transparent hover:bg-white hover:text-gray-600 hover:shadow-md hover:border-gray-100'
                  }
              `}
          >
              <Info size={14} strokeWidth={2.5} />
              <span>Aviso Legal</span>
          </motion.button>

          <AnimatePresence>
              {showLegal && (
                  <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95, transformOrigin: 'top right' }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 max-w-sm mt-1"
                  >
                      <div className="flex justify-between items-start gap-3 mb-1">
                          <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Aviso Académico</span>
                          <button onClick={() => setShowLegal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                              <X size={14} />
                          </button>
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-500">
                          Esta página foi criada apenas para efeitos educativos e académicos. 
                          Não representa, de forma alguma, a marca MyFormula nem os seus produtos, serviços ou comunicações oficiais. 
                          Todos os testemunhos e dados apresentados são ficcionais.
                      </p>
                  </motion.div>
              )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}