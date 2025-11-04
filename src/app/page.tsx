'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) {
      return; // Wait for user and profile to load
    }

    if (!user) {
      router.push('/login');
      return;
    }

    if (userProfile) {
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
    } else {
        // If profile doesn't exist, default to client.
        // The signup logic should handle profile creation.
        router.push('/client');
    }

  }, [user, userProfile, isUserLoading, isProfileLoading, router]);

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
