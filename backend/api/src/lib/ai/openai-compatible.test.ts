import { describe, expect, it, vi } from 'vitest';
import { OpenAICompatibleReflectionProvider } from './openai-compatible.js';

/**
 * The free-tier provider. What matters: it sends the Echo system prompt and
 * the one memory, returns the reply, never claims an attestation, and never
 * lets a provider error body (which can quote the prompt) into its message.
 */

function respond(body: unknown, status = 200) {
  return { ok: status < 400, status, json: async () => body } as Response;
}

const BASE = 'https://api.groq.com/openai/v1';

describe('OpenAICompatibleReflectionProvider', () => {
  it('posts the system prompt and the memory, and returns the reply unattested', async () => {
    const fetchImpl = vi.fn(async () =>
      respond({ model: 'llama-3.3-70b-versatile', choices: [{ message: { content: ' A reflection. ' } }] }),
    );
    const provider = new OpenAICompatibleReflectionProvider('key', 'llama-3.3-70b-versatile', BASE, fetchImpl);

    const result = await provider.reflect({ content: 'I could not sleep again.' });

    expect(result.content).toBe('A reflection.');
    expect(result.modelVersion).toBe('llama-3.3-70b-versatile');
    expect(result.attestation).toBeNull();
    expect(provider.name).toBe('openai-compatible:api.groq.com');

    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${BASE}/chat/completions`);
    const body = JSON.parse(String(init.body));
    expect(body.messages[0].role).toBe('system');
    expect(body.messages[1]).toEqual({ role: 'user', content: 'I could not sleep again.' });
    expect((init.headers as Record<string, string>).authorization).toBe('Bearer key');
  });

  it('names a free-tier rate limit, and never echoes the error body', async () => {
    const secret = 'my private sentence';
    const fetchImpl = vi.fn(async () => respond({ error: { message: `quota exceeded for: ${secret}` } }, 429));
    const provider = new OpenAICompatibleReflectionProvider('key', 'm', BASE, fetchImpl);

    await expect(provider.reflect({ content: secret })).rejects.toThrow(/rate limit/);
    await expect(provider.reflect({ content: secret })).rejects.not.toThrow(new RegExp(secret));
  });

  it('rejects an empty completion instead of returning nothing', async () => {
    const fetchImpl = vi.fn(async () => respond({ choices: [{ message: { content: '  ' } }] }));
    const provider = new OpenAICompatibleReflectionProvider('key', 'm', BASE, fetchImpl);
    await expect(provider.reflect({ content: 'x' })).rejects.toThrow(/no content/);
  });
});
