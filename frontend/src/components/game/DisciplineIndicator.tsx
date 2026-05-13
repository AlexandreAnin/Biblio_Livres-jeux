'use client';

import { DISCIPLINES, DisciplineName } from '@/lib/disciplines';
import type { Character } from '@/types/character';

interface DisciplineIndicatorProps {
  character: Character;
  relevantDisciplines?: DisciplineName[];
  compact?: boolean;
}

export default function DisciplineIndicator({
  character,
  relevantDisciplines,
  compact = false,
}: DisciplineIndicatorProps) {
  const disciplines = relevantDisciplines
    ? character.disciplines.filter((d) =>
        relevantDisciplines.includes(d as DisciplineName)
      )
    : character.disciplines;

  if (disciplines.length === 0) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {disciplines.map((disciplineName) => {
          const discipline = DISCIPLINES[disciplineName as DisciplineName];
          if (!discipline) return null;

          return (
            <div
              key={disciplineName}
              className="flex items-center gap-1 rounded-full border border-primary bg-background px-2 py-1 text-xs"
              title={discipline.description}
            >
              <span>{discipline.icon}</span>
              <span className="text-text">{discipline.name}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-primary bg-background-light p-4">
      <h4 className="mb-3 font-bold text-primary-light">
        📚 Disciplines disponibles
      </h4>
      <div className="space-y-2">
        {disciplines.map((disciplineName) => {
          const discipline = DISCIPLINES[disciplineName as DisciplineName];
          if (!discipline) return null;

          return (
            <div
              key={disciplineName}
              className="flex items-start gap-3 rounded-md bg-background p-3"
            >
              <span className="text-2xl">{discipline.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-text">{discipline.name}</p>
                <p className="text-sm text-text-muted">
                  {discipline.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}