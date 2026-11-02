# ENAC GSEA English Multi-Semester Faculty Portal — AI Agent Guidelines & Architecture Rules

This repository houses the official **ENAC GSEA English Faculty Administration & Grading Portal** (`GSEA_teachers`). It serves as the master central cockpit for ENAC English faculty across all four semesters (S1, S2, S3, S4).

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
  - **Semester 4**: AP (Aeronautical Professional) only
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

### F. Student & Faculty Privacy Protocol
- **Strict Codebase Anonymity**: The Git codebase must NEVER contain real student names or private teacher contact info. Anonymous identifiers (`GRPA001`–`GRPA010`) are used in public files.
- **Zero Student PII in AI Chat**: Real student names must NEVER be entered, printed, or output in the AI chat conversation or prompt history. All conversational responses, tables, summaries, logs, and examples must strictly and exclusively use anonymous student identifiers (`GRPA001`–`GRPB009`). Real student identities reside exclusively within local `students.private.json` files on the instructor's local machine for offline client-side package injection.
- **Private Mapping**: Real rosters are maintained in private, git-ignored configuration files (`students.private.json`).

