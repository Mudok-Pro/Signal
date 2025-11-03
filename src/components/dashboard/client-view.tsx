"use client";

import { useApp } from "@/components/app-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapComponent } from "@/components/map";
import { MechanicCard } from "@/components/mechanic-card";
import { JobRequestCard } from "@/components/job-request-card";
import { RequestServiceDialog } from "../request-service-dialog";
import { List } from "lucide-react";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Mechanic, JobRequest } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";

export function ClientView() {
  const { language } = useApp();
  const firestore = useFirestore();
  const { user } = useUser();

  const mechanicsQuery = useMemoFirebase(() => 
    firestore && user ? query(collection(firestore, "mechanics"), where("available", "==", true)) : null
  , [firestore, user]);

  const myRequestsQuery = useMemoFirebase(() => 
    firestore && user ? query(collection(firestore, "jobs"), where("clientId", "==", user.uid)) : null
  , [firestore, user]);

  const { data: mechanics, isLoading: isLoadingMechanics } = useCollection<Mechanic>(mechanicsQuery);
  const { data: myRequests, isLoading: isLoadingRequests } = useCollection<JobRequest>(myRequestsQuery);

  if (!user) {
    return (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-card flex flex-col items-center gap-4">
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

  return (
    <Tabs defaultValue="find" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'ar' ? 'لوحة تحكم العميل' : 'Client Dashboard'}
        </h1>
        <div className="flex items-center gap-2">
          <TabsList>
            <TabsTrigger value="find" className="gap-1">
              <List className="h-4 w-4"/>
              {language === 'ar' ? 'بحث' : 'Find'}
            </TabsTrigger>
            <TabsTrigger value="requests">
              {language === 'ar' ? 'طلباتي' : 'My Requests'}
            </TabsTrigger>
          </TabsList>
          <RequestServiceDialog />
        </div>
      </div>
      
      <TabsContent value="find">
        <div className="space-y-6">
          <MapComponent mechanics={mechanics || []} />
          <div>
            <h2 className="text-xl font-semibold mb-4">{language === 'ar' ? 'الميكانيكيون المتاحون' : 'Available Mechanics'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoadingMechanics && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
              {mechanics?.map((mechanic) => (
                <MechanicCard key={mechanic.id} mechanic={mechanic} />
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="requests">
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{language === 'ar' ? 'طلبات الصيانة الخاصة بي' : 'My Service Requests'}</h2>
            {isLoadingRequests && Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            {myRequests?.map(request => (
                <JobRequestCard key={request.id} request={request} userRole="client" />
            ))}
             {myRequests?.length === 0 && !isLoadingRequests && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg bg-card">
                  <p className="text-muted-foreground">{language === 'ar' ? 'لم تقم بإنشاء أي طلبات بعد.' : 'You have not created any requests yet.'}</p>
              </div>
            )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
