
"use client";

import { useState, useEffect } from 'react';
import { useApp } from "@/components/app-provider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { JobRequestCard } from "@/components/job-request-card";
import { Bell, BellOff, LogIn, Clock, ShieldCheck, ShieldX } from "lucide-react";
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc, GeoPoint } from "firebase/firestore";
import type { JobRequest, Mechanic } from "@/lib/types";
import { updateDocumentNonBlocking } from '@/firebase';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { services } from '@/lib/services';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function MechanicRegistration({ user }: { user: any }) {
    const { language } = useApp();
    const [name, setName] = useState(user.displayName || '');
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
    const [professionId, setProfessionId] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleServiceChange = (serviceId: string) => {
        setSelectedServices(prev => 
            prev.includes(serviceId) 
                ? prev.filter(id => id !== serviceId) 
                : [...prev, serviceId]
        );
    };

    const handleRegistration = () => {
        if (!firestore || !user || !name || !professionId || !yearsOfExperience) {
            toast({
                variant: 'destructive',
                title: language === 'ar' ? 'معلومات ناقصة' : 'Missing Information',
                description: language === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة.' : 'Please fill out all required fields.',
            });
            return;
        }

        const mechanicDocRef = doc(firestore, "mechanics", user.uid);
        const avatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

        const newMechanic: Omit<Mechanic, 'id'> = {
            name,
            email: user.email,
            available: false,
            rating: 0,
            reviews: 0,
            distance: 0,
            avatarUrl: user.photoURL || avatar?.imageUrl || '',
            avatarHint: avatar?.imageHint || '',
            location: new GeoPoint(24.7136, 46.6753), // Default location, should be updated
            services: selectedServices,
            professionId,
            yearsOfExperience: parseInt(yearsOfExperience, 10),
            status: 'Pending',
        };

        setDocumentNonBlocking(mechanicDocRef, newMechanic, { merge: true });
        
        toast({
            title: language === 'ar' ? 'تم إرسال الطلب' : 'Registration Submitted',
            description: language === 'ar' ? 'تم إرسال ملفك الشخصي للمراجعة. سيتم إعلامك عند الموافقة عليه.' : 'Your profile has been submitted for review. You will be notified upon approval.',
        });
    };

    return (
        <div className="flex justify-center items-center py-10">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>{language === 'ar' ? 'كن ميكانيكيًا معتمدًا' : 'Become a Certified Mechanic'}</CardTitle>
                    <CardDescription>{language === 'ar' ? 'أكمل ملفك الشخصي لبدء تلقي طلبات الخدمة. ستتم مراجعة ملفك من قبل المسؤول.' : 'Complete your profile to start receiving service requests. Your profile will be reviewed by an admin.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={language === 'ar' ? 'أدخل اسمك' : 'Enter your name'} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                            <Input id="email" value={user.email || ''} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Label>
                            <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={language === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="professionId">{language === 'ar' ? 'رقم بطاقة الحرفي' : 'Profession ID'}</Label>
                            <Input id="professionId" value={professionId} onChange={(e) => setProfessionId(e.target.value)} placeholder="بطاقة حرفي" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="experience">{language === 'ar' ? 'سنوات الخبرة' : 'Years of Experience'}</Label>
                            <Input id="experience" type="number" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} placeholder="e.g., 5" />
                        </div>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                        <Label>{language === 'ar' ? 'خدماتي' : 'My Services'}</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                            {services.map(service => (
                                <div key={service.id} className="flex items-center space-x-2 space-x-reverse">
                                    <Checkbox
                                        id={`service-${service.id}`}
                                        checked={selectedServices.includes(service.id)}
                                        onCheckedChange={() => handleServiceChange(service.id)}
                                    />
                                    <Label htmlFor={`service-${service.id}`} className="cursor-pointer text-sm font-normal">
                                        {language === 'ar' ? service.name : service.name_en}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleRegistration}>{language === 'ar' ? 'إرسال للمراجعة' : 'Submit for Review'}</Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export function MechanicView() {
  const { language } = useApp();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const mechanicDocRef = useMemoFirebase(() =>
    firestore && user ? doc(firestore, "mechanics", user.uid) : null
  , [firestore, user]);
  
  const { data: mechanicData, isLoading: isLoadingMechanic } = useDoc<Mechanic>(mechanicDocRef);
  
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
    firestore && user && mechanicData?.status === 'Approved' ? query(
      collection(firestore, "jobs"), 
      where("status", "==", "Pending")
    ) : null
  , [firestore, user, mechanicData]);

  const myJobsQuery = useMemoFirebase(() =>
    firestore && user && mechanicData?.status === 'Approved' ? query(
        collection(firestore, 'jobs'),
        where('mechanicId', '==', user.uid)
    ) : null,
  [firestore, user, mechanicData]);


  const { data: availableRequests, isLoading: isLoadingJobs } = useCollection<JobRequest>(jobRequestsQuery);
  const { data: myJobs, isLoading: isLoadingMyJobs } = useCollection<JobRequest>(myJobsQuery);

  if (isUserLoading || (user && isLoadingMechanic)) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    )
  }

  if (!user) {
    return (
        <div className="text-center py-12 border-2 border-dashed rounded-lg flex flex-col items-center gap-4">
            <p className="text-muted-foreground">{language === 'ar' ? 'الرجاء تسجيل الدخول لعرض هذه الصفحة.' : 'Please log in to view this page.'}</p>
            <Button asChild>
                <Link href="/login">
                  <LogIn className="me-2" />
                  {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Link>
            </Button>
        </div>
    )
  }

  if (!mechanicData) {
    return <MechanicRegistration user={user} />;
  }

  if (mechanicData.status === 'Pending') {
    return (
        <div className="container py-12 flex justify-center">
            <Alert className="max-w-lg bg-card">
                <Clock className="h-4 w-4" />
                <AlertTitle>{language === 'ar' ? 'الحساب قيد المراجعة' : 'Account Under Review'}</AlertTitle>
                <AlertDescription>
                    {language === 'ar' ? 'لقد تم استلام طلبك وهو قيد المراجعة من قبل فريقنا. سنقوم بإعلامك بمجرد الموافقة على حسابك.' : 'Your application has been received and is currently being reviewed by our team. We will notify you once your account is approved.'}
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  if (mechanicData.status === 'Rejected') {
    return (
        <div className="container py-12 flex justify-center">
            <Alert variant="destructive" className="max-w-lg">
                <ShieldX className="h-4 w-4" />
                <AlertTitle>{language === 'ar' ? 'تم رفض الطلب' : 'Application Rejected'}</AlertTitle>
                <AlertDescription>
                    {language === 'ar' ? 'للأسف، لم نتمكن من الموافقة على طلبك في هذا الوقت. يرجى الاتصال بالدعم لمزيد من المعلومات.' : 'Unfortunately, we were unable to approve your application at this time. Please contact support for more information.'}
                </AlertDescription>
            </Alert>
        </div>
    )
  }

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
          (!isLoadingMyJobs || !user) && <div className="text-center py-12 border-2 border-dashed rounded-lg">
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
          (!isLoadingJobs || !user) && <div className="text-center py-12 border-2 border-dashed rounded-lg">
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

