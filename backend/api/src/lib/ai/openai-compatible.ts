import { detectHighRisk, ECHO_SYSTEM_PROMPT } from './prompt.js';
import type { ReflectionProvider, ReflectionRequest, ReflectionResult } from './types.js';

/**
 * Reflection through any OpenAI-compatible chat endpoint.
 *
 * This is how Echo runs on a free tier: Groq, Google Gemini's OpenAI-compatible
 * endpoint and OpenRouter's free models all speak this one protocol, so the
 * provider is chosen by configuration (base URL, key, model), not by code.
 *
 * What it does not claim: an ordinary API over TLS proves the connection, not
 * the computation. Every reflection from here carries `attestation: null`, and
 * the consent ledger records it as an unattested access — the receipt says
 * exactly what happened, which is the point of the receipt. Review the chosen
 * provider's retention and training terms before enabling it in production;
 * some free tiers may use requests to improve their models.
 */
export class OpenAICompatibleReflectionProvider implements ReflectionProvider {
  readonly name: string;

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly baseUrl: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {
    // The host is the honest provider name: "api.groq.com" says more than a label.
    this.name = `openai-compatible:${new URL(baseUrl).host}`;
  }

  async reflect({ content }: ReflectionRequest): Promise<ReflectionResult> {
    const highRisk = detectHighRisk(content);

    const response = await this.fetchImpl(`${this.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        // Echo is meant to be brief — two or three short paragraphs.
        max_tokens: 400,
        temperature: 0.7,
        messages: [
          { role: 'system', content: ECHO_SYSTEM_PROMPT },
          { role: 'user', content },
        ],
      }),
    });

    if (!response.ok) {
      // Without the body: a provider error can quote the prompt that caused it,
      // and the prompt is the one thing that must never reach a log. 429 is named
      // because on a free tier it is the expected failure, not a bug.
      throw new Error(
        response.status === 429
          ? 'Reflection provider rate limit reached (free tier). Try again shortly.'
          : `Reflection provider failed with ${response.status}.`,
      );
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
      model?: string;
    };
    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('Reflection provider returned no content.');

    return {
      content: text,
      modelVersion: payload.model ?? this.model,
      safetyNotice: highRisk ? 'support_resources' : 'none',
      attestation: null,
    };
  }
}
