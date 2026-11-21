# ENAC GSEA English Teachers Hub (`GSEA_teachers`) — System Architecture & Design Blueprint

## 1. Executive Summary & Identity
- **Repository Path**: `/Users/philparris/Documents/GSEA_teachers`
- **Application Type**: Standalone SCORM 1.2 Web Application, Universal Hybrid ISO, and Apple Mac DMG offline course administration portal.
- **Audience**: ENAC (École Nationale de l'Aviation Civile) English teaching team across the **Département Langues et Humanités (LH / LAN)**.
- **Core Purpose**: Central cockpit managing all four academic semesters (**S1, S2, S3, S4**) in a single dynamic interface: weekly teaching noticeboard, speaking warm-ups, curated cinema, VASAviation ATC debriefs, multi-semester syllabus calendars, Formative Evaluation (FE) tutorial rotas, student attendance/absence tracking, live grading calculations with Google Sheets cloud sync, and student learning portfolio analytics.

---

## 2. Layout & Visual Hierarchy (Top to Bottom)

The application uses a **responsive, centered cockpit container** (`max-w-7xl mx-auto`) framed by a slate background (`bg-slate-900`) with subtle radar grid textures.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. EXECUTIVE DARK BLUE HEADER (Flush-left title & department subtitle)      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. MASTER SEMESTER SELECTION STRIP [ • Semester 1 ] [ Semester 2 ] [ ... ]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. HIGH-CONTRAST WHITE NAVIGATION BAR (Overview • Calendar • Rotas • etc.)  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. DYNAMIC VIEWPORT / TAB CONTENT (Injected via JavaScript)                 │
│    - Tab 0: Overview (Noticeboard, Speaking Warm-ups, Cinema, Live Traffic) │
│    - Tab 1: Programme & Calendar (Syllabus & weekly schedules)              │
│    - Tab 2: FE Tutorial Rotas (Evaluation timetables, pairs/trios)          │
│    - Tab 3: Groups & Absences (Rosters, absence logger, printable register) │
│    - Tab 4: Formative Evaluations (Grading calculator, rubrics, print sheet)│
│    - Tab 5: Learning Portfolios (Student reflections, buzzwords, compliance)│
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. STATUS FOOTER: [• ENAC • Département LH / LAN]    [Phil PARRIS • v1.2.0 • 🏛️]│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Zone Breakdown:

#### Zone 1: Executive Dark Blue Cockpit Header (`#portal-header`)
- **Background**: Textured dark navy surface (`bg-[#0f172a]` with `border-b border-slate-900/60`).
- **Typography & Alignment**: 100% flush-left alignment with no trailing clutter:
  - **Main Title**: `GSEA TEACHERS HUB` (bold, white, uppercase, tracking-tight).
  - **Subtitle**: `ENAC • DÉPARTEMENT LH / LAN` (font-mono, slate-300, uppercase).
- **Clean Aesthetic**: Clutter-free with no airplane icons or top-right logos; the ENAC crest has been relocated to the footer far-right.

#### Zone 2: Master Semester Selection Strip (`#semester-nav-bar`)
- **Position**: Sits directly under the header title, flush-left aligned.
- **Styling**: `bg-slate-950/90 border-b border-slate-800` containing a rounded segmented control (`#semester-selector-group`).
- **Interactive Buttons**:
  - `• Semester 1 (AG + AT)`: Golden Amber active pill (`bg-amber-400 text-slate-950 font-bold`).
  - `• Semester 2 (AG + AAS)`: Dark slate inactive button with hover transition.
  - `• Semester 3 (AT)`: Dark slate inactive button (Technical English only; AG disabled).
  - `• Semester 4 (AP)`: Dark slate inactive button (Professional English).
- **Reactivity**: Clicking any semester immediately mutates `activeSemester` and re-renders all timetables, student rosters, rotas, and portfolio data without a browser refresh.

#### Zone 3: High-Contrast White Navigation Bar (`#main-tab-nav`)
- **Position**: Sits directly beneath the dark semester strip and above the main content canvas.
- **Styling**: Light, clean, modern bar (`bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5`).
- **Tabs**:
  1. `Overview`
  2. `Programme & Calendar`
  3. `FE Tutorial Rotas`
  4. `Groups & Absences`
  5. `Formative Evaluations`
  6. `Learning Portfolios`
- **Pill States**:
  - **Active Tab**: `bg-slate-900 text-white font-bold shadow-xs`.
  - **Inactive Tabs**: `text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium`.

#### Zone 4: Main Content Area (`<main id="main-content">`)
Renders the active tab dynamically via vanilla JS dispatcher:

- **Tab 0: Overview (The Daily Teaching Dashboard)**:
  - **Promotion Pulse Banner**: Displays active cohort callsign, semester track mix, dates, and a 1-click button to launch the official ENAC eCampus Moodle space.
  - **Unified Weekly Noticeboard & Cultural Media (`WEEKLY_NOTICEBOARD_DATA`)**:
    - *Header Ribbon*: `WEEKLY NOTICEBOARD AND CULTURE / MEDIA` with descriptive subtitle explaining its classroom purpose, plus modal buttons for *Past Articles* and *Past Films*.
    - *Left Column (`Classroom Speaking Warm-ups (AT & AG)`)*: 5-minute warm-up explanation, an "Up Next" weekly teaching focus card, and 2 curated topical BBC articles (Aviation Safety / AT & Tourism / AG) with direct links.
    - *Right Column (`Cultural Cinema & Independent Listening`)*: Cultural immersion explanation and 3 curated IMDb film suggestions (French, British/American, and International cinema) for students to practice listening comprehension outside class.
  - **Recent Aviation Live Traffic & ATC Debriefs (2 Cases Max)**:
    - Stacked deep horizontal cards providing a full-width experience on desktop:
      - *Left Column (`lg:col-span-7`)*: Large 16:9 responsive YouTube player (~420px height) providing crystal-clear legibility for radar maps, callsign labels, and ATC captions.
      - *Right Column (`lg:col-span-5`)*: Pedagogical incident debrief panel with Situation, Phraseology & ATC Coordination analysis, and classroom speaking prompts.
      - *Case 1*: Active Runway Evacuation at DFW (`-LDLo2WhCIU`) — American Airlines B737 cabin smoke emergency stop, ARFF rollout, and trailing arrival go-around instructions.
      - *Case 2*: Apron & Taxiway Ground Collision (`i4IePwbw8kU`) — Wingtip strike and horizontal stabilizer structural damage during ground maneuvering, focusing on progressive taxi readbacks.

- **Tab 1: Programme & Calendar**:
  - Interactive multi-semester course calendar displaying session titles, dates, room allocations, teaching notes, and track progression.

- **Tab 2: FE Tutorial Rotas**:
  - Formative evaluation timetables, student pair/trio slot distributions, time windows, and teacher assignment rosters.

- **Tab 3: Groups & Absences**:
  - Multi-group rosters (`Group A`, `Group B`, etc.), real-time absence logger, Google Sheets cloud sync integration, and printable attendance registers.

- **Tab 4: Formative Evaluations**:
  - Digital grading calculator with CEFR B2 descriptors, multi-criteria weighting, live qualitative feedback composer, Google Apps Script backend sync, and printable student grade dossiers.

- **Tab 5: Learning Portfolios**:
  - Whole-semester student reflections, top 12–16 buzzwords with definitions, 5–6 high-frequency grammar/pronunciation traps (❌ Wrong vs ✅ Right), student reflection quotes, compliance heatmaps, and printable portfolio reports.

#### Zone 5: Status Footer (`<footer class="textured-surface bg-[#1e293b]">`)
- **Left Side**: Pulsing emerald status dot + `ENAC • Département LH / LAN`.
- **Far Right Side**: `Phil PARRIS` • `v1.2.0` • white ENAC crest (`images/enac_logo_white.png`) dynamically hyperlinked to open the active semester's eCampus space in a new tab.

---

## 3. Technical Architecture & Modular Source Setup

To prevent codebase bloat, `GSEA_teachers` is organized into a **clean modular source tree (`src/`)** compiled automatically via `scripts/build-html.js`:

```
GSEA_teachers/
├── src/
│   ├── template.html              # HTML shell, navigation bar, modals, and print skeletons
│   ├── input.css                  # Tailwind CSS v4 source input
│   └── js/
│       ├── 01-auth-engine.js      # Authorship token, student pseudonymization mapping, escapeHtml
│       ├── 02-config-semesters.js # Multi-semester dataset (SEMESTERS_DATA for S1–S4)
│       ├── 03-core-deck.js         # Navigation state, semester switching, view dispatcher
│       ├── 04-tab-overview.js     # Noticeboard (WEEKLY_NOTICEBOARD_DATA), cinema, live traffic
│       ├── 05-tab-evaluations.js  # Grading calculator, rubrics, Google Sheets sync
│       ├── 06-tab-calendar-rotas.js # Weekly calendar syllabi and FE tutorial rotas
│       ├── 07-tab-groups-absences.js # Student groups, absence logger, attendance dossiers
│       ├── 08-portfolio-data.js   # Embedded student reflection matrices (PORTFOLIO_DATA_S1..S4)
│       ├── 09-tab-portfolio.js    # Portfolio reflection views, compliance, dossiers
│       ├── 10-media-archive.js    # Media archive dataset and modal handler
│       └── 11-footer-init.js      # DOMContentLoaded initialization hook
├── scripts/
│   ├── build-html.js              # Compiles src/template.html + src/js/*.js -> index.html
│   ├── validate-syntax.js         # AST & syntax validator using Node.js vm.Script
│   ├── update-media.js            # Ingests media-latest.csv and updates src/js/04 & 10
│   ├── update-portfolio.js        # Ingests portfolio CSV and updates src/js/08
│   ├── package-scorm.js           # Packages dist/GSEA_Teachers_SCORM.zip
│   ├── package-iso.js             # Generates Universal ISO & Apple Mac DMG
│   └── backup.js                  # Automated dated backup bundler
├── data/
│   ├── media-latest.csv           # Git-ignored weekly media curation input
│   ├── portfolio-s1-latest.csv    # Git-ignored student reflection CSV
│   └── portfolio-s1.json          # Anonymized parsed student reflection dataset
├── imsmanifest.xml                # SCORM 1.2 package manifest
├── package.json                   # Build and packaging scripts
└── index.html                     # Automated compiled distribution artifact (DO NOT EDIT DIRECTLY)
```

---

## 4. Build, Validation & Packaging Pipeline

### ⚠️ Invariant Rule: NEVER Edit `index.html` Directly!
`index.html` is an automated build artifact. All human-editable source code resides in `src/template.html` and `src/js/*.js`. Any manual edits made directly to `index.html` **will be overwritten** during the next build!

### Core Runbook Commands:
1. **`npm run build:html`**:
   - Runs `scripts/build-html.js`.
   - Validates that every HTML tag attribute opened with `="` has a matching closing `"` before `>`.
   - Runs pre-flight `node -c` syntax validation on each JS module in `src/js/`.
   - Concatenates modules and injects them into `<!-- INLINE_APP_SCRIPTS -->` in `src/template.html`, prepending the DO NOT EDIT warning banner, generating `index.html`.
2. **`npm run build:css`**:
   - Compiles Tailwind CSS v4 minified into `output.css` using `npx @tailwindcss/cli`.
3. **`npm run build`**:
   - Runs `build:html` followed by `build:css`.
4. **`npm test`**:
   - Runs `scripts/validate-syntax.js`, compiling inline `<script>` blocks inside isolated Node.js `vm.Script` contexts to guarantee 0 AST or syntax errors exist before release.
5. **`npm run package`**:
   - Executes `npm run build` + `npm test`.
   - Validates asset integrity against `imsmanifest.xml`.
   - Signs all assets with cryptographic SHA-256 tokens (`CHECKSUMS.sha256`).
   - Injects real student names strictly into temporary staging files from local `students.private.json`.
   - Bundles `dist/GSEA_Teachers_SCORM.zip` (2.16 MB).
   - Generates Universal Hybrid ISO (`dist/GSEA_Teachers_Offline.iso` — 3.72 MB).
   - Generates Native Apple Mac DMG (`dist/GSEA_Teachers_Mac.dmg` — 2.18 MB).

---

## 5. Security & Student Privacy Invariants (PII Rules)

- **100% Anonymized Git Codebase**:
  - The Git codebase (`src/`, `index.html`, and `data/`) contains **zero real student names**.
  - All students are identified by anonymous IDs (`GRPA001`–`GRPA010`, `GRPB001`–`GRPB009`).
- **Private Identity Isolation**:
  - Real student names reside exclusively in `students.private.json` and raw CSV files on the instructor's local machine.
  - `students.private.json` and raw `*.csv` files are permanently ignored by `.gitignore`.
- **Packaging Injection Only**:
  - Real student names are only injected into staged files during the packaging step (`package-scorm.js` and `package-iso.js`), leaving the Git working tree completely anonymous.
- **Strict Prohibition of the Term "Faculty"**:
  - The word `"faculty"` is strictly prohibited across UI copy, headings, and labels per the global style guidelines; human-friendly terms (`Teachers`, `Teaching Team`, `Teacher Notes`) are used instead.
