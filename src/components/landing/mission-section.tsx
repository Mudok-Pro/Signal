'use client';

import { LandingCard } from "./landing-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../app-provider";

export function MissionSection() {
    const { language } = useApp();
    return (
        <section id="mission">
            <LandingCard
                icon={<span className="text-4xl md:text-5xl">🎯</span>}
                title={language === 'ar' ? 'رسالتنا' : 'Our Mission'}
                contentClassName="space-y-6"
            >
                <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    {language === 'ar' 
                        ? 'تقديم خدمة إنقاذ طريق موثوقة وسريعة تجعل تجربة القيادة أكثر أمانًا وسلاسة.'
                        : 'To provide a reliable and fast roadside assistance service that makes the driving experience safer and smoother.'
                    }
                </p>
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/login">
                        {language === 'ar' ? 'انضم إلينا الآن' : 'Join Us Now'} <ArrowLeft className={language === 'ar' ? 'me-2' : 'ms-2'} />
                    </Link>
                </Button>
            </LandingCard>
        </section>
    );
}
