
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProviders } from '@/lib/actions';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/language-provider';
import type { Provider } from '@/lib/types';

export function ProvidersGrid() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchProviders() {
      const fetchedProviders = await getProviders();
      setProviders(fetchedProviders);
    }
    fetchProviders();
  }, []);

  const title = t('home.supported_providers');

  if (!Array.isArray(providers) || providers.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12">
      <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">{title}</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {providers.map(provider => (
          <a key={provider.name} href={provider.url} target="_blank" rel="noopener noreferrer" className="w-40">
            <Card className="flex items-center justify-center p-4 aspect-square transition-all hover:bg-muted">
              <CardContent className="p-0">
                <Image
                  src={provider.logoUrl}
                  alt={`${provider.name} logo`}
                  width={128}
                  height={128}
                  className="h-24 w-24 object-contain dark:grayscale dark:brightness-0 dark:invert"
                  unoptimized
                />
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
