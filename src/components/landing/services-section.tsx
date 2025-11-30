'use client';

import { useApp } from '../app-provider';
import { LandingCard } from './landing-card';

const services = [
    { icon: '🔋', name: 'تشغيل البطارية', name_en: 'Battery Jump-start' },
    { icon: '🛞', name: 'تبديل الإطارات', name_en: 'Tire Change' },
    { icon: '🔧', name: 'إصلاح الأعطال الميكانيكية الخفيفة', name_en: 'Minor Mechanical Repairs' },
    { icon: '🖥️', name: 'دعم تقني للسيارات الذكية والإلكترونية', name_en: 'Tech Support for Smart Cars' },
    { icon: '🚚', name: 'سحب المركبات عند الحاجة', name_en: 'Towing Service' },
    { icon: '🛠️', name: 'فحص سريع للأعطال', name_en: 'Quick Fault Diagnosis' },
];

export function ServicesSection() {
    const { language } = useApp();

    return (
        <section id="services" className="text-center">
             <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center gap-3">
                <span className="text-4xl">⚙️</span>
                {language === 'ar' ? 'خدماتنا' : 'Our Services'}
            </h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
                 {language === 'ar' 
                    ? 'نقدم مجموعة واسعة من الخدمات الفورية على الطريق لمساعدتك في أي وقت وفي أي مكان.'
                    : 'We offer a wide range of on-road services to help you anytime, anywhere.'
                 }
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {services.map((service, index) => (
                    <LandingCard 
                        key={index}
                        className="p-4"
                        contentClassName="p-0"
                    >
                        <div className="text-4xl mb-3">{service.icon}</div>
                        <h3 className="font-bold text-md">{language === 'ar' ? service.name : service.name_en}</h3>
                    </LandingCard>
                ))}
            </div>
        </section>
    );
}
