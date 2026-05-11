export interface Character {
  id: string;
  userId: string;
  bookId: string;
  name: string;
  
  skill: number;
  skillMax: number;
  endurance: number;
  enduranceMax: number;
  gold: number;
  
  disciplines: string[];
  masteredWeapon?: string;
  
  backpack: InventoryItem[];
  weapons: Weapon[];
  specialItems: SpecialItem[];
  pickedItems: string[];
  
  weaponInHand?: string;
  currentPassageNumber: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  name: string;
  description?: string;
  id: string;
}

export interface Weapon {
  name: string;
  description?: string;
  skill?: string;
  id: string;
}

export interface SpecialItem {
  name: string;
  description?: string;
  type: string;
  skill?: string;
  habi: number;
  endu: number;
  weight: number;
  id: string;
}