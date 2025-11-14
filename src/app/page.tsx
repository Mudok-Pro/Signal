'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { HeroSection } from '@/components/landing/hero-section';
import { ServicesSection } from '@/components/landing/services-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { WhyChooseUsSection } from '@/components/landing/why-choose-us-section';
import { MissionSection } from '@/components/landing/mission-section';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
  
  const isLoading = isUserLoading || isProfileLoading;

  useEffect(() => {
    if (isLoading) {
      return; // Wait for user and profile to load
    }

    if (user && userProfile) {
      switch (userProfile.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'mechanic':
          router.push('/mechanic');
          break;
        case 'client':
        default:
          router.push('/client');
          break;
      }
    } else if (user && !userProfile) {
        // If user is logged in but profile is still loading or doesn't exist,
        // we might want to wait or push to a generic logged-in page.
        // For now, we wait for the loading to finish.
        // If it still doesn't exist, it might imply a profile creation is pending.
        // Let's assume login/signup handles profile creation, so we just wait.
    }

  }, [user, userProfile, isLoading, router]);

  // If we are loading auth/profile info, show a skeleton screen.
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
          <div className="space-y-4 w-full max-w-md p-8">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-24 w-full" />
          </div>
      </div>
    );
  }

  // If user is not authenticated, show the landing page.
  if (!user) {
    return (
        <div className="flex flex-col items-center">
            <div className="container px-4 md:px-6 space-y-12 md:space-y-20 py-12 md:py-24">
                <HeroSection />
                <ServicesSection />
                <HowItWorksSection />
                <WhyChooseUsSection />
                <MissionSection />
            </div>
        </div>
    );
  }

  // Fallback for authenticated user while redirect is processing
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-8">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    </div>
  );
}
