import { type ReactElement } from 'react';

import { Badge } from '@/components/Badge';

export type ChangeType = 'new' | 'improved' | 'fixed';

export interface ReleaseChange {
  type: ChangeType;
  text: string;
}

export interface ReleaseNote {
  version: string;
  date: string;
  changes: ReleaseChange[];
}

export interface ReleaseNotesProps {
  notes: ReleaseNote[];
  className?: string;
}

const BADGE_VARIANT = {
  new: 'success',
  improved: 'info',
  fixed: 'warning',
} as const satisfies Record<ChangeType, 'success' | 'info' | 'warning'>;

const BADGE_LABEL: Record<ChangeType, string> = {
  new: 'New',
  improved: 'Improved',
  fixed: 'Fix',
};

function sortBySemverDesc(notes: ReleaseNote[]): ReleaseNote[] {
  return [...notes].sort((a, b) => {
    const aParts = a.version.split('.').map(Number);
    const bParts = b.version.split('.').map(Number);
    for (let i = 0; i < 3; i += 1) {
      const diff = (bParts[i] ?? 0) - (aParts[i] ?? 0);
      if (diff !== 0) return diff;
    }
    return 0;
  });
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}

export function ReleaseNotes({ notes, className = '' }: ReleaseNotesProps): ReactElement {
  const sorted = sortBySemverDesc(notes);

  return (
    <div className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}>
      {sorted.length > 0 && (
        <p className="text-xs uppercase tracking-[1.2px] text-neutral-600 font-normal">
          Release Notes
        </p>
      )}
      {sorted.map((note) => (
        <div key={note.version} className="flex flex-col gap-3">
          <div>
            <h3 className="text-sm font-semibold text-neutral-800">{note.version}</h3>
            <time dateTime={note.date} className="text-xs text-neutral-600">
              {formatDate(note.date)}
            </time>
          </div>
          <ul className="flex flex-col gap-3">
            {note.changes.map((change) => (
              <li key={`${change.type}:${change.text}`} className="flex gap-3 items-start">
                <Badge variant={BADGE_VARIANT[change.type]}>{BADGE_LABEL[change.type]}</Badge>
                <span className="text-sm text-neutral-800">{change.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
