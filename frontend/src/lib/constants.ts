export const GAME_CONSTANTS = {
  MAX_BACKPACK_SLOTS: 8,
  MAX_WEAPON_SLOTS: 2,
  MAX_SPECIAL_WEIGHT: 10,
  MAX_GOLD: 50,
  
  DEFAULT_SKILL: 10,
  DEFAULT_ENDURANCE: 20,
  
  DISCIPLINES: [
    'Camouflage',
    'La Chasse',
    'Sixième Sens',
    'Orientation',
    'Guérison',
    'Maîtrise des Armes',
    'Puissance Psychique',
    'Bouclier Psychique',
    'Maîtrise Psychique de la Matière',
    'Communication Animale',
  ] as const,
  
  WEAPON_TYPES: [
    'Épée',
    'Hache',
    'Lance',
    'Masse d\'Armes',
    'Arc',
    'Dague',
    'Bâton',
    'Marteau de Guerre',
    'Glaive',
  ] as const,
} as const;