"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import type { Mechanic } from "@/lib/types";
import { useApp } from "./app-provider";
import { RequestServiceDialog } from "./request-service-dialog";

type MechanicCardProps = {
  mechanic: Mechanic;
};

export function MechanicCard({ mechanic }: MechanicCardProps) {
  const { language } = useApp();

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
      <CardHeader className="flex-row gap-4 items-center p-4">
        <div className="relative shrink-0">
          <Image
            src={mechanic.avatarUrl}
            alt={mechanic.name}
            width={64}
            height={64}
            className="rounded-full border-2 border-primary/50 object-cover"
            data-ai-hint={mechanic.avatarHint}
          />
          {mechanic.available && (
              <span className="absolute bottom-0 end-0 block h-4 w-4 rounded-full bg-green-500 border-2 border-card" title={language === 'ar' ? 'متاح' : 'Available'} />
          )}
        </div>
        <div className="flex-1">
          <CardTitle className="text-base font-bold">{mechanic.name}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{mechanic.rating.toFixed(1)}</span>
            <span className="text-xs">({mechanic.reviews} {language === 'ar' ? 'تقييم' : 'reviews'})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
         <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {/* Distance calculation would be more complex in a real app */}
            <span>{language === 'ar' ? `يبعد ${mechanic.distance.toFixed(1)} كم` : `${mechanic.distance.toFixed(1)} km away`}</span>
          </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <RequestServiceDialog triggerButton={
          <Button className="w-full" variant="default">
            {language === 'ar' ? 'طلب خدمة' : 'Request Service'}
          </Button>
        }/>
      </CardFooter>
    </Card>
  );
}
