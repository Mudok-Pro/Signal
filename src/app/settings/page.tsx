
'use client';

import { useApp } from '@/components/app-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser, updateDocumentNonBlocking } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateProfile } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPage() {
  const { language } = useApp();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile, isLoading: isProfileLoading } =
    useDoc<UserProfile>(userProfileRef);

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [address, setAddress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || user?.displayName || '');
      setPhoneNumber(userProfile.phoneNumber || '');
      setPhotoURL(userProfile.photoURL || user?.photoURL || '');
      setAddress(userProfile.address || '');
    }
  }, [userProfile, user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For simplicity, we'll use FileReader to create a data URL.
      // In a real app, you'd upload this to Firebase Storage and get a URL.
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!user || !auth.currentUser || !userProfileRef) return;

    try {
      // 1. Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });

      // 2. Update Firestore document (non-blocking)
      const updatedProfileData: Partial<UserProfile> = {
        name,
        phoneNumber,
        photoURL,
        address,
      };
      updateDocumentNonBlocking(userProfileRef, updatedProfileData);

      toast({
        title: language === 'ar' ? 'تم حفظ التغييرات' : 'Changes Saved',
        description:
          language === 'ar'
            ? 'تم تحديث معلومات ملفك الشخصي بنجاح.'
            : 'Your profile information has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: language === 'ar' ? 'خطأ' : 'Error',
        description:
          language === 'ar'
            ? 'حدث خطأ أثناء تحديث ملفك الشخصي.'
            : 'An error occurred while updating your profile.',
      });
    }
  };
  
  const isLoading = isUserLoading || isProfileLoading;

  return (
    <div className="container py-4 md:py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'الإعدادات' : 'Settings'}</CardTitle>
          <CardDescription>
            {language === 'ar'
              ? 'قم بإدارة إعدادات حسابك ومعلوماتك الشخصية.'
              : 'Manage your account settings and personal information.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
             <div className="space-y-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
          ) : (
          <>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative">
                <Avatar
                  className="h-24 w-24 cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={photoURL} alt="User avatar" />
                  <AvatarFallback>
                    {name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div className="space-y-1">
                <Button variant="outline" size="sm" onClick={handleAvatarClick}>
                  {language === 'ar' ? 'تغيير الصورة' : 'Change Photo'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar'
                    ? 'JPG, GIF أو PNG. 1 ميغابايت كحد أقصى.'
                    : 'JPG, GIF or PNG. 1MB max.'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                {language === 'ar' ? 'الاسم' : 'Name'}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'ar' ? 'اسمك الكامل' : 'Your full name'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={
                  language === 'ar' ? 'رقم هاتفك' : 'Your phone number'
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">
                {language === 'ar' ? 'العنوان' : 'Address'}
              </Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={language === 'ar' ? 'عنوانك...' : 'Your address...'}
                rows={3}
              />
            </div>
             <Button onClick={handleSaveChanges} disabled={isLoading}>
                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
             </Button>
          </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
