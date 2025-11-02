"use client";

import { useApp } from "./app-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JobRequest } from "@/lib/data";
import { Car, Wrench, MapPin, User, Check, X, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useState, useEffect } from "react";

type JobRequestCardProps = {
  request: JobRequest;
  userRole: 'client' | 'mechanic';
};

const statusStyles: Record<JobRequest['status'], string> = {
    Pending: "bg-[hsl(var(--status-pending))] text-primary-foreground",
    Accepted: "bg-[hsl(var(--status-accepted))] text-primary-foreground",
    "In Progress": "bg-[hsl(var(--status-progress))] text-primary-foreground",
    Completed: "bg-[hsl(var(--status-completed))] text-primary-foreground",
    Cancelled: "bg-destructive text-destructive-foreground",
};

export function JobRequestCard({ request, userRole }: JobRequestCardProps) {
  const { language } = useApp();
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    setTimeAgo(formatDistanceToNow(new Date(request.createdAt), { addSuffix: true, locale: language === 'ar' ? ar : undefined }));
    
    // Update time every minute
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNow(new Date(request.createdAt), { addSuffix: true, locale: language === 'ar' ? ar : undefined }));
    }, 60000);

    return () => clearInterval(interval);
  }, [request.createdAt, language]);


  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary" />
                    {language === 'ar' ? request.carModel : request.carModel_en}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-4 h-4" /> {timeAgo}
                </CardDescription>
            </div>
            <Badge className={`shrink-0 ${statusStyles[request.status]}`}>
                {language === 'ar' ? request.status_ar : request.status}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Wrench className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
          <div>
            <p className="font-semibold">{language === 'ar' ? 'المشكلة' : 'Issue'}</p>
            <p className="text-sm text-muted-foreground">{language === 'ar' ? request.issue : request.issue_en}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
          <div>
            <p className="font-semibold">{language === 'ar' ? 'الموقع' : 'Location'}</p>
            <p className="text-sm text-muted-foreground">{language === 'ar' ? request.location : request.location_en}</p>
          </div>
        </div>
        {userRole === 'mechanic' && (
             <div className="flex items-start gap-3 pt-2 border-t">
                <User className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
                <div>
                    <p className="font-semibold">{language === 'ar' ? 'العميل' : 'Client'}</p>
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? request.clientName : request.clientName_en}</p>
                </div>
            </div>
        )}
      </CardContent>
      {userRole === 'mechanic' && request.status === 'Pending' && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="secondary">
            <X className="me-2 h-4 w-4" />
            {language === 'ar' ? 'رفض' : 'Decline'}
          </Button>
          <Button variant="default">
            <Check className="me-2 h-4 w-4" />
            {language === 'ar' ? 'قبول' : 'Accept'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
