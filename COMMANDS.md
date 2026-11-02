# GSEA Faculty Portal — Quick Command Reference

Official management and operational reference for Phil PARRIS (Pedagogical Architect & Author) to administer the multi-semester faculty portal, continuous evaluation grading, and student portfolio reflection datasets.

---

### 1. Multi-Semester Student Portfolio Updates

Attach or paste the latest Google Form/Sheet export CSV and trigger the corresponding semester update in chat:

| Natural Language Chat Command | Terminal / NPM Command | Scope & Behavior |
| :--- | :--- | :--- |
| **`Semester 1 Teachers Portfolio Update`**<br>*(or `Semester 1 Portfolio Teachers Update`)* | `npm run portfolio:s1` | Updates Semester 1 (AG & AT), parses 22 student entries, extracts buzzwords & grammar traps, rebuilds SCORM/ISO/DMG packages, and commits to Git. |
| **`Semester 2 Teachers Portfolio Update`**<br>*(or `Semester 2 Portfolio Teachers Update`)* | `npm run portfolio:s2` | Updates Semester 2 (AG & AAS), processes new cohort reflections, and refreshes the S2 portfolio dashboard. |
| **`Semester 3 Teachers Portfolio Update`**<br>*(or `Semester 3 Portfolio Teachers Update`)* | `npm run portfolio:s3` | Updates Semester 3 (AT Technical English), processes technical vocabulary & system reflections. |
| **`Semester 4 Teachers Portfolio Update`**<br>*(or `Semester 4 Portfolio Teachers Update`)* | `npm run portfolio:s4` | Updates Semester 4 (AP Aeronautical Professional), processes operational briefings & project data. |

> **Security & Privacy Invariant**: All raw CSV files are saved locally to `data/portfolio-s{X}-latest.csv` under `.gitignore`. Student 4-digit security PIN codes are permanently stripped out. Only anonymous IDs (`GRPA001`–`GRPB009`) are tracked in Git.

---

### 2. Build & Packaging Pipelines

| Command | Purpose |
| :--- | :--- |
| `npm run build` | Compiles minified Tailwind CSS v4 into `output.css`. |
| `npm run package` | Builds minified CSS, validates `imsmanifest.xml`, and bundles **SCORM `.zip`**, **Universal Hybrid `.iso`**, and **Native Mac `.dmg`** disk images. |
| `npm run package:scorm` | Compiles and packages only `dist/GSEA_Teachers_SCORM.zip`. |
| `npm run package:iso` | Rebuilds the offline `.iso` and `.dmg` virtual disk images. |
| `npm run backup` | Bundles a dated full-project archive `.zip` into `/Users/philparris/Documents/moodle_backups/GSEA_teachers/`. |
| `npm run dev:css` | Watches `src/input.css` for live class updates during local design work. |
| `npm run serve` | Launches local HTTP preview on port 8080 (`http://localhost:8080`). |

---

### 3. Remote Synchronization

- Say **`Commit`** or **`Commit changes`**: Automatically runs `git commit` AND `git push origin main` in one atomic step.
