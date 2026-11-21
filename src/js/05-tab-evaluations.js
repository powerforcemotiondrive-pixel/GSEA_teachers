// ============================================================================
    function generateScoreOptions(maxVal, defaultVal) {
      let opts = '';
      const step = 0.5;
      const count = Math.round(maxVal / step);
      for (let i = 0; i <= count; i++) {
        const val = (i * step).toFixed(1);
        const isSelected = (parseFloat(val) === parseFloat(defaultVal)) ? 'selected' : '';
        opts += `<option value="${val}" ${isSelected}>${val}</option>`;
      }
      return opts;
    }

    let cachedBackendGrades = null;
    let isFetchingBackendGrades = false;

    function renderEvaluationsTab(sem) {
      return `
        <div class="space-y-4">
          <!-- Visual Orientation Header Banner -->
          <div class="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200">
            <div class="grid grid-cols-1 md:grid-cols-12 items-stretch">
              <div class="md:col-span-4 relative min-h-[140px] sm:min-h-[160px] bg-slate-900">
                <img 
                  src="images/fe_aas_mod1.jpg" 
                  alt="Oral Evaluation & Spoken Criteria Scoring" 
                  class="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span class="text-[9.5px] font-black uppercase tracking-wider text-amber-300 font-mono">
                    ${sem.title} • Evaluations
                  </span>
                  <h4 class="text-xs sm:text-sm font-bold mt-0.5">Continuous Grading Cockpit</h4>
                </div>
              </div>
              <div class="md:col-span-8 p-4 sm:p-5 flex flex-col justify-center space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono shadow-2xs">
                    Teacher Guide
                  </span>
                  <span class="text-xs font-bold text-slate-800 font-mono">20-Point Oral Criteria &amp; Continuous Grading</span>
                </div>
                <p class="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  This official grading cockpit records spontaneous spoken English performance according to the ENAC 20-point assessment rubric. Candidates are evaluated across six communicative criteria, strictly prohibiting scripted reading. Select a student, assign rubric marks, and add constructive qualitative observations. Submitted evaluations calculate weighted averages and generate certified student feedback bulletins.
                </p>
              </div>
            </div>
          </div>

          <!-- Evaluation Form Card -->
          <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 space-y-5">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ${sem.title} • Evaluations
                </span>
                <h2 class="text-base sm:text-lg font-bold text-slate-900 mt-1">Formative &amp; Continuous Evaluation Entry</h2>
              </div>
              <div class="flex flex-wrap items-center gap-2.5">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Evaluation Total:</span>
                <span id="score-display-pill" class="text-base font-black px-3.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-mono shadow-xs border border-amber-400">
                  15.5 / 20.0
                </span>
                <button 
                  type="button" 
                  onclick="openStudentGradeReportModal()" 
                  class="ml-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-xs cursor-pointer border border-amber-400"
                  title="Generate Official Student Grade Report / PDF Transcript"
                >
                  <span>🖨️</span>
                  <span>Student Grade Reports (PDF)</span>
                </button>
              </div>
            </div>

            <!-- Form -->
            <form id="eval-record-form" onsubmit="handleEvaluationSubmit(event)" class="space-y-5">
              <!-- Symmetrical Setup Grid: Box 1 (Evaluating Teacher) & Box 2 (Candidate & Milestone Setup) -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                <!-- BOX 1: Evaluating Teacher & Cloud Sync Setup -->
                <div class="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3.5 shadow-2xs">
                  <div>
                    <div class="flex items-center justify-between pb-2 border-b border-slate-200/80">
                      <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">1</span>
                        <h3 class="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">Evaluating Teacher</h3>
                      </div>
                      <span id="teacher-auth-status-pill" class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        🔒 Local Mode
                      </span>
                    </div>

                    <!-- Teacher Selector -->
                    <div class="mt-3">
                      <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <span>👤</span>
                        <span>Examiner Identity</span>
                      </label>
                      <select id="eval-teacher" onchange="updateTeacherAuthUI();" class="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-slate-800 cursor-pointer">
                        ${(sem.faculty || []).map(f => `<option value="${f.name}">${f.name} (${f.track})</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <!-- Examiner PIN & Cloud Sync Authentication -->
                  <div class="pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2 text-xs">
                    <span class="text-[11px] text-slate-500 font-medium">Google Sheet Sync:</span>
                    <div id="teacher-auth-bar" class="flex items-center gap-1.5">
                      <div id="teacher-pin-input-group" class="flex items-center gap-1.5">
                        <input 
                          type="password" 
                          id="teacher-pin-input" 
                          maxlength="4" 
                          placeholder="PIN" 
                          class="w-16 h-8 text-center font-mono font-bold px-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-slate-800 focus:outline-none"
                          onkeydown="if(event.key==='Enter'){event.preventDefault();authenticateTeacherSession();}"
                          title="Enter 4-digit PIN to enable direct Google Sheets cloud sync"
                        />
                        <button 
                          type="button" 
                          onclick="authenticateTeacherSession()" 
                          class="h-8 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-2xs border border-amber-400"
                          title="Sign in with your Examiner PIN"
                        >
                          Sign In
                        </button>
                      </div>
                      <div id="teacher-signed-in-group" class="hidden items-center gap-2">
                        <span class="text-xs text-emerald-700 font-bold">✓ Cloud Active</span>
                        <button 
                          type="button" 
                          onclick="signOutTeacherSession()" 
                          class="text-slate-500 hover:text-slate-800 font-bold text-xs underline cursor-pointer p-0.5"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- BOX 2: Candidate & Milestone Setup -->
                <div class="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3.5 shadow-2xs">
                  <div>
                    <div class="flex items-center justify-between pb-2 border-b border-slate-200/80">
                      <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">2</span>
                        <h3 class="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">Candidate &amp; Milestone</h3>
                      </div>
                      <span class="text-xs text-slate-500 font-medium">Evaluation dossier</span>
                    </div>

                    <!-- 2 Selectors Subgrid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                      <!-- Milestone -->
                      <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Evaluation Milestone</label>
                        <select id="eval-milestone" onchange="handleMilestoneChange(); loadStudentGradeForEditing();" class="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-slate-800 cursor-pointer">
                          <option value="1">Module 1 • FE1 Oral Evaluation</option>
                          <option value="2">Module 2 • FE2 Oral Evaluation</option>
                          <option value="3">Module 3 • FE3 Oral Evaluation</option>
                          <option value="4">Module 4 • Continuous Assessment (/20)</option>
                        </select>
                      </div>

                      <!-- Candidate -->
                      <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Candidate</label>
                        <select id="eval-student" onchange="loadStudentGradeForEditing();" class="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-slate-800 cursor-pointer">
                          <optgroup label="Group A (${(sem.students.groupA || []).length} students)">
                            ${(sem.students.groupA || []).map(s => `<option value="${s}">${formatStudentName(s)} (Group A)</option>`).join('')}
                          </optgroup>
                          <optgroup label="Group B (${(sem.students.groupB || []).length} students)">
                            ${(sem.students.groupB || []).map(s => `<option value="${s}">${formatStudentName(s)} (Group B)</option>`).join('')}
                          </optgroup>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <!-- STEP 3: Oral Rubric Scoring (6 Criteria • Total 20 Pts) -->
              <div class="space-y-3 pt-1">
                <div class="flex items-center justify-between border-b border-slate-200/70 pb-2">
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <h3 class="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">Oral Rubric Scoring (6 Criteria • Total 20 Pts)</h3>
                  </div>
                  <span class="text-xs text-slate-500 font-medium">Spontaneous spoken English • Strictly no reading</span>
                </div>

                <!-- 6 Criteria Dropdown Grid (Modules 1, 2, 3) -->
                <div id="six-criteria-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  <!-- Criterion 1 -->
                  <div class="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors">
                    <div class="flex items-center justify-between gap-2">
                      <div>
                        <span class="text-xs font-bold text-slate-900 block">1. Fluency &amp; Coherence</span>
                        <span class="text-[10px] font-bold text-amber-700">Max 4.0 pts</span>
                      </div>
                      <select id="crit-1" onchange="recalcScore()" class="text-xs font-bold font-mono p-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                        <option value="0.0">0.0</option><option value="0.5">0.5</option><option value="1.0">1.0</option>
                        <option value="1.5">1.5</option><option value="2.0">2.0</option><option value="2.5">2.5</option>
                        <option value="3.0" selected>3.0</option><option value="3.5">3.5</option><option value="4.0">4.0</option>
                      </select>
                    </div>
                    <p class="text-[11px] text-slate-500 leading-tight">Spontaneous delivery flow, connecting words, transition markers. Strictly no reading from slides.</p>
                  </div>

                  <!-- Criterion 2 -->
                  <div class="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors">
                    <div class="flex items-center justify-between gap-2">
                      <div>
                        <span class="text-xs font-bold text-slate-900 block">2. Pronunciation &amp; Stress</span>
                        <span class="text-[10px] font-bold text-amber-700">Max 3.0 pts</span>
                      </div>
                      <select id="crit-2" onchange="recalcScore()" class="text-xs font-bold font-mono p-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                        <option value="0.0">0.0</option><option value="0.5">0.5</option><option value="1.0">1.0</option>
                        <option value="1.5">1.5</option><option value="2.0">2.0</option><option value="2.5" selected>2.5</option>
                        <option value="3.0">3.0</option>
                      </select>
                    </div>
                    <p class="text-[11px] text-slate-500 leading-tight">Intelligible pronunciation, rhythm, and correct syllable stress placed on specialized terms.</p>
                  </div>

                  <!-- Criterion 3 -->
                  <div class="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors">
                    <div class="flex items-center justify-between gap-2">
                      <div>
                        <span class="text-xs font-bold text-slate-900 block">3. Grammar &amp; Sentence Control</span>
                        <span class="text-[10px] font-bold text-amber-700">Max 4.0 pts</span>
                      </div>
                      <select id="crit-3" onchange="recalcScore()" class="text-xs font-bold font-mono p-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                        <option value="0.0">0.0</option><option value="0.5">0.5</option><option value="1.0">1.0</option>
                        <option value="1.5">1.5</option><option value="2.0">2.0</option><option value="2.5">2.5</option>
                        <option value="3.0" selected>3.0</option><option value="3.5">3.5</option><option value="4.0">4.0</option>
                      </select>
                    </div>
                    <p class="text-[11px] text-slate-500 leading-tight">Accurate modal verbs of obligation, past passive voice for incidents, cause &amp; effect structures.</p>
                  </div>

                  <!-- Criterion 4 -->
                  <div class="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors">
                    <div class="flex items-center justify-between gap-2">
                      <div>
                        <span class="text-xs font-bold text-slate-900 block">4. Technical Vocabulary</span>
                        <span class="text-[10px] font-bold text-amber-700">Max 4.0 pts</span>
                      </div>
                      <select id="crit-4" onchange="recalcScore()" class="text-xs font-bold font-mono p-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                        <option value="0.0">0.0</option><option value="0.5">0.5</option><option value="1.0">1.0</option>
                        <option value="1.5">1.5</option><option value="2.0">2.0</option><option value="2.5">2.5</option>
                        <option value="3.0" selected>3.0</option><option value="3.5">3.5</option><option value="4.0">4.0</option>
                      </select>
                    </div>
                    <p class="text-[11px] text-slate-500 leading-tight">Active deployment of 6 to 8 specialized topic terms from Sessions 1–4 with accurate operational definitions.</p>
                  </div>

                  <!-- Criterion 5 -->
                  <div class="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors">
                    <div class="flex items-center justify-between gap-2">
                      <div>
                        <span class="text-xs font-bold text-slate-900 block">5. Interaction &amp; Teamwork</span>
                        <span class="text-[10px] font-bold text-amber-700">Max 2.5 pts</span>
                      </div>
                      <select id="crit-5" onchange="recalcScore()" class="text-xs font-bold font-mono p-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                        <option value="0.0">0.0</option><option value="0.5">0.5</option><option value="1.0">1.0</option>
                        <option value="1.5">1.5</option><option value="2.0" selected>2.0</option><option value="2.5">2.5</option>
                      </select>
                    </div>
                    <p class="text-[11px] text-slate-500 leading-tight">Equal 50/50 talking-time balance between partners, smooth handovers, and spontaneous Q&amp;A response.</p>
                  </div>

                  <!-- Criterion 6 -->
                  <div class="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors">
                    <div class="flex items-center justify-between gap-2">
                      <div>
                        <span class="text-xs font-bold text-slate-900 block">6. Portfolio &amp; Self-Critique</span>
                        <span class="text-[10px] font-bold text-amber-700">Max 2.5 pts</span>
                      </div>
                      <select id="crit-6" onchange="recalcScore()" class="text-xs font-bold font-mono p-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                        <option value="0.0">0.0</option><option value="0.5">0.5</option><option value="1.0">1.0</option>
                        <option value="1.5">1.5</option><option value="2.0" selected>2.0</option><option value="2.5">2.5</option>
                      </select>
                    </div>
                    <p class="text-[11px] text-slate-500 leading-tight">Up-to-date vocabulary log on digital portal, completed session entries, and honest diagnostic self-critique.</p>
                  </div>
                </div>

                <!-- Module 4 Single Grade Dropdown (/20) -->
                <div id="mod4-criteria-container" class="hidden p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span class="text-xs font-black uppercase tracking-wider text-slate-900 block">Module 4 • Continuous Assessment Grade</span>
                      <p class="text-xs text-slate-600 mt-0.5">Overall continuous assessment score out of 20 (0.0 to 20.0 in 0.5 steps).</p>
                    </div>
                    <div class="flex items-center gap-2 bg-white p-2 px-3 rounded-xl border border-slate-300 shadow-2xs">
                      <span class="text-xs font-bold text-slate-700">Module 4 Mark:</span>
                      <select id="crit-mod4" onchange="recalcScore()" class="text-sm font-black font-mono p-1.5 px-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500">
                        ${Array.from({ length: 41 }, (_, i) => (i * 0.5).toFixed(1)).map(v => `<option value="${v}" ${v === '14.0' ? 'selected' : ''}>${v} / 20.0</option>`).join('')}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STEP 4: Written Feedback & Diagnostic Comments -->
              <div class="space-y-3 pt-1">
                <div class="flex items-center justify-between border-b border-slate-200/70 pb-2">
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">4</span>
                    <h3 class="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">Written Feedback &amp; Diagnostic Comments</h3>
                  </div>
                  <span class="text-xs text-slate-500 font-medium">Printed directly on student grade report transcript</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span class="text-emerald-600">✓</span>
                      <span>Key Strengths &amp; Commendations</span>
                    </label>
                    <textarea id="eval-strengths" rows="3" placeholder="Spontaneous delivery, accurate specialized terminology, strong teamwork..." class="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-slate-800"></textarea>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span class="text-amber-600">🎯</span>
                      <span>Target Areas for Improvement</span>
                    </label>
                    <textarea id="eval-targets" rows="3" placeholder="Syllable stress on target nouns, modal verbs of obligation, smoother handovers..." class="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-slate-800"></textarea>
                  </div>
                </div>
              </div>

              <!-- STEP 5: Review, Save & Export Dossier -->
              <div class="p-4 sm:p-5 bg-slate-900 text-white rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <div class="flex items-center gap-3.5">
                  <div class="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs text-amber-400 border border-slate-700">
                    5
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total:</span>
                      <span id="score-display-pill-bottom" class="text-base font-black px-3.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-mono shadow-xs border border-amber-400">
                        15.5 / 20.0
                      </span>
                      <span id="score-grade-band" class="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700">
                        Good Progress
                      </span>
                    </div>
                    <div id="submit-status-msg" class="text-xs text-slate-300 mt-1 font-medium"></div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2.5">
                  <button 
                    type="button" 
                    onclick="openStudentGradeReportModal()" 
                    class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 cursor-pointer border border-slate-700"
                    title="Open Dossier / Print Student Grade Report"
                  >
                    <span>🖨️</span>
                    <span>Grade Report (PDF)</span>
                  </button>
                  <button 
                    type="submit" 
                    class="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer border border-amber-400"
                  >
                    <span>💾</span>
                    <span>Save Evaluation Record</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Grade Report Print / PDF Modal -->
        <div id="grade-report-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div class="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-300 max-h-[92vh] flex flex-col overflow-hidden">
            <!-- Modal Control Header (hidden in print) -->
            <div class="no-print p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                  🖨️
                </div>
                <div>
                  <h3 class="text-sm sm:text-base font-bold text-slate-900">Student Continuous Assessment &amp; Grade Reports</h3>
                  <p class="text-xs text-slate-500">Official ENAC Transcripts, Criteria Marks, Key Strengths &amp; Target Areas</p>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <!-- Candidate Filter -->
                <select id="report-candidate-filter" onchange="renderGradeReportPrintArea()" class="text-xs font-bold p-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-800">
                  <option value="all">All Candidates (Full Promotion Dossier)</option>
                  <!-- Populated dynamically -->
                </select>
                <button type="button" onclick="loadGradeReportsFromBackend(true)" class="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer" title="Fetch fresh records from Google Sheet">
                  <span>🔄</span>
                  <span>Sync Cloud</span>
                </button>
                <button type="button" onclick="window.print()" class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer border border-amber-400">
                  <span>🖨️</span>
                  <span>Print / Save as PDF</span>
                </button>
                <button type="button" onclick="closeStudentGradeReportModal()" class="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer">
                  ✕ Close
                </button>
              </div>
            </div>

            <!-- Scrollable Report View / Print Container -->
            <div id="grade-report-scroll-container" class="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100/60">
              <div id="grade-report-print-area" class="max-w-4xl mx-auto space-y-6">
                <!-- Injected via renderGradeReportPrintArea() -->
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function initEvaluationsEvents() {
      handleMilestoneChange();
      recalcScore();
      updateTeacherAuthUI();
      loadStudentGradeForEditing();
      checkGradingBackendStatus();
      loadGradeReportsFromBackend(false);
    }

    function updateTeacherAuthUI() {
      const teacherSelect = document.getElementById('eval-teacher');
      const selectedTeacher = teacherSelect ? teacherSelect.value : '';

      const pill = document.getElementById('teacher-auth-status-pill');
      const inputGroup = document.getElementById('teacher-pin-input-group');
      const signedInGroup = document.getElementById('teacher-signed-in-group');
      const pinInput = document.getElementById('teacher-pin-input');

      const isAuthenticated = activeTeacherPin && (activeAuthenticatedTeacher === selectedTeacher || !activeAuthenticatedTeacher);

      if (isAuthenticated && pill && inputGroup && signedInGroup) {
        pill.className = "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center whitespace-nowrap shadow-2xs";
        pill.textContent = "✓ Cloud Active: " + selectedTeacher;
        inputGroup.classList.add('hidden');
        signedInGroup.classList.remove('hidden');
        signedInGroup.classList.add('flex');
      } else if (pill && inputGroup && signedInGroup) {
        pill.className = "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 flex items-center whitespace-nowrap shadow-2xs";
        pill.textContent = "🔒 Local Mode";
        inputGroup.classList.remove('hidden');
        signedInGroup.classList.add('hidden');
        signedInGroup.classList.remove('flex');
        if (pinInput) pinInput.value = '';
      }
    }

    async function authenticateTeacherSession() {
      const teacherSelect = document.getElementById('eval-teacher');
      const teacher = teacherSelect ? teacherSelect.value : '';
      const pinInput = document.getElementById('teacher-pin-input');
      const pin = pinInput ? pinInput.value.trim() : '';

      if (!/^\d{4}$/.test(pin)) {
        alert("Please enter a valid 4-digit numeric PIN.");
        if (pinInput) pinInput.focus();
        return;
      }

      if (typeof GRADING_SCRIPT_URL !== 'undefined' && GRADING_SCRIPT_URL && GRADING_SCRIPT_URL.startsWith('http')) {
        const pill = document.getElementById('teacher-auth-status-pill');
        if (pill) pill.textContent = "Verifying PIN...";
        try {
          const res = await fetch(GRADING_SCRIPT_URL + "?action=authTeacher&teacher=" + encodeURIComponent(teacher) + "&pin=" + encodeURIComponent(pin) + "&_t=" + Date.now());
          const data = await res.json();
          if (!data.valid && !data.success) {
            alert(data.message || "Incorrect Teacher PIN for " + teacher);
            updateTeacherAuthUI();
            return;
          }
        } catch (e) {
          console.warn("Backend auth ping failed, proceeding in offline mode:", e);
        }
      }

      activeTeacherPin = pin;
      activeAuthenticatedTeacher = teacher;
      sessionStorage.setItem('gsea_teacher_session_pin', pin);
      sessionStorage.setItem('gsea_authenticated_teacher', teacher);

      updateTeacherAuthUI();
    }

    function signOutTeacherSession() {
      activeTeacherPin = '';
      activeAuthenticatedTeacher = '';
      sessionStorage.removeItem('gsea_teacher_session_pin');
      sessionStorage.removeItem('gsea_authenticated_teacher');
      updateTeacherAuthUI();
    }

    async function checkGradingBackendStatus() {
      const badge = document.getElementById('backend-status-badge');
      if (!badge) return;

      if (typeof GRADING_SCRIPT_URL !== 'undefined' && GRADING_SCRIPT_URL && GRADING_SCRIPT_URL.startsWith('http')) {
        try {
          const res = await fetch(GRADING_SCRIPT_URL + "?action=ping&_t=" + Date.now());
          const data = await res.json();
          if (data.success) {
            badge.className = "text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300";
            badge.innerHTML = "🟢 Google Sheet Live";
            return;
          }
        } catch (e) {}
      }
      badge.className = "text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200";
      badge.innerHTML = "⚪ Local Storage Mode";
    }

    function handleMilestoneChange() {
      const milestoneSelect = document.getElementById('eval-milestone');
      if (!milestoneSelect) return;
      const milestone = milestoneSelect.value;
      const criteriaContainer = document.getElementById('six-criteria-container');
      const mod4Container = document.getElementById('mod4-criteria-container');

      if (milestone === '4') {
        if (criteriaContainer) criteriaContainer.classList.add('hidden');
        if (mod4Container) mod4Container.classList.remove('hidden');
      } else {
        if (criteriaContainer) criteriaContainer.classList.remove('hidden');
        if (mod4Container) mod4Container.classList.add('hidden');
      }
      recalcScore();
    }

    function recalcScore() {
      const milestone = document.getElementById('eval-milestone')?.value || '1';
      let total = 0;

      if (milestone === '4') {
        total = parseFloat(document.getElementById('crit-mod4')?.value || 14.0);
      } else {
        const c1 = parseFloat(document.getElementById('crit-1')?.value || 3.0);
        const c2 = parseFloat(document.getElementById('crit-2')?.value || 2.5);
        const c3 = parseFloat(document.getElementById('crit-3')?.value || 3.0);
        const c4 = parseFloat(document.getElementById('crit-4')?.value || 3.0);
        const c5 = parseFloat(document.getElementById('crit-5')?.value || 2.0);
        const c6 = parseFloat(document.getElementById('crit-6')?.value || 2.0);
        total = c1 + c2 + c3 + c4 + c5 + c6;
      }

      const formattedTotal = total.toFixed(1);
      const displayPill = document.getElementById('score-display-pill');
      if (displayPill) {
        displayPill.textContent = formattedTotal + " / 20.0";
      }

      const bottomPill = document.getElementById('score-display-pill-bottom');
      if (bottomPill) {
        bottomPill.textContent = formattedTotal + " / 20.0";
      }

      const bandEl = document.getElementById('score-grade-band');
      if (bandEl) {
        if (total >= 16.0) {
          bandEl.className = "text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700/60";
          bandEl.textContent = "Distinction / Excellent";
        } else if (total >= 14.0) {
          bandEl.className = "text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700";
          bandEl.textContent = "Good Progress";
        } else if (total >= 10.0) {
          bandEl.className = "text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700";
          bandEl.textContent = "Satisfactory / Pass";
        } else {
          bandEl.className = "text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800/60";
          bandEl.textContent = "Needs Support";
        }
      }
    }

    function updateCandidateHistoryStrip() {
      const container = document.getElementById('candidate-history-pills');
      if (!container) return;

      const student = document.getElementById('eval-student')?.value;
      const currentMilestone = document.getElementById('eval-milestone')?.value || '1';

      let localLogs = [];
      try { localLogs = JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY)) || []; } catch(e) {}
      const semLogs = localLogs.filter(l => (l.student === student || l.studentId === student) && Number(l.sem) === Number(activeSemester));

      const cloudGrades = (cachedBackendGrades && cachedBackendGrades.sem === activeSemester && Array.isArray(cachedBackendGrades.grades))
        ? cachedBackendGrades.grades.filter(g => (g.studentId === student || g.student === student))
        : [];

      const modules = [1, 2, 3, 4];
      container.innerHTML = modules.map(modNum => {
        const existing = semLogs.find(l => Number(l.module) === modNum) || cloudGrades.find(g => Number(g.module) === modNum);
        const isCurrent = String(modNum) === String(currentMilestone);
        const modLabel = modNum === 4 ? 'Mod 4 (Cont)' : ('Mod ' + modNum);

        if (existing) {
          const score = parseFloat(existing.total || 0).toFixed(1);
          return `
            <button 
              type="button" 
              onclick="selectStudentForGrading('${student}', ${modNum})" 
              class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${isCurrent ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs' : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'}"
              title="Click to edit ${modLabel} evaluation"
            >
              <span>${modLabel}:</span>
              <span>${score}/20</span>
              <span>✏️</span>
            </button>
          `;
        } else {
          return `
            <button 
              type="button" 
              onclick="selectStudentForGrading('${student}', ${modNum})" 
              class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer border ${isCurrent ? 'bg-slate-700 text-white border-slate-700 shadow-2xs' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}"
              title="Click to evaluate ${modLabel}"
            >
              <span>${modLabel}: --</span>
            </button>
          `;
        }
      }).join('');
    }

    function loadStudentGradeForEditing() {
      const student = document.getElementById('eval-student')?.value;
      const milestone = document.getElementById('eval-milestone')?.value || '1';
      const moduleNum = parseInt(milestone, 10);

      let logs = [];
      try { logs = JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY)) || []; } catch(e) {}
      let existingLog = logs.find(l => (l.student === student || l.studentId === student) && Number(l.sem) === Number(activeSemester) && Number(l.module) === Number(moduleNum));

      // Fallback to cloud grades cache if localStorage was wiped or empty
      if (!existingLog && cachedBackendGrades && Array.isArray(cachedBackendGrades.grades)) {
        existingLog = cachedBackendGrades.grades.find(g => (g.studentId === student || g.student === student) && Number(g.sem) === Number(activeSemester) && Number(g.module) === Number(moduleNum));
      }

      if (existingLog) {
        if (moduleNum === 4) {
          const mod4Select = document.getElementById('crit-mod4');
          if (mod4Select && existingLog.total) mod4Select.value = parseFloat(existingLog.total).toFixed(1);
        } else {
          const sc = existingLog.scores || {};
          const setCrit = (id, val, fallback) => {
            const el = document.getElementById(id);
            if (el) {
              const numVal = (val !== undefined && val !== null && val !== '') ? parseFloat(val) : parseFloat(fallback);
              el.value = numVal.toFixed(1);
            }
          };
          setCrit('crit-1', sc.c1, '3.0');
          setCrit('crit-2', sc.c2, '2.5');
          setCrit('crit-3', sc.c3, '3.0');
          setCrit('crit-4', sc.c4, '3.0');
          setCrit('crit-5', sc.c5, '2.0');
          setCrit('crit-6', sc.c6, '2.0');
        }
        const stEl = document.getElementById('eval-strengths');
        const tgEl = document.getElementById('eval-targets');
        if (stEl) stEl.value = existingLog.strengths || '';
        if (tgEl) tgEl.value = existingLog.targets || '';

        const statusMsg = document.getElementById('submit-status-msg');
        if (statusMsg) {
          statusMsg.innerHTML = '<span class="text-amber-400 font-bold">✏️ Loaded existing record (' + parseFloat(existingLog.total).toFixed(1) + '/20) for editing</span>';
        }
      } else {
        if (moduleNum === 4) {
          const mod4Select = document.getElementById('crit-mod4');
          if (mod4Select) mod4Select.value = '14.0';
        } else {
          if (document.getElementById('crit-1')) document.getElementById('crit-1').value = '3.0';
          if (document.getElementById('crit-2')) document.getElementById('crit-2').value = '2.5';
          if (document.getElementById('crit-3')) document.getElementById('crit-3').value = '3.0';
          if (document.getElementById('crit-4')) document.getElementById('crit-4').value = '3.0';
          if (document.getElementById('crit-5')) document.getElementById('crit-5').value = '2.0';
          if (document.getElementById('crit-6')) document.getElementById('crit-6').value = '2.0';
        }
        const stEl = document.getElementById('eval-strengths');
        const tgEl = document.getElementById('eval-targets');
        if (stEl) stEl.value = '';
        if (tgEl) tgEl.value = '';

        const statusMsg = document.getElementById('submit-status-msg');
        if (statusMsg) statusMsg.textContent = '';
      }

      recalcScore();
      updateCandidateHistoryStrip();
    }

    function selectStudentForGrading(studentId, moduleNum) {
      const select = document.getElementById('eval-student');
      if (select && studentId) select.value = studentId;

      if (moduleNum) {
        const mSelect = document.getElementById('eval-milestone');
        if (mSelect) {
          mSelect.value = String(moduleNum);
          handleMilestoneChange();
        }
      }

      loadStudentGradeForEditing();

      const formEl = document.getElementById('eval-record-form');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function editEvaluationFromReport(studentId, moduleNum) {
      closeStudentGradeReportModal();
      selectStudentForGrading(studentId, moduleNum);
    }

    function handleEvaluationSubmit(e) {
      e.preventDefault();
      const student = document.getElementById('eval-student')?.value;
      const teacher = document.getElementById('eval-teacher')?.value;
      const milestone = document.getElementById('eval-milestone')?.value || '1';
      const strengths = document.getElementById('eval-strengths')?.value || '';
      const targets = document.getElementById('eval-targets')?.value || '';

      const isMod4 = milestone === '4';
      let total = 0;
      let scores = {};

      if (isMod4) {
        total = parseFloat(document.getElementById('crit-mod4')?.value || 14.0);
        scores = { mod4: total };
      } else {
        const c1 = parseFloat(document.getElementById('crit-1')?.value || 3.0);
        const c2 = parseFloat(document.getElementById('crit-2')?.value || 2.5);
        const c3 = parseFloat(document.getElementById('crit-3')?.value || 3.0);
        const c4 = parseFloat(document.getElementById('crit-4')?.value || 3.0);
        const c5 = parseFloat(document.getElementById('crit-5')?.value || 2.0);
        const c6 = parseFloat(document.getElementById('crit-6')?.value || 2.0);
        total = c1 + c2 + c3 + c4 + c5 + c6;
        scores = { c1, c2, c3, c4, c5, c6 };
      }

      const moduleNum = parseInt(milestone, 10);
      const milestoneLabel = isMod4 ? 'Module 4 (Continuous)' : 'Module ' + moduleNum + ' (FE' + moduleNum + ')';

      let logs = [];
      try { logs = JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY)) || []; } catch(err) {}

      // Replace previous entry for same student, semester, and module
      logs = logs.filter(l => !( (l.student === student || l.studentId === student) && Number(l.sem) === Number(activeSemester) && Number(l.module) === Number(moduleNum)));

      const semData = SEMESTERS_DATA[activeSemester] || SEMESTERS_DATA[1];
      let studentGroup = "Group A";
      if ((semData.students?.groupB || []).includes(student)) studentGroup = "Group B";
      else if ((semData.students?.groupC || []).includes(student)) studentGroup = "Group C";
      else if ((semData.students?.groupD || []).includes(student)) studentGroup = "Group D";

      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        sem: activeSemester,
        student,
        studentId: student,
        studentName: formatStudentName(student),
        group: studentGroup,
        teacher,
        module: moduleNum,
        milestone: milestoneLabel,
        scores,
        total: total.toFixed(1),
        strengths,
        targets
      };

      logs.unshift(newLog);
      localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(logs));

      const msg = document.getElementById('submit-status-msg');

      updateCandidateHistoryStrip();

      // Cloud Sync Check:
      const hasValidTeacherAuth = activeTeacherPin && (activeAuthenticatedTeacher === teacher || !activeAuthenticatedTeacher);

      if (hasValidTeacherAuth && typeof GRADING_SCRIPT_URL !== 'undefined' && GRADING_SCRIPT_URL && GRADING_SCRIPT_URL.startsWith('http')) {
        if (msg) msg.innerHTML = '<span class="text-amber-400 font-bold">⏳ Syncing with Google Sheets...</span>';
        fetch(GRADING_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "saveGrade",
            teacherPin: activeTeacherPin,
            ...newLog
          })
        }).then(res => res.json()).then(data => {
          if (data.success) {
            if (msg) msg.innerHTML = '<span class="text-emerald-400 font-bold">✓ Synced to Google Sheet &amp; Local Storage (' + total.toFixed(1) + '/20)</span>';
            setTimeout(() => { if (msg) msg.textContent = ""; }, 5000);
            loadGradeReportsFromBackend(true);
          } else {
            if (msg) msg.innerHTML = '<span class="text-amber-300 font-bold">⚠️ Saved locally to browser (' + (data.message || 'Sheet sync pending') + ')</span>';
          }
        }).catch(err => {
          console.warn("Backend sync offline, saved locally:", err);
          if (msg) msg.innerHTML = '<span class="text-emerald-400 font-bold">✓ Saved locally (Offline mode: ' + total.toFixed(1) + '/20)</span>';
          setTimeout(() => { if (msg) msg.textContent = ""; }, 5000);
        });
      } else {
        // Saved locally without PIN blocker
        if (msg) {
          if (!activeTeacherPin) {
            msg.innerHTML = '<span class="text-emerald-400 font-bold">✓ Saved ' + formatStudentName(student) + ' (' + total.toFixed(1) + '/20) locally to browser • Enter PIN to sync sheet</span>';
          } else {
            msg.innerHTML = '<span class="text-emerald-400 font-bold">✓ Saved ' + formatStudentName(student) + ' (' + total.toFixed(1) + '/20) locally!</span>';
          }
          setTimeout(() => { if (msg) msg.textContent = ""; }, 6000);
        }
      }
    }

    // ============================================================================
    // STUDENT GRADE REPORT & QUALITATIVE FEEDBACK DOSSIER (PRINT / PDF ENGINE)
    // ============================================================================

    async function loadGradeReportsFromBackend(forceRefresh = false) {
      if (isFetchingBackendGrades && !forceRefresh) return;
      if (!forceRefresh && cachedBackendGrades && cachedBackendGrades.sem === activeSemester) return;

      if (typeof GRADING_SCRIPT_URL !== 'undefined' && GRADING_SCRIPT_URL && GRADING_SCRIPT_URL.startsWith('http')) {
        isFetchingBackendGrades = true;
        try {
          const res = await fetch(GRADING_SCRIPT_URL + "?action=getGrades&sem=" + activeSemester + "&_t=" + Date.now());
          const data = await res.json();
          if (data && data.success && Array.isArray(data.grades)) {
            cachedBackendGrades = {
              sem: activeSemester,
              grades: data.grades
            };

            // Merge cloud grades into localStorage so they are available offline
            let localLogs = [];
            try { localLogs = JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY)) || []; } catch(e) {}

            data.grades.forEach(cGrade => {
              const cStId = cGrade.studentId || cGrade.student;
              const cMod = Number(cGrade.module || 1);
              const idx = localLogs.findIndex(l => (l.student === cStId || l.studentId === cStId) && Number(l.sem) === Number(activeSemester) && Number(l.module) === cMod);
              const formattedLog = {
                id: cGrade.timestamp ? String(cGrade.timestamp) : Date.now().toString(),
                timestamp: cGrade.timestamp || '',
                sem: activeSemester,
                student: cStId,
                studentId: cStId,
                studentName: cGrade.studentName || formatStudentName(cStId),
                group: cGrade.group || 'Group A',
                teacher: cGrade.teacher || '',
                module: cMod,
                milestone: cGrade.milestone || ('Module ' + cMod),
                scores: cGrade.scores || {},
                total: parseFloat(cGrade.total || 0).toFixed(1),
                strengths: cGrade.strengths || '',
                targets: cGrade.targets || ''
              };

              if (idx >= 0) {
                localLogs[idx] = formattedLog;
              } else {
                localLogs.unshift(formattedLog);
              }
            });

            localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(localLogs));
            updateCandidateHistoryStrip();
          }
        } catch(err) {
          console.warn("Could not fetch cloud grades, relying on local storage:", err);
        } finally {
          isFetchingBackendGrades = false;
        }
      }
    }

    async function openStudentGradeReportModal() {
      const modal = document.getElementById('grade-report-modal');
      if (!modal) return;

      modal.classList.remove('hidden');

      // Populate candidate selector
      const sem = SEMESTERS_DATA[activeSemester] || SEMESTERS_DATA[1];
      const filterSelect = document.getElementById('report-candidate-filter');
      if (filterSelect) {
        filterSelect.innerHTML = '<option value="all">All Candidates (Full Promotion Dossier)</option>';
        Object.entries(sem.students || {}).forEach(([grpKey, sIds]) => {
          const grpLabel = grpKey.includes('A') ? 'Group A' : (grpKey.includes('B') ? 'Group B' : (grpKey.includes('C') ? 'Group C' : 'Group D'));
          const optGroup = document.createElement('optgroup');
          optGroup.label = grpLabel;
          sIds.forEach(sId => {
            const opt = document.createElement('option');
            opt.value = sId;
            opt.textContent = formatStudentName(sId) + " (" + grpLabel + ")";
            optGroup.appendChild(opt);
          });
          filterSelect.appendChild(optGroup);
        });
      }

      await loadGradeReportsFromBackend(true);
      renderGradeReportPrintArea();
    }

    function closeStudentGradeReportModal() {
      const modal = document.getElementById('grade-report-modal');
      if (modal) modal.classList.add('hidden');
    }

    function getCefrBand(score) {
      const val = parseFloat(score);
      if (isNaN(val)) return { label: 'Unassessed', color: 'bg-slate-100 text-slate-700 border-slate-300' };
      if (val >= 18.0) return { label: 'Exemplary (CEFR C1)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      if (val >= 14.0) return { label: 'Solid B2 Standard (CEFR B2)', color: 'bg-blue-100 text-blue-900 border-blue-300' };
      if (val >= 10.0) return { label: 'Developing (CEFR B1+)', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      return { label: 'Needs Improvement (< B1)', color: 'bg-rose-100 text-rose-900 border-rose-300' };
    }

    function renderGradeReportPrintArea() {
      const container = document.getElementById('grade-report-print-area');
      if (!container) return;

      const sem = SEMESTERS_DATA[activeSemester] || SEMESTERS_DATA[1];
      const filterCandidate = document.getElementById('report-candidate-filter')?.value || 'all';

      let allLogs = [];
      try { allLogs = JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY)) || []; } catch(e) {}
      const semLogs = allLogs.filter(l => Number(l.sem) === Number(activeSemester));

      const candidatesToRender = [];
      Object.entries(sem.students || {}).forEach(([grpKey, sIds]) => {
        const grpLabel = grpKey.includes('A') ? 'Group A' : (grpKey.includes('B') ? 'Group B' : (grpKey.includes('C') ? 'Group C' : 'Group D'));
        sIds.forEach(sId => {
          if (filterCandidate === 'all' || filterCandidate === sId) {
            candidatesToRender.push({ id: sId, name: formatStudentName(sId), group: grpLabel });
          }
        });
      });

      if (candidatesToRender.length === 0) {
        container.innerHTML = '<div class="p-8 text-center text-slate-500 bg-white rounded-xl">No student records found.</div>';
        return;
      }

      container.innerHTML = candidatesToRender.map(candidate => {
        const cLogs = semLogs.filter(l => l.student === candidate.id || l.studentId === candidate.id);
        const m1 = cLogs.find(l => Number(l.module) === 1);
        const m2 = cLogs.find(l => Number(l.module) === 2);
        const m3 = cLogs.find(l => Number(l.module) === 3);
        const m4 = cLogs.find(l => Number(l.module) === 4);

        const modules = [
          { num: 1, title: 'Module 1 • FE1 Oral Evaluation', log: m1 },
          { num: 2, title: 'Module 2 • FE2 Oral Evaluation', log: m2 },
          { num: 3, title: 'Module 3 • FE3 Oral Evaluation', log: m3 },
          { num: 4, title: 'Module 4 • Continuous Assessment', log: m4 }
        ];

        const scoredVals = [m1, m2, m3, m4].filter(Boolean).map(m => parseFloat(m.total));
        const avg = scoredVals.length ? (scoredVals.reduce((a, b) => a + b, 0) / scoredVals.length).toFixed(1) : null;
        const band = avg ? getCefrBand(avg) : null;

        return `
          <div class="student-bulletin-card bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <!-- Official Transcript Header -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b-2 border-slate-800 gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black uppercase tracking-widest text-white bg-slate-800 px-2 py-0.5 rounded">
                    ENAC • DÉPARTEMENT LH / LAN
                  </span>
                  <span class="text-[11px] font-mono text-slate-500 font-bold">${sem.title} • ${sem.tracks}</span>
                </div>
                <h2 class="text-xl sm:text-2xl font-black text-slate-950 tracking-tight pt-1">
                  Continuous Assessment &amp; Formative Evaluation Report
                </h2>
                <div class="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-700">
                  <span class="font-bold">Candidate: <strong class="text-slate-950 font-mono text-sm">${candidate.name}</strong></span>
                  <span>•</span>
                  <span>Class Group: <strong>${candidate.group}</strong></span>
                  <span>•</span>
                  <span>Academic Year: <strong>2026–2027</strong></span>
                </div>
              </div>

              <!-- Overall Grade Box -->
              <div class="shrink-0 text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
                <span class="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Semester Average</span>
                <span class="text-2xl sm:text-3xl font-black font-mono text-slate-900 block">
                  ${avg !== null ? avg + ' / 20.0' : '-- / 20.0'}
                </span>
                ${band ? `<span class="inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded-md border ${band.color}">${band.label}</span>` : ''}
              </div>
            </div>

            <!-- Module Evaluations Breakdown -->
            <div class="space-y-4">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                <span>📋</span>
                <span>Module Evaluation Records &amp; Criteria Breakdown</span>
              </h4>

              <div class="grid grid-cols-1 gap-4">
                ${modules.map(mod => {
                  const log = mod.log;
                  if (!log) {
                    return `
                      <div class="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                        <span class="font-bold text-slate-600">${mod.title}</span>
                        <div class="flex items-center gap-2">
                          <span class="text-slate-400 font-mono italic">Awaiting Oral Evaluation</span>
                          <button 
                            type="button" 
                            onclick="editEvaluationFromReport('${candidate.id}', ${mod.num})" 
                            class="no-print px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                            title="Start evaluation for this module"
                          >
                            <span>➕</span>
                            <span>Evaluate</span>
                          </button>
                        </div>
                      </div>
                    `;
                  }

                  const isMod4 = mod.num === 4;
                  const sc = log.scores || {};

                  return `
                    <div class="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-200/80 gap-2">
                        <div>
                          <span class="text-xs sm:text-sm font-black text-slate-900 block">${mod.title}</span>
                          <span class="text-[11px] text-slate-500">Evaluator: <strong>${log.teacher || 'Accredited Teacher'}</strong> • Logged: ${log.timestamp || 'Recorded'}</span>
                        </div>
                        <div class="text-left sm:text-right flex items-center gap-2">
                          <span class="text-base sm:text-lg font-black font-mono text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                            ${parseFloat(log.total).toFixed(1)} / 20.0
                          </span>
                          <button 
                            type="button" 
                            onclick="editEvaluationFromReport('${candidate.id}', ${mod.num})" 
                            class="no-print px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all flex items-center gap-1 cursor-pointer"
                            title="Edit this evaluation in the form"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>

                      <!-- Criteria Breakdown (Modules 1, 2, 3) -->
                      ${!isMod4 ? `
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
                          <div class="p-2 bg-white rounded-lg border border-slate-200">
                            <span class="text-[9px] uppercase font-bold text-slate-400 block">Fluency (4)</span>
                            <span class="font-mono font-bold text-slate-900">${sc.c1 !== undefined ? sc.c1 : '--'} / 4.0</span>
                          </div>
                          <div class="p-2 bg-white rounded-lg border border-slate-200">
                            <span class="text-[9px] uppercase font-bold text-slate-400 block">Stress (3)</span>
                            <span class="font-mono font-bold text-slate-900">${sc.c2 !== undefined ? sc.c2 : '--'} / 3.0</span>
                          </div>
                          <div class="p-2 bg-white rounded-lg border border-slate-200">
                            <span class="text-[9px] uppercase font-bold text-slate-400 block">Grammar (4)</span>
                            <span class="font-mono font-bold text-slate-900">${sc.c3 !== undefined ? sc.c3 : '--'} / 4.0</span>
                          </div>
                          <div class="p-2 bg-white rounded-lg border border-slate-200">
                            <span class="text-[9px] uppercase font-bold text-slate-400 block">Vocab (4)</span>
                            <span class="font-mono font-bold text-slate-900">${sc.c4 !== undefined ? sc.c4 : '--'} / 4.0</span>
                          </div>
                          <div class="p-2 bg-white rounded-lg border border-slate-200">
                            <span class="text-[9px] uppercase font-bold text-slate-400 block">Teamwork (2.5)</span>
                            <span class="font-mono font-bold text-slate-900">${sc.c5 !== undefined ? sc.c5 : '--'} / 2.5</span>
                          </div>
                          <div class="p-2 bg-white rounded-lg border border-slate-200">
                            <span class="text-[9px] uppercase font-bold text-slate-400 block">Portfolio (2.5)</span>
                            <span class="font-mono font-bold text-slate-900">${sc.c6 !== undefined ? sc.c6 : '--'} / 2.5</span>
                          </div>
                        </div>
                      ` : `
                        <div class="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                          <span class="font-bold text-slate-700">Continuous Assessment Component:</span>
                          <span class="text-slate-600 ml-1">Weighted speaking coursework, in-class communicative tasks, and formative seminar contributions.</span>
                        </div>
                      `}

                      <!-- Qualitative Feedback Block -->
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                        <!-- Key Strengths -->
                        <div class="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-1">
                          <span class="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                            <span>🟢</span>
                            <span>Key Strengths &amp; Commendations</span>
                          </span>
                          <p class="text-slate-800 text-[11px] leading-relaxed italic">
                            "${log.strengths || 'No specific strengths recorded.'}"
                          </p>
                        </div>

                        <!-- Target Areas for Improvement -->
                        <div class="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-1">
                          <span class="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                            <span>🎯</span>
                            <span>Target Areas for Improvement</span>
                          </span>
                          <p class="text-slate-800 text-[11px] leading-relaxed italic">
                            "${log.targets || 'No target areas specified.'}"
                          </p>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Official Footer Note -->
            <div class="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-slate-400 gap-2">
              <span>Official Continuous Evaluation Transcript • Département LH / LAN • ENAC</span>
              <span class="font-mono">Generated from Master Cloud Records</span>
            </div>
          </div>
        `;
      }).join('');
    }
    // ============================================================================
    // TAB 2: FE ROTAS
