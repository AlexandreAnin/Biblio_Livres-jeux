'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { passagesApi } from '@/lib/api';
import { useGameStore } from '@/store/gameStore';
import PassageDisplay from '@/components/game/PassageDisplay';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import type { Passage } from '@/types/book';
import toast from 'react-hot-toast';

export default function PassagePage() {
  const params = useParams();
  const router = useRouter();
  const bookSlug = params.bookSlug as string;
  const passageNumber = parseInt(params.number as string);

  const { currentPassage, setPassage } = useGameStore();
  const [passage, setLocalPassage] = useState<Passage | null>(currentPassage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPassage = async () => {
      try {
        const response = await passagesApi.get(bookSlug, passageNumber);
        if (response.success && response.data) {
          setLocalPassage(response.data);
          setPassage(response.data);
        }
      } catch (error) {
        console.error('Error fetching passage:', error);
        toast.error('Erreur lors du chargement du passage');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPassage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookSlug, passageNumber]);

  const handleChoiceClick = (targetNumber: number) => {
    router.push(`/books/${bookSlug}/passage/${targetNumber}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (!passage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card>
          <p className="text-xl text-text">Passage non trouvé</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <Card>
            <PassageDisplay passage={passage} onChoiceClick={handleChoiceClick} />
          </Card>
        </div>
      </div>
    </div>
  );
}