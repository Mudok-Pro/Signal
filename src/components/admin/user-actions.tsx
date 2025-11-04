'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, UserCog } from 'lucide-react';
import { useApp } from '../app-provider';
import type { UserProfile } from '@/lib/types';
import { useState } from 'react';
import { EditRoleDialog } from './edit-role-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useFirestore, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type UserActionsProps = {
  user: UserProfile;
};

export function UserActions({ user }: UserActionsProps) {
  const { language } = useApp();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteUser = () => {
    if (!firestore) return;
    const userDocRef = doc(firestore, 'users', user.id);
    deleteDocumentNonBlocking(userDocRef);
    // Note: This only deletes the Firestore user document.
    // Deleting the Firebase Auth user requires admin SDK functions on a backend.
    toast({
      title: language === 'ar' ? 'تم حذف المستخدم' : 'User Deleted',
      description: `${user.email} ${language === 'ar' ? 'تم حذفه من قاعدة البيانات.' : 'has been deleted from the database.'}`,
    });
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{language === 'ar' ? 'الإجراءات' : 'Actions'}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsEditRoleOpen(true)}>
              <UserCog className="mr-2 h-4 w-4" />
              <span>{language === 'ar' ? 'تغيير الدور' : 'Change Role'}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>{language === 'ar' ? 'حذف المستخدم' : 'Delete User'}</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === 'ar' ? `هل أنت متأكد من حذف ${user.email}?` : `Are you sure you want to delete ${user.email}?`}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ar' ? 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف بيانات المستخدم نهائيًا من قاعدة البيانات. لن يتم حذف حساب المصادقة الخاص به.' : 'This action cannot be undone. This will permanently delete the user\'s data from the database. Their authentication account will not be deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'ar' ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {language === 'ar' ? 'نعم، قم بالحذف' : 'Yes, delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditRoleDialog
        isOpen={isEditRoleOpen}
        setIsOpen={setIsEditRoleOpen}
        user={user}
      />
    </>
  );
}
