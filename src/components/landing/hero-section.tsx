'use client';

import { LandingCard } from "./landing-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../app-provider";

export function HeroSection() {
    const { language } = useApp();
    return (
        <section id="hero">
            <LandingCard 
                icon={<span className="text-4xl md:text-5xl">🔧</span>} 
                title={language === 'ar' ? "ما هو سينيال؟" : "What is Signal?"}
                contentClassName="space-y-6"
            >
                <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    {language === 'ar' 
                        ? "سينيال هو تطبيق إلكتروني مبتكر يربط السائقين بأقرب ميكانيكيين وفنيين متخصصين، لتلقي المساعدة مباشرة في موقع العطل دون الحاجة للبحث أو الانتظار الطويل."
                        : "Signal is an innovative electronic application that connects drivers with the nearest specialized mechanics and technicians, to receive help directly at the breakdown site without the need for searching or long waits."
                    }
                </p>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/login">
                        {language === 'ar' ? 'ابدأ الآن' : 'Get Started'} <ArrowLeft className={language === 'ar' ? 'me-2' : 'ms-2'} />
                    </Link>
                </Button>
            </LandingCard>
        </section>
    );
}
