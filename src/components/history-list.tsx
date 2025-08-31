
'use client';

import { useState } from 'react';
import { useHistory } from '@/hooks/use-history';
import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { HistoryItem } from '@/lib/types';
import { ConversionResults } from '@/components/conversion-results';
import { Skeleton } from '@/components/ui/skeleton';
import { Link2 } from 'lucide-react';

export function HistoryList() {
  const { history, isLoaded } = useHistory();
  const { t, language } = useLanguage();
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  if (!isLoaded) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">{t('history.empty')}</p>
      </div>
    );
  }

  const getDisplayName = (item: HistoryItem) => {
    return item.links.find(link => link.displayName)?.displayName || 'Unknown Title';
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {history.map(item => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="text-lg font-semibold">{getDisplayName(item)}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-1">
                  <Link2 className="h-4 w-4" />
                  <span className="truncate">{item.source_url}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('history.converted_at')}{' '}
                {new Date(item.timestamp).toLocaleString(language, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setSelectedItem(item)}>
                {t('history.view_results')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('results.title')}</DialogTitle>
          </DialogHeader>
          {selectedItem && <ConversionResults result={selectedItem} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

