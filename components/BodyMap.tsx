import * as React from 'react';
import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Filter, MapPin, Tag, Plus, X, Minus } from 'lucide-react';
import { Testimonial, THEMES, DISTRICT_LABELS } from '../constants';
import { TestimonialCard } from './TestimonialCard';

interface BodyMapProps {
  testimonials: Testimonial[];
  onZoomChange?: (isZoomed: boolean) => void;
}

// Custom component to handle zoom controls and events
const MapEvents = ({ onZoom }: { onZoom: (zoom: number) => void }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoom(map.getZoom());
    },
  });
  return null;
};

// Custom component to handle zoom controls programmatically
const ZoomController = ({ zoomChange }: { zoomChange: number | null }) => {
  const map = useMap();
  useEffect(() => {
    if (zoomChange !== null) {
      if (zoomChange > 0) map.zoomIn();
      else map.zoomOut();
    }
  }, [zoomChange, map]);
  return null;
};

// Modern, Minimalist Marker
const createCustomIcon = (isActive: boolean, zoom: number) => {
  // Brand Green #6BAE2E
  // Scale down marker slightly when zoomed out to reduce clutter
  const size = zoom < 8 ? 32 : 48;
  const dotSize = zoom < 8 ? 3 : 4;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative w-${size/4} h-${size/4} flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
        <!-- Ripple Effect -->
        ${!isActive ? `<div class="absolute inset-0 rounded-full bg-[#6BAE2E] animate-ping opacity-20"></div>` : ''}
        
        <!-- Core Pin -->
        <div class="relative w-${dotSize} h-${dotSize} bg-${isActive ? '[#6BAE2E]' : 'white'} border-[${zoom < 8 ? '2px' : '3px'}] border-${isActive ? 'white' : '[#6BAE2E]'} rounded-full shadow-lg transition-all duration-300 transform group-hover:scale-125 z-10">
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

export const BodyMap: React.FC<BodyMapProps> = ({ testimonials, onZoomChange }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zoomTrigger, setZoomTrigger] = useState<number | null>(null);
  const [currentZoom, setCurrentZoom] = useState(7);
  
  // Filters
  const [filterTheme, setFilterTheme] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Derive unique locations for filter
  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(testimonials.map(t => t.location))).sort();
  }, [testimonials]);

  // 1. Filter Logic (Theme/Location)
  const baseFiltered = useMemo(() => {
    return testimonials.filter(t => {
      const matchesTheme = filterTheme === 'all' || t.tag === filterTheme || t.tag.includes(filterTheme);
      const matchesLocation = filterLocation === 'all' || t.location === filterLocation;
      return matchesTheme && matchesLocation;
    });
  }, [testimonials, filterTheme, filterLocation]);

  // 2. Visibility Logic (Zoom-based Progressive Disclosure)
  const visibleTestimonials = useMemo(() => {
    // If a specific filter is active (not 'all'), always show matching results regardless of zoom
    if (filterTheme !== 'all' || filterLocation !== 'all') {
      return baseFiltered;
    }

    return baseFiltered.filter(t => {
      // Always show the active marker
      if (activeId === t.id) return true;

      // Visibility Tiers based on Zoom
      // Zoom 6-7: Show ~30% (Rank < 0.3)
      // Zoom 8-9: Show ~60% (Rank < 0.6)
      // Zoom 10+: Show 100%
      
      if (currentZoom >= 10) return true;
      if (currentZoom >= 8) return (t.visibilityRank || 0) < 0.6;
      return (t.visibilityRank || 0) < 0.35;
    });
  }, [baseFiltered, currentZoom, activeId, filterTheme, filterLocation]);

  const handleMarkerClick = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  const triggerZoom = (direction: number) => {
    setZoomTrigger(direction);
    setTimeout(() => setZoomTrigger(null), 100);
  };

  const portugalBounds: L.LatLngBoundsExpression = [
    [30.0, -32.0], // Extended to cover Azores
    [43.0, -4.0],  // Mainland
  ];

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#F9FAFB]">
      
      {/* --- UI Layer (Static) --- */}
      
      {/* Controls Overlay */}
      <div className="absolute bottom-8 right-6 z-[1000] flex flex-col gap-4 pointer-events-auto items-end">
         
         <div className="flex flex-col gap-3 items-end">
            <button 
                aria-label={showFilters ? "Fechar filtros" : "Abrir filtros"}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowFilters(!showFilters);
                }}
                className={`group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-xl border backdrop-blur-md ${showFilters ? 'bg-gray-900 text-white border-gray-900' : 'bg-white/90 text-gray-700 border-white/50 hover:bg-white hover:scale-105'}`}
                title="Filtrar Mapa"
            >
                {showFilters ? <X size={20} /> : <Filter size={20} />}
            </button>

            <div className="flex flex-col bg-white/90 backdrop-blur-md border border-white/50 rounded-2xl shadow-xl overflow-hidden">
                <button 
                    onClick={() => triggerZoom(1)}
                    className="p-3 hover:bg-white text-gray-700 transition-colors active:bg-gray-100 border-b border-gray-100"
                    title="Aumentar Zoom"
                >
                    <Plus size={20} />
                </button>
                <button 
                    onClick={() => triggerZoom(-1)}
                    className="p-3 hover:bg-white text-gray-700 transition-colors active:bg-gray-100"
                    title="Diminuir Zoom"
                >
                    <Minus size={20} />
                </button>
            </div>
         </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute bottom-36 right-6 z-[1000] w-72 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-gray-200/50 border border-white p-5 flex flex-col gap-5">
                {/* Theme Filter */}
                <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <Tag size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Tema</span>
                    </div>
                    <div className="relative">
                        <select 
                        value={filterTheme} 
                        onChange={(e) => setFilterTheme(e.target.value)}
                        className="w-full text-sm py-2.5 pl-3 pr-8 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all cursor-pointer font-medium text-gray-700"
                        >
                        <option value="all">Todos os temas</option>
                        {THEMES.map((theme, i) => (
                            <option key={i} value={theme.label}>{theme.label}</option>
                        ))}
                        </select>
                    </div>
                </div>
                
                {/* Location Filter */}
                <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <MapPin size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Localização</span>
                    </div>
                    <div className="relative">
                        <select 
                        value={filterLocation} 
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="w-full text-sm py-2.5 pl-3 pr-8 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all cursor-pointer font-medium text-gray-700"
                        >
                        <option value="all">Todas as localizações</option>
                        {uniqueLocations.map((loc, i) => (
                            <option key={i} value={loc}>{loc}</option>
                        ))}
                        </select>
                    </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 text-xs text-gray-400 border-t border-gray-200">
                    <span>A mostrar</span>
                    <span className="font-bold text-gray-900">{visibleTestimonials.length} histórias</span>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Leaflet Map Layer --- */}
      <div className="absolute inset-0 z-0 bg-[#F9FAFB]">
        <MapContainer 
            center={[39.6, -7.0]} 
            zoom={7} 
            minZoom={5}
            maxBounds={portugalBounds}
            maxBoundsViscosity={0.5}
            scrollWheelZoom={true} 
            zoomControl={false}
            className="w-full h-full"
            style={{ background: '#F9FAFB' }}
        >
            <MapEvents onZoom={setCurrentZoom} />
            
            {/* 
                Layer 1: Background only (No labels)
                We removed the second tile layer and replaced it with custom Markers below
                to ensure labels are always in Portuguese, Uppercase, and clutter-free.
            */}
            <TileLayer
                className="stylized-map-tiles"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            />
            
            <ZoomController zoomChange={zoomTrigger} />
            
            {/* Custom Map Labels for Districts */}
            {DISTRICT_LABELS.map((label) => (
              <Marker
                key={label.name}
                position={[label.lat, label.lng]}
                icon={L.divIcon({
                  className: 'map-label-icon',
                  html: `<div class="map-label-text">${label.name}</div>`,
                  iconSize: [100, 20],
                  iconAnchor: [50, -10] // Offset slightly below the point
                })}
                interactive={false}
                zIndexOffset={-1000} // Force labels to stay behind pins
              />
            ))}

            {visibleTestimonials.map((item) => (
                <Marker 
                    key={item.id} 
                    position={[item.lat, item.lng]}
                    icon={createCustomIcon(activeId === item.id, currentZoom)}
                    eventHandlers={{
                        click: () => handleMarkerClick(item.id),
                    }}
                />
            ))}
        </MapContainer>
      </div>

      {/* --- Card Overlay Layer --- */}
      <AnimatePresence>
        {activeId && (
            <div className="absolute inset-0 z-[500] pointer-events-none flex items-center justify-center p-4">
            {visibleTestimonials.filter(t => t.id === activeId).map((t) => (
                <div key={t.id} className="pointer-events-auto">
                    <TestimonialCard 
                        text={t.text} 
                        icon={t.icon}
                        author={t.author}
                        location={t.location}
                        tag={t.tag}
                        date={t.createdAt}
                        onClose={() => setActiveId(null)} 
                    />
                </div>
            ))}
            </div>
        )}
      </AnimatePresence>

    </div>
  );
};