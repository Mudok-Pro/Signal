
'use client';

import { useApp } from "../app-provider";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { services } from "@/lib/services";

type TopServicesProps = {
    selectedService: string | null;
    onSelectService: (serviceId: string | null) => void;
}

export function TopServices({ selectedService, onSelectService }: TopServicesProps) {
  const { language } = useApp();
  
  const handleServiceClick = (serviceId: string) => {
    if (selectedService === serviceId) {
      onSelectService(null); // Deselect if clicked again
    } else {
      onSelectService(serviceId);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => handleServiceClick(service.id)}
            className={cn(
              "flex flex-col items-center justify-center text-center p-3 rounded-lg transition-all duration-200 ease-in-out",
              selectedService === service.id 
                ? "bg-accent text-accent-foreground shadow-lg" 
                : "bg-card hover:bg-muted/80"
            )}
          >
            <div className="relative w-9 h-9 mb-2">
              <Image src={service.icon} alt={language === 'ar' ? service.name : service.name_en} fill style={{ objectFit: 'contain' }} />
            </div>
            <p className="text-xs font-medium leading-tight">
              {language === 'ar' ? service.name : service.name_en}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}