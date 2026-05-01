import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, BrainCircuit, CheckCircle2, XCircle, ChevronRight, MessageSquare, Trophy, RotateCcw, AlertCircle } from 'lucide-react';
import client from '../../api/client';
import { addMessage } from '../../store/chatSlice';
import Loading from '../Loading';

export default function LearnTab({ onNavigate }) {
  const [activeSection, setActiveSection] = useState('quiz'); // 'quiz' | 'glossary'

  return (
    <div className="flex flex-col h-full bg-deep">
      {/* Learn Header Tabs */}
      <motion.div
        className="flex p-4 gap-4 border-b border-white/5 bg-deep sticky top-0 z-10 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => setActiveSection('quiz')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${activeSection === 'quiz'
              ? 'bg-gradient-to-r from-primary to-success text-white shadow-lg shadow-primary/20'
              : 'bg-surface text-muted hover:bg-surface/80 hover:text-main'
            }`}
        >
          <BrainCircuit size={18} />
          Knowledge Quiz
        </button>
        <button
          onClick={() => setActiveSection('glossary')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${activeSection === 'glossary'
              ? 'bg-gradient-to-r from-primary to-success text-white shadow-lg shadow-primary/20'
              : 'bg-surface text-muted hover:bg-surface/80 hover:text-main'
            }`}
        >
          <BookOpen size={18} />
          Glossary
        </button>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {activeSection === 'quiz' ? <QuizSection key="quiz" onNavigate={onNavigate} /> : <GlossarySection key="glossary" onNavigate={onNavigate} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function QuizSection({ onNavigate }) {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await client.get('/quiz');
        setQuestions(res.data.questions || []);
      } catch (error) {
        console.error(error);
        setError('Failed to load quiz questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <Loading type="pulse" />
        <p className="text-muted mt-4">Loading quiz questions...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface p-8 rounded-2xl border border-red-900/50 text-center"
      >
        <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-bold mb-2">Unable to Load Quiz</h3>
        <p className="text-muted mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  if (!questions.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-muted py-20 bg-surface/50 rounded-2xl border border-white/5"
      >
        <BookOpen size={48} className="mx-auto mb-4 text-muted" />
        <p>No questions available.</p>
      </motion.div>
    );
  }

  if (currentIdx >= questions.length) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface p-8 rounded-2xl border border-white/5 text-center"
      >
        <motion.div
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-emerald-500/20' : 'bg-surface/50'
            }`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          {passed ? (
            <Trophy size={48} className="text-emerald-400" />
          ) : (
            <BrainCircuit size={48} className="text-slate-400" />
          )}
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-xl text-main mb-2">
          You scored <span className="text-primary font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span>
        </p>
        <p className="text-lg text-muted mb-8">
          {percentage}% - {passed ? '🎉 Great job!' : '📚 Keep learning!'}
        </p>
        <button
          onClick={() => {
            setCurrentIdx(0);
            setScore(0);
            setIsAnswered(false);
            setSelectedOption(null);
          }}
          className="flex items-center gap-2 mx-auto bg-gradient-to-r from-primary to-success hover:opacity-90 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg"
        >
          <RotateCcw size={18} />
          Retake Quiz
        </button>
      </motion.div>
    );
  }

  const q = questions[currentIdx];

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === q.correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    setCurrentIdx(i => i + 1);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <motion.div
      key={currentIdx}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-surface p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-muted uppercase tracking-wider">
          Question {currentIdx + 1} of {questions.length}
        </span>
        <span className="text-sm font-medium text-primary bg-primary/10 border border-primary/30 px-3 py-1 rounded-full">
          Score: {score}
        </span>
      </div>

      <div className="w-full bg-surface/50 h-2 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-primary to-success h-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx) / questions.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <h3 className="text-2xl font-bold mb-8 leading-snug text-bold">{q.question}</h3>

      <div className="space-y-3 mb-8">
        {q.options.map((opt, i) => {
          let bgColor = 'bg-surface/50 hover:bg-surface';
          let borderColor = 'border-white/5 hover:border-primary/30';
          let textColor = 'text-main';
          let icon = null;

          if (isAnswered) {
            if (i === q.correct) {
              bgColor = 'bg-emerald-500/20';
              borderColor = 'border-emerald-500';
              textColor = 'text-emerald-300 font-medium';
              icon = <CheckCircle2 size={18} className="text-emerald-400" />;
            } else if (i === selectedOption) {
              bgColor = 'bg-red-500/20';
              borderColor = 'border-red-500';
              textColor = 'text-red-300';
              icon = <XCircle size={18} className="text-red-500" />;
            } else {
              bgColor = 'bg-surface opacity-50';
              borderColor = 'border-white/5';
            }
          }

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={isAnswered}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${bgColor} ${borderColor} ${textColor}`}
              whileHover={!isAnswered ? { scale: 1.02, x: 5 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
            >
              <span>{opt}</span>
              {icon}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-deep rounded-xl p-4 border border-white/5 mb-6">
              <p className="text-sm text-muted uppercase tracking-wider mb-2">Explanation</p>
              <p className="text-main text-sm leading-relaxed">{q.explanation}</p>
            </div>
            <div className="flex justify-end">
              <motion.button
                onClick={nextQuestion}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-success hover:opacity-90 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentIdx === questions.length - 1 ? 'Finish' : 'Next Question'}
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GlossarySection({ onNavigate }) {
  const [terms, setTerms] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGlossary = async () => {
      try {
        setLoading(true);
        const res = await client.get(`/glossary?search=${search}`);
        setTerms(res.data.terms || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchGlossary(), 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const askAboutTerm = (term) => {
    dispatch(addMessage({ role: 'user', content: `What is meant by ${term} in the context of elections?` }));
    onNavigate('chat');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
        <input
          type="text"
          placeholder="Search political terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-white/5 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-bold placeholder-muted transition-all"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Loading type="dots" text="Searching..." />
        </div>
      ) : terms.length === 0 ? (
        <div className="text-center text-muted py-10 bg-surface/50 rounded-xl border border-white/5">
          <BookOpen size={48} className="mx-auto mb-4 text-muted" />
          <p>No terms found for "{search}"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {terms.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx}
              className="bg-surface border border-white/5 rounded-xl p-5 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-bold mb-2">{item.term}</h3>
                  <p className="text-main text-sm leading-relaxed mb-3">{item.definition}</p>
                  {item.example && (
                    <div className="bg-deep rounded-lg p-3 mb-3 border border-white/5">
                      <p className="text-xs text-muted italic">💡 Example: {item.example}</p>
                    </div>
                  )}
                  {item.relatedTerms?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.relatedTerms.map((rt, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-wider font-semibold bg-surface text-muted px-2 py-1 rounded">
                          {rt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <motion.button
                  onClick={() => askAboutTerm(item.term)}
                  className="flex items-center justify-center gap-2 flex-shrink-0 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare size={16} />
                  Ask ElectBot
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}