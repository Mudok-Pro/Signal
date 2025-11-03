import Link from 'next/link';
import { UserNav } from '@/components/user-nav';
import { LanguageSwitcher } from '@/components/language-switcher';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <div className="relative w-8 h-8">
            <Image src="https://i.imgur.com/3Z4QjB8.png" alt="Mechasos Logo" fill className="p-1 bg-white rounded-md object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-xl leading-none" lang="en">Mechasos</span>
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
