'use client';

import Button from '@/components/ui/Button';
import { DisciplineName } from '@/lib/disciplines';
import type { Character } from '@/types/character';

interface ConditionalChoiceProps {
  text: string;
  requiredDiscipline?: DisciplineName;
  requiredItem?: string;
  character: Character;
  onChoose: () => void;
  targetNumber: number;
}

export default function ConditionalChoice({
  text,
  requiredDiscipline,
  requiredItem,
  character,
  onChoose,
  targetNumber,
}: ConditionalChoiceProps) {
  const hasRequirement = requiredDiscipline
    ? character.disciplines.includes(requiredDiscipline)
    : requiredItem
    ? character.backpack.some((item) => item.name === requiredItem) ||
      character.weapons.some((weapon) => weapon.name === requiredItem) ||
      character.specialItems.some((item) => item.name === requiredItem)
    : true;

  if (!hasRequirement) {
    return null; // Ne pas afficher ce choix si la condition n'est pas remplie
  }

  return (
    <div className="relative">
      {requiredDiscipline && (
        <div className="mb-2 flex items-center gap-2 text-sm text-green-400">
          <span>✓</span>
          <span>{requiredDiscipline} disponible</span>
        </div>
      )}
      {requiredItem && (
        <div className="mb-2 flex items-center gap-2 text-sm text-blue-400">
          <span>✓</span>
          <span>{requiredItem} en votre possession</span>
        </div>
      )}
      <Button
        variant="secondary"
        className="w-full justify-start text-left"
        onClick={onChoose}
      >
        → {text}
      </Button>
    </div>
  );
}
