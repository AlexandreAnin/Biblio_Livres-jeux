'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { canHuntFood } from '@/lib/disciplines';
import type { Character } from '@/types/character';

interface MealSystemProps {
  character: Character;
  onMealTaken: (enduranceLoss: number) => void;
}

export default function MealSystem({ character, onMealTaken }: MealSystemProps) {
  const [mealTaken, setMealTaken] = useState(false);

  const hasChasse = canHuntFood(character.disciplines);
  const mealCount = character.backpack.filter((item) => item.name === 'Repas').length;

  const handleTakeMeal = () => {
    setMealTaken(true);

    if (hasChasse) {
      // La Chasse : repas gratuit
      onMealTaken(0);
    } else if (mealCount > 0) {
      // Consommer un repas du sac
      onMealTaken(0);
      // TODO: Retirer le repas de l'inventaire via l'API
    } else {
      // Pas de repas : -3 Endurance
      onMealTaken(3);
    }
  };

  if (mealTaken) {
    if (hasChasse) {
      return (
        <Card>
          <div className="text-center">
            <div className="mb-4 text-5xl">🏹</div>
            <h3 className="mb-2 text-xl font-bold text-green-400">
              La Chasse
            </h3>
            <p className="text-text-muted">
              Grâce à votre discipline de La Chasse, vous trouvez de quoi vous
              nourrir dans la nature.
            </p>
          </div>
        </Card>
      );
    } else if (mealCount > 0) {
      return (
        <Card>
          <div className="text-center">
            <div className="mb-4 text-5xl">🍖</div>
            <h3 className="mb-2 text-xl font-bold text-primary-light">
              Repas consommé
            </h3>
            <p className="text-text-muted">
              Vous prenez un Repas de votre sac à dos.
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Repas restants : {mealCount - 1}
            </p>
          </div>
        </Card>
      );
    } else {
      return (
        <Card className="border-red-600">
          <div className="text-center">
            <div className="mb-4 text-5xl">⚠️</div>
            <h3 className="mb-2 text-xl font-bold text-red-400">
              Pas de repas disponible
            </h3>
            <p className="text-text-muted">
              Vous n&apos;avez rien à manger. Affaibli par la faim, vous perdez 3
              points d&apos;ENDURANCE.
            </p>
            <p className="mt-4 text-2xl font-bold text-red-400">-3 END</p>
          </div>
        </Card>
      );
    }
  }

  return (
    <Card>
      <h3 className="mb-4 text-xl font-bold text-primary-light">
        🍽️ Il est temps de manger
      </h3>

      {hasChasse ? (
        <div className="mb-4 rounded-lg border-2 border-green-600 bg-green-900/20 p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏹</span>
            <div>
              <p className="font-bold text-green-400">La Chasse</p>
              <p className="text-sm text-text-muted">
                Vous pouvez chasser votre repas gratuitement
              </p>
            </div>
          </div>
        </div>
      ) : mealCount > 0 ? (
        <div className="mb-4 rounded-lg border-2 border-primary bg-background-light p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-text">Repas disponibles</p>
              <p className="text-sm text-text-muted">
                Vous avez {mealCount} Repas dans votre sac
              </p>
            </div>
            <div className="text-3xl">🍖</div>
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-lg border-2 border-red-600 bg-red-900/20 p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <p className="font-bold text-red-400">Aucun repas disponible</p>
              <p className="text-sm text-text-muted">
                Sans nourriture, vous perdrez 3 points d&apos;Endurance
              </p>
            </div>
          </div>
        </div>
      )}

      <Button className="w-full" onClick={handleTakeMeal}>
        {hasChasse ? '🏹 Chasser un repas' : 
         mealCount > 0 ? '🍖 Prendre un repas' : 
         '⚠️ Continuer sans manger (-3 END)'}
      </Button>
    </Card>
  );
}