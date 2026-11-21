// ============================================================================
    // INVISIBLE COPYRIGHT & PROGRAMME INTEGRITY (French IP Code Art. L.111-1)
    // ============================================================================
    window.__GSEA_FACULTY_AUTH = Object.freeze({
      programme: "ENAC GSEA Multi-Semester Teachers Hub",
      architect: "Phil PARRIS",
      department: "Département Langues et Humanités (LAN / LH)",
      institution: "École Nationale de l'Aviation Civile (ENAC)",
      version: "1.0.0",
      releaseDate: "2026-11-01"
    });

    // Real student name mapping placeholder (injected during packaging for Moodle/ISO/DMG)
    /* --- STUDENT_NAMES_MAP_START --- */
    const PRIVATE_STUDENT_NAMES = {};
    /* --- STUDENT_NAMES_MAP_END --- */

    function formatStudentName(id) {
      if (!id) return '';
      if (typeof PRIVATE_STUDENT_NAMES !== 'undefined') {
        const semMap = PRIVATE_STUDENT_NAMES[`s${activeSemester}`];
        if (semMap && semMap[id]) return `${semMap[id]} (${id})`;
        if (typeof PRIVATE_STUDENT_NAMES[id] === 'string') return `${PRIVATE_STUDENT_NAMES[id]} (${id})`;
      }
      return id;
    }

    function getStudentShortName(id) {
      if (!id) return '';
      if (typeof PRIVATE_STUDENT_NAMES !== 'undefined') {
        const semMap = PRIVATE_STUDENT_NAMES[`s${activeSemester}`];
        if (semMap && semMap[id]) return semMap[id];
        if (typeof PRIVATE_STUDENT_NAMES[id] === 'string') return PRIVATE_STUDENT_NAMES[id];
      }
      return id;
    }

    // Active state
    let activeSemester = 1;
    let activeTab = 'overview';
    let activeRotaTrack = 'ag'; // 'ag' or 'at'
    let activeRotaFe = 1;       // 1, 2, or 3
    let activeCalendarTrack = 'ag'; // 'ag' or 'at'

    function setRotaTrack(trackKey) {
      activeRotaTrack = trackKey;
      renderCurrentView();
    }
    function setRotaFe(feNum) {
      activeRotaFe = feNum;
      renderCurrentView();
    }
    function setCalendarTrack(trackKey) {
      activeCalendarTrack = trackKey;
      renderCurrentView();
    }

    // Local submissions storage keys
    const LOCAL_LOGS_KEY = "gsea_faculty_eval_logs";
    const LOCAL_ABSENCES_KEY = "gsea_faculty_absences_log";
    // Google Apps Script Web App for Continuous Grading & Evaluations
    const GRADING_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWpBhOBb3iAT2jBEcCby-amSXHjDNkQ8ouk_Rh1ntGfn6yC5bTzz1LP4zvjQMHxEvuqg/exec";

    // Google Form & Google Sheet Configuration for Attendance & Absence Tracking (matching GSEA_attendance)
    const BUILTIN_GFORM_CONFIG = {
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfJWVxaGskC-x5qel0zKpA2M9ZTjYddLSbR4-SVlZEGqlANGQ/formResponse",
      entryPromotion: "entry.1730844708",
      entryClassType: "entry.33844399",
      entryGroup: "entry.1165269373",
      entryStatus: "entry.1233340469",
      entryStudentName: "entry.902753919",
      entryDate: "entry.466391886",
      entryNotes: "entry.464143954",
      sheetId: "1P3GPO6bWvoowq5tX75lasFkNuFjo7Uk38VbkbaCChgU",
      sheetGid: "2066081147",
      sheetUrl: "https://docs.google.com/spreadsheets/d/1P3GPO6bWvoowq5tX75lasFkNuFjo7Uk38VbkbaCChgU/edit?resourcekey=&gid=2066081147#gid=2066081147"
    };

    const BUILTIN_SHEET_CONFIG = {
      sheetId: "1P3GPO6bWvoowq5tX75lasFkNuFjo7Uk38VbkbaCChgU",
      gid: "2066081147",
      sheetUrl: "https://docs.google.com/spreadsheets/d/1P3GPO6bWvoowq5tX75lasFkNuFjo7Uk38VbkbaCChgU/edit?resourcekey=&gid=2066081147#gid=2066081147"
    };
    let activeTeacherPin = sessionStorage.getItem("gsea_teacher_session_pin") || "";
    let activeAuthenticatedTeacher = sessionStorage.getItem("gsea_authenticated_teacher") || "";

    // Multi-Semester Master Database
