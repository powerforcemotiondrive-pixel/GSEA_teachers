# GSEA Teachers Portal — Quick Command Reference

Official management and operational reference for Phil PARRIS (Pedagogical Architect & Author) to administer the multi-semester teachers portal, continuous evaluation grading, weekly media/film curation, and student portfolio reflection datasets.

---

### 1. Weekly Media & Film Recommendations Updates (`Media Update`)

Attach or paste a CSV containing 1 Up Next statement, 2 BBC article links, and 3 IMDb movie links, then send `Media Update`:

| Natural Language Chat Command | Terminal / NPM Command | Scope & Behavior |
| :--- | :--- | :--- |
| **`Media Update`** | `npm run media:update` | Parses `data/media-latest.csv`, updates the **Noticeboard and Media** strip (Notice + 2 BBC articles) and the **General Culture & Cinema** strip (3 IMDb films), rebuilds SCORM/ISO/DMG packages, and commits to Git. |

#### Required CSV Format (`data/media-latest.csv`):
```csv
type,content,category,title,summary
up_next,"Week 46: Focus on past continuous narratives and peer listening before FE1.","Week 46 • Notice","Oral Fluency & Active Listening","Teaching Note"
bbc,"https://www.bbc.com/news/articles/cm9wz01dx8xro","Aviation Safety (AT)","Airlines Face New Flight Deck Audio Rules","Global civil aviation authorities review cockpit voice recorder duration requirements to bolster safety protocols."
bbc,"https://www.bbc.com/travel/article/20261028-the-peruvian-hotel-with-a-terrifying-check-in","Tourism & Leisure (AG)","The Peruvian Hotel with a Terrifying Check-In","Guests scale a 400m cliff via ferrata or zipline to reach transparent sleeping pods above the Sacred Valley."
imdb,"https://www.imdb.com/title/tt36639956/","🇫🇷 FRENCH CINEMA","Le Corset (Iron Boy) (2026)","Dir. Louis Clichy • Beauce, France | An 11-year-old boy in rural Beauce navigates scoliosis and medical isolation, finding his voice and connection through music."
imdb,"https://www.imdb.com/title/tt34206385/","🇺🇸 AMERICAN CINEMA","Primetime (2026)","Dir. Lance Oppenheim • Starring Robert Pattinson | A psychological dramatization exploring 2000s television sting operations and the blurred ethical boundaries of media spectacle."
imdb,"https://www.imdb.com/title/tt27369017/","🇰🇷 INTERNATIONAL CINEMA","Hope (호프) (2026)","Dir. Na Hong-jin • International Cast | An isolated coastal community confronts an inexplicable phenomenon, bridging Korean auteur filmmaking with a global ensemble."
```
*(Template available at `data/media-latest.example.csv`)*

---

### 2. Multi-Semester Student Portfolio Updates

Attach or paste the latest Google Form/Sheet export CSV and trigger the corresponding semester update in chat:

| Natural Language Chat Command | Terminal / NPM Command | Scope & Behavior |
| :--- | :--- | :--- |
| **`Semester 1 Dual Portfolio Update`**<br>*(or `Semester 1 Full Portfolio Update`)* | `npm run portfolio:s1` + `semester_1` | **Unified Dual-Portal Update**: Ingests CSV once to update **both** Student Deck (`GSEA_semester_1`) and Teachers Hub (`GSEA_teachers`), rebuilds all 7 packages, and commits & pushes both repos to GitHub. |
| **`Semester 1 Teachers Portfolio Update`**<br>*(or `Semester 1 Portfolio Teachers Update`)* | `npm run portfolio:s1` | Updates Semester 1 (AG & AT) Teachers Hub only, parses student entries, extracts buzzwords & grammar traps, rebuilds SCORM/ISO/DMG packages, and commits to Git. |
| **`Semester 2 Teachers Portfolio Update`**<br>*(or `Semester 2 Portfolio Teachers Update`)* | `npm run portfolio:s2` | Updates Semester 2 (AG & AAS), processes new cohort reflections, and refreshes the S2 portfolio dashboard. |
| **`Semester 3 Teachers Portfolio Update`**<br>*(or `Semester 3 Portfolio Teachers Update`)* | `npm run portfolio:s3` | Updates Semester 3 (AT Technical English), processes technical vocabulary & system reflections. |
| **`Semester 4 Teachers Portfolio Update`**<br>*(or `Semester 4 Portfolio Teachers Update`)* | `npm run portfolio:s4` | Updates Semester 4 (AP Professional English), processes operational briefings & project data. |

> **Security & Privacy Invariant**: All raw CSV files are saved locally to `data/portfolio-s{X}-latest.csv` under `.gitignore`. Student 4-digit security PIN codes are permanently stripped out. Only anonymous IDs (`GRPA001`–`GRPB009`) are tracked in Git.

---

### 3. Build & Packaging Pipelines

| Command | Purpose |
| :--- | :--- |
| `npm run media:update` | Updates noticeboard, BBC articles, and film recommendations from CSV, then rebuilds all packages. |
| `npm run build` | Compiles minified Tailwind CSS v4 into `output.css`. |
| `npm run package` | Builds minified CSS, validates `imsmanifest.xml`, and bundles **SCORM `.zip`**, **Universal Hybrid `.iso`**, and **Native Mac `.dmg`** disk images. |
| `npm run package:scorm` | Compiles and packages only `dist/GSEA_Teachers_SCORM.zip`. |
| `npm run package:iso` | Rebuilds the offline `.iso` and `.dmg` virtual disk images. |
| `npm run backup` | Bundles a dated full-project archive `.zip` into `/Users/philparris/Documents/moodle_backups/GSEA_teachers/`. |
| `npm run dev:css` | Watches `src/input.css` for live class updates during local design work. |
| `npm run serve` | Launches local HTTP preview on port 8080 (`http://localhost:8080`). |

---

### 4. Remote Synchronization

- Say **`Commit`** or **`Commit changes`**: Automatically runs `git commit` AND `git push origin main` in one atomic step.
