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

    if (!Array.isArray(providers)) {
      console.log('[getProviders] Response is not an array, returning empty.');
      return [];
    }
    
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
    const response = await fetch(`${API_BASE_URL}/convert`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ url }),
      cache: 'no-store',
    });

    const responseBody = await response.text();
    console.log(`[convertLink] Response Status: ${response.status}`);
    console.log(`[convertLink] Response Body: ${responseBody}`);

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} - ${responseBody || 'No error message'}`
      );
    }
    
    const result: ConversionResult = JSON.parse(responseBody);
    console.log('[convertLink] Parsed Result:', JSON.stringify(result, null, 2));

    console.log('--- END DEBUG: convertLink ---');
    return result;

  } catch (error) {
    console.error('[convertLink] Catched Error:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unknown error occurred during link conversion.');
  }
}
