'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';
import { useLanguage } from '@/components/language-provider';
import { convertLink } from '@/lib/actions';
import type { ConversionResult as ConversionResultType } from '@/lib/types';
import { ConversionResults } from '@/components/conversion-results';

const FormSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormValues = z.infer<typeof FormSchema>;

export function LinkConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConversionResultType | null>(null);
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
      if (conversionResult && conversionResult.links.length > 0) {
        setResult(conversionResult);
        setIsDialogOpen(true);
        addToHistory({ ...conversionResult, timestamp: new Date().toISOString() });
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
  
  // Use a custom error message for zod validation failures
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
        <DialogContent className="max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('results.title')}</DialogTitle>
          </DialogHeader>
          {result && <ConversionResults result={result} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
