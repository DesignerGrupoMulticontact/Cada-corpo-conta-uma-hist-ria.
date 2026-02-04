import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CTAButtonProps {
  onClick?: () => void;
}

export const CTAButton: React.FC<CTAButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold text-white shadow-xl shadow-[#6BAE2E]/25 overflow-hidden cursor-pointer"
    >
      {/* Improved Gradient: Smoother transition */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#6BAE2E] to-[#2E8B57] transition-all duration-300 group-hover:brightness-110" />
      
      {/* Content */}
      <span className="relative z-10 tracking-wide text-[17px]">Partilhar a minha história</span>
      <motion.span
        initial={{ x: 0 }}
        whileHover={{ x: 4 }}
        className="relative z-10"
      >
        <ArrowRight size={20} strokeWidth={2.5} />
      </motion.span>
      
      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
    </motion.button>
  );
};