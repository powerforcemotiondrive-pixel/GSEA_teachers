const SEMESTERS_DATA = {
      1: {
        num: 1,
        title: "Semester 1",
        promotion: "GSEA26A",
        teacherFocus: "General & Technical",
        nextMilestone: { title: "FE1 Tutorial", sub: "Week 48 Oral Exam" },
        ecampusUrl: "https://e-campus.enac.fr/moodle/pluginfile.php/542566/mod_resource/content/33/index.html#ag-module1-card1",
        tracks: "AG (LV101E) & AT (LV121E)",
        description: "General English (Travel, Weather, New Tech) & Technical English (Aerodrome, Aircraft Anatomy, Human Factors)",
        faculty: [
          { name: "Tracy NEILL", track: "AT", group: "Group A", schedule: "Wednesdays 13h15–15h15" },
          { name: "Ally HEWETT", track: "AT", group: "Group B", schedule: "Wednesdays 13h15–15h15" },
          { name: "Geri MIDDLETON", track: "AG", group: "Group A", schedule: "Fridays 08h00–10h00" },
          { name: "Penny WRIGHT", track: "AG", group: "Group B", schedule: "Fridays 08h00–10h00" }
        ],
        students: {
          groupA: ["GRPA001", "GRPA002", "GRPA003", "GRPA004", "GRPA005", "GRPA006", "GRPA007", "GRPA008", "GRPA009", "GRPA010"],
          groupB: ["GRPB001", "GRPB002", "GRPB003", "GRPB004", "GRPB005", "GRPB006", "GRPB007", "GRPB008", "GRPB009"]
        },
        evaluationDates: {
          fe1: { at: "Wednesday 25 Nov 2026 (W48)", ag: "Friday 27 Nov 2026 (W48)" },
          fe2: { at: "Wednesday 20 Jan 2027 (W03)", ag: "Friday 22 Jan 2027 (W03)" },
          fe3: { at: "Wednesday 24 Feb 2027 (W08)", ag: "Friday 26 Feb 2027 (W08)" }
        },
        rotas: {
          ag: {
            code: "LV101E",
            name: "General English (AG)",
            schedule: "Fridays 08h00 – 10h00",
            roomNote: "Friday Session • 2 Hours (4 Slots of 30 min)",
            fes: {
              1: {
                title: "FE1 — Module 1 Oral Evaluation",
                week: "Week 48",
                dateStr: "Friday 27 November 2026",
                groupA: {
                  teacher: "Geri MIDDLETON",
                  slots: [
                    { num: 1, time: "08h00 – 08h30", type: "pair", students: ["GRPA001", "GRPA002"] },
                    { num: 2, time: "08h30 – 09h00", type: "pair", students: ["GRPA003", "GRPA004"] },
                    { num: 3, time: "09h00 – 09h30", type: "trio", students: ["GRPA005", "GRPA006", "GRPA007"] },
                    { num: 4, time: "09h30 – 10h00", type: "trio", students: ["GRPA008", "GRPA009", "GRPA010"] }
                  ]
                },
                groupB: {
                  teacher: "Penny WRIGHT",
                  slots: [
                    { num: 1, time: "08h00 – 08h30", type: "pair", students: ["GRPB001", "GRPB002"] },
                    { num: 2, time: "08h30 – 09h00", type: "pair", students: ["GRPB003", "GRPB004"] },
                    { num: 3, time: "09h00 – 09h30", type: "pair", students: ["GRPB005", "GRPB006"] },
                    { num: 4, time: "09h30 – 10h00", type: "trio", students: ["GRPB007", "GRPB008", "GRPB009"] }
                  ]
                }
              },
              2: {
                title: "FE2 — Module 2 Oral Evaluation",
                week: "Week 03",
                dateStr: "Friday 22 January 2027",
                groupA: {
                  teacher: "Geri MIDDLETON",
                  slots: [
                    { num: 1, time: "08h00 – 08h30", type: "trio", students: ["GRPA008", "GRPA005", "GRPA003"] },
                    { num: 2, time: "08h30 – 09h00", type: "pair", students: ["GRPA009", "GRPA006"] },
                    { num: 3, time: "09h00 – 09h30", type: "pair", students: ["GRPA010", "GRPA002"] },
                    { num: 4, time: "09h30 – 10h00", type: "trio", students: ["GRPA001", "GRPA004", "GRPA007"] }
                  ]
                },
                groupB: {
                  teacher: "Penny WRIGHT",
                  slots: [
                    { num: 1, time: "08h00 – 08h30", type: "pair", students: ["GRPB008", "GRPB001"] },
                    { num: 2, time: "08h30 – 09h00", type: "trio", students: ["GRPB002", "GRPB003", "GRPB005"] },
                    { num: 3, time: "09h00 – 09h30", type: "pair", students: ["GRPB004", "GRPB007"] },
                    { num: 4, time: "09h30 – 10h00", type: "pair", students: ["GRPB006", "GRPB009"] }
                  ]
                }
              },
              3: {
                title: "FE3 — Module 3 Oral Evaluation",
                week: "Week 08",
                dateStr: "Friday 26 February 2027",
                groupA: {
                  teacher: "Geri MIDDLETON",
                  slots: [
                    { num: 1, time: "08h00 – 08h30", type: "pair", students: ["GRPA007", "GRPA009"] },
                    { num: 2, time: "08h30 – 09h00", type: "trio", students: ["GRPA001", "GRPA005", "GRPA010"] },
                    { num: 3, time: "09h00 – 09h30", type: "trio", students: ["GRPA002", "GRPA004", "GRPA008"] },
                    { num: 4, time: "09h30 – 10h00", type: "pair", students: ["GRPA003", "GRPA006"] }
                  ]
                },
                groupB: {
                  teacher: "Penny WRIGHT",
                  slots: [
                    { num: 1, time: "08h00 – 08h30", type: "pair", students: ["GRPB003", "GRPB006"] },
                    { num: 2, time: "08h30 – 09h00", type: "trio", students: ["GRPB001", "GRPB004", "GRPB009"] },
                    { num: 3, time: "09h00 – 09h30", type: "pair", students: ["GRPB002", "GRPB007"] },
                    { num: 4, time: "09h30 – 10h00", type: "pair", students: ["GRPB005", "GRPB008"] }
                  ]
                }
              }
            }
          },
          at: {
            code: "LV121E",
            name: "Technical English (AT)",
            schedule: "Wednesdays 13h15 – 15h15",
            roomNote: "Wednesday Session • 2 Hours (4 Slots of 30 min)",
            fes: {
              1: {
                title: "FE1 — Module 1 Oral Evaluation",
                week: "Week 48",
                dateStr: "Wednesday 25 November 2026",
                groupA: {
                  teacher: "Tracy NEILL",
                  slots: [
                    { num: 1, time: "13h15 – 13h45", type: "pair", students: ["GRPA001", "GRPA003"] },
                    { num: 2, time: "13h45 – 14h15", type: "trio", students: ["GRPA002", "GRPA005", "GRPA008"] },
                    { num: 3, time: "14h15 – 14h45", type: "pair", students: ["GRPA004", "GRPA006"] },
                    { num: 4, time: "14h45 – 15h15", type: "trio", students: ["GRPA007", "GRPA009", "GRPA010"] }
                  ]
                },
                groupB: {
                  teacher: "Ally HEWETT",
                  slots: [
                    { num: 1, time: "13h15 – 13h45", type: "pair", students: ["GRPB001", "GRPB004"] },
                    { num: 2, time: "13h45 – 14h15", type: "pair", students: ["GRPB002", "GRPB006"] },
                    { num: 3, time: "14h15 – 14h45", type: "pair", students: ["GRPB003", "GRPB007"] },
                    { num: 4, time: "14h45 – 15h15", type: "trio", students: ["GRPB005", "GRPB008", "GRPB009"] }
                  ]
                }
              },
              2: {
                title: "FE2 — Module 2 Oral Evaluation",
                week: "Week 03",
                dateStr: "Wednesday 20 January 2027",
                groupA: {
                  teacher: "Tracy NEILL",
                  slots: [
                    { num: 1, time: "13h15 – 13h45", type: "trio", students: ["GRPA009", "GRPA002", "GRPA006"] },
                    { num: 2, time: "13h45 – 14h15", type: "pair", students: ["GRPA010", "GRPA004"] },
                    { num: 3, time: "14h15 – 14h45", type: "trio", students: ["GRPA007", "GRPA003", "GRPA005"] },
                    { num: 4, time: "14h45 – 15h15", type: "pair", students: ["GRPA001", "GRPA008"] }
                  ]
                },
                groupB: {
                  teacher: "Ally HEWETT",
                  slots: [
                    { num: 1, time: "13h15 – 13h45", type: "pair", students: ["GRPB008", "GRPB002"] },
                    { num: 2, time: "13h45 – 14h15", type: "trio", students: ["GRPB009", "GRPB003", "GRPB001"] },
                    { num: 3, time: "14h15 – 14h45", type: "pair", students: ["GRPB005", "GRPB007"] },
                    { num: 4, time: "14h45 – 15h15", type: "pair", students: ["GRPB004", "GRPB006"] }
                  ]
                }
              },
              3: {
                title: "FE3 — Module 3 Oral Evaluation",
                week: "Week 08",
                dateStr: "Wednesday 24 February 2027",
                groupA: {
                  teacher: "Tracy NEILL",
                  slots: [
                    { num: 1, time: "13h15 – 13h45", type: "pair", students: ["GRPA008", "GRPA006"] },
                    { num: 2, time: "13h45 – 14h15", type: "trio", students: ["GRPA001", "GRPA010", "GRPA007"] },
                    { num: 3, time: "14h15 – 14h45", type: "pair", students: ["GRPA002", "GRPA009"] },
                    { num: 4, time: "14h45 – 15h15", type: "trio", students: ["GRPA003", "GRPA004", "GRPA005"] }
                  ]
                },
                groupB: {
                  teacher: "Ally HEWETT",
                  slots: [
                    { num: 1, time: "13h15 – 13h45", type: "pair", students: ["GRPB007", "GRPB009"] },
                    { num: 2, time: "13h45 – 14h15", type: "pair", students: ["GRPB005", "GRPB001"] },
                    { num: 3, time: "14h15 – 14h45", type: "trio", students: ["GRPB006", "GRPB008", "GRPB004"] },
                    { num: 4, time: "14h45 – 15h15", type: "pair", students: ["GRPB002", "GRPB003"] }
                  ]
                }
              }
            }
          }
        },
        calendar: {
          ag: {
            code: "LV101E",
            name: "General English (AG)",
            dayTime: "Fridays 08h00 – 10h00",
            faculty: "Geri MIDDLETON (Group A) & Penny WRIGHT (Group B)",
            modules: [
              {
                num: 1,
                title: "Module 1: Travel, Transport & Society",
                weeks: "Weeks 44 – 48",
                sessions: [
                  { week: "W44", date: "Fri 30 Oct", title: "Session 1 — Introduction & Travel Anecdotes", tag: "Teaching Session", isFe: false },
                  { week: "W45", date: "Fri 06 Nov", title: "Session 2 — Evolution of Transport", tag: "Teaching Session", isFe: false },
                  { week: "W46", date: "Fri 13 Nov", title: "Session 3 — Overtourism", tag: "Teaching Session", isFe: false },
                  { week: "W47", date: "Fri 20 Nov", title: "Session 4 — Sustainable and Eco-tourism", tag: "Teaching Session • Prep FE1", isFe: false },
                  { week: "W48", date: "Fri 27 Nov", title: "FORMATIVE EVALUATION 1 (FE1) — Oral Tutorials", subtitle: "Fri 27 Nov • 30-min evaluation slots (Geri MIDDLETON / Penny WRIGHT)", tag: "Grade /20", isFe: true }
                ]
              },
              {
                num: 2,
                title: "Module 2: Weather, Environment & Ecological Transition",
                weeks: "Weeks 49 – Week 3",
                sessions: [
                  { week: "W49", date: "Fri 04 Dec", title: "Session 1 — Extreme Weather & Atmospheric Hazards", tag: "Teaching Session", isFe: false },
                  { week: "W50", date: "Fri 11 Dec", title: "Session 2 — Sustainable Cities & Low-Emission Mobility", tag: "Teaching Session", isFe: false },
                  { isHoliday: true, text: "🎄 Weeks 51 & 52 — Christmas & Winter Vacation (No Classes)" },
                  { week: "W01", date: "Fri 08 Jan", title: "Session 3 — Building & Supporting Environmental Arguments", tag: "Teaching Session", isFe: false },
                  { week: "W02", date: "Fri 15 Jan", title: "Session 4 — Biodiversity in Urban Areas & Transport Hubs", tag: "Teaching Session • Prep FE2", isFe: false },
                  { week: "W03", date: "Fri 22 Jan", title: "FORMATIVE EVALUATION 2 (FE2) — Climate Resilience Redesign (Airport / City)", subtitle: "Fri 22 Jan • 30-min evaluation slots (Geri MIDDLETON / Penny WRIGHT)", tag: "Grade /20", isFe: true }
                ]
              },
              {
                num: 3,
                title: "Module 3: Innovation, Society & Emerging Technologies",
                weeks: "Weeks 4 – 8",
                sessions: [
                  { week: "W04", date: "Fri 29 Jan", title: "Session 1 — Everyday AI & Workplace Automation", tag: "Teaching Session", isFe: false },
                  { week: "W05", date: "Fri 05 Feb", title: "Session 2 — Future Mobility & Clean Energy Transport", tag: "Teaching Session", isFe: false },
                  { week: "W06", date: "Fri 12 Feb", title: "Session 3 — Technology Ethics & Automated Decisions in AI", tag: "Teaching Session", isFe: false },
                  { week: "W07", date: "Fri 19 Feb", title: "Session 4 — Biometrics, Digital IDs & Passenger Journey", tag: "Teaching Session • Prep FE3", isFe: false },
                  { week: "W08", date: "Fri 26 Feb", title: "FORMATIVE EVALUATION 3 (FE3) — Emerging Technology Presentation (Aviation / Non-Aviation)", subtitle: "Fri 26 Feb • 30-min evaluation slots (Geri MIDDLETON / Penny WRIGHT)", tag: "Grade /20", isFe: true }
                ]
              }
            ]
          },
          at: {
            code: "LV121E",
            name: "Technical English (AT)",
            dayTime: "Wednesdays 13h15 – 15h15",
            faculty: "Tracy NEILL (Group A) & Ally HEWETT (Group B)",
            modules: [
              {
                num: 1,
                title: "Module 1: Aerodromes, Air Traffic & Surface Operations",
                weeks: "Weeks 44 – 48",
                sessions: [
                  { week: "W44", date: "Wed 28 Oct", title: "Session 1 — Introduction & Aviation Survey", tag: "Teaching Session", isFe: false },
                  { week: "W45", date: "Wed 04 Nov", title: "Session 2 — Passenger Journey & Airfield Movement", tag: "Teaching Session", isFe: false },
                  { week: "W46", date: "Wed 11 Nov", title: "Session 3 — Ground Operations & Turnaround", tag: "Teaching Session", isFe: false },
                  { week: "W47", date: "Wed 18 Nov", title: "Session 4 — Jobs in Aviation", tag: "Teaching Session • Prep FE1", isFe: false },
                  { week: "W48", date: "Wed 25 Nov", title: "FORMATIVE EVALUATION 1 (FE1) — Oral Tutorials", subtitle: "Wed 25 Nov • 30-min evaluation slots (Tracy NEILL / Ally HEWETT)", tag: "Grade /20", isFe: true }
                ]
              },
              {
                num: 2,
                title: "Module 2: Aircraft & Aerodynamics",
                weeks: "Weeks 49 – Week 3",
                sessions: [
                  { week: "W49", date: "Wed 02 Dec", title: "Session 1 — Aerodynamics & Flight Principles", tag: "Teaching Session", isFe: false },
                  { week: "W50", date: "Wed 09 Dec", title: "Session 2 — Aircraft Anatomy: Structure & Systems", tag: "Teaching Session", isFe: false },
                  { isHoliday: true, text: "🎄 Weeks 51 & 52 — Christmas & Winter Vacation (No Classes)" },
                  { week: "W01", date: "Wed 06 Jan", title: "Session 3 — Commercial Aircraft & Airlines", tag: "Teaching Session", isFe: false },
                  { week: "W02", date: "Wed 13 Jan", title: "Session 4 — Significant Aviation Accidents & Aircraft Types", tag: "Teaching Session • Prep FE2", isFe: false },
                  { week: "W03", date: "Wed 20 Jan", title: "FORMATIVE EVALUATION 2 (FE2) — Aircraft & Airlines Profile", subtitle: "Wed 20 Jan • 30-min evaluation slots (Tracy NEILL / Ally HEWETT)", tag: "Grade /20", isFe: true }
                ]
              },
              {
                num: 3,
                title: "Module 3: Health, Meteorology, Safety & Security",
                weeks: "Weeks 4 – 8",
                sessions: [
                  { week: "W04", date: "Wed 27 Jan", title: "Session 1 — Health & Human Factors in Aviation", tag: "Teaching Session", isFe: false },
                  { week: "W05", date: "Wed 03 Feb", title: "Session 2 — Meteorology & Severe Weather in Aviation", tag: "Teaching Session", isFe: false },
                  { week: "W06", date: "Wed 10 Feb", title: "Session 3 — Aviation Safety vs. Security: Airport & Aircraft Checks", tag: "Teaching Session", isFe: false },
                  { week: "W07", date: "Wed 17 Feb", title: "Session 4 — Global Semester Review & 3-Team Quiz", tag: "Teaching Session • Prep FE3", isFe: false },
                  { week: "W08", date: "Wed 24 Feb", title: "FORMATIVE EVALUATION 3 (FE3) — Aviation Current Events & Press Briefing", subtitle: "Wed 24 Feb • 30-min evaluation slots (Tracy NEILL / Ally HEWETT)", tag: "Grade /20", isFe: true }
                ]
              }
            ]
          }
        }
      },
      2: {
        num: 2,
        title: "Semester 2",
        promotion: "GSEA25B",
        teacherFocus: "General & Aeronautical",
        nextMilestone: { title: "FE1 Tutorial", sub: "Week 11 Oral Exam" },
        ecampusUrl: "https://e-campus.enac.fr/moodle/my/",
        tracks: "AG (LV102E) & AAS (LV122E)",
        description: "General English (Mobility, Global Immersion Milestone) & Aeronautical English",
        faculty: [
          { name: "Teacher A (TBC)", track: "AAS", group: "Group A", schedule: "Wednesdays 13h15–15h15" },
          { name: "Teacher B (TBC)", track: "AAS", group: "Group B", schedule: "Wednesdays 13h15–15h15" },
          { name: "Teacher C (TBC)", track: "AG", group: "Group A", schedule: "Fridays 08h00–10h00" },
          { name: "Teacher D (TBC)", track: "AG", group: "Group B", schedule: "Fridays 08h00–10h00" }
        ],
        students: {
          groupA: ["GRPA001", "GRPA002", "GRPA003", "GRPA004", "GRPA005", "GRPA006", "GRPA007", "GRPA008", "GRPA009", "GRPA010"],
          groupB: ["GRPB001", "GRPB002", "GRPB003", "GRPB004", "GRPB005", "GRPB006", "GRPB007", "GRPB008", "GRPB009", "GRPB010"]
        },
        evaluationDates: { fe1: { at: "Wed 17 Mar (W11)", ag: "Fri 19 Mar (W11)" }, fe2: { at: "Wed 28 Apr (W17)", ag: "Fri 30 Apr (W17)" }, fe3: { at: "TBC", ag: "TBC" } },
        rotas: [{ slot: "Slot 1 (30m)", groupA: "Pair 1", groupB: "Pair 1", format: "Pair" }],
        programme: [{ week: "W10", date: "Mar", mod: "M1", s: "S1", titleAG: "Immersion Preparation", titleAT: "Aeronautical Systems Overview" }]
      },
      3: {
        "num": 3,
        "title": "Semester 3",
        "promotion": "GSEA25A",
        "teacherFocus": "Technical English",
        "nextMilestone": {
                "title": "FE1 Tutorial",
                "sub": "Week 02 Oral Exam"
        },
        "ecampusUrl": "https://e-campus.enac.fr/moodle/course/view.php?id=32729",
        "tracks": "AT (LV125E) Technical English Only",
        "description": "Technical English Only (AG Disabled) \u2022 EASA Regulations, Systems Engineering, ATM, Radar & Incident Investigations",
        "faculty": [
                {
                        "name": "Teacher A (TBC)",
                        "track": "AT",
                        "group": "Group A",
                        "schedule": "Fridays 13h15\u201315h15"
                },
                {
                        "name": "Teacher B (TBC)",
                        "track": "AT",
                        "group": "Group B",
                        "schedule": "Fridays 13h15\u201315h15"
                },
                {
                        "name": "Teacher C (TBC)",
                        "track": "AT",
                        "group": "Group C",
                        "schedule": "Fridays 13h15\u201315h15"
                }
        ],
        "students": {
                "groupA": [
                        "GRPA001",
                        "GRPA002",
                        "GRPA003",
                        "GRPA004",
                        "GRPA005",
                        "GRPA006",
                        "GRPA007",
                        "GRPA008",
                        "GRPA009",
                        "GRPA010",
                        "GRPA011"
                ],
                "groupB": [
                        "GRPB001",
                        "GRPB002",
                        "GRPB003",
                        "GRPB004",
                        "GRPB005",
                        "GRPB006",
                        "GRPB007",
                        "GRPB008",
                        "GRPB009"
                ],
                "groupC": [
                        "GRPC001",
                        "GRPC002",
                        "GRPC003",
                        "GRPC004",
                        "GRPC005",
                        "GRPC006",
                        "GRPC007",
                        "GRPC008",
                        "GRPC009"
                ]
        },
        "evaluationDates": {
                "fe1": {
                        "at": "Friday 15 Jan 2027 (W02)",
                        "ag": "N/A (AT Only)"
                },
                "fe2": {
                        "at": "Friday 05 Mar 2027 (W09)",
                        "ag": "N/A (AT Only)"
                },
                "fe3": {
                        "at": "Friday 09 Apr 2027 (W14)",
                        "ag": "N/A (AT Only)"
                }
        },
        "rotas": {
                "at": {
                        "code": "LV125E",
                        "name": "Technical English (AT)",
                        "schedule": "Fridays 13h15 \u2013 15h15",
                        "roomNote": "Friday Session \u2022 2 Hours (3 Groups: A, B, C)",
                        "fes": {
                                "1": {
                                        "title": "FE1 \u2014 EASA Regulatory Extract & Class Activity Evaluation",
                                        "week": "Week 02",
                                        "dateStr": "Friday 15 January 2027",
                                        "groupA": {
                                                "teacher": "Teacher A (TBC)",
                                                "slotSummary": "Friday 13h15 - 15h15",
                                                "room": "",
                                                "slots": [
                                                        {
                                                                "num": 1,
                                                                "time": "13h15 \u2013 13h45",
                                                                "type": "team",
                                                                "students": [
                                                                        "GRPA001",
                                                                        "GRPA002",
                                                                        "GRPA003",
                                                                        "GRPA004"
                                                                ]
                                                        },
                                                        {
                                                                "num": 2,
                                                                "time": "13h45 \u2013 14h15",
                                                                "type": "team",
                                                                "students": [
                                                                        "GRPA005",
                                                                        "GRPA006",
                                                                        "GRPA007",
                                                                        "GRPA008"
                                                                ]
                                                        },
                                                        {
                                                                "num": 3,
                                                                "time": "14h15 \u2013 14h45",
                                                                "type": "trio",
                                                                "students": [
                                                                        "GRPA009",
                                                                        "GRPA010",
                                                                        "GRPA011"
                                                                ]
                                                        },
                                                        {
                                                                "num": 4,
                                                                "time": "14h45 \u2013 15h15",
                                                                "type": "feedback",
                                                                "students": [
                                                                        "Whole-Class Feedback & Teacher Debrief"
                                                                ]
                                                        }
                                                ]
                                        },
                                        "groupB": {
                                                "teacher": "Teacher B (TBC)",
                                                "slotSummary": "Friday 13h15 - 15h15",
                                                "room": "",
                                                "slots": [
                                                        {
                                                                "num": 1,
                                                                "time": "13h15 \u2013 13h45",
                                                                "type": "trio",
                                                                "students": [
                                                                        "GRPB001",
                                                                        "GRPB002",
                                                                        "GRPB003"
                                                                ]
                                                        },
                                                        {
                                                                "num": 2,
                                                                "time": "13h45 \u2013 14h15",
                                                                "type": "trio",
                                                                "students": [
                                                                        "GRPB004",
                                                                        "GRPB005",
                                                                        "GRPB006"
                                                                ]
                                                        },
                                                        {
                                                                "num": 3,
                                                                "time": "14h15 \u2013 14h45",
                                                                "type": "trio",
                                                                "students": [
                                                                        "GRPB007",
                                                                        "GRPB008",
                                                                        "GRPB009"
                                                                ]
                                                        },
                                                        {
                                                                "num": 4,
                                                                "time": "14h45 \u2013 15h15",
                                                                "type": "feedback",
                                                                "students": [
                                                                        "Whole-Class Feedback & Teacher Debrief"
                                                                ]
                                                        }
                                                ]
                                        },
                                        "groupC": {
                                                "teacher": "Teacher C (TBC)",
                                                "slotSummary": "Friday 13h15 - 15h15",
                                                "room": "",
                                                "slots": [
                                                        {
                                                                "num": 1,
                                                                "time": "13h15 \u2013 13h45",
                                                                "type": "trio",
                                                                "students": [
                                                                        "GRPC001",
                                                                        "GRPC002",
                                                                        "GRPC003"
                                                                ]
                                                        },
                                                        {
                                                                "num": 2,
                                                                "time": "13h45 \u2013 14h15",
                                                                "type": "trio",
                                                                "students": [
                                                                        "GRPC004",
                                                                        "GRPC005",
                                                                        "GRPC006"
                                                                ]
                                                        },
                                                        {
                                                                "num": 3,
                                                                "time": "14h15 \u2013 14h45",
                                                                "type": "trio",
                                                                "students": [
                                                                        "GRPC007",
                                                                        "GRPC008",
                                                                        "GRPC009"
                                                                ]
                                                        },
                                                        {
                                                                "num": 4,
                                                                "time": "14h45 \u2013 15h15",
                                                                "type": "feedback",
                                                                "students": [
                                                                        "Whole-Class Feedback & Teacher Debrief"
                                                                ]
                                                        }
                                                ]
                                        }
                                }
                        }
                }
        },
        "calendar": {
                "at": {
                        "code": "LV125E",
                        "name": "Technical English (AT)",
                        "dayTime": "Fridays 13h15 \u2013 15h15",
                        "faculty": "Teacher A (TBC) (Group A) \u2022 Teacher B (TBC) (Group B) \u2022 Teacher C (TBC) (Group C)",
                        "modules": [
                                {
                                        "num": 1,
                                        "title": "Module 1: EASA Docs, Safety & Audits (7 Sessions)",
                                        "weeks": "W47 \u2013 W02",
                                        "headerBg": "#1e293b",
                                        "sessions": [
                                                {
                                                        "courseWeek": "W01",
                                                        "week": "W47",
                                                        "date": "Fri 20 Nov",
                                                        "title": "Session 1 \u2014 EASA Rules & Modal Precision",
                                                        "subtitle": "",
                                                        "tag": "Teaching Session",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "courseWeek": "W02",
                                                        "week": "W48",
                                                        "date": "Fri 27 Nov",
                                                        "title": "Session 2 \u2014 Safety Alerts & Ramp Briefings",
                                                        "subtitle": "",
                                                        "tag": "Teaching Session",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "courseWeek": "W03",
                                                        "week": "W49",
                                                        "date": "Fri 04 Dec",
                                                        "title": "Session 3 \u2014 Special Requests & Runway Safety Cases",
                                                        "subtitle": "",
                                                        "tag": "Teaching Session",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "courseWeek": "W04",
                                                        "week": "W50",
                                                        "date": "Fri 11 Dec",
                                                        "title": "Session 4 \u2014 Ground Inspection & Audit Findings",
                                                        "subtitle": "",
                                                        "tag": "Teaching Session",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "courseWeek": "W05",
                                                        "week": "W51",
                                                        "date": "Fri 18 Dec",
                                                        "title": "Session 5 \u2014 Multi-Source Incident Investigation & Root Cause Analysis",
                                                        "subtitle": "",
                                                        "tag": "Teaching Session",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "isHoliday": true,
                                                        "text": "\ud83c\udf84 Weeks 52 & 53 \u2014 Christmas & Winter Vacation (No Classes)"
                                                },
                                                {
                                                        "courseWeek": "W06",
                                                        "week": "W01",
                                                        "date": "Fri 08 Jan",
                                                        "title": "Session 6 \u2014 The Corrective Action Plan & CAP Review",
                                                        "subtitle": "",
                                                        "tag": "Teaching Session \u2022 Prep FE1",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "courseWeek": "W07",
                                                        "week": "W02",
                                                        "date": "Fri 15 Jan",
                                                        "title": "Session 7 \u2014 FORMATIVE EVALUATION 1 (FE1): EASA Regulatory Extract & Class Activity Evaluation",
                                                        "subtitle": "Fri 15 Jan \u2022 30-min evaluation slots (Teacher A (TBC) / Teacher B (TBC) / Teacher C (TBC))",
                                                        "tag": "Grade /20",
                                                        "isFe": true,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                }
                                        ]
                                },
                                {
                                        "num": 2,
                                        "title": "Module 2: MTF ICAO Level 4 Test Preparation (8 Sessions)",
                                        "weeks": "W03 \u2013 W11",
                                        "headerBg": "#182b42",
                                        "sessions": [
                                                {
                                                        "courseWeek": "W08",
                                                        "week": "W03",
                                                        "date": "Fri 22 Jan",
                                                        "title": "Session 1 \u2014 Introduction to the MTF ICAO Level Test",
                                                        "subtitle": "",
                                                        "tag": "Teaching Session",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "courseWeek": "W09",
                                                        "week": "W04",
                                                        "date": "Fri 29 Jan",
                                                        "title": "Session 2 \u2014 The MTF Picture Exercise & Spoken Description Practice",
                                                        "subtitle": "",
                                                        "tag": "Teaching Session",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "courseWeek": "W10",
                                                        "week": "W05",
                                                        "date": "Fri 05 Feb",
                                                        "title": "Session 3 \u2014 The MTF Listening Section & Audio Comprehension Practice",
                                                        "subtitle": "",
                                                        "tag": "Teaching Session",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "isHoliday": true,
                                                        "text": "\u2744\ufe0f Week 06 \u2014 Mid-Semester Break (No Classes)"
                                                },
                                                {
                                                        "courseWeek": "W11",
                                                        "week": "W07",
                                                        "date": "Fri 19 Feb",
                                                        "title": "Session 4 \u2014 The MTF Text Exercise & Technical Summary Practice",
                                                        "subtitle": "",
                                                        "tag": "Teaching Session",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "courseWeek": "W12",
                                                        "week": "W08",
                                                        "date": "Fri 26 Feb",
                                                        "title": "Session 5 \u2014 MTF Practice Test (Part 1 - Individual 30-Min Oral Trials)",
                                                        "subtitle": "Fri 26 Feb \u2022 Individual 30-min oral test slots (Week 1 of 2)",
                                                        "tag": "Mock Exam \u2022 30-min Oral",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "courseWeek": "W13",
                                                        "week": "W09",
                                                        "date": "Fri 05 Mar",
                                                        "title": "Session 6 \u2014 MTF Practice Test (Part 2 - Individual 30-Min Oral Trials)",
                                                        "subtitle": "Fri 05 Mar \u2022 Individual 30-min oral test slots (Week 2 of 2)",
                                                        "tag": "Mock Exam \u2022 30-min Oral",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "courseWeek": "W14",
                                                        "week": "W10",
                                                        "date": "Fri 12 Mar",
                                                        "title": "Session 7 \u2014 MTF Comprehensive Revision & Error Analysis",
                                                        "subtitle": "",
                                                        "tag": "MTF Revision",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                },
                                                {
                                                        "courseWeek": "W15",
                                                        "week": "W11",
                                                        "date": "Fri 19 Mar",
                                                        "title": "Session 8 \u2014 MTF Final Revision & Test Readiness",
                                                        "subtitle": "Fri 19 Mar \u2022 MTF Examination also administered in Week 11",
                                                        "tag": "MTF Revision",
                                                        "isFe": false,
                                                        "rooms": {
                                                                "A": "",
                                                                "B": "",
                                                                "C": "",
                                                                "D": ""
                                                        }
                                                }
                                        ]
                                }
                        ]
                }
        }
},
      4: {
        num: 4,
        title: "Semester 4",
        promotion: "GSEA24B",
        teacherFocus: "Professional",
        nextMilestone: { title: "Certification", sub: "Final Professional Exam" },
        ecampusUrl: "https://e-campus.enac.fr/moodle/course/view.php?id=32728",
        tracks: "AP (LV126E) Professional English",
        description: "Professional English (Anglais Professionnel) & Final Certification Readiness",
        faculty: [
          { name: "Teacher A (TBC)", track: "AP", group: "Group A", schedule: "Intensive" },
          { name: "Teacher B (TBC)", track: "AP", group: "Group B", schedule: "Intensive" },
          { name: "Teacher C (TBC)", track: "AP", group: "Group C", schedule: "Intensive" },
          { name: "Teacher D (TBC)", track: "AP", group: "Group D", schedule: "Intensive" }
        ],
        students: {
          groupA: ["GRPA001", "GRPA002", "GRPA003", "GRPA004", "GRPA005", "GRPA006", "GRPA007", "GRPA008", "GRPA009", "GRPA010"],
          groupB: ["GRPB001", "GRPB002", "GRPB003", "GRPB004", "GRPB005", "GRPB006", "GRPB007", "GRPB008", "GRPB009", "GRPB010"]
        },
        evaluationDates: { fe1: { at: "TBC", ag: "N/A" }, fe2: { at: "TBC", ag: "N/A" }, fe3: { at: "TBC", ag: "N/A" } },
        rotas: [{ slot: "Slot 1 (30m)", groupA: "Professional Interview", groupB: "Professional Interview", format: "Individual/Pair" }],
        programme: [{ week: "W15", date: "Apr", mod: "M1", s: "S1", titleAG: "N/A", titleAT: "Certification Simulation" }]
      }
    };

    // Select Semester
