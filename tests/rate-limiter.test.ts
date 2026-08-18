import { describe, expect, it } from 'vitest';

import { RateLimiter } from '../src/index.js';

describe('RateLimiter', () => {
  it('allows requests immediately while tokens remain', async () => {
    const limiter = new RateLimiter(5, 1_000);
    const start = Date.now();
    for (let i = 0; i < 5; i++) await limiter.acquire();
    expect(Date.now() - start).toBeLessThan(100);
  });

  it('delays once the bucket is exhausted', async () => {
    const limiter = new RateLimiter(2, 200); // 100ms per token
    await limiter.acquire();
    await limiter.acquire();
    const start = Date.now();
    await limiter.acquire(); // must wait for a refill
    expect(Date.now() - start).toBeGreaterThanOrEqual(50);
  });
});
