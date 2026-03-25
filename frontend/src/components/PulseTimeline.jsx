import React from 'react';
import { motion } from 'framer-motion';

const PulseTimeline = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-white/10 italic">
        <p className="text-[10px] tracking-widest uppercase">No data points mapped</p>
      </div>
    );
  }

  return (
    <div className="h-full pr-4 overflow-y-auto custom-scrollbar flex flex-col gap-8 py-4">
      {events.map((event, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-8 group"
        >
          {/* Connector Line */}
          {index !== events.length - 1 && (
            <div className="absolute left-[7px] top-4 bottom-[-32px] w-[2px] bg-gradient-to-b from-neon-green/40 to-transparent"></div>
          )}

          {/* Pulse Node */}
          <div className="absolute left-0 top-1.5 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-neon-green/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_10px_#00ff41]"></div>
              <motion.div 
                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-neon-green"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-neon-green font-bold opacity-60">
              {event.date}
            </span>
            <p className="text-xs font-medium text-white/80 leading-relaxed group-hover:text-white transition-colors">
              {event.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PulseTimeline;
