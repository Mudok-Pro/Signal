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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RequestServiceDialogProps = {
    triggerButton?: React.ReactNode;
}

export function RequestServiceDialog({ triggerButton }: RequestServiceDialogProps) {
  const { language } = useApp();
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
        title: language === 'ar' ? 'تم إرسال الطلب' : 'Request Submitted',
        description: language === 'ar' ? 'تم إخطار الميكانيكيين القريبين وسيتم التواصل معك قريبًا.' : 'Nearby mechanics have been notified and will be in touch shortly.',
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton ? triggerButton : (
          <Button>
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
            <Input id="car-model" placeholder={language === 'ar' ? 'مثال: تويوتا كامري 2022' : 'e.g., Toyota Camry 2022'} />
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
            <Textarea id="issue" placeholder={language === 'ar' ? 'صف المشكلة بالتفصيل...' : 'Describe the issue in detail...'} rows={4} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={handleSubmit}>{language === 'ar' ? 'إرسال الطلب' : 'Submit Request'}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
