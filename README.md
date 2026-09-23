# prep

A small, static interview notebook for System design, Data Eng, Coding, AI / ML, and Behavioral / Leadership.

## Current scope

- Fixed desktop sidebar and sticky global search.
- Search matches titles, section names, aliases, and note content. Enter opens the first result; arrow keys choose another result; Escape closes the results.
- Use Command/Ctrl + K or `/` to focus search.
- Responsive mobile navigation with keyboard focus handling.
- A compact Rate limiter revision guide with algorithm comparisons, five syntax-highlighted Java implementations, distributed Redis design, responsive architecture diagrams, Staff+ deep dives, failure decisions, and an interview-ready answer.
- A full 19-part Kafka architect guide covering the problem, 100M events/sec capacity math, architecture, multi-tenant isolation, burst handling, quotas, sizing, failures, DR, schemas, replay, control plane, follow-ups, and the architect answer.
- A Streaming Staff+ guide index linking to the complete interactive 120-question revision bank across architecture, correctness, state, resilience, operations, governance, leadership, and incident scenarios.
- Sticky vertical in-page navigation on desktop for detailed guides, with horizontally scrollable navigation on mobile.
- A Coding patterns guide with recognition cues and ten click-to-open Java 17 templates.
- System design outlines for Leaderboard and Reservation system.
- Coding and Behavioral / Leadership are empty, ready for the owner's topic lists.
- Topic content and section-specific page components will be defined next.

## Run locally

Use Node.js 22 or later. There are no npm dependencies to install.

```sh
npm run dev
```

Open http://127.0.0.1:4173. The server also serves `/prep/` for testing GitHub Pages paths.

```sh
npm test
```

## Content and structure

- `dist/content.js` is the single source for sections, topics, search keywords, and notes.
- `dist/app.js` renders the library, section lists, and topic pages.
- `dist/search.js` handles matching and ranking.
- `dist/rate-limiter-code.js` contains the five Java examples shown in the side panel.
- `dist/java-highlight.js` provides dependency-free Java syntax highlighting.
- `dist/coding-pattern-code.js` contains the Java templates for coding patterns.
- `dist/kafka-content.js` contains the full Kafka architect interview guide.
- `dist/styles.css` controls the shared layout and responsive design.

Add a topic to `topics` in `dist/content.js` using a unique URL-safe ID and one of the existing section IDs: `system-design`, `coding`, or `behavioral`. Navigation and search update automatically. Leave `blocks` empty to display an outline. The initial renderer accepts optional blocks with a `heading`, `text`, and `bullets`; these are only a minimal extension point, not the final section-specific page format. Text is escaped before rendering.

Hash-based routes (for example `#/topic/rate-limiter`) allow direct links and refreshes on GitHub Pages without server redirects. All asset paths are relative, including under `/prep/`.

## GitHub Pages

Target repository: https://github.com/pranavnandedkar/prep

When the notebook is ready to publish:

1. In the repository, set **Settings → Pages → Source** to **GitHub Actions**.
2. Push to `main` or run the Pages workflow manually.
3. The workflow runs the search tests and publishes `dist/`.

The expected site address is https://pranavnandedkar.github.io/prep/ after a successful deployment. The skeleton has not been pushed or deployed yet.

Workflow reference: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

The interface uses Google Fonts with system-font fallbacks; content and search run entirely in the browser with no backend.
