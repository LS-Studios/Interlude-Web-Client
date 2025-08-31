'use server';

import type { ConversionResult, Provider } from '@/lib/types';

const API_BASE_URL = 'https://interlude.api.leshift.de';

export async function getProviders(): Promise<Provider[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers`);
    if (!response.ok) {
      throw new Error('Failed to fetch providers');
    }
    const providers: Provider[] = await response.json();
    return providers.map(provider => ({
      ...provider,
      logo: `${API_BASE_URL}${provider.logo}`
    }));
  } catch (error) {
    console.error('Error fetching providers:', error);
    return [];
  }
}

export async function convertLink(url: string): Promise<ConversionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/convert?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to convert link');
    }
    const result: ConversionResult = await response.json();
    
    const providers = await getProviders();
    const providersMap = new Map(providers.map(p => [p.id, p]));

    const linksWithLogos = result.links.map(link => {
        const provider = providersMap.get(link.provider_id);
        return {
            ...link,
            provider_logo: provider?.logo
        }
    })

    return { ...result, links: linksWithLogos };
  } catch (error) {
    console.error('Error converting link:', error);
    throw error;
  }
}
