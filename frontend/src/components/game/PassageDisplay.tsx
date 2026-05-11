import Button from '@/components/ui/Button';
import type { Passage } from '@/types/book';

interface PassageDisplayProps {
  passage: Passage;
  onChoiceClick: (targetNumber: number) => void;
}

export default function PassageDisplay({ passage, onChoiceClick }: PassageDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Numéro du passage */}
      <div className="text-center">
        <span className="inline-block rounded-full border-2 border-primary bg-background-light px-4 py-2 text-sm font-bold text-primary-light">
          Passage {passage.number}
        </span>
      </div>

      {/* Titre (si présent) */}
      {passage.title && (
        <h2 className="text-center text-2xl font-bold text-primary-light">
          {passage.title}
        </h2>
      )}

      {/* Contenu */}
      <div
        className="prose prose-invert max-w-none rounded-lg bg-background-light p-6 text-text"
        dangerouslySetInnerHTML={{ __html: passage.content }}
      />

      {/* Combat (si applicable) */}
      {passage.type === 'combat' && passage.enemyName && (
        <div className="rounded-lg border-2 border-red-600 bg-background-light p-6">
          <h3 className="mb-4 text-xl font-bold text-red-400">
            ⚔️ Combat !
          </h3>
          <div className="space-y-2 text-text">
            <p>
              <span className="font-bold">Ennemi :</span> {passage.enemyName}
            </p>
            <p>
              <span className="font-bold">Habileté :</span> {passage.enemySkill}
            </p>
            <p>
              <span className="font-bold">Endurance :</span> {passage.enemyEndurance}
            </p>
            {passage.isPsychic && (
              <p className="text-purple-400">
                ⚡ Sensible à la Puissance Psychique
              </p>
            )}
          </div>
        </div>
      )}

      {/* Choix */}
      {passage.choices && passage.choices.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-primary-light">
            Que faites-vous ?
          </h3>
          {passage.choices.map((choice) => (
            <Button
              key={choice.id}
              variant="secondary"
              className="w-full justify-start text-left"
              onClick={() => onChoiceClick(choice.targetPassageNumber)}
            >
              → {choice.text}
            </Button>
          ))}
        </div>
      )}

      {/* Mort ou victoire */}
      {passage.type === 'death' && (
        <div className="rounded-lg border-2 border-red-600 bg-red-900/20 p-6 text-center">
          <p className="text-2xl font-bold text-red-400">💀 Vous êtes mort</p>
        </div>
      )}

      {passage.type === 'victory' && (
        <div className="rounded-lg border-2 border-green-600 bg-green-900/20 p-6 text-center">
          <p className="text-2xl font-bold text-green-400">🏆 Victoire !</p>
        </div>
      )}
    </div>
  );
}