'use client';

import { useApp } from '@/components/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BillingPage() {
    const { language } = useApp();
    return (
        <div className="container py-4 md:py-8">
            <Card>
                <CardHeader>
                    <CardTitle>{language === 'ar' ? 'الفواتير' : 'Billing'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {language === 'ar' ? 'سيتم عرض معلومات الفواتير الخاصة بك هنا قريبًا.' : 'Your billing information will be displayed here soon.'}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
