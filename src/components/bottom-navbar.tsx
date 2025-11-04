
"use client";

import { useApp } from "@/components/app-provider";
import { Button } from "@/components/ui/button";
import { Briefcase, Map, GanttChartSquare, ShieldCheck } from 'lucide-react';
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { usePathname } from "next/navigation";
import Link from "next/link";


export function BottomNavbar() {
    const { language } = useApp();
    const pathname = usePathname();

    const getNavItems = () => {
        if (pathname.startsWith('/mechanic')) {
            return [
                { id: 'jobs', label: language === 'ar' ? 'وظائفي' : 'Jobs', icon: Briefcase, href: '/mechanic' },
                { id: 'available', label: language === 'ar' ? 'متاح' : 'Available', icon: Map, href: '/mechanic' },
            ];
        }
         if (pathname.startsWith('/admin')) {
             return [
                { id: 'dashboard', label: language === 'ar' ? 'المستخدمون' : 'Users', icon: GanttChartSquare, href: '/admin' },
                { id: 'review', label: language === 'ar' ? 'مراجعة' : 'Review', icon: ShieldCheck, href: '/admin/review' },
             ]
         }
        // Default to client
        return [
            { id: 'find', label: language === 'ar' ? 'بحث' : 'Find', icon: Map, href: '/client' },
            { id: 'requests', label: language === 'ar' ? 'طلباتي' : 'My Requests', icon: Briefcase, href: '/client?view=requests' },
        ];
    }
    
    const navItems = getNavItems();
    
    // Don't show nav on login page
    if (pathname === '/login') return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="grid h-16 grid-cols-3 items-center justify-center px-2">
                
                {navItems.map(item => (
                    <div key={item.id} className="flex justify-center">
                        <Button
                            asChild
                            variant="ghost"
                            className={cn(
                                "flex h-auto flex-col items-center justify-center gap-1 p-0 text-muted-foreground",
                                // Basic active check, can be improved
                                pathname === item.href && "text-primary"
                            )}
                        >
                            <Link href={item.href}>
                                <item.icon className="h-5 w-5" />
                                <span className="text-xs">{item.label}</span>
                            </Link>
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

