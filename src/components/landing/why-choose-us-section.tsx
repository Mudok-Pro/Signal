'use client';

const reasons = [
    { title: 'سرعة الاستجابة', description: 'نصل إليك في أسرع وقت ممكن.' },
    { title: 'أسعار واضحة ومناسبة', description: 'لا توجد رسوم خفية أو مفاجآت.' },
    { title: 'فنيون محترفون ومعتمدون', description: 'فريق من الخبراء لضمان أفضل خدمة.' },
    { title: 'دعم 24/7', description: 'متواجدون لمساعدتك في أي وقت.' },
    { title: 'واجهة سهلة الاستخدام', description: 'تجربة سلسة وبسيطة لطلب الخدمة.' },
];

export function WhyChooseUsSection() {
    return (
        <section id="why-us" className="text-center bg-muted/50 rounded-xl p-8 md:p-12">
             <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center gap-3">
                <span className="text-4xl">💡</span>
                لماذا سينيال؟
            </h2>
            <ul className="space-y-4 max-w-md mx-auto text-right">
                {reasons.map((reason, index) => (
                    <li key={index} className="bg-background p-4 rounded-lg shadow-sm">
                        <h3 className="font-bold text-primary">{reason.title}</h3>
                        <p className="text-muted-foreground text-sm">{reason.description}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
