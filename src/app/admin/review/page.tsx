
'use client';

import { useApp } from '@/components/app-provider';
import { useCollection, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import type { Mechanic } from '@/lib/types';
import { collection, query, where, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, X, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminReviewPage() {
    const { language } = useApp();
    const firestore = useFirestore();
    const { toast } = useToast();

    const pendingMechanicsQuery = query(
        collection(firestore, 'mechanics'),
        where('status', '==', 'Pending')
    );
    const { data: mechanics, isLoading, error } = useCollection<Mechanic>(pendingMechanicsQuery);

    const handleApproval = (mechanicId: string, newStatus: 'Approved' | 'Rejected') => {
        const mechanicRef = doc(firestore, 'mechanics', mechanicId);
        updateDocumentNonBlocking(mechanicRef, { status: newStatus });
        toast({
            title: language === 'ar' ? 'تم تحديث الحالة' : 'Status Updated',
            description: language === 'ar' 
                ? `تم ${newStatus === 'Approved' ? 'الموافقة على' : 'رفض'} الميكانيكي.`
                : `The mechanic has been ${newStatus.toLowerCase()}.`
        });
    };

    return (
        <div className="container py-4 md:py-8">
            <h1 className="text-2xl font-bold tracking-tight mb-6">
                {language === 'ar' ? 'مراجعة طلبات الميكانيكيين' : 'Review Mechanic Applications'}
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>{language === 'ar' ? 'الطلبات المعلقة' : 'Pending Requests'}</CardTitle>
                    <CardDescription>{language === 'ar' ? 'مراجعة والموافقة على الميكانيكيين الجدد.' : 'Review and approve new mechanics.'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                                <TableHead>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</TableHead>
                                <TableHead>{language === 'ar' ? 'رقم الحرفي' : 'Profession ID'}</TableHead>
                                <TableHead>{language === 'ar' ? 'الخبرة' : 'Experience'}</TableHead>
                                <TableHead>{language === 'ar' ? 'المستندات' : 'Documents'}</TableHead>
                                <TableHead className="text-center">{language === 'ar' ? 'الإجراء' : 'Action'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                                    <TableCell className="flex justify-center gap-2"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && mechanics?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        {language === 'ar' ? 'لا توجد طلبات معلقة حاليًا.' : 'No pending requests at the moment.'}
                                    </TableCell>
                                </TableRow>
                            )}
                            {mechanics?.map(mechanic => (
                                <TableRow key={mechanic.id}>
                                    <TableCell>{mechanic.name}</TableCell>
                                    <TableCell>{mechanic.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{mechanic.professionId}</Badge>
                                    </TableCell>
                                     <TableCell>{language === 'ar' ? `${mechanic.yearsOfExperience} سنوات` : `${mechanic.yearsOfExperience} years`}</TableCell>
                                    <TableCell>
                                       <div className="flex gap-2">
                                            {mechanic.idCardUrl && (
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={mechanic.idCardUrl} target="_blank">
                                                        <Download className="h-4 w-4 me-1.5" />
                                                        {language === 'ar' ? 'الهوية' : 'ID'}
                                                    </Link>
                                                </Button>
                                            )}
                                            {mechanic.workIdUrl && (
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={mechanic.workIdUrl} target="_blank">
                                                        <Download className="h-4 w-4 me-1.5" />
                                                        {language === 'ar' ? 'العمل' : 'Work'}
                                                    </Link>
                                                </Button>
                                            )}
                                       </div>
                                    </TableCell>
                                    <TableCell className="flex justify-center gap-2">
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleApproval(mechanic.id, 'Rejected')}>
                                            <X className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600" onClick={() => handleApproval(mechanic.id, 'Approved')}>
                                            <Check className="h-5 w-5" />
                                        </Button>
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
