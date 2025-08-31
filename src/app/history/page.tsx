
'use client';

import { HistoryList } from '@/components/history-list';
import { useLanguage } from '@/components/language-provider';

export default function HistoryPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-center">{t('history.title')}</h1>
      <HistoryList />
    </div>
  );
}
