"use client";

import { useApp } from "@/components/app-provider";
import { Button } from "@/components/ui/button";
import { Home, Briefcase, User, Map } from 'lucide-react';
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";

export function BottomNavbar() {
    const { language, role, setRole, clientView, setClientView } = useApp();

    const navItems = role === 'client' ? [
        { id: 'find', label: language === 'ar' ? 'بحث' : 'Find', icon: Map, view: 'find' },
        { id: 'requests', label: language === 'ar' ? 'طلباتي' : 'Requests', icon: Briefcase, view: 'requests' },
    ] : [
        { id: 'jobs', label: language === 'ar' ? 'وظائفي' : 'Jobs', icon: Briefcase, view: 'jobs' },
        { id: 'available', label: language === 'ar' ? 'متاح' : 'Available', icon: Map, view: 'available' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="grid h-16 grid-cols-4 items-center justify-center px-2">
                
                {/* Role Switcher */}
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        className={cn(
                            "flex h-auto flex-col items-center justify-center gap-1 p-0 text-muted-foreground",
                            role === 'client' && 'text-primary'
                        )}
                        onClick={() => setRole('client')}
                    >
                        <Home className="h-5 w-5" />
                        <span className="text-xs">{language === 'ar' ? 'عميل' : 'Client'}</span>
                    </Button>
                </div>
                <div className="flex justify-center">
                     <Button
                        variant="ghost"
                        className={cn(
                            "flex h-auto flex-col items-center justify-center gap-1 p-0 text-muted-foreground",
                            role === 'mechanic' && 'text-primary'
                        )}
                        onClick={() => setRole('mechanic')}
                    >
                        <User className="h-5 w-5" />
                        <span className="text-xs">{language === 'ar' ? 'ميكانيكي' : 'Mechanic'}</span>
                    </Button>
                </div>

                {/* View Switcher for Client */}
                {role === 'client' && navItems.map(item => (
                    <div key={item.id} className="flex justify-center">
                        <Button
                            variant="ghost"
                            className={cn(
                                "flex h-auto flex-col items-center justify-center gap-1 p-0 text-muted-foreground",
                                clientView === item.view && "text-primary"
                            )}
                            onClick={() => setClientView(item.view as 'find' | 'requests')}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-xs">{item.label}</span>
                        </Button>
                    </div>
                ))}
                 <div className="flex justify-center md:hidden">
                    <UserNav />
                </div>
            </div>
        </div>
    );
}
