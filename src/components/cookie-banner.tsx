
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from './language-provider';

const COOKIE_CONSENT_KEY = 'cookie_consent';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="container mx-auto flex flex-col items-center justify-between gap-4 p-4 shadow-2xl md:flex-row">
        <p className="text-sm text-muted-foreground">
          {t('cookie_banner.text_start')}{' '}
          <a href="https://leshift.de/interlude/datenschutz" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            {t('cookie_banner.privacy_policy')}
          </a>
          {t('cookie_banner.text_end')}
        </p>
        <Button onClick={handleAccept} className="w-full flex-shrink-0 md:w-auto">
          {t('cookie_banner.accept')}
        </Button>
      </Card>
    </div>
  );
}
