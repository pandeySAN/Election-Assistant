import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCountry } from './store/sessionSlice';
import { MessageSquare, Calendar, BookOpen, Globe, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from './components/Chat/ChatWindow';
import ElectionTimeline from './components/Timeline/ElectionTimeline';
import LearnTab from './components/Learn/LearnTab';
import Header from './components/Header';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const country = useSelector((state) => state.session.country);
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    if (!isDarkMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500/30">
      <Header 
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isDarkMode={isDarkMode}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Redesigned Sidebar */}
        <motion.nav 
          role="navigation"
          aria-label="Main navigation"
          className="hidden lg:flex flex-col w-72 flex-shrink-0 border-r border-white/5 bg-slate-900/20 backdrop-blur-md p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Tab Switcher */}
          <div role="tablist" aria-label="Application sections" className="bg-slate-950/40 p-1.5 rounded-2xl border border-white/5 mb-8 flex flex-col gap-1 relative">
            <TabButton 
              active={activeTab === 'chat'} 
              onClick={() => setActiveTab('chat')} 
              icon={<MessageSquare size={18} />} 
              label="Chat Assistant" 
              tabId="tab-chat"
              panelId="panel-chat"
            />
            <TabButton 
              active={activeTab === 'timeline'} 
              onClick={() => setActiveTab('timeline')} 
              icon={<Calendar size={18} />} 
              label="Election Timeline" 
              tabId="tab-timeline"
              panelId="panel-timeline"
            />
            <TabButton 
              active={activeTab === 'learn'} 
              onClick={() => setActiveTab('learn')} 
              icon={<BookOpen size={18} />} 
              label="Learning Center" 
              tabId="tab-learn"
              panelId="panel-learn"
            />
          </div>

          {/* Sidebar Mini-Cards */}
          <div className="space-y-4 mt-auto">
            <SidebarCard 
              label="Region" 
              value={country === 'IN' ? '🇮🇳 India' : country === 'US' ? '🇺🇸 USA' : '🇬🇧 UK'}
              icon={<Globe size={14} className="text-primary" />}
            />
            <SidebarCard 
              label="Session" 
              value={`${messages.length} messages`}
              icon={<MessageSquare size={14} className="text-success" />}
            />
            <div className="glass-panel rounded-2xl p-4 border-success/20 glass-glow-emerald">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-success" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-success">Tip of the day</span>
              </div>
              <p className="text-xs text-main leading-relaxed">
                Use voice input for hands-free interaction with ElectBot!
              </p>
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div
                role="tabpanel"
                id={`panel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
                className="flex-1 overflow-hidden"
              >
                {activeTab === 'chat' && <ChatWindow onNavigate={setActiveTab} />}
                {activeTab === 'timeline' && <ElectionTimeline onNavigate={setActiveTab} />}
                {activeTab === 'learn' && <LearnTab onNavigate={setActiveTab} />}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, tabId, panelId }) {
  return (
    <button
      id={tabId}
      role="tab"
      aria-selected={active}
      aria-controls={panelId}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
        active ? 'text-white' : 'text-muted hover:text-main'
      }`}
    >
      {active && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl shadow-lg shadow-blue-500/20"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10 font-medium text-sm">{label}</span>
    </button>
  );
}

function SidebarCard({ label, value, icon }) {
  return (
    <div className="glass-panel rounded-2xl p-4 hover:border-white/20 transition-colors group">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wider font-bold text-muted group-hover:text-main transition-colors">
          {label}
        </span>
        {icon}
      </div>
      <div className="text-sm font-semibold text-main">{value}</div>
    </div>
  );
}

export default App;
