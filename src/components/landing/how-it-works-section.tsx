'use client';

import { LandingCard } from "./landing-card";
import { cn } from '@/lib/utils';
import { useApp } from "../app-provider";

const steps = [
    { number: '1', description: 'افتح التطبيق وحدد نوع العطل.', description_en: 'Open the app and specify the issue.', icon: '📱' },
    { number: '2', description: 'يحدد سينيال موقعك بدقة عبر GPS.', description_en: 'Signal pinpoints your location via GPS.', icon: '🛰️' },
    { number: '3', description: 'يربطك بأقرب فني متاح.', description_en: 'Connects you with the nearest available technician.', icon: '🤝' },
    { number: '4', description: 'يتوجه إليك المختص ويقدم لك المساعدة فورًا.', description_en: 'The specialist comes to you and provides immediate assistance.', icon: '🚗' },
];

export function HowItWorksSection() {
    const { language, direction } = useApp();

    return (
        <section id="how-it-works" className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center justify-center gap-3">
                <span className="text-4xl">📍</span>
                {language === 'ar' ? 'كيف يعمل التطبيق؟' : 'How It Works'}
            </h2>
            <div className="relative max-w-2xl mx-auto">
                <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-border -z-10"></div>
                {steps.map((step, index) => (
                    <div key={index} className={cn(
                        "flex items-center w-full mb-8",
                        // For LTR, even indices are on the left, odd on the right.
                        // For RTL, even indices are on the right, odd on the left.
                        (direction === 'ltr' ? (index % 2 !== 0) : (index % 2 === 0)) ? "flex-row-reverse" : "flex-row"
                    )}>
                        <div className="w-1/2 flex" style={{ justifyContent: (direction === 'ltr' ? (index % 2 !== 0) : (index % 2 === 0)) ? 'flex-start' : 'flex-end' }}>
                           <LandingCard className="w-11/12 p-4">
                             <p className="font-semibold">{language === 'ar' ? step.description : step.description_en}</p>
                           </LandingCard>
                        </div>
                        <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold z-10 shrink-0 mx-4">
                           {step.number}
                        </div>
                         <div className="w-1/2">
                            {/* This is an empty div for spacing */}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
