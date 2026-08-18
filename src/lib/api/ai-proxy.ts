import type { AIProxyRequestPayload, AIProxyResponsePayload } from '@/types';

export async function callStructuredAIProxy<
  TOutput = Record<string, unknown>,
  TInput = Record<string, unknown>,
>(payload: AIProxyRequestPayload<TInput>): Promise<TOutput> {
  const proxyUrl = process.env.AI_PROXY_URL;
  const email = process.env.CANDIDATE_EMAIL;
  const apiKey = process.env.AI_API_KEY;

  if (!email || !apiKey || !proxyUrl) {
    throw new Error('AI Proxy credentials missing.');
  }

  const authHeader = `Basic ${Buffer.from(`${email}:${apiKey}`).toString('base64')}`;

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `AI Proxy returned status ${response.status}: ${errorText || response.statusText}`,
    );
  }

  const data = await response.json() as AIProxyResponsePayload<TOutput>;

  if (data.status !== 'success' || !data.parsed_output) {
    throw new Error(
      `AI Proxy error: ${data.error || JSON.stringify(data)}`,
    );
  }

  return data.parsed_output;
}
