"use client";

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/components/app-provider";
import { ClientView } from './client-view';
import { MechanicView } from './mechanic-view';
import { SeedFirestoreButton } from '../seed-firestore-button';

export function MainDashboard() {
  const { language } = useApp();
  const [role, setRole] = useState<'client' | 'mechanic'>('client');

  return (
    <div className="container py-8">
      <div className="flex justify-center mb-6">
        <Tabs defaultValue="client" onValueChange={(value) => setRole(value as 'client' | 'mechanic')} className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="client">{language === 'ar' ? 'أنا عميل' : 'I am a Client'}</TabsTrigger>
            <TabsTrigger value="mechanic">{language === 'ar' ? 'أنا ميكانيكي' : 'I am a Mechanic'}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {process.env.NODE_ENV === 'development' && <SeedFirestoreButton />}

      {role === 'client' ? <ClientView /> : <MechanicView />}
    </div>
  );
}
