export type DisciplineName =
  | 'Camouflage'
  | 'La Chasse'
  | 'Sixième Sens'
  | 'Orientation'
  | 'Guérison'
  | 'Maîtrise des Armes'
  | 'Puissance Psychique'
  | 'Bouclier Psychique'
  | 'Maîtrise Psychique de la Matière'
  | 'Communication Animale';

export interface Discipline {
  name: DisciplineName;
  description: string;
  icon: string;
  type: 'passive' | 'active' | 'combat';
  effects: string[];
}

export const DISCIPLINES: Record<DisciplineName, Discipline> = {
  Camouflage: {
    name: 'Camouflage',
    description:
      'Cette discipline vous permet de vous fondre dans votre environnement et de vous déplacer sans être détecté.',
    icon: '🌿',
    type: 'active',
    effects: [
      'Éviter certains combats',
      'Passer inaperçu dans certaines situations',
      'Détecter les embuscades',
    ],
  },

  'La Chasse': {
    name: 'La Chasse',
    description:
      'Vous pouvez chasser et trouver de la nourriture dans la nature.',
    icon: '🏹',
    type: 'passive',
    effects: [
      'Ne jamais perdre de points d\'Endurance pour avoir sauté un repas',
      'Repas gratuits',
      'Trouver de la nourriture dans la nature',
    ],
  },

  'Sixième Sens': {
    name: 'Sixième Sens',
    description:
      'Cette discipline vous avertit du danger imminent et vous permet d\'éviter les pièges.',
    icon: '👁️',
    type: 'passive',
    effects: [
      'Détecter les pièges avant qu\'ils ne se déclenchent',
      'Pressentir le danger',
      'Éviter certaines embuscades',
    ],
  },

  Orientation: {
    name: 'Orientation',
    description:
      'Vous ne vous perdez jamais et savez toujours trouver votre chemin.',
    icon: '🧭',
    type: 'passive',
    effects: [
      'Toujours trouver le bon chemin',
      'Éviter de se perdre',
      'Raccourcis disponibles',
    ],
  },

  Guérison: {
    name: 'Guérison',
    description:
      'Vous pouvez restaurer 1 point d\'Endurance après chaque combat.',
    icon: '💚',
    type: 'passive',
    effects: [
      '+1 point d\'Endurance après chaque combat',
      'Guérison naturelle accélérée',
      'Résistance accrue aux maladies',
    ],
  },

  'Maîtrise des Armes': {
    name: 'Maîtrise des Armes',
    description:
      'Vous avez maîtrisé une arme. Lorsque vous la tenez en main, vous ajoutez 2 points à votre total d\'Habileté.',
    icon: '⚔️',
    type: 'combat',
    effects: [
      '+2 points d\'Habileté avec l\'arme maîtrisée',
      'Bonus de combat permanent',
      'Expertise au combat',
    ],
  },

  'Puissance Psychique': {
    name: 'Puissance Psychique',
    description:
      'Vous pouvez attaquer un ennemi en utilisant votre force psychique. Vous ajoutez 2 points à votre total d\'Habileté lors d\'un combat contre une créature sensible à ce type d\'attaque.',
    icon: '⚡',
    type: 'combat',
    effects: [
      '+2 points d\'Habileté contre les créatures sensibles',
      'Attaque psychique',
      'Détection des créatures sensibles',
    ],
  },

  'Bouclier Psychique': {
    name: 'Bouclier Psychique',
    description:
      'Cette discipline vous protège contre les attaques psychiques des ennemis.',
    icon: '🛡️',
    type: 'passive',
    effects: [
      'Immunité aux attaques psychiques',
      'Protection mentale',
      'Résistance aux illusions',
    ],
  },

  'Maîtrise Psychique de la Matière': {
    name: 'Maîtrise Psychique de la Matière',
    description:
      'Cette discipline vous permet de déplacer de petits objets par la pensée.',
    icon: '🔮',
    type: 'active',
    effects: [
      'Déplacer des objets à distance',
      'Ouvrir des portes verrouillées',
      'Résoudre certaines énigmes',
    ],
  },

  'Communication Animale': {
    name: 'Communication Animale',
    description:
      'Vous pouvez communiquer avec les animaux et comprendre leurs intentions.',
    icon: '🦊',
    type: 'active',
    effects: [
      'Parler avec les animaux',
      'Calmer les animaux hostiles',
      'Obtenir des informations des animaux',
    ],
  },
};

/**
 * Vérifier si un personnage possède une discipline
 */
export function hasDiscipline(
  disciplines: string[],
  disciplineName: DisciplineName
): boolean {
  return disciplines.includes(disciplineName);
}

/**
 * Obtenir le bonus d'Habileté total d'un personnage
 */
export function getSkillBonus(
  disciplines: string[],
  masteredWeapon?: string,
  weaponInHand?: string,
  isPsychicEnemy?: boolean
): number {
  let bonus = 0;

  // Maîtrise des Armes
  if (
    hasDiscipline(disciplines, 'Maîtrise des Armes') &&
    masteredWeapon &&
    weaponInHand &&
    masteredWeapon === weaponInHand
  ) {
    bonus += 2;
  }

  // Puissance Psychique
  if (
    hasDiscipline(disciplines, 'Puissance Psychique') &&
    isPsychicEnemy
  ) {
    bonus += 2;
  }

  return bonus;
}

/**
 * Appliquer la guérison après combat
 */
export function applyHealingAfterCombat(
  disciplines: string[],
  currentEndurance: number,
  maxEndurance: number
): number {
  if (hasDiscipline(disciplines, 'Guérison')) {
    return Math.min(currentEndurance + 1, maxEndurance);
  }
  return currentEndurance;
}

/**
 * Vérifier si le personnage peut manger gratuitement (La Chasse)
 */
export function canHuntFood(disciplines: string[]): boolean {
  return hasDiscipline(disciplines, 'La Chasse');
}