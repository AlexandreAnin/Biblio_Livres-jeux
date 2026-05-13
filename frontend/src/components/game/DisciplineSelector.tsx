'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { DISCIPLINES, DisciplineName } from '@/lib/disciplines';

interface DisciplineSelectorProps {
  maxDisciplines?: number;
  onComplete: (disciplines: DisciplineName[], masteredWeapon?: string) => void;
}

const WEAPONS = [
  'Épée',
  'Hache',
  'Masse d\'Armes',
  'Lance',
  'Dague',
  'Marteau de Guerre',
  'Glaive',
  'Bâton',
];

export default function DisciplineSelector({
  maxDisciplines = 5,
  onComplete,
}: DisciplineSelectorProps) {
  const [selectedDisciplines, setSelectedDisciplines] = useState<
    DisciplineName[]
  >([]);
  const [masteredWeapon, setMasteredWeapon] = useState<string>('');
  const [step, setStep] = useState<'disciplines' | 'weapon'>('disciplines');

  const toggleDiscipline = (name: DisciplineName) => {
    if (selectedDisciplines.includes(name)) {
      setSelectedDisciplines(selectedDisciplines.filter((d) => d !== name));
    } else if (selectedDisciplines.length < maxDisciplines) {
      setSelectedDisciplines([...selectedDisciplines, name]);
    }
  };

  const handleNext = () => {
    if (selectedDisciplines.includes('Maîtrise des Armes')) {
      setStep('weapon');
    } else {
      onComplete(selectedDisciplines);
    }
  };

  const handleComplete = () => {
    onComplete(selectedDisciplines, masteredWeapon || undefined);
  };

  if (step === 'weapon') {
    return (
      <Card>
        <h2 className="mb-6 text-2xl font-bold text-primary-light">
          ⚔️ Choisissez votre arme maîtrisée
        </h2>

        <p className="mb-6 text-text-muted">
          Vous avez la discipline Maîtrise des Armes. Choisissez l&apos;arme que
          vous maîtrisez. Avec cette arme, vous bénéficierez de +2 en Habileté.
        </p>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {WEAPONS.map((weapon) => (
            <button
              key={weapon}
              onClick={() => setMasteredWeapon(weapon)}
              className={`rounded-lg border-2 p-4 text-center transition-all ${
                masteredWeapon === weapon
                  ? 'border-primary-light bg-primary/20 text-primary-light'
                  : 'border-primary bg-background-light text-text hover:border-primary-light'
              }`}
            >
              <div className="mb-1 text-2xl">🗡️</div>
              <div className="text-sm font-bold">{weapon}</div>
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setStep('disciplines')}>
            ← Retour
          </Button>
          <Button
            className="flex-1"
            onClick={handleComplete}
            disabled={!masteredWeapon}
          >
            Terminer
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-6 text-2xl font-bold text-primary-light">
        📚 Choisissez vos disciplines Kaï
      </h2>

      <div className="mb-6 text-center">
        <span className="text-lg text-text">
          {selectedDisciplines.length} / {maxDisciplines} disciplines
          sélectionnées
        </span>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {Object.values(DISCIPLINES).map((discipline) => {
          const isSelected = selectedDisciplines.includes(discipline.name);
          const canSelect =
            selectedDisciplines.length < maxDisciplines || isSelected;

          return (
            <button
              key={discipline.name}
              onClick={() => toggleDiscipline(discipline.name)}
              disabled={!canSelect}
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                isSelected
                  ? 'border-primary-light bg-primary/20'
                  : canSelect
                  ? 'border-primary bg-background-light hover:border-primary-light'
                  : 'border-background bg-background opacity-50'
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{discipline.icon}</span>
                  <h3 className="font-bold text-text">{discipline.name}</h3>
                </div>
                {isSelected && (
                  <span className="text-xl text-green-400">✓</span>
                )}
              </div>

              <p className="mb-3 text-sm text-text-muted">
                {discipline.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {discipline.effects.map((effect, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-background px-2 py-1 text-xs text-text-muted"
                  >
                    • {effect}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <Button
        className="w-full"
        onClick={handleNext}
        disabled={selectedDisciplines.length !== maxDisciplines}
      >
        Continuer →
      </Button>
    </Card>
  );
}