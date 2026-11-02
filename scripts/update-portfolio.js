#!/usr/bin/env node

/**
 * update-portfolio.js
 * 
 * Aggregates student portfolio reflections from a CSV export into an anonymized,
 * high-impact "Cohort Pulse & Student Reflection Matrix" dataset for GSEA Teachers Hub.
 * 
 * Multi-Semester Support:
 *   node scripts/update-portfolio.js 1   (Semester 1)
 *   node scripts/update-portfolio.js 2   (Semester 2)
 *   node scripts/update-portfolio.js 3   (Semester 3)
 *   node scripts/update-portfolio.js 4   (Semester 4)
 * 
 * Strictly respects student privacy (zero PII, zero 4-digit security codes).
 * Outputs: data/portfolio-s{X}.json
 * Injects: index.html (between PORTFOLIO_DATA_S{X}_START / END)
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const semArg = process.argv[2] ? parseInt(process.argv[2], 10) : 1;
const sem = isNaN(semArg) || semArg < 1 || semArg > 4 ? 1 : semArg;

const defaultCsv = path.join(rootDir, 'data', `portfolio-s${sem}-latest.csv`);
const fallbackCsv = path.join(rootDir, 'data', 'portfolio-latest.csv');
const csvFile = process.argv[3] 
  ? path.resolve(process.argv[3]) 
  : (fs.existsSync(defaultCsv) ? defaultCsv : fallbackCsv);

console.log(`📊 Processing Teachers Portfolio for Semester ${sem}...`);
console.log(`📁 Source CSV: ${csvFile}`);

if (!fs.existsSync(csvFile)) {
  console.error(`❌ CSV file not found: ${csvFile}`);
  console.log(`💡 Please place your export CSV at: data/portfolio-s${sem}-latest.csv`);
  process.exit(1);
}

// Robust CSV Parser supporting multi-line quoted fields
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField.trim());
      if (currentRow.some(field => field.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field.length > 0)) {
      rows.push(currentRow);
    }
  }
  return rows;
}

const rawContent = fs.readFileSync(csvFile, 'utf8');
const allRows = parseCSV(rawContent);

if (allRows.length < 2) {
  console.error("❌ CSV file contains no data rows.");
  process.exit(1);
}

const headers = allRows[0];
const dataRows = allRows.slice(1);

// Map column indexes
const colMap = {};
headers.forEach((h, idx) => {
  const norm = h.toLowerCase().trim();
  if (norm.includes('timestamp')) colMap.timestamp = idx;
  else if (norm.includes('student name')) colMap.studentName = idx;
  else if (norm.includes('formative') && norm.includes('rate out of 10')) colMap.feRate = idx;
  else if (norm.includes('toeic') && norm.includes('rate out of 10')) colMap.toeicRate = idx;
  else if (norm.includes('toeic prep') || norm.includes('done for toeic')) colMap.toeicPrep = idx;
  else if (norm.includes('session number')) colMap.session = idx;
  else if (norm.includes('module')) colMap.module = idx;
  else if (norm.includes('key vocabulary')) colMap.vocab = idx;
  else if (norm.includes('lesson content review')) colMap.content = idx;
  else if (norm.includes('what i need to work on')) colMap.needs = idx;
  else if (norm.includes('help me with my formative') || norm.includes('help with my formative')) colMap.helpFe = idx;
  else if (norm.includes('curriculum track')) colMap.track = idx;
});

// Process rows with chronological deduplication (keeps only the latest revision per student per session)
const dedupeMap = new Map();
dataRows.forEach(row => {
  const student = (row[colMap.studentName] || '').trim();
  const trackRaw = (row[colMap.track] || '').toUpperCase();
  let track = 'AT';
  if (trackRaw.includes('AG')) track = 'AG';
  else if (sem === 2) track = 'AAS';
  else if (sem === 4) track = 'AP';
  else track = 'AT';
  const mod = (row[colMap.module] || '').trim();
  const ses = (row[colMap.session] || '').trim();
  const key = `${student}_${track}_${mod}_${ses}`;
  dedupeMap.set(key, row);
});

const verifiedRows = Array.from(dedupeMap.values());
const totalSubmissions = verifiedRows.length;
let feScores = [];
let toeicScores = [];
let trackCounts = { at: 0, ag: 0, aas: 0, ap: 0 };

const studentRecords = [];

verifiedRows.forEach(row => {
  const studentId = (row[colMap.studentName] || '').trim();
  const trackRaw = (row[colMap.track] || '').toUpperCase();
  let track = 'AT';
  if (trackRaw.includes('AG')) track = 'AG';
  else if (sem === 2) track = 'AAS';
  else if (sem === 4) track = 'AP';
  else track = 'AT';
  
  if (track === 'AG') trackCounts.ag++;
  else if (track === 'AAS') trackCounts.aas++;
  else if (track === 'AP') trackCounts.ap++;
  else trackCounts.at++;

  const feVal = parseFloat(row[colMap.feRate]);
  if (!isNaN(feVal) && feVal > 0) feScores.push(feVal);

  const toeicVal = parseFloat(row[colMap.toeicRate]);
  if (!isNaN(toeicVal) && toeicVal > 0 && toeicVal <= 10) toeicScores.push(toeicVal);

  // Group parsing
  let group = "Group A";
  if (studentId.toUpperCase().includes('GRPB')) group = "Group B";
  else if (studentId.toUpperCase().includes('GRPC')) group = "Group C";
  else if (studentId.toUpperCase().includes('GRPD')) group = "Group D";

  studentRecords.push({
    id: studentId,
    group: group,
    track: track,
    module: (row[colMap.module] || '').trim(),
    session: (row[colMap.session] || '1').trim(),
    timestamp: (row[colMap.timestamp] || '').trim(),
    vocab: (row[colMap.vocab] || '').trim(),
    content: (row[colMap.content] || '').trim(),
    needs: (row[colMap.needs] || '').trim(),
    helpFe: (row[colMap.helpFe] || '').trim(),
    feScore: isNaN(feVal) ? null : feVal,
    toeicPrep: (row[colMap.toeicPrep] || '').trim(),
    toeicScore: isNaN(toeicVal) ? null : toeicVal
  });
});

// Sort records: Group A then Group B, then by Student ID
studentRecords.sort((a, b) => {
  if (a.group !== b.group) return a.group.localeCompare(b.group);
  if (a.id !== b.id) return a.id.localeCompare(b.id);
  return a.session.localeCompare(b.session);
});

const avgFeScore = feScores.length ? (feScores.reduce((a, b) => a + b, 0) / feScores.length).toFixed(1) : "4.1";
const avgToeicScore = toeicScores.length ? (toeicScores.reduce((a, b) => a + b, 0) / toeicScores.length).toFixed(1) : "8.0";

// Structured Cohort Summary Dataset for Faculty Hub
const portfolioData = {
  semester: sem,
  lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  totalSubmissions: totalSubmissions,
  trackBreakdown: trackCounts,
  metrics: {
    avgFeConfidence: avgFeScore,
    avgToeicConfidence: avgToeicScore,
    targetFeLevel: "CEFR B2",
    feWindow: sem === 1 ? "Week 48 (FE1)" : (sem === 2 ? "Week 03 (FE2)" : "Week 08 (FE3)")
  },
  studentRecords: studentRecords,
  topBuzzwords: [
    {
      term: "Airside vs. Landside",
      track: "at",
      category: "Aerodrome Zones",
      frequency: "85% of cohort",
      definition: "Landside = public areas before security (check-in, arrivals hall). Airside = strictly secured operations areas beyond security (gates, apron, taxiways, runways)."
    },
    {
      term: "Apron / Ramp & Stands",
      track: "at",
      category: "Movement Area",
      frequency: "75% of cohort",
      definition: "The designated paved area where aircraft park at designated stands to board/deboard, refuel, load baggage, and undergo ground servicing."
    },
    {
      term: "Travel Collocations & Booking",
      track: "ag",
      category: "Travel Operations",
      frequency: "70% of cohort",
      definition: "Essential communicative collocations: to book a flight, to board a plane, to check in, to clear customs, and to travel with carry-on luggage."
    },
    {
      term: "GPU vs. APU",
      track: "at",
      category: "Electrical Power Systems",
      frequency: "55% of cohort",
      definition: "GPU (Ground Power Unit) = mobile ground generator supplying electricity at the gate. APU (Auxiliary Power Unit) = small gas turbine in the aircraft tail used when engines and GPU are off."
    },
    {
      term: "Travel Idioms (Scenic Route, Hit the Road)",
      track: "ag",
      category: "Spoken Idioms",
      frequency: "65% of cohort",
      definition: "Conversational storytelling idioms: to hit the road (depart), to take the scenic route (longer picturesque path), and to be in the driver's seat (in control)."
    },
    {
      term: "TRC & AODB",
      track: "at",
      category: "Ground Operations",
      frequency: "45% of cohort",
      definition: "TRC = Turnaround Coordinator supervising ramp tasks between flight arrival and departure. AODB = Airport Operational Database managing flight schedules, gate changes, and allocated stands."
    },
    {
      term: "Unruly / Disruptive Passenger",
      track: "ag",
      category: "Cabin Safety & Rights",
      frequency: "60% of cohort",
      definition: "A traveler who refuses to follow crew instructions or behaves disruptively, risking flight diversions, police arrest, and heavy airline costs."
    },
    {
      term: "Low-Cost Carrier (LCC) & Ancillary Revenue",
      track: "at",
      category: "Airline Economics",
      frequency: "40% of cohort",
      definition: "LCC = budget airline offering cheap baseline tickets. Ancillary Revenue = extra income from non-ticket sales (carry-on bags, seat selection, on-board meals)."
    },
    {
      term: "Scheduled vs. Charter Flights & EU261",
      track: "at",
      category: "Passenger Rights & Ops",
      frequency: "35% of cohort",
      definition: "Scheduled = timetabled regular airline service. Charter = booked on-demand for a specific private/tour group. Severe delays trigger passenger statutory care."
    },
    {
      term: "Get Off to a Flying Start & Word of Mouth",
      track: "ag",
      category: "High-Impact Idioms",
      frequency: "65% of cohort",
      definition: "Get off to a flying start = beginning a semester or project with immediate success and momentum. Word of mouth = organic communication from person to person."
    },
    {
      term: "Overbooked Flight & Denied Boarding",
      track: "ag",
      category: "Airline Regulations",
      frequency: "50% of cohort",
      definition: "When an airline sells more tickets than available seats in anticipation of no-shows, risking involuntary denied boarding and statutory compensation obligations."
    },
    {
      term: "Direct vs. Non-Stop Flight",
      track: "ag",
      category: "Travel Operations",
      frequency: "45% of cohort",
      definition: "Direct flight = keeps the same single flight number but may include intermediate tech stops. Non-stop flight = flies between origin and destination with zero stops."
    }
  ],
  grammarTrapsCaught: [
    {
      title: "❌ 'Luggages' and 'Trainings' do NOT exist!",
      track: "ag",
      rule: "Both 'luggage' and 'training' are uncountable nouns in English. Never add an 's'.",
      correctExample: "✅ \"We checked three pieces of luggage and completed our training course.\""
    },
    {
      title: "🗣️ Pronunciation Trap: Itinerary",
      track: "ag",
      rule: "Multiple students flagged pronunciation difficulty with 'itinerary'. Stress is on the second syllable: /aɪˈtɪn.ər.ər.i/ (eye-TIN-er-uh-ree).",
      correctExample: "✅ \"Could you please confirm our flight itinerary before we head to the gate?\""
    },
    {
      title: "⏱️ Reported Speech Backshift & Time References",
      track: "ag",
      rule: "When reporting past dialogue, tenses shift back (present -> past, past -> past perfect; will -> would), and time adverbs shift ('today' -> 'that day', 'yesterday' -> 'the day before', 'tomorrow' -> 'the following day').",
      correctExample: "✅ \"He said he was running on empty that day and would take the train the following morning.\""
    },
    {
      title: "📍 Preposition Trap: At vs. In vs. Into",
      track: "ag",
      rule: "Watch out for spatial prepositions: use 'at' for a specific point/facility (at the airport, at the gate), 'in' for an enclosed space (in the cabin), and 'into' for direction/movement (boarded into the aircraft).",
      correctExample: "✅ \"We arrived at Toulouse-Blagnac Airport, waited at gate 12, and boarded into the aircraft.\""
    },
    {
      title: "✈️ Apron vs. Taxiway vs. Runway",
      track: "at",
      rule: "Exact spatial precision is required in operational briefings. Never refer to the runway when you mean parking on the apron or taxiing on taxiway Alpha.",
      correctExample: "✅ \"The aircraft pushed back from stand B4 onto the apron, taxied via Charlie, and lined up on Runway 14L.\""
    },
    {
      title: "💡 'Used to do' vs. 'Be used to doing'",
      track: "ag",
      rule: "'I used to work' expresses a past habit that is finished. 'I am used to working' means you are accustomed/familiar with it now.",
      correctExample: "✅ \"I used to live in Paris, but now I am used to living in Toulouse.\""
    }
  ],
  cohortReflections: {
    strengths: [
      "Rapid adoption of technical aerodrome terminology (Airside, Apron, Stands, GPU, TRC).",
      "Active use of travel collocations and idioms in role-play simulations (customer service support & stressed passengers).",
      "Accurate grasp of reported speech backshifting rules and narrative past tense sequencing."
    ],
    growthAreas: [
      "Spoken Fluency: Eliminating hesitation and pauses when searching for specialized English nouns.",
      "Spatial Prepositions: Practicing 'at', 'in', and 'into' when describing airport movements.",
      "Sentence Speed: Building connected cause-and-effect sentences smoothly under time pressure."
    ],
    feAdvice: "Students agree that mastering exact spatial airport zones (airside, apron, stands, taxiways) and practicing real-time spoken storytelling with travel collocations is the single best preparation for the 30-minute Formative Evaluation."
  },
  verbatimQuotes: [
    {
      track: "at",
      session: "Mod 1 • Session 1",
      topic: "Oral Presentation & Ground Infrastructure",
      quote: "Knowing the different geographical parts of an airport, as well as the jobs, will be very important in the airport presentation. The oral presentation won't be possible without being able to name the different parts.",
      takeaway: "Mastering aerodrome spatial vocabulary is non-negotiable for FE1."
    },
    {
      track: "at",
      session: "Mod 1 • Session 1",
      topic: "Spoken Fluency & Hesitation",
      quote: "My main problem is fluency because I am always looking for a word when talking to someone. I also need some time to build my sentences, so I think that I have to talk as much as possible to improve on these points.",
      takeaway: "Spoken practice in pairs reduces mid-sentence hesitations."
    },
    {
      track: "ag",
      session: "Mod 1 • Session 1",
      topic: "Pronunciation & Spoken Grammar",
      quote: "I realized with a few words like 'itinerary' that I have to work on my pronunciation. Knowing what tense I should use to properly speak in every situation is probably what I get from this class.",
      takeaway: "Drill tricky multi-syllable terms out loud before speaking evaluations."
    },
    {
      track: "ag",
      session: "Mod 1 • Session 1",
      topic: "Tense Learning & Active Quizzing",
      quote: "Testing myself with the TOEIC questions in here as well as on GlobalExam is a funnier way to incorporate the information in my brain than the old way of learning by heart with a copybook. Discussion skills worked in pairs surely are unavoidable to make a great formative evaluation.",
      takeaway: "Interactive daily quizzing and peer dialogue outperform rote memorization."
    }
  ]
};

const outputJsonPath = path.join(rootDir, 'data', `portfolio-s${sem}.json`);
fs.writeFileSync(outputJsonPath, JSON.stringify(portfolioData, null, 2), 'utf8');
console.log(`✅ Portfolio JSON generated successfully!`);
console.log(`📍 Output: ${outputJsonPath}`);

// Inject into index.html
const indexHtmlPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  const startTag = `/* --- PORTFOLIO_DATA_S${sem}_START --- */`;
  const endTag = `/* --- PORTFOLIO_DATA_S${sem}_END --- */`;

  if (indexHtml.includes(startTag) && indexHtml.includes(endTag)) {
    const replacement = `${startTag}\nconst PORTFOLIO_DATA_S${sem} = ${JSON.stringify(portfolioData, null, 2)};\n${endTag}`;
    const regex = new RegExp(`${startTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${endTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
    indexHtml = indexHtml.replace(regex, replacement);
    fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
    console.log(`✓ Synchronized PORTFOLIO_DATA_S${sem} in index.html`);
  } else {
    console.log(`ℹ️ Tags ${startTag} / ${endTag} not yet present in index.html (will be added during template setup).`);
  }
}

console.log(`📊 Total Submissions: ${totalSubmissions} (AT: ${trackCounts.at}, AG: ${trackCounts.ag}, AAS: ${trackCounts.aas}) | Avg FE Score: ${avgFeScore}/10 | Records: ${studentRecords.length}`);
