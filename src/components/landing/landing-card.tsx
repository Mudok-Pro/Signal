"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LandingCardProps {
    title?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    headerClassName?: string;
    titleClassName?: string;
    contentClassName?: string;
}

export function LandingCard({ 
    title, 
    icon, 
    children, 
    className, 
    headerClassName,
    titleClassName, 
    contentClassName
}: LandingCardProps) {
  return (
    <Card className={cn("bg-card/80 backdrop-blur-sm border-border/20 shadow-lg", className)}>
      {(title || icon) && (
        <CardHeader className={cn("items-center text-center", headerClassName)}>
          <CardTitle className={cn("text-2xl md:text-3xl font-bold flex items-center gap-3 text-primary", titleClassName)}>
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("text-center", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
