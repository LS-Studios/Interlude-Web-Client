import { HistoryList } from '@/components/history-list';
import { translations } from '@/lib/i18n';

export default function HistoryPage() {
  const title = translations.en['history.title']; // Cannot use hook on server

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-center">{title}</h1>
      <HistoryList />
    </div>
  );
}
