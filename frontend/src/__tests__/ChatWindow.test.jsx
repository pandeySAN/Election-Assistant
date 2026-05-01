import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ChatWindow from '../components/Chat/ChatWindow';
import chatSlice from '../store/chatSlice';
import sessionSlice from '../store/sessionSlice';

// Mock the API client
vi.mock('../api/client', () => ({
  default: {
    post: vi.fn(),
  },
}));

import client from '../api/client';

const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      chat: chatSlice,
      session: sessionSlice,
    },
    preloadedState,
  });

const renderWithStore = (store) =>
  render(
    <Provider store={store}>
      <ChatWindow />
    </Provider>
  );

describe('ChatWindow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the welcome screen with suggested prompts when no messages exist', () => {
    const store = createTestStore();
    renderWithStore(store);

    expect(screen.getByText('Welcome to ElectBot')).toBeInTheDocument();
    expect(screen.getByText('How does voting work?')).toBeInTheDocument();
    expect(screen.getByText('What is EVM?')).toBeInTheDocument();
  });

  it('renders the chat input field', () => {
    const store = createTestStore();
    renderWithStore(store);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('sends a message when a suggested prompt is clicked', async () => {
    client.post.mockResolvedValue({
      data: {
        reply: 'Voting is a fundamental right.',
        suggestedFollowUps: [],
        confidence: 0.95,
      },
    });

    const store = createTestStore();
    renderWithStore(store);

    const promptButton = screen.getByText('How does voting work?');
    fireEvent.click(promptButton);

    await waitFor(() => {
      expect(client.post).toHaveBeenCalledWith(
        '/chat',
        expect.objectContaining({ message: 'How does voting work?' })
      );
    });
  });

  it('displays an error message when the API call fails', async () => {
    client.post.mockRejectedValue(new Error('Network Error'));

    const store = createTestStore();
    renderWithStore(store);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test question' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText(/Sorry, I encountered an error/i)).toBeInTheDocument();
    });
  });

  it('has a send button with an accessible aria-label', () => {
    const store = createTestStore();
    renderWithStore(store);

    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('has a chat log with role=log for screen readers', () => {
    const store = createTestStore();
    renderWithStore(store);

    expect(screen.getByRole('log')).toBeInTheDocument();
  });
});
