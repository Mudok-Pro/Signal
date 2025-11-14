'use client';

import { LandingCard } from "./landing-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function MissionSection() {
    return (
        <section id="mission">
            <LandingCard
                icon={<span className="text-4xl md:text-5xl">🎯</span>}
                title="رسالتنا"
                contentClassName="space-y-6"
            >
                <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    تقديم خدمة إنقاذ طريق موثوقة وسريعة تجعل تجربة القيادة أكثر أمانًا وسلاسة.
                </p>
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/login">
                        انضم إلينا الآن <ArrowLeft className="me-2" />
                    </Link>
                </Button>
            </LandingCard>
        </section>
    );
}
