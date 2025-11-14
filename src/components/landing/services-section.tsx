'use client';

import { LandingCard } from './landing-card';

const services = [
    { icon: '🔋', name: 'تشغيل البطارية' },
    { icon: '🛞', name: 'تبديل الإطارات' },
    { icon: '🔧', name: 'إصلاح الأعطال الميكانيكية الخفيفة' },
    { icon: '🖥️', name: 'دعم تقني للسيارات الذكية والإلكترونية' },
    { icon: '🚚', name: 'سحب المركبات عند الحاجة' },
    { icon: '🛠️', name: 'فحص سريع للأعطال' },
];

export function ServicesSection() {
    return (
        <section id="services" className="text-center">
             <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center gap-3">
                <span className="text-4xl">⚙️</span>
                خدماتنا
            </h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
                 نقدم مجموعة واسعة من الخدمات الفورية على الطريق لمساعدتك في أي وقت وفي أي مكان.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {services.map((service, index) => (
                    <LandingCard 
                        key={index}
                        className="p-4"
                        contentClassName="p-0"
                    >
                        <div className="text-4xl mb-3">{service.icon}</div>
                        <h3 className="font-bold text-md">{service.name}</h3>
                    </LandingCard>
                ))}
            </div>
        </section>
    );
}
