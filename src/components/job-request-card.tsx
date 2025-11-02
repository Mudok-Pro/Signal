"use client";

import { useApp } from "./app-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JobRequest } from "@/lib/types";
import { Car, Wrench, MapPin, User, Check, X, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useState, useEffect } from "react";
import { useFirestore, useUser, updateDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";

type JobRequestCardProps = {
  request: JobRequest;
  userRole: 'client' | 'mechanic';
};

const statusMap: Record<JobRequest['status'], { en: string; ar: string; style: string; }> = {
  Pending: { en: "Pending", ar: "قيد الانتظار", style: "bg-[hsl(var(--status-pending))] text-primary-foreground" },
  Accepted: { en: "Accepted", ar: "مقبول", style: "bg-[hsl(var(--status-accepted))] text-primary-foreground" },
  "In Progress": { en: "In Progress", ar: "قيد التنفيذ", style: "bg-[hsl(var(--status-progress))] text-primary-foreground" },
  Completed: { en: "Completed", ar: "مكتمل", style: "bg-[hsl(var(--status-completed))] text-primary-foreground" },
  Cancelled: { en: "Cancelled", ar: "ملغى", style: "bg-destructive text-destructive-foreground" },
};

export function JobRequestCard({ request, userRole }: JobRequestCardProps) {
  const { language } = useApp();
  const [timeAgo, setTimeAgo] = useState('');
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    if (request.createdAt) {
      const date = request.createdAt.toDate();
      setTimeAgo(formatDistanceToNow(date, { addSuffix: true, locale: language === 'ar' ? ar : undefined }));
      
      const interval = setInterval(() => {
        setTimeAgo(formatDistanceToNow(date, { addSuffix: true, locale: language === 'ar' ? ar : undefined }));
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [request.createdAt, language]);

  const handleAccept = () => {
    if (firestore && user) {
      const jobRef = doc(firestore, 'jobs', request.id);
      updateDocumentNonBlocking(jobRef, { status: 'Accepted', mechanicId: user.uid });
    }
  };

  const handleDecline = () => {
    if (firestore) {
      const jobRef = doc(firestore, 'jobs', request.id);
      // In a real app, you might want to re-queue it or just mark as cancelled.
      // For now, we'll just remove the mechanic. A better approach is needed.
      updateDocumentNonBlocking(jobRef, { status: 'Cancelled' });
    }
  };
  
  const statusInfo = statusMap[request.status];

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary" />
                    {request.carModel}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-4 h-4" /> {timeAgo}
                </CardDescription>
            </div>
            <Badge className={`shrink-0 ${statusInfo.style}`}>
                {language === 'ar' ? statusInfo.ar : statusInfo.en}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Wrench className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
          <div>
            <p className="font-semibold">{language === 'ar' ? 'المشكلة' : 'Issue'}</p>
            <p className="text-sm text-muted-foreground">{request.issue}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
          <div>
            <p className="font-semibold">{language === 'ar' ? 'الموقع' : 'Location'}</p>
            {/* Location data would be more complex in a real app */}
            <p className="text-sm text-muted-foreground">{language === 'ar' ? 'موقع العميل' : 'Client Location'}</p>
          </div>
        </div>
        {userRole === 'mechanic' && request.clientName && (
             <div className="flex items-start gap-3 pt-2 border-t">
                <User className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
                <div>
                    <p className="font-semibold">{language === 'ar' ? 'العميل' : 'Client'}</p>
                    <p className="text-sm text-muted-foreground">{request.clientName}</p>
                </div>
            </div>
        )}
      </CardContent>
      {userRole === 'mechanic' && request.status === 'Pending' && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleDecline}>
            <X className="me-2 h-4 w-4" />
            {language === 'ar' ? 'رفض' : 'Decline'}
          </Button>
          <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleAccept}>
            <Check className="me-2 h-4 w-4" />
            {language === 'ar' ? 'قبول' : 'Accept'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
