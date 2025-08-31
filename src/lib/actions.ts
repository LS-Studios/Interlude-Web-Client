'use server';

import type { ConversionResult, Provider } from '@/lib/types';

const API_BASE_URL = 'https://interlude.api.leshift.de';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (process.env.INTERLUDE_API_TOKEN) {
    const encodedToken = Buffer.from(
      process.env.INTERLUDE_API_TOKEN
    ).toString('base64');
    headers['Authorization'] = `Bearer ${encodedToken}`;
  }
  return headers;
};

export async function getProviders(): Promise<Provider[]> {
  console.log('--- DEBUG: getProviders ---');
  try {
    const response = await fetch(`${API_BASE_URL}/providers`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    console.log(`[getProviders] Response Status: ${response.status}`);

    const responseBody = await response.text();
    console.log(`[getProviders] Response Body: ${responseBody}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch providers. Status: ${response.status}, Body: ${responseBody}`
      );
    }
    const providers: Provider[] = JSON.parse(responseBody);
    console.log(
      '[getProviders] Parsed providers:',
      JSON.stringify(providers, null, 2)
    );

    const result = providers.map((provider) => ({
      ...provider,
      url: provider.url || '#',
    }));
    console.log('--- END DEBUG: getProviders ---');
    return result;
  } catch (error) {
    console.error('[getProviders] Catched Error:', error);
    console.log('--- END DEBUG: getProviders (with error) ---');
    return [];
  }
}

export async function convertLink(
  url: string
): Promise<ConversionResult | null> {
  console.log(`--- DEBUG: convertLink (url: ${url}) ---`);
  try {
    const response = await fetch(
      `${API_BASE_URL}/convert?link=${encodeURIComponent(url)}`,
      { headers: getHeaders() }
    );
    console.log(`[convertLink] Response Status: ${response.status}`);

    const responseBody = await response.text();
    console.log(`[convertLink] Response Body: ${responseBody}`);

    if (!response.ok) {
      let errorMessage = responseBody;
      try {
        const errorJson = JSON.parse(responseBody);
        errorMessage = errorJson.message || responseBody;
      } catch (e) {
        // Not a JSON response, use the text as is.
      }
      throw new Error(errorMessage || 'Failed to convert link');
    }

    const result: ConversionResult = JSON.parse(responseBody);
    console.log(
      '[convertLink] Parsed Result:',
      JSON.stringify(result, null, 2)
    );
    console.log('--- END DEBUG: convertLink ---');
    return result;
  } catch (error) {
    console.error('[convertLink] Catched Error:', error);
    console.log('--- END DEBUG: convertLink (with error) ---');
    throw error;
  }
}
