function selectSemester(num) {
      activeSemester = num;
      if (SEMESTERS_DATA[num]?.promotion) {
        activeAbsPromo = SEMESTERS_DATA[num].promotion;
      }
      // Header title
      const mainTitle = document.getElementById('header-main-title');
      if (mainTitle) {
        mainTitle.textContent = 'GSEA TEACHERS HUB';
      }
      // Update footer ENAC eCampus crest link
      const ecampusLink = document.getElementById('footer-ecampus-link') || document.getElementById('header-ecampus-link');
      if (ecampusLink && SEMESTERS_DATA[num]) {
        ecampusLink.href = SEMESTERS_DATA[num].ecampusUrl || 'https://e-campus.enac.fr/moodle/my/';
        ecampusLink.title = `Open ENAC eCampus Course Space (${SEMESTERS_DATA[num].title}) ↗`;
      }
      // Update Pills styling
      for (let s = 1; s <= 4; s++) {
        const btn = document.getElementById(`sem-btn-${s}`);
        if (!btn) continue;
        const dot = btn.querySelector('.rounded-full');
        const tag = btn.querySelector('.font-mono:not(.sm\\:hidden)');
        if (s === num) {
          btn.className = "sem-btn flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer bg-amber-400 text-slate-950 shadow-xs";
          if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0";
          if (tag) tag.className = "text-[9px] font-mono font-bold bg-slate-950/15 text-slate-950 px-1 py-0.5 rounded hidden md:inline shrink-0";
        } else if (btn.hasAttribute('disabled')) {
          btn.className = "sem-btn flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all opacity-40 cursor-not-allowed text-slate-400";
          if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0";
          if (tag) tag.className = "text-[9px] font-mono text-slate-500 bg-white/5 px-1 py-0.5 rounded hidden md:inline shrink-0";
        } else {
          btn.className = "sem-btn flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer text-slate-300 hover:text-white hover:bg-white/10";
          if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0";
          if (tag) tag.className = "text-[9px] font-mono text-slate-400 bg-white/5 px-1 py-0.5 rounded hidden md:inline shrink-0";
        }
      }
      if (SEMESTERS_DATA[num]) {
        const sem = SEMESTERS_DATA[num];
        if (sem.calendar && !sem.calendar[activeCalendarTrack]) {
          activeCalendarTrack = sem.calendar.at ? 'at' : (sem.calendar.ag ? 'ag' : Object.keys(sem.calendar)[0]);
        }
        if (sem.rotas && !sem.rotas[activeRotaTrack]) {
          activeRotaTrack = sem.rotas.at ? 'at' : (sem.rotas.ag ? 'ag' : Object.keys(sem.rotas)[0]);
        }
      }
      renderCurrentView();
    }

    // Switch Nav Tabs or Open Slide-Over Drawer
    function switchTab(tabKey) {
      if (tabKey === 'overview') {
        closeTeacherDrawer();
      } else {
        openTeacherDrawer(tabKey);
      }
    }

    // Open Slide-Over Teacher Modal Drawer
    function openTeacherDrawer(tabKey) {
      activeTab = tabKey;

      const modalEl = document.getElementById('teacher-resource-modal');
      const backdropEl = document.getElementById('teacher-modal-backdrop');
      const drawerEl = document.getElementById('teacher-modal-drawer');

      if (!modalEl || !backdropEl || !drawerEl) return;

      renderCurrentView();

      modalEl.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      void modalEl.offsetWidth; // Trigger reflow for smooth transition

      backdropEl.classList.remove('opacity-0');
      backdropEl.classList.add('opacity-100');
      drawerEl.classList.remove('translate-x-full');
    }

    // Close Slide-Over Teacher Modal Drawer
    function closeTeacherDrawer() {
      const modalEl = document.getElementById('teacher-resource-modal');
      const backdropEl = document.getElementById('teacher-modal-backdrop');
      const drawerEl = document.getElementById('teacher-modal-drawer');

      if (!modalEl || modalEl.classList.contains('hidden')) return;

      activeTab = 'overview';
      updateMainNavPills('overview');

      backdropEl.classList.remove('opacity-100');
      backdropEl.classList.add('opacity-0');
      drawerEl.classList.add('translate-x-full');
      document.body.style.overflow = '';

      setTimeout(() => {
        modalEl.classList.add('hidden');
      }, 300);
    }

    function updateMainNavPills(tabKey) {
      const keys = ['overview', 'calendar', 'rotas', 'groups', 'evaluations', 'portfolio'];
      keys.forEach(k => {
        const btn = document.getElementById(`tab-btn-${k}`);
        if (!btn) return;
        if (k === tabKey || (k === 'evaluations' && (tabKey === 'grading' || tabKey === 'rubrics'))) {
          btn.className = "nav-tab-btn whitespace-nowrap shrink-0 flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg font-bold transition-all bg-slate-900 text-white shadow-xs cursor-pointer";
        } else {
          btn.className = "nav-tab-btn whitespace-nowrap shrink-0 flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg font-bold transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer";
        }
      });
    }

    function updateDrawerNavTabs(tabKey) {
      const keys = ['calendar', 'rotas', 'groups', 'evaluations', 'portfolio'];
      keys.forEach(k => {
        const btn = document.getElementById(`drawer-nav-${k}`);
        if (!btn) return;
        if (k === tabKey || (k === 'evaluations' && (tabKey === 'grading' || tabKey === 'rubrics'))) {
          btn.className = "drawer-nav-tab flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all bg-white/20 text-white shadow-xs cursor-pointer";
          try {
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          } catch (_) {}
        } else {
          btn.className = "drawer-nav-tab flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all text-white/75 hover:text-white hover:bg-white/10 cursor-pointer";
        }
      });
    }

    function updateDrawerHeader(tabKey, sem) {
      const tagEl = document.getElementById('teacher-modal-tag');
      const titleEl = document.getElementById('teacher-modal-title');
      if (!tagEl || !titleEl) return;

      const semNum = sem.num || activeSemester || 1;
      const semTitle = sem.title || `Semester ${semNum}`;

      if (tabKey === 'calendar') {
        tagEl.textContent = `${semTitle.toUpperCase()} • CURRICULUM TIMETABLE`;
        titleEl.textContent = "Weekly Course Programme & Calendar";
      } else if (tabKey === 'rotas') {
        tagEl.textContent = `${semTitle.toUpperCase()} • FE ORAL ROTAS`;
        titleEl.textContent = "Formative Evaluation Tutorial Rotas";
      } else if (tabKey === 'groups') {
        tagEl.textContent = `${semTitle.toUpperCase()} • CLASS ROSTERS & ATTENDANCE`;
        titleEl.textContent = "Student Groups & Absence Logger";
      } else if (tabKey === 'evaluations' || tabKey === 'grading' || tabKey === 'rubrics') {
        tagEl.textContent = `${semTitle.toUpperCase()} • CONTINUOUS EVALUATION`;
        titleEl.textContent = "Evaluation Grading & Criteria Rubrics";
      } else if (tabKey === 'portfolio') {
        tagEl.textContent = `${semTitle.toUpperCase()} • PORTFOLIO PULSE`;
        titleEl.textContent = "Student Reflections & Keyword Analytics";
      }
    }

    // Render Active Content
    function renderCurrentView() {
      const container = document.getElementById('portal-content');
      const sem = SEMESTERS_DATA[activeSemester] || SEMESTERS_DATA[1];

      // Header title
      const mainTitle = document.getElementById('header-main-title');
      if (mainTitle) {
        mainTitle.textContent = 'GSEA TEACHERS HUB';
      }

      // Background cockpit workspace ALWAYS displays Overview
      if (container) {
        container.innerHTML = renderOverviewTab(sem);
      }

      // If drawer is open, render active tab inside drawer body
      const drawerBody = document.getElementById('teacher-drawer-body');
      if (activeTab !== 'overview' && drawerBody) {
        drawerBody.scrollTop = 0;
        if (activeTab === 'calendar') {
          drawerBody.innerHTML = renderCalendarTab(sem);
        } else if (activeTab === 'rotas') {
          drawerBody.innerHTML = renderRotasTab(sem);
        } else if (activeTab === 'groups') {
          drawerBody.innerHTML = renderGroupsTab(sem);
          initGroupsTab();
        } else if (activeTab === 'evaluations' || activeTab === 'grading' || activeTab === 'rubrics') {
          drawerBody.innerHTML = renderEvaluationsTab(sem);
          initEvaluationsEvents();
        } else if (activeTab === 'portfolio') {
          drawerBody.innerHTML = renderPortfolioTab(sem);
          initPortfolioEvents();
        }
        updateDrawerHeader(activeTab, sem);
        updateDrawerNavTabs(activeTab);
      }
      updateMainNavPills(activeTab);
    }

    // Global Keyboard Navigation & Escape Handler for Drawers & Modals
    document.addEventListener('keydown', (e) => {
      // 1. ESCAPE KEY: Close active popup modals or slide-over drawer
      if (e.key === 'Escape') {
        const mediaModal = document.getElementById('media-archive-modal');
        if (mediaModal && !mediaModal.classList.contains('hidden')) {
          closeMediaArchiveModal();
          return;
        }
        const reportModal = document.getElementById('portfolio-report-modal');
        if (reportModal && !reportModal.classList.contains('hidden')) {
          closePortfolioReportModal();
          return;
        }
        const groupModal = document.getElementById('group-entries-dossier-modal');
        if (groupModal && !groupModal.classList.contains('hidden')) {
          closeGroupEntriesDossierModal();
          return;
        }
        const gradeModal = document.getElementById('grade-report-modal');
        if (gradeModal && !gradeModal.classList.contains('hidden')) {
          closeStudentGradeReportModal();
          return;
        }
        const absModal = document.getElementById('absence-report-modal');
        if (absModal && !absModal.classList.contains('hidden')) {
          closeAbsenceReportModal();
          return;
        }
        const teacherModal = document.getElementById('teacher-resource-modal');
        if (teacherModal && !teacherModal.classList.contains('hidden')) {
          closeTeacherDrawer();
        }
        return;
      }

      // 2. ARROW KEYS: Left / Right Navigation (Drawer Tabs & Semester Switcher)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        // Prevent interfering when user is typing in form inputs, textareas, or selects
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select' || document.activeElement?.isContentEditable) {
          return;
        }

        // Do not intercept if an inner popup modal is active
        const reportModal = document.getElementById('portfolio-report-modal');
        const groupModal = document.getElementById('group-entries-dossier-modal');
        const gradeModal = document.getElementById('grade-report-modal');
        const absModal = document.getElementById('absence-report-modal');
        if ((reportModal && !reportModal.classList.contains('hidden')) ||
            (groupModal && !groupModal.classList.contains('hidden')) ||
            (gradeModal && !gradeModal.classList.contains('hidden')) ||
            (absModal && !absModal.classList.contains('hidden'))) {
          return;
        }

        const teacherModal = document.getElementById('teacher-resource-modal');
        const isDrawerOpen = teacherModal && !teacherModal.classList.contains('hidden');

        if (isDrawerOpen) {
          // Navigate between drawer tabs: Programme, Tutorial Rotas, Groups & Absences, Evaluation, Portfolio
          const drawerTabs = ['calendar', 'rotas', 'groups', 'evaluations', 'portfolio'];
          let currentKey = activeTab;
          if (currentKey === 'grading' || currentKey === 'rubrics') currentKey = 'evaluations';
          let currentIndex = drawerTabs.indexOf(currentKey);
          if (currentIndex === -1) currentIndex = 0;

          e.preventDefault();
          if (e.key === 'ArrowRight') {
            const nextIndex = (currentIndex + 1) % drawerTabs.length;
            switchTab(drawerTabs[nextIndex]);
          } else {
            const prevIndex = (currentIndex - 1 + drawerTabs.length) % drawerTabs.length;
            switchTab(drawerTabs[prevIndex]);
          }
        } else {
          // Navigate between Semesters 1, 2, 3, 4 on overview landing cockpit
          e.preventDefault();
          if (e.key === 'ArrowRight') {
            const nextSem = (activeSemester % 4) + 1;
            selectSemester(nextSem);
          } else {
            const prevSem = activeSemester === 1 ? 4 : activeSemester - 1;
            selectSemester(prevSem);
          }
        }
      }
    });

    // ============================================================================
    // TAB 0: OVERVIEW & WELCOME LANDING PAGE
