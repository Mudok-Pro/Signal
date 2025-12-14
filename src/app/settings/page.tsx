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
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateProfile } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { uploadProfilePicture } from '@/firebase/storage';
import { Progress } from '@/components/ui/progress';

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
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!user || !auth.currentUser || !userProfileRef) return;

    setIsSaving(true);
    let uploadedPhotoURL = userProfile?.photoURL || user.photoURL;

    try {
      // 1. Upload new image if it exists
      if (newImageFile) {
        setUploadProgress(0);
        uploadedPhotoURL = await uploadProfilePicture(
          user.uid,
          newImageFile,
          (progress) => {
            setUploadProgress(progress);
          }
        );
        setPhotoURL(uploadedPhotoURL);
      }

      // 2. Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: uploadedPhotoURL,
      });

      // 3. Update Firestore document (using await here for consistency)
      const updatedProfileData: Partial<UserProfile> = {
        name,
        phoneNumber,
        photoURL: uploadedPhotoURL,
        address,
      };
      // For simplicity, we use a simple setDoc here. In a real app, you might use your non-blocking wrapper.
      await import('firebase/firestore').then(({ setDoc }) => 
        setDoc(userProfileRef, updatedProfileData, { merge: true })
      );

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
    } finally {
      setIsSaving(false);
      setUploadProgress(null);
      setNewImageFile(null);
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
            
            {uploadProgress !== null && (
              <div className="space-y-1">
                  <Label>{language === 'ar' ? 'جاري رفع الصورة...' : 'Uploading Image...'}</Label>
                  <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

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
             <Button onClick={handleSaveChanges} disabled={isLoading || isSaving}>
                {isSaving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
             </Button>
          </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
