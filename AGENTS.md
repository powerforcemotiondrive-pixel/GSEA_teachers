# ENAC GSEA English Multi-Semester Teachers Hub — AI Agent Guidelines & Architecture Rules

This repository houses the official **ENAC GSEA English Teachers Hub & Grading Portal** (`GSEA_teachers`). It serves as the master central cockpit for ENAC English teachers across all four semesters (S1, S2, S3, S4).

---

## 1. System Architecture & Invariant Rules

### A. Strict Offline Self-Containment
- **Zero External Dependencies**: The portal runs completely offline without external CDNs for scripts, fonts, icons, or stylesheets.
- **Tailwind CSS v4 Standalone**: Minified CSS is compiled locally into `output.css`.

### B. Multi-Semester Switching & Data Integrity
- Supports seamless switching across **S1**, **S2**, **S3**, and **S4**:
  - **Semester 1**: AG (LV101E) & AT (LV121E)
  - **Semester 2**: AG (LV102E) & AAS (LV122E)
  - **Semester 3**: AT (LV125E) Technical English only (AG disabled)
  - **Semester 4**: AP (Professional English) only
- Switching semesters re-binds timetables, group allocations, rota schedules, and the grading form dynamically.

### C. Mandatory Pre-Implementation Response & Approval Gate
- **No Direct Changes Without Prior Response**: ALL questions, requests, or suggested modifications from the user require a thorough review, report, and recommendation from the AI assistant **BEFORE** implementing any changes.
- **Proceed / Ignore Prompt**: Every proposal or review must conclude with an explicit prompt asking the user whether to proceed or ignore/adjust.
- **Explicit Confirmation Required**: The assistant must wait for explicit approval before modifying any codebase files.
- **Tiered On-Demand Detail Protocol (Default Ultra-Concise)**:
  - **Level 1 (Default — Ultra-Concise)**: Default to brief, 1–3 line confirmations for routine actions, builds, backups, or approvals (e.g. *"Completed for S1, S2, and S3."* or *"Proposal ready for S1, S2, S3. Ready to proceed?"*). Omit large markdown tables, diff logs, and repetitive file lists unless requested.
  - **Level 2 ("More detail" / "Expand" / "Detail")**: When requested, expand with exact file paths, size metrics, key differences, and summary tables.
  - **Level 3 ("Full detail" / "Deep dive")**: Full technical breakdowns, line diffs, architectural analyses, and test logs.
  - **Explicit User Directives**: Strictly follow user directives requesting custom detail levels (e.g. *"brief"*, *"summary only"*, *"detailed"*).

### D. Automatic Atomic Commit & Push Protocol
- **Single-Step Remote Synchronization**: Whenever the user instructs the assistant to `"Commit"` or `"Commit changes"`, the assistant MUST automatically execute **both** `git commit` AND `git push origin main` together in one seamless step, ensuring GitHub and GitHub Pages stay continuously synchronized with local progress.

### E. Invisible Copyright & Cryptographic Authorship Integrity
- **Moral Rights & Authorship**: Protected under French Intellectual Property law (Articles L.111-1 & L.121-1 CPI) with author attribution to **Phil PARRIS (Département LH / LAN)**.
- **100% Invisible On Screen**: All protections reside under the hood via `<meta>` tags, HTML comment blocks, frozen JavaScript tokens (`window.__GSEA_FACULTY_AUTH`), and cryptographic checksums.

### F. Student & Teacher Privacy Protocol
- **Strict Codebase Anonymity**: The Git codebase must NEVER contain real student names or private teacher contact info. Anonymous identifiers (`GRPA001`–`GRPA010`) are used in public files.
- **Zero Student PII in AI Chat**: Real student names must NEVER be entered, printed, or output in the AI chat conversation or prompt history. All conversational responses, tables, summaries, logs, and examples must strictly and exclusively use anonymous student identifiers (`GRPA001`–`GRPB009`). Real student identities reside exclusively within local `students.private.json` files on the instructor's local machine for offline client-side package injection.
- **Private Mapping**: Real rosters are maintained in private, git-ignored configuration files (`students.private.json`).

### G. Plain English & Strict Prohibition of the Term 'Faculty'
- **Zero Pedagogical or Academic Jargon**: All instructions and interface copy must use clear, simple, plain English easily understood by any B2 learner worldwide.
- **Strict Prohibition of the Term 'Faculty'**:
  - Never use the word `"faculty"` across any UI labels, headings, cards, badges, documentation, teacher portals, student worksheets, or prompt responses.
  - Always use clear, plain, human-friendly terms instead: `"Teachers"`, `"Teaching Team"`, `"Teaching Staff"`, `"Teacher Notes"`, `"Teaching Notes"`, or `"Course Administration"`.

### H. `Media Update` Automated Weekly Curation Protocol
- **Weekly Media Curation Trigger (`Media Update`)**: Whenever the user sends `Media Update` (with a CSV attached, pasted in chat, or written to `data/media-latest.csv`):
  1. Ingest `data/media-latest.csv` containing:
     - 1 Up Next notice/statement (headline, week tag, teaching note).
     - 2 BBC article links (Aviation Safety / AT and Tourism & Leisure / AG, with title, summary, link).
     - 3 IMDb film recommendations (General Culture & Cinema: title, country/genre tag, credits, synopsis, link).
  2. Parse and synchronize the dynamic media blocks bounded by `<!-- MEDIA_UPDATE_START -->` and `<!-- MEDIA_UPDATE_END -->` in `index.html` (via `npm run media:update` or `node scripts/update-media.js`).
  3. Rebuild minified Tailwind CSS and all 3 distribution packages (`dist/GSEA_Teachers_SCORM.zip`, `.iso`, `.dmg`).
  4. Automatically execute `git commit` AND `git push origin main` in the same step.
- **General Culture Focus**: Film recommendations are curated for broad cultural perspective, creative storytelling, and critical reflection beyond language boundaries, and are not restricted to English-language cinema.
- **Privacy & Clean Code Invariants**: Raw `data/*.csv` files remain in `.gitignore`. Example template is tracked at `data/media-latest.example.csv`. Prohibited term `"faculty"` must never appear in generated copy or UI.

### I. `Semester X Dual Portfolio Update` Cross-Portal Sync Protocol
- **Trigger**: Whenever the user sends `Semester 1 Dual Portfolio Update` (or `Semester 1 Full Portfolio Update` / `Dual Portfolio Update S1`, with a CSV attached or pasted):
  1. Save raw CSV to `GSEA_semester_1/data/portfolio-latest.csv` AND `GSEA_teachers/data/portfolio-s1-latest.csv` (both git-ignored).
  2. Update `GSEA_semester_1` via `npm run portfolio:summary`, rebuild all 4 packages (`SCORM.zip`, `SCORM_MOODLE.zip`, `.iso`, `.dmg`), and commit & push to GitHub.
  3. Update `GSEA_teachers` via `npm run portfolio:s1`, rebuild all 3 packages (`SCORM.zip`, `.iso`, `.dmg`), and commit & push to GitHub.
  4. Output a single consolidated report in chat with total submissions, track breakdown, and confirmation of both remote repositories synchronized live.

### I. Modular Source Architecture & Build Runbook (`src/` Invariant)
- **Modular Source Tree**: Human-editable source files live cleanly under `src/`:
  - `src/template.html`: Base application HTML shell, navigation bar, and modal structures.
  - `src/js/01-auth-engine.js`: Cryptographic integrity, student pseudonymization placeholders, and storage keys.
  - `src/js/02-config-semesters.js`: Multi-semester static configuration (`SEMESTERS_DATA` for S1–S4).
  - `src/js/03-core-deck.js`: Navigation controllers, semester switching, and view dispatcher.
  - `src/js/04-tab-overview.js`: Weekly noticeboard, speaking warm-ups, cinema, and live traffic.
  - `src/js/05-tab-evaluations.js`: Formative evaluation grading calculator, rubrics, and Google Sheets sync.
  - `src/js/06-tab-calendar-rotas.js`: Weekly timetables and FE tutorial rotas.
  - `src/js/07-tab-groups-absences.js`: Class rosters, student groups, absence tracking, and print engine.
  - `src/js/08-portfolio-data.js`: Embedded student portfolio reflection matrices (`PORTFOLIO_DATA_S1` through `S4`).
  - `src/js/09-tab-portfolio.js`: Student portfolio reflection view, analytics cards, and dossiers.
  - `src/js/10-media-archive.js`: Media recommendations archive data and modal controller.
  - `src/js/11-footer-init.js`: DOM initialization handler.
- **Build Commands**:
  - `npm run build:html`: Compiles `src/template.html` and `src/js/*.js` into `index.html`.
  - `npm run build:css`: Compiles Tailwind CSS v4 minified into `output.css`.
  - `npm run build`: Runs both `build:html` and `build:css`.
  - `npm run package`: Runs `npm run build`, validates AST syntax (`npm test`), and packages the SCORM `.zip`, Universal `.iso`, and Apple Mac `.dmg` installers.
- **CRITICAL INVARIANT — NEVER HAND-EDIT `index.html`**:
  `index.html` is an automated compiled distribution artifact generated by `npm run build` (`scripts/build-html.js`). Any direct edits made to `index.html` WILL BE PERMANENTLY OVERWRITTEN on the next build. All human-editable source code resides strictly in `src/template.html` and `src/js/*.js`.

### K. "Cockpit Clarity" Visual Design & Icon Discipline Invariant (Tri-Project Permanent Invariant)
- **Aviation Cockpit Philosophy ("Quiet by Default, Urgent by Exception")**: The learning and teaching portals are professional aviation courseware interfaces. They must avoid visual fatigue, competing pastel palettes, and decorative clutter.
- **The 60–30–10 Palette Discipline**:
  - **60% Neutral Canvas**: Clean white (`bg-white`) and deep cockpit slate/navy (`bg-[#0f172a]` / `bg-[#1e293b]`).
  - **30% Structure**: Neutral slate grays for borders (`border-slate-200`), text hierarchy (`text-slate-900` / `text-slate-600`), and secondary cards (`bg-slate-50/80 border-slate-200/80`).
  - **10% Brand Accent**: **Aviation Amber / Gold** (`amber-400` / `amber-500`) serves as the single authoritative brand highlight (active tabs, category badges, key operational signposts, and focus indicators).
  - **Functional Semantic Exceptions**: Muted Rose/Red is strictly reserved for genuine emergency incidents or critical errors (e.g., active runway evacuations); Emerald is strictly reserved for live system connectivity/pass indicators. Never introduce arbitrary decorative pastels (random teals, purples, or loud background fills).
- **Icon & Emoji Discipline (Zero Decorative Emojis in Headings)**:
  - Do NOT clutter section titles, card headings, or buttons with decorative multi-color emojis (e.g., never use `📌`, `🎬`, `📁`, `💬`, `🔴`, `⚠️` in titles).
  - Use clean, authoritative typography (e.g., font-mono uppercase eyebrows: `CLASSROOM SPEAKING WARM-UPS`, `CASE 01 • ACTIVE RUNWAY EVACUATION`).
  - Where icons are functional (external link `↗`, video indicators, search), use subtle monochrome SVG icons matching the text color, never toy-like multi-color emojis.
- **Harmonized Card Archetypes (No Loud Pastel Fills)**:
  - Important notices, teaching notes, and discussion prompt boxes must NOT use full bright pastel fills (e.g., avoid full-bleed `bg-amber-50/90 border-amber-200`).
  - Standardize callouts to crisp white/slate cards with an understated **3px or 4px solid amber left-rail accent border** (`bg-white border border-slate-200 border-l-4 border-l-amber-400 shadow-2xs`).

---

