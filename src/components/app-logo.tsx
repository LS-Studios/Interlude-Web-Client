import { Link as LinkIcon, Shuffle } from 'lucide-react';
import { useLanguage } from './language-provider';

export function AppLogo() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <LinkIcon className="h-6 w-6 text-primary" />
        <Shuffle className="h-5 w-5 -ml-1 text-secondary-foreground" />
      </div>
      <span className="font-bold text-lg">{t('app.name')}</span>
    </div>
  );
}
