'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';
import { useLanguage } from '@/components/language-provider';
import { convertLink } from '@/lib/actions';
import type { ConversionResult as ConversionResultType, HistoryItem } from '@/lib/types';
import { ConversionResults } from '@/components/conversion-results';

const FormSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormValues = z.infer<typeof FormSchema>;

export function LinkConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HistoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();
  const { addToHistory } = useHistory();
  const { t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const conversionResult = await convertLink(data.url);
      if (conversionResult && conversionResult.links && conversionResult.links.length > 0) {
        const historyItem = {
            ...conversionResult,
            id: uuidv4(),
            timestamp: new Date().toISOString(),
        };
        setResult(historyItem);
        setIsDialogOpen(true);
        addToHistory(historyItem);
      } else {
        toast({
          variant: 'destructive',
          title: 'Conversion Failed',
          description: 'Could not find any matching links.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('error.generic'),
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const urlError = form.formState.errors.url;
  const customErrorMessage = urlError ? t('error.invalid_url') : '';

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start gap-2">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input 
                      placeholder={t('home.input_placeholder')} 
                      {...field} 
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage>{customErrorMessage}</FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 text-base px-8 flex-shrink-0">
              {isLoading ? t('home.button_converting') : t('home.button_convert')}
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg w-[calc(100vw-2rem)] md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('results.title')}</DialogTitle>
          </DialogHeader>
          {result && <ConversionResults result={result} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
