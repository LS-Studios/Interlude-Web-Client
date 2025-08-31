'use client';

import Image from 'next/image';
import { ExternalLink, Copy } from 'lucide-react';
import { useLongPress } from '@/hooks/use-long-press';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ConvertedLink } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/components/language-provider';

interface ConvertedLinkRowProps {
  link: ConvertedLink;
}

export function ConvertedLinkRow({ link }: ConvertedLinkRowProps) {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleCopy = () => {
    navigator.clipboard.writeText(link.url);
    toast({
      title: t('results.copied'),
    });
  };

  const handleClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const longPressEvents = useLongPress(handleCopy, handleClick);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            {...longPressEvents}
            className="flex items-center p-3 -m-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClick();
            }}
          >
            <div className="flex items-center gap-4 flex-1">
              {link.provider.logoUrl && (
                <Image
                  src={link.provider.logoUrl}
                  alt={`${link.provider.name} logo`}
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                  unoptimized
                />
              )}
              <div className="flex-1">
                <p className="font-semibold">{link.provider.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="ml-4 h-8 w-8 text-muted-foreground" aria-label="Open link">
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 text-muted-foreground" aria-label="Copy link">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('results.long_press_to_copy')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
