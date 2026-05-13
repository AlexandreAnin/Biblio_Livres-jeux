'use client';

import { Character, InventoryItem, Weapon, SpecialItem } from '@/types/character';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { GAME_CONSTANTS } from '@/lib/constants';

interface InventoryProps {
  character: Character;
  onItemUse?: (itemId: string) => void;
  onWeaponEquip?: (weaponName: string) => void;
}

export default function Inventory({
  character,
  onItemUse,
  onWeaponEquip,
}: InventoryProps) {
  const totalSpecialWeight = character.specialItems.reduce(
    (sum, item) => sum + item.weight,
    0
  );

  return (
    <div className="space-y-6">
      {/* Sac à dos */}
      <Card>
        <h3 className="mb-4 text-xl font-bold text-primary-light">
          🎒 Sac à dos
        </h3>
        <p className="mb-4 text-sm text-text-muted">
          {character.backpack.length} / {GAME_CONSTANTS.MAX_BACKPACK_SLOTS} objets
        </p>

        {character.backpack.length === 0 ? (
          <p className="text-center text-text-muted">Sac à dos vide</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: GAME_CONSTANTS.MAX_BACKPACK_SLOTS }).map(
              (_, index) => {
                const item = character.backpack[index];
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-md border-2 p-2 ${
                      item
                        ? 'border-primary bg-background-light'
                        : 'border-background bg-background'
                    }`}
                  >
                    {item ? (
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <div className="mb-1 text-2xl">📦</div>
                        <p className="text-xs text-text">{item.name}</p>
                        {onItemUse && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => onItemUse(item.id)}
                          >
                            Utiliser
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-text-muted">
                        Vide
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </Card>

      {/* Armes */}
      <Card>
        <h3 className="mb-4 text-xl font-bold text-primary-light">
          ⚔️ Armes en main
        </h3>
        <p className="mb-4 text-sm text-text-muted">
          {character.weapons.length} / {GAME_CONSTANTS.MAX_WEAPON_SLOTS} armes
        </p>

        {character.weapons.length === 0 ? (
          <p className="text-center text-text-muted">Aucune arme</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {character.weapons.map((weapon, index) => (
              <div
                key={index}
                className={`rounded-md border-2 p-4 ${
                  character.weaponInHand === weapon.name
                    ? 'border-green-500 bg-green-900/20'
                    : 'border-primary bg-background-light'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold text-text">{weapon.name}</span>
                  {character.weaponInHand === weapon.name && (
                    <span className="text-xs text-green-400">✓ Équipée</span>
                  )}
                </div>
                {weapon.skill && (
                  <p className="mb-2 text-xs text-text-muted">
                    Type : {weapon.skill}
                  </p>
                )}
                {weapon.skill === character.masteredWeapon && (
                  <p className="mb-2 text-xs text-green-400">⭐ Maîtrisée</p>
                )}
                {onWeaponEquip && character.weaponInHand !== weapon.name && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => onWeaponEquip(weapon.name)}
                  >
                    Équiper
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Objets spéciaux */}
      <Card>
        <h3 className="mb-4 text-xl font-bold text-primary-light">
          ✨ Objets spéciaux
        </h3>
        <p className="mb-4 text-sm text-text-muted">
          Poids : {totalSpecialWeight} / {GAME_CONSTANTS.MAX_SPECIAL_WEIGHT}
        </p>

        {character.specialItems.length === 0 ? (
          <p className="text-center text-text-muted">Aucun objet spécial</p>
        ) : (
          <div className="space-y-3">
            {character.specialItems.map((item, index) => (
              <div
                key={index}
                className="rounded-md border-2 border-primary bg-background-light p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-text">{item.name}</h4>
                    {item.description && (
                      <p className="mt-1 text-sm text-text-muted">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-2 flex gap-3 text-xs">
                      <span className="text-text-muted">
                        Poids : {item.weight}
                      </span>
                      {item.type === 'arme' && (
                        <span className="text-yellow-400">⚔️ Arme</span>
                      )}
                      {item.habi > 0 && (
                        <span className="text-green-400">+{item.habi} HAB</span>
                      )}
                      {item.endu > 0 && (
                        <span className="text-blue-400">+{item.endu} END</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}