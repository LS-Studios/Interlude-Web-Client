
'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { LinkConverter } from '@/components/link-converter';
import { ProvidersGrid } from '@/components/providers-grid';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/components/language-provider';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="text-center mt-8 sm:mt-16 flex flex-col items-center gap-6">
        <Image 
          src="/logo.png" 
          alt="Interlude Logo" 
          width={80} 
          height={80}
          priority
          className="rounded-lg"
        />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          {t('home.title')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('home.description')}
        </p>
      </div>
      
      <div className="w-full max-w-3xl my-8">
        <LinkConverter />
      </div>

      <Suspense fallback={<ProvidersGridSkeleton />}>
        <ProvidersGrid />
      </Suspense>
    </div>
  );
}

function ProvidersGridSkeleton() {
  return (
    <div className="w-full py-12">
      <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">Supported Providers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}
