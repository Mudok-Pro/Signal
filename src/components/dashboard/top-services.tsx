
'use client';

import { useApp } from "../app-provider";
import Image from 'next/image';
import { cn } from "@/lib/utils";

const services = [
  { id: 'mechanical', name: 'إصلاح ميكانيكي', name_en: 'Mechanical Repair', icon: 'https://www.freeicons.io/uploads/icon/9421501581691653-512.png' },
  { id: 'battery', name: 'بطارية وشحن', name_en: 'Battery & Charging', icon: 'https://cdn-icons-png.flaticon.com/512/3071/3071441.png' },
  { id: 'tires', name: 'فحص الإطارات', name_en: 'Tire Check', icon: 'https://cdn-icons-png.flaticon.com/512/1550/1550550.png' },
  { id: 'electronic', name: 'فحص إلكتروني', name_en: 'Electronic Check', icon: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png' },
  { id: 'fuel', name: 'تعبئة وقود', name_en: 'Fuel Refill', icon: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png' },
  { id: 'tech_support', name: 'دعم تقني', name_en: 'Tech Support', icon: 'https://cdn-icons-png.flaticon.com/512/2618/2618521.png' },
];

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
              "flex flex-col items-center justify-center text-center p-3 rounded-lg border transition-all duration-200 ease-in-out",
              selectedService === service.id 
                ? "bg-accent text-accent-foreground border-accent shadow-md" 
                : "bg-card hover:bg-muted/80 border-border"
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
