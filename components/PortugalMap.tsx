
import * as React from 'react';
import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Filter, MapPin, Tag, Plus, X, Minus, RotateCcw } from 'lucide-react';
import { Testimonial, THEMES, DISTRICT_LABELS } from '../constants';
import { TestimonialCard } from './TestimonialCard';

interface PortugalMapProps {
  testimonials: Testimonial[];
  activeId: string | null;
  onActiveIdChange: (id: string | null) => void;
  onZoomChange?: (isZoomed: boolean) => void;
}

// 1. Map Controller: reliably captures the map instance for parent usage
const MapController = ({ setMap }: { setMap: (m: L.Map) => void }) => {
  const map = useMap();
  useEffect(() => {
    setMap(map);
  }, [map, setMap]);
  return null;
};

// 2. Zoom Event Tracker
const MapEvents = ({ onZoom }: { onZoom: (zoom: number) => void }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoom(map.getZoom());
    },
  });
  return null;
};

// 3. Desktop Popup Tracker: Keeps the card anchored to the marker
const PopupMarkerTracker: React.FC<{ testimonial: Testimonial, onClose: () => void }> = ({ testimonial, onClose }) => {
  const map = useMap();
  const [position, setPosition] = useState<{x: number, y: number} | null>(null);

  const updatePosition = () => {
    const point = map.latLngToContainerPoint([testimonial.lat, testimonial.lng]);
    setPosition(point);
  };

  useEffect(() => {
    updatePosition();
    map.on('move', updatePosition);
    map.on('zoom', updatePosition);
    map.on('resize', updatePosition);
    
    return () => {
      map.off('move', updatePosition);
      map.off('zoom', updatePosition);
      map.off('resize', updatePosition);
    };
  }, [map, testimonial]);

  if (!position) return null;

  return (
    <div 
      className="absolute top-0 left-0 z-[1000] pointer-events-none"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: 'transform'
      }}
    >
        <div className="flex justify-center -translate-x-1/2 -translate-y-full pb-6 pointer-events-auto">
             <TestimonialCard 
                text={testimonial.text}
                icon={testimonial.icon}
                author={testimonial.author}
                location={testimonial.location}
                tag={testimonial.tag}
                date={testimonial.createdAt}
                onClose={onClose}
             />
        </div>
    </div>
  );
};

// Stylized Marker Icon
const createCustomIcon = (isActive: boolean, zoom: number, isUserContribution?: boolean) => {
  const hitAreaSize = 64; 
  const innerDotSize = zoom < 8 ? 'w-4 h-4' : 'w-5 h-5';
  
  // Special styling for user's own contribution: Green to Blue gradient
  const dotStyles = isUserContribution 
    ? 'bg-gradient-to-tr from-[#6BAE2E] to-[#0872B1] border-white shadow-md' 
    : `bg-white border-[#6BAE2E] ${isActive ? 'bg-[#6BAE2E]' : ''}`;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="w-full h-full flex items-center justify-center relative group" aria-label="Ver história">
        <!-- Visual Wrapper -->
        <div class="${zoom < 8 ? 'w-8 h-8' : 'w-12 h-12'} relative flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110' : 'hover:scale-110'}">
          
          <!-- White/Green Glow -->
          <div class="absolute inset-0 rounded-full bg-white blur-md opacity-50 group-hover:opacity-80 transition-opacity"></div>
          
          <!-- Active Pulse -->
          ${isActive || isUserContribution ? `
            <div class="absolute inset-0 rounded-full ${isUserContribution ? 'bg-[#0872B1]/30' : 'bg-white'} animate-ping opacity-60"></div>
            <div class="absolute inset-0 rounded-full ${isUserContribution ? 'bg-[#6BAE2E]/20' : 'bg-white/40'} animate-pulse scale-125"></div>
          ` : ''}
          
          <!-- Main Pin Body -->
          <div class="relative ${innerDotSize} rounded-full ${dotStyles} border-[3px] shadow-sm z-10 box-content">
          </div>
        </div>
      </div>
    `,
    iconSize: [hitAreaSize, hitAreaSize],
    iconAnchor: [hitAreaSize/2, hitAreaSize/2],
  });
};

export const PortugalMap: React.FC<PortugalMapProps> = ({ testimonials, activeId, onActiveIdChange, onZoomChange }) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [currentZoom, setCurrentZoom] = useState(7);
  
  // Filters
  const [filterTheme, setFilterTheme] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Camera FlyTo logic when activeId changes externally
  useEffect(() => {
    if (activeId && map) {
        const testimonial = testimonials.find(t => t.id === activeId);
        if (testimonial) {
            const targetZoom = Math.max(map.getZoom(), 10);
            const offset = 220; // Shift map center UP so marker is lower
            
            // Calculate center
            const markerPx = map.project([testimonial.lat, testimonial.lng], targetZoom);
            const targetCenterPx = markerPx.subtract([0, offset]); 
            const targetLatLng = map.unproject(targetCenterPx, targetZoom);
            
            map.flyTo(targetLatLng, targetZoom, { animate: true, duration: 1.5 });
        }
    }
  }, [activeId, map, testimonials]);

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(testimonials.map(t => t.location))).sort();
  }, [testimonials]);

  // Filter Logic
  const baseFiltered = useMemo(() => {
    return testimonials.filter(t => {
      const matchesTheme = filterTheme === 'all' || t.tag === filterTheme || t.tag.includes(filterTheme);
      const matchesLocation = filterLocation === 'all' || t.location === filterLocation;
      return matchesTheme && matchesLocation;
    });
  }, [testimonials, filterTheme, filterLocation]);

  // Visibility Logic
  const visibleTestimonials = useMemo(() => {
    if (filterTheme !== 'all' || filterLocation !== 'all') {
      return baseFiltered;
    }

    return baseFiltered.filter(t => {
      if (activeId === t.id) return true;
      // PC Optimization: Show more markers
      if (currentZoom >= 10) return true;
      if (currentZoom >= 8) return (t.visibilityRank || 0) < 0.6;
      return (t.visibilityRank || 0) < 0.35;
    });
  }, [baseFiltered, currentZoom, activeId, filterTheme, filterLocation]);

  const handleMarkerClick = (id: string) => {
    onActiveIdChange(activeId === id ? null : id);
  };

  // --- Direct Map Controls ---
  
  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (map) map.zoomIn();
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (map) map.zoomOut();
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onActiveIdChange(null);
    if (map) {
        map.setView([39.6, -7.0], 7, { animate: true });
    }
  };

  const portugalBounds: L.LatLngBoundsExpression = [
    [30.0, -32.0], // Extended to cover Azores
    [43.0, -4.0],  // Mainland
  ];

  return (
    // Background: Clean Light Gray (#F9FAFB)
    <div className="w-full h-full relative overflow-hidden bg-[#F9FAFB]">
      
      {/* Controls Overlay (Fixed position for PC) - Adjusted position for cleaner look */}
      <div 
        className="absolute right-6 bottom-12 z-[1000] flex flex-col gap-4 pointer-events-auto items-end"
        onClick={(e) => e.stopPropagation()} 
      >
         
         <div className="flex flex-col gap-3 items-end">
            {/* Filter Toggle */}
            <button 
                aria-label={showFilters ? "Fechar filtros" : "Abrir filtros"}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowFilters(!showFilters);
                }}
                className={`group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-xl border backdrop-blur-md cursor-pointer ${showFilters ? 'bg-[#064e3b] text-white border-[#064e3b]' : 'bg-white/80 text-gray-700 border-white/40 hover:bg-white hover:scale-105'}`}
                title="Filtrar Mapa"
            >
                {showFilters ? <X size={24} /> : <Filter size={24} />}
            </button>
            
            {/* Zoom & Reset Group */}
            <div className="flex flex-col bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl overflow-hidden">
                <button 
                    onClick={handleZoomIn}
                    className="p-3 hover:bg-white text-gray-700 transition-colors active:bg-gray-50 border-b border-gray-200/50 cursor-pointer flex items-center justify-center"
                    title="Aumentar Zoom"
                    aria-label="Aumentar Zoom"
                >
                    <Plus size={24} />
                </button>
                <button 
                    onClick={handleZoomOut}
                    className="p-3 hover:bg-white text-gray-700 transition-colors active:bg-gray-50 border-b border-gray-200/50 cursor-pointer flex items-center justify-center"
                    title="Diminuir Zoom"
                    aria-label="Diminuir Zoom"
                >
                    <Minus size={24} />
                </button>
                <button 
                    onClick={handleReset}
                    className="p-3 hover:bg-white text-gray-700 transition-colors active:bg-gray-50 cursor-pointer flex items-center justify-center"
                    title="Reiniciar Mapa"
                    aria-label="Reiniciar Mapa"
                >
                    <RotateCcw size={24} />
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
            className="absolute right-6 bottom-40 z-[1000] w-72 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-teal-900/10 border border-white/60 p-5 flex flex-col gap-4">
                {/* Header with Close Button */}
                <div className="flex justify-between items-center pb-2 border-b border-gray-100/50">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Filtrar Histórias</span>
                    <button 
                        onClick={() => setShowFilters(false)}
                        className="p-1 -mr-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Fechar Filtros"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Theme Filter */}
                <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                        <Tag size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Tema</span>
                    </div>
                    <div className="relative">
                        <select 
                        value={filterTheme} 
                        onChange={(e) => setFilterTheme(e.target.value)}
                        className="w-full text-sm py-2.5 pl-3 pr-8 rounded-lg border border-gray-200 bg-white/50 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all cursor-pointer font-medium text-gray-700"
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
                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                        <MapPin size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Localização</span>
                    </div>
                    <div className="relative">
                        <select 
                        value={filterLocation} 
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="w-full text-sm py-2.5 pl-3 pr-8 rounded-lg border border-gray-200 bg-white/50 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all cursor-pointer font-medium text-gray-700"
                        >
                        <option value="all">Todas as localizações</option>
                        {uniqueLocations.map((loc, i) => (
                            <option key={i} value={loc}>{loc}</option>
                        ))}
                        </select>
                    </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 text-xs text-gray-500 border-t border-gray-200">
                    <span>A mostrar</span>
                    <span className="font-bold text-gray-900">{visibleTestimonials.length} histórias</span>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Leaflet Map Layer --- */}
      <div className="absolute inset-0 z-0 bg-transparent">
        <MapContainer 
            center={[39.6, -7.0]} 
            zoom={7} 
            minZoom={5}
            maxBounds={portugalBounds}
            maxBoundsViscosity={0.5}
            scrollWheelZoom={true} 
            zoomControl={false}
            className="w-full h-full"
            style={{ background: 'transparent' }} 
            dragging={true}
        >
            {/* Capture Map Instance */}
            <MapController setMap={setMap} />
            
            <MapEvents onZoom={setCurrentZoom} />
            
            <TileLayer
                className="stylized-map-tiles"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            />
            
            {/* Custom Map Labels for Districts */}
            {DISTRICT_LABELS.map((label) => (
              <Marker
                key={label.name}
                position={[label.lat, label.lng]}
                icon={L.divIcon({
                  className: 'map-label-icon',
                  html: `<div class="map-label-text">${label.name}</div>`,
                  iconSize: [100, 20],
                  iconAnchor: [50, -10]
                })}
                interactive={false}
                zIndexOffset={-1000}
              />
            ))}

            {visibleTestimonials.map((item) => (
                <Marker 
                    key={item.id} 
                    position={[item.lat, item.lng]}
                    icon={createCustomIcon(activeId === item.id, currentZoom, item.isUserContribution)}
                    title={item.tag}
                    alt={item.tag}
                    eventHandlers={{
                        click: () => handleMarkerClick(item.id),
                    }}
                />
            ))}

            {/* Render Active Card via Tracker */}
            <AnimatePresence>
              {activeId && visibleTestimonials.filter(t => t.id === activeId).map((t) => (
                  <PopupMarkerTracker 
                    key={t.id} 
                    testimonial={t} 
                    onClose={() => onActiveIdChange(null)} 
                  />
              ))}
            </AnimatePresence>

        </MapContainer>
      </div>

    </div>
  );
};
