'use client';

import { useApp } from '@/components/app-provider';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { UserProfile, Mechanic } from '@/lib/types';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Users, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserActions } from '@/components/admin/user-actions';

export default function AdminPage() {
    const { language } = useApp();
    const firestore = useFirestore();
    
    const usersCollection = useMemoFirebase(
        () => (firestore ? collection(firestore, 'users') : null),
        [firestore]
    );
    const pendingMechanicsQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'mechanics'), where('status', '==', 'Pending')) : null),
        [firestore]
    );

    const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersCollection);
    const { data: pendingMechanics, isLoading: isLoadingMechanics } = useCollection<Mechanic>(pendingMechanicsQuery);

    const roleStyles: { [key: string]: string } = {
        admin: 'bg-red-500 text-white',
        mechanic: 'bg-blue-500 text-white',
        client: 'bg-gray-500 text-white',
    }

    const isLoading = isLoadingUsers || isLoadingMechanics;

    return (
        <div className="container py-4 md:py-8">
            <h1 className="text-2xl font-bold tracking-tight mb-6">
                {language === 'ar' ? 'لوحة تحكم المسؤول' : 'Admin Dashboard'}
            </h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{users?.length || 0}</div>}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{language === 'ar' ? 'طلبات معلقة' : 'Pending Approvals'}</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         {isLoading ? <Skeleton className="h-8 w-16 mb-2" /> : <div className="text-2xl font-bold">{pendingMechanics?.length || 0}</div>}
                         {pendingMechanics && pendingMechanics.length > 0 && (
                            <Button size="sm" variant="outline" asChild className="text-xs">
                                <Link href="/admin/review">
                                    {language === 'ar' ? 'مراجعة الطلبات' : 'Review Requests'}
                                </Link>
                            </Button>
                         )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}</CardTitle>
                    <CardDescription>{language === 'ar' ? 'عرض وتعديل أدوار المستخدمين وحالة حساباتهم.' : 'View and edit user roles and account status.'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                                <TableHead>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</TableHead>
                                <TableHead>{language === 'ar' ? 'الدور' : 'Role'}</TableHead>
                                <TableHead className="text-right">{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingUsers && Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                                </TableRow>
                            ))}
                            {users?.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name || '-'}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge className={cn('capitalize', roleStyles[user.role] || 'bg-gray-200')}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <UserActions user={user} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
