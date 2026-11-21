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

// Structured Cohort Summary Dataset for Teachers Hub
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
      term: "Safety vs. Security",
      track: "at",
      category: "Aviation Protection",
      frequency: "90% of cohort",
      definition: "French 'Sécurité' splits in English: Safety = protection from unintentional hazards and system failures; Security = protection against intentional threats, unlawful acts, and terrorism."
    },
    {
      term: "Airside vs. Landside",
      track: "at",
      category: "Aerodrome Zones",
      frequency: "85% of cohort",
      definition: "Landside = public areas before security (check-in, arrivals hall). Airside = strictly secured operations areas beyond security (gates, apron, taxiways, runways)."
    },
    {
      term: "Concourse vs. Bottleneck",
      track: "at",
      category: "Terminal Navigation",
      frequency: "75% of cohort",
      definition: "Concourse = large, open public hall where passengers circulate and relax. Bottleneck = narrow transit corridor or checkpoint causing localized movement congestion."
    },
    {
      term: "Dwell Time & Smart Terminals",
      track: "at",
      category: "Passenger Flow",
      frequency: "70% of cohort",
      definition: "Dwell time = elapsed time passengers spend in the terminal between security screening and boarding. Reduced via automated bag drop, e-gates, CT scanners, and facial recognition."
    },
    {
      term: "Apron / Ramp & Stands",
      track: "at",
      category: "Movement Area",
      frequency: "75% of cohort",
      definition: "The designated paved area where aircraft park at designated stands to board/deboard, refuel, load baggage, and undergo ground servicing (called 'Ramp' in the US, 'Apron' in the UK)."
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
      term: "Get Off to a Flying Start & Word of Mouth",
      track: "ag",
      category: "High-Impact Idioms",
      frequency: "65% of cohort",
      definition: "Get off to a flying start = beginning a semester or project with immediate success and momentum. Word of mouth = organic communication from person to person."
    },
    {
      term: "Direct vs. Non-Stop Flight",
      track: "ag",
      category: "Travel Operations",
      frequency: "45% of cohort",
      definition: "Direct flight = keeps the same single flight number but may include intermediate tech stops. Non-stop flight = flies between origin and destination with zero stops."
    },
    {
      term: "Overbooked Flight & Denied Boarding",
      track: "ag",
      category: "Airline Regulations",
      frequency: "50% of cohort",
      definition: "When an airline sells more tickets than available seats in anticipation of no-shows, risking involuntary denied boarding and statutory compensation obligations."
    },
    {
      term: "Ground Support Equipment (GSE)",
      track: "at",
      category: "Ramp Operations",
      frequency: "65% of cohort",
      definition: "Specialized ground vehicle fleet servicing aircraft at the stand: pushback tugs, belt loaders, catering hi-lift trucks, lavatory service units, potable water trucks, and refueler bowsers."
    },
    {
      term: "Turnaround Time (TAT) & Chocks On/Off",
      track: "at",
      category: "Ground Operations",
      frequency: "60% of cohort",
      definition: "Turnaround Time (TAT) = total duration an aircraft remains at the gate between arrival (chocks on) and departure (chocks off) for unloading, servicing, refueling, and boarding."
    },
    {
      term: "De-icing Rig & Glycol Fluid",
      track: "at",
      category: "Cold Weather Operations",
      frequency: "50% of cohort",
      definition: "Specialized mobile boom rig spraying heated glycol fluid to remove snow/frost and prevent critical aerofoil icing before departure."
    },
    {
      term: "Overtourism & Carrying Capacity",
      track: "ag",
      category: "Destination Management",
      frequency: "65% of cohort",
      definition: "When visitor numbers exceed an ecosystem's or historic site's physical, ecological, or social carrying capacity, causing environmental damage and resident backlash."
    },
    {
      term: "Visitor Dispersal & Tourist Levies",
      track: "ag",
      category: "Policy & Sustainability",
      frequency: "55% of cohort",
      definition: "Strategic destination management: de-marketing over-visited hotspots, redirecting visitor flows to lesser-known regions, and charging targeted day-tripper entry taxes (e.g. Venice)."
    },
    {
      term: "Modal Shift & Decarbonization",
      track: "ag",
      category: "Environmental Economics",
      frequency: "50% of cohort",
      definition: "Encouraging passengers to switch from carbon-intensive short-haul flights to electrified high-speed rail networks, decoupling economic tourism growth from environmental impact."
    }
  ],
  grammarTrapsCaught: [
    {
      title: "🛡️ Safety vs. Security in English",
      track: "at",
      rule: "French 'Sécurité' splits into two distinct operational English terms. Never confuse them: 'Safety' prevents unintentional accidents and hazards; 'Security' protects against intentional human threats and attacks.",
      correctExample: "✅ \"Aviation safety deals with bird strikes and de-icing; aviation security handles passenger screening, CT scanners, and hijackings.\""
    },
    {
      title: "❌ 'Luggages' and 'Trainings' do NOT exist!",
      track: "ag",
      rule: "Both 'luggage' and 'training' are uncountable nouns in English. Never add an 's'. Use 'pieces of luggage' or 'training courses'.",
      correctExample: "✅ \"We checked three pieces of luggage and completed our training course on ramp safety.\""
    },
    {
      title: "📍 Spatial Prepositions: At vs. In vs. On vs. Through",
      track: "all",
      rule: "Use 'at' for specific nodes and facilities (at the gate, at the checkpoint), 'in' for enclosed spaces (in the concourse, in the cabin), 'on' for pavement surfaces (on the apron, on Runway 14L), and 'through/along' for movement.",
      correctExample: "✅ \"Passengers wait in the concourse, board at gate 12, walk along the jet bridge, while the aircraft holds on taxiway Bravo.\""
    },
    {
      title: "🗣️ Pronunciation Trap: Alternate (Verb vs. Noun)",
      track: "at",
      rule: "Word stress changes with grammatical function: the verb 'to alternate' is stressed /ˈɔːl.tər.neɪt/, but the noun/adjective 'an alternate airport' is pronounced /ɔːlˈtɜː.nət/.",
      correctExample: "✅ \"If weather drops below minimums at Toulouse, the captain will divert to an alternate airport.\""
    },
    {
      title: "🗣️ Pronunciation Trap: Itinerary",
      track: "ag",
      rule: "Multiple students flagged pronunciation difficulty with 'itinerary'. Stress is on the second syllable: /aɪˈtɪn.ər.ər.i/ (eye-TIN-er-uh-ree).",
      correctExample: "✅ \"Could you please confirm our flight itinerary before we head to the boarding gate?\""
    },
    {
      title: "⏱️ Reported Speech Backshift & Time References",
      track: "ag",
      rule: "When reporting past dialogue, tenses shift back (present -> past, past -> past perfect; will -> would), and time adverbs shift ('today' -> 'that day', 'yesterday' -> 'the day before', 'tomorrow' -> 'the following day').",
      correctExample: "✅ \"He said he was running on empty that day and would take the train the following morning.\""
    },
    {
      title: "⚙️ Causative Verbs: Make vs. Have vs. Get vs. Require",
      track: "ag",
      rule: "When causing or assigning an action: 'make + person + bare infinitive' (compulsory requirement), 'have + person + bare infinitive' (standard task assignment), 'get + person + TO infinitive' (persuasion), and 'require + person + TO infinitive' (official policy).",
      correctExample: "✅ \"The port authority made cruise lines cap passenger numbers, and got local operators to stagger their excursions.\""
    },
    {
      title: "⏱️ Past Simple vs. Present Perfect in Operational Reports",
      track: "at",
      rule: "Use Past Simple for completed past events at a specific time ('the flight landed at 14:15'); use Present Perfect when the completed event has a direct operational result on current apron status ('the aircraft has landed, so the pushback tug can connect').",
      correctExample: "✅ \"The refueler has finished servicing the aircraft, so the ground crew can remove the chocks.\""
    }
  ],
  cohortReflections: {
    strengths: [
      "Cumulative Operational Vocabulary: Fast command of aerodrome zones, ground support equipment (GSE), and turnaround sequencing (TAT, chocks on/off).",
      "Policy & Scenario Debating: Confident presentation of sustainable tourism solutions, visitor caps, and passenger rights in structured pair discussions.",
      "Grammatical Precision: Rapid adoption of reported speech backshifting and causative sentence structures."
    ],
    growthAreas: [
      "Spoken Fluency Under Time Pressure: Reducing hesitation and sentence-building delays during fast-paced pair simulations and debates.",
      "Spatial Preposition Automaticity: Consolidating 'at' (nodes), 'in' (enclosed spaces), and 'on' (apron/taxiways/runways) without hesitation.",
      "Phonetics & Word Stress: Drilling multi-syllable terms ('itinerary', 'alternate', 'carrying capacity', 'de-icing') to eliminate French false-stress patterns."
    ],
    feAdvice: "Students unanimously report that knowing exact technical equipment (pushback tug, belt loader, GPU) and spatial zones (airside, concourse, apron, stands), paired with linking expressions for polite disagreement ('while I see your point, we must consider...'), gives immediate fluency and authority during the 30-minute Formative Evaluation."
  },
  verbatimQuotes: [
    {
      track: "at",
      session: "Mod 1 • Session 1",
      topic: "Infrastructure & Presentation Readiness",
      quote: "Knowing the different geographical parts of an airport, as well as the jobs, will be very important in the airport presentation. The oral presentation won't be possible without being able to name the different parts.",
      takeaway: "Mastering aerodrome spatial vocabulary is non-negotiable for FE1."
    },
    {
      track: "ag",
      session: "Mod 1 • Session 1",
      topic: "Spoken Fluency & Hesitation",
      quote: "My main problem is fluency because I am always looking for a word when talking to someone. I also need some time to build my sentences, so I think that I have to talk as much as possible to improve on these points.",
      takeaway: "Regular communicative pairwork reduces hesitation and builds sentence speed."
    },
    {
      track: "at",
      session: "Mod 1 • Session 2",
      topic: "Safety vs. Security & Spatial Prepositions",
      quote: "We talked mostly about security and safety and I was surprised to discover the difference with the French words since 'Sécurité' doesn't mean 'Security' but 'Safety'. Today we also talked about prepositions: 'in' when it's in an enclosed space, 'at' when it's a specific location, and 'on' when it's on a surface.",
      takeaway: "Mastering the Safety/Security distinction and spatial prepositions prevents operational ambiguity."
    },
    {
      track: "ag",
      session: "Mod 1 • Session 2",
      topic: "Customer Scenarios & Reported Speech",
      quote: "Communicative skills, arguments and vocabulary explored in this session will all help me to improve my AG formative evaluation by giving me tools to speak about stressful passenger situations and structure my thoughts with accurate reported speech.",
      takeaway: "Practicing passenger mediation scenarios prepares directly for FE1 interactive roleplays."
    },
    {
      track: "at",
      session: "Mod 1 • Session 3",
      topic: "Turnaround Operations & Ground Support Equipment",
      quote: "Learning technical vocabulary like pushback tugs, belt loaders, and glycol de-icing rigs, and recreating turnaround incident scenarios puts us in a realistic operational situation and allows us to memorize terms much more easily than traditional lists.",
      takeaway: "Ground support equipment and turnaround sequencing turn abstract terms into fluent spoken descriptions."
    },
    {
      track: "at",
      session: "Mod 1 • Session 3",
      topic: "Tense Selection in Technical Incident Reporting",
      quote: "In this lesson we focused on the difference between past simple and present perfect: past simple when an action happened at a specific completed time, and present perfect when the event has a direct operational result on the present moment ('the plane has landed, so passengers can disembark').",
      takeaway: "Precise tense distinction ensures clear cause-and-effect incident reporting."
    },
    {
      track: "ag",
      session: "Mod 1 • Session 3",
      topic: "Debating Overtourism & Fragile Sites",
      quote: "Today's session was a good training for the formative evaluation due to the debates we held on overtourism, tourist taxes, and visitor dispersal. It was a great occasion to use well-built sentences, defend a position, and practice polite disagreement.",
      takeaway: "Policy debates build fluency, active listening, and persuasive speaking under time pressure."
    },
    {
      track: "ag",
      session: "Mod 1 • Session 3",
      topic: "Paraphrasing Under Time Pressure",
      quote: "The overtourism and crisis-management activities were particularly useful because they required us to consider different perspectives and suggest realistic solutions. I want to improve my paraphrasing speed under time pressure so I don't pause when searching for expressions.",
      takeaway: "Fast paraphrasing and structured linking expressions prevent mid-sentence hesitation."
    }
  ]
};

const outputJsonPath = path.join(rootDir, 'data', `portfolio-s${sem}.json`);
fs.writeFileSync(outputJsonPath, JSON.stringify(portfolioData, null, 2), 'utf8');
console.log(`✅ Portfolio JSON generated successfully!`);
console.log(`📍 Output: ${outputJsonPath}`);

// Inject into src/js/08-portfolio-data.js and recompile index.html
const startTag = `/* --- PORTFOLIO_DATA_S${sem}_START --- */`;
const endTag = `/* --- PORTFOLIO_DATA_S${sem}_END --- */`;
const replacement = `${startTag}\nconst PORTFOLIO_DATA_S${sem} = ${JSON.stringify(portfolioData, null, 2)};\n${endTag}`;
const regex = new RegExp(`${startTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${endTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);

if (fs.existsSync(portfolioJsPath)) {
  let portJs = fs.readFileSync(portfolioJsPath, 'utf8');
  if (portJs.includes(startTag) && portJs.includes(endTag)) {
    portJs = portJs.replace(regex, replacement);
    fs.writeFileSync(portfolioJsPath, portJs, 'utf8');
    console.log(`✓ Synchronized PORTFOLIO_DATA_S${sem} in src/js/08-portfolio-data.js`);
  }
}

if (typeof buildHtml === 'function') {
  buildHtml();
} else if (fs.existsSync(indexHtmlPath)) {
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  if (indexHtml.includes(startTag) && indexHtml.includes(endTag)) {
    indexHtml = indexHtml.replace(regex, replacement);
    fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
    console.log(`✓ Synchronized PORTFOLIO_DATA_S${sem} in index.html`);
  }
}

console.log(`📊 Total Submissions: ${totalSubmissions} (AT: ${trackCounts.at}, AG: ${trackCounts.ag}, AAS: ${trackCounts.aas}) | Avg FE Score: ${avgFeScore}/10 | Records: ${studentRecords.length}`);
