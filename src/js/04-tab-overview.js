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

          <!-- MEDIA_UPDATE_START -->
          <!-- Unified Weekly Operational Briefings & Cultural Media Panel -->
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
                  <span>📁</span>
                  <span>Past Articles</span>
                  <span id="news-archive-badge" class="px-1.5 py-0.2 bg-slate-700 text-slate-200 rounded-full font-mono text-[9.5px]">2</span>
                </button>
                <button 
                  type="button" 
                  onclick="openMediaArchiveModal('films')" 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-colors cursor-pointer border border-slate-700"
                  title="View previous film recommendations"
                >
                  <span>📁</span>
                  <span>Past Films</span>
                  <span id="films-archive-badge" class="px-1.5 py-0.2 bg-slate-700 text-slate-200 rounded-full font-mono text-[9.5px]">5</span>
                </button>
              </div>
            </div>

            <!-- Two-Column Briefing Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              
              <!-- Left Column: Noticeboard & Speaking Warm-ups -->
              <div class="p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div class="space-y-3.5">
                  <div class="pb-1.5 border-b border-slate-100">
                    <span class="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <span>📌</span> Classroom Speaking Warm-ups (AT &amp; AG)
                    </span>
                    <p class="text-[11px] text-slate-500 mt-0.5">
                      Weekly teaching priorities and 5-minute BBC topical articles to activate student speaking at the beginning of each session.
                    </p>
                  </div>

                  <!-- Up Next Notice Banner -->
                  <div class="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl flex flex-col gap-1.5">
                    <div class="flex items-center justify-between">
                      <span class="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono shadow-2xs">
                        <span>📌</span> Week 47 • Notice
                      </span>
                      <span class="text-[10px] text-amber-800 font-bold uppercase tracking-wider font-mono">Teaching Note</span>
                    </div>
                    <div class="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      Oral Fluency &amp; FE1 Mock Evaluations
                    </div>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                      Week 47: Oral fluency practice and FE1 mock evaluations.
                    </p>
                  </div>

                  <!-- BBC Article 1 -->
                  <div class="group p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between space-y-1.5">
                    <div class="space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#bb1919] text-white font-mono">
                          BBC NEWS
                        </span>
                        <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Aviation Safety (AT)</span>
                      </div>
                      <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                        Spate of Bomb Threats Poses Serious Challenge to Airline Industry
                      </h4>
                      <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        After a week of disruption, airlines are facing both safety and financial concerns as civil aviation authorities respond to wave of disruptions.
                      </p>
                    </div>
                    <div class="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span class="text-[10px] text-slate-400 font-mono">News Article</span>
                      <a 
                        href="https://www.bbc.com/news/articles/cv8ezz9yn6pyo" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="text-xs font-bold text-slate-800 group-hover:text-amber-600 inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                        title="Read on BBC News ↗"
                      >
                        <span>Read on BBC News</span>
                        <span class="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>

                  <!-- BBC Article 2 -->
                  <div class="group p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between space-y-1.5">
                    <div class="space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#004f71] text-white font-mono">
                          BBC TRAVEL
                        </span>
                        <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tourism &amp; Leisure (AG)</span>
                      </div>
                      <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                        Top Five 'Chippies' in London
                      </h4>
                      <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        An undercover reviewer rates traditional UK fish and chip shops, highlighting five classic London spots preserving culinary heritage.
                      </p>
                    </div>
                    <div class="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span class="text-[10px] text-slate-400 font-mono">Travel Feature</span>
                      <a 
                        href="https://www.bbc.com/travel/article/20261106-where-to-get-the-best-fish-and-chips-in-london" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="text-xs font-bold text-slate-800 group-hover:text-amber-600 inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                        title="Read on BBC Travel ↗"
                      >
                        <span>Read on BBC Travel</span>
                        <span class="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Right Column: Curated Cultural Cinema & Listening -->
              <div class="p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div class="space-y-3">
                  <div class="pb-1.5 border-b border-slate-100">
                    <span class="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <span>🎬</span> Cultural Cinema &amp; Independent Listening
                    </span>
                    <p class="text-[11px] text-slate-500 mt-0.5">
                      Curated weekly film suggestions (French, British/American, and International) for students to practice listening comprehension outside class.
                    </p>
                  </div>

                  <!-- Film Card -->
                  <div class="group p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between space-y-1.5">
                    <div class="space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono">
                          🇫🇷 FRENCH CINEMA
                        </span>
                        <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Curated Cinema</span>
                      </div>
                      <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-1">
                        Le Corset (Iron Boy) (2026)
                      </h4>
                      <p class="text-[10px] text-slate-500 font-mono">Dir. Louis Clichy • Beauce, France</p>
                      <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        An 11-year-old boy in rural Beauce navigates scoliosis and medical isolation, finding his voice and connection through music.
                      </p>
                    </div>
                    <div class="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#f5c518] text-slate-950 font-black font-mono text-[9px] tracking-tight">
                        IMDb
                      </span>
                      <a 
                        href="https://www.imdb.com/title/tt36639956/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="text-xs font-bold text-slate-800 group-hover:text-amber-600 inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                        title="View on IMDb ↗"
                      >
                        <span>View on IMDb</span>
                        <span class="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>

                  <!-- Film Card -->
                  <div class="group p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between space-y-1.5">
                    <div class="space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono">
                          🇬🇧 BRITISH / AMERICAN CINEMA
                        </span>
                        <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Curated Cinema</span>
                      </div>
                      <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-1">
                        Wild Horse Nine (2026)
                      </h4>
                      <p class="text-[10px] text-slate-500 font-mono">Dir. Martin McDonagh • Starring John Malkovich &amp; Sam Rockwell</p>
                      <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        A dark comedy crime thriller following an eccentric ensemble facing escalating tensions in a high-stakes standoff.
                      </p>
                    </div>
                    <div class="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#f5c518] text-slate-950 font-black font-mono text-[9px] tracking-tight">
                        IMDb
                      </span>
                      <a 
                        href="https://www.imdb.com/title/tt15799564/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="text-xs font-bold text-slate-800 group-hover:text-amber-600 inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                        title="View on IMDb ↗"
                      >
                        <span>View on IMDb</span>
                        <span class="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>

                  <!-- Film Card -->
                  <div class="group p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col justify-between space-y-1.5">
                    <div class="space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono">
                          🇰🇷 INTERNATIONAL CINEMA
                        </span>
                        <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Curated Cinema</span>
                      </div>
                      <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-1">
                        Possible Love (가능한 사랑) (2026)
                      </h4>
                      <p class="text-[10px] text-slate-500 font-mono">Dir. Lee Chang-dong • Starring Jeon Do-yeon &amp; Sol Kyung-gu</p>
                      <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        An emotional Korean drama tracing past bonds and unspoken regrets between two longtime acquaintances.
                      </p>
                    </div>
                    <div class="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#f5c518] text-slate-950 font-black font-mono text-[9px] tracking-tight">
                        IMDb
                      </span>
                      <a 
                        href="https://www.imdb.com/title/tt37803364/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="text-xs font-bold text-slate-800 group-hover:text-amber-600 inline-flex items-center gap-1 underline transition-colors cursor-pointer"
                        title="View on IMDb ↗"
                      >
                        <span>View on IMDb</span>
                        <span class="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
          <!-- MEDIA_UPDATE_END -->

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
                    <span class="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/80 font-mono">
                      🔴 CASE 1: ACTIVE RUNWAY EVACUATION
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

                    <!-- Classroom Discussion Box -->
                    <div class="p-3 bg-amber-50/90 border border-amber-200 rounded-lg space-y-1.5">
                      <div class="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] uppercase tracking-wide">
                        <span>💬</span> Suggested Classroom Speaking Prompts
                      </div>
                      <ul class="text-[11.5px] text-amber-950/90 space-y-1 list-disc list-inside">
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
                    <span class="inline-flex items-center gap-1 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80 font-mono">
                      ⚠️ CASE 2: APRON &amp; TAXIWAY GROUND COLLISION
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

                    <!-- Classroom Discussion Box -->
                    <div class="p-3 bg-amber-50/90 border border-amber-200 rounded-lg space-y-1.5">
                      <div class="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] uppercase tracking-wide">
                        <span>💬</span> Suggested Classroom Speaking Prompts
                      </div>
                      <ul class="text-[11.5px] text-amber-950/90 space-y-1 list-disc list-inside">
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
