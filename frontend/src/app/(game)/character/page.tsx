'use client';

import { useEffect, useState } from 'react';
import { charactersApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import CharacterSheet from '@/components/game/CharacterSheet';
import Inventory from '@/components/game/Inventory';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import type { Character } from '@/types/character';
import toast from 'react-hot-toast';

export default function CharacterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchCharacters = async () => {
      try {
        const response = await charactersApi.getAll();
        if (response.success && response.data) {
          setCharacters(response.data);
          if (response.data.length > 0) {
            setSelectedCharacter(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
        toast.error('Erreur lors du chargement des personnages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card>
          <h2 className="mb-4 text-2xl font-bold text-primary-light">
            Aucun personnage
          </h2>
          <p className="mb-6 text-text-muted">
            Vous n&apos;avez pas encore de personnage. Commencez une aventure pour en créer un !
          </p>
          <button
            onClick={() => router.push('/books')}
            className="w-full rounded-md bg-primary px-6 py-3 font-bold text-white hover:bg-primary-dark"
          >
            Parcourir les livres
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-4xl font-bold text-primary-light">
          👤 Mes Personnages
        </h1>

        {/* Sélection du personnage */}
        {characters.length > 1 && (
          <div className="mb-6">
            <select
              value={selectedCharacter?.id || ''}
              onChange={(e) => {
                const char = characters.find((c) => c.id === e.target.value);
                if (char) setSelectedCharacter(char);
              }}
              className="w-full rounded-md border-2 border-primary bg-background px-4 py-2 text-text"
            >
              {characters.map((char) => (
                <option key={char.id} value={char.id}>
                  {char.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedCharacter && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Fiche personnage */}
            <div className="lg:col-span-1">
              <CharacterSheet character={selectedCharacter} />
            </div>

            {/* Inventaire */}
            <div className="lg:col-span-2">
              <Inventory character={selectedCharacter} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}