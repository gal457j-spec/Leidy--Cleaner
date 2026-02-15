.skip(const RetryQueue = require('../services/RetryQueueService');
const db = require('../db');

describe('RetryQueueService basic tests', () => {
  beforeAll(() => {
    // Mock DB methods used by the service
    db.run = jest.fn().mockResolvedValue({ changes: 1, lastID: 1 });
    db.all = jest.fn().mockResolvedValue([]);
    db.get = jest.fn().mockResolvedValue(null);
  });

  test('enqueue should return success and retryId', async () => {
    const res = await RetryQueue.enqueue('op-1', 'process_webhook', { test: true }, { source: 'unit' });
    expect(res).toHaveProperty('success', true);
    expect(res).toHaveProperty('retryId');
    expect(typeof res.retryId).toBe('string');
  });

  test('processQueue should handle empty pending list', async () => {
    const res = await RetryQueue.processQueue();
    expect(res).toHaveProperty('success', true);
    expect(res).toHaveProperty('processed');
    expect(res.processed).toBe(0);
  });
});
