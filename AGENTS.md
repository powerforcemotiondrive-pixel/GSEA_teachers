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

### J. Modular Source Architecture & Build Runbook (`src/` Invariant)
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

### K. "Cockpit Clarity" Visual Design & Icon Discipline Invariant (Quad-Project Permanent Invariant)
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
### L. Drawer Geometry & Bottom-Center Fullscreen Controller Invariant (Quad-Project Permanent Invariant)
- **Slide-Over Drawer Standard**: All slide-over drawers across all four portals (`index.html` drawers, admin hubs, and grading panels) must strictly use `max-w-4xl 2xl:max-w-6xl` for consistent horizontal reach and readability across desktop displays, with backdrop layer `z-40` and drawer panel `z-50`.
- **Fullscreen Controller Standard**: All four portals feature a floating bottom-center fullscreen toggle button (`fixed bottom-4 left-1/2 -translate-x-1/2 z-30`), discreet styling, and automatic Escape key listener to exit fullscreen mode cleanly.

### M. Automated Project Backups (`backup1`–`backup3`, `backupt` & `backup all`)
- **`backupt` / `backup teachers` Trigger**: Whenever the user sends `backupt` or `backup teachers`, the assistant immediately runs `npm run backupt` (or `node scripts/backup.js teachers`) to bundle a full dated archive into `/Users/philparris/Documents/moodle_backups/GSEA_teachers/` and confirms the file path and archive size.
- **`backup1`, `backup2`, `backup3` Triggers**: The assistant can trigger backups for any specific semester directly from the Teachers Hub via `npm run backup1`, `npm run backup2`, or `npm run backup3`.
- **`backup all` Trigger**: Whenever the user sends `backup all` or `Backup 1 2 3 Teachers`, the assistant immediately runs `npm run backup:all` (or `node scripts/backup.js all`) to bundle dated archives across all four projects and confirms their file paths and sizes.
- **Archive Convention**: Archives are named `GSEA_Teachers_backup_YYYY-MM-DD_HHmm.zip` (and `GSEA_Semester_X_backup_YYYY-MM-DD_HHmm.zip`), containing the full project source and compiled assets while omitting `node_modules` and `.git`.

### N. Teacher PIN Authentication & Local Security Invariant
- **Strict Credential Protection**: Real teacher PINs, passcodes, and master administrator bypass keys must live exclusively in the local file `teachers.private.json`, which is permanently listed in `.gitignore` and must never be committed to Git.
- **Sanitized Placeholder Template**: A placeholder template `teachers.private.example.json` is tracked by Git for developer onboarding.
- **Zero Plaintext Passwords in Git**: Hardcoded passwords, plain-text faculty PINs, or confidential credentials must never be written to `src/js/01-auth-engine.js` or `index.html`.

### O. Global Code Bug Hunter (`Bug Check Teachers` / `npm run bug`)
- **Automated AST & Syntax Verification**: Running `npm run bug` (`node scripts/validate-syntax.js`) validates all inline script blocks and compiled AST trees in `index.html`, ensuring 0 JavaScript syntax errors before deployment.

### P. Cross-Project Rule, Feature & Tooling Synchronization (Quad-Project Invariant)
- **Mandatory Quad-Project Propagation**: Whenever an architectural rule, governance guideline, operational command (e.g. `backup1`–`backup3`, `backupt`, `backup all`), utility script, **shared platform feature, portfolio enhancement, or UI workflow improvement** is created or updated in any semester or the Teachers Hub, the assistant MUST automatically evaluate and synchronize that improvement across all four repositories (`GSEA_semester_1`, `GSEA_semester_2`, `GSEA_semester_3`, and `GSEA_teachers`) within the same session.

### AC. Non-Destructive Data Merging & Curriculum Schema Protection (Zero Curriculum Erasure — Quad-Project Invariant)
- **Strict Non-Destructive Deep-Merge Requirement**: Scripts or tools modifying `data/course-data.js` must **NEVER** assign or replace session objects wholesale (e.g. `cd.ag['2'].sessions['1'] = { ... }`). They must strictly perform deep, non-destructive property merges that preserve all existing fields.
- **Mandatory Curriculum Schema Floors**: Every session across all modules (1–3) and tracks (AT & AG) must permanently maintain:
  - `materials.videos`: At least 1 (typically 3) verified video with an active 11-character YouTube video ID, watch URL, and operational caption.
  - `materials.toeicQuestions`: Exactly 5 (or more) complete TOEIC Part 5 practice questions with stems, 4 options (A–D), and validated correct answers with explanations.
  - `revision.keyTerms`: 10 vocabulary terms with phonetic IPA and concise definitions.
- **Automated Rejection Gate**: Enforced permanently by Check 9 in `scripts/bug-check.js`. Any update that erodes or drops curriculum schema floors immediately halts packaging.

---

### AD. Mandatory `image-generator` Subagent for Educational Visuals (Zero Web Scraping / Stock Guessing)
- **Strict Prohibition of Web Scraping & URL Guessing**: The assistant is strictly prohibited from guessing external image URLs, curling third-party stock photo websites (Unsplash, Wikimedia, etc.), or scraping live image endpoints. This prevents broken 400 errors, rate-limiting, copyright risks, and mismatched visuals (e.g., green canyons for drought, tornados for wildfire).
- **Mandatory Bespoke Generation via `image-generator`**: All bespoke pedagogical visual assets, 4-photo debate panels, and card artwork must be produced directly using the workspace's dedicated **`image-generator`** subagent with precise, photorealistic prompts tailored to the educational topic.
- **Image Asset Sanity Verification**: All generated visual assets must be valid binary images ($\ge 10\text{ KB}$, verified JPEG `FF D8 FF` or PNG `89 50 4E 47` magic bytes) as enforced by Check 12 of `bug-check.js`.

---

### AE. Universal Session Briefing & Roadmap Banner Invariant (Quad-Project Permanent Invariant)
- **Mandatory Briefing Banner on Every Worksheet**: Every single session template across all modules and tracks (AG & AT Sessions 1–4) must call `${renderSessionBriefingBanner(sessionData, theme)}` immediately below the session overview/hero banner in `src/js/` and `index.html`.
- **Zero Worksheet Omission**: No communicative digital worksheet may omit the Operational Context briefing, Core Spoken B2 Objectives, Spoken Focus & Teacher Pacing guidance, or Stage Progression badges.
- **Automated Verification**: Enforced permanently by Check 11 in `scripts/bug-check.js`. Any session template missing this component causes the build to fail immediately.

---

### AF. Mandatory 12-Point Automated Defense Scanner & Release Gate (`npm run bug1 / bug2 / bug3`)
- **Mandatory Pre-Release Simulation Gate**: No code, template, or data changes may be packaged, committed, or pushed without running the 12-point automated bug check (`npm run bug1` for Semester 1, `npm run bug2` for Semester 2, `npm run bug3` for Semester 3).
- **Full Headless E2E Tab & Session Simulation (Check 10)**:
  - Check 10 executes **all 1,248 live rendering paths** (all 26 modal tabs $\times$ 3 modules $\times$ 2 tracks $\times$ 8 sessions) in a headless Node environment.
  - Asserts that every single modal tab (`portfolio_summary`, `student_guide`, `content`, `materials`, `admin_refonte`, etc.) has an active rendering function, produces valid non-empty markup, and throws zero runtime exceptions.
- **Zero-Bypass Policy**: If any of the 12 checks fails, packaging and deployment are strictly blocked until all reported errors are resolved.

---

---

### AG. Drawer Tab Typography & Zero Emoji Clutter Invariant (Quad-Project Permanent Invariant)
- **Zero Decorative Emojis or Flags in Drawer Tabs**: All slide-over drawer and modal navigation tab strips must strictly use clean, authoritative text labels without novelty emojis, flags, or icons (e.g. `Student Guide`, `Objectives (EN)`, `Objectives (FR)`, `Portfolio Summary`, `FE1 Quick-Prep`, `GSEA 2027 Refonte`).
- **Cockpit Typography Standard**: Drawer tab navigation must maintain uniform text sizing (`text-xs font-bold`), equal vertical rhythm, and compact horizontal density to prevent line wrapping and horizontal scroll clutter across desktop and mobile devices.

---

### AH. Clean Content Architecture: Zero Decorative Icons & Protected Pastel Separation (Quad-Project Permanent Invariant)
- **Zero Decorative Icons & Emojis (Strict Permanent Invariant)**:
  - Decorative emojis and illustrative clipart SVGs (e.g., 🎧, 🗣️, ✈️, 📝, 💡, 🎯, 📌, 🎬, 💬) are strictly forbidden across all lesson worksheets, card heroes, eyebrows, activity pills, headers, modal dialogues, tabs, and noticeboards.
  - All section headings, activity mode pills, and category tags must rely exclusively on clean typography, neutral monospace badges, and clear text labels.
  - Only essential functional micro-controls are permitted (audio play/pause `▶`/`⏸`, modal close `✕`, deck/carousel navigation arrows `‹` `›`, print action buttons).
- **Protected Pastel Content Separation (Calm Classroom Tinting)**:
  - Subtle pastel background tints (e.g. `bg-amber-50/70`, `bg-sky-50/70`, `bg-emerald-50/70`, `bg-slate-50/80`) with soft matching borders (`border-amber-200/80`, `border-sky-200/80`, `border-emerald-200/80`, `border-slate-200/90`) are fully authorized, protected, and encouraged to provide clear visual separation between pedagogical stages, speaking roles, and activity zones.
  - Visual structure and hierarchy rely on clean border styling, soft pastel zoning, and generous whitespace rather than decorative icons or toy emojis.
- **Card Accent Rails & Badge Hierarchy**:
  - Dashboards, noticeboards, and multi-card feeds maintain the 2-tone accent discipline: neutral Slate rails (`border-l-4 border-l-slate-300` / `border-l-slate-400`) for standard information cards, and the Amber rail (`border-l-4 border-l-amber-400`) strictly reserved for the active focal point.
  - Eyebrows, category headers, and day/topic tags must strictly use neutral monospace pill badges (`bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[10px] uppercase tracking-wider`).

---

### AI. `Strip` Decorative Icon & Emoji Purge Protocol (Strip Semester X ...)
- **`Strip` Operational Trigger**: Whenever the user sends `Strip Semester [1|2|3] [AG|AT|AAS|all] [session X | module Y | all]` or `Strip all`:
  1. Runs `npm run strip -- <semester> <track> <session>` (or `node scripts/strip-icons.js ...`) to systematically purge decorative emojis and illustrative icons from titles, badges, activity labels, instructions, and worksheets while preserving essential interactive controls and protected pastel background styling.
  2. Runs `npm run build && npm run bug1 && npm run package` (or corresponding semester checks) to verify 12/12 defense checks.
  3. Automatically executes `git commit && git push origin main` in the same step.
- **Cockpit Clarity Invariant**: Decorative emojis must be replaced with crisp, adult typographic headings, monospace badges, or clean text labels to eliminate cognitive visual noise for B2 learners worldwide.

