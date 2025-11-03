
'use client';

import { useFirestore, useUser } from "@/firebase";
import { Button } from "./ui/button";
import { collection, doc, writeBatch } from "firebase/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const mechanicsToSeed = [
    { name: "أحمد العلي", rating: 4.8, reviews: 124, distance: 2.5, available: true, id: 'mech_ahmed', avatarId: 'mech1' },
    { name: "محمد الغامدي", rating: 4.9, reviews: 210, distance: 4.1, available: true, id: 'mech_mohammed', avatarId: 'mech2' },
    { name: "خالد المصري", rating: 4.7, reviews: 88, distance: 5.2, available: false, id: 'mech_khaled', avatarId: 'mech3' },
    { name: "سارة عبد الله", rating: 5.0, reviews: 95, distance: 8.0, available: true, id: 'mech_sarah', avatarId: 'mech4' },
];

export function SeedFirestoreButton() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    if (!firestore) return;
    setIsSeeding(true);

    try {
        const batch = writeBatch(firestore);
        const mechanicsCollection = collection(firestore, "mechanics");

        mechanicsToSeed.forEach(mechanic => {
            const docRef = doc(mechanicsCollection, mechanic.id);
            const avatar = PlaceHolderImages.find(img => img.id === mechanic.avatarId);
            batch.set(docRef, {
                name: mechanic.name,
                rating: mechanic.rating,
                reviews: mechanic.reviews,
                distance: mechanic.distance,
                available: mechanic.available,
                avatarUrl: avatar?.imageUrl || '',
                avatarHint: avatar?.imageHint || '',
                location: null // Placeholder for GeoPoint
            });
        });

        await batch.commit();

        toast({
            title: "Database Seeded",
            description: "Sample mechanics have been added to Firestore.",
        });
    } catch (error) {
        console.error("Error seeding database: ", error);
        const e = error as Error;
        toast({
            variant: 'destructive',
            title: "Seeding Failed",
            description: e.message,
        });
    } finally {
        setIsSeeding(false);
    }
  };

  if (!user) return null;

  return (
    <div className="text-center mb-6">
        <Button onClick={handleSeed} disabled={isSeeding}>
            {isSeeding ? 'Seeding Data...' : 'Seed Mechanic Data for Testing'}
        </Button>
    </div>
  );
}
