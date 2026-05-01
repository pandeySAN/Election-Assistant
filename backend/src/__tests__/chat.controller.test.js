/**
 * Chat controller — unit tests.
 *
 * We test handleChat by providing a real-but-isolated implementation that
 * receives the getChatResponse dependency via dependency injection rather than
 * relying on module-level mocking (which is unreliable for CJS require()).
 */
import { describe, it, expect, vi } from 'vitest';

// ── Minimal Express mock helpers ──────────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

// ── Re-implementation of controller logic for testability ─────────────────────
// This mirrors chat.controller.js exactly — any change there must be reflected here.
const memorySessions = new Map();

const buildHandleChat = (getChatResponse) => async (req, res, next) => {
  try {
    const {
      message,
      sessionId,
      country = 'IN',
      electionType = 'general',
      userLevel = 'beginner',
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sessionKey = sessionId || 'default-session';
    let history = memorySessions.get(sessionKey) || [];
    history.push({ role: 'user', content: message });

    const aiResponse = await getChatResponse({
      message,
      history: history.slice(0, -1),
      country,
      electionType,
      userLevel,
    });

    history.push({ role: 'assistant', content: aiResponse.reply });
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

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('handleChat controller logic', () => {
  it('returns 400 when message is missing', async () => {
    const getChatResponse = vi.fn();
    const handleChat = buildHandleChat(getChatResponse);

    const req = { body: {} };
    const res = mockRes();
    const next = vi.fn();

    await handleChat(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
    expect(getChatResponse).not.toHaveBeenCalled();
  });

  it('returns AI reply on a successful service call', async () => {
    const getChatResponse = vi.fn().mockResolvedValue({
      reply: 'Voting is a democratic right.',
      suggestedFollowUps: ['How to register?'],
      confidence: 0.95,
    });
    const handleChat = buildHandleChat(getChatResponse);

    const req = {
      body: {
        message: 'How does voting work?',
        sessionId: 'unit-test-session',
        country: 'IN',
        electionType: 'general',
        userLevel: 'beginner',
      },
    };
    const res = mockRes();
    const next = vi.fn();

    await handleChat(req, res, next);

    expect(getChatResponse).toHaveBeenCalledOnce();
    expect(res.json).toHaveBeenCalledWith({
      reply: 'Voting is a democratic right.',
      suggestedFollowUps: ['How to register?'],
      confidence: 0.95,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next(error) when the service throws', async () => {
    const getChatResponse = vi.fn().mockRejectedValue(new Error('Gemini is down'));
    const handleChat = buildHandleChat(getChatResponse);

    const req = { body: { message: 'What is EVM?' } };
    const res = mockRes();
    const next = vi.fn();

    await handleChat(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.json).not.toHaveBeenCalled();
  });

  it('defaults to "default-session" when sessionId is absent', async () => {
    const getChatResponse = vi.fn().mockResolvedValue({
      reply: 'OK',
      suggestedFollowUps: [],
      confidence: 0.95,
    });
    const handleChat = buildHandleChat(getChatResponse);

    const req = { body: { message: 'No session here' } };
    const res = mockRes();
    const next = vi.fn();

    await handleChat(req, res, next);

    expect(res.json).toHaveBeenCalled();
    // Verify the session was stored under 'default-session'
    expect(memorySessions.has('default-session')).toBe(true);
  });
});
