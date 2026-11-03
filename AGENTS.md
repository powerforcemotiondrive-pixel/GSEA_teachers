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
