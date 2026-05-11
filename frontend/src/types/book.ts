export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  series?: string;
  seriesIndex?: number;
  coverImage?: string;
  description?: string;
  createdAt: string;
}

export interface Passage {
  id: string;
  bookId: string;
  number: number;
  title?: string;
  content: string;
  type: 'normal' | 'combat' | 'choice' | 'death' | 'victory';
  
  // Combat
  enemyName?: string;
  enemySkill?: number;
  enemyEndurance?: number;
  isPsychic?: boolean;
  canFlee?: boolean;
  
  choices: Choice[];
}

export interface Choice {
  id: string;
  text: string;
  targetPassageNumber: number;
}