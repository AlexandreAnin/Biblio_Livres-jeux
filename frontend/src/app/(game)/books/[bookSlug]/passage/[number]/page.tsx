'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { passagesApi, charactersApi } from '@/lib/api';
import { useGameStore } from '@/store/gameStore';
import { useAuthStore } from '@/store/authStore';
import PassageDisplay from '@/components/game/PassageDisplay';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import type { Passage } from '@/types/book';
import type { Character } from '@/types/character';
import toast from 'react-hot-toast';
import { useDisciplineCheck } from '@/hooks/useDisciplineCheck';
import MealSystem from '@/components/game/MealSystem';


export default function PassagePage() {
  const params = useParams();
  const router = useRouter();
  const bookSlug = params.bookSlug as string;
  const passageNumber = parseInt(params.number as string);

  const { isAuthenticated } = useAuthStore();
  const { currentCharacter, currentPassage, setPassage, setCharacter } = useGameStore();
  
  const [passage, setLocalPassage] = useState<Passage | null>(currentPassage);
  const [character, setLocalCharacter] = useState<Character | null>(currentCharacter);
  const [isLoading, setIsLoading] = useState(true);

  const disciplineCheck = useDisciplineCheck(character);
  const [showMealSystem, setShowMealSystem] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  
    const fetchData = async () => {
      try {
        // Charger le passage
        const passageResponse = await passagesApi.get(bookSlug, passageNumber);
        if (passageResponse.success && passageResponse.data) {
          setLocalPassage(passageResponse.data);
          setPassage(passageResponse.data);
        }

        // Charger le personnage actuel si pas déjà chargé
        if (!currentCharacter) {
          const charactersResponse = await charactersApi.getAll();
          if (charactersResponse.success && charactersResponse.data) {
            const chars = charactersResponse.data;
            // Trouver le personnage de ce livre
            const bookCharacter = chars.find(c => c.currentPassageNumber === passageNumber);
            if (bookCharacter) {
              setLocalCharacter(bookCharacter);
              setCharacter(bookCharacter);
            }
          }
        } else {
          setLocalCharacter(currentCharacter);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors du chargement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookSlug, passageNumber, isAuthenticated, currentCharacter, router, setCharacter, setPassage]);

  const handleChoiceClick = async (targetNumber: number) => {
    if (!character) return;

    try {
      // Mettre à jour le numéro de passage actuel du personnage
      await charactersApi.update(character.id, {
        currentPassageNumber: targetNumber,
      });

      // Naviguer vers le nouveau passage
      router.push(`/books/${bookSlug}/passage/${targetNumber}`);
    } catch (error) {
      console.error('Error updating character:', error);
      toast.error('Erreur lors de la navigation');
    }
  };

  const handleCharacterUpdate = async (updates: Partial<Character>) => {
    if (!character) return;

    try {
      // Mettre à jour le personnage en base de données
      const response = await charactersApi.update(character.id, updates);
      
      if (response.success && response.data) {
        setLocalCharacter(response.data);
        setCharacter(response.data);
      }
    } catch (error) {
      console.error('Error updating character:', error);
      toast.error('Erreur lors de la mise à jour');
    }
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

  if (!character) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card>
          <p className="mb-4 text-xl text-text">Aucun personnage trouvé</p>
          <button
            onClick={() => router.push(`/books/${bookSlug}`)}
            className="rounded-md bg-primary px-6 py-3 font-bold text-white hover:bg-primary-dark"
          >
            Retour au livre
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          {/* Fiche personnage (sidebar) */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="mb-4 text-xl font-bold text-primary-light">
                📋 {character.name}
              </h3>
              
              <div className="space-y-3">
                {/* Habileté */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Habileté</span>
                    <span className="font-bold text-text">
                      {character.skill} / {character.skillMax}
                    </span>
                  </div>
                </div>

                {/* Endurance */}
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-text-muted">Endurance</span>
                    <span className="font-bold text-text">
                      {character.endurance} / {character.enduranceMax}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className={`h-full transition-all duration-300 ${
                        character.endurance <= character.enduranceMax * 0.3
                          ? 'bg-red-600'
                          : character.endurance <= character.enduranceMax * 0.6
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                      }`}
                      style={{
                        width: `${Math.round(
                          (character.endurance / character.enduranceMax) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Or */}
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Pièces d&apos;Or</span>
                    <span className="font-bold text-text">{character.gold} / 50</span>
                  </div>
                </div>

                {/* Arme en main */}
                {character.weaponInHand && (
                  <div className="rounded-md border border-primary bg-background p-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">🗡️ Arme</span>
                      <span className="text-text">{character.weaponInHand}</span>
                    </div>
                  </div>
                )}

                {/* Disciplines */}
                {character.disciplines.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs text-text-muted">Disciplines</p>
                    <div className="flex flex-wrap gap-1">
                      {character.disciplines.map((disc, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-primary bg-background px-2 py-0.5 text-xs text-text"
                        >
                          {disc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Bouton vers l'inventaire complet */}
            <button
              onClick={() => router.push('/character')}
              className="mt-4 w-full rounded-md border-2 border-primary bg-background-light px-4 py-2 text-sm font-bold text-primary-light hover:bg-background"
            >
              📦 Voir l&apos;inventaire complet
            </button>
          </div>

          {/* Passage principal */}
          <div className="lg:col-span-2">
            <Card>
              <PassageDisplay
                passage={passage}
                character={character}
                onChoiceClick={handleChoiceClick}
                onCharacterUpdate={handleCharacterUpdate}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}