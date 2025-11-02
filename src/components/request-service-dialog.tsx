"use client";

import { useApp } from "./app-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";

type RequestServiceDialogProps = {
    triggerButton?: React.ReactNode;
}

export function RequestServiceDialog({ triggerButton }: RequestServiceDialogProps) {
  const { language } = useApp();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [carModel, setCarModel] = useState('');
  const [issue, setIssue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!user || !firestore) {
        toast({
            variant: 'destructive',
            title: language === 'ar' ? 'خطأ' : 'Error',
            description: language === 'ar' ? 'يجب عليك تسجيل الدخول أولاً.' : 'You must be logged in to make a request.',
        });
        return;
    }
    
    if (!carModel || !issue) {
       toast({
            variant: 'destructive',
            title: language === 'ar' ? 'معلومات ناقصة' : 'Missing Information',
            description: language === 'ar' ? 'الرجاء إدخال موديل السيارة ووصف المشكلة.' : 'Please enter the car model and issue description.',
        });
        return;
    }

    const jobsCollection = collection(firestore, 'jobs');
    addDocumentNonBlocking(jobsCollection, {
        clientId: user.uid,
        clientName: user.displayName || user.email,
        carModel: carModel,
        issue: issue,
        status: 'Pending',
        createdAt: serverTimestamp(),
        // In a real app, we'd use Geolocation API
        location: null, 
    });

    toast({
        title: language === 'ar' ? 'تم إرسال الطلب' : 'Request Submitted',
        description: language === 'ar' ? 'تم إخطار الميكانيكيين القريبين وسيتم التواصل معك قريبًا.' : 'Nearby mechanics have been notified and will be in touch shortly.',
    });
    
    setCarModel('');
    setIssue('');
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton ? (
          <div onClick={() => setIsOpen(true)}>{triggerButton}</div>
        ) : (
          <Button onClick={() => setIsOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="me-2 h-4 w-4" />
            {language === 'ar' ? 'طلب خدمة جديد' : 'New Service Request'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{language === 'ar' ? 'طلب خدمة صيانة' : 'Request a Maintenance Service'}</DialogTitle>
          <DialogDescription>
            {language === 'ar' ? 'املأ التفاصيل أدناه لطلب ميكانيكي. سيتم إخطار الميكانيكيين القريبين.' : 'Fill out the details below to request a mechanic. Nearby mechanics will be notified.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="car-model">
              {language === 'ar' ? 'موديل السيارة' : 'Car Model'}
            </Label>
            <Input id="car-model" placeholder={language === 'ar' ? 'مثال: تويوتا كامري 2022' : 'e.g., Toyota Camry 2022'} value={carModel} onChange={(e) => setCarModel(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">
              {language === 'ar' ? 'الموقع' : 'Location'}
            </Label>
            <Input id="location" placeholder={language === 'ar' ? 'سيتم استخدام موقعك الحالي' : 'Your current location will be used'} disabled value={language === 'ar' ? 'الموقع الحالي' : 'Current Location'} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issue">
              {language === 'ar' ? 'وصف المشكلة' : 'Issue Description'}
            </Label>
            <Textarea id="issue" placeholder={language === 'ar' ? 'صف المشكلة بالتفصيل...' : 'Describe the issue in detail...'} rows={4} value={issue} onChange={(e) => setIssue(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>{language === 'ar' ? 'إرسال الطلب' : 'Submit Request'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
