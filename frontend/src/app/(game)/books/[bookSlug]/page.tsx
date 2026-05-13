'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { booksApi, charactersApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import type { Book } from '@/types/book';
import toast from 'react-hot-toast';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookSlug = params.bookSlug as string;
  
  const { user, isAuthenticated } = useAuthStore();
  const { setCharacter } = useGameStore();
  
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await booksApi.getBySlug(bookSlug);
        if (response.success && response.data) {
          setBook(response.data);
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        toast.error('Erreur lors du chargement du livre');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookSlug]);

  const handleStartAdventure = async () => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour jouer');
      router.push('/login');
      return;
    }

    if (!book) return;

    setIsStarting(true);

    try {
      // Créer un nouveau personnage
      const characterData = {
        bookId: book.id,
        name: `${user?.username} - ${book.title}`,
        skill: 15,
        skillMax: 15,
        endurance: 25,
        enduranceMax: 25,
        gold: 10,
        disciplines: [],
        currentPassageNumber: 1,
      };

      const response = await charactersApi.create(characterData);

      if (response.success && response.data) {
        setCharacter(response.data);
        toast.success('Aventure commencée !');
        router.push(`/books/${bookSlug}/passage/1`);
      }
    } catch (error) {
      console.error('Error starting adventure:', error);
      toast.error('Erreur lors de la création du personnage');
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card>
          <p className="text-xl text-text">Livre non trouvé</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <Card>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Couverture */}
              <div>
                <div className="aspect-2/3 overflow-hidden rounded-md bg-background">
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-9xl">
                      📖
                    </div>
                  )}
                </div>
              </div>

              {/* Détails */}
              <div className="flex flex-col">
                <h1 className="mb-4 text-4xl font-bold text-primary-light">
                  {book.title}
                </h1>

                <p className="mb-4 text-lg text-text">
                  Par <span className="text-primary-light">{book.author}</span>
                </p>

                {book.series && (
                  <p className="mb-4 text-text-muted">
                    {book.series} - Volume {book.seriesIndex}
                  </p>
                )}

                {book.description && (
                  <div className="mb-6 flex-1">
                    <h2 className="mb-2 text-xl font-bold text-primary-light">
                      Synopsis
                    </h2>
                    <p className="text-text-muted leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleStartAdventure}
                    isLoading={isStarting}
                  >
                    ⚔️ Commencer l&apos;aventure
                  </Button>

                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => router.push('/books')}
                  >
                    ← Retour à la bibliothèque
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}