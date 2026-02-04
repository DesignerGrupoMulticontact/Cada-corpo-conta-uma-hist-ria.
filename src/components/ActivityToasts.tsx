'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Clock } from 'lucide-react';
import { Testimonial } from '@/lib/constants';

interface ActivityToastsProps {
  isActive: boolean;
  testimonials: Testimonial[];
  onNavigate: (id: string) => void;
  userStory: Testimonial | null;
}

interface NotificationData {
  id: string; 
  name: string;
  age: string; 
  location: string;
  action: string;
  time: string;
}

const ACTIONS = [
  "acabou de partilhar a sua história.",
  "contou a sua história.",
  "partilhou como se sente."
];

export const ActivityToasts: React.FC<ActivityToastsProps> = ({ isActive, testimonials, onNavigate, userStory }) => {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const countRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userStoryShownRef = useRef<string | null>(null);

  const parseAuthor = (authorStr: string) => {
    const parts = authorStr.split(',');
    if (parts.length > 1) {
        return { name: parts[0].trim(), age: parts[1].trim() };
    }
    return { name: authorStr, age: '' };
  };

  const generateNotification = (specificStory?: Testimonial): NotificationData | null => {
    if (specificStory) {
         const { name, age } = parseAuthor(specificStory.author);
         return {
            id: specificStory.id,
            name: name,
            age: age,
            location: specificStory.location,
            action: "acabou de partilhar a sua história.",
            time: "Agora mesmo"
         };
    }

    if (testimonials.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * testimonials.length);
    const story = testimonials[randomIndex];
    const { name, age } = parseAuthor(story.author);
    const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];

    return {
      id: story.id,
      name: name,
      age: age,
      location: story.location,
      action: randomAction,
      time: "Agora mesmo"
    };
  };

  useEffect(() => {
    if (userStory && userStory.id !== userStoryShownRef.current) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        const notif = generateNotification(userStory);
        setNotification(notif);
        userStoryShownRef.current = userStory.id;

        timeoutRef.current = setTimeout(() => {
            setNotification(null);
        }, 6000);
    }
  }, [userStory]);

  useEffect(() => {
    if (!isActive) return;

    if (userStory && notification?.id === userStory.id) return;

    const scheduleNext = () => {
      if (countRef.current >= 4) return;

      const isFirst = countRef.current === 0;
      const delay = isFirst 
        ? 1000 
        : Math.floor(Math.random() * 6000) + 4000;

      timeoutRef.current = setTimeout(() => {
        if (userStoryShownRef.current && userStory?.id === userStoryShownRef.current) {
             scheduleNext();
             return;
        }

        const newNotif = generateNotification();
        setNotification(newNotif);
        countRef.current += 1;

        setTimeout(() => {
          setNotification(null);
          scheduleNext();
        }, 5000);
      }, delay);
    };

    scheduleNext();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive, userStory]); 

  return (
    <div className="fixed top-24 right-4 md:top-24 md:right-8 z-[60] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence mode="wait">
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 20, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => onNavigate(notification.id)}
            className="pointer-events-auto cursor-pointer bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-black/5 rounded-2xl p-4 pr-6 flex items-start gap-3.5 max-w-[280px] md:max-w-xs group hover:bg-white/95 transition-colors"
          >
            <div className="relative shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6BAE2E] to-[#2E8B57] flex items-center justify-center text-white shadow-sm">
                <Sparkles size={14} className="fill-white/20" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border border-white"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5 mb-0.5">
                <span className="text-sm font-bold text-gray-900 leading-none group-hover:text-[#6BAE2E] transition-colors">
                  {notification.name}{notification.age ? `, ${notification.age}` : ''}
                </span>
              </div>
              
              <p className="text-xs text-gray-600 leading-snug mb-2">
                {notification.action}
              </p>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                  <MapPin size={10} />
                  <span>{notification.location}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                  <Clock size={10} />
                  <span>{notification.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};