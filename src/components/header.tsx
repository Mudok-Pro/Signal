import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { LanguageSwitcher } from '@/components/language-switcher';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Wrench className="h-6 w-6" />
          <div className="flex flex-col">
            <span className="font-headline leading-none" lang="ar">ميكا-تك</span>
            <span className="font-headline text-xs leading-none opacity-80" lang="en">MekaTech</span>
          </div>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-1">
            <LanguageSwitcher />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
