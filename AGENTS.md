# Space Monsters

Gioco arcade pubblico bilingue (IT/EN), a singola ondata, giocabile con tastiera o touch. Nessun account, database, classifica o servizio esterno. Il deploy e le modifiche automatiche al repository appartengono ad altri progetti.

**Design system: leggere `DESIGN.md` prima di modificare pagine o componenti. I colori del canvas e dell'interfaccia provengono dai token in `src/app/globals.css`.**

## Stack e comandi

Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui e canvas 2D. `npm run dev`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm start`.

## Convenzioni

- Il motore del gioco è indipendente dalla UI React; lo stato della partita vive soltanto nel browser.
- Entrambe le lingue devono coprire ogni stringa visibile. Il selettore IT/EN è sempre disponibile.
- Una partita contiene una sola ondata. Non aggiungere nuovi livelli, persistenza, account o servizi senza accordo esplicito.
- Il server Playwright è configurato nel progetto per usare Microsoft Edge.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
