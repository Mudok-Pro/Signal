'use client';

import { useApp } from '@/components/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
    const { language } = useApp();
    return (
        <div className="container py-4 md:py-8">
            <Card>
                <CardHeader>
                    <CardTitle>{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {language === 'ar' ? 'سيتم عرض معلومات ملفك الشخصي هنا قريبًا.' : 'Your profile information will be displayed here soon.'}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
