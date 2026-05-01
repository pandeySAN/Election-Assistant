import React from 'react';
import { motion } from 'framer-motion';

export default function Loading({ type = 'dots', text = 'Loading...', className = '' }) {
  if (type === 'dots') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        {text && <span className="text-sm text-muted">{text}</span>}
      </div>
    );
  }

  if (type === 'spinner') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          className="w-8 h-8 border-4 border-surface border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {text && <span className="ml-3 text-sm text-muted">{text}</span>}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-primary to-success rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    );
  }

  if (type === 'bars') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-1 bg-primary rounded-full"
            animate={{
              height: ['8px', '24px', '8px'],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
        {text && <span className="ml-3 text-sm text-muted">{text}</span>}
      </div>
    );
  }

  // Default skeleton loader
  return (
    <div className={`space-y-3 ${className}`}>
      <motion.div
        className="h-4 bg-surface rounded"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="h-4 bg-surface rounded w-4/5"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="h-4 bg-surface rounded w-3/5"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
}
