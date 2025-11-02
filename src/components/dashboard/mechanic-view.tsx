"use client";

import { useState } from 'react';
import { useApp } from "@/components/app-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { jobRequests } from "@/lib/data";
import { JobRequestCard } from "@/components/job-request-card";
import { Bell, BellOff } from "lucide-react";

export function MechanicView() {
  const { language } = useApp();
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'ar' ? 'لوحة تحكم الميكانيكي' : 'Mechanic Dashboard'}
        </h1>
        <div className="flex items-center gap-2 shrink-0">
            {isAvailable ? <Bell className="text-green-500 animate-pulse" /> : <BellOff className="text-destructive" />}
            <Label htmlFor="availability-toggle" className="font-medium">
                {isAvailable ? (language === 'ar' ? 'متاح للطلبات' : 'Available') : (language === 'ar' ? 'غير متاح' : 'Unavailable')}
            </Label>
            <Switch
                id="availability-toggle"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
                aria-label={language === 'ar' ? 'تبديل حالة التوفر' : 'Toggle availability status'}
            />
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {language === 'ar' ? 'طلبات الخدمة المفتوحة' : 'Open Service Requests'}
        </h2>
        {jobRequests.length > 0 ? (
          <div className="space-y-4">
            {jobRequests.map((request) => (
              <JobRequestCard key={request.id} request={request} userRole="mechanic" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg bg-card">
            <p className="text-muted-foreground">{language === 'ar' ? 'لا توجد طلبات خدمة مفتوحة حاليًا.' : 'No open service requests at the moment.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
