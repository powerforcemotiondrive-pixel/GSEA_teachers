/* --- WEEKLY_NOTICEBOARD_DATA_START --- */
const WEEKLY_NOTICEBOARD_DATA = {
  "upNext": {
    "week": "Week 47 • Notice",
    "tag": "Teaching Note",
    "headline": "Oral Fluency & FE1 Mock Evaluations",
    "statement": "Week 47: Oral fluency practice and FE1 mock evaluations."
  },
  "articles": [
    {
      "source": "BBC NEWS",
      "sourceBg": "bg-[#bb1919]",
      "category": "Aviation Safety (AT)",
      "tag": "News Article",
      "title": "Spate of Bomb Threats Poses Serious Challenge to Airline Industry",
      "summary": "After a week of disruption, airlines are facing both safety and financial concerns as civil aviation authorities respond to wave of disruptions.",
      "url": "https://www.bbc.com/news/articles/cv8ezz9yn6pyo"
    },
    {
      "source": "BBC TRAVEL",
      "sourceBg": "bg-[#004f71]",
      "category": "Tourism & Leisure (AG)",
      "tag": "Travel Feature",
      "title": "Top Five 'Chippies' in London",
      "summary": "An undercover reviewer rates traditional UK fish and chip shops, highlighting five classic London spots preserving culinary heritage.",
      "url": "https://www.bbc.com/travel/article/20261106-where-to-get-the-best-fish-and-chips-in-london"
    }
  ],
  "films": [
    {
      "badge": "🇫🇷 FRENCH CINEMA",
      "title": "Le Corset (Iron Boy) (2026)",
      "credits": "Dir. Louis Clichy • Beauce, France",
      "desc": "An 11-year-old boy in rural Beauce navigates scoliosis and medical isolation, finding his voice and connection through music.",
      "url": "https://www.imdb.com/title/tt36639956/"
    },
    {
      "badge": "🇬🇧 BRITISH / AMERICAN CINEMA",
      "title": "Wild Horse Nine (2026)",
      "credits": "Dir. Martin McDonagh • Starring John Malkovich & Sam Rockwell",
      "desc": "A dark comedy crime thriller following an eccentric ensemble facing escalating tensions in a high-stakes standoff.",
      "url": "https://www.imdb.com/title/tt15799564/"
    },
    {
      "badge": "🇰🇷 INTERNATIONAL CINEMA",
      "title": "Possible Love (가능한 사랑) (2026)",
      "credits": "Dir. Lee Chang-dong • Starring Jeon Do-yeon & Sol Kyung-gu",
      "desc": "An emotional Korean drama tracing past bonds and unspoken regrets between two longtime acquaintances.",
      "url": "https://www.imdb.com/title/tt37803364/"
    }
  ]
};
/* --- WEEKLY_NOTICEBOARD_DATA_END --- */

// ============================================================================
    function renderOverviewTab(sem) {
      const allStudentsCount = ((sem.students?.groupA || []).length) + 
                               ((sem.students?.groupB || []).length) + 
                               ((sem.students?.groupC || []).length) + 
                               ((sem.students?.groupD || []).length);
      const facultyList = sem.faculty || [];
      const grpKeys = Object.keys(sem.students || {}).filter(k => (sem.students[k] || []).length > 0);
      const grpLabels = grpKeys.map(k => k.replace('group', '')).join('/');

      return `
        <div class="space-y-4 sm:space-y-5">
          <!-- Hero Banner with Photography (Inverted: Text Left, Photo Right) -->
          <div class="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200">
            <div class="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <!-- Left Executive Overview Column -->
              <div class="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div class="space-y-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black shadow-2xs">
                      Teachers Dashboard
                    </span>
                    <span class="text-xs text-slate-500 font-mono font-medium">
                      Active Promotion: <strong>${sem.promotion || 'GSEA26A'}</strong>
                    </span>
                  </div>

                  <h2 class="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
                    Welcome to the GSEA English Teachers Hub
                  </h2>

                  <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    This central dashboard unifies course scheduling, 30-minute oral tutorial rotas, attendance management, official continuous assessment scoring, and live student portfolio compliance tracking for <strong>${sem.title}</strong>.
                  </p>

                  <div class="pt-1">
                    <a 
                      href="${sem.ecampusUrl || 'https://e-campus.enac.fr/moodle/my/'}" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm group w-fit border border-slate-700"
                      title="Open official ENAC eCampus Moodle space for ${sem.title}"
                    >
                      <img src="images/enac_logo_white.png" alt="ENAC" class="h-3.5 w-auto object-contain opacity-90">
                      <span>Open ${sem.title} on eCampus</span>
                      <span class="text-amber-400 group-hover:translate-x-0.5 transition-transform text-xs">↗</span>
                    </a>
                  </div>
                </div>

                <!-- Quick Snapshot Metrics -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
                  <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Promotion</span>
                    <span class="text-xs sm:text-sm font-black text-slate-800 font-mono">${sem.promotion || 'GSEA26A'}</span>
                    <span class="text-[10px] text-slate-500 block">${allStudentsCount} Students (${grpLabels || 'A/B'})</span>
                  </div>
                  <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Teachers</span>
                    <span class="text-xs sm:text-sm font-black text-slate-800 font-mono">${facultyList.length} Teachers</span>
                    <span class="text-[10px] text-slate-500 block">${sem.teacherFocus || 'General &amp; Technical'}</span>
                  </div>
                  <div class="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 col-span-2 sm:col-span-1">
                    <span class="text-[10px] uppercase font-bold text-amber-800 block tracking-wider">Next Milestone</span>
                    <span class="text-xs sm:text-sm font-black text-slate-900 font-mono">${sem.nextMilestone?.title || 'FE1 Tutorial'}</span>
                    <span class="text-[10px] text-amber-700 block">${sem.nextMilestone?.sub || 'Oral Exam'}</span>
                  </div>
                </div>
              </div>

              <!-- Right Visual / Photography Column -->
              <div class="lg:col-span-5 relative min-h-[200px] sm:min-h-[240px] bg-slate-900">
                <img 
                  src="images/course_admin.jpg" 
                  alt="ENAC English Course Administration" 
                  class="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent flex flex-col justify-end p-5 text-white">
                  <span class="text-[10px] font-black uppercase tracking-wider text-amber-300 font-mono">
                    Official Teaching Platform
                  </span>
                  <h3 class="text-base sm:text-lg font-bold mt-0.5">
                    ENAC • Département Langues (LH/LAN)
                  </h3>
                  <p class="text-xs text-slate-300 font-medium">
                    ${sem.title} • ${sem.tracks}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Unified Weekly Noticeboard and Culture / Media Panel -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <!-- Panel Header Ribbon with Purpose Banner -->
            <div class="px-4 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
              <div class="flex items-center gap-2.5">
                <span class="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                <div>
                  <h3 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                    WEEKLY NOTICEBOARD AND CULTURE / MEDIA
                  </h3>
                  <p class="text-[11px] text-slate-300 font-normal">
                    Weekly teaching focus, short conversational warm-ups for the start of class, and independent cultural listening recommendations.
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  type="button" 
                  onclick="openMediaArchiveModal('news')" 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors cursor-pointer border border-slate-700"
                  title="View previous articles"
                >
                  <span>Past Articles</span>
                  <span id="news-archive-badge" class="px-1.5 py-0.2 bg-slate-700 text-slate-200 rounded-full font-mono text-[9.5px]">${(window.MEDIA_ARCHIVE_DATA?.news || []).length}</span>
                </button>
                <button 
                  type="button" 
                  onclick="openMediaArchiveModal('films')" 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors cursor-pointer border border-slate-700"
                  title="View previous film recommendations"
                >
                  <span>Past Films</span>
                  <span id="films-archive-badge" class="px-1.5 py-0.2 bg-slate-700 text-slate-200 rounded-full font-mono text-[9.5px]">${(window.MEDIA_ARCHIVE_DATA?.films || []).length}</span>
                </button>
              </div>
            </div>

            <!-- Featured Announcement: NEW Listening / Live Traffic Practice Hub -->
            <a href="https://e-campus.enac.fr/moodle/mod/scorm/view.php?id=270051" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-amber-50 via-amber-100/80 to-orange-50 border-b border-amber-300/80 px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:from-amber-100 hover:to-orange-100/90 transition-colors">
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="w-11 h-11 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30 flex items-center justify-center shrink-0">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="bg-amber-600 text-white text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">NEW &bull; BETA</span>
                    <span class="text-sm sm:text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors">NEW Listening / Live Traffic Practice Hub</span>
                  </div>
                  <p class="text-[11.5px] text-slate-700 mt-0.5">Interactive ATC radio recordings, ICAO Ground Ops &amp; Pilot Calls &mdash; now live on eCampus for student practice.</p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 group-hover:bg-amber-700 text-white text-xs font-bold shadow-xs shrink-0 self-start sm:self-center transition-colors">
                Open on eCampus &nearr;
              </span>
            </a>

            <!-- Two-Column Briefing Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              
              <!-- Left Column: Noticeboard & Speaking Warm-ups -->
              <div class="p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div class="space-y-3.5">
                  <div class="pb-1.5 border-b border-slate-100">
                    <span class="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                      Classroom Speaking Warm-ups (AT &amp; AG)
                    </span>
                    <p class="text-[11px] text-slate-500 mt-0.5">
                      Weekly teaching priorities and 5-minute BBC topical articles to activate student speaking at the beginning of each session.
                    </p>
                  </div>

                  <!-- Up Next Notice Banner (Quiet Amber Left-Rail Highlight) -->
                  <div class="p-3.5 bg-white border border-slate-200/90 rounded-xl flex flex-col gap-1.5 shadow-2xs">
                    <div class="flex items-center justify-between">
                      <span class="text-[9.5px] font-bold uppercase tracking-wider text-slate-700 font-mono">
                        ${escapeHtml(WEEKLY_NOTICEBOARD_DATA.upNext?.week || 'Weekly Notice')}
                      </span>
                      <span class="text-[9.5px] text-amber-700 font-bold uppercase tracking-wider font-mono">${escapeHtml(WEEKLY_NOTICEBOARD_DATA.upNext?.tag || 'Teaching Focus')}</span>
                    </div>
                    <div class="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      ${escapeHtml(WEEKLY_NOTICEBOARD_DATA.upNext?.headline || 'Weekly Teaching Focus')}
                    </div>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                      ${escapeHtml(WEEKLY_NOTICEBOARD_DATA.upNext?.statement || '')}
                    </p>
                  </div>

                  <!-- BBC Articles List -->
                  ${(WEEKLY_NOTICEBOARD_DATA.articles || []).map(a => `
                  <div class="group p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between space-y-1.5">
                    <div class="space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${a.sourceBg || 'bg-[#bb1919]'} text-white font-mono">
                          ${escapeHtml(a.source || 'BBC NEWS')}
                        </span>
                        <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">${escapeHtml(a.category || '')}</span>
                      </div>
                      <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                        ${escapeHtml(a.title || '')}
                      </h4>
                      <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        ${escapeHtml(a.summary || '')}
                      </p>
                    </div>
                    <div class="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span class="text-[10px] text-slate-400 font-mono">${escapeHtml(a.tag || 'News Article')}</span>
                      <a 
                        href="${escapeHtml(a.url || '#')}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="text-xs font-bold text-slate-800 group-hover:text-amber-600 inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                        title="Read on ${escapeHtml(a.source || 'BBC')} ↗"
                      >
                        <span>Read on ${escapeHtml(a.source || 'BBC')}</span>
                        <span class="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>`).join('')}

                </div>
              </div>

              <!-- Right Column: Curated Cultural Cinema & Listening -->
              <div class="p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div class="space-y-3">
                  <div class="pb-1.5 border-b border-slate-100">
                    <span class="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                      Cultural Cinema &amp; Independent Listening
                    </span>
                    <p class="text-[11px] text-slate-500 mt-0.5">
                      Curated weekly film suggestions (French, British/American, and International) for students to practice listening comprehension outside class.
                    </p>
                  </div>

                  <!-- Film Cards List -->
                  ${(WEEKLY_NOTICEBOARD_DATA.films || []).map(f => `
                  <div class="group p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between space-y-1.5">
                    <div class="space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono">
                          ${escapeHtml(f.badge || 'CINEMA')}
                        </span>
                        <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Curated Cinema</span>
                      </div>
                      <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-1">
                        ${escapeHtml(f.title || '')}
                      </h4>
                      ${f.credits ? `<p class="text-[10px] text-slate-500 font-mono">${escapeHtml(f.credits)}</p>` : ''}
                      <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        ${escapeHtml(f.desc || '')}
                      </p>
                    </div>
                    <div class="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#f5c518] text-slate-950 font-black font-mono text-[9px] tracking-tight">
                        IMDb
                      </span>
                      <a 
                        href="${escapeHtml(f.url || '#')}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="text-xs font-bold text-slate-800 group-hover:text-amber-600 inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                        title="View on IMDb ↗"
                      >
                        <span>View on IMDb</span>
                        <span class="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>`).join('')}

                </div>
              </div>

            </div>
          </div>

          <!-- Section: Recent Aviation Live Traffic -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <!-- Panel Header Ribbon with Purpose Banner -->
            <div class="px-4 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
              <div class="flex items-center gap-2.5">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
                <div>
                  <h3 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                    Recent Aviation Live Traffic &amp; ATC Debriefs
                  </h3>
                  <p class="text-[11px] text-slate-300 font-normal">
                    Curated authentic air traffic recordings from VASAviation with operational summaries and classroom speaking prompts.
                  </p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10.5px] font-bold shrink-0">
                <svg class="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                <span>VASAviation (2 Cases Max)</span>
              </span>
            </div>

            <!-- Stacked Deep Video Cards -->
            <div class="divide-y divide-slate-200">
              
              <!-- Case 1: Runway Evacuation (DFW) -->
              <div class="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <!-- Video Player Column (Deep 16:9 on Desktop) -->
                <div class="lg:col-span-7 flex flex-col space-y-2.5">
                  <div class="flex items-center justify-between gap-2">
                    <span class="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-rose-300 border border-slate-800 font-mono">
                      CASE 01 • ACTIVE RUNWAY EVACUATION
                    </span>
                    <span class="text-[10.5px] text-slate-500 font-mono">Dallas/Fort Worth (DFW) • Rwy 17L</span>
                  </div>
                  <h4 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    Plane EVACUATING ON RUNWAY at Busy DFW | Smoke on Board!
                  </h4>
                  <div class="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-300 shadow-md">
                    <iframe class="w-full h-full" src="https://www.youtube-nocookie.com/embed/-LDLo2WhCIU" title="Plane EVACUATING ON RUNWAY at Busy DFW | Smoke on Board!" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div class="flex items-center justify-between pt-1 text-[11px]">
                    <span class="text-[10px] text-slate-400 font-mono">Channel: VASAviation • Authentic ATC Audio &amp; Radar Animation</span>
                    <a 
                      href="https://www.youtube.com/watch?v=-LDLo2WhCIU" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="text-xs font-bold text-slate-800 hover:text-amber-600 inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                      title="Watch on YouTube ↗"
                    >
                      <span>Watch on YouTube</span>
                      <span class="text-[10px]">↗</span>
                    </a>
                  </div>
                </div>

                <!-- Debrief & Teaching Prompts Column -->
                <div class="lg:col-span-5 flex flex-col justify-between space-y-3.5 bg-slate-50/90 rounded-xl p-4 sm:p-5 border border-slate-200">
                  <div class="space-y-3">
                    <div class="border-b border-slate-200 pb-2">
                      <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Operational Incident Debrief</span>
                      <h5 class="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">Emergency Stop, ARFF Rollout &amp; Traffic Diversion</h5>
                    </div>

                    <div class="space-y-2 text-xs text-slate-600 leading-relaxed">
                      <p>
                        <strong class="text-slate-800">Situation:</strong> An American Airlines Boeing 737 declares an emergency on final approach reporting dense smoke in the passenger cabin. The aircraft comes to a complete halt directly on active Runway 17L and deploys evacuation slides.
                      </p>
                      <p>
                        <strong class="text-slate-800">Phraseology &amp; ATC Coordination:</strong> Tower controller immediately coordinates Airport Rescue &amp; Firefighting (ARFF), halts departures, and transmits rapid go-around instructions (<em class="text-slate-800 font-mono text-[11px]">"Go around, aircraft evacuating on runway"</em>) to closely trailing arrivals.
                      </p>
                    </div>

                    <!-- Classroom Discussion Box (Quiet Amber Left-Rail) -->
                    <div class="p-3 bg-white border border-slate-200/90 rounded-lg space-y-1.5 shadow-2xs">
                      <div class="text-[10px] font-bold text-slate-800 uppercase tracking-wider font-mono">
                        Classroom Discussion Prompts
                      </div>
                      <ul class="text-[11.5px] text-slate-600 space-y-1 list-disc list-inside">
                        <li>How does the local controller prioritize workload between the emergency aircraft and trailing traffic?</li>
                        <li>Listen to the readbacks: what standard phraseology ensures ARFF vehicles enter the active runway safely?</li>
                      </ul>
                    </div>
                  </div>

                  <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[10.5px] text-slate-500 font-mono">
                    <span>Target Level: B1+/B2</span>
                    <span>Track Focus: Technical English (AT)</span>
                  </div>
                </div>
              </div>

              <!-- Case 2: Taxiway Collision -->
              <div class="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <!-- Video Player Column (Deep 16:9 on Desktop) -->
                <div class="lg:col-span-7 flex flex-col space-y-2.5">
                  <div class="flex items-center justify-between gap-2">
                    <span class="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800 font-mono">
                      CASE 02 • APRON &amp; TAXIWAY COLLISION
                    </span>
                    <span class="text-[10.5px] text-slate-500 font-mono">Ground Movement Incident &amp; Damage</span>
                  </div>
                  <h4 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    Two Planes COLLIDE During Taxi | This Error Caused Severe Damage!
                  </h4>
                  <div class="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-300 shadow-md">
                    <iframe class="w-full h-full" src="https://www.youtube-nocookie.com/embed/i4IePwbw8kU" title="Two Planes COLLIDE During Taxi | This Error Caused Severe Damage!" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div class="flex items-center justify-between pt-1 text-[11px]">
                    <span class="text-[10px] text-slate-400 font-mono">Channel: VASAviation • Authentic Ground Control Recordings</span>
                    <a 
                      href="https://www.youtube.com/watch?v=i4IePwbw8kU" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="text-xs font-bold text-slate-800 hover:text-amber-600 inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                      title="Watch on YouTube ↗"
                    >
                      <span>Watch on YouTube</span>
                      <span class="text-[10px]">↗</span>
                    </a>
                  </div>
                </div>

                <!-- Debrief & Teaching Prompts Column -->
                <div class="lg:col-span-5 flex flex-col justify-between space-y-3.5 bg-slate-50/90 rounded-xl p-4 sm:p-5 border border-slate-200">
                  <div class="space-y-3">
                    <div class="border-b border-slate-200 pb-2">
                      <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Operational Incident Debrief</span>
                      <h5 class="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">Spatial Awareness &amp; Progressive Taxi Readback</h5>
                    </div>

                    <div class="space-y-2 text-xs text-slate-600 leading-relaxed">
                      <p>
                        <strong class="text-slate-800">Situation:</strong> Two commercial aircraft make wingtip contact during ground taxiing near a congested ramp intersection. One aircraft clips the horizontal stabilizer and wing of the second aircraft, inflicting substantial structural damage.
                      </p>
                      <p>
                        <strong class="text-slate-800">Phraseology &amp; Communication Breakdown:</strong> Analysis highlights ambiguous position reports, spatial clearance misunderstandings on narrow taxiways, and the critical importance of progressive taxi instructions when ground visibility or wingtip clearance is in doubt.
                      </p>
                    </div>

                    <!-- Classroom Discussion Box (Quiet Amber Left-Rail) -->
                    <div class="p-3 bg-white border border-slate-200/90 rounded-lg space-y-1.5 shadow-2xs">
                      <div class="text-[10px] font-bold text-slate-800 uppercase tracking-wider font-mono">
                        Classroom Discussion Prompts
                      </div>
                      <ul class="text-[11.5px] text-slate-600 space-y-1 list-disc list-inside">
                        <li>Where did the miscommunication or spatial assumption occur between pilots and ground control?</li>
                        <li>What standard phraseology should a flight crew use if wingtip clearance behind or beside another taxiing aircraft appears doubtful?</li>
                      </ul>
                    </div>
                  </div>

                  <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[10.5px] text-slate-500 font-mono">
                    <span>Target Level: B1+/B2</span>
                    <span>Track Focus: Ground Operations &amp; Safety</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      `;
    }

    // ============================================================================
    // TAB 4: EVALUATIONS (MERGED GRADING & RUBRICS)
