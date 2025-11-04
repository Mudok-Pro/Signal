'use client';

import { useApp } from '@/components/app-provider';
import { useCollection, useFirestore } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
    const { language } = useApp();
    const firestore = useFirestore();
    const usersCollection = collection(firestore, 'users');
    const { data: users, isLoading } = useCollection<UserProfile>(usersCollection);

    const roleStyles: { [key: string]: string } = {
        admin: 'bg-red-500 text-white',
        mechanic: 'bg-blue-500 text-white',
        client: 'bg-gray-500 text-white',
    }

    return (
        <div className="container py-4 md:py-8">
            <h1 className="text-2xl font-bold tracking-tight mb-6">
                {language === 'ar' ? 'لوحة تحكم المسؤول' : 'Admin Dashboard'}
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>{language === 'ar' ? 'المستخدمون' : 'Users'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                                <TableHead>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</TableHead>
                                <TableHead>{language === 'ar' ? 'الدور' : 'Role'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
