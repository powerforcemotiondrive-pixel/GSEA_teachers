function getPortfolioDataForSemester(num) {
      if (num === 1 && typeof PORTFOLIO_DATA_S1 !== "undefined" && PORTFOLIO_DATA_S1) return PORTFOLIO_DATA_S1;
      if (num === 2 && typeof PORTFOLIO_DATA_S2 !== "undefined" && PORTFOLIO_DATA_S2) return PORTFOLIO_DATA_S2;
      if (num === 3 && typeof PORTFOLIO_DATA_S3 !== "undefined" && PORTFOLIO_DATA_S3) return PORTFOLIO_DATA_S3;
      if (num === 4 && typeof PORTFOLIO_DATA_S4 !== "undefined" && PORTFOLIO_DATA_S4) return PORTFOLIO_DATA_S4;
      return null;
    }

    // HTML sanitizer to prevent quotes or brackets from breaking DOM attributes
    function escapeHtml(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function renderPortfolioInsightsCard(pData, sem) {
      if (!pData || !pData.totalSubmissions) return "";

      if (activePortfolioModule !== 1) {
        return `
          <div class="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 text-center space-y-1.5">
            <div class="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <span>⏳</span>
              <span>Module ${activePortfolioModule} Reflections Pending</span>
            </div>
            <p class="text-xs text-slate-500 max-w-md mx-auto pt-1">
              Students have not yet submitted reflection logs for Module ${activePortfolioModule} (FE${activePortfolioModule}). Switch to <strong>Module 1 (FE1)</strong> above to view the active cohort pulse.
            </p>
          </div>
        `;
      }

      const feConfidence = pData.metrics?.avgFeConfidence || "4.1";
      const targetLevel = pData.metrics?.targetFeLevel || "CEFR B2";
      const submissions = pData.totalSubmissions || 21;

      return `
        <!-- Cohort Insights & Reflections Summary Card (Bento Grid) -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-3.5">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 text-amber-900 flex items-center justify-center text-sm shadow-2xs font-bold">
                💡
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  Cohort Insights &amp; Reflections
                  <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Module 1 Pulse
                  </span>
                </h3>
                <p class="text-[11px] text-slate-500">
                  Synthesized from ${submissions} student reflection logs • Readiness Self-Assessment: <strong class="text-slate-800">${feConfidence}/10</strong> • Target: <strong class="text-slate-800">${targetLevel}</strong>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                ${sem.title} • ${sem.tracks}
              </span>
            </div>
          </div>

          <!-- 3-Column Bento Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
            <!-- Col 1: Top Vocabulary & Idioms -->
            <div class="bg-slate-50/70 hover:bg-slate-50 rounded-xl p-3.5 border border-slate-200/90 transition-colors flex flex-col justify-between">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>✈️</span>
                    <span>Key Vocabulary &amp; Terms</span>
                  </span>
                  <span class="text-[9.5px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Aeronautical &amp; Travel
                  </span>
                </div>
                <div class="space-y-2 text-xs">
                  <div>
                    <div class="font-bold text-slate-900 flex items-center justify-between">
                      <span>Airside vs. Landside</span>
                      <span class="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 rounded">AT</span>
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug">Public pre-security concourses vs. secured operations &amp; aircraft movement areas.</p>
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 flex items-center justify-between">
                      <span>Apron / Ramp &amp; Stands</span>
                      <span class="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 rounded">AT</span>
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug">Designated aircraft parking, turnaround, and ground servicing positions.</p>
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 flex items-center justify-between">
                      <span>TRC &amp; AODB</span>
                      <span class="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 rounded">AT</span>
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug">Turnaround Coordinator supervising ramp tasks; Airport Operational Database for gate/stand ops.</p>
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 flex items-center justify-between">
                      <span>GPU vs. APU</span>
                      <span class="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 rounded">AT</span>
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug">Ground Power Unit (mobile generator) vs. Auxiliary Power Unit (tail gas turbine).</p>
                  </div>
                  <div class="pt-1.5 border-t border-slate-200/60">
                    <div class="font-bold text-slate-900 flex items-center justify-between">
                      <span>Idioms: Flying Start • Word of Mouth</span>
                      <span class="text-[9.5px] font-mono font-bold text-sky-700 bg-sky-50 px-1 rounded">AG</span>
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug">Starting successfully from day one; informal information passed person-to-person.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Col 2: Common Spoken & Grammar Traps -->
            <div class="bg-slate-50/70 hover:bg-slate-50 rounded-xl p-3.5 border border-slate-200/90 transition-colors flex flex-col justify-between">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Spoken &amp; Grammar Traps</span>
                  </span>
                  <span class="text-[9.5px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    ❌ vs ✅ Golden Rules
                  </span>
                </div>
                <div class="space-y-2 text-xs">
                  <div>
                    <span class="font-bold text-slate-900 block">Uncountable Nouns</span>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      <span class="text-rose-600 font-semibold line-through">luggages</span>, <span class="text-rose-600 font-semibold line-through">trainings</span> → <span class="text-emerald-700 font-bold">pieces of luggage</span>, <span class="text-emerald-700 font-bold">training sessions</span>.
                    </p>
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 block">Used to do vs. Be used to doing</span>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      <span class="text-rose-600 font-semibold line-through">I used to living</span> → <span class="text-emerald-700 font-bold">I used to live</span> (past habit) vs. <span class="text-emerald-700 font-bold">I am used to living</span> (accustomed to).
                    </p>
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 block">Reported Speech Backshifts</span>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      Tenses shift back; time adverbs shift: <span class="text-slate-700 italic">today → that day</span>, <span class="text-slate-700 italic">yesterday → the day before</span>.
                    </p>
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 block">Pronunciation Triggers</span>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      Watch multi-syllable rhythm: <span class="text-slate-800 font-mono font-medium">itinerary</span> (/aɪˈtɪnərəri/) and <span class="text-slate-800 font-mono font-medium">apron</span> (/ˈeɪprən/).
                    </p>
                  </div>
                  <div class="pt-1.5 border-t border-slate-200/60">
                    <span class="font-bold text-slate-900 block">Apron vs. Taxiway vs. Runway</span>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      Maintain exact spatial precision: never say runway when referring to parking on the apron.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Col 3: Cohort Reflections & Practice Focus -->
            <div class="bg-slate-50/70 hover:bg-slate-50 rounded-xl p-3.5 border border-slate-200/90 transition-colors flex flex-col justify-between">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🗣️</span>
                    <span>Cohort Pulse &amp; Focus</span>
                  </span>
                  <span class="text-[9.5px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Teaching Takeaways
                  </span>
                </div>
                <div class="space-y-2 text-xs">
                  <div>
                    <span class="font-bold text-slate-900 flex items-center gap-1.5">
                      <span class="text-amber-500">⚡</span> Fluency &amp; Word Retrieval
                    </span>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      Students report mid-sentence hesitation searching for technical terms. Prioritize rapid pair debates and role-plays to build retrieval speed.
                    </p>
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 flex items-center gap-1.5">
                      <span class="text-emerald-500">🎯</span> FE Presentation Readiness
                    </span>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      Strong student consensus: mastering exact aerodrome zones and personnel roles is essential for the 30-minute oral evaluation.
                    </p>
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 flex items-center gap-1.5">
                      <span class="text-sky-500">🎧</span> Self-Directed Study Habits
                    </span>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      Heavy student engagement with original-version movies, podcasts, and digital micro-quizzing rather than passive rote memorization.
                    </p>
                  </div>
                  <div class="pt-1.5 border-t border-slate-200/60 bg-amber-50/60 -mx-1 px-2.5 py-1.5 rounded-lg border border-amber-200/60">
                    <span class="text-[10px] font-bold uppercase text-amber-900 tracking-wider block">Teacher Recommendation</span>
                    <p class="text-[11px] text-amber-950 leading-snug">
                      Warm up each session with a 3-minute rapid-fire vocabulary challenge to reduce hesitations before Formative Evaluations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function renderPortfolioTab(sem) {
      const pData = getPortfolioDataForSemester(sem.num);

      if (!pData || !pData.totalSubmissions || pData.totalSubmissions === 0) {
        return `
          <div class="bg-white rounded-2xl p-6 sm:p-10 shadow-xs border border-slate-200 text-center space-y-4">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-inner">
              ⏳
            </div>
            <div class="max-w-md mx-auto space-y-1.5">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                ${sem.title} • ${sem.tracks}
              </span>
              <h3 class="text-base sm:text-lg font-bold text-slate-900 pt-1">Awaiting Student Portfolio Submissions</h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                When students submit their reflection logs via Google Forms, run the automated chat command with your CSV:
              </p>
              <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900 inline-block mt-2">
                Semester ${sem.num} Teachers Portfolio Update
              </div>
              <p class="text-[11px] text-slate-400 pt-2">
                The pipeline will automatically parse student entries and populate this compliance matrix.
              </p>
            </div>
          </div>
        `;
      }

      const records = pData.studentRecords || [];
      const isDualTrack = sem.num === 1 || sem.num === 2;
      const atLabel = sem.num === 2 ? "AAS" : (sem.num === 4 ? "AP" : "AT");
      const totalExpected = isDualTrack ? 8 : 4;

      // Compute student compliance matrix scoped to activePortfolioModule
      const studentMatrix = [];
      Object.entries(sem.students || {}).forEach(([grpKey, sIds]) => {
        const grpLabel = grpKey.includes("A") ? "Group A" : (grpKey.includes("B") ? "Group B" : (grpKey.includes("C") ? "Group C" : "Group D"));
        sIds.forEach(sId => {
          const sEntries = records.filter(r => r.id === sId && getRecordModuleNum(r) === activePortfolioModule);
          const atSet = new Set(sEntries.filter(r => r.track && r.track.toUpperCase() === atLabel).map(r => String(r.session)));
          const agSet = new Set(sEntries.filter(r => r.track && r.track.toUpperCase() === "AG").map(r => String(r.session)));
          const loggedCount = atSet.size + (isDualTrack ? agSet.size : 0);
          const isComplete = loggedCount >= totalExpected;
          const isZero = loggedCount === 0;

          studentMatrix.push({
            id: sId,
            name: formatStudentName(sId),
            group: grpLabel,
            atSet,
            agSet,
            loggedCount,
            isComplete,
            isZero
          });
        });
      });

      // Filter student matrix by group
      const filteredMatrix = studentMatrix.filter(st => {
        if (activeMatrixGroupFilter && st.group !== activeMatrixGroupFilter) return false;
        return true;
      });

      const groupsAvailable = Object.keys(sem.students || {}).map(k => k.includes("A") ? "Group A" : (k.includes("B") ? "Group B" : (k.includes("C") ? "Group C" : "Group D")));
      if (!groupsAvailable.includes(activeMatrixGroupFilter)) {
        activeMatrixGroupFilter = groupsAvailable[0] || 'Group A';
      }

      return `
        <div class="space-y-4">
          <!-- Visual Orientation Header Banner -->
          <div class="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200">
            <div class="grid grid-cols-1 md:grid-cols-12 items-stretch">
              <div class="md:col-span-4 relative min-h-[140px] sm:min-h-[160px] bg-slate-900">
                <img 
                  src="images/ddrs_ag_mod1.jpg" 
                  alt="Student Language Portfolio & Learning Reflections" 
                  class="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span class="text-[9.5px] font-black uppercase tracking-wider text-amber-300 font-mono">
                    ${sem.title} • Portfolio Pulse
                  </span>
                  <h4 class="text-xs sm:text-sm font-bold mt-0.5">Cohort Reflections &amp; Data</h4>
                </div>
              </div>
              <div class="md:col-span-8 p-4 sm:p-5 flex flex-col justify-center space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono shadow-2xs">
                    Teacher Guide
                  </span>
                  <span class="text-xs font-bold text-slate-800 font-mono">Student Reflection &amp; Cohort Insights</span>
                </div>
                <p class="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  This analytical dashboard synthesizes cumulative student reflections, weekly learning habits, and independent study logs from Google Forms across the entire semester. Review the cohort's top technical buzzwords, high-frequency spoken grammar traps, and authentic student reflections to tailor your upcoming classroom practice and address common oral anxieties before Formative Evaluations.
                </p>
              </div>
            </div>
          </div>

          <!-- Minimalist Control Bar: Group Selector & Module Selector -->
          <div class="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <!-- Group Selector (Streamlined Group A / Group B) -->
            <div class="flex items-center gap-1.5 text-xs">
              <span class="text-slate-500 font-semibold mr-1">Group:</span>
              ${groupsAvailable.map(grp => `
                <button 
                  type="button" 
                  onclick="setMatrixGroupFilter('${grp}')" 
                  class="px-3 py-1.5 rounded-xl font-bold border transition-all ${activeMatrixGroupFilter === grp ? 'bg-slate-800 text-white border-slate-800 shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 cursor-pointer'}"
                >
                  ${grp}
                </button>
              `).join("")}
            </div>

            <!-- Module Selector -->
            <div class="flex items-center gap-1.5 text-xs">
              <span class="text-slate-500 font-semibold mr-1">Module:</span>
              <button 
                type="button" 
                onclick="setPortfolioModule(1)" 
                class="px-3 py-1.5 rounded-xl font-bold border transition-all ${activePortfolioModule === 1 ? 'bg-slate-800 text-white border-slate-800 shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 cursor-pointer'}"
              >
                Module 1 (FE1)
              </button>
              <button 
                type="button" 
                onclick="setPortfolioModule(2)" 
                class="px-3 py-1.5 rounded-xl font-bold border transition-all ${activePortfolioModule === 2 ? 'bg-slate-800 text-white border-slate-800 shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 cursor-pointer'}"
              >
                Module 2 (FE2)
              </button>
              <button 
                type="button" 
                onclick="setPortfolioModule(3)" 
                class="px-3 py-1.5 rounded-xl font-bold border transition-all ${activePortfolioModule === 3 ? 'bg-slate-800 text-white border-slate-800 shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 cursor-pointer'}"
              >
                Module 3 (FE3)
              </button>
            </div>

            <!-- PDF Report Generator Action Buttons (Mobile-first wrapped) -->
            <div class="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <button 
                type="button" 
                onclick="openPortfolioReportModal()" 
                class="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer border border-amber-400 shrink-0"
                title="Generate Official Student Portfolio Compliance & Reflection Digest (PDF)"
              >
                <span>📊</span>
                <span>Compliance Report (PDF)</span>
              </button>
              <button 
                type="button" 
                onclick="openGroupEntriesDossierModal()" 
                class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer border border-slate-700 shrink-0"
                title="Generate Complete PDF of All Student Portfolio Entries by Group & Track (e.g. GSEA26A AG GRP A)"
              >
                <span>📝</span>
                <span>Group Entries Dossier (PDF)</span>
              </button>
            </div>
          </div>

          <!-- Cohort Insights & Reflections Summary Card -->
          ${renderPortfolioInsightsCard(pData, sem)}

          <!-- Session Compliance Matrix Table -->
          <div class="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <th class="py-3 px-3">Student &amp; Group</th>
                    <th class="py-3 px-3 text-center">${atLabel} Track (S1–S4)</th>
                    ${isDualTrack ? '<th class="py-3 px-3 text-center">AG Track (S1–S4)</th>' : ''}
                    <th class="py-3 px-3 text-center">Progress</th>
                    <th class="py-3 px-3 text-center">Status</th>
                    <th class="py-3 px-3 text-right">Reminder</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${filteredMatrix.map(st => {
                    const statusBadge = st.isComplete
                      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Complete (8/8)</span>'
                      : (st.isZero
                        ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">No Entries (0/8)</span>'
                        : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Partial (${st.loggedCount}/${totalExpected})</span>`);

                    return `
                      <tr class="hover:bg-slate-50/70 transition-colors">
                        <td class="py-2.5 px-3 whitespace-nowrap">
                          <span class="font-mono font-bold text-slate-900">${st.name}</span>
                          <span class="text-[10px] ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">${st.group}</span>
                        </td>
                        <td class="py-2.5 px-3 text-center whitespace-nowrap">
                          <div class="inline-flex items-center gap-1 font-mono font-bold text-[10px]">
                            ${[1, 2, 3, 4].map(sNum => st.atSet.has(String(sNum))
                              ? `<span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200" title="${atLabel} S${sNum} Logged">● S${sNum}</span>`
                              : `<span class="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200" title="${atLabel} S${sNum} Missing">○ S${sNum}</span>`
                            ).join("")}
                          </div>
                        </td>
                        ${isDualTrack ? `
                          <td class="py-2.5 px-3 text-center whitespace-nowrap">
                            <div class="inline-flex items-center gap-1 font-mono font-bold text-[10px]">
                              ${[1, 2, 3, 4].map(sNum => st.agSet.has(String(sNum))
                                ? `<span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200" title="AG S${sNum} Logged">● S${sNum}</span>`
                                : `<span class="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200" title="AG S${sNum} Missing">○ S${sNum}</span>`
                              ).join("")}
                            </div>
                          </td>
                        ` : ''}
                        <td class="py-2.5 px-3 text-center whitespace-nowrap font-mono font-bold text-xs ${st.isComplete ? 'text-emerald-700' : (st.isZero ? 'text-rose-700' : 'text-amber-700')}">
                          ${st.loggedCount} / ${totalExpected}
                        </td>
                        <td class="py-2.5 px-3 text-center whitespace-nowrap">
                          ${statusBadge}
                        </td>
                        <td class="py-2.5 px-3 text-right whitespace-nowrap">
                          ${st.isComplete ? `
                            <span class="text-[11px] text-emerald-600 font-medium">✓ Up to date</span>
                          ` : `
                            <button 
                              type="button" 
                              onclick="copyIndividualMissingReminder('${st.id}')" 
                              class="text-slate-600 hover:text-slate-900 font-bold text-xs underline cursor-pointer"
                              title="Copy reminder for ${st.name}"
                            >
                              📋 Copy Reminder
                            </button>
                          `}
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Portfolio Report Print / PDF Modal -->
        <div id="portfolio-report-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div class="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-300 max-h-[92vh] flex flex-col overflow-hidden">
            <!-- Modal Control Header (hidden in print) -->
            <div class="no-print p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                  🖨️
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900">Official Portfolio Compliance &amp; Reflection Dossier</h3>
                  <p class="text-xs text-slate-500">ENAC Official Academic Transcript • Student Self-Evaluation &amp; Reflection Digest</p>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <!-- Scope Filter -->
                <select id="port-report-candidate-filter" onchange="renderPortfolioReportPrintArea()" class="text-xs font-bold p-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-800 cursor-pointer">
                  <option value="all">All Candidates (Full Promotion Dossier)</option>
                  <option value="grpA">Group A Only</option>
                  <option value="grpB">Group B Only</option>
                </select>

                <!-- Module Filter -->
                <select id="port-report-module-filter" onchange="renderPortfolioReportPrintArea()" class="text-xs font-bold p-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-800 cursor-pointer">
                  <option value="1">Module 1 (FE1)</option>
                  <option value="2">Module 2 (FE2)</option>
                  <option value="3">Module 3 (FE3)</option>
                  <option value="all">All Modules Cumulative</option>
                </select>

                <!-- Print Button -->
                <button 
                  type="button" 
                  onclick="window.print()" 
                  class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 flex items-center gap-2 shadow-sm transition-all cursor-pointer border border-amber-400"
                >
                  <span>🖨️</span>
                  <span>Print / Save as PDF</span>
                </button>

                <!-- Close Button -->
                <button 
                  type="button" 
                  onclick="closePortfolioReportModal()" 
                  class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Modal Scrollable Print Preview Body -->
            <div class="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100/60">
              <div id="portfolio-report-print-area" class="max-w-4xl mx-auto space-y-6">
                <!-- Injected via renderPortfolioReportPrintArea() -->
              </div>
            </div>
          </div>
        </div>

        <!-- Group Portfolio Entries Print / PDF Modal -->
        <div id="group-entries-dossier-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div class="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-300 max-h-[92vh] flex flex-col overflow-hidden">
            <!-- Modal Control Header (hidden in print) -->
            <div class="no-print p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                  📝
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900">Student Portfolio Entries Dossier</h3>
                  <p class="text-xs text-slate-500">ENAC Official Academic Digest • Complete Verbatim Student Reflections</p>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <!-- Group Filter -->
                <select id="group-dossier-group-filter" onchange="renderGroupEntriesPrintArea()" class="text-xs font-bold p-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-800 cursor-pointer flex-1 sm:flex-initial">
                  <option value="grpA">Group A</option>
                  <option value="grpB">Group B</option>
                  <option value="all">All Groups</option>
                </select>

                <!-- Track Filter -->
                <select id="group-dossier-track-filter" onchange="renderGroupEntriesPrintArea()" class="text-xs font-bold p-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-800 cursor-pointer flex-1 sm:flex-initial">
                  <option value="all">All Tracks</option>
                  <option value="AG">AG (General)</option>
                  <option value="AT">AT (Technical)</option>
                </select>

                <!-- Module Filter -->
                <select id="group-dossier-module-filter" onchange="renderGroupEntriesPrintArea()" class="text-xs font-bold p-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-800 cursor-pointer flex-1 sm:flex-initial">
                  <option value="all">All Modules (Cumulative)</option>
                  <option value="1">Module 1 (FE1)</option>
                  <option value="2">Module 2 (FE2)</option>
                  <option value="3">Module 3 (FE3)</option>
                </select>

                <!-- Page Break Toggle (Default unchecked for continuous flow without page gaps) -->
                <label class="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer px-2 py-1 rounded-lg bg-white border border-slate-200" title="Start each student on a new page when printing or saving as PDF">
                  <input type="checkbox" id="group-dossier-page-break" onchange="renderGroupEntriesPrintArea()" class="rounded border-slate-300 text-slate-800 focus:ring-slate-800 cursor-pointer">
                  <span>Page break / student</span>
                </label>

                <!-- Print Button -->
                <button 
                  type="button" 
                  onclick="window.print()" 
                  class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 flex items-center gap-2 shadow-sm transition-all cursor-pointer border border-amber-400 w-full sm:w-auto justify-center"
                >
                  <span>🖨️</span>
                  <span>Print / Save as PDF</span>
                </button>

                <!-- Close Button -->
                <button 
                  type="button" 
                  onclick="closeGroupEntriesDossierModal()" 
                  class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Modal Scrollable Print Preview Body -->
            <div class="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100/60">
              <div id="group-entries-print-area" class="max-w-4xl mx-auto space-y-6">
                <!-- Injected via renderGroupEntriesPrintArea() -->
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function initPortfolioEvents() {
      // Compliance matrix is rendered reactively via renderPortfolioTab
    }

    // Initialize on DOM load


    // ============================================================================

    function openPortfolioReportModal() {
      const modal = document.getElementById("portfolio-report-modal");
      if (!modal) return;
      modal.classList.remove("hidden");

      // Populate candidate selector with groups and candidates
      const sem = SEMESTERS_DATA[activeSemester] || SEMESTERS_DATA[1];
      const filterSelect = document.getElementById("port-report-candidate-filter");
      if (filterSelect) {
        let options = '<option value="all">All Candidates (Full Promotion Dossier)</option>';
        options += '<option value="grpA">Group A (All Students)</option>';
        options += '<option value="grpB">Group B (All Students)</option>';

        Object.entries(sem.students || {}).forEach(([grpKey, sIds]) => {
          const grpLabel = grpKey.includes("A") ? "Group A" : (grpKey.includes("B") ? "Group B" : (grpKey.includes("C") ? "Group C" : "Group D"));
          options += '<optgroup label="' + grpLabel + ' (' + sIds.length + ' students)">';
          sIds.forEach(sId => {
            options += '<option value="' + sId + '">' + formatStudentName(sId) + ' (' + grpLabel + ')</option>';
          });
          options += '</optgroup>';
        });
        filterSelect.innerHTML = options;
      }

      const modSelect = document.getElementById("port-report-module-filter");
      if (modSelect) {
        modSelect.value = String(activePortfolioModule || 1);
      }

      renderPortfolioReportPrintArea();
    }

    function closePortfolioReportModal() {
      const modal = document.getElementById("portfolio-report-modal");
      if (modal) modal.classList.add("hidden");
    }

    function renderPortfolioReportPrintArea() {
      const container = document.getElementById("portfolio-report-print-area");
      if (!container) return;

      const sem = SEMESTERS_DATA[activeSemester] || SEMESTERS_DATA[1];
      const pData = getPortfolioDataForSemester(sem.num);

      if (!pData || !pData.totalSubmissions || pData.totalSubmissions === 0) {
        container.innerHTML = `
          <div class="portfolio-report-card bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
            <span class="text-3xl">⏳</span>
            <h3 class="text-base font-bold text-slate-900">Awaiting Student Portfolio Submissions</h3>
            <p class="text-xs text-slate-500">No student reflection logs have been synchronized for ${sem.title} yet.</p>
          </div>
        `;
        return;
      }

      const candidateFilter = document.getElementById("port-report-candidate-filter")?.value || "all";
      const moduleFilter = document.getElementById("port-report-module-filter")?.value || String(activePortfolioModule || 1);

      // Collect eligible candidates
      const allStudents = [];
      (sem.students?.groupA || []).forEach(s => allStudents.push({ id: s, name: formatStudentName(s), group: "Group A" }));
      (sem.students?.groupB || []).forEach(s => allStudents.push({ id: s, name: formatStudentName(s), group: "Group B" }));
      (sem.students?.groupC || []).forEach(s => allStudents.push({ id: s, name: formatStudentName(s), group: "Group C" }));
      (sem.students?.groupD || []).forEach(s => allStudents.push({ id: s, name: formatStudentName(s), group: "Group D" }));

      let displayedStudents = allStudents;
      if (candidateFilter === "grpA") {
        displayedStudents = allStudents.filter(s => s.group === "Group A");
      } else if (candidateFilter === "grpB") {
        displayedStudents = allStudents.filter(s => s.group === "Group B");
      } else if (candidateFilter !== "all") {
        displayedStudents = allStudents.filter(s => s.id === candidateFilter);
      }

      const records = pData.studentRecords || [];
      const isDualTrack = sem.num === 1 || sem.num === 2;
      const atLabel = sem.num === 2 ? "AAS" : (sem.num === 4 ? "AP" : "AT");
      const modNum = moduleFilter === "all" ? 0 : (parseInt(moduleFilter, 10) || 1);
      const totalExpected = isDualTrack ? (modNum === 0 ? 24 : 8) : (modNum === 0 ? 12 : 4);

      const candidateRows = displayedStudents.map(st => {
        const sEntries = records.filter(r => r.id === st.id && (modNum === 0 || getRecordModuleNum(r) === modNum));
        const atSet = new Set(sEntries.filter(r => r.track && r.track.toUpperCase() === atLabel).map(r => String(r.session)));
        const agSet = new Set(sEntries.filter(r => r.track && r.track.toUpperCase() === "AG").map(r => String(r.session)));
        const loggedCount = sEntries.length;
        const isComplete = loggedCount >= totalExpected;
        const isZero = loggedCount === 0;

        return {
          ...st,
          atSet,
          agSet,
          loggedCount,
          isComplete,
          isZero
        };
      });

      const totalVerifiedLogs = candidateRows.reduce((acc, c) => acc + c.loggedCount, 0);
      const totalPossible = displayedStudents.length * totalExpected;
      const complianceRate = totalPossible > 0 ? Math.round((totalVerifiedLogs / totalPossible) * 100) : 0;
      const completedCandidates = candidateRows.filter(c => c.isComplete).length;

      const todayFormatted = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      const scopeLabel = candidateFilter === "all" ? "Full Promotion (" + displayedStudents.length + " candidates)" : (candidateFilter === "grpA" ? "Group A Only" : (candidateFilter === "grpB" ? "Group B Only" : displayedStudents[0]?.name || "Individual"));
      const modLabel = modNum === 0 ? "Cumulative (All Modules)" : "Module " + modNum + (modNum === 1 ? " (FE1)" : (modNum === 2 ? " (FE2)" : " (FE3)"));

      container.innerHTML = `
        <div class="portfolio-report-card bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <!-- Institutional Header -->
          <div class="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b-2 border-slate-800 gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-white bg-slate-800 px-2 py-0.5 rounded">
                  ENAC • DÉPARTEMENT LH / LAN
                </span>
                <span class="text-[11px] font-mono text-slate-500 font-bold">${sem.title} • ${sem.tracks}</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-950 tracking-tight pt-1">
                Official Portfolio Compliance &amp; Reflection Dossier
              </h2>
              <div class="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-700">
                <span>Promotion: <strong>${sem.promotion || 'GSEA26A'}</strong></span>
                <span>•</span>
                <span>Scope: <strong>${scopeLabel}</strong></span>
                <span>•</span>
                <span>Module: <strong>${modLabel}</strong></span>
                <span>•</span>
                <span>Certified Date: <strong>${todayFormatted}</strong></span>
              </div>
            </div>

            <!-- Executive Summary Metrics -->
            <div class="shrink-0 flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div class="text-center px-2">
                <span class="text-[10px] uppercase font-bold text-slate-500 block">Candidates</span>
                <span class="text-xl font-black text-slate-900">${displayedStudents.length}</span>
              </div>
              <div class="h-8 w-px bg-slate-200"></div>
              <div class="text-center px-2">
                <span class="text-[10px] uppercase font-bold text-slate-500 block">Verified Logs</span>
                <span class="text-xl font-black text-slate-900">${totalVerifiedLogs}</span>
              </div>
              <div class="h-8 w-px bg-slate-200"></div>
              <div class="text-center px-2">
                <span class="text-[10px] uppercase font-bold text-emerald-700 block">Compliance</span>
                <span class="text-xl font-black text-emerald-700">${complianceRate}%</span>
              </div>
              <div class="h-8 w-px bg-slate-200"></div>
              <div class="text-center px-2">
                <span class="text-[10px] uppercase font-bold text-slate-700 block">Avg FE Conf.</span>
                <span class="text-xl font-black text-slate-900">${pData.metrics?.avgFeConfidence || '4.1'}/10</span>
              </div>
            </div>
          </div>

          <!-- Candidate Compliance Standings Table -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span>📊</span>
                <span>Candidate Reflection Compliance &amp; Progress (Target: ${totalExpected} Sessions)</span>
              </h3>
              <span class="text-[11px] text-slate-500 font-mono">${completedCandidates} of ${displayedStudents.length} Complete (${complianceRate}%)</span>
            </div>

            <div class="overflow-x-auto rounded-xl border border-slate-200">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <th class="py-2.5 px-3">Candidate / Student</th>
                    <th class="py-2.5 px-3">Group</th>
                    <th class="py-2.5 px-3 text-center">${atLabel} Track (S1–S4)</th>
                    ${isDualTrack ? '<th class="py-2.5 px-3 text-center">AG Track (S1–S4)</th>' : ''}
                    <th class="py-2.5 px-3 text-center">Progress</th>
                    <th class="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${candidateRows.map(st => {
                    const statusBadge = st.isComplete
                      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ Complete</span>'
                      : (st.isZero
                        ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">❌ No Entries</span>'
                        : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">⏳ Partial</span>');

                    return `
                      <tr class="hover:bg-slate-50/50">
                        <td class="py-2 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                          ${st.name}
                        </td>
                        <td class="py-2 px-3 text-slate-600 text-xs whitespace-nowrap">
                          ${st.group}
                        </td>
                        <td class="py-2 px-3 text-center whitespace-nowrap font-mono text-[10px]">
                          <div class="inline-flex items-center gap-1">
                            ${[1, 2, 3, 4].map(sNum => st.atSet.has(String(sNum))
                              ? '<span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">● S' + sNum + '</span>'
                              : '<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200">○ S' + sNum + '</span>'
                            ).join("")}
                          </div>
                        </td>
                        ${isDualTrack ? `
                          <td class="py-2 px-3 text-center whitespace-nowrap font-mono text-[10px]">
                            <div class="inline-flex items-center gap-1">
                              ${[1, 2, 3, 4].map(sNum => st.agSet.has(String(sNum))
                                ? '<span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">● S' + sNum + '</span>'
                                : '<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200">○ S' + sNum + '</span>'
                              ).join("")}
                            </div>
                          </td>
                        ` : ''}
                        <td class="py-2 px-3 text-center font-mono font-bold text-xs whitespace-nowrap ${st.isComplete ? 'text-emerald-700' : (st.isZero ? 'text-rose-700' : 'text-amber-700')}">
                          ${st.loggedCount} / ${totalExpected}
                        </td>
                        <td class="py-2 px-3 text-center whitespace-nowrap">
                          ${statusBadge}
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Key Pedagogical Insights & Reflection Summary -->
          <div class="space-y-3 pt-2 border-t border-slate-200">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span>💡</span>
                <span>Cohort Reflection Highlights &amp; Target Consensus</span>
              </h3>
              <span class="text-[11px] text-slate-500 font-mono">B2 Spoken Communication Benchmark</span>
            </div>

            <!-- Buzzwords & Traps Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- High Frequency Terminology -->
              <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>Core Spoken Vocabulary (High Consensus)</span>
                </h4>
                <div class="space-y-1.5 text-xs">
                  ${(pData.topBuzzwords || []).slice(0, 4).map(bw => `
                    <div class="p-2 bg-white rounded-lg border border-slate-200">
                      <div class="flex items-center justify-between font-bold text-slate-900">
                        <span>${bw.term}</span>
                        <span class="text-[10px] text-slate-500 font-normal uppercase">${bw.track.toUpperCase()} • ${bw.category}</span>
                      </div>
                      <p class="text-[11px] text-slate-600 mt-0.5">${bw.definition}</p>
                    </div>
                  `).join("")}
                </div>
              </div>

              <!-- Spoken Traps & Verbatim Takeaways -->
              <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>Key Pitfalls &amp; Actionable FE Advice</span>
                </h4>
                <div class="space-y-1.5 text-xs">
                  ${(pData.grammarTraps || []).slice(0, 3).map(gt => `
                    <div class="p-2 bg-white rounded-lg border border-slate-200">
                      <span class="font-bold text-slate-900 block">${gt.rule}</span>
                      <div class="text-[11px] flex items-center gap-2 mt-0.5 font-mono">
                        <span class="text-rose-600 line-through">${gt.wrong}</span>
                        <span class="text-slate-400">➔</span>
                        <span class="text-emerald-700 font-bold">${gt.right}</span>
                      </div>
                    </div>
                  `).join("")}
                  <div class="p-2 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[11px] text-slate-800">
                    <strong>FE Spoken Advice:</strong> ${pData.cohortReflections?.feAdvice || "Mastering aerodrome spatial zones and active pair discussion reduces mid-sentence hesitations."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Official Teachers Sign-Off Strip -->
          <div class="pt-4 border-t-2 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-4">
            <div class="space-y-0.5">
              <span class="font-bold text-slate-800 block">ENAC GSEA Platform • Teachers Portal</span>
              <span class="text-[10px] text-slate-500">Certified for institutional record keeping &amp; Formative Evaluation monitoring</span>
            </div>
            <div class="flex items-center gap-6 self-end sm:self-auto">
              <div class="text-center">
                <div class="h-10 w-44 border-b border-dashed border-slate-400"></div>
                <span class="text-[10px] text-slate-500 uppercase tracking-wider">Evaluation Coordinator</span>
              </div>
              <div class="text-center">
                <div class="h-10 w-36 border-b border-dashed border-slate-400"></div>
                <span class="text-[10px] text-slate-500 uppercase tracking-wider">Course Director</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // ============================================================================
    // GROUP STUDENT PORTFOLIO ENTRIES DOSSIER (PRINT / PDF ENGINE)
    // ============================================================================

    function openGroupEntriesDossierModal() {
      const modal = document.getElementById("group-entries-dossier-modal");
      if (!modal) return;
      modal.classList.remove("hidden");

      const sem = SEMESTERS_DATA[activeSemester] || SEMESTERS_DATA[1];
      const grpSelect = document.getElementById("group-dossier-group-filter");
      if (grpSelect) {
        let options = '';
        const groupsAvailable = [];
        if (sem.students?.groupA?.length) groupsAvailable.push({ key: "grpA", label: "Group A", count: sem.students.groupA.length });
        if (sem.students?.groupB?.length) groupsAvailable.push({ key: "grpB", label: "Group B", count: sem.students.groupB.length });
        if (sem.students?.groupC?.length) groupsAvailable.push({ key: "grpC", label: "Group C", count: sem.students.groupC.length });
        if (sem.students?.groupD?.length) groupsAvailable.push({ key: "grpD", label: "Group D", count: sem.students.groupD.length });

        groupsAvailable.forEach(g => {
          options += '<option value="' + g.key + '">' + g.label + ' (' + g.count + ' Candidates)</option>';
        });
        options += '<option value="all">All Groups Combined</option>';
        grpSelect.innerHTML = options;

        if (activeMatrixGroupFilter === "Group A") grpSelect.value = "grpA";
        else if (activeMatrixGroupFilter === "Group B") grpSelect.value = "grpB";
        else if (activeMatrixGroupFilter === "Group C") grpSelect.value = "grpC";
        else if (activeMatrixGroupFilter === "Group D") grpSelect.value = "grpD";
        else grpSelect.value = groupsAvailable[0]?.key || "grpA";
      }

      const trackSelect = document.getElementById("group-dossier-track-filter");
      if (trackSelect) {
        const isDualTrack = sem.num === 1 || sem.num === 2;
        const atLabel = sem.num === 2 ? "AAS" : (sem.num === 4 ? "AP" : "AT");
        let trackOpts = '<option value="all">All Tracks Combined</option>';
        if (isDualTrack) {
          trackOpts += '<option value="AG">AG (General English)</option>';
          trackOpts += '<option value="' + atLabel + '">' + atLabel + ' (Technical English)</option>';
        } else {
          trackOpts += '<option value="' + atLabel + '">' + atLabel + ' (Technical English)</option>';
        }
        trackSelect.innerHTML = trackOpts;
        trackSelect.value = "all";
      }

      const modSelect = document.getElementById("group-dossier-module-filter");
      if (modSelect) {
        modSelect.value = String(activePortfolioModule || 1);
      }

      renderGroupEntriesPrintArea();
    }

    function closeGroupEntriesDossierModal() {
      const modal = document.getElementById("group-entries-dossier-modal");
      if (modal) modal.classList.add("hidden");
    }

    function renderGroupEntriesPrintArea() {
      const container = document.getElementById("group-entries-print-area");
      if (!container) return;

      const sem = SEMESTERS_DATA[activeSemester] || SEMESTERS_DATA[1];
      const pData = getPortfolioDataForSemester(sem.num);

      if (!pData || !pData.totalSubmissions || pData.totalSubmissions === 0) {
        container.innerHTML = `
          <div class="portfolio-report-card bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
            <span class="text-3xl">⏳</span>
            <h3 class="text-base font-bold text-slate-900">Awaiting Student Portfolio Submissions</h3>
            <p class="text-xs text-slate-500">No student reflection logs have been synchronized for ${sem.title} yet.</p>
          </div>
        `;
        return;
      }

      const grpFilter = document.getElementById("group-dossier-group-filter")?.value || "grpA";
      const trackFilter = document.getElementById("group-dossier-track-filter")?.value || "all";
      const modFilter = document.getElementById("group-dossier-module-filter")?.value || "1";
      const pageBreakChecked = document.getElementById("group-dossier-page-break")?.checked !== false;

      const modNum = modFilter === "all" ? 0 : (parseInt(modFilter, 10) || 1);
      const isDualTrack = sem.num === 1 || sem.num === 2;
      const atLabel = sem.num === 2 ? "AAS" : (sem.num === 4 ? "AP" : "AT");

      const groupsToRender = [];
      if (grpFilter === "all" || grpFilter === "grpA") {
        if (sem.students?.groupA?.length) groupsToRender.push({ key: "grpA", name: "Group A", short: "GRP A", ids: sem.students.groupA });
      }
      if (grpFilter === "all" || grpFilter === "grpB") {
        if (sem.students?.groupB?.length) groupsToRender.push({ key: "grpB", name: "Group B", short: "GRP B", ids: sem.students.groupB });
      }
      if (grpFilter === "all" || grpFilter === "grpC") {
        if (sem.students?.groupC?.length) groupsToRender.push({ key: "grpC", name: "Group C", short: "GRP C", ids: sem.students.groupC });
      }
      if (grpFilter === "all" || grpFilter === "grpD") {
        if (sem.students?.groupD?.length) groupsToRender.push({ key: "grpD", name: "Group D", short: "GRP D", ids: sem.students.groupD });
      }

      const records = pData.studentRecords || [];

      // Callsign formatted as requested: e.g. "GSEA26A AG GRP A", "GSEA26A AT GRP B"
      const promoName = sem.promotion || "GSEA26A";
      let trackTag = trackFilter === "all" ? "ALL" : trackFilter.toUpperCase();
      let groupTag = grpFilter === "all" ? "ALL GROUPS" : (grpFilter === "grpA" ? "GRP A" : (grpFilter === "grpB" ? "GRP B" : (grpFilter === "grpC" ? "GRP C" : "GRP D")));
      const bookletCallsign = `${promoName} ${trackTag} ${groupTag}`;
      const modLabel = modNum === 0 ? "Cumulative (All Modules)" : `Module ${modNum}`;
      const todayFormatted = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

      let totalMatchingEntries = 0;
      let totalStudentsInScope = 0;
      let studentWithEntriesCount = 0;
      const allFeScores = [];
      const allToeicScores = [];

      groupsToRender.forEach(g => {
        totalStudentsInScope += g.ids.length;
        g.ids.forEach(stId => {
          const sEntries = records.filter(r => r.id === stId &&
            (trackFilter === "all" || (r.track && r.track.toUpperCase() === trackFilter.toUpperCase())) &&
            (modNum === 0 || getRecordModuleNum(r) === modNum)
          );
          if (sEntries.length > 0) studentWithEntriesCount++;
          totalMatchingEntries += sEntries.length;
          sEntries.forEach(r => {
            if (r.feScore !== null && r.feScore !== undefined && !isNaN(r.feScore) && r.feScore > 0) allFeScores.push(r.feScore);
            if (r.toeicScore !== null && r.toeicScore !== undefined && !isNaN(r.toeicScore) && r.toeicScore > 0) allToeicScores.push(r.toeicScore);
          });
        });
      });

      const avgFe = allFeScores.length > 0 ? (allFeScores.reduce((a, b) => a + b, 0) / allFeScores.length).toFixed(1) : "N/A";
      const avgToeic = allToeicScores.length > 0 ? (allToeicScores.reduce((a, b) => a + b, 0) / allToeicScores.length).toFixed(1) : "N/A";

      let html = `
        <!-- Official Document Header (No Giant Box) -->
        <div class="portfolio-group-cover-header pb-4 mb-6 border-b-2 border-slate-900 bg-white">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2 text-xs">
                <span class="font-black uppercase tracking-wider text-slate-900 font-mono">
                  ENAC • DÉPARTEMENT LH / LAN
                </span>
                <span class="text-slate-400">•</span>
                <span class="font-mono text-slate-600 font-bold">
                  ${sem.title} (${sem.tracks})
                </span>
                <span class="text-slate-400">•</span>
                <span class="text-slate-500 font-mono">
                  Date: ${todayFormatted}
                </span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-mono uppercase">
                ${bookletCallsign}
              </h2>
              <p class="text-xs text-slate-600">
                Official Student Portfolio Reflections Dossier • Complete Verbatim Transcripts
              </p>
              <div class="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                <span>Promotion: <strong>${promoName}</strong></span>
                <span>•</span>
                <span>Scope: <strong>${grpFilter === "all" ? "All Groups Combined" : groupsToRender[0]?.name}</strong></span>
                <span>•</span>
                <span>Track: <strong>${trackFilter === "all" ? "All Tracks Combined" : trackFilter}</strong></span>
                <span>•</span>
                <span>Module: <strong>${modLabel}</strong></span>
              </div>
            </div>

            <!-- KPI Summary Text Strip -->
            <div class="flex items-center gap-4 text-xs font-mono shrink-0 pt-1 sm:pt-0">
              <div class="text-right">
                <span class="text-[10px] uppercase text-slate-500 block font-sans">Active Candidates</span>
                <strong class="text-slate-900 text-sm">${studentWithEntriesCount} / ${totalStudentsInScope}</strong>
              </div>
              <div class="h-8 w-px bg-slate-300"></div>
              <div class="text-right">
                <span class="text-[10px] uppercase text-slate-500 block font-sans">Total Logs</span>
                <strong class="text-slate-900 text-sm">${totalMatchingEntries}</strong>
              </div>
              <div class="h-8 w-px bg-slate-300"></div>
              <div class="text-right">
                <span class="text-[10px] uppercase text-slate-500 block font-sans">Avg FE</span>
                <strong class="text-emerald-700 text-sm">${avgFe}/10</strong>
              </div>
              <div class="h-8 w-px bg-slate-300"></div>
              <div class="text-right">
                <span class="text-[10px] uppercase text-slate-500 block font-sans">Avg TOEIC</span>
                <strong class="text-slate-900 text-sm">${avgToeic}/10</strong>
              </div>
            </div>
          </div>
        </div>
      `;

      groupsToRender.forEach(group => {
        html += `
          <div class="space-y-4 pt-2">
            ${groupsToRender.length > 1 ? `
              <div class="pb-2 border-b-2 border-slate-800 flex items-center justify-between">
                <h3 class="text-base font-black text-slate-900 uppercase tracking-wider font-mono">
                  📂 ${promoName} • ${group.name}
                </h3>
                <span class="text-xs text-slate-500 font-mono">${group.ids.length} Candidates</span>
              </div>
            ` : ''}
        `;

        group.ids.forEach(stId => {
          const sName = formatStudentName(stId);
          const sEntries = records.filter(r => r.id === stId &&
            (trackFilter === "all" || (r.track && r.track.toUpperCase() === trackFilter.toUpperCase())) &&
            (modNum === 0 || getRecordModuleNum(r) === modNum)
          );

          sEntries.sort((a, b) => (parseInt(a.session, 10) || 0) - (parseInt(b.session, 10) || 0));

          const pageBreakClass = pageBreakChecked ? 'student-page-break' : '';

          html += `
            <div class="portfolio-student-section pt-5 mb-8 ${pageBreakClass}">
              <!-- High-Contrast Visual Break Bar Between Students -->
              <div class="flex flex-wrap items-baseline justify-between gap-2 pb-2 mb-4 border-b-2 border-slate-900" style="break-after: avoid;">
                <div class="flex items-center gap-2.5">
                  <span class="text-base font-black text-slate-950 font-mono tracking-tight">
                    ${sName}
                  </span>
                  <span class="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    ${stId}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs font-mono text-slate-600">
                  <span class="font-bold text-slate-800">${group.name}</span>
                  <span>•</span>
                  <span class="font-bold ${sEntries.length > 0 ? 'text-emerald-700' : 'text-slate-400'}">
                    ${sEntries.length} ${sEntries.length === 1 ? 'Entry Logged' : 'Entries Logged'}
                  </span>
                </div>
              </div>

              <!-- Entries Flow (Pure Typography, Zero Nested Boxes) -->
              ${sEntries.length === 0 ? `
                <div class="py-3 text-xs text-slate-500 italic pl-3 border-l-2 border-slate-300">
                  ⏳ No reflection entries submitted for ${sName} matching ${trackTag} • ${modLabel}.
                </div>
              ` : `
                <div class="space-y-6">
                  ${sEntries.map(entry => {
                    const isAg = entry.track && entry.track.toUpperCase() === "AG";
                    return `
                      <div class="portfolio-session-entry pb-5 border-b border-slate-200 space-y-3">
                        <!-- Session Subtitle Line -->
                        <div class="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100 text-xs">
                          <div class="flex items-center gap-2">
                            <span class="font-mono font-bold text-[10px] uppercase px-1.5 py-0.5 rounded text-white ${isAg ? 'bg-sky-800' : 'bg-purple-800'}">
                              ${entry.track}
                            </span>
                            <strong class="text-slate-900">
                              Session ${entry.session} — ${escapeHtml(entry.module || 'Module ' + modNum)}
                            </strong>
                            <span class="text-slate-400 font-mono text-[11px]">
                              (${escapeHtml(entry.timestamp)})
                            </span>
                          </div>
                          <div class="flex items-center gap-3 font-mono text-[11px]">
                            ${entry.feScore !== null && entry.feScore !== undefined ? `
                              <span class="text-emerald-800 font-bold">🗣️ FE Readiness: ${entry.feScore}/10</span>
                            ` : ''}
                            ${entry.toeicScore !== null && entry.toeicScore !== undefined ? `
                              <span class="text-indigo-800 font-bold">🎧 TOEIC: ${entry.toeicScore}/10</span>
                            ` : ''}
                          </div>
                        </div>

                        <!-- Clean Structured Text Blocks (Zero Boxes) -->
                        <div class="space-y-3 text-xs text-slate-800 leading-relaxed">
                          <div>
                            <span class="font-bold text-amber-900 uppercase tracking-wider text-[10.5px] block mb-0.5">🎯 Key Spoken Vocabulary</span>
                            <p class="whitespace-pre-line pl-3 border-l-2 border-amber-400 text-slate-700">
                              ${escapeHtml(entry.vocab) || '<span class="text-slate-400 italic">None logged</span>'}
                            </p>
                          </div>

                          <div>
                            <span class="font-bold text-slate-800 uppercase tracking-wider text-[10.5px] block mb-0.5">📖 Lesson Content Review (What I Learnt)</span>
                            <p class="whitespace-pre-line pl-3 border-l-2 border-slate-400 text-slate-700">
                              ${escapeHtml(entry.content) || '<span class="text-slate-400 italic">None logged</span>'}
                            </p>
                          </div>

                          <div>
                            <span class="font-bold text-rose-900 uppercase tracking-wider text-[10.5px] block mb-0.5">🛠️ What I Need to Work On (Weaknesses)</span>
                            <p class="whitespace-pre-line pl-3 border-l-2 border-rose-400 text-slate-700">
                              ${escapeHtml(entry.needs) || '<span class="text-slate-400 italic">None logged</span>'}
                            </p>
                          </div>

                          <div>
                            <span class="font-bold text-emerald-900 uppercase tracking-wider text-[10.5px] block mb-0.5">🗣️ Formative Evaluation Application</span>
                            <p class="whitespace-pre-line pl-3 border-l-2 border-emerald-400 text-slate-700">
                              ${escapeHtml(entry.helpFe) || '<span class="text-slate-400 italic">None logged</span>'}
                            </p>
                          </div>

                          ${entry.toeicPrep && !entry.toeicPrep.startsWith("N/A") && entry.toeicPrep.trim().length > 0 ? `
                            <div>
                              <span class="font-bold text-indigo-900 uppercase tracking-wider text-[10.5px] block mb-0.5">🎧 Independent Study &amp; TOEIC Practice This Week</span>
                              <p class="whitespace-pre-line pl-3 border-l-2 border-indigo-400 text-slate-700">
                                ${escapeHtml(entry.toeicPrep)}
                              </p>
                            </div>
                          ` : ''}
                        </div>
                      </div>
                    `;
                  }).join("")}
                </div>
              `}
            </div>
          `;
        });

        html += `</div>`;
      });

      html += `
        <!-- Teachers Institutional Sign-Off Strip -->
        <div class="pt-6 mt-8 border-t-2 border-slate-900">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-4">
            <div class="space-y-0.5">
              <span class="font-bold text-slate-900 block font-mono">${bookletCallsign}</span>
              <span class="text-[10.5px] text-slate-500">Official ENAC Academic Portfolio Dossier • Language Department (LAN)</span>
            </div>
            <div class="flex items-center gap-6 self-end sm:self-auto pt-2 sm:pt-0">
              <div class="text-center">
                <div class="h-8 w-36 border-b border-dashed border-slate-400"></div>
                <span class="text-[9.5px] text-slate-500 uppercase tracking-wider">Course Teacher</span>
              </div>
              <div class="text-center">
                <div class="h-8 w-36 border-b border-dashed border-slate-400"></div>
                <span class="text-[9.5px] text-slate-500 uppercase tracking-wider">Language Coordinator</span>
              </div>
            </div>
          </div>
        </div>
      `;

      container.innerHTML = html;
    }
