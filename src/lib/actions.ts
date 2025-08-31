'use server';

import type { ConversionResult, Provider, HistoryItem } from '@/lib/types';

const API_BASE_URL = 'https://interlude.api.leshift.de';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (process.env.INTERLUDE_API_TOKEN) {
    const encodedToken = Buffer.from(process.env.INTERLUDE_API_TOKEN).toString('base64');
    headers['Authorization'] = `Bearer ${encodedToken}`;
  }
  return headers;
}

export async function getProviders(): Promise<Provider[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers`, { headers: getHeaders(), cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch providers');
    }
    const providers: Provider[] = await response.json();
    return providers.map(provider => ({
      ...provider,
      url: provider.url || '#'
    }));
  } catch (error) {
    console.error('Error fetching providers:', error);
    return [];
  }
}

export async function convertLink(url: string): Promise<ConversionResult | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/convert?link=${encodeURIComponent(url)}`, { headers: getHeaders() });
    
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = errorText;
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorText;
        } catch (e) {
            // Not a JSON response, use the text as is.
        }
        throw new Error(errorMessage || 'Failed to convert link');
    }

    const result: ConversionResult = await response.json();
    
    return result;
  } catch (error) {
    console.error('Error converting link:', error);
    throw error;
  }
}
