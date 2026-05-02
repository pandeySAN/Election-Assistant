import { describe, it, expect, vi } from 'vitest';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler.js';

describe('Error Handler Middleware', () => {
  it('errorHandler sets status code to 500 by default', () => {
    const err = new Error('Test Error');
    const req = { path: '/test', method: 'GET', ip: '127.0.0.1' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          message: 'Test Error',
          statusCode: 500,
        }),
      })
    );
  });

  it('notFoundHandler sets status code to 404', () => {
    const req = { path: '/not-found' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Route not found',
        path: '/not-found',
        statusCode: 404,
      },
    });
  });
});
