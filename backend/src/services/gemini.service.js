const Groq = require('groq-sdk');
const { buildSystemPrompt } = require('./context.service');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getChatResponse = async ({ message, history, country, electionType, userLevel }) => {
  try {
    // Format history for Groq (OpenAI-compatible format)
    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    const messages = [
      { role: 'system', content: buildSystemPrompt(country, electionType, userLevel) },
      ...formattedHistory,
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Free, fast, highly capable
      messages,
      max_tokens: 800,
    });

    const text = completion.choices[0]?.message?.content || '';
    return parseResponse(text);
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to fetch response from ElectBot');
  }
};

const parseResponse = (text) => {
  const followUp1Match = text.match(/FOLLOWUP1:\s*(.*)/i);
  const followUp2Match = text.match(/FOLLOWUP2:\s*(.*)/i);

  const suggestedFollowUps = [];
  if (followUp1Match && followUp1Match[1]) suggestedFollowUps.push(followUp1Match[1].trim());
  if (followUp2Match && followUp2Match[1]) suggestedFollowUps.push(followUp2Match[1].trim());

  // Remove the FOLLOWUP lines from the reply to be displayed
  const cleanReply = text
    .replace(/FOLLOWUP1:.*$/gmi, '')
    .replace(/FOLLOWUP2:.*$/gmi, '')
    .trim();

  return {
    reply: cleanReply,
    suggestedFollowUps,
    confidence: 0.95
  };
};

module.exports = { getChatResponse };