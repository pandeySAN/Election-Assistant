const { getChatResponse } = require('../services/gemini.service');

// Simple in-memory session store for local prototype
const memorySessions = new Map();

const handleChat = async (req, res, next) => {
  try {
    const { message, sessionId, country = 'IN', electionType = 'general', userLevel = 'beginner' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sessionKey = sessionId || 'default-session';
    
    // Retrieve history
    let history = memorySessions.get(sessionKey) || [];

    // Add user message to history
    history.push({ role: 'user', content: message });

    // Call Gemini Service
    const aiResponse = await getChatResponse({
      message,
      history: history.slice(0, -1), // pass previous history
      country,
      electionType,
      userLevel
    });

    // Add AI response to history
    history.push({ role: 'assistant', content: aiResponse.reply });
    
    // Keep history reasonably sized (e.g. last 10 messages)
    if (history.length > 10) history = history.slice(-10);
    
    memorySessions.set(sessionKey, history);

    return res.json({
      reply: aiResponse.reply,
      suggestedFollowUps: aiResponse.suggestedFollowUps,
      confidence: aiResponse.confidence,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleChat };
