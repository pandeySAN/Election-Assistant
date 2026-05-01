import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageSquare, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import client from '../../api/client';
import { addMessage } from '../../store/chatSlice';
import Loading from '../Loading';

export default function ElectionTimeline({ onNavigate }) {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const country = useSelector(state => state.session.country);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await client.get(`/timeline?country=${country}`);
        setSteps(res.data.steps || []);
      } catch (error) {
        console.error('Failed to fetch timeline', error);
        setError('Failed to load timeline. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [country]);

  const askAboutStep = (stepTitle) => {
    dispatch(addMessage({ role: 'user', content: `Tell me more about the "${stepTitle}" step in the election process.` }));
    onNavigate('chat');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-deep">
        <div className="text-center">
          <Loading type="pulse" />
          <p className="text-muted mt-4">Loading election timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-deep p-4">
        <div className="max-w-md text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-main mb-2">Unable to Load Timeline</h3>
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-900">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <CalendarIcon size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-bold">
                Election Timeline
              </h2>
              <p className="text-sm text-muted">Step-by-step guide to the election process</p>
            </div>
          </div>
        </motion.div>

        <div className="relative border-l-2 border-slate-700 ml-6 md:ml-8">
          {steps.map((step, idx) => (
            <TimelineStep 
              key={step.id} 
              step={step} 
              index={idx} 
              isLast={idx === steps.length - 1}
              onAsk={() => askAboutStep(step.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ step, index, isLast, onAsk }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success border-success text-bold';
      case 'active': return 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]';
      case 'upcoming': return 'bg-surface border-white/10 text-muted';
      default: return 'bg-surface border-white/10';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative pl-8 md:pl-12 py-6 ${isLast ? '' : 'border-b border-slate-800/50'}`}
    >
      {/* Circle Marker */}
      <div className={`absolute left-[-17px] top-7 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${getStatusColor(step.status)}`}>
        {index + 1}
      </div>

      <div className="bg-surface/50 rounded-xl border border-white/10 p-5 hover:border-primary/30 transition-colors">
        <div 
          className="flex justify-between items-start cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{step.icon}</span>
              <h3 className="text-xl font-bold text-bold">{step.title}</h3>
            </div>
            <p className="text-sm text-primary font-medium mb-2">{step.date}</p>
            <p className="text-main text-sm">{step.description}</p>
          </div>
          <button className="text-muted hover:text-main p-1">
            <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronDown size={20} />
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-white/10">
                <ul className="list-disc ml-5 text-sm text-muted mb-4 space-y-1">
                  {step.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAsk();
                  }}
                  className="flex items-center gap-2 text-sm text-primary hover:text-blue-400 font-medium transition-colors"
                >
                  <MessageSquare size={16} />
                  Ask ElectBot about this
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
