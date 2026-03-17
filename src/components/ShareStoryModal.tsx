'use client';

import * as React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ChevronDown, PenLine, Heart, ArrowRight, Sparkles, Quote, Lock, Search, Calendar, User, Shuffle, UserCheck, BookOpen, Mail } from 'lucide-react';
import { THEMES, ThemeOption, Testimonial, getCoordsForLocation, DISTRICT_LABELS, toTitleCase, FEMALE_NAMES, RELATED_ARTICLES } from '@/lib/constants';

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStory: (story: Testimonial) => void;
}

type IdentityType = 'pseudonym' | 'real';



export const ShareStoryModal: React.FC<ShareStoryModalProps> = ({ isOpen, onClose, onAddStory }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  
  const [text, setText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption | null>(null);
  const [location, setLocation] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [identityType, setIdentityType] = useState<IdentityType>('pseudonym');
  const [realName, setRealName] = useState('');
  const [email, setEmail] = useState('');
  
  const getRandomName = () => FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
  const [currentPseudonym, setCurrentPseudonym] = useState(getRandomName());

  const dropdownRef = useRef<HTMLDivElement>(null);

  const locationOptions = useMemo(() => {
    return DISTRICT_LABELS.map(d => toTitleCase(d.name)).sort();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const refreshPseudonym = () => {
    let nextName = getRandomName();
    while (nextName === currentPseudonym && FEMALE_NAMES.length > 1) {
      nextName = getRandomName();
    }
    setCurrentPseudonym(nextName);
  };

  const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTheme || !location || !birthDate) return;
    
    const finalName = identityType === 'pseudonym' ? currentPseudonym : realName.trim();
    if (identityType === 'real' && !finalName) return;

    const { lat, lng } = getCoordsForLocation(location);
    const age = calculateAge(birthDate);
    
    const newStory: Testimonial = {
      id: `new-${Date.now()}`,
      author: `${finalName}, ${age}`, 
      location: location,
      tag: selectedTheme.label,
      text: text,
      lat,
      lng,
      icon: selectedTheme.icon,
      visibilityRank: 0, 
      createdAt: new Date().toISOString(),
      isUserContribution: true,
    };

    onAddStory(newStory);
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog" 
            aria-modal="true" 
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-secondary/10 backdrop-blur-sm transition-all"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`relative w-full bg-white rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] transition-all duration-500 ${submitted ? 'max-w-4xl' : 'max-w-md'}`}
          >
             <button 
                aria-label="Fechar"
                onClick={onClose}
                className="absolute top-3 right-3 z-20 p-1 bg-gray-100/50 hover:bg-gray-100 text-gray-400 rounded-full transition-all backdrop-blur-md"
             >
                <X size={16} />
             </button>

             <div className={`overflow-y-auto custom-scrollbar flex h-full ${submitted ? 'flex-col md:flex-row' : 'flex-col'}`}>
                
                {submitted ? (
                  <>
                    <div className="flex flex-col items-center justify-center p-6 md:p-10 flex-1 min-h-[400px] border-b md:border-b-0 md:border-r border-gray-100">
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-[#6BAE2E]/10 text-[#6BAE2E] rounded-full flex items-center justify-center mb-4 shadow-sm"
                      >
                        <Heart size={32} className="fill-current animate-pulse" />
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight text-center px-4 leading-tight">
                        Obrigada por partilhares a tua história.
                      </h3>
                      <p className="text-gray-500 text-sm text-center mb-8 max-w-xs leading-relaxed px-4">
                        A tua história já está no mapa. Como tu, milhares de mulheres enfrentam os mesmos desafios.
                      </p>
                      
                      <motion.a 
                          href="https://www.myformula.pt/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="w-full group relative overflow-hidden bg-gradient-to-br from-[#6BAE2E] to-[#0872B1] rounded-2xl p-6 text-left shadow-xl shadow-primary/20 cursor-pointer transform transition-all hover:scale-[1.01]"
                      >
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 blur-[40px] rounded-full pointer-events-none" />
                          
                          <div className="relative z-10 flex flex-col h-full">
                              <h4 className="text-[17px] font-bold text-white mb-2 leading-tight">
                                  Queres descobrir a fórmula ideal para o teu corpo?
                              </h4>
                              
                              <p className="text-white/80 text-[11px] mb-6 leading-relaxed">
                                  Através de um breve questionário clínico, avalia as tuas necessidades de saúde e nutrição e recebe uma recomendação de suplementos personalizados pensados especificamente para ti.
                              </p>
                              
                              <div className="flex items-center gap-2 text-white font-bold text-xs mt-auto group-hover:gap-3 transition-all bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                                  <span>Fazer questionário de Avaliação Clínica</span>
                                  <ArrowRight size={14} />
                              </div>
                          </div>
                      </motion.a>
                    </div>

                    <div className="flex flex-col p-6 md:p-10 flex-1 bg-gray-50/50">
                      <div className="flex items-center gap-2 mb-6">
                        <BookOpen className="text-[#6BAE2E]" size={20} />
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Artigos Relacionados</h3>
                      </div>
                      
                      <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                        {(RELATED_ARTICLES[selectedTheme?.label || ''] || RELATED_ARTICLES['default']).map((article, idx) => (
                          <a 
                            key={idx}
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-[#6BAE2E]/30"
                          >
                            <div className="w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden shrink-0 relative">
                              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="flex flex-col justify-center">
                              <h4 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-[#6BAE2E] transition-colors line-clamp-2">{article.title}</h4>
                              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{article.description}</p>
                              <span className="text-[10px] font-bold text-[#6BAE2E] mt-2 uppercase tracking-wider flex items-center gap-1">
                                Ler Artigo <ArrowRight size={10} />
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-5">
                     <div className="flex flex-col items-center text-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#6BAE2E]/10 to-[#0872B1]/10 text-[#6BAE2E] rounded-lg flex items-center justify-center mb-2 shadow-sm">
                            <Quote size={16} className="fill-current opacity-90" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-0.5">
                            A tua voz importa
                        </h3>
                        <p className="text-gray-500 text-[11px] leading-snug max-w-[280px]">
                            Ao partilhares a tua história, ajudas outras mulheres a sentirem-se menos sozinhas.
                        </p>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-2.5">
                        <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ml-1">Identificação</label>
                            
                            <div className="flex p-0.5 bg-gray-100 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setIdentityType('pseudonym')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1 rounded-md text-[10px] font-bold transition-all ${identityType === 'pseudonym' ? 'bg-white text-[#6BAE2E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Shuffle size={10} />
                                    Nome Fictício
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIdentityType('real')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-1 rounded-md text-[10px] font-bold transition-all ${identityType === 'real' ? 'bg-white text-[#6BAE2E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <UserCheck size={10} />
                                    O Meu Nome
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {identityType === 'pseudonym' ? (
                                    <motion.div
                                        key="pseudonym-box"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-gray-50 rounded-lg p-2 flex items-center justify-between border border-gray-100"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight leading-none mb-0.5">Sugestão</span>
                                            <span className="text-xs font-bold text-gray-900">{currentPseudonym}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={refreshPseudonym}
                                            className="p-1.5 bg-white text-[#6BAE2E] rounded-md shadow-sm hover:shadow-md transition-all active:scale-95 group"
                                            title="Trocar nome"
                                        >
                                            <Shuffle size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="real-name-box"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="relative group pt-1 space-y-2"
                                    >
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-[calc(50%-1px)] text-gray-400 group-focus-within:text-[#6BAE2E] transition-colors">
                                                <User size={14} />
                                            </div>
                                            <input 
                                                type="text"
                                                placeholder="Digita o teu nome"
                                                value={realName}
                                                onChange={(e) => setRealName(e.target.value)}
                                                required={identityType === 'real'}
                                                className="w-full h-9 pl-9 pr-4 rounded-lg bg-gray-50 border-0 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#6BAE2E]/20 focus:bg-white transition-all placeholder:font-normal"
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-[calc(50%-1px)] text-gray-400 group-focus-within:text-[#6BAE2E] transition-colors">
                                                <Mail size={14} />
                                            </div>
                                            <input 
                                                type="email"
                                                placeholder="O teu email (opcional)"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-9 pl-9 pr-4 rounded-lg bg-gray-50 border-0 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#6BAE2E]/20 focus:bg-white transition-all placeholder:font-normal"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 ml-1">A tua história</label>
                            <div className="group relative">
                                <textarea 
                                required
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-20 p-3 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#6BAE2E]/20 focus:bg-white transition-all resize-none text-xs leading-relaxed shadow-inner"
                                placeholder="Partilha como te sentes..."
                                />
                                <div className="absolute top-3 right-3 pointer-events-none text-gray-300 group-focus-within:text-[#6BAE2E] transition-colors">
                                    <PenLine size={14} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsThemeOpen(!isThemeOpen)}
                                    className={`w-full h-9 pl-3 pr-8 rounded-lg bg-gray-50 border-0 text-left flex items-center gap-2 transition-all focus:ring-2 focus:ring-[#6BAE2E]/20 hover:bg-gray-100 ${isThemeOpen ? 'bg-white ring-2 ring-[#6BAE2E]/20' : ''}`}
                                >
                                    {selectedTheme ? (
                                        <>
                                            <selectedTheme.icon size={14} className="text-[#6BAE2E] shrink-0" />
                                            <span className="text-xs font-medium text-gray-900 truncate">{selectedTheme.label}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Search size={14} className="text-gray-400 shrink-0" />
                                            <span className="text-xs font-medium text-gray-400">Escolher tema...</span>
                                        </>
                                    )}
                                    <ChevronDown size={14} className={`absolute right-3 text-gray-400 transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isThemeOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                            className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100 max-h-40 overflow-y-auto custom-scrollbar p-1"
                                        >
                                            {THEMES.map((theme, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedTheme(theme);
                                                        setIsThemeOpen(false);
                                                    }}
                                                    className="w-full px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-left group"
                                                >
                                                    <div className={`p-1 rounded-md ${selectedTheme?.label === theme.label ? 'bg-[#6BAE2E]/10 text-[#6BAE2E]' : 'bg-gray-100 text-gray-400'}`}>
                                                        <theme.icon size={12} />
                                                    </div>
                                                    <span className={`text-[11px] ${selectedTheme?.label === theme.label ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                                        {theme.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none transition-colors">
                                        <MapPin size={14} />
                                    </div>
                                    <select
                                        required
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full h-9 pl-8 pr-6 rounded-lg bg-gray-50 border-0 text-gray-900 text-xs font-medium focus:ring-2 focus:ring-[#6BAE2E]/20 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Distrito</option>
                                        {locationOptions.map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronDown size={12} />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none transition-colors">
                                        <Calendar size={14} />
                                    </div>
                                    <input 
                                        type="date"
                                        required
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        max={new Date().toISOString().split("T")[0]}
                                        className="w-full h-9 pl-8 pr-2 rounded-lg bg-gray-50 border-0 text-gray-900 text-xs font-medium focus:ring-2 focus:ring-[#6BAE2E]/20 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-1">
                            <button 
                                type="submit"
                                className="w-full relative group overflow-hidden py-2.5 rounded-xl bg-gradient-to-r from-[#6BAE2E] to-[#4c8a1e] text-white font-bold text-xs shadow-lg shadow-[#6BAE2E]/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span>Partilhar a minha história</span>
                                <ArrowRight size={14} />
                            </button>
                            
                            <div className="flex items-start gap-1.5 mt-3 text-[9px] font-medium text-gray-400 leading-tight text-center px-2">
                                <Lock size={10} className="shrink-0 mt-0.5" />
                                <span>Ao submeter a minha história, permito que o testemunho possa ser utilizado para fins de marketing, mantendo sempre o seu anonimato, se assim o escolher.</span>
                            </div>
                        </div>
                     </form>
                  </div>
                )}
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};