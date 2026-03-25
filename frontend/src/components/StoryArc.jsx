import React from 'react';
import { motion } from 'framer-motion';

const StoryArc = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-bloomberg-gray text-[10px]">
        NO DATA POINTS MAPPED
      </div>
    );
  }

  return (
    <div className="relative h-full w-full py-2 overflow-x-auto scrollbar-hide">
      {/* Timeline track */}
      <div className="absolute top-[60%] left-0 w-full h-[1px] bg-white/10" />
      
      <div className="flex gap-16 px-6 h-full items-center min-w-max">
        {events.map((event, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="relative flex flex-col items-center group mt-4"
          >
            {/* Date label */}
            <span className="text-[9px] font-black text-white/30 mb-2 uppercase tracking-tighter">
              {event.date}
            </span>
            
            {/* Node with Neon Glow */}
            <div className="w-2.5 h-2.5 rounded-full bg-neon-green shadow-[0_0_12px_rgba(0,255,65,0.6)] group-hover:scale-150 transition-all duration-300 cursor-help" />
            
            {/* Premium Tooltip */}
            <div className="absolute -top-16 w-32 glass-card bg-black/90 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0 shadow-2xl z-20">
              <p className="text-[9px] leading-tight text-white/90 font-medium italic">
                {event.description}
              </p>
            </div>
            
            {/* Connector line up to date */}
            <div className="absolute top-[100%] w-[1px] h-2 bg-neon-green/20" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StoryArc;
