const { getGeminiClient } = require('../config/gemini');
const { buildSystemPrompt } = require('./context.service');

const getChatResponse = async ({ message, history, country, electionType, userLevel }) => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: buildSystemPrompt(country, electionType, userLevel),
    });

    // Format history for Gemini multi-turn chat
    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: { maxOutputTokens: 800 },
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();
    return parseResponse(text);
  } catch (error) {
    console.error('Gemini API Error:', error);
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
    confidence: 0.95,
  };
};

module.exports = { getChatResponse };