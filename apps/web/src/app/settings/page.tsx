'use client';

import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { UnlockGate } from '@/components/UnlockGate';
import { WalletConnect } from '@/components/WalletConnect';
import { VaultExport } from '@/components/VaultExport';
import { VaultSecurity } from '@/components/VaultSecurity';
import { useVault } from '@/lib/vault';

/**
 * Settings. The wallet lives here rather than on the home screen, so that
 * nothing about the capture path implies a wallet is needed (§11.1).
 */
export default function SettingsPage() {
  return (
    <Shell screen="settings">
      <UnlockGate>
        <SettingsScreen />
      </UnlockGate>
    </Shell>
  );
}

function SettingsScreen() {
  const { userId, lock } = useVault();

  return (
    <div className="py-2">
      <p className="kicker !text-ink-faint">Your vault, your rules</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">Settings</h1>

      <section className="mt-6 rounded-2xl border border-line bg-paper-raised p-5 sm:p-7">
        <h2 className="font-display text-xl font-bold text-ink">Take your memories with you</h2>
        <p className="mt-2 mb-5 text-sm leading-relaxed text-ink-soft">
          Everything you have written, decrypted on this device.
        </p>
        <VaultExport />
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-paper-raised p-5 sm:p-7">
        <h2 className="font-display text-xl font-bold text-ink">Your phrase and recovery kit</h2>
        <p className="mt-2 mb-5 text-sm leading-relaxed text-ink-soft">
          Change how you get in, or replace a kit you no longer trust.
        </p>
        <VaultSecurity />
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-paper-raised p-5 sm:p-7">
        <h2 className="font-display text-xl font-bold text-ink">Ownership</h2>
        <p className="mt-2 mb-5 text-sm leading-relaxed text-ink-soft">
          Optional. UNSAID works completely without this.
        </p>
        <WalletConnect />
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-paper-raised p-5 sm:p-7">
        <h2 className="font-display text-xl font-bold text-ink">Your vault</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          This is the identifier for your vault. You need it, along with your phrase, to unlock
          your memories on another device. It is not a password and it is not enough on its own.
        </p>
        <p className="mt-4 break-all rounded-xl border border-line bg-paper px-4 py-3 font-mono text-xs text-ink-soft">
          {userId}
        </p>
        <button
          type="button"
          onClick={lock}
          className="mt-5 text-sm text-ink-soft underline underline-offset-4"
        >
          Lock this vault now
        </button>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <p className="text-xs leading-relaxed text-ink-faint">
          Read{' '}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-ink-soft">
            how this actually works
          </Link>{' '}
          for what is stored, what is encrypted, and what happens when you delete.
        </p>
      </section>
    </div>
  );
}
