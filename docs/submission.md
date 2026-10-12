# Colosseum submission

Two videos, one deck route each. Record the screen with the deck in
fullscreen (`F`); press `T` to start the on-screen clock and keep the clock
in the white. Both scripts read at about 150 words a minute.

What this is built against:

- **Colosseum's submission workshop** ([blog.colosseum.com](https://blog.colosseum.com/perfecting-your-hackathon-submission/)):
  pitch video at most **3 minutes**, "a brief startup pitch, not a product
  demo", covering team background, the problem, who it is for, user feedback
  "even if informal", and the vision. A separate **2–3 minute technical demo**
  covering features, stack, design decisions and how Solana is used.
  Named mistakes: going over time, flashy visuals with little substance,
  buzzwords, vague or overly technical wording, leaving out the team,
  not explaining the Solana integration.
- **Past pitches** ([3mins.fun](https://www.3mins.fun/), 452 slides across
  five cohorts): the beats run Hook → Problem → Product → Demo → Traction &
  market → Team → Vision & close. `/pitch` follows that order.

## Before you record

- [x] Team, validation link and funding are filled in
      `apps/web/src/app/pitch/data.ts`.
- [ ] Before recording, read the real numbers off
      [x.com/unsaid_privacy](https://x.com/unsaid_privacy) — followers, replies,
      anyone who asked to try it — and say them on the traction slide. If you
      have waitlist or conversation counts, add them to `VALIDATION`; blank
      fields stay hidden.
- [ ] Confirm the deadline on the Colosseum hackathon page (12 Oct 2026; no
      closing time published).
- [ ] Give judges access to everything linked in the README "For judges"
      table — repository, deployed app, videos.
- [ ] Fill the optional submission fields; skipping them is a named mistake.

## Pitch video — `/pitch` (3:00)

| Beat | Slide | Time | Say |
|---|---|---|---|
| Hook | 1 Cover | 0:00–0:15 | "Some things you can't say out loud — not to friends, not to an app. UNSAID is a private journal with an AI that can't read your secrets, and a receipt on Solana every time anything touches them." |
| Problem | 2 Plain text | 0:15–0:45 | "Type something into almost any app and it lands in a database, readable. Engineers can query it, logs copy it, backups keep it, a breach publishes it. AI makes it worse: in one week, 130 million people uploaded their faces to make Ghibli portraits — and in the consumer app, training on your chats is on unless you turn it off. 82% of chatbot users say these conversations are sensitive." |
| Product | 3 Check us | 0:45–1:00 | "So we don't ask you to trust us. We built it so you can check us: encrypted on your phone, AI inside a sealed chip, and a public receipt for every access." |
| Product | 4 Two worlds | 1:00–1:15 | "Same sentence, two designs. On the left it ends in a training set. On the right it ends as noise on our server and a receipt on Solana — readable only on your phone." |
| Demo | 5 Live | 1:15–1:35 | "This is the real encryption running in the browser. I type a sentence, press encrypt — this is everything our server would ever receive." |
| Demo | 6 Private AI | 1:35–1:55 | "When you ask Echo to reflect, that one memory is read inside a hardware enclave that signs which code ran. The reply comes back sealed, and a receipt with that signature lands on Solana. No content, ever." |
| Traction | 7 It runs | 1:55–2:20 | "It's live today, with our program on Solana devnet. We planted 30 secrets and searched the whole database, every file and every log: zero found. 246 tests, and CI fails if anything could store content. We build in public at x.com/unsaid_privacy — [say the real follower and reply numbers]." |
| Team | 8 Team | 2:20–2:35 | "We're three: Siddanta Sodari, full stack; Rabin Poudel, design; Sachin Rijal, backend. Between us we built the vault, the enclave path, the Solana program and the research behind it." |
| Vision | 9 Vision | 2:35–2:50 | "Every conversation with AI should come with a receipt. Next: live attested AI, batched receipts, mainnet. We're raising $72.5K for six months to a mainnet pilot: the team, a security audit, confidential inference and mainnet." |
| Close | 10 Back page | 2:50–3:00 | "Some things stay unsaid. Now they stay safe. Try it, verify it, try to break it." |

Rules for this one: no architecture words beyond "encrypted", "sealed chip"
and "receipt"; the technical video carries the rest.

## Technical demo video — `/pitch/tech` (2:50)

| Slide | Time | Show and say |
|---|---|---|
| 1 Overview | 0:00–0:15 | The four features: client-side vault, attested reflection, consent receipts, public verifier. |
| 2 Architecture | 0:15–0:40 | Browser (Next.js 16, WebCrypto) → API (Fastify, Zod) → Postgres via Drizzle + S3/MinIO, then Phala enclave and Solana. "Plaintext exists in two places: your browser, and inside the chip for one reply." |
| 3 Encryption | 0:40–1:00 | PBKDF2 600k → vault key; AES-256-GCM per memory; AES-KW wrap; +218 B. Cut to `/privacy` and press Encrypt. |
| 4 Echo | 1:00–1:25 | Step through the five beats. "We read the measurement before the call; an unattested access is recorded as a different kind of event." |
| 5 Solana | 1:25–1:55 | The `ConsentReceipt` PDA and its 212 bytes, field by field; the five instructions; 0.0017 SOL, ~1.1 s on devnet. |
| 6 Verifier | 1:55–2:10 | Cut to `/verify`; derive the PDA in the browser, read a public RPC, compare the commitment. VERIFIED stamp. |
| 7 Decisions | 2:10–2:35 | TEE not FHE; per-receipt accounts first, Merkle batching next; no content columns, enforced in CI; client-side search. |
| 8 Quality | 2:35–2:50 | 246 tests, the canary sweep, the CI gates. Point to `/research` and `docs/paper`. |

## The ask: $72.5K, six months to a mainnet pilot

Bottom-up estimates, not quotes — check them before saying the number on
camera. Source of truth: `FUNDING_LINES` in `apps/web/src/app/pitch/data.ts`
(the deck computes the total and the chart from it).

| Line | Basis | USD |
|---|---|---|
| Team runway | 3 people × $1,250/mo × 6 months | 22,500 |
| Security audit | Anchor program + client crypto review, before real users | 25,000 |
| Confidential GPU inference | Dedicated TDX + NVIDIA CC instance, ~$2/h × 6 months | 12,000 |
| Pilot & launch | User research, first 1,000 users, launch | 6,000 |
| Mainnet, RPC & receipts | Paid RPC ~$500/mo + batched receipt rent for 1,000 users (0.0017 SOL/receipt measured) | 5,000 |
| Hosting | App, API, Postgres, object storage ~$300/mo | 2,000 |
| **Total** | | **72,500** |

If a judge asks what the money is for: two thirds is people and the audit;
the rest makes the attested path and mainnet real.

## Honesty rules for both videos

- Every number on screen is labelled measured, expected, projected or survey
  (`app/pitch/data.ts`). Say it the way the label says it.
- The attested-inference round trip is not yet measured
  (`docs/paper/benchmarks.md` §8). Present the enclave flow as architecture; if
  asked, it is built and tested, and waiting on inference credit.
- Feedback and quotes must be real. A blank is better than an invented one.
