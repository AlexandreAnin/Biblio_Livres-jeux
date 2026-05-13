'use client';

import { Character } from '@/types/character';
import Card from '@/components/ui/Card';
import { GAME_CONSTANTS } from '@/lib/constants';

interface CharacterSheetProps {
  character: Character;
}

export default function CharacterSheet({ character }: CharacterSheetProps) {
  const endurancePercent = Math.round(
    (character.endurance / character.enduranceMax) * 100
  );

  const goldPercent = Math.round((character.gold / GAME_CONSTANTS.MAX_GOLD) * 100);

  const enduranceClass =
    character.endurance <= character.enduranceMax * 0.3
      ? 'bg-red-600'
      : character.endurance <= character.enduranceMax * 0.6
      ? 'bg-yellow-600'
      : 'bg-green-600';

  return (
    <Card>
      <h2 className="mb-6 text-center text-2xl font-bold text-primary-light">
        📋 Fiche de Personnage
      </h2>

      {/* Nom */}
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-text">{character.name}</h3>
      </div>

      {/* Statistiques */}
      <div className="space-y-4">
        {/* Habileté */}
        <div>
          <div className="mb-2 flex justify-between">
            <span className="font-bold text-primary-light">⚔️ Habileté</span>
            <span className="text-text">
              {character.skill} / {character.skillMax}
            </span>
          </div>
        </div>

        {/* Endurance */}
        <div>
          <div className="mb-2 flex justify-between">
            <span className="font-bold text-primary-light">❤️ Endurance</span>
            <span className="text-text">
              {character.endurance} / {character.enduranceMax}
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-background">
            <div
              className={`h-full transition-all duration-300 ${enduranceClass}`}
              style={{ width: `${endurancePercent}%` }}
            />
          </div>
        </div>

        {/* Or */}
        <div>
          <div className="mb-2 flex justify-between">
            <span className="font-bold text-primary-light">💰 Pièces d&apos;Or</span>
            <span className="text-text">
              {character.gold} / {GAME_CONSTANTS.MAX_GOLD}
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-background">
            <div
              className="h-full bg-linear-to-r from-yellow-600 to-yellow-400 transition-all duration-300"
              style={{ width: `${goldPercent}%` }}
            />
          </div>
        </div>

        {/* Arme en main */}
        {character.weaponInHand && (
          <div className="rounded-md border-2 border-primary bg-background p-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary-light">🗡️ Arme</span>
              <span className="text-text">{character.weaponInHand}</span>
            </div>
          </div>
        )}

        {/* Disciplines Kaï */}
        {character.disciplines.length > 0 && (
          <div>
            <h4 className="mb-2 font-bold text-primary-light">
              📚 Disciplines Kaï
            </h4>
            <div className="flex flex-wrap gap-2">
              {character.disciplines.map((discipline, index) => (
                <span
                  key={index}
                  className="rounded-full border-2 border-primary bg-background px-3 py-1 text-sm text-text"
                >
                  {discipline}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Arme maîtrisée */}
        {character.masteredWeapon && (
          <div className="rounded-md border-2 border-green-600 bg-green-900/20 p-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-green-400">⭐ Maîtrise</span>
              <span className="text-text">{character.masteredWeapon}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}