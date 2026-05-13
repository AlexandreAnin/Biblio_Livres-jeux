/**
 * Table des coups portés - Loup Solitaire
 * Format : [Dégâts Loup Solitaire, Dégâts Ennemi]
 * Ligne = Quotient d'Attaque (-11 à +11)
 * Colonne = Résultat du dé (0 à 9)
 */

export const COMBAT_TABLE: Record<string, [number, number][]> = {
  // Quotient d'Attaque : -11 ou moins
  '-11': [[6, 0], [0, 100], [0, 100], [0, 8], [0, 8], [1, 7], [2, 6], [3, 5], [4, 4], [5, 3]],

  // Quotient d'Attaque : -10
  '-10': [[7, 0], [0, 100], [0, 8], [0, 7], [1, 7], [2, 6], [3, 6], [4, 5], [5, 4], [6, 3]],

  // Quotient d'Attaque : -9
  '-9': [[7, 0], [0, 100], [0, 8], [0, 7], [1, 7], [2, 6], [3, 6], [4, 5], [5, 4], [6, 3]],

  // Quotient d'Attaque : -8
  '-8': [[8, 0], [0, 8], [0, 7], [1, 6], [2, 6], [3, 5], [4, 5], [5, 4], [6, 3], [7, 2]],

  // Quotient d'Attaque : -7
  '-7': [[8, 0], [0, 8], [0, 7], [1, 6], [2, 6], [3, 5], [4, 5], [5, 4], [6, 3], [7, 2]],

  // Quotient d'Attaque : -6
  '-6': [[9, 0], [0, 6], [1, 6], [2, 5], [3, 5], [4, 4], [5, 4], [6, 3], [7, 2], [8, 0]],

  // Quotient d'Attaque : -5
  '-5': [[9, 0], [0, 6], [1, 6], [2, 5], [3, 5], [4, 4], [5, 4], [6, 3], [7, 2], [8, 0]],

  // Quotient d'Attaque : -4
  '-4': [[10, 0], [1, 5], [2, 5], [3, 5], [4, 4], [5, 4], [6, 3], [7, 2], [8, 1], [9, 0]],

  // Quotient d'Attaque : -3
  '-3': [[10, 0], [1, 5], [2, 5], [3, 5], [4, 4], [5, 4], [6, 3], [7, 2], [8, 1], [9, 0]],

  // Quotient d'Attaque : -2
  '-2': [[11, 0], [2, 5], [3, 5], [4, 4], [5, 4], [6, 3], [7, 2], [8, 2], [9, 1], [10, 0]],

  // Quotient d'Attaque : -1
  '-1': [[11, 0], [2, 5], [3, 5], [4, 4], [5, 4], [6, 3], [7, 2], [8, 2], [9, 1], [10, 0]],

  // Quotient d'Attaque : 0
  '0': [[12, 0], [3, 5], [4, 4], [5, 4], [6, 3], [7, 2], [8, 2], [9, 1], [10, 0], [11, 0]],

  // Quotient d'Attaque : +1
  '1': [[14, 0], [4, 5], [5, 4], [6, 3], [7, 3], [8, 2], [9, 2], [10, 1], [11, 0], [12, 0]],

  // Quotient d'Attaque : +2
  '2': [[14, 0], [4, 5], [5, 4], [6, 3], [7, 3], [8, 2], [9, 2], [10, 1], [11, 0], [12, 0]],

  // Quotient d'Attaque : +3
  '3': [[16, 0], [5, 4], [6, 3], [7, 3], [8, 2], [9, 2], [10, 2], [11, 1], [12, 0], [14, 0]],

  // Quotient d'Attaque : +4
  '4': [[16, 0], [5, 4], [6, 3], [7, 3], [8, 2], [9, 2], [10, 2], [11, 1], [12, 0], [14, 0]],

  // Quotient d'Attaque : +5
  '5': [[18, 0], [6, 4], [7, 3], [8, 3], [9, 2], [10, 2], [11, 1], [12, 0], [14, 0], [16, 0]],

  // Quotient d'Attaque : +6
  '6': [[18, 0], [6, 4], [7, 3], [8, 3], [9, 2], [10, 2], [11, 1], [12, 0], [14, 0], [16, 0]],

  // Quotient d'Attaque : +7
  '7': [[100, 0], [7, 4], [8, 3], [9, 2], [10, 2], [11, 2], [12, 1], [14, 0], [16, 0], [18, 0]],

  // Quotient d'Attaque : +8
  '8': [[100, 0], [7, 4], [8, 3], [9, 2], [10, 2], [11, 2], [12, 1], [14, 0], [16, 0], [18, 0]],

  // Quotient d'Attaque : +9
  '9': [[100, 0], [8, 3], [9, 3], [10, 2], [11, 2], [12, 2], [14, 1], [16, 0], [18, 0], [100, 0]],

  // Quotient d'Attaque : +10
  '10': [[100, 0], [8, 3], [9, 3], [10, 2], [11, 2], [12, 2], [14, 1], [16, 0], [18, 0], [100, 0]],

  // Quotient d'Attaque : +11 ou plus
  '11': [[100, 0], [9, 3], [10, 2], [11, 2], [12, 2], [14, 1], [16, 1], [18, 0], [100, 0], [100, 0]],
};

/**
 * Obtenir les dégâts pour un quotient d'attaque et un jet de dé
 */
export function getCombatDamage(
  quotient: number,
  diceRoll: number
): [number, number] {
  // Limiter le quotient entre -11 et +11
  const limitedQuotient = Math.max(-11, Math.min(11, quotient));
  const key = limitedQuotient.toString();
  
  // Sécurité : vérifier que le diceRoll est valide (0-9)
  const validDiceRoll = Math.max(0, Math.min(9, diceRoll));
  
  return COMBAT_TABLE[key]?.[validDiceRoll] || [0, 0];
}