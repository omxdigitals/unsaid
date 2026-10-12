import { UNSAID_PROGRAM_ID } from '@unsaid/solana';

/**
 * The deployed consent-ledger program, as a plain string for display and
 * links. Same rule as the verifier: an env override wins, otherwise the
 * address the program package was built against. Kept out of any client
 * module so server components receive the string, not a client reference.
 */
export const PROGRAM_ID: string = process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID ?? UNSAID_PROGRAM_ID;
