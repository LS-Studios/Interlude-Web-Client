
'use client';

import Image from 'next/image';
import { Share } from 'lucide-react';
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

  const handleShare = async (event: React.MouseEvent) => {
    event.stopPropagation(); // prevent the row's click handler from firing

    if (navigator.share) {
      try {
        await navigator.share({
          title: link.displayName,
          text: `Listen to ${link.displayName} on ${link.provider.name}`,
          url: link.url,
        });
      } catch (error) {
        // User cancelled the share dialog, or an error occurred.
        // We can silently ignore this, as it's usually user action.
        console.info('Share action was cancelled or failed', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      handleCopy();
    }
  };


  const handleClick = () => {
    if (link.url) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const longPressEvents = useLongPress(handleCopy, handleClick);
  
  const hasLink = !!link.url;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            {...(hasLink ? longPressEvents : {})}
            className={`flex items-center p-3 rounded-lg ${hasLink ? 'hover:bg-muted cursor-pointer' : 'opacity-50'} transition-colors`}
            role={hasLink ? "button" : "presentation"}
            tabIndex={hasLink ? 0 : -1}
            onKeyDown={(e) => {
              if (hasLink && (e.key === 'Enter' || e.key === ' ')) handleClick();
            }}
          >
            <div className="flex items-center gap-4 flex-1">
              {link.artwork ? (
                <Image
                  src={link.artwork}
                  alt={`${link.displayName} artwork`}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-md object-cover"
                  unoptimized
                />
              ) : (
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                    {/* You might want a placeholder icon here */}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold">{link.displayName || 'Not found'}</p>
                <p className="text-sm text-muted-foreground">{link.provider.name}</p>
              </div>
            </div>
            {hasLink && (
              <>
                <Button variant="ghost" size="icon" className="ml-4 h-8 w-8 text-muted-foreground" aria-label="Share link" onClick={handleShare}>
                  <Share className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </TooltipTrigger>
        {hasLink && (
            <TooltipContent>
                <p>{t('results.long_press_to_copy')}</p>
            </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
