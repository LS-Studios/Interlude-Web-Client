'use server';

import type { ConversionResult, Provider, ApiConversionResult } from '@/lib/types';

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

    const apiResult: ApiConversionResult = JSON.parse(responseBody);
    console.log(
      '[convertLink] Parsed API Result:',
      JSON.stringify(apiResult, null, 2)
    );

    const result: ConversionResult = {
        source_url: url,
        links: apiResult.results.map(link => ({
            ...link,
            // The API returns provider as a string, but our components expect a Provider object.
            // This is a temporary patch. Ideally we'd fetch all providers and find the matching one.
            provider: {
                name: link.provider,
                url: '',
                logoUrl: '',
                iconUrl: ''
            }
        }))
    };
    
    console.log(
      '[convertLink] Mapped to ConversionResult:',
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