import { type ComponentType, type ReactElement, type ReactNode } from 'react';

import { Cog, Shield, Sparkles, Wrench, type LucideProps } from 'lucide-react';

export type ReleaseNoteCategory = 'feature' | 'security' | 'ui' | 'bugfix';

export interface ReleaseNoteItem {
  category: ReleaseNoteCategory;
  title: string;
  description: string;
  /**
   * Optional icon hint from the server. Currently informational only —
   * rendering uses `category` to look up the icon. Reserved for future use
   * (e.g. a server-supplied custom icon name).
   */
  icon?: string;
}

export interface ReleaseNotesProps {
  notes: ReleaseNoteItem[];
  className?: string;
}

// Human-readable label per category (used for icon aria-labels).
const CATEGORY_LABEL: Record<ReleaseNoteCategory, string> = {
  feature: 'Feature',
  security: 'Security',
  ui: 'UI',
  bugfix: 'Bug fix',
};

// Tailwind utility class for the icon tint per category.
const CATEGORY_TINT: Record<ReleaseNoteCategory, string> = {
  feature: 'text-blue-600',
  security: 'text-rose-600',
  ui: 'text-violet-600',
  bugfix: 'text-amber-600',
};

// Category → lucide-react icon component. Ticket mapping:
// feature → gear (Cog), security → Shield, ui → Sparkles, bugfix → Wrench.
const CATEGORY_ICON: Record<ReleaseNoteCategory, ComponentType<LucideProps>> = {
  feature: Cog,
  security: Shield,
  ui: Sparkles,
  bugfix: Wrench,
};

/**
 * Render a subset of markdown (bold + http/https links) inside a description string.
 * Returns React nodes — never HTML strings — so we avoid dangerouslySetInnerHTML
 * and the security skill's XSS concerns. Links with non-http(s) schemes fall back
 * to plain text on purpose.
 */
function renderDescription(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null = re.exec(text);
  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(
        <strong key={`s-${key}`} className="font-semibold">
          {match[1]}
        </strong>,
      );
    } else if (match[2] && match[3]) {
      parts.push(
        <a
          key={`a-${key}`}
          href={match[3]}
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {match[2]}
        </a>,
      );
    }
    key += 1;
    lastIndex = re.lastIndex;
    match = re.exec(text);
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function ReleaseNotes({ notes, className = '' }: ReleaseNotesProps): ReactElement | null {
  if (notes.length === 0) return null;

  const isScrollable = notes.length > 3;
  const listClasses = [
    'flex flex-col gap-4',
    isScrollable ? 'max-h-72 overflow-y-auto pr-1' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = ['flex flex-col gap-3', className].filter(Boolean).join(' ');

  return (
    <section className={containerClasses}>
      <p className="text-xs uppercase tracking-[1.2px] text-neutral-600">Release Notes</p>
      <ul className={listClasses}>
        {notes.map((note, index) => {
          const Icon = CATEGORY_ICON[note.category];
          return (
            <li key={`${note.category}-${index}`} className="flex gap-3 items-start">
              <span
                role="img"
                aria-label={CATEGORY_LABEL[note.category]}
                className={['mt-0.5 shrink-0', CATEGORY_TINT[note.category]].join(' ')}
              >
                <Icon size={16} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-semibold text-neutral-900">{note.title}</h4>
                <p className="text-xs text-neutral-700">{renderDescription(note.description)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
