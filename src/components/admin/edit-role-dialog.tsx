'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '../app-provider';
import type { UserProfile } from '@/lib/types';
import { useState } from 'react';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type EditRoleDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: UserProfile;
};

export function EditRoleDialog({ isOpen, setIsOpen, user }: EditRoleDialogProps) {
  const { language } = useApp();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState(user.role);

  const handleSaveChanges = () => {
    if (!firestore) return;

    const userDocRef = doc(firestore, 'users', user.id);
    updateDocumentNonBlocking(userDocRef, { role: selectedRole });

    toast({
      title: language === 'ar' ? 'تم تحديث الدور' : 'Role Updated',
      description: `${user.email}'s ${language === 'ar' ? 'تم تحديث دوره إلى' : 'role has been updated to'} ${selectedRole}.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{language === 'ar' ? 'تغيير دور المستخدم' : 'Change User Role'}</DialogTitle>
          <DialogDescription>
            {language === 'ar' ? `تغيير دور ${user.email}.` : `Change the role for ${user.email}.`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="role-select">{language === 'ar' ? 'الدور' : 'Role'}</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserProfile['role'])}>
              <SelectTrigger id="role-select">
                <SelectValue placeholder={language === 'ar' ? 'اختر دورًا' : 'Select a role'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">{language === 'ar' ? 'عميل' : 'Client'}</SelectItem>
                <SelectItem value="mechanic">{language === 'ar' ? 'ميكانيكي' : 'Mechanic'}</SelectItem>
                <SelectItem value="admin">{language === 'ar' ? 'مسؤول' : 'Admin'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleSaveChanges}>{language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
