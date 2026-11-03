/**
 * GSEA Teachers Portal — Automated Weekly Media & Film Recommendations Updater
 * 
 * Usage:
 *   node scripts/update-media.js [optional_csv_path]
 * 
 * Input:
 *   data/media-latest.csv (or specified path)
 *   Format: type,content,category,title,summary
 *   - 1 x up_next (statement / teaching note)
 *   - 2 x bbc (articles with URL)
 *   - 3 x imdb (film recommendations with IMDb URL)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const DEFAULT_CSV_PATH = path.join(ROOT_DIR, 'data', 'media-latest.csv');
const EXAMPLE_CSV_PATH = path.join(ROOT_DIR, 'data', 'media-latest.example.csv');

function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentVal = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentVal.trim());
      if (row.some(val => val.length > 0)) {
        lines.push(row);
      }
      row = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (currentVal.length > 0 || row.length > 0) {
    row.push(currentVal.trim());
    if (row.some(val => val.length > 0)) {
      lines.push(row);
    }
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map(h => h.toLowerCase().trim());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const r = lines[i];
    const rec = {};
    headers.forEach((h, idx) => {
      rec[h] = r[idx] || '';
    });
    records.push(rec);
  }

  return records;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function main() {
  let csvPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_CSV_PATH;

  if (!fs.existsSync(csvPath)) {
    if (fs.existsSync(EXAMPLE_CSV_PATH)) {
      console.warn(`⚠️ Specified file not found at ${csvPath}. Falling back to example template: ${EXAMPLE_CSV_PATH}`);
      csvPath = EXAMPLE_CSV_PATH;
    } else {
      console.error(`❌ Error: CSV file not found at ${csvPath}`);
      process.exit(1);
    }
  }

  const csvRaw = fs.readFileSync(csvPath, 'utf8');
  const records = parseCSV(csvRaw);

  const upNextItem = records.find(r => {
    const t = (r.type || '').toLowerCase();
    return t === 'up_next' || t === 'upnext' || t === 'notice' || t === 'statement';
  });

  const bbcItems = records.filter(r => (r.type || '').toLowerCase() === 'bbc');
  const imdbItems = records.filter(r => (r.type || '').toLowerCase() === 'imdb');

  if (!upNextItem) {
    console.error('❌ Error: Missing "up_next" entry in CSV.');
    process.exit(1);
  }

  if (bbcItems.length < 2) {
    console.warn(`⚠️ Warning: Expected 2 BBC items, found ${bbcItems.length}.`);
  }

  if (imdbItems.length < 3) {
    console.warn(`⚠️ Warning: Expected 3 IMDb items, found ${imdbItems.length}.`);
  }

  const bbc1 = bbcItems[0] || {
    content: 'https://www.bbc.com/news',
    category: 'Aviation Safety (AT)',
    title: 'BBC Aviation News Update',
    summary: 'Latest operational news and industry developments.'
  };

  const bbc2 = bbcItems[1] || {
    content: 'https://www.bbc.com/travel',
    category: 'Tourism & Leisure (AG)',
    title: 'BBC Travel Feature',
    summary: 'Global travel features, cross-cultural reports, and lifestyle stories.'
  };

  const imdb1 = imdbItems[0] || {
    content: 'https://www.imdb.com',
    category: '🇫🇷 FRENCH CINEMA',
    title: 'Curated Film 1',
    summary: 'Recommended cinema feature.'
  };

  const imdb2 = imdbItems[1] || {
    content: 'https://www.imdb.com',
    category: '🇺🇸 AMERICAN CINEMA',
    title: 'Curated Film 2',
    summary: 'Recommended cinema feature.'
  };

  const imdb3 = imdbItems[2] || {
    content: 'https://www.imdb.com',
    category: '🇰🇷 INTERNATIONAL CINEMA',
    title: 'Curated Film 3',
    summary: 'Recommended cinema feature.'
  };

  // Up Next parsing
  const noticeWeek = upNextItem.category || 'Week Notice';
  const noticeHeadline = upNextItem.title || 'Oral Fluency & Active Listening';
  const noticeStatement = upNextItem.content || upNextItem.summary || '';
  const noticeNoteType = upNextItem.summary || 'Teaching Note';

  // Build replacement HTML
  const replacementHTML = `<!-- Section Heading: Course Notices & Authentic Reading -->
          <div class="flex items-center justify-between pt-1">
            <h3 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span>📌</span>
              <span>Course Notices &amp; Authentic Reading</span>
            </h3>
            <span class="text-[10px] font-mono text-slate-400">Weekly News &amp; Articles</span>
          </div>

          <!-- Up Next & Curated BBC Media Strip (Compact Single Row) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            <!-- Box 1: Up Next / Pedagogical Notice -->
            <div class="p-3.5 sm:p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl shadow-2xs flex flex-col justify-between space-y-2">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 shadow-2xs font-mono">
                    <span>📌</span>
                    <span>${escapeHtml(noticeWeek)}</span>
                  </span>
                  <span class="text-[10px] text-amber-700 font-bold uppercase tracking-wider">${escapeHtml(noticeNoteType)}</span>
                </div>
                <h4 class="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                  ${escapeHtml(noticeHeadline)}
                </h4>
                <p class="text-[11px] text-slate-600 leading-relaxed">
                  ${escapeHtml(noticeStatement)}
                </p>
              </div>
              <div class="pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-amber-900/80 font-mono">
                <span>ENAC GSEA English</span>
                <span class="font-bold text-amber-800">${escapeHtml(noticeNoteType)}</span>
              </div>
            </div>

            <!-- Box 2: BBC Article 1 -->
            <div class="group p-3.5 sm:p-4 bg-white/95 border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col justify-between space-y-2 hover:border-slate-300 hover:shadow-xs transition-all duration-150">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#bb1919] text-white font-mono">
                    BBC NEWS
                  </span>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${escapeHtml(bbc1.category || 'Aviation Safety (AT)')}</span>
                </div>
                <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                  ${escapeHtml(bbc1.title || 'BBC Aviation Article')}
                </h4>
                <p class="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  ${escapeHtml(bbc1.summary || '')}
                </p>
              </div>
              <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span class="text-[10px] text-slate-400 font-mono">News Article</span>
                <a 
                  href="${escapeHtml(bbc1.content || '#')}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="text-xs font-bold text-slate-800 group-hover:text-amber-600 inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                  title="Read article on BBC News ↗"
                >
                  <span>Read on BBC News</span>
                  <span class="text-[10px]">↗</span>
                </a>
              </div>
            </div>

            <!-- Box 3: BBC Article 2 -->
            <div class="group p-3.5 sm:p-4 bg-white/95 border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col justify-between space-y-2 hover:border-slate-300 hover:shadow-xs transition-all duration-150">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#004f71] text-white font-mono">
                    BBC TRAVEL
                  </span>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${escapeHtml(bbc2.category || 'Tourism & Leisure (AG)')}</span>
                </div>
                <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                  ${escapeHtml(bbc2.title || 'BBC Travel Feature')}
                </h4>
                <p class="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  ${escapeHtml(bbc2.summary || '')}
                </p>
              </div>
              <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span class="text-[10px] text-slate-400 font-mono">Travel Feature</span>
                <a 
                  href="${escapeHtml(bbc2.content || '#')}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="text-xs font-bold text-slate-800 group-hover:text-amber-600 inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                  title="Read feature on BBC Travel ↗"
                >
                  <span>Read on BBC Travel</span>
                  <span class="text-[10px]">↗</span>
                </a>
              </div>
            </div>

          </div>

          <!-- Section Heading: General Culture & Cinema -->
          <div class="flex items-center justify-between pt-1">
            <h3 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span>🎬</span>
              <span>General Culture &amp; Cinema • Weekly Film Recommendations</span>
            </h3>
            <span class="text-[10px] font-mono text-slate-400">Curated International &amp; Domestic Cinema</span>
          </div>

          <!-- Weekly Film Recommendations Strip (Compact Single Row) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            ${[imdb1, imdb2, imdb3].map((film) => {
              const fullSummary = film.summary || '';
              let credits = '';
              let desc = fullSummary;
              if (fullSummary.includes('|')) {
                const parts = fullSummary.split('|');
                credits = parts[0].trim();
                desc = parts.slice(1).join('|').trim();
              }
              const defaultBadges = ['🇫🇷 FRENCH CINEMA', '🇺🇸 AMERICAN CINEMA', '🇰🇷 INTERNATIONAL CINEMA'];
              const badge = film.category || defaultBadges[0];

              return `<!-- Film Card -->
            <div class="group p-3.5 sm:p-4 bg-white/95 border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col justify-between space-y-2 hover:border-slate-300 hover:shadow-xs transition-all duration-150">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono">
                    ${escapeHtml(badge)}
                  </span>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Curated Cinema</span>
                </div>
                <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-1">
                  ${escapeHtml(film.title || 'Film Recommendation')}
                </h4>
                ${credits ? `<p class="text-[10px] text-slate-500 font-mono">${escapeHtml(credits)}</p>` : ''}
                <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                  ${escapeHtml(desc)}
                </p>
              </div>
              <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#f5c518] text-slate-950 font-black font-mono text-[9px] tracking-tight">
                  IMDb
                </span>
                <a 
                  href="${escapeHtml(film.content || '#')}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="text-xs font-bold text-slate-800 group-hover:text-amber-600 inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                  title="View on IMDb ↗"
                >
                  <span>View on IMDb</span>
                  <span class="text-[10px]">↗</span>
                </a>
              </div>
            </div>`;
            }).join('\n\n            ')}

          </div>`;

  let indexHTML = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
  const startMarker = '<!-- MEDIA_UPDATE_START -->';
  const endMarker = '<!-- MEDIA_UPDATE_END -->';

  const startIndex = indexHTML.indexOf(startMarker);
  const endIndex = indexHTML.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    console.error(`❌ Error: Could not locate ${startMarker} or ${endMarker} markers in ${INDEX_HTML_PATH}`);
    process.exit(1);
  }

  const updatedHTML = indexHTML.slice(0, startIndex + startMarker.length) + '\n          ' +
                      replacementHTML + '\n          ' +
                      indexHTML.slice(endIndex);

  // Safety check: ensure forbidden word "faculty" is not introduced
  if (replacementHTML.toLowerCase().includes('faculty')) {
    console.error('❌ Prohibited term "faculty" detected in replacement HTML! Aborting update.');
    process.exit(1);
  }

  fs.writeFileSync(INDEX_HTML_PATH, updatedHTML, 'utf8');
  console.log('✅ index.html media sections updated successfully!');
  console.log(`📌 Up Next Notice: "${noticeHeadline}"`);
  console.log(`📰 BBC Articles: "${bbc1.title}" & "${bbc2.title}"`);
  console.log(`🎬 IMDb Films: "${imdb1.title}", "${imdb2.title}", "${imdb3.title}"`);
}

main();

