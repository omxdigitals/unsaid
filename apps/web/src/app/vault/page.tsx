'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ThoughtMetadata } from '@unsaid/types';
import { Shell } from '@/components/Shell';
import { UnlockGate } from '@/components/UnlockGate';
import { useVault } from '@/lib/vault';
import { listThoughts } from '@/lib/thoughts';
import { VaultSearch } from '@/components/VaultSearch';

/**
 * The vault timeline. Blueprint §11.4.
 *
 * Note what a row can show: a date, a kind, and a size. Titles and previews
 * would require the server to hold something readable, so there are none — the
 * absence of a preview is the privacy model made visible.
 */
export default function VaultPage() {
  return (
    <Shell screen="vault">
      <UnlockGate>
        <VaultList />
      </UnlockGate>
    </Shell>
  );
}

function VaultList() {
  const { token, key } = useVault();
  const [thoughts, setThoughts] = useState<ThoughtMetadata[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    listThoughts(token)
      .then(setThoughts)
      .catch(() => setError('Your vault could not be loaded right now.'));
  }, [token]);

  if (error) return <p role="alert" className="py-16 text-sm text-ember">{error}</p>;
  if (!thoughts) return <p className="py-16 text-sm text-ink-faint">Opening your vault…</p>;

  if (thoughts.length === 0) {
    return (
      <div className="flex flex-1 flex-col justify-center py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Nothing here yet.</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Whatever you keep will appear here, readable only on a device holding your phrase.
        </p>
        <Link href="/app" className="mt-8 self-start rounded-full bg-ink px-6 py-3 text-paper hover:opacity-90">
          Say something
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Your vault</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {thoughts.length} {thoughts.length === 1 ? 'memory' : 'memories'}, encrypted.
      </p>

      {token && key && <VaultSearch thoughts={thoughts} token={token} vaultKey={key} />}

      {/* Grouped by month, each with its own "edition" header. Still no previews. */}
      <div className="mt-8 flex flex-col gap-10">
        {byMonth(thoughts).map(([month, items]) => (
          <section key={month}>
            <h2 className="flex items-baseline justify-between border-b-[3px] border-rule pb-2">
              <span className="font-display text-xl font-bold text-ink">{month}</span>
              <span className="kicker !text-ink-faint">
                {items.length} {items.length === 1 ? 'entry' : 'entries'}
              </span>
            </h2>
            <ul className="divide-y divide-line">
              {items.map((thought) => (
                <li key={thought.id}>
                  <Link
                    href={`/vault/${thought.id}`}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="w-8 font-display text-2xl font-black text-brand-display">
                        {new Date(thought.createdAt).getDate()}
                      </span>
                      <span className="text-ink group-hover:text-brand-strong">
                        {new Date(thought.createdAt).toLocaleDateString(undefined, {
                          weekday: 'long',
                        })}
                      </span>
                    </span>
                    <span className="flex items-center gap-2 text-xs text-ink-faint">
                      <span className="rounded-full border border-line px-2 py-0.5">
                        {thought.type === 'audio' ? 'Voice' : 'Written'}
                      </span>
                      {new Date(thought.createdAt).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

/** Newest month first, keeping the list's own order inside each month. */
function byMonth(thoughts: ThoughtMetadata[]): [string, ThoughtMetadata[]][] {
  const groups = new Map<string, ThoughtMetadata[]>();
  for (const thought of thoughts) {
    const month = new Date(thought.createdAt).toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    });
    const group = groups.get(month);
    if (group) group.push(thought);
    else groups.set(month, [thought]);
  }
  return [...groups];
}
