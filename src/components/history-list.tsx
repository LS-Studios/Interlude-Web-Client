'use client';

import { useState } from 'react';
import { useHistory } from '@/hooks/use-history';
import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { HistoryItem } from '@/lib/types';
import { ConversionResults } from '@/components/conversion-results';
import { Skeleton } from '@/components/ui/skeleton';

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

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {history.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-base font-medium break-all">{item.source_url}</CardTitle>
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
        <DialogContent className="max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('results.title')}</DialogTitle>
          </DialogHeader>
          {selectedItem && <ConversionResults result={selectedItem} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
