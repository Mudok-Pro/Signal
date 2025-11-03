
"use client";

import { useState, useEffect } from 'react';
import { useApp } from "@/components/app-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { JobRequestCard } from "@/components/job-request-card";
import { Bell, BellOff } from "lucide-react";
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc, or } from "firebase/firestore";
import type { JobRequest, Mechanic } from "@/lib/types";
import { updateDocumentNonBlocking } from '@/firebase';
import { Skeleton } from '../ui/skeleton';

export function MechanicView() {
  const { language } = useApp();
  const firestore = useFirestore();
  const { user } = useUser();

  const mechanicDocRef = useMemoFirebase(() =>
    firestore && user ? doc(firestore, "mechanics", user.uid) : null
  , [firestore, user]);
  
  const { data: mechanicData } = useDoc<Mechanic>(mechanicDocRef);
  
  const [isAvailable, setIsAvailable] = useState(mechanicData?.available || false);

  useEffect(() => {
    if (mechanicData) {
      setIsAvailable(mechanicData.available);
    }
  }, [mechanicData]);

  const handleAvailabilityChange = (checked: boolean) => {
    if (mechanicDocRef) {
      setIsAvailable(checked);
      updateDocumentNonBlocking(mechanicDocRef, { available: checked });
    }
  };

  const jobRequestsQuery = useMemoFirebase(() => 
    firestore && user ? query(
      collection(firestore, "jobs"), 
      where("status", "==", "Pending")
    ) : null
  , [firestore, user]);

  const myJobsQuery = useMemoFirebase(() =>
    firestore && user ? query(
        collection(firestore, 'jobs'),
        where('mechanicId', '==', user.uid)
    ) : null,
  [firestore, user]);


  const { data: availableRequests, isLoading: isLoadingJobs } = useCollection<JobRequest>(jobRequestsQuery);
  const { data: myJobs, isLoading: isLoadingMyJobs } = useCollection<JobRequest>(myJobsQuery);

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
                onCheckedChange={handleAvailabilityChange}
                aria-label={language === 'ar' ? 'تبديل حالة التوفر' : 'Toggle availability status'}
                disabled={!mechanicData || !user}
            />
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {language === 'ar' ? 'طلباتي الحالية' : 'My Current Jobs'}
        </h2>
        {isLoadingMyJobs && user && Array.from({ length: 1 }).map((_, i) => <Skeleton key={i} className="h-48 w-full mb-4" />)}
        {myJobs && myJobs.length > 0 ? (
          <div className="space-y-4">
            {myJobs.map((request) => (
              <JobRequestCard key={request.id} request={request} userRole="mechanic" />
            ))}
          </div>
        ) : (
          (!isLoadingMyJobs || !user) && <div className="text-center py-12 border-2 border-dashed rounded-lg bg-card">
            <p className="text-muted-foreground">
              {!user 
                ? (language === 'ar' ? 'الرجاء تسجيل الدخول لعرض الطلبات.' : 'Please log in to view requests.')
                : (language === 'ar' ? 'ليس لديك أي وظائف حالية.' : 'You have no current jobs.')
              }
            </p>
          </div>
        )}
      </div>

      <div className="pt-6 border-t">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'ar' ? 'طلبات الخدمة المتاحة' : 'Available Service Requests'}
        </h2>
        {isLoadingJobs && user && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full mb-4" />)}
        {availableRequests && availableRequests.length > 0 ? (
          <div className="space-y-4">
            {availableRequests.map((request) => (
              <JobRequestCard key={request.id} request={request} userRole="mechanic" />
            ))}
          </div>
        ) : (
          (!isLoadingJobs || !user) && <div className="text-center py-12 border-2 border-dashed rounded-lg bg-card">
            <p className="text-muted-foreground">
              {!user 
                ? (language === 'ar' ? 'الرجاء تسجيل الدخول لعرض الطلبات.' : 'Please log in to view requests.')
                : (language === 'ar' ? 'لا توجد طلبات خدمة مفتوحة حاليًا.' : 'No open service requests at the moment.')
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
