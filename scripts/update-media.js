/**
 * GSEA Teachers Portal — Automated Weekly Media & Film Recommendations Updater
 * With Discreet Minimalist Archive Modal Support (Option 1)
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
 * 
 * Archive Storage:
 *   data/media-archive.json
 *   Stores simple { title, url } list for discreet popup window.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const TAB_OVERVIEW_JS_PATH = path.join(ROOT_DIR, 'src', 'js', '04-tab-overview.js');
const MEDIA_ARCHIVE_JS_PATH = path.join(ROOT_DIR, 'src', 'js', '10-media-archive.js');
const buildHtml = require('./build-html');
const DEFAULT_CSV_PATH = path.join(ROOT_DIR, 'data', 'media-latest.csv');
const EXAMPLE_CSV_PATH = path.join(ROOT_DIR, 'data', 'media-latest.example.csv');
const ARCHIVE_JSON_PATH = path.join(ROOT_DIR, 'data', 'media-archive.json');

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

function loadArchive() {
  if (fs.existsSync(ARCHIVE_JSON_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(ARCHIVE_JSON_PATH, 'utf8'));
      return {
        newsArchive: Array.isArray(data.newsArchive) ? data.newsArchive : [],
        filmsArchive: Array.isArray(data.filmsArchive) ? data.filmsArchive : []
      };
    } catch (e) {
      console.warn('⚠️ Could not parse media-archive.json, starting fresh.', e.message);
    }
  }
  return { newsArchive: [], filmsArchive: [] };
}

function saveArchive(archive) {
  fs.writeFileSync(ARCHIVE_JSON_PATH, JSON.stringify(archive, null, 2), 'utf8');
  console.log(`💾 Saved archive: ${archive.newsArchive.length} news stories, ${archive.filmsArchive.length} films.`);
}

function extractActiveItemsFromHTML(html) {
  const extractedNews = [];
  const extractedFilms = [];

  const startMarker = '<!-- MEDIA_UPDATE_START -->';
  const endMarker = '<!-- MEDIA_UPDATE_END -->';
  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);
  const mediaSlice = (startIdx !== -1 && endIdx !== -1) ? html.substring(startIdx, endIdx) : html;

  // Robust card-based extraction within the active media section
  const cards = mediaSlice.split(/<div\s+class="group\s+/);

  for (const card of cards) {
    if (card.includes('title="Read on BBC')) {
      const titleMatch = card.match(/<h4[^>]*>\s*([^<]+?)\s*<\/h4>/);
      const urlMatch = card.match(/href="([^"]+)"[^>]*title="Read on BBC/);
      if (titleMatch && urlMatch) {
        const title = titleMatch[1].trim().replace(/&amp;/g, '&');
        const url = urlMatch[1].trim();
        if (url && !url.includes('#')) {
          extractedNews.push({ title, url });
        }
      }
    } else if (card.includes('title="View on IMDb')) {
      const titleMatch = card.match(/<h4[^>]*>\s*([^<]+?)\s*<\/h4>/);
      const creditsMatch = card.match(/<p[^>]*class="[^"]*font-mono[^"]*"[^>]*>\s*([^<]+?)\s*<\/p>/);
      const urlMatch = card.match(/href="([^"]+)"[^>]*title="View on IMDb/);
      if (titleMatch && urlMatch) {
        const rawTitle = titleMatch[1].trim().replace(/&amp;/g, '&');
        const credits = creditsMatch ? creditsMatch[1].trim().replace(/&amp;/g, '&') : '';
        const url = urlMatch[1].trim();
        if (url && !url.includes('#')) {
          const displayTitle = credits ? `${rawTitle} • ${credits}` : rawTitle;
          extractedFilms.push({ title: displayTitle, url });
        }
      }
    }
  }

  return { extractedNews, extractedFilms };
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
    category: '🇬🇧 BRITISH / AMERICAN CINEMA',
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
  const noticeTag = upNextItem.summary || 'Teaching Note';

  let indexHTML = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

  // Load and update archive
  const archive = loadArchive();
  const { extractedNews, extractedFilms } = extractActiveItemsFromHTML(indexHTML);

  const incomingBBCUrls = [bbc1.content, bbc2.content].map(u => (u || '').trim());
  const incomingImdbUrls = [imdb1.content, imdb2.content, imdb3.content].map(u => (u || '').trim());

  // Harvest outgoing items
  extractedNews.forEach(item => {
    if (!incomingBBCUrls.includes(item.url) && !archive.newsArchive.some(a => a.url === item.url)) {
      archive.newsArchive.unshift(item);
    }
  });

  extractedFilms.forEach(item => {
    if (!incomingImdbUrls.includes(item.url) && !archive.filmsArchive.some(a => a.url === item.url)) {
      archive.filmsArchive.unshift(item);
    }
  });

  saveArchive(archive);

  const newsCount = archive.newsArchive.length;
  const filmsCount = archive.filmsArchive.length;

  const bbc1IsTravel = (bbc1.category || '').toLowerCase().includes('travel') || (bbc1.content || '').includes('/travel/');
  const bbc2IsTravel = (bbc2.category || '').toLowerCase().includes('travel') || (bbc2.content || '').includes('/travel/');

  // Construct structured weekly noticeboard data object
  const noticeboardData = {
    upNext: {
      week: noticeWeek,
      tag: noticeTag,
      headline: noticeHeadline,
      statement: noticeStatement
    },
    articles: [
      {
        source: bbc1IsTravel ? 'BBC TRAVEL' : 'BBC NEWS',
        sourceBg: bbc1IsTravel ? 'bg-[#004f71]' : 'bg-[#bb1919]',
        category: bbc1.category || 'Aviation Safety (AT)',
        tag: bbc1IsTravel ? 'Travel Feature' : 'News Article',
        title: bbc1.title || 'BBC Article',
        summary: bbc1.summary || '',
        url: bbc1.content || '#'
      },
      {
        source: bbc2IsTravel ? 'BBC TRAVEL' : 'BBC NEWS',
        sourceBg: bbc2IsTravel ? 'bg-[#004f71]' : 'bg-[#bb1919]',
        category: bbc2.category || 'Tourism & Leisure (AG)',
        tag: bbc2IsTravel ? 'Travel Feature' : 'News Article',
        title: bbc2.title || 'BBC Article',
        summary: bbc2.summary || '',
        url: bbc2.content || '#'
      }
    ],
    films: [imdb1, imdb2, imdb3].map((film, fIdx) => {
      const fullSummary = film.summary || '';
      let credits = '';
      let desc = fullSummary;
      if (fullSummary.includes('|')) {
        const parts = fullSummary.split('|');
        credits = parts[0].trim();
        desc = parts.slice(1).join('|').trim();
      }
      const defaultBadges = ['🇫🇷 FRENCH CINEMA', '🇬🇧 BRITISH / AMERICAN CINEMA', '🇰🇷 INTERNATIONAL CINEMA'];
      const badge = film.category || defaultBadges[fIdx] || defaultBadges[0];
      return {
        badge: badge,
        title: film.title || 'Film Recommendation',
        credits: credits,
        desc: desc,
        url: film.content || '#'
      };
    })
  };

  // 1. Synchronize structured data in src/js/04-tab-overview.js
  const nbStart = '/* --- WEEKLY_NOTICEBOARD_DATA_START --- */';
  const nbEnd = '/* --- WEEKLY_NOTICEBOARD_DATA_END --- */';

  if (fs.existsSync(TAB_OVERVIEW_JS_PATH)) {
    let tabOverview = fs.readFileSync(TAB_OVERVIEW_JS_PATH, 'utf8');
    const sIdx = tabOverview.indexOf(nbStart);
    const eIdx = tabOverview.indexOf(nbEnd);
    if (sIdx !== -1 && eIdx !== -1) {
      const nbReplacement = `${nbStart}\nconst WEEKLY_NOTICEBOARD_DATA = ${JSON.stringify(noticeboardData, null, 2)};\n${nbEnd}`;
      tabOverview = tabOverview.slice(0, sIdx) + nbReplacement + tabOverview.slice(eIdx + nbEnd.length);
      fs.writeFileSync(TAB_OVERVIEW_JS_PATH, tabOverview, 'utf8');
      console.log('  ✓ Synchronized WEEKLY_NOTICEBOARD_DATA in src/js/04-tab-overview.js');
    } else {
      console.warn('  ⚠️ Could not find WEEKLY_NOTICEBOARD_DATA tags in src/js/04-tab-overview.js');
    }
  }

  // 2. Synchronize archive data in src/js/10-media-archive.js
  const archiveStartMarker = '// <!-- MEDIA_ARCHIVE_DATA_START -->';
  const archiveEndMarker = '// <!-- MEDIA_ARCHIVE_DATA_END -->';

  if (fs.existsSync(MEDIA_ARCHIVE_JS_PATH)) {
    let mediaArchive = fs.readFileSync(MEDIA_ARCHIVE_JS_PATH, 'utf8');
    const aSIdx = mediaArchive.indexOf(archiveStartMarker);
    const aEIdx = mediaArchive.indexOf(archiveEndMarker);
    if (aSIdx !== -1 && aEIdx !== -1) {
      const archiveScript = `${archiveStartMarker}\nwindow.MEDIA_ARCHIVE_DATA = ${JSON.stringify(
        { news: archive.newsArchive, films: archive.filmsArchive },
        null,
        2
      )};\n${archiveEndMarker}`;
      mediaArchive = mediaArchive.slice(0, aSIdx) + archiveScript + mediaArchive.slice(aEIdx + archiveEndMarker.length);
      fs.writeFileSync(MEDIA_ARCHIVE_JS_PATH, mediaArchive, 'utf8');
      console.log('  ✓ Synchronized window.MEDIA_ARCHIVE_DATA in src/js/10-media-archive.js');
    }
  }

  // 3. Recompile index.html from modular source modules
  buildHtml();
  console.log('✅ Modular source and index.html media sections updated successfully!');
  console.log(`📌 Up Next Notice: "${noticeHeadline}"`);
  console.log(`📰 BBC Articles: "${bbc1.title}" & "${bbc2.title}"`);
  console.log(`🎬 IMDb Films: "${imdb1.title}", "${imdb2.title}", "${imdb3.title}"`);
  console.log(`📁 Archive: ${archive.newsArchive.length} news stories, ${archive.filmsArchive.length} films.`);
}

main();
