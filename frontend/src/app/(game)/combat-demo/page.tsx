'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Combat from '@/components/game/Combat';
import toast from 'react-hot-toast';

export default function CombatDemoPage() {
  const router = useRouter();
  const [combatEnded, setCombatEnded] = useState(false);

  const handleVictory = () => {
    toast.success('Vous avez gagné le combat !');
    setCombatEnded(true);
  };

  const handleDefeat = () => {
    toast.error('Vous avez été vaincu...');
    setCombatEnded(true);
  };

  const handleFlee = () => {
    toast('Vous avez fui le combat');
    router.push('/books');
  };

  if (combatEnded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-2xl text-text">Combat terminé</p>
          <button
            onClick={() => router.push('/books')}
            className="rounded-md bg-primary px-6 py-3 font-bold text-white hover:bg-primary-dark"
          >
            Retour aux livres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <Combat
            playerSkill={15}
            playerEndurance={25}
            playerEnduranceMax={25}
            enemyName="Glok"
            enemySkill={13}
            enemyEndurance={10}
            enemyEnduranceMax={10}
            canFlee={true}
            onVictory={handleVictory}
            onDefeat={handleDefeat}
            onFlee={handleFlee}
          />
        </div>
      </div>
    </div>
  );
}