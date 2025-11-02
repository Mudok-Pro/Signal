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
import { CreditCard, LogOut, Settings, User } from "lucide-react";

export function UserNav() {
  const { language } = useApp();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border">
            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" data-ai-hint={userAvatar.imageHint}/>}
            <AvatarFallback>MA</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{language === 'ar' ? 'محمد عبدالله' : 'Mohammed Abdullah'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              m.abdullah@email.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="me-2 h-4 w-4" />
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
        <DropdownMenuItem>
          <LogOut className="me-2 h-4 w-4" />
          <span>{language === 'ar' ? 'تسجيل الخروج' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
