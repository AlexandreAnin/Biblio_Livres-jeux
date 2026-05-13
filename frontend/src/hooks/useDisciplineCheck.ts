import { DisciplineName } from '@/lib/disciplines';
import type { Character } from '@/types/character';

export function useDisciplineCheck(character: Character | null) {
  const hasDiscipline = (discipline: DisciplineName): boolean => {
    if (!character) return false;
    return character.disciplines.includes(discipline);
  };

  const hasItem = (itemName: string): boolean => {
    if (!character) return false;
    
    return (
      character.backpack.some((item) => item.name === itemName) ||
      character.weapons.some((weapon) => weapon.name === itemName) ||
      character.specialItems.some((item) => item.name === itemName)
    );
  };

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const canAvoidCombat = (passage: any): boolean => {
    if (!character) return false;
    
    // Camouflage peut éviter certains combats
    if (hasDiscipline('Camouflage') && passage.avoidableWithCamouflage) {
      return true;
    }
    
    // Sixième Sens peut détecter les embuscades
    if (hasDiscipline('Sixième Sens') && passage.avoidableWithSixthSense) {
      return true;
    }
    
    return false;
  };

  const getSkillModifier = (): number => {
    if (!character) return 0;
    
    let modifier = 0;
    
    // Maîtrise des Armes
    if (
      hasDiscipline('Maîtrise des Armes') &&
      character.masteredWeapon &&
      character.weaponInHand === character.masteredWeapon
    ) {
      modifier += 2;
    }
    
    return modifier;
  };

  return {
    hasDiscipline,
    hasItem,
    canAvoidCombat,
    getSkillModifier,
  };
}