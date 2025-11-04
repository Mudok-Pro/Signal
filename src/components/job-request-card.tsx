
"use client";

import { useApp } from "./app-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JobRequest } from "@/lib/types";
import { Car, Wrench, MapPin, User, Check, X, Clock, UserCheck, Hammer, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useState, useEffect } from "react";
import { useFirestore, useUser, updateDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


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

  const mechanicDocRef = useMemoFirebase(() =>
    firestore && request.mechanicId ? doc(firestore, 'mechanics', request.mechanicId) : null
  , [firestore, request.mechanicId]);

  const { data: mechanic } = useDoc(mechanicDocRef);

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

  const updateJobStatus = (status: JobRequest['status']) => {
    if (firestore && user) {
      const jobRef = doc(firestore, 'jobs', request.id);
      const updateData: any = { status };
      if (status === 'Accepted') {
        updateData.mechanicId = user.uid;
        updateData.mechanicName = user.displayName || 'ميكانيكي';
      }
      updateDocumentNonBlocking(jobRef, updateData);
    }
  };
  
  const statusInfo = statusMap[request.status];

  const renderMechanicActions = () => {
    if (userRole !== 'mechanic' || !user) return null;

    switch (request.status) {
      case 'Pending':
        return (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => updateJobStatus('Cancelled')}>
              <X className="me-2 h-4 w-4" />
              {language === 'ar' ? 'رفض' : 'Decline'}
            </Button>
            <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => updateJobStatus('Accepted')}>
              <Check className="me-2 h-4 w-4" />
              {language === 'ar' ? 'قبول' : 'Accept'}
            </Button>
          </CardFooter>
        );
      case 'Accepted':
        if (request.mechanicId === user.uid) {
            return (
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => updateJobStatus('In Progress')}>
                        <Hammer className="me-2 h-4 w-4" />
                        {language === 'ar' ? 'بدء العمل' : 'Start Job'}
                    </Button>
                </CardFooter>
            );
        }
        return null;
      case 'In Progress':
         if (request.mechanicId === user.uid) {
            return (
                 <CardFooter className="flex justify-end gap-2">
                    <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => updateJobStatus('Completed')}>
                        <CheckCircle className="me-2 h-4 w-4" />
                        {language === 'ar' ? 'إكمال المهمة' : 'Complete Job'}
                    </Button>
                </CardFooter>
            )
         }
         return null;
      default:
        return null;
    }
  }

  const renderClientActions = () => {
    if (userRole !== 'client' || !user || request.clientId !== user.uid) return null;

    if (request.status === 'Pending' || request.status === 'Accepted') {
        return (
            <CardFooter className="flex justify-end">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <X className="me-2 h-4 w-4" />
                            {language === 'ar' ? 'إلغاء الطلب' : 'Cancel Request'}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}</AlertDialogTitle>
                        <AlertDialogDescription>
                           {language === 'ar' ? 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى إلغاء طلب الخدمة الخاص بك بشكل دائم.' : 'This action cannot be undone. This will permanently cancel your service request.'}
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>{language === 'ar' ? 'تراجع' : 'Cancel'}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => updateJobStatus('Cancelled')}>
                           {language === 'ar' ? 'نعم، قم بالإلغاء' : 'Yes, cancel'}
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        )
    }

    return null;
  }

  return (
    <Card className="transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div>
                <CardTitle className="text-lg flex items-center gap-2 font-bold">
                    <Car className="w-5 h-5 text-primary" />
                    {request.carModel || (language === 'ar' ? 'طلب خدمة' : 'Service Request')}
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

        {/* Show Client Name to Mechanic */}
        {userRole === 'mechanic' && request.clientName && (
             <div className="flex items-start gap-3 pt-2 border-t">
                <User className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
                <div>
                    <p className="font-semibold">{language === 'ar' ? 'العميل' : 'Client'}</p>
                    <p className="text-sm text-muted-foreground">{request.clientName}</p>
                </div>
            </div>
        )}

        {/* Show Mechanic Name to Client */}
        {userRole === 'client' && (request.mechanicName || mechanic) && (
            <div className="flex items-start gap-3 pt-2 border-t">
                <UserCheck className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
                <div>
                    <p className="font-semibold">{language === 'ar' ? 'الميكانيكي' : 'Mechanic'}</p>
                    <p className="text-sm text-muted-foreground">{request.mechanicName || mechanic?.name}</p>
                </div>
            </div>
        )}

      </CardContent>
      {renderMechanicActions()}
      {renderClientActions()}
    </Card>
  );
}