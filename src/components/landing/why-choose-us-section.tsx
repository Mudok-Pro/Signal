'use client';

import { useApp } from "../app-provider";

const reasons = [
    { title: 'سرعة الاستجابة', title_en: 'Fast Response', description: 'نصل إليك في أسرع وقت ممكن.', description_en: 'We reach you as quickly as possible.' },
    { title: 'أسعار واضحة ومناسبة', title_en: 'Clear & Fair Prices', description: 'لا توجد رسوم خفية أو مفاجآت.', description_en: 'No hidden fees or surprises.' },
    { title: 'فنيون محترفون ومعتمدون', title_en: 'Professional Technicians', description: 'فريق من الخبراء لضمان أفضل خدمة.', description_en: 'A team of experts to ensure the best service.' },
    { title: 'دعم 24/7', title_en: '24/7 Support', description: 'متواجدون لمساعدتك في أي وقت.', description_en: 'Available to help you at any time.' },
    { title: 'واجهة سهلة الاستخدام', title_en: 'Easy-to-use Interface', description: 'تجربة سلسة وبسيطة لطلب الخدمة.', description_en: 'A smooth and simple experience to request service.' },
];

export function WhyChooseUsSection() {
    const { language, direction } = useApp();
    return (
        <section id="why-us" className="text-center bg-muted/50 rounded-xl p-8 md:p-12">
             <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center gap-3">
                <span className="text-4xl">💡</span>
                {language === 'ar' ? 'لماذا سينيال؟' : 'Why Signal?'}
            </h2>
            <ul className={cn("space-y-4 max-w-md mx-auto", direction === 'rtl' ? 'text-right' : 'text-left')}>
                {reasons.map((reason, index) => (
                    <li key={index} className="bg-background p-4 rounded-lg shadow-sm">
                        <h3 className="font-bold text-primary">{language === 'ar' ? reason.title : reason.title_en}</h3>
                        <p className="text-muted-foreground text-sm">{language === 'ar' ? reason.description : reason.description_en}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
