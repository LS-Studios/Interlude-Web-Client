
'use client';

import Link from 'next/link';
import { useLanguage } from './language-provider';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex h-14 items-center px-4">
        <div className="w-full flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
            <p>&copy; {new Date().getFullYear()} Interlude. {t('footer.rights_reserved')}</p>
            <div className="flex items-center gap-4">
              <Link href="/imprint" className="hover:text-primary">
                {t('footer.imprint')}
              </Link>
              <Link href="/privacy" className="hover:text-primary">
                {t('footer.privacy')}
              </Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
