import { Globe } from 'lucide-react';
import { ConvertedLinkRow } from '@/components/converted-link-row';
import { Separator } from '@/components/ui/separator';
import type { ConversionResult } from '@/lib/types';
import { useLanguage } from './language-provider';
import { ScrollArea } from './ui/scroll-area';

interface ConversionResultsProps {
  result: ConversionResult;
}

export function ConversionResults({ result }: ConversionResultsProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t('results.source_link')}</h3>
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <a
            href={result.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm break-all hover:underline"
          >
            {result.source_url}
          </a>
        </div>
      </div>
      <Separator />
      <ScrollArea className="max-h-[50vh] pr-4">
        <div className="flex flex-col gap-1">
          {result.links.map(link => (
            <ConvertedLinkRow key={link.id} link={link} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
