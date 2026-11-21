// ============================================================================
    let activeAbsPromo = "GSEA26A";
    let activeAbsTrack = "AT";
    let activeAbsGroup = "A";
    let activeAbsStatus = "Absent";
    let isSyncingAbsencesSheet = false;

    function renderGroupsTab(sem) {
      const tracksList = sem.num === 1 ? ['AT', 'AG'] 
                       : (sem.num === 2 ? ['AAS', 'AG'] 
                       : (sem.num === 3 ? ['AT'] : ['AP']));
      if (!tracksList.includes(activeAbsTrack)) {
        activeAbsTrack = tracksList[0] || 'AT';
      }

      const groups = [];
      if (sem.students?.groupA?.length) groups.push({ key: "A", name: "Group A", ids: sem.students.groupA });
      if (sem.students?.groupB?.length) groups.push({ key: "B", name: "Group B", ids: sem.students.groupB });
      if (sem.students?.groupC?.length) groups.push({ key: "C", name: "Group C", ids: sem.students.groupC });
      if (sem.students?.groupD?.length) groups.push({ key: "D", name: "Group D", ids: sem.students.groupD });
      const totalStudentsCount = groups.reduce((acc, g) => acc + g.ids.length, 0);

      return `
        <div class="space-y-4">
          <!-- Visual Orientation Header Banner -->
          <div class="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200">
            <div class="grid grid-cols-1 md:grid-cols-12 items-stretch">
              <div class="md:col-span-4 relative min-h-[140px] sm:min-h-[160px] bg-slate-900">
                <img 
                  src="images/semester_objectives.jpg" 
                  alt="Class Groups & Attendance Monitoring" 
                  class="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span class="text-[9.5px] font-black uppercase tracking-wider text-amber-300 font-mono">
                    ${sem.title} • Cohort Groups
                  </span>
                  <h4 class="text-xs sm:text-sm font-bold mt-0.5">Rosters &amp; Attendance</h4>
                </div>
              </div>
              <div class="md:col-span-8 p-4 sm:p-5 flex flex-col justify-center space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono shadow-2xs">
                    Teacher Guide
                  </span>
                  <span class="text-xs font-bold text-slate-800 font-mono">Attendance Monitoring &amp; Group Administration</span>
                </div>
                <p class="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  This cockpit centralizes student group rosters and official attendance monitoring. Use the streamlined form on the left to immediately record student absences or arrival delays during class sessions, which automatically updates the live log and calculates total lost hours. The roster cards on the right provide quick access to assigned teachers, group headcounts, and candidate identifiers.
                </p>
              </div>
            </div>
          </div>

          <!-- Top Section: 2 Columns (Absence Logger + Teachers) -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <!-- Left 2 Cols: Absence / Lateness Record Form -->
            <div class="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200">
              <!-- Form: Balanced Institutional Cockpit Layout -->
              <form id="absence-record-form" onsubmit="handleAbsenceSubmit(event)" class="space-y-4">
                
                <!-- Card Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="text-[9.5px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        ${sem.title} • Attendance Tracker
                      </span>
                      <span class="text-[11px] font-mono text-slate-400">Live Incident Logger</span>
                    </div>
                    <h2 class="text-base sm:text-lg font-bold text-slate-900">Record Student Absence or Lateness</h2>
                  </div>
                  <div class="text-[11px] text-slate-500 font-medium">
                    Automatically calculates lost syllabus hours
                  </div>
                </div>

                <!-- Dedicated Submission Status Notification Banner (Zero Layout Shift) -->
                <div id="abs-submit-banner" class="hidden p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between transition-all">
                  <div class="flex items-center gap-2">
                    <span class="text-base">✓</span>
                    <span id="abs-submit-msg"></span>
                  </div>
                  <button type="button" onclick="document.getElementById('abs-submit-banner').classList.add('hidden')" class="text-emerald-600 hover:text-emerald-900 font-bold ml-2 cursor-pointer">✕</button>
                </div>

                <!-- Tier 1: 3 Balanced Equal Columns (4 : 4 : 4) -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  
                  <!-- 1. Class Group -->
                  <div class="space-y-1.5">
                    <label class="block text-[10.5px] font-bold uppercase tracking-wider text-slate-600">Class Group</label>
                    <div id="abs-group-pills" class="flex gap-1.5">
                      <button type="button" onclick="setAbsGroup('A')" class="abs-group-btn flex-1 h-10 px-3 rounded-xl text-xs font-bold transition-all border ${activeAbsGroup === 'A' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'}">Group A</button>
                      <button type="button" onclick="setAbsGroup('B')" class="abs-group-btn flex-1 h-10 px-3 rounded-xl text-xs font-bold transition-all border ${activeAbsGroup === 'B' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'}">Group B</button>
                    </div>
                  </div>

                  <!-- 2. Track / Subject -->
                  <div class="space-y-1.5">
                    <label class="block text-[10.5px] font-bold uppercase tracking-wider text-slate-600">Curriculum Track</label>
                    <div id="abs-track-pills" class="flex gap-1.5">
                      ${tracksList.map(t => `
                        <button 
                          type="button" 
                          onclick="setAbsTrack('${t}')" 
                          class="abs-track-btn flex-1 h-10 px-3 rounded-xl text-xs font-bold transition-all border ${activeAbsTrack === t ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'}"
                        >
                          ${t}
                        </button>
                      `).join('')}
                    </div>
                  </div>

                  <!-- 3. Incident Status & Duration -->
                  <div class="space-y-1.5">
                    <label class="block text-[10.5px] font-bold uppercase tracking-wider text-slate-600">Incident Type</label>
                    <div class="flex items-center gap-1.5">
                      <button 
                        type="button" 
                        onclick="setAbsStatus('Absent')" 
                        class="abs-status-btn flex-1 h-10 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${activeAbsStatus === 'Absent' ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'}"
                      >
                        <span class="w-2 h-2 rounded-full ${activeAbsStatus === 'Absent' ? 'bg-rose-500' : 'bg-slate-300'}"></span>
                        <span>Absent</span>
                      </button>

                      <button 
                        type="button" 
                        onclick="setAbsStatus('Late')" 
                        class="abs-status-btn flex-1 h-10 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${activeAbsStatus === 'Late' ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'}"
                      >
                        <span class="w-2 h-2 rounded-full ${activeAbsStatus === 'Late' ? 'bg-amber-500' : 'bg-slate-300'}"></span>
                        <span>Late</span>
                      </button>

                      <div id="abs-late-duration-box" class="${activeAbsStatus === 'Late' ? 'flex' : 'hidden'} items-center shrink-0">
                        <select id="abs-delay-duration" class="h-10 text-xs font-bold px-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-800 shadow-2xs">
                          <option value="5-10 mins">5–10m</option>
                          <option value="15-20 mins" selected>15–20m</option>
                          <option value="30+ mins">30m+</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>

                <!-- Tier 2: Candidate & Date (Clean 2-Column Balanced Grid: 8 cols : 4 cols) -->
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-3 border-t border-slate-100">
                  
                  <!-- Candidate Selector (8 cols) -->
                  <div class="sm:col-span-8 space-y-1.5">
                    <label class="block text-[10.5px] font-bold uppercase tracking-wider text-slate-600">
                      Candidate Identifier &amp; Name <span class="text-rose-500">*</span>
                    </label>
                    <select id="abs-student-select" class="w-full h-11 text-xs font-bold px-3 rounded-xl border border-slate-300 bg-slate-50/60 text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-800 focus:outline-none shadow-2xs">
                      <!-- Populated dynamically via updateAbsStudentOptions() -->
                    </select>
                  </div>

                  <!-- Date Picker (4 cols) -->
                  <div class="sm:col-span-4 space-y-1.5">
                    <label class="block text-[10.5px] font-bold uppercase tracking-wider text-slate-600">
                      Session Date
                    </label>
                    <input 
                      type="date" 
                      id="abs-incident-date" 
                      value="${new Date().toISOString().split('T')[0]}" 
                      class="w-full h-11 text-xs font-bold px-3 rounded-xl border border-slate-300 bg-slate-50/60 text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-800 focus:outline-none shadow-2xs font-mono"
                    >
                  </div>

                </div>

                <!-- Tier 3: Reason / Notes (Full Width) -->
                <div class="space-y-1.5 pt-1">
                  <label class="block text-[10.5px] font-bold uppercase tracking-wider text-slate-600">
                    Reason / Official Justification <span class="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input 
                    type="text" 
                    id="abs-incident-notes" 
                    placeholder="e.g. Medical certificate provided, transport disruption, prior academic appointment..." 
                    class="w-full h-11 text-xs px-3.5 rounded-xl border border-slate-300 bg-slate-50/60 text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-800 focus:outline-none shadow-2xs placeholder:text-slate-400"
                  >
                </div>

                <!-- Tier 4: Action Submission Bar -->
                <div class="flex items-center justify-between pt-3.5 border-t border-slate-100 gap-3">
                  <button 
                    type="button" 
                    onclick="resetAbsenceInputs()" 
                    class="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                  >
                    Reset Form
                  </button>
                  <button 
                    type="submit" 
                    id="btn-submit-absence" 
                    class="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer border border-amber-400"
                  >
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                    <span>Record Attendance Incident</span>
                  </button>
                </div>

              </form>
            </div>

            <!-- Right Col: Assigned Teachers -->
            <div>
              <div class="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
                <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span class="text-xs font-bold text-slate-800">Assigned Teachers</span>
                  <span class="text-[10px] font-mono text-slate-400">${sem.title}</span>
                </div>
                <div class="space-y-2">
                  ${(sem.faculty || []).map(f => `
                    <div class="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div>
                        <div class="font-bold text-xs text-slate-900">${f.name}</div>
                        <div class="text-[10px] text-slate-500">${f.group} • ${f.schedule}</div>
                      </div>
                      <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${f.track === 'AT' ? 'bg-blue-800' : 'bg-emerald-800'}">${f.track}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Middle Section: Official Student Group Lists & Rosters -->
          <div class="space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                <h3 class="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Official Student Group Lists &amp; Rosters
                </h3>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-slate-500 font-mono">
                  ${sem.promotion || 'GSEA26A'} • ${totalStudentsCount} Total Students
                </span>
                <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-bold">
                  ${sem.tracks || 'AG &amp; AT'}
                </span>
              </div>
            </div>

            <!-- Group Cards Grid (Group A, Group B, etc.) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${groups.map(g => `
                <div class="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
                  <!-- Group Header -->
                  <div class="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full ${g.key === 'A' ? 'bg-emerald-400' : (g.key === 'B' ? 'bg-sky-400' : 'bg-purple-400')}"></span>
                      <h4 class="text-xs font-bold uppercase tracking-wider font-mono">
                        ${g.name} (${g.ids.length} Students)
                      </h4>
                    </div>
                    <span class="text-[10px] bg-white/15 px-2 py-0.5 rounded font-mono font-bold">
                      ${g.ids.length >= 10 ? '2 Pairs + 2 Trios' : '3 Pairs + 1 Trio'} • 4 Slots
                    </span>
                  </div>

                  <!-- Group Table -->
                  <div class="overflow-x-auto flex-1">
                    <table class="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr class="bg-slate-50 text-slate-600 border-b border-slate-200 text-[10px] uppercase font-bold tracking-wider">
                          <th class="py-2.5 px-3 w-10 text-center">#</th>
                          <th class="py-2.5 px-3">Student Name &amp; Candidate ID</th>
                          <th class="py-2.5 px-3 text-right">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        ${g.ids.map((stId, idx) => `
                          <tr class="hover:bg-slate-50/70 transition-colors">
                            <td class="py-2 px-3 text-center font-mono text-[11px] text-slate-400 font-bold">
                              ${idx + 1}
                            </td>
                            <td class="py-2 px-3 whitespace-nowrap">
                              <div class="flex items-center gap-2">
                                <span class="font-mono font-bold text-slate-900 text-xs">${formatStudentName(stId)}</span>
                                <span class="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">${stId}</span>
                              </div>
                            </td>
                            <td class="py-2 px-3 text-right whitespace-nowrap">
                              <div class="inline-flex items-center gap-1.5 justify-end">
                                <button 
                                  type="button" 
                                  onclick="quickSelectStudentForAbsence('${stId}', '${g.key}')" 
                                  class="px-2 py-1 rounded-lg text-[10.5px] font-bold bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-900 border border-amber-200 transition-colors cursor-pointer shadow-2xs"
                                  title="Select ${formatStudentName(stId)} in the absence recording form above"
                                >
                                  + Log Incident
                                </button>
                                <button 
                                  type="button" 
                                  onclick="filterRegisterForStudent('${stId}')" 
                                  class="p-1 rounded-lg text-[10.5px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                                  title="Filter attendance register below for ${formatStudentName(stId)}"
                                >
                                  🔍
                                </button>
                              </div>
                            </td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Bottom Section: Live Absence & Lateness Register Table -->
          <div class="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Attendance Database
                </span>
                <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-1">Live Absence &amp; Lateness Register</h3>
                <p class="text-xs text-slate-500">Synchronized across teacher devices via Google Sheet and local browser cache.</p>
              </div>

              <!-- Action Controls: Copy for Sheets, Export CSV, Clear -->
              <div class="flex flex-wrap items-center gap-2">
                <button 
                  type="button" 
                  onclick="openAbsenceReportModal()" 
                  class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-xs cursor-pointer border border-amber-400"
                  title="Generate Official ENAC Attendance & Absence Dossier (PDF)"
                >
                  <span>🖨️</span>
                  <span>Absence Report (PDF)</span>
                </button>
                <button 
                  type="button" 
                  onclick="copyAbsencesForSheets()" 
                  class="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                  title="Copy formatted tab-separated values ready to paste (Cmd+V) directly into Google Sheets"
                >
                  <span>📋</span>
                  <span>Copy for Sheets</span>
                </button>
                <button 
                  type="button" 
                  onclick="exportAbsencesCSV()" 
                  class="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                  title="Download clean CSV spreadsheet"
                >
                  <span>📥</span>
                  <span>Export CSV</span>
                </button>
                <button 
                  type="button" 
                  onclick="clearAbsenceLogs()" 
                  class="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-500 font-bold text-xs cursor-pointer transition-all"
                  title="Clear local logs"
                >
                  Clear
                </button>
              </div>
            </div>

            <!-- Filters Row -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div class="flex items-center flex-wrap gap-2 flex-1 min-w-[200px]">
                <input 
                  id="abs-search-input" 
                  type="search" 
                  oninput="renderAbsenceLogs()" 
                  placeholder="Search student, note, date..." 
                  class="p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 flex-1 min-w-[150px]"
                >
                <select id="abs-filter-status" onchange="renderAbsenceLogs()" class="p-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-bold focus:ring-2 focus:ring-slate-800">
                  <option value="all">All Statuses (Absent &amp; Late)</option>
                  <option value="Absent">🔴 Absent Only</option>
                  <option value="Late">🟡 Late Only</option>
                </select>
                <select id="abs-filter-group" onchange="renderAbsenceLogs()" class="p-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-bold focus:ring-2 focus:ring-slate-800">
                  <option value="all">All Groups</option>
                  <option value="A">Group A</option>
                  <option value="B">Group B</option>
                </select>
                <select id="abs-filter-date" onchange="renderAbsenceLogs()" class="p-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-bold focus:ring-2 focus:ring-slate-800">
                  <option value="all">All Dates</option>
                  <option value="today">Today Only</option>
                  <option value="this_month">This Month</option>
                </select>
              </div>
              <span id="abs-register-count" class="font-mono text-slate-500 font-bold text-[11px]">0 incidents</span>
            </div>

            <!-- Table of Logged Absences (5-6 Rows Visible, Scrollable) -->
            <div class="max-h-[340px] overflow-y-auto overflow-x-auto rounded-xl border border-slate-200">
              <table class="w-full text-left text-xs border-collapse">
                <thead class="sticky top-0 bg-slate-50 z-10 shadow-2xs">
                  <tr class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <th class="py-2.5 px-3">Date &amp; Time</th>
                    <th class="py-2.5 px-3">Student &amp; Group</th>
                    <th class="py-2.5 px-3">Cohort &amp; Track</th>
                    <th class="py-2.5 px-3 text-center">Status</th>
                    <th class="py-2.5 px-3">Reason / Notes</th>
                    <th class="py-2.5 px-3 text-center">Source</th>
                    <th class="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody id="absence-register-tbody" class="divide-y divide-slate-100 bg-white">
                  <!-- Dynamically rendered via renderAbsenceLogs() -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- Absence Report Print / PDF Modal -->
        <div id="absence-report-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div class="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-300 max-h-[92vh] flex flex-col overflow-hidden">
            <!-- Modal Control Header (hidden in print) -->
            <div class="no-print p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                  🖨️
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900">Official Attendance &amp; Absence Dossier</h3>
                  <p class="text-xs text-slate-500">Official ENAC Registry Transcripts, Absence Tallies &amp; Session Incidents</p>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <!-- Scope Filter -->
                <select id="abs-report-candidate-filter" onchange="renderAbsenceReportPrintArea()" class="text-xs font-bold p-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-800">
                  <option value="all">All Candidates (Full Promotion Dossier)</option>
                  <option value="grpA">Group A Only</option>
                  <option value="grpB">Group B Only</option>
                </select>

                <!-- Incident Type Filter -->
                <select id="abs-report-type-filter" onchange="renderAbsenceReportPrintArea()" class="text-xs font-bold p-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-800">
                  <option value="all">All Incidents (Absent &amp; Late)</option>
                  <option value="Absent">🔴 Absent Only</option>
                  <option value="Late">🟡 Late Only</option>
                </select>

                <button type="button" onclick="syncAbsencesFromGoogleSheet(true); setTimeout(renderAbsenceReportPrintArea, 1200);" class="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer" title="Fetch fresh records from Google Sheet">
                  <span>🔄</span>
                  <span>Sync Cloud</span>
                </button>
                <button type="button" onclick="window.print()" class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer border border-amber-400">
                  <span>🖨️</span>
                  <span>Print / Save as PDF</span>
                </button>
                <button type="button" onclick="closeAbsenceReportModal()" class="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer">
                  ✕ Close
                </button>
              </div>
            </div>

            <!-- Scrollable Report View / Print Container -->
            <div id="absence-report-scroll-container" class="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100/60">
              <div id="absence-report-print-area" class="max-w-4xl mx-auto space-y-6">
                <!-- Injected via renderAbsenceReportPrintArea() -->
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // ============================================================================
    // TAB 4: GROUPS AND ABSENCES HANDLERS & GOOGLE CLOUD PIPELINE
    // ============================================================================

    function initGroupsTab() {
      updateAbsStudentOptions();
      renderAbsenceLogs();
      checkAbsenceSheetStatus();
      syncAbsencesFromGoogleSheet(false);
    }

    function setAbsPromo(promo) {
      activeAbsPromo = promo;
      document.querySelectorAll('.abs-promo-btn').forEach(btn => {
        const isActive = btn.textContent.trim() === promo;
        btn.className = "abs-promo-btn px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border " + (isActive ? 'bg-slate-800 text-white border-slate-800 shadow-2xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100');
      });
      updateAbsStudentOptions();
    }

    function setAbsTrack(track) {
      activeAbsTrack = track;
      document.querySelectorAll('.abs-track-btn').forEach(btn => {
        const isActive = btn.textContent.trim() === track;
        btn.className = "abs-track-btn flex-1 h-10 px-3 rounded-xl text-xs font-bold transition-all border " + (isActive ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200');
      });
    }

    function setAbsGroup(group) {
      activeAbsGroup = group;
      document.querySelectorAll('.abs-group-btn').forEach(btn => {
        const txt = btn.textContent.trim();
        const isActive = txt.endsWith(group) || txt === group;
        btn.className = "abs-group-btn flex-1 h-10 px-3 rounded-xl text-xs font-bold transition-all border " + (isActive ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200');
      });
      updateAbsStudentOptions();
    }

    function setAbsStatus(status) {
      activeAbsStatus = status;
      const durationBox = document.getElementById('abs-late-duration-box');
      if (durationBox) {
        if (status === 'Late') {
          durationBox.classList.remove('hidden');
          durationBox.classList.add('flex');
        } else {
          durationBox.classList.add('hidden');
          durationBox.classList.remove('flex');
        }
      }
      renderGroupsTabPillStates();
    }

    function renderGroupsTabPillStates() {
      const container = document.getElementById('absence-record-form');
      if (!container) return;
      const buttons = container.querySelectorAll('.abs-status-btn');
      buttons.forEach(btn => {
        const isAbsentBtn = btn.getAttribute('onclick').includes("'Absent'");
        if (isAbsentBtn) {
          const isActive = activeAbsStatus === 'Absent';
          btn.className = "abs-status-btn flex-1 h-10 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer " + (isActive ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200');
          const dot = btn.querySelector('.rounded-full');
          if (dot) dot.className = "w-2 h-2 rounded-full " + (isActive ? 'bg-rose-500' : 'bg-slate-300');
        } else {
          const isActive = activeAbsStatus === 'Late';
          btn.className = "abs-status-btn flex-1 h-10 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer " + (isActive ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200');
          const dot = btn.querySelector('.rounded-full');
          if (dot) dot.className = "w-2 h-2 rounded-full " + (isActive ? 'bg-amber-500' : 'bg-slate-300');
        }
      });
    }

    function updateAbsStudentOptions() {
      const select = document.getElementById('abs-student-select');
      if (!select) return;
      const sem = SEMESTERS_DATA[activeSemester] || SEMESTERS_DATA[1];

      let studentList = [];
      if (activeAbsGroup === 'A') studentList = sem.students?.groupA || [];
      else if (activeAbsGroup === 'B') studentList = sem.students?.groupB || [];
      else if (activeAbsGroup === 'C') studentList = sem.students?.groupC || [];
      else if (activeAbsGroup === 'D') studentList = sem.students?.groupD || [];

      if (studentList.length === 0) {
        studentList = [...(sem.students?.groupA || []), ...(sem.students?.groupB || [])];
      }

      select.innerHTML = studentList.map(s => `
        <option value="${s}">${formatStudentName(s)} (Group ${activeAbsGroup})</option>
      `).join('');
    }

    function resetAbsenceInputs() {
      const notesEl = document.getElementById('abs-incident-notes');
      if (notesEl) notesEl.value = '';
      setAbsStatus('Absent');
      const dateEl = document.getElementById('abs-incident-date');
      if (dateEl) dateEl.value = new Date().toISOString().split('T')[0];
    }

    function quickSelectStudentForAbsence(stId, groupKey) {
      setAbsGroup(groupKey);
      const select = document.getElementById('abs-student-select');
      if (select) select.value = stId;
      const formCard = document.getElementById('absence-record-form');
      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        formCard.classList.add('ring-2', 'ring-amber-400');
        setTimeout(() => formCard.classList.remove('ring-2', 'ring-amber-400'), 1500);
      }
    }

    function filterRegisterForStudent(stId) {
      const searchInput = document.getElementById('abs-search-input');
      if (searchInput) {
        searchInput.value = stId;
        renderAbsenceLogs();
        const tableEl = document.getElementById('absence-register-tbody');
        if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Google Form Submission Pipeline (matching GSEA_attendance)
    async function submitAbsenceToGoogleForm(rec) {
      if (!BUILTIN_GFORM_CONFIG || !BUILTIN_GFORM_CONFIG.formUrl) return false;

      const formUrl = BUILTIN_GFORM_CONFIG.formUrl.replace(/\/viewform.*$/, '/formResponse');
      const params = new URLSearchParams();

      if (BUILTIN_GFORM_CONFIG.entryPromotion) params.append(BUILTIN_GFORM_CONFIG.entryPromotion, rec.promotion);
      if (BUILTIN_GFORM_CONFIG.entryClassType) params.append(BUILTIN_GFORM_CONFIG.entryClassType, rec.classType);
      if (BUILTIN_GFORM_CONFIG.entryGroup) params.append(BUILTIN_GFORM_CONFIG.entryGroup, rec.group);
      if (BUILTIN_GFORM_CONFIG.entryStatus) params.append(BUILTIN_GFORM_CONFIG.entryStatus, rec.status);
      if (BUILTIN_GFORM_CONFIG.entryStudentName) params.append(BUILTIN_GFORM_CONFIG.entryStudentName, rec.studentName);
      const postDate = rec.date && rec.date.includes('-') ? rec.date : toIsoDate(rec.date);
      if (BUILTIN_GFORM_CONFIG.entryDate) params.append(BUILTIN_GFORM_CONFIG.entryDate, postDate);
      if (BUILTIN_GFORM_CONFIG.entryNotes && rec.notes) params.append(BUILTIN_GFORM_CONFIG.entryNotes, rec.notes);

      try {
        await fetch(formUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString()
        });
        return true;
      } catch (err) {
        try {
          submitViaHiddenIframe(formUrl, params);
          return true;
        } catch (e2) {
          console.warn("Could not submit to Google Form:", err, e2);
          return false;
        }
      }
    }

    function submitViaHiddenIframe(formUrl, params) {
      let iframe = document.getElementById("gform_hidden_iframe");
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "gform_hidden_iframe";
        iframe.name = "gform_hidden_iframe";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
      }

      const form = document.createElement("form");
      form.target = "gform_hidden_iframe";
      form.action = formUrl;
      form.method = "POST";
      form.style.display = "none";

      for (const [key, value] of params.entries()) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      setTimeout(() => { form.remove(); }, 1000);
    }

    async function handleAbsenceSubmit(e) {
      if (e) e.preventDefault();
      const sem = SEMESTERS_DATA[activeSemester] || SEMESTERS_DATA[1];
      const studentVal = document.getElementById('abs-student-select')?.value || '';
      const dateVal = document.getElementById('abs-incident-date')?.value || new Date().toISOString().split('T')[0];
      const rawNotes = document.getElementById('abs-incident-notes')?.value?.trim() || '';

      if (!studentVal) {
        alert("Please select a student.");
        return;
      }

      let notesVal = rawNotes;
      if (activeAbsStatus === 'Late') {
        const delayDuration = document.getElementById('abs-delay-duration')?.value || '15-20 mins';
        notesVal = notesVal ? ('[' + delayDuration + '] ' + notesVal) : ('[' + delayDuration + ' late]');
      }

      const studentName = formatStudentName(studentVal);

      const record = {
        id: "LOCAL-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
        sem: activeSemester,
        promotion: activeAbsPromo,
        classType: activeAbsTrack,
        group: activeAbsGroup,
        status: activeAbsStatus,
        student: studentVal,
        studentName: studentName,
        date: dateVal,
        notes: notesVal,
        source: "local",
        createdAt: Date.now(),
        timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      };

      // 1. Save locally
      let logs = [];
      try { logs = JSON.parse(localStorage.getItem(LOCAL_ABSENCES_KEY)) || []; } catch (err) { logs = []; }
      logs.unshift(record);
      localStorage.setItem(LOCAL_ABSENCES_KEY, JSON.stringify(logs));

      // Reset text inputs
      if (document.getElementById('abs-incident-notes')) document.getElementById('abs-incident-notes').value = '';

      const banner = document.getElementById('abs-submit-banner');
      const msgEl = document.getElementById('abs-submit-msg');
      if (banner && msgEl) {
        banner.classList.remove('hidden');
        msgEl.textContent = "Logged " + studentName + " (" + activeAbsStatus + ") locally! Streaming to cloud...";
      }

      renderAbsenceLogs();

      // 2. Stream to Google Form
      const gSuccess = await submitAbsenceToGoogleForm(record);
      if (gSuccess && msgEl) {
        msgEl.textContent = "Logged " + studentName + " (" + activeAbsStatus + ") • Synced to Google Sheet!";
        setTimeout(() => { 
          if (banner) banner.classList.add('hidden');
          if (msgEl) msgEl.textContent = ''; 
        }, 4000);
      }

      // 3. Re-sync from Google Sheet after 2 seconds to absorb sheet row
      setTimeout(() => {
        syncAbsencesFromGoogleSheet(false);
      }, 2000);
    }

    // Google Sheet GViz API Engine (matching GSEA_attendance)
    function fetchSheetViaJsonp(sheetId, gid, timeoutMs = 7000) {
      return new Promise((resolve, reject) => {
        const callbackName = "__gsea_sheet_cb_" + Math.floor(Math.random() * 1000000);
        let timer = null;

        const cleanup = () => {
          if (timer) clearTimeout(timer);
          try { delete window[callbackName]; } catch (e) {}
          const el = document.getElementById(callbackName);
          if (el) el.remove();
        };

        window[callbackName] = (data) => {
          cleanup();
          resolve(data);
        };

        const script = document.createElement("script");
        script.id = callbackName;
        script.src = "https://docs.google.com/spreadsheets/d/" + sheetId + "/gviz/tq?tqx=responseHandler:" + callbackName + "&gid=" + gid + "&_t=" + Date.now();
        script.onerror = () => {
          cleanup();
          reject(new Error("Network or permission restriction connecting to Google Sheet"));
        };

        timer = setTimeout(() => {
          cleanup();
          reject(new Error("Timeout waiting for Google Sheet response"));
        }, timeoutMs);

        document.head.appendChild(script);
      });
    }

    function extractGvizJson(text) {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        return JSON.parse(text.substring(start, end + 1));
      }
      throw new Error("Invalid response format from Google Sheet");
    }

    function parseGvizTable(table) {
      if (!table || !table.rows) return [];
      const cols = (table.cols || []).map(c => (c.label || c.id || "").trim().toLowerCase());

      let tsIdx = cols.findIndex(c => c.includes("timestamp") || c.includes("horodateur") || c.includes("time"));
      let promoIdx = cols.findIndex(c => c.includes("promo"));
      let classIdx = cols.findIndex(c => c.includes("class") || c.includes("type"));
      let groupIdx = cols.findIndex(c => c.includes("group"));
      let statusIdx = cols.findIndex(c => c.includes("status") || c.includes("incident"));
      let nameIdx = cols.findIndex(c => c.includes("student") || c.includes("name") || c.includes("nom"));
      let dateIdx = cols.findIndex(c => c === "date" || (c.includes("date") && !c.includes("time")));
      let notesIdx = cols.findIndex(c => c.includes("note") || c.includes("reason"));

      if (tsIdx === -1) tsIdx = 0;
      if (promoIdx === -1) promoIdx = 1;
      if (classIdx === -1) classIdx = 2;
      if (groupIdx === -1) groupIdx = 3;
      if (statusIdx === -1) statusIdx = 4;
      if (nameIdx === -1) nameIdx = 5;
      if (dateIdx === -1) dateIdx = 6;
      if (notesIdx === -1) notesIdx = 7;

      const getVal = (row, idx) => {
        if (idx < 0 || !row.c || !row.c[idx]) return "";
        const cell = row.c[idx];
        if (cell.f !== undefined && cell.f !== null) return String(cell.f).trim();
        if (cell.v !== undefined && cell.v !== null) return String(cell.v).trim();
        return "";
      };

      const parsedRecords = [];
      for (const row of table.rows) {
        const studentName = getVal(row, nameIdx);
        if (!studentName) continue;

        const statusRaw = getVal(row, statusIdx) || "Absent";
        const promotion = getVal(row, promoIdx) || "GSEA26A";
        const dateRaw = getVal(row, dateIdx);

        if (isHeaderRow(studentName, statusRaw, promotion, dateRaw)) continue;

        const isLate = statusRaw.toLowerCase().includes("late") || statusRaw.toLowerCase().includes("retard");
        const status = isLate ? "Late" : "Absent";
        const classType = getVal(row, classIdx) || "AT";
        const group = getVal(row, groupIdx) || "A";
        const notes = getVal(row, notesIdx);
        const timestampRaw = getVal(row, tsIdx);

        const dateCell = (row.c && dateIdx >= 0) ? row.c[dateIdx] : null;
        let date = extractEuropeanDate(dateCell, dateRaw);

        parsedRecords.push({
          id: "SHEET-" + (table.rows.indexOf(row) + 1) + "-" + strHashCode(timestampRaw + studentName + date + status),
          sheetRow: table.rows.indexOf(row) + 1,
          timestamp: formatTimestampEuropean(timestampRaw),
          date: date,
          promotion: promotion,
          classType: classType,
          group: group,
          status: status,
          studentName: studentName,
          student: studentName,
          notes: notes,
          source: "sheet"
        });
      }
      return parsedRecords;
    }

    function isHeaderRow(name, status, promo, date) {
      const n = String(name || "").toLowerCase().trim();
      const s = String(status || "").toLowerCase().trim();
      if (!n) return true;
      const headers = ["student name", "student", "name", "full name", "timestamp", "horodateur", "class type", "group", "notes"];
      if (headers.includes(n)) return true;
      if (s === "status" || s === "incident status") return true;
      return false;
    }

    function extractEuropeanDate(cell, rawStr) {
      if (cell && typeof cell === "object") {
        const v = cell.v !== undefined && cell.v !== null ? String(cell.v).trim() : "";
        const f = cell.f !== undefined && cell.f !== null ? String(cell.f).trim() : "";
        if (v && v.startsWith("Date(")) return formatAnyDateToEuropean(v);
        if (f) return formatAnyDateToEuropean(f);
        if (v) return formatAnyDateToEuropean(v);
      }
      return formatAnyDateToEuropean(rawStr || "");
    }

    function formatAnyDateToEuropean(val) {
      if (!val) return "";
      const s = String(val).trim();
      if (!s) return "";

      const mGviz = s.match(/Date\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})/i);
      if (mGviz) {
        let y = mGviz[1];
        const m = String(parseInt(mGviz[2], 10) + 1).padStart(2, "0");
        const d = String(parseInt(mGviz[3], 10)).padStart(2, "0");
        return `${d}/${m}/${y}`;
      }

      const mIso = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
      if (mIso) {
        let y = mIso[1];
        const m = String(parseInt(mIso[2], 10)).padStart(2, "0");
        const d = String(parseInt(mIso[3], 10)).padStart(2, "0");
        return `${d}/${m}/${y}`;
      }

      return s;
    }

    function toIsoDate(d) {
      if (!d) return "";
      const m = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (m) {
        return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
      }
      return d;
    }

    function formatTimestampEuropean(ts) {
      if (!ts) return "-";
      const s = String(ts).trim();
      if (!s || s === "-") return "-";
      if (s.includes(" ")) {
        const parts = s.split(" ");
        const dEu = formatAnyDateToEuropean(parts[0]);
        const t = parts.slice(1).join(" ");
        return `${dEu} ${t}`;
      }
      return formatAnyDateToEuropean(s);
    }

    function strHashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash).toString(36);
    }

    async function checkAbsenceSheetStatus() {
      const badge = document.getElementById('abs-backend-status-badge');
      if (!badge) return;
      if (!BUILTIN_SHEET_CONFIG || !BUILTIN_SHEET_CONFIG.sheetId) return;

      try {
        const gvizUrl = "https://docs.google.com/spreadsheets/d/" + BUILTIN_SHEET_CONFIG.sheetId + "/gviz/tq?tqx=out:json&gid=" + BUILTIN_SHEET_CONFIG.gid + "&_t=" + Date.now();
        const res = await fetch(gvizUrl, { cache: "no-store" });
        if (res.ok) {
          badge.className = "text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs";
          badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span>🟢 Google Sheet Live</span>';
          return;
        }
      } catch (e) {}

      badge.className = "text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1.5 shadow-2xs";
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-slate-400"></span><span>⚪ Local Storage Mode</span>';
    }

    async function syncAbsencesFromGoogleSheet(isManual = false) {
      if (!BUILTIN_SHEET_CONFIG || !BUILTIN_SHEET_CONFIG.sheetId) return;
      if (isSyncingAbsencesSheet) return;
      isSyncingAbsencesSheet = true;

      const spinner = document.getElementById('abs-sync-spinner');
      if (spinner) spinner.classList.add('animate-spin');

      try {
        let sheetRecords = null;

        // Protocol 1: Direct fetch GViz JSON
        try {
          const gvizUrl = "https://docs.google.com/spreadsheets/d/" + BUILTIN_SHEET_CONFIG.sheetId + "/gviz/tq?tqx=out:json&gid=" + BUILTIN_SHEET_CONFIG.gid + "&_t=" + Date.now();
          const res = await fetch(gvizUrl, { cache: "no-store" });
          if (res.ok) {
            const text = await res.text();
            if (text.includes("google.visualization.Query.setResponse")) {
              const gvizData = extractGvizJson(text);
              if (gvizData && gvizData.table) {
                sheetRecords = parseGvizTable(gvizData.table);
              }
            }
          }
        } catch (fetchErr) {}

        // Protocol 2: GViz JSONP fallback
        if (!sheetRecords || sheetRecords.length === 0) {
          try {
            const gvizData = await fetchSheetViaJsonp(BUILTIN_SHEET_CONFIG.sheetId, BUILTIN_SHEET_CONFIG.gid, 5000);
            if (gvizData && gvizData.table) {
              sheetRecords = parseGvizTable(gvizData.table);
            }
          } catch (jsonpErr) {}
        }

        if (sheetRecords && Array.isArray(sheetRecords)) {
          mergeAbsenceSheetRecords(sheetRecords);
          renderAbsenceLogs();
          const badge = document.getElementById('abs-backend-status-badge');
          if (badge) {
            badge.className = "text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs";
            badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span>🟢 Google Sheet Live</span>';
          }
          if (isManual) {
            alert("✓ Synced successfully! Retrieved " + sheetRecords.length + " attendance record(s) from master Google Sheet.");
          }
        }
      } catch (err) {
        console.warn("Could not sync absences from Google Sheet:", err);
      } finally {
        isSyncingAbsencesSheet = false;
        if (spinner) spinner.classList.remove('animate-spin');
      }
    }

    function mergeAbsenceSheetRecords(sheetRecords) {
      if (!sheetRecords || sheetRecords.length === 0) return;

      let localLogs = [];
      try { localLogs = JSON.parse(localStorage.getItem(LOCAL_ABSENCES_KEY)) || []; } catch(e) {}

      // Keep recent local submissions (less than 15 mins) that might not be synced yet
      const now = Date.now();
      const pendingLocal = localLogs.filter(l => {
        if (l.source !== "local") return false;
        if (l.createdAt && (now - l.createdAt > 15 * 60 * 1000)) return false;
        const localName = (l.studentName || l.student || "").toLowerCase().trim();
        const alreadyInSheet = sheetRecords.some(s => {
          const sName = (s.studentName || "").toLowerCase().trim();
          return sName === localName && s.date === formatAnyDateToEuropean(l.date);
        });
        return !alreadyInSheet;
      });

      const merged = [...sheetRecords, ...pendingLocal];
      // Sort newest first
      merged.sort((a, b) => (b.sheetRow || 0) - (a.sheetRow || 0));

      localStorage.setItem(LOCAL_ABSENCES_KEY, JSON.stringify(merged));
    }

    function renderAbsenceLogs() {
      const tbody = document.getElementById('absence-register-tbody');
      if (!tbody) return;

      let logs = [];
      try { logs = JSON.parse(localStorage.getItem(LOCAL_ABSENCES_KEY)) || []; } catch (err) { logs = []; }

      // Filter controls
      const query = (document.getElementById('abs-search-input')?.value || '').toLowerCase().trim();
      const statusFilter = document.getElementById('abs-filter-status')?.value || 'all';
      const groupFilter = document.getElementById('abs-filter-group')?.value || 'all';
      const dateFilter = document.getElementById('abs-filter-date')?.value || 'all';

      const todayStr = new Date().toISOString().split('T')[0];
      const todayEu = formatAnyDateToEuropean(todayStr);
      const currentMonthEu = todayEu.substring(3); // "11/2026"

      let filtered = logs.filter(l => {
        if (statusFilter !== 'all' && l.status !== statusFilter) return false;
        if (groupFilter !== 'all' && l.group && !l.group.endsWith(groupFilter) && l.group !== groupFilter) return false;
        if (dateFilter === 'today') {
          const lDate = l.date || '';
          if (lDate !== todayStr && lDate !== todayEu) return false;
        } else if (dateFilter === 'this_month') {
          const lDate = l.date || '';
          if (!lDate.includes(currentMonthEu) && !lDate.startsWith(todayStr.substring(0, 7))) return false;
        }
        if (query) {
          const text = [l.studentName, l.student, l.notes, l.date, l.promotion, l.classType, l.track].filter(Boolean).join(' ').toLowerCase();
          if (!text.includes(query)) return false;
        }
        return true;
      });

      const countEl = document.getElementById('abs-register-count');
      if (countEl) countEl.textContent = filtered.length + " incident(s) logged";

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="py-6 px-3 text-center text-slate-400 italic">
              No attendance or lateness records match the active criteria.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(l => {
        const isLate = l.status === 'Late';
        const statusBadge = isLate 
          ? '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">🟡 Late</span>'
          : '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">🔴 Absent</span>';

        const sourceBadge = l.source === 'sheet'
          ? '<span class="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200" title="Synchronized from Google Sheet">Sheet</span>'
          : '<span class="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200" title="Cached locally on device">Local</span>';

        const trackVal = l.classType || l.track || 'AT';
        const trackBadge = trackVal === 'AT' 
          ? '<span class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase text-white bg-blue-800">AT</span>'
          : (trackVal === 'AAS' 
            ? '<span class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase text-white bg-indigo-800">AAS</span>'
            : '<span class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase text-white bg-emerald-800">AG</span>');

        const sName = formatStudentName(l.studentName || l.student || '');
        const grpVal = l.group ? (l.group.length === 1 ? ('Group ' + l.group) : l.group) : 'Group A';

        return `
          <tr class="hover:bg-slate-50/70 transition-colors">
            <td class="py-2.5 px-3 whitespace-nowrap">
              <div class="font-mono font-bold text-slate-700">${escapeHtml(l.date || '')}</div>
              <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(l.timestamp || '')}</div>
            </td>
            <td class="py-2.5 px-3">
              <div class="font-bold font-mono text-slate-900">${escapeHtml(sName)}</div>
              <div class="text-[10px] text-slate-500">${escapeHtml(grpVal)}</div>
            </td>
            <td class="py-2.5 px-3 whitespace-nowrap">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-[10px] text-slate-600">${escapeHtml(l.promotion || 'GSEA26A')}</span>
                ${trackBadge}
              </div>
            </td>
            <td class="py-2.5 px-3 text-center whitespace-nowrap">${statusBadge}</td>
            <td class="py-2.5 px-3 max-w-xs text-slate-700 text-xs">
              ${l.notes ? `<span class="break-words">${escapeHtml(l.notes)}</span>` : '<span class="text-slate-400 italic">No notes</span>'}
            </td>
            <td class="py-2.5 px-3 text-center whitespace-nowrap">${sourceBadge}</td>
            <td class="py-2.5 px-3 text-right whitespace-nowrap">
              <button 
                type="button" 
                onclick="deleteAbsenceLog('${l.id}')" 
                title="Delete entry from register" 
                class="text-slate-400 hover:text-rose-600 font-bold text-xs p-1 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    function deleteAbsenceLog(targetId) {
      let logs = [];
      try { logs = JSON.parse(localStorage.getItem(LOCAL_ABSENCES_KEY)) || []; } catch (err) { logs = []; }
      logs = logs.filter(l => String(l.id) !== String(targetId));
      localStorage.setItem(LOCAL_ABSENCES_KEY, JSON.stringify(logs));
      renderAbsenceLogs();
    }

    function clearAbsenceLogs() {
      if (!confirm("Are you sure you want to clear the local attendance register? (Google Sheet master records will not be deleted)")) {
        return;
      }
      localStorage.setItem(LOCAL_ABSENCES_KEY, JSON.stringify([]));
      renderAbsenceLogs();
    }

    function copyAbsencesForSheets() {
      let logs = [];
      try { logs = JSON.parse(localStorage.getItem(LOCAL_ABSENCES_KEY)) || []; } catch (err) { logs = []; }
      if (logs.length === 0) {
        alert("No attendance records to copy yet! Log an absence or sync from the Google Sheet first.");
        return;
      }

      const headers = ["Date", "Timestamp", "Promotion", "Class Type", "Group", "Status", "Student Name", "Notes"];
      const rows = logs.map(l => [
        l.date || '',
        l.timestamp || '',
        l.promotion || 'GSEA26A',
        l.classType || l.track || 'AT',
        l.group || 'A',
        l.status || 'Absent',
        formatStudentName(l.studentName || l.student || ''),
        l.notes || ''
      ]);

      const tsvContent = [
        headers.join("\t"),
        ...rows.map(r => r.join("\t"))
      ].join("\n");

      navigator.clipboard.writeText(tsvContent).then(() => {
        alert("✓ Copied " + logs.length + " record(s) to clipboard!\n\nReady to paste (Cmd+V / Ctrl+V) directly into Google Sheets or Excel.");
      }).catch(() => {
        const ta = document.createElement("textarea");
        ta.value = tsvContent;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        alert("✓ Copied " + logs.length + " record(s) to clipboard!");
      });
    }

    function exportAbsencesCSV() {
      let logs = [];
      try { logs = JSON.parse(localStorage.getItem(LOCAL_ABSENCES_KEY)) || []; } catch (err) { logs = []; }
      if (logs.length === 0) {
        alert("No attendance records found to export.");
        return;
      }

      const headers = ["Date", "Timestamp", "Promotion", "Class_Type", "Group", "Status", "Student_Name", "Notes", "Source"];
      const rows = logs.map(l => [
        `"${(l.date || '').replace(/"/g, '""')}"`,
        `"${(l.timestamp || '').replace(/"/g, '""')}"`,
        `"${(l.promotion || 'GSEA26A').replace(/"/g, '""')}"`,
        `"${(l.classType || l.track || 'AT').replace(/"/g, '""')}"`,
        `"${(l.group || 'A').replace(/"/g, '""')}"`,
        `"${(l.status || 'Absent').replace(/"/g, '""')}"`,
        `"${(formatStudentName(l.studentName || l.student || '')).replace(/"/g, '""')}"`,
        `"${(l.notes || '').replace(/"/g, '""')}"`,
        `"${(l.source || 'local').replace(/"/g, '""')}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GSEA_Attendance_Records_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    // ============================================================================
    // TAB 6: STUDENT PORTFOLIO & REFLECTIONS


    // ============================================================================
    // ABSENCE DOSSIER & ATTENDANCE REPORT (PRINT / PDF ENGINE)
    // ============================================================================

    function openAbsenceReportModal() {
      const modal = document.getElementById("absence-report-modal");
      if (!modal) return;
      modal.classList.remove("hidden");

      // Populate candidate selector with groups and candidates
      const sem = SEMESTERS_DATA[activeSemester] || SEMESTERS_DATA[1];
      const filterSelect = document.getElementById("abs-report-candidate-filter");
      if (filterSelect) {
        let options = '<option value="all">All Candidates (Full Promotion Dossier)</option>';
        options += '<option value="grpA">Group A (All Students)</option>';
        options += '<option value="grpB">Group B (All Students)</option>';

        Object.entries(sem.students || {}).forEach(([grpKey, sIds]) => {
          const grpLabel = grpKey.includes("A") ? "Group A" : (grpKey.includes("B") ? "Group B" : "Group C");
          options += '<optgroup label="' + grpLabel + ' (' + sIds.length + ' students)">';
          sIds.forEach(sId => {
            options += '<option value="' + sId + '">' + formatStudentName(sId) + ' (' + grpLabel + ')</option>';
          });
          options += '</optgroup>';
        });
        filterSelect.innerHTML = options;
      }

      renderAbsenceReportPrintArea();
    }

    function closeAbsenceReportModal() {
      const modal = document.getElementById("absence-report-modal");
      if (modal) modal.classList.add("hidden");
    }

    function renderAbsenceReportPrintArea() {
      const container = document.getElementById("absence-report-print-area");
      if (!container) return;

      const sem = SEMESTERS_DATA[activeSemester] || SEMESTERS_DATA[1];
      const candidateFilter = document.getElementById("abs-report-candidate-filter")?.value || "all";
      const typeFilter = document.getElementById("abs-report-type-filter")?.value || "all";

      let allLogs = [];
      try { allLogs = JSON.parse(localStorage.getItem(LOCAL_ABSENCES_KEY)) || []; } catch(e) {}

      // Collect eligible candidates
      const allStudents = [];
      (sem.students?.groupA || []).forEach(s => allStudents.push({ id: s, name: formatStudentName(s), group: "Group A" }));
      (sem.students?.groupB || []).forEach(s => allStudents.push({ id: s, name: formatStudentName(s), group: "Group B" }));
      (sem.students?.groupC || []).forEach(s => allStudents.push({ id: s, name: formatStudentName(s), group: "Group C" }));

      let displayedStudents = allStudents;
      if (candidateFilter === "grpA") {
        displayedStudents = allStudents.filter(s => s.group === "Group A");
      } else if (candidateFilter === "grpB") {
        displayedStudents = allStudents.filter(s => s.group === "Group B");
      } else if (candidateFilter !== "all") {
        displayedStudents = allStudents.filter(s => s.id === candidateFilter);
      }

      // Filter logs
      const displayedIds = new Set(displayedStudents.map(s => s.id));
      const displayedNames = new Set(displayedStudents.map(s => s.name.toLowerCase()));

      let filteredLogs = allLogs.filter(l => {
        const studentId = l.studentId || l.student;
        const studentName = (l.studentName || l.student || "").toLowerCase();
        const matchesStudent = (studentId && displayedIds.has(studentId)) || (studentName && displayedNames.has(studentName));
        if (!matchesStudent && candidateFilter !== "all") return false;
        if (typeFilter !== "all" && l.status !== typeFilter) return false;
        return true;
      });

      // Compute statistics
      let totalAbsences = 0;
      let totalLates = 0;

      filteredLogs.forEach(l => {
        if (l.status === "Absent") totalAbsences++;
        else if (l.status === "Late") totalLates++;
      });

      const todayFormatted = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      const scopeLabel = candidateFilter === "all" ? "Full Promotion (" + displayedStudents.length + " students)" : (candidateFilter === "grpA" ? "Group A" : (candidateFilter === "grpB" ? "Group B" : displayedStudents[0]?.name || "Individual"));

      container.innerHTML = `
        <div class="absence-report-card bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <!-- Official Institutional Transcript Header -->
          <div class="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b-2 border-slate-800 gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-white bg-slate-800 px-2 py-0.5 rounded">
                  ENAC • DÉPARTEMENT LH / LAN
                </span>
                <span class="text-[11px] font-mono text-slate-500 font-bold">${sem.title} • ${sem.tracks}</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-950 tracking-tight pt-1">
                Official Attendance &amp; Absence Dossier
              </h2>
              <div class="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-700">
                <span>Promotion: <strong>${sem.promotion || 'GSEA26A'}</strong></span>
                <span>•</span>
                <span>Scope: <strong>${scopeLabel}</strong></span>
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
                <span class="text-[10px] uppercase font-bold text-rose-600 block">Absences</span>
                <span class="text-xl font-black text-rose-600">${totalAbsences}</span>
              </div>
              <div class="h-8 w-px bg-slate-200"></div>
              <div class="text-center px-2">
                <span class="text-[10px] uppercase font-bold text-amber-600 block">Latenesses</span>
                <span class="text-xl font-black text-amber-600">${totalLates}</span>
              </div>
            </div>
          </div>

          <!-- Promotion Candidate Standing Table -->
          <div class="space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span>👥</span>
                <span>Candidate Attendance Standings</span>
              </h4>
              <span class="text-xs text-slate-500 font-medium">${displayedStudents.length} candidates listed</span>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <th class="py-2.5 px-3">Student Name</th>
                    <th class="py-2.5 px-3">Class Group</th>
                    <th class="py-2.5 px-3 text-center">Absences</th>
                    <th class="py-2.5 px-3 text-center">Latenesses</th>
                    <th class="py-2.5 px-3 text-right">Attendance Standing</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  ${displayedStudents.map(st => {
                    const stLogs = allLogs.filter(l => {
                      const lId = l.studentId || l.student;
                      const lName = (l.studentName || l.student || "").toLowerCase();
                      return lId === st.id || lName === st.name.toLowerCase();
                    });
                    const absCount = stLogs.filter(l => l.status === "Absent").length;
                    const lateCount = stLogs.filter(l => l.status === "Late").length;
                    let standingBadge = '<span class="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">✓ 100% Present</span>';
                    if (absCount > 2) {
                      standingBadge = '<span class="px-2 py-0.5 rounded font-bold text-[10px] bg-rose-100 text-rose-800 border border-rose-200">⚠️ Review Required</span>';
                    } else if (absCount > 0 || lateCount > 1) {
                      standingBadge = '<span class="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-200">Satisfactory</span>';
                    }

                    return `
                      <tr class="hover:bg-slate-50/60 transition-colors">
                        <td class="py-2.5 px-3 font-bold text-slate-900">${st.name}</td>
                        <td class="py-2.5 px-3 text-slate-600 font-medium">${st.group}</td>
                        <td class="py-2.5 px-3 text-center font-mono font-bold ${absCount > 0 ? 'text-rose-600' : 'text-slate-400'}">${absCount}</td>
                        <td class="py-2.5 px-3 text-center font-mono font-bold ${lateCount > 0 ? 'text-amber-600' : 'text-slate-400'}">${lateCount}</td>
                        <td class="py-2.5 px-3 text-right">${standingBadge}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Chronological Incidents Log Table -->
          <div class="space-y-3 pt-2">
            <div class="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span>📋</span>
                <span>Chronological Incident Records</span>
              </h4>
              <span class="text-xs text-slate-500 font-medium">${filteredLogs.length} incident record(s)</span>
            </div>

            ${filteredLogs.length === 0 ? `
              <div class="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
                No absence or lateness records found for the selected scope.
              </div>
            ` : `
              <div class="overflow-x-auto rounded-xl border border-slate-200">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <th class="py-2.5 px-3">Date</th>
                      <th class="py-2.5 px-3">Candidate</th>
                      <th class="py-2.5 px-3">Track</th>
                      <th class="py-2.5 px-3 text-center">Status</th>
                      <th class="py-2.5 px-3">Reason / Notes</th>
                      <th class="py-2.5 px-3 text-right">Source</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 bg-white font-mono text-[11px]">
                    ${filteredLogs.map(l => {
                      const isAbsent = l.status === "Absent";
                      const statusBadge = isAbsent 
                        ? '<span class="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-200">🔴 Absent</span>'
                        : '<span class="px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-200">🟡 Late</span>';
                      const sourceBadge = l.source === "sheet"
                        ? '<span class="text-[10px] text-emerald-700 font-bold font-sans">Verified Google Sheet</span>'
                        : '<span class="text-[10px] text-slate-500 font-bold font-sans">Local Record</span>';
                      const stName = formatStudentName(l.studentName || l.student || "");

                      return `
                        <tr class="hover:bg-slate-50/60 transition-colors">
                          <td class="py-2.5 px-3 font-bold text-slate-900">${l.date || '--'}</td>
                          <td class="py-2.5 px-3 font-sans font-bold text-slate-900">${stName} <span class="text-slate-500 text-[10px] font-normal">(${l.group || 'Group A'})</span></td>
                          <td class="py-2.5 px-3 text-slate-700 font-bold">${l.classType || l.track || 'AT'}</td>
                          <td class="py-2.5 px-3 text-center">${statusBadge}</td>
                          <td class="py-2.5 px-3 font-sans text-slate-600 italic">${l.notes || 'No notes provided'}</td>
                          <td class="py-2.5 px-3 text-right">${sourceBadge}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

          <!-- Official Certification Footer -->
          <div class="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              <p class="font-bold text-slate-800">École Nationale de l'Aviation Civile</p>
              <p class="text-[11px] text-slate-500">Document generated in accordance with ENAC Academic Regulations (Règlement des Études).</p>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-center">
                <div class="h-10 w-36 border-b border-dashed border-slate-400"></div>
                <span class="text-[10px] text-slate-500 uppercase tracking-wider">Examiner Signature</span>
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
    // PORTFOLIO COMPLIANCE & REFLECTION REPORT (PRINT / PDF ENGINE)
