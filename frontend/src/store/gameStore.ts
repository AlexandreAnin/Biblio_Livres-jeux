import { create } from 'zustand';
import type { Character } from '@/types/character';
import type { Passage } from '@/types/book';

interface GameState {
  currentCharacter: Character | null;
  currentPassage: Passage | null;
  
  setCharacter: (character: Character) => void;
  setPassage: (passage: Passage) => void;
  updateCharacter: (updates: Partial<Character>) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentCharacter: null,
  currentPassage: null,
  
  setCharacter: (character) => set({ currentCharacter: character }),
  
  setPassage: (passage) => set({ currentPassage: passage }),
  
  updateCharacter: (updates) =>
    set((state) => ({
      currentCharacter: state.currentCharacter
        ? { ...state.currentCharacter, ...updates }
        : null,
    })),
  
  reset: () => set({ currentCharacter: null, currentPassage: null }),
}));