'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Combat from '@/components/game/Combat';
import type { Passage } from '@/types/book';
import type { Character } from '@/types/character';
import DisciplineIndicator from './DisciplineIndicator';
import ConditionalChoice from './ConditionalChoice';
import { DisciplineName } from '@/lib/disciplines';

interface PassageDisplayProps {
  passage: Passage;
  character: Character;
  onChoiceClick: (targetNumber: number) => void;
  onCharacterUpdate: (updates: Partial<Character>) => void;
}

export default function PassageDisplay({ 
  passage, 
  character,
  onChoiceClick,
  onCharacterUpdate,
}: PassageDisplayProps) {
  const [showCombat, setShowCombat] = useState(passage.type === 'combat');
  const [combatEnded, setCombatEnded] = useState(false);
  const [combatVictory, setCombatVictory] = useState(false);
  const getRelevantDisciplines = (passage: Passage): DisciplineName[] => {
  const relevant: DisciplineName[] = [];
  
  if (passage.type === 'combat' && passage.isPsychic) {
    relevant.push('Puissance Psychique');
  }
  
  // Ajouter d'autres conditions selon le passage
  // TODO: Cela devrait venir des métadonnées du passage
  
  return relevant;
};

  // Vérifier si le personnage a la Puissance Psychique
  const hasPsychicPower = character.disciplines.includes('Puissance Psychique');

  const handleCombatVictory = (remainingEndurance: number) => {
    setCombatVictory(true);
    setCombatEnded(true);
    setShowCombat(false);
    
    // Mettre à jour l'endurance du personnage
    onCharacterUpdate({ endurance: remainingEndurance });
  };

  const handleCombatDefeat = () => {
    setCombatEnded(true);
    setCombatVictory(false);
    
    // Mettre à jour l'endurance à 0
    onCharacterUpdate({ endurance: 0 });
  };

  const handleCombatUpdate = (playerEndurance: number) => {
    // Mise à jour en temps réel de l'endurance pendant le combat
    onCharacterUpdate({ endurance: playerEndurance });
  };

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

      {/* Contenu du passage */}
      <div
        className="prose prose-invert max-w-none rounded-lg bg-background-light p-6 text-text leading-relaxed"
        dangerouslySetInnerHTML={{ __html: passage.content }}
      />

      {/* Combat */}
      {passage.type === 'combat' && passage.enemyName && passage.enemySkill && passage.enemyEndurance && (
        <div>
          {character && (
  <DisciplineIndicator
    character={character}
    relevantDisciplines={getRelevantDisciplines(passage)}
  />
)}
          {showCombat && !combatEnded ? (
            <Combat
              playerSkill={character.skill}
              playerDisciplines={character.disciplines}
              playerEndurance={character.endurance}
              playerEnduranceMax={character.enduranceMax}
              enemyName={passage.enemyName}
              enemySkill={passage.enemySkill}
              enemyEndurance={passage.enemyEndurance}
              enemyEnduranceMax={passage.enemyEndurance}
              isPsychic={passage.isPsychic || false}
              hasPsychicPower={hasPsychicPower}
              canFlee={passage.canFlee !== false}
              onVictory={handleCombatVictory}
              onDefeat={handleCombatDefeat}
              onUpdate={handleCombatUpdate}
              onFlee={() => {
                setCombatEnded(true);
                setShowCombat(false);
              }}
            />
          ) : combatEnded && !combatVictory ? (
            // Défaite
            <div className="rounded-lg border-2 border-red-600 bg-red-900/20 p-6 text-center">
              <p className="mb-2 text-3xl">💀</p>
              <p className="text-2xl font-bold text-red-400">Vous êtes mort</p>
              <p className="mt-2 text-text-muted">
                Votre aventure se termine ici...
              </p>
            </div>
          ) : combatEnded && combatVictory ? (
            // Victoire
            <div className="rounded-lg border-2 border-green-600 bg-green-900/20 p-6 text-center">
              <p className="mb-2 text-3xl">🏆</p>
              <p className="text-2xl font-bold text-green-400">Victoire !</p>
              <p className="mt-2 text-text-muted">
                Vous avez vaincu {passage.enemyName}
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Mort naturelle (hors combat) */}
      {passage.type === 'death' && (
        <div className="rounded-lg border-2 border-red-600 bg-red-900/20 p-6 text-center">
          <p className="mb-2 text-3xl">💀</p>
          <p className="text-2xl font-bold text-red-400">Vous êtes mort</p>
          <p className="mt-2 text-text-muted">
            Votre aventure se termine ici...
          </p>
        </div>
      )}

      {/* Victoire finale */}
      {passage.type === 'victory' && (
        <div className="rounded-lg border-2 border-green-600 bg-green-900/20 p-6 text-center">
          <p className="mb-2 text-3xl">🏆</p>
          <p className="text-2xl font-bold text-green-400">
            Félicitations !
          </p>
          <p className="mt-2 text-text-muted">
            Vous avez terminé cette aventure avec succès !
          </p>
        </div>
      )}

      {/* Choix - affichés seulement si le combat est terminé avec victoire OU si pas de combat */}
      {passage.choices && passage.choices.length > 0 && (
        <>
          {(passage.type !== 'combat' || (combatEnded && combatVictory)) && (
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
                  disabled={passage.type === 'death' || (passage.type === 'combat' && !combatVictory)}
                >
                  → {choice.text}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}