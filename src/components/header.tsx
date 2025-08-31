'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/history', label: t('nav.history'), icon: History },
    { href: '/settings', label: t('nav.settings'), icon: SettingsIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
           <Link href="/" className="flex items-center space-x-2 px-4">
             <span className="font-bold text-lg text-accent">Interlude</span>
           </Link>
        </div>
        <nav className="hidden md:flex flex-1 items-center justify-end space-x-1">
          {navItems.map(item => (
            <Button
              key={item.href}
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="md:hidden flex flex-1 justify-end">
            <nav className="flex items-center">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center justify-center rounded-full h-10 w-10 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                            pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
      </div>
    </header>
  );
}
