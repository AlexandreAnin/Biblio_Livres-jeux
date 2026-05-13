'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { charactersApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import DisciplineSelector from '@/components/game/DisciplineSelector';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { randomNumber } from '@/lib/utils';
import { DisciplineName } from '@/lib/disciplines';
import toast from 'react-hot-toast';

export default function CreateCharacterPage() {
  const params = useParams();
  const router = useRouter();
  const bookSlug = params.bookSlug as string;

  const { user } = useAuthStore();
  const { setCharacter } = useGameStore();

  const [step, setStep] = useState<'name' | 'stats' | 'disciplines'>('name');
  const [characterName, setCharacterName] = useState('');
  const [skill, setSkill] = useState(10);
  const [skillMax, setSkillMax] = useState(10);
  const [endurance, setEndurance] = useState(20);
  const [enduranceMax, setEnduranceMax] = useState(20);
  const [isCreating, setIsCreating] = useState(false);

  // Étape 1 : Nom
  const handleNameNext = () => {
    if (characterName.trim()) {
      setStep('stats');
    }
  };

  // Étape 2 : Stats (génération aléatoire)
  const generateStats = () => {
    const skillBonus = randomNumber(0, 9);
    const enduranceBonus = randomNumber(0, 9);

    setSkill(10 + skillBonus);
    setSkillMax(10 + skillBonus);
    setEndurance(20 + enduranceBonus);
    setEnduranceMax(20 + enduranceBonus);
  };

  const handleStatsNext = () => {
    setStep('disciplines');
  };

  // Étape 3 : Disciplines
  const handleDisciplinesComplete = async (
    disciplines: DisciplineName[],
    masteredWeapon?: string
  ) => {
    setIsCreating(true);

    try {
      // Récupérer l'ID du livre
      const bookResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${bookSlug}`
      );
      const bookData = await bookResponse.json();

      if (!bookData.success) {
        throw new Error('Book not found');
      }

      const characterData = {
        bookId: bookData.data.id,
        name: characterName,
        skill,
        skillMax,
        endurance,
        enduranceMax,
        gold: 10,
        disciplines: disciplines as string[],
        masteredWeapon,
        currentPassageNumber: 1,
      };

      const response = await charactersApi.create(characterData);

      if (response.success && response.data) {
        setCharacter(response.data);
        toast.success('Personnage créé !');
        router.push(`/books/${bookSlug}/passage/1`);
      }
    } catch (error) {
      console.error('Error creating character:', error);
      toast.error('Erreur lors de la création du personnage');
    } finally {
      setIsCreating(false);
    }
  };

  if (step === 'name') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <h1 className="mb-6 text-2xl font-bold text-primary-light">
            📝 Nom de votre personnage
          </h1>

          <Input
            label="Nom"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Loup Gris"
            autoFocus
          />

          <Button
            className="mt-6 w-full"
            onClick={handleNameNext}
            disabled={!characterName.trim()}
          >
            Continuer →
          </Button>
        </Card>
      </div>
    );
  }

  if (step === 'stats') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <h1 className="mb-6 text-2xl font-bold text-primary-light">
            🎲 Déterminez vos caractéristiques
          </h1>

          <p className="mb-6 text-text-muted">
            Lancez les dés pour déterminer votre Habileté et votre Endurance
            de départ.
          </p>

          <div className="mb-6 space-y-4">
            <div className="rounded-lg border-2 border-primary bg-background-light p-4">
              <div className="mb-2 text-sm text-text-muted">Habileté</div>
              <div className="text-3xl font-bold text-primary-light">
                {skill}
              </div>
              <div className="text-xs text-text-muted">
                10 + {skill - 10} (dé 0-9)
              </div>
            </div>

            <div className="rounded-lg border-2 border-primary bg-background-light p-4">
              <div className="mb-2 text-sm text-text-muted">Endurance</div>
              <div className="text-3xl font-bold text-primary-light">
                {endurance}
              </div>
              <div className="text-xs text-text-muted">
                20 + {endurance - 20} (dé 0-9)
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="secondary" onClick={generateStats}>
              🎲 Relancer les dés
            </Button>
            <Button className="flex-1" onClick={handleStatsNext}>
              Continuer →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'disciplines') {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <DisciplineSelector
              maxDisciplines={5}
              onComplete={handleDisciplinesComplete}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}