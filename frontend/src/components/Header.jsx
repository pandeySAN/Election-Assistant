import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Download, Moon, Sun, Info, X, 
  Volume2, VolumeX, Globe, Sparkles 
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setCountry } from '../store/sessionSlice';

export default function Header({ onToggleDarkMode, isDarkMode }) {
  const [showSettings, setShowSettings] = useState(false);
  const country = useSelector((state) => state.session.country);
  const dispatch = useDispatch();

  return (
    <header role="banner" className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
      {/* Brand Section */}
      <div className="flex items-center gap-4">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl font-bold text-bold tracking-tight">
            Elect<span className="text-primary">Bot</span>
          </h1>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 glass-glow-blue">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Your Election Guide</span>
          </div>
          <span className="text-2xl animate-flag ml-1" role="img" aria-label="India Flag">
            🇮🇳
          </span>
        </motion.div>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-3">
        {/* Sleek Pill Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-2 bg-surface/40 border border-white/10 rounded-full px-4 py-1.5 hover:border-primary/50 transition-all cursor-pointer">
            <Globe size={14} className="text-muted group-hover:text-primary transition-colors" />
            <select 
              aria-label="Select country or region"
              className="bg-transparent border-none text-xs font-semibold focus:ring-0 text-main cursor-pointer appearance-none pr-4"
              value={country}
              onChange={(e) => dispatch(setCountry(e.target.value))}
            >
              <option value="IN">India</option>
              <option value="US">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>
        </div>

        <div className="h-4 w-px bg-white/10 mx-1" />

        <div className="flex items-center gap-1">
          <HeaderAction icon={<Download size={18} />} title="Export chat history" ariaLabel="Export chat history" />
          <HeaderAction 
            icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />} 
            onClick={onToggleDarkMode} 
            title="Toggle Theme"
            ariaLabel={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          />
          <HeaderAction 
            icon={<Settings size={18} />} 
            onClick={() => setShowSettings(!showSettings)} 
            title="Settings"
            ariaLabel="Open app settings"
            ariaExpanded={showSettings}
          />
        </div>
      </div>

      {/* Settings Modal - Redesigned */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed top-20 right-6 w-80 glass-panel rounded-3xl p-6 border-white/10 shadow-2xl z-[60]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-bold">App Settings</h3>
              <button onClick={() => setShowSettings(false)} aria-label="Close settings" className="p-1 hover:bg-white/10 rounded-lg">
                <X size={18} className="text-muted" aria-hidden="true" />
              </button>
            </div>
            {/* Settings content would go here */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs text-muted mb-1">Theme Mode</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-main">Dark Mode</span>
                  <div className="w-10 h-5 bg-primary rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs text-muted mb-1">Language</p>
                <p className="text-sm font-medium text-main">English (Neutral)</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeaderAction({ icon, onClick, title, ariaLabel, ariaExpanded }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="p-2.5 rounded-xl text-muted hover:text-bold transition-all hover:glass-glow-blue border border-transparent hover:border-white/10"
      title={title}
      aria-label={ariaLabel || title}
      aria-expanded={ariaExpanded}
    >
      <span aria-hidden="true">{icon}</span>
    </motion.button>
  );
}
