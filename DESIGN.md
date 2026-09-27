# Space Monsters — design system

Un piccolo cabinato arcade nello spazio: leggibile, energico e immediato, con grafica a pixel originale. Il gioco occupa il centro della pagina e non è nascosto dietro una landing page.

## Colori

Tutti definiti in `src/app/globals.css`. L'interfaccia è sempre scura, anche se il sistema operativo preferisce il tema chiaro.

| Token | Valore | Uso |
| --- | --- | --- |
| `--background` | `#080e1c` | spazio esterno |
| `--foreground` | `#e8f7f5` | testo principale |
| `--card` | `#101b2e` | pannelli |
| `--primary` | `#b4f45b` | azione principale, navicella, vittoria |
| `--accent` | `#65e6e3` | dettagli, laser, accenti |
| `--muted` | `#17243a` | controlli secondari |
| `--muted-foreground` | `#94a9bd` | testo ausiliario |
| `--border` | `#344d60` | bordi e separatori |
| `--destructive` | `#ff6b89` | collisioni e sconfitta |
| `--monster-a`, `--monster-b`, `--monster-c` | `#ffcc70`, `#f989bb`, `#9b91ff` | tre file di mostri |
| `--star` | `#607a98` | stelle discrete |

Gli altri token shadcn (`--secondary`, `--ring`, ecc.) sono derivati dalla stessa tavolozza. Il canvas legge questi token via CSS: mai duplicare i colori nel codice del gioco. `.dark` usa la stessa tavolozza.

## Caratteri

- Titoli, punteggio e pulsanti: **Press Start 2P**, caricato con `next/font/google` come `--font-pixel`.
- Testi e istruzioni: **Space Mono**, caricato con `next/font/google` come `--font-body`.
- Scala: titoli `text-xl` / `text-3xl` su schermi larghi; testo `text-sm` / `text-base`; etichette `text-xs`. Valori riutilizzabili nel tema, non dimensioni casuali nei componenti.

## Forma e spazio

- `--radius: 0rem`: bordi squadrati, come un cabinato.
- Contenuto centrato, massimo `70rem`; padding laterale responsivo.
- Ritmo di spazio: `4 / 8 / 16 / 24 / 32` pixel.
- Canvas a risoluzione logica fissa, scalato senza sfocature (`image-rendering: pixelated`).
- Pulsanti shadcn/ui per le azioni; zona di gioco disegnata in canvas, non con componenti UI.

## Voce

Frasi brevi, concrete, tradotte integralmente in italiano e inglese. Tono da cabinato: «PRONTO?», «VITTORIA», «RIPROVA»; le istruzioni devono restare comprensibili.

## Regole

- Colori, font e raggi mai hardcoded nei componenti: usare token del tema. La preview Open Graph è l'eccezione tecnica: la generazione dell'immagine non può leggere il CSS del browser.
- Nessun aspetto che richieda una risorsa grafica esterna per funzionare.
- Nessuna UI per funzionalità non presenti: account, classifiche, livelli e acquisti non esistono.
