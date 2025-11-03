"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useApp } from "./app-provider"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { CreditCard, LogIn, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import Link from "next/link";
import { signOut } from "firebase/auth";

export function UserNav() {
  const { language } = useApp();
  const { user } = useUser();
  const auth = useAuth();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  if (!user) {
    return (
      <Button asChild variant="outline">
        <Link href="/login">
          <LogIn className="me-2" />
          {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
        </Link>
      </Button>
    )
  }

  const handleLogout = () => {
    if(auth) {
      signOut(auth);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Mobile trigger */}
        <Button variant="ghost" className="relative h-9 w-9 rounded-full md:hidden">
           <Avatar className="h-9 w-9 border">
            {userAvatar && <AvatarImage src={user.photoURL || userAvatar.imageUrl} alt="User avatar" data-ai-hint={userAvatar.imageHint}/>}
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuTrigger asChild>
         {/* Desktop trigger */}
        <Button variant="ghost" className="relative hidden h-9 w-9 rounded-full md:flex">
          <Avatar className="h-9 w-9 border">
            {userAvatar && <AvatarImage src={user.photoURL || userAvatar.imageUrl} alt="User avatar" data-ai-hint={userAvatar.imageHint}/>}
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || (language === 'ar' ? 'مستخدم جديد' : 'New User')}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon className="me-2 h-4 w-4" />
            <span>{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="me-2 h-4 w-4" />
            <span>{language === 'ar' ? 'الفواتير' : 'Billing'}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="me-2 h-4 w-4" />
            <span>{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="me-2 h-4 w-4" />
          <span>{language === 'ar' ? 'تسجيل الخروج' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
