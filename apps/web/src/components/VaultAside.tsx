import Link from 'next/link';
import { Icon, type IconName } from './Icon';

/**
 * The desktop side panel inside the vault. On a wide screen the task column
 * would otherwise float in empty paper; this fills it with the two things a
 * person in the vault may want to glance at: what protects what they write,
 * and where the public record of access lives. Hidden below `lg`, where the
 * task needs the whole width.
 */

const GUARDS: { icon: IconName; label: string; detail: string }[] = [
  { icon: 'lock', label: 'Sealed on this device', detail: 'AES-256-GCM, a fresh key per memory' },
  { icon: 'key', label: 'Your phrase is the key', detail: 'PBKDF2, 600,000 rounds — we never see it' },
  { icon: 'server', label: 'We hold ciphertext only', detail: 'No titles, previews or transcripts' },
];

export function VaultAside() {
  return (
    <aside aria-label="How this vault is protected" className="hidden lg:block">
      <div className="sticky top-8 flex flex-col gap-5">
        <section className="rounded-3xl border border-line bg-paper-raised p-5">
          <p className="kicker">Protection</p>
          <ul className="mt-4 flex flex-col gap-4">
            {GUARDS.map((g) => (
              <li key={g.label} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-wash text-brand-strong">
                  <Icon name={g.icon} size={18} strokeWidth={1.9} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{g.label}</span>
                  <span className="block text-xs leading-relaxed text-ink-faint">{g.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-3xl bg-night p-5 text-paper">
          <p className="kicker !text-brand">On Solana</p>
          <p className="mt-2 font-display text-lg font-bold leading-snug">
            Every access writes a content-free receipt.
          </p>
          {/* Three blocks, the newest arriving — a quiet loop, not a feed. */}
          <div aria-hidden="true" className="mt-4 flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-8 flex-1 rounded-lg border border-night-line bg-night-raised" />
            ))}
            <span className="h-8 flex-1 animate-[pulse_2.4s_ease-in-out_infinite] rounded-lg bg-brand" />
          </div>
          <Link
            href="/activity"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            See your access log
            <Icon name="arrowRight" size={15} strokeWidth={2.2} />
          </Link>
        </section>

        <p className="px-1 text-xs leading-relaxed text-ink-faint">
          UNSAID is not a crisis service. If you are in danger, contact local emergency services.
        </p>
      </div>
    </aside>
  );
}
