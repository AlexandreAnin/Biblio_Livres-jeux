'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { randomNumber } from '@/lib/utils';
import { getCombatDamage } from '@/lib/combatTable';
import { getSkillBonus, applyHealingAfterCombat } from '@/lib/disciplines';

interface CombatProps {
  playerSkill: number;
  playerEndurance: number;
  playerEnduranceMax: number;
  enemyName: string;
  enemySkill: number;
  enemyEndurance: number;
  enemyEnduranceMax: number;
  isPsychic?: boolean;
  hasPsychicPower?: boolean;
  canFlee?: boolean;
  playerDisciplines: string[];
  masteredWeapon?: string;
  weaponInHand?: string;
  onFlee?: () => void;
  onVictory?: (remainingEndurance: number) => void;
  onDefeat?: () => void;
  onUpdate?: (playerEndurance: number, enemyEndurance: number) => void;
}

export default function Combat({
  playerSkill,
  playerDisciplines,
  masteredWeapon,
  weaponInHand,
  playerEndurance: initialPlayerEndurance,
  playerEnduranceMax,
  enemyName,
  enemySkill,
  enemyEndurance: initialEnemyEndurance,
  enemyEnduranceMax,
  isPsychic = false,
  hasPsychicPower = false,
  canFlee = true,
  onFlee,
  onVictory,
  onDefeat,
  onUpdate,
}: CombatProps) {
  const [playerEndurance, setPlayerEndurance] = useState(initialPlayerEndurance);
  const [enemyEndurance, setEnemyEndurance] = useState(initialEnemyEndurance);
  const [roundNumber, setRoundNumber] = useState(0);
  const [lastRoundResult, setLastRoundResult] = useState<{
    diceRoll: number;
    playerDamage: number;
    enemyDamage: number;
    quotient: number;
  } | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const skillBonus = getSkillBonus(
    playerDisciplines,
    masteredWeapon,
    weaponInHand,
    isPsychic
  );

  // Calculer le quotient d'attaque (avec bonus psychique)
  const effectivePlayerSkill = playerSkill + skillBonus;

  
  const quotient = effectivePlayerSkill - enemySkill;

  const playerEndurancePercent = Math.round(
    (playerEndurance / playerEnduranceMax) * 100
  );
  const enemyEndurancePercent = Math.round(
    (enemyEndurance / enemyEnduranceMax) * 100
  );

  // Vérifier automatiquement la fin du combat
  useEffect(() => {
    if (playerEndurance <= 0 && onDefeat) {
      setTimeout(() => onDefeat(), 1500);
    } else if (enemyEndurance <= 0 && onVictory) {
      setTimeout(() => onVictory(playerEndurance), 1500);
    }
  }, [playerEndurance, enemyEndurance, onVictory, onDefeat]);

  // Notifier les changements d'endurance
  useEffect(() => {
    if (onUpdate) {
      onUpdate(playerEndurance, enemyEndurance);
    }
  }, [playerEndurance, enemyEndurance, onUpdate]);

  const handleAttack = () => {
    if (isProcessing || playerEndurance <= 0 || enemyEndurance <= 0) {
      return;
    }

    setIsProcessing(true);

    // Lancer le dé
    const diceRoll = randomNumber(0, 9);
    
    // Obtenir les dégâts depuis la table
    const [enemyDamage, playerDamage] = getCombatDamage(quotient, diceRoll);

    // Calculer les nouvelles endurances
    const newPlayerEndurance = Math.max(0, playerEndurance - playerDamage);
    const newEnemyEndurance = Math.max(0, enemyEndurance - enemyDamage);

    // Mettre à jour l'état
    setPlayerEndurance(newPlayerEndurance);
    setEnemyEndurance(newEnemyEndurance);
    setRoundNumber(roundNumber + 1);
    setLastRoundResult({ 
      diceRoll, 
      playerDamage, 
      enemyDamage,
      quotient 
    });

    // Ajouter au log
    const logEntry = `Assaut ${roundNumber + 1} - QA: ${quotient >= 0 ? '+' : ''}${quotient} | Dé: ${diceRoll} | Vous: -${playerDamage} END | ${enemyName}: -${enemyDamage} END`;
    setCombatLog([logEntry, ...combatLog]);

    setTimeout(() => setIsProcessing(false), 500);
  };

  const handleFlee = () => {
    if (!canFlee || isProcessing) return;

    setIsProcessing(true);

    // Subir un assaut en fuyant
    const diceRoll = randomNumber(0, 9);
    const [, playerDamage] = getCombatDamage(quotient, diceRoll);
    
    const newPlayerEndurance = Math.max(0, playerEndurance - playerDamage);
    setPlayerEndurance(newPlayerEndurance);

    const logEntry = `Fuite - Vous subissez -${playerDamage} END`;
    setCombatLog([logEntry, ...combatLog]);

    if (newPlayerEndurance <= 0 && onDefeat) {
      setTimeout(() => onDefeat(), 1000);
    } else if (onFlee) {
      setTimeout(() => onFlee(), 1000);
    }
  };

  // Dans handleVictory, appliquer la guérison
  /*const handleCombatVictory = (remainingEndurance: number) => {
    const healedEndurance = applyHealingAfterCombat(
      playerDisciplines,
      remainingEndurance,
      playerEnduranceMax
    );
    
    if (healedEndurance > remainingEndurance) {
      toast.success('+1 Endurance (Guérison)');
    }
    
    onVictory?.(healedEndurance);
  };*/

  const isGameOver = playerEndurance <= 0 || enemyEndurance <= 0;

  return (
    <Card>
      <h2 className="mb-6 text-center text-2xl font-bold text-red-400">
        ⚔️ COMBAT
      </h2>

      {/* Bonus psychique */}
      {isPsychic && hasPsychicPower && (
        <div className="mb-4 rounded-lg border-2 border-purple-600 bg-purple-900/20 p-3 text-center">
          <p className="text-sm text-purple-400">
            ⚡ Puissance Psychique active : +2 Habileté
          </p>
        </div>
      )}

      {/* Afficher les bonus actifs */}
      {skillBonus > 0 && (
        <div className="mb-4 rounded-lg border-2 border-green-600 bg-green-900/20 p-3">
          <p className="text-center text-sm text-green-400">
            {masteredWeapon && weaponInHand === masteredWeapon && (
              <span>⚔️ Maîtrise des Armes : +2 Habileté</span>
            )}
            {isPsychic && playerDisciplines.includes('Puissance Psychique') && (
              <span className="ml-2">
                ⚡ Puissance Psychique : +2 Habileté
              </span>
            )}
          </p>
        </div>
      )}

      {/* Statistiques du combat */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {/* Joueur */}
        <div className="rounded-lg border-2 border-green-600 bg-green-900/20 p-4">
          <h3 className="mb-2 text-lg font-bold text-green-400">
            🛡️ Vous
          </h3>
          <p className="mb-1 text-sm text-text">
            Habileté : {effectivePlayerSkill}
            {isPsychic && hasPsychicPower && (
              <span className="text-purple-400"> (+2)</span>
            )}
          </p>
          <p className="mb-2 text-sm text-text">
            Endurance : {playerEndurance} / {playerEnduranceMax}
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-background">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${playerEndurancePercent}%` }}
            />
          </div>
        </div>

        {/* Ennemi */}
        <div className="rounded-lg border-2 border-red-600 bg-red-900/20 p-4">
          <h3 className="mb-2 text-lg font-bold text-red-400">
            👹 {enemyName}
          </h3>
          <p className="mb-1 text-sm text-text">Habileté : {enemySkill}</p>
          <p className="mb-2 text-sm text-text">
            Endurance : {enemyEndurance} / {enemyEnduranceMax}
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-background">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${enemyEndurancePercent}%` }}
            />
          </div>
          {isPsychic && (
            <p className="mt-2 text-xs text-purple-400">
              ⚡ Sensible à la Puissance Psychique
            </p>
          )}
        </div>
      </div>

      {/* Informations du combat */}
      <div className="mb-6 rounded-lg bg-background-light p-4">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-text-muted">Assaut n°</span>
          <span className="font-bold text-text">{roundNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Quotient d&apos;attaque</span>
          <span
            className={`font-bold ${
              quotient >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {quotient >= 0 ? '+' : ''}
            {quotient}
          </span>
        </div>
      </div>

      {/* Résultat du dernier assaut */}
      {lastRoundResult && (
        <div className="mb-6 rounded-lg border-2 border-primary bg-background-light p-4">
          <h4 className="mb-3 text-center font-bold text-primary-light">
            Résultat de l&apos;assaut #{roundNumber}
          </h4>
          <div className="mb-3 flex items-center justify-center gap-4">
            <div className="text-sm text-text-muted">
              QA: {lastRoundResult.quotient >= 0 ? '+' : ''}
              {lastRoundResult.quotient}
            </div>
            <div className="text-4xl">🎲</div>
            <div className="text-4xl font-bold text-primary-light">
              {lastRoundResult.diceRoll}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-text-muted">Vous perdez</p>
              <p
                className={`text-2xl font-bold ${
                  lastRoundResult.playerDamage > 0
                    ? 'text-red-400'
                    : 'text-green-400'
                }`}
              >
                {lastRoundResult.playerDamage}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-muted">{enemyName} perd</p>
              <p
                className={`text-2xl font-bold ${
                  lastRoundResult.enemyDamage > 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {lastRoundResult.enemyDamage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {!isGameOver && (
        <div className="mb-6 flex gap-4">
          <Button 
            className="flex-1" 
            onClick={handleAttack}
            disabled={isProcessing}
            isLoading={isProcessing}
          >
            ⚔️ Attaquer
          </Button>
          {canFlee && (
            <Button 
              variant="secondary" 
              className="flex-1" 
              onClick={handleFlee}
              disabled={isProcessing}
            >
              🏃 Fuir
            </Button>
          )}
        </div>
      )}

      {/* Résultat du combat */}
      {isGameOver && (
        <div className={`mb-6 rounded-lg border-2 p-6 text-center ${
          enemyEndurance <= 0 
            ? 'border-green-600 bg-green-900/20' 
            : 'border-red-600 bg-red-900/20'
        }`}>
          {enemyEndurance <= 0 ? (
            <>
              <p className="mb-2 text-3xl">🏆</p>
              <p className="text-2xl font-bold text-green-400">Victoire !</p>
              <p className="mt-2 text-sm text-text-muted">
                Vous avez vaincu {enemyName}
              </p>
              <p className="mt-1 text-sm text-green-400">
                Endurance restante : {playerEndurance}/{playerEnduranceMax}
              </p>
            </>
          ) : (
            <>
              <p className="mb-2 text-3xl">💀</p>
              <p className="text-2xl font-bold text-red-400">Défaite...</p>
              <p className="mt-2 text-sm text-text-muted">
                Vous avez été vaincu par {enemyName}
              </p>
            </>
          )}
        </div>
      )}

      {/* Log de combat */}
      {combatLog.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-bold text-text-muted">
            📜 Historique du combat
          </h4>
          <div className="max-h-40 overflow-y-auto rounded-md bg-background p-3 font-mono">
            {combatLog.map((log, index) => (
              <p key={index} className="mb-1 text-xs text-text-muted">
                {log}
              </p>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}