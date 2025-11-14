'use client';

import { LandingCard } from "./landing-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function HeroSection() {
    return (
        <section id="hero">
            <LandingCard 
                icon={<span className="text-4xl md:text-5xl">🔧</span>} 
                title="ما هو سينيال؟"
                contentClassName="space-y-6"
            >
                <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    سينيال هو تطبيق إلكتروني مبتكر يربط السائقين بأقرب ميكانيكيين وفنيين متخصصين، لتلقي المساعدة مباشرة في موقع العطل دون الحاجة للبحث أو الانتظار الطويل.
                </p>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/login">
                        ابدأ الآن <ArrowLeft className="me-2" />
                    </Link>
                </Button>
            </LandingCard>
        </section>
    );
}
