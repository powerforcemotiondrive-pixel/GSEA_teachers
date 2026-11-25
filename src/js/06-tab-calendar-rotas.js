// ============================================================================
    function renderRotasTab(sem) {
      if (!sem.rotas || (!sem.rotas.ag && !sem.rotas.at)) {
        // Fallback for other semesters
        return `
          <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 space-y-4 print-card">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ${sem.title} • FE Tutorial Rotas
                </span>
                <h2 class="text-base sm:text-lg font-bold text-slate-900 mt-1">30-Minute Oral Tutorial Slot Schedules</h2>
              </div>
              <button onclick="window.print()" class="no-print self-start px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer">
                <span>🖨️</span>
                <span>Print A4 Rota Sheet</span>
              </button>
            </div>
            <div class="p-6 text-center text-slate-400 italic">Rotas for ${sem.title} are scheduled closer to evaluation dates.</div>
          </div>
        `;
      }

      const activeTrack = sem.rotas[activeRotaTrack] || sem.rotas.at || sem.rotas.ag;
      const currentFe = activeTrack.fes[activeRotaFe] || activeTrack.fes[Object.keys(activeTrack.fes)[0]];

      const availableGroups = [];
      if (currentFe.groupA) availableGroups.push({ key: "groupA", letter: "A", name: "Group A", teacher: currentFe.groupA.teacher, slots: currentFe.groupA.slots });
      if (currentFe.groupB) availableGroups.push({ key: "groupB", letter: "B", name: "Group B", teacher: currentFe.groupB.teacher, slots: currentFe.groupB.slots });
      if (currentFe.groupC) availableGroups.push({ key: "groupC", letter: "C", name: "Group C", teacher: currentFe.groupC.teacher, slots: currentFe.groupC.slots });
      if (currentFe.groupD) availableGroups.push({ key: "groupD", letter: "D", name: "Group D", teacher: currentFe.groupD.teacher, slots: currentFe.groupD.slots });

      const maxSlots = Math.max(4, ...availableGroups.map(g => (g.slots || []).length));

      return `
        <div class="space-y-4">
          <!-- Visual Orientation Header Banner -->
          <div class="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200">
            <div class="grid grid-cols-1 md:grid-cols-12 items-stretch">
              <div class="md:col-span-4 relative min-h-[140px] sm:min-h-[160px] bg-slate-900">
                <img 
                  src="images/fe_progress_check.jpg" 
                  alt="Oral Tutorial Rotas & Timings" 
                  class="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span class="text-[9.5px] font-black uppercase tracking-wider text-amber-300 font-mono">
                    ${sem.title} • Rotas
                  </span>
                  <h4 class="text-xs sm:text-sm font-bold mt-0.5">Oral Tutorial Schedules</h4>
                </div>
              </div>
              <div class="md:col-span-8 p-4 sm:p-5 flex flex-col justify-center space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono shadow-2xs">
                    Teacher Guide
                  </span>
                  <span class="text-xs font-bold text-slate-800 font-mono">30-Minute Oral Tutorial Timings &amp; Pairings</span>
                </div>
                <p class="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  This schedule manages all 30-minute oral evaluation slots across FE milestones for ${availableGroups.map(g => `Group ${g.letter}`).join(', ')}. Candidate teams, pairs, and trios are assigned to ensure diverse peer interactions and equal speaking time. Use this page before each evaluation day to confirm candidate arrival times, verify room rosters, or print official tutorial door schedules for your classroom.
                </p>
              </div>
            </div>
          </div>

          <!-- Main Rotas Table Card -->
          <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 space-y-5 print-card">
            <!-- Top Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                ${sem.title} • Official FE Tutorial Rotas
              </span>
              <h2 class="text-base sm:text-lg font-bold text-slate-900 mt-1">30-Minute Oral Tutorial Slot Schedules</h2>
            </div>
            <button onclick="window.print()" class="no-print self-start px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs">
              <span>🖨️</span>
              <span>Print A4 Rota Sheet</span>
            </button>
          </div>

          <!-- Controls: Track Selector & Milestone Selector -->
          <div class="no-print bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <!-- Track Switcher -->
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Track:</span>
              <div class="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white">
                ${sem.rotas.ag ? `
                  <button type="button" onclick="setRotaTrack('ag')" class="px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${activeRotaTrack === 'ag' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
                    General English (AG • ${sem.rotas.ag.code || 'LV101E'})
                  </button>
                ` : ''}
                ${sem.rotas.at ? `
                  <button type="button" onclick="setRotaTrack('at')" class="px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${activeRotaTrack === 'at' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
                    Technical English (AT • ${sem.rotas.at.code || 'LV125E'})
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Milestone Switcher -->
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Milestone:</span>
              <div class="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white">
                ${Object.keys(activeTrack.fes || {}).map(feKey => {
                  const fe = activeTrack.fes[feKey];
                  const num = Number(feKey);
                  return `
                    <button type="button" onclick="setRotaFe(${num})" class="px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${activeRotaFe === num ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
                      FE${num} (${fe.week || 'Week'})
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Active Milestone Overview Banner -->
          <div class="p-4 bg-gradient-to-r from-slate-50 to-slate-100/60 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded text-[11px] font-black uppercase text-white ${activeRotaTrack === 'at' ? 'bg-blue-800' : 'bg-emerald-800'}">
                  ${activeTrack.code}
                </span>
                <h3 class="text-sm font-bold text-slate-900">${currentFe.title}</h3>
                <span class="text-xs font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">${currentFe.week}</span>
              </div>
              <p class="text-xs text-slate-600 mt-1">${currentFe.dateStr} • ${activeTrack.schedule}</p>
            </div>
            <div class="text-xs space-y-0.5 text-right sm:text-right">
              ${availableGroups.map(g => `<div><span class="text-slate-500 font-medium">Group ${g.letter}:</span> <strong class="text-slate-900">${g.teacher}</strong></div>`).join('')}
            </div>
          </div>

          <!-- Dynamic Slots Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <th class="py-3 px-3 w-32">Slot &amp; Time</th>
                  ${availableGroups.map(g => `<th class="py-3 px-3">Group ${g.letter} (${g.teacher})</th>`).join('')}
                  <th class="py-3 px-3 text-right">Length</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${Array.from({ length: maxSlots }, (_, idx) => {
                  const firstGrp = availableGroups[0];
                  const slotTime = (firstGrp && firstGrp.slots && firstGrp.slots[idx] && firstGrp.slots[idx].time) || `Slot ${idx + 1}`;
                  return `
                    <tr class="hover:bg-slate-50/80 transition-colors">
                      <td class="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <span class="text-slate-400 font-normal">Slot ${idx + 1}:</span> ${slotTime}
                      </td>
                      ${availableGroups.map(g => {
                        const s = (g.slots && g.slots[idx]) || { students: [] };
                        return `
                          <td class="py-3 px-3">
                            <div class="flex items-center gap-1.5 flex-wrap">
                              ${(s.students || []).map(st => `<span class="px-2 py-0.5 rounded font-mono font-bold bg-slate-50 border border-slate-200 text-slate-800" title="${formatStudentName(st)}">${getStudentShortName(st)}</span>`).join('')}
                            </div>
                          </td>
                        `;
                      }).join('')}
                      <td class="py-3 px-3 text-right font-mono text-slate-500 whitespace-nowrap">30 mins</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      `;
    }

    // ============================================================================
    // TAB 3: PROGRAMME & CALENDAR
    // ============================================================================
    function renderCalendarTab(sem) {
      if (!sem.calendar || (!sem.calendar.ag && !sem.calendar.at)) {
        // Fallback for other semesters
        return `
          <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 space-y-4 print-card">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ${sem.title} • Master Schedule
                </span>
                <h2 class="text-base sm:text-lg font-bold text-slate-900 mt-1">Curriculum &amp; Evaluation Timetable</h2>
              </div>
            </div>
            <div class="p-6 text-center text-slate-400 italic">Programme scheduled for future terms.</div>
          </div>
        `;
      }

      const activeCal = sem.calendar[activeCalendarTrack] || sem.calendar.at || sem.calendar.ag;

      return `
        <div class="space-y-4">
          <!-- Visual Orientation Header Banner -->
          <div class="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200">
            <div class="grid grid-cols-1 md:grid-cols-12 items-stretch">
              <div class="md:col-span-4 relative min-h-[140px] sm:min-h-[160px] bg-slate-900">
                <img 
                  src="images/course_admin.jpg" 
                  alt="Curriculum Architecture & Timetable" 
                  class="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span class="text-[9.5px] font-black uppercase tracking-wider text-amber-300 font-mono">
                    ${sem.title} • Programme
                  </span>
                  <h4 class="text-xs sm:text-sm font-bold mt-0.5">Curriculum Architecture</h4>
                </div>
              </div>
              <div class="md:col-span-8 p-4 sm:p-5 flex flex-col justify-center space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono shadow-2xs">
                    Teacher Guide
                  </span>
                  <span class="text-xs font-bold text-slate-800 font-mono">Curriculum Syllabus &amp; Milestones</span>
                </div>
                <p class="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  This master timetable provides a week-by-week roadmap of all teaching sessions and oral evaluation milestones across the semester. Use the track filter tabs below to review weekly lesson topics, room allocations, holiday breaks, and upcoming Formative Evaluation (FE) dates. Ensure your weekly classroom pacing aligns with the scheduled formative assessment checkpoints.
                </p>
              </div>
            </div>
          </div>

          <!-- Main Timetable Card -->
          <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 space-y-5 print-card">
            <!-- Top Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                ${sem.title} • Weekly Course Calendar
              </span>
              <h2 class="text-base sm:text-lg font-bold text-slate-900 mt-1">Curriculum &amp; Evaluation Timetable</h2>
            </div>
            <span class="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              ${activeCal.name} • ${activeCal.code}
            </span>
          </div>

          <!-- Course Track Switcher -->
          <div class="no-print bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Course Track:</span>
              <div class="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white">
                ${sem.calendar.ag ? `
                  <button type="button" onclick="setCalendarTrack('ag')" class="px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${activeCalendarTrack === 'ag' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
                    General English (AG • ${sem.calendar.ag.code || 'LV101E'})
                  </button>
                ` : ''}
                ${sem.calendar.at ? `
                  <button type="button" onclick="setCalendarTrack('at')" class="px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${activeCalendarTrack === 'at' ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}">
                    Technical English (AT • ${sem.calendar.at.code || 'LV125E'})
                  </button>
                ` : ''}
              </div>
            </div>
            <div class="text-xs text-slate-600 font-medium">
              <span>${activeCal.dayTime}</span> • <strong>${activeCal.faculty}</strong>
            </div>
          </div>

          <!-- Module Breakdown Tables -->
          <div class="space-y-4">
            ${activeCal.modules.map(mod => `
              <div class="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                <div class="px-4 py-2.5 bg-slate-800 text-white flex items-center justify-between">
                  <h3 class="text-xs font-bold uppercase tracking-wider">${mod.title}</h3>
                  <span class="text-[11px] font-mono text-slate-300 font-medium">${mod.weeks}</span>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase tracking-wider">
                        <th class="py-2.5 px-3 w-16">Week</th>
                        <th class="py-2.5 px-3 w-28">Date</th>
                        <th class="py-2.5 px-3">Session Title &amp; Topic</th>
                        <th class="py-2.5 px-3 text-right">Session Type</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      ${mod.sessions.map(s => {
                        if (s.isHoliday) {
                          return `
                            <tr class="bg-amber-50/50">
                              <td colspan="4" class="py-2 px-3 text-center text-xs font-bold text-amber-900">${s.text}</td>
                            </tr>
                          `;
                        }
                        return `
                          <tr class="${s.isFe ? 'bg-amber-50/70 font-semibold ' : 'hover:bg-slate-50/70'} transition-colors">
                            <td class="py-2.5 px-3 font-mono font-bold ${s.isFe ? 'text-amber-900' : 'text-slate-700'}">${s.week || '—'}</td>
                            <td class="py-2.5 px-3 font-medium text-slate-600 whitespace-nowrap">${s.date || '—'}</td>
                            <td class="py-2.5 px-3">
                              <div class="font-bold ${s.isFe ? 'text-slate-900' : 'text-slate-900'}">${s.title}</div>
                              ${s.subtitle ? `<div class="text-[10px] text-slate-500 mt-0.5">${s.subtitle}</div>` : ''}
                            </td>
                            <td class="py-2.5 px-3 text-right whitespace-nowrap">
                              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${s.isFe ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}">
                                ${s.tag || 'Session'}
                              </span>
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      `;
    }

    // ============================================================================
    // TAB 4: GROUPS AND ABSENCES (POWERED BY GOOGLE FORMS & GOOGLE SHEETS)
