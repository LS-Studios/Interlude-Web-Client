'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';

export function BottomNavBar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t('nav.home'), icon: Home },
    { href: '/history', label: t('nav.history'), icon: History },
    { href: '/settings', label: t('nav.settings'), icon: SettingsIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
        <nav className="grid h-full grid-cols-3">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'inline-flex flex-col items-center justify-center font-medium px-2 hover:bg-muted',
                        pathname === item.href ? 'text-accent' : 'text-muted-foreground',
                    )}
                >
                    <item.icon className="h-6 w-6 mb-1" />
                    <span className="text-xs">{item.label}</span>
                </Link>
            ))}
        </nav>
    </div>
  );
}
