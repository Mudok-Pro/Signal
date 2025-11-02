"use client";

import { useApp } from "@/components/app-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPlaceholder } from "@/components/map-placeholder";
import { mechanics, myRequests } from "@/lib/data";
import { MechanicCard } from "@/components/mechanic-card";
import { JobRequestCard } from "@/components/job-request-card";
import { RequestServiceDialog } from "../request-service-dialog";
import { List } from "lucide-react";

export function ClientView() {
  const { language } = useApp();

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
          <MapPlaceholder />
          <div>
            <h2 className="text-xl font-semibold mb-4">{language === 'ar' ? 'الميكانيكيون المتاحون' : 'Available Mechanics'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mechanics.filter(m => m.available).map((mechanic) => (
                <MechanicCard key={mechanic.id} mechanic={mechanic} />
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="requests">
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{language === 'ar' ? 'طلبات الصيانة الخاصة بي' : 'My Service Requests'}</h2>
            {myRequests.map(request => (
                <JobRequestCard key={request.id} request={request} userRole="client" />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
