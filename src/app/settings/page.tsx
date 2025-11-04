'use client';

import { useApp } from '@/components/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
    const { language } = useApp();
    return (
        <div className="container py-4 md:py-8">
            <Card>
                <CardHeader>
                    <CardTitle>{language === 'ar' ? 'الإعدادات' : 'Settings'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {language === 'ar' ? 'سيتم عرض إعدادات حسابك هنا قريبًا.' : 'Your account settings will be displayed here soon.'}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
