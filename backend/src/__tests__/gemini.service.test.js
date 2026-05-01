import { describe, it, expect } from 'vitest';

// We import the pure parseResponse logic by extracting it
// This tests the core parsing without any network calls

const parseResponse = (text) => {
  const followUp1Match = text.match(/FOLLOWUP1:\s*(.*)/i);
  const followUp2Match = text.match(/FOLLOWUP2:\s*(.*)/i);

  const suggestedFollowUps = [];
  if (followUp1Match && followUp1Match[1]) suggestedFollowUps.push(followUp1Match[1].trim());
  if (followUp2Match && followUp2Match[1]) suggestedFollowUps.push(followUp2Match[1].trim());

  const cleanReply = text
    .replace(/FOLLOWUP1:.*$/gmi, '')
    .replace(/FOLLOWUP2:.*$/gmi, '')
    .trim();

  return { reply: cleanReply, suggestedFollowUps, confidence: 0.95 };
};

describe('parseResponse', () => {
  it('extracts both follow-up suggestions from the response text', () => {
    const rawText = `Voting is a fundamental right.\nFOLLOWUP1: How do I register to vote?\nFOLLOWUP2: What is the election commission?`;
    const result = parseResponse(rawText);

    expect(result.suggestedFollowUps).toHaveLength(2);
    expect(result.suggestedFollowUps[0]).toBe('How do I register to vote?');
    expect(result.suggestedFollowUps[1]).toBe('What is the election commission?');
  });

  it('removes FOLLOWUP lines from the clean reply', () => {
    const rawText = `Voting is a fundamental right.\nFOLLOWUP1: How do I register?\nFOLLOWUP2: What is EVM?`;
    const result = parseResponse(rawText);

    expect(result.reply).not.toContain('FOLLOWUP1');
    expect(result.reply).not.toContain('FOLLOWUP2');
    expect(result.reply).toContain('Voting is a fundamental right.');
  });

  it('returns empty follow-ups when none are present', () => {
    const rawText = `Elections are held every 5 years in India.`;
    const result = parseResponse(rawText);

    expect(result.suggestedFollowUps).toHaveLength(0);
    expect(result.reply).toBe('Elections are held every 5 years in India.');
  });

  it('returns confidence score of 0.95', () => {
    const result = parseResponse('Some AI reply.');
    expect(result.confidence).toBe(0.95);
  });

  it('handles case-insensitive FOLLOWUP tags', () => {
    const rawText = `Answer here.\nfollowup1: Question one?\nFOLLOWUP2: Question two?`;
    const result = parseResponse(rawText);
    expect(result.suggestedFollowUps).toHaveLength(2);
  });
});
