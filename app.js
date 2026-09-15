/**
 * NexusSync — Research Assistant Interaction Controller
 * Workflow: Page 1 (Video + Heart Rate + Click Log) → Backend AI Timestamp Alignment → Page 2 (Timeline: Engagement / Confusion / Boredom / Frustration)
 */

// ---------------------------------------------------------------------------
// 1. Multimodal Datasets & Core Taxonomy
// ---------------------------------------------------------------------------
const RUBRIC_TAXONOMY = [
  { id: 'engagement', name: 'Engagement', code: 'ENG', family: 'engagement' },
  { id: 'confusion', name: 'Confusion', code: 'CNF', family: 'confusion' },
  { id: 'boredom', name: 'Boredom', code: 'BOR', family: 'boredom' },
  { id: 'frustration', name: 'Frustration', code: 'FRS', family: 'frustration' }
];

const SESSIONS = {
  'SES-1042': {
    id: 'SES-1042',
    name: 'Participant 28 · Algebra Task',
    cohort: 'Cognitive Load in Interactive Math · Dyad 14',
    participants: 'P28 (Subject)',
    durationSec: 1125, // 18m 45s
    durationStr: '18:45.000',
    status: 'Ready to Align',
    streams: {
      video: { name: 'p28_facial_screen_1080p60.mp4', meta: '1080p60 · 18m 45s · 1.42 GB', ready: true },
      heartRate: { name: 'polar_h10_ecg_hrv_stream.csv', meta: '100Hz ECG · 112,500 samples · 8.4 MB', ready: true },
      clickLog: { name: 'lms_interaction_telemetry.json', meta: '342 clicks · 28 hint calls · 1.2 MB', ready: true }
    },
    clickEvents: [
      { timeSec: 45, label: 'Click: Problem Opened' },
      { timeSec: 110, label: 'Click: Step 1 Factorize' },
      { timeSec: 160, label: 'Click: Diagram Tool' },
      { timeSec: 210, label: 'Click: Step 2 Input' },
      { timeSec: 245, label: 'Click: Error Undo' },
      { timeSec: 252, label: 'Click: Error Undo #2' },
      { timeSec: 258, label: 'Click: Undo Step 2' },
      { timeSec: 380, label: 'Click: Recalculate' },
      { timeSec: 460, label: 'Click: Sub-equation' },
      { timeSec: 520, label: 'Click: Step 3 Verified' },
      { timeSec: 615, label: 'Click: Hint Request #1' },
      { timeSec: 645, label: 'Click: Hint Request #2' },
      { timeSec: 690, label: 'Click: Scratchpad' },
      { timeSec: 730, label: 'Idle: 0 clicks (48s)' },
      { timeSec: 790, label: 'Click: Workspace Tap' },
      { timeSec: 840, label: 'Click: Resume Proof' },
      { timeSec: 895, label: 'Click: Rapid Delete' },
      { timeSec: 920, label: 'Click: Undo' },
      { timeSec: 990, label: 'Click: Final Step' },
      { timeSec: 1080, label: 'Click: Submit Answer' }
    ],
    segments: [
      {
        id: 1,
        code: 'SEG-001',
        startSec: 0,
        endSec: 195,
        startStr: '00:00.000',
        endStr: '03:15.000',
        durationStr: '3m 15s',
        constructId: 'engagement',
        constructName: 'Engagement',
        family: 'engagement',
        confidence: 0.94,
        justification: 'Steady resting heart rate (72 bpm, HRV RMSSD: 52ms) paired with fluid click cadence on initial proof setup and upright attentive head posture.',
        metrics: {
          hr: '72.1 bpm <span class="delta-neutral">[Stable baseline]</span>',
          hrv: '52.4 ms <span class="delta-neutral">[Balanced autonomic tone]</span>',
          clicks: '18 clicks in 3m <span class="delta-neutral">[Fluid progression]</span>',
          lastClick: 'step1_factorize (02:40.120)',
          facs: 'AU12 Smile (74%), AU06 (68%)',
          gaze: 'Screen Step 1 [Dwell 78%]'
        },
        reviewed: true,
        userDecision: 'accepted'
      },
      {
        id: 2,
        code: 'SEG-002',
        startSec: 195,
        endSec: 340,
        startStr: '03:15.000',
        endStr: '05:40.000',
        durationStr: '2m 25s',
        constructId: 'frustration',
        constructName: 'Frustration',
        family: 'frustration',
        confidence: 0.91,
        justification: 'Heart rate spike (92 bpm, Δ+18 bpm) following 3 consecutive error clicks on factorization and sustained eyebrow furrow (AU04 >3.2s).',
        metrics: {
          hr: '92.4 bpm <span class="delta-up">[↑18.4% vs baseline]</span>',
          hrv: '28.4 ms <span class="delta-down">[High Sympathetic Load]</span>',
          clicks: '3 clicks in 4s <span class="delta-up">[Erratic error pattern]</span>',
          lastClick: 'btn_undo_step (04:16.820)',
          facs: 'AU04 Brow (88%), AU14 (62%)',
          gaze: 'Equation Box [Dwell 8.4s]'
        },
        reviewed: false,
        userDecision: null
      },
      {
        id: 3,
        code: 'SEG-003',
        startSec: 340,
        endSec: 570,
        startStr: '05:40.000',
        endStr: '09:30.000',
        durationStr: '3m 50s',
        constructId: 'engagement',
        constructName: 'Engagement',
        family: 'engagement',
        confidence: 0.96,
        justification: 'Cardiovascular equilibrium recovered (74 bpm) with consistent constructive click rhythm and focused gaze on intermediate algebra steps.',
        metrics: {
          hr: '74.0 bpm <span class="delta-neutral">[Recovered to baseline]</span>',
          hrv: '48.2 ms <span class="delta-neutral">[Steady state]</span>',
          clicks: '24 clicks / min <span class="delta-neutral">[Deliberate problem solving]</span>',
          lastClick: 'btn_verify_step (08:42.100)',
          facs: 'AU12 (81%), AU25 (79%)',
          gaze: 'Workspace Center [Dwell 86%]'
        },
        reviewed: true,
        userDecision: 'accepted'
      },
      {
        id: 4,
        code: 'SEG-004',
        startSec: 570,
        endSec: 705,
        startStr: '09:30.000',
        endStr: '11:45.000',
        durationStr: '2m 15s',
        constructId: 'confusion',
        constructName: 'Confusion',
        family: 'confusion',
        confidence: 0.89,
        justification: 'Moderate heart rate elevation (81 bpm) coupled with 2 rapid Hint Requests and prolonged eye fixation (>12s) on hint prompt.',
        metrics: {
          hr: '81.2 bpm <span class="delta-up">[↑8.2 bpm]</span>',
          hrv: '39.0 ms <span class="delta-down">[Mild cognitive tension]</span>',
          clicks: '2 hint requests <span class="delta-down">[Stall detected]</span>',
          lastClick: 'btn_request_hint_2 (10:45.300)',
          facs: 'AU04+AU07 (72% Squint/Furrow)',
          gaze: 'Hint Modal [Dwell 92%]'
        },
        reviewed: true,
        userDecision: 'accepted'
      },
      {
        id: 5,
        code: 'SEG-005',
        startSec: 705,
        endSec: 810,
        startStr: '11:45.000',
        endStr: '13:30.000',
        durationStr: '1m 45s',
        constructId: 'boredom',
        constructName: 'Boredom',
        family: 'boredom',
        confidence: 0.88,
        justification: 'Pronounced heart rate drop (63 bpm), 0 click events for >48s, and gaze coordinates drifting completely away from the task canvas.',
        metrics: {
          hr: '63.4 bpm <span class="delta-down">[↓8.6 bpm Hypo-arousal]</span>',
          hrv: '64.1 ms <span class="delta-neutral">[Parasympathetic rise]</span>',
          clicks: '0 clicks in 48s <span class="delta-down">[Complete idle]</span>',
          lastClick: 'idle_timeout_flag (12:34.000)',
          facs: 'AU43 Eyelid Drop (82%)',
          gaze: 'Off-screen Left [Dwell 72%]'
        },
        reviewed: true,
        userDecision: 'accepted'
      },
      {
        id: 6,
        code: 'SEG-006',
        startSec: 810,
        endSec: 950,
        startStr: '13:30.000',
        endStr: '15:50.000',
        durationStr: '2m 20s',
        constructId: 'frustration',
        constructName: 'Frustration',
        family: 'frustration',
        confidence: 0.90,
        justification: 'Secondary heart rate spike (89 bpm) with rapid repeated backspace and clear undo actions following hint failure.',
        metrics: {
          hr: '89.0 bpm <span class="delta-up">[↑16.9 bpm]</span>',
          hrv: '31.2 ms <span class="delta-down">[Arousal burst]</span>',
          clicks: '12 rapid delete actions <span class="delta-up">[Agitated rhythm]</span>',
          lastClick: 'btn_clear_all (14:52.200)',
          facs: 'AU04 Brow (84%), AU17 (66%)',
          gaze: 'Equation Input [Dwell 81%]'
        },
        reviewed: true,
        userDecision: 'accepted'
      },
      {
        id: 7,
        code: 'SEG-007',
        startSec: 950,
        endSec: 1125,
        startStr: '15:50.000',
        endStr: '18:45.000',
        durationStr: '2m 55s',
        constructId: 'engagement',
        constructName: 'Engagement',
        family: 'engagement',
        confidence: 0.97,
        justification: 'Stabilized cardiac metrics (71 bpm), continuous productive click execution, and successful submission of quadratic factorization.',
        metrics: {
          hr: '71.0 bpm <span class="delta-neutral">[Calm focused state]</span>',
          hrv: '54.0 ms <span class="delta-neutral">[Optimal cognitive flow]</span>',
          clicks: '14 clicks <span class="delta-neutral">[Accurate step completion]</span>',
          lastClick: 'btn_submit_final (18:00.120)',
          facs: 'AU12 Smile (91%), AU06 (82%)',
          gaze: 'Answer Box [Dwell 88%]'
        },
        reviewed: true,
        userDecision: 'accepted'
      }
    ]
  }
};

// Application State
const state = {
  activePage: 'page1',
  activeSessionId: 'SES-1042',
  selectedSegmentId: 2,
  currentTimeSec: 258.24, // 04:18.240
  totalTimeSec: 1125, // 18:45.000
  isPlaying: false,
  playbackSpeed: 1.0,
  isLooping: false,
  timerInterval: null
};

// ---------------------------------------------------------------------------
// 2. DOM Elements
// ---------------------------------------------------------------------------
const el = {
  tab1: document.getElementById('tab-page1'),
  tab2: document.getElementById('tab-page2'),
  view1: document.getElementById('view-page1'),
  view2: document.getElementById('view-page2'),
  
  // Sessions & Samples
  sessionsList: document.getElementById('sessions-list'),
  btnLoadSample: document.getElementById('btn-load-sample'),
  unreviewedBadge: document.getElementById('unreviewed-badge'),
  
  // Stream Slots
  slotVideo: document.getElementById('slot-video'),
  slotHR: document.getElementById('slot-heartrate'),
  slotClicks: document.getElementById('slot-clicklog'),
  inputVideo: document.getElementById('input-video'),
  inputHR: document.getElementById('input-heartrate'),
  inputClicks: document.getElementById('input-clicklog'),
  
  // Pipeline Stepper
  pipelineStepper: document.getElementById('pipeline-stepper'),
  pipelineStepText: document.getElementById('pipeline-step-text'),
  btnRunAnalysis: document.getElementById('btn-run-analysis'),
  
  // Rubric
  rubricContainer: document.getElementById('rubric-chips-list'),
  btnAddRubric: document.getElementById('btn-add-rubric'),
  
  // Timeline Elements
  timelineTrack: document.getElementById('timeline-track'),
  segmentsTrack: document.getElementById('segments-track'),
  clicksMarkersTrack: document.getElementById('clicks-markers-track'),
  playhead: document.getElementById('playhead'),
  cursorTimestamp: document.getElementById('cursor-timestamp'),
  validationProgressText: document.getElementById('validation-progress-text'),
  liveHRReadout: document.getElementById('live-hr-readout'),
  liveClickReadout: document.getElementById('live-click-readout'),
  
  // Video Player Elements
  btnPlayPause: document.getElementById('btn-play-pause'),
  playIcon: document.getElementById('play-icon'),
  btnStepBack: document.getElementById('btn-step-backward'),
  btnStepForward: document.getElementById('btn-step-forward'),
  currentTimecode: document.getElementById('current-timecode'),
  hudTimecode: document.getElementById('hud-timecode'),
  hudGazeState: document.getElementById('hud-gaze-state'),
  hudClickState: document.getElementById('hud-click-state'),
  hudFacsBadge: document.getElementById('hud-facs-badge'),
  btnLoopSegment: document.getElementById('btn-loop-segment'),
  facsP1: document.getElementById('facs-p1'),
  simCursor: document.getElementById('sim-cursor'),
  screenCurrentStep: document.getElementById('screen-current-step'),
  speedBtns: document.querySelectorAll('.speed-btn'),
  
  // Detail Panel Elements
  detailSegCode: document.getElementById('detail-seg-code'),
  detailSegInterval: document.getElementById('detail-seg-interval'),
  detailStatusPill: document.getElementById('detail-status-pill'),
  detailConstructName: document.getElementById('detail-construct-name'),
  detailConfidence: document.getElementById('detail-confidence'),
  detailJustification: document.getElementById('detail-justification'),
  metricHR: document.getElementById('metric-hr'),
  metricHRV: document.getElementById('metric-hrv'),
  metricClicks: document.getElementById('metric-clicks'),
  metricLastClick: document.getElementById('metric-lastclick'),
  metricFacs: document.getElementById('metric-facs'),
  metricGaze: document.getElementById('metric-gaze'),
  notesInput: document.getElementById('researcher-notes'),
  btnAccept: document.getElementById('btn-accept-label'),
  btnCorrect: document.getElementById('btn-correct-label'),
  
  // Modals
  modalRubric: document.getElementById('modal-rubric'),
  formRubric: document.getElementById('form-rubric'),
  btnCloseRubric: document.getElementById('btn-close-rubric-modal'),
  btnCancelRubric: document.getElementById('btn-cancel-rubric'),
  
  modalCorrect: document.getElementById('modal-correct'),
  btnCloseCorrect: document.getElementById('btn-close-correct-modal'),
  btnCancelCorrect: document.getElementById('btn-cancel-correct'),
  btnSaveCorrection: document.getElementById('btn-save-correction'),
  reclassifyOptions: document.getElementById('reclassify-options'),
  modalSegName: document.getElementById('modal-seg-name'),
  correctionRationale: document.getElementById('correction-rationale'),
  
  modalShortcuts: document.getElementById('modal-shortcuts'),
  btnShortcuts: document.getElementById('btn-shortcuts'),
  btnCloseShortcuts: document.getElementById('btn-close-shortcuts-modal'),
  
  btnExport: document.getElementById('btn-export-annotations'),
  toastContainer: document.getElementById('toast-container')
};

// ---------------------------------------------------------------------------
// 3. Formatting & Toast Utilities
// ---------------------------------------------------------------------------
function formatTimecode(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

function showToast(message, icon = 'ti-check') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="ti ${icon} toast-icon" aria-hidden="true"></i><span>${message}</span>`;
  el.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px)';
    toast.style.transition = 'all 180ms ease';
    setTimeout(() => toast.remove(), 200);
  }, 2800);
}

// ---------------------------------------------------------------------------
// 4. Page Navigation & Alignment Simulation
// ---------------------------------------------------------------------------
function switchPage(pageId) {
  state.activePage = pageId;
  
  if (pageId === 'page1') {
    el.tab1.classList.add('active');
    el.tab1.setAttribute('aria-selected', 'true');
    el.tab2.classList.remove('active');
    el.tab2.setAttribute('aria-selected', 'false');
    
    el.view1.classList.add('active');
    el.view2.classList.remove('active');
    
    if (state.isPlaying) togglePlayPause();
  } else {
    el.tab2.classList.add('active');
    el.tab2.setAttribute('aria-selected', 'true');
    el.tab1.classList.remove('active');
    el.tab1.setAttribute('aria-selected', 'false');
    
    el.view2.classList.add('active');
    el.view1.classList.remove('active');
    
    renderTimelineSegments();
    renderClickMarkers();
    updateDetailPanel();
    updatePlayheadPosition();
  }
}

el.tab1.addEventListener('click', () => switchPage('page1'));
el.tab2.addEventListener('click', () => switchPage('page2'));

// Backend Alignment Simulation with Pipeline Stepper
el.btnRunAnalysis.addEventListener('click', () => {
  el.pipelineStepper.style.display = 'flex';
  el.btnRunAnalysis.disabled = true;
  el.btnRunAnalysis.style.opacity = '0.7';
  
  const steps = [
    { text: '1. Ingesting Video (60fps), Heart Rate (100Hz), and Click Log...', stepId: 'step-1' },
    { text: '2. Running Timestamp Alignment & Clock Drift Correction (Δt < 0.4ms)...', stepId: 'step-2' },
    { text: '3. Fusing Multimodal Feature Vectors (Arousal + Valence + Interaction Rate)...', stepId: 'step-3' },
    { text: '4. Generating Learning Construct Timeline (Engagement / Confusion / Boredom / Frustration)...', stepId: 'step-4' }
  ];
  
  let currentStepIndex = 0;
  
  function advanceStep() {
    if (currentStepIndex < steps.length) {
      el.pipelineStepText.textContent = steps[currentStepIndex].text;
      
      // Update step visual classes
      for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        if (i <= currentStepIndex + 1) {
          stepEl.classList.add('active');
          if (i <= currentStepIndex) stepEl.classList.add('completed');
        }
      }
      
      currentStepIndex++;
      setTimeout(advanceStep, 450);
    } else {
      el.btnRunAnalysis.disabled = false;
      el.btnRunAnalysis.style.opacity = '1';
      showToast('Timestamp Alignment Complete: 3 Streams Synchronized!', 'ti-check');
      setTimeout(() => switchPage('page2'), 300);
    }
  }
  
  advanceStep();
});

// Stream Slot Upload Triggers
el.slotVideo.addEventListener('click', () => el.inputVideo.click());
el.slotHR.addEventListener('click', () => el.inputHR.click());
el.slotClicks.addEventListener('click', () => el.inputClicks.click());

el.inputVideo.addEventListener('change', (e) => {
  if (e.target.files.length) {
    document.getElementById('file-name-video').textContent = e.target.files[0].name;
    showToast(`Video Stream Connected: ${e.target.files[0].name}`);
  }
});
el.inputHR.addEventListener('change', (e) => {
  if (e.target.files.length) {
    document.getElementById('file-name-hr').textContent = e.target.files[0].name;
    showToast(`Heart Rate Stream Connected: ${e.target.files[0].name}`);
  }
});
el.inputClicks.addEventListener('change', (e) => {
  if (e.target.files.length) {
    document.getElementById('file-name-clicks').textContent = e.target.files[0].name;
    showToast(`Click Log Telemetry Connected: ${e.target.files[0].name}`);
  }
});

// Load Sample Bundle button
el.btnLoadSample.addEventListener('click', () => {
  document.getElementById('file-name-video').textContent = 'p28_facial_screen_1080p60.mp4';
  document.getElementById('file-name-hr').textContent = 'polar_h10_ecg_hrv_stream.csv';
  document.getElementById('file-name-clicks').textContent = 'lms_interaction_telemetry.json';
  showToast('Loaded Sample Tri-Stream Bundle for Participant 28', 'ti-wand');
});

// ---------------------------------------------------------------------------
// 5. Rubric Chips Management
// ---------------------------------------------------------------------------
function renderRubricChips() {
  el.rubricContainer.innerHTML = '';
  RUBRIC_TAXONOMY.forEach((construct, idx) => {
    const chip = document.createElement('div');
    chip.className = 'rubric-chip';
    chip.dataset.construct = construct.id;
    
    let dotClass = 'dot-engagement';
    if (construct.family === 'confusion') dotClass = 'dot-confusion';
    if (construct.family === 'boredom') dotClass = 'dot-boredom';
    if (construct.family === 'frustration') dotClass = 'dot-frustration';
    
    chip.innerHTML = `
      <span class="chip-dot ${dotClass}"></span>
      <span class="chip-name">${construct.name}</span>
      <span class="chip-code mono">${construct.code}</span>
      <button type="button" class="chip-remove-btn" title="Remove construct" aria-label="Remove construct">
        <i class="ti ti-x" aria-hidden="true"></i>
      </button>
    `;
    
    const removeBtn = chip.querySelector('.chip-remove-btn');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      RUBRIC_TAXONOMY.splice(idx, 1);
      renderRubricChips();
      showToast(`Removed construct: ${construct.name}`);
    });
    
    el.rubricContainer.appendChild(chip);
  });
}

el.btnAddRubric.addEventListener('click', () => {
  el.formRubric.reset();
  el.modalRubric.showModal();
});

el.btnCloseRubric.addEventListener('click', () => el.modalRubric.close());
el.btnCancelRubric.addEventListener('click', () => el.modalRubric.close());

el.formRubric.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('rubric-name').value.trim();
  const code = document.getElementById('rubric-code').value.trim();
  const family = el.formRubric.querySelector('input[name="state-family"]:checked').value;
  
  if (name && code) {
    const newId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    RUBRIC_TAXONOMY.push({ id: newId, name, code, family });
    renderRubricChips();
    el.modalRubric.close();
    showToast(`Construct added: ${name}`);
  }
});

// ---------------------------------------------------------------------------
// 6. Timeline Rendering & Interactive Scrubbing
// ---------------------------------------------------------------------------
function renderTimelineSegments() {
  const session = SESSIONS[state.activeSessionId];
  if (!session) return;
  
  el.segmentsTrack.innerHTML = '';
  
  let unreviewedCount = 0;
  let reviewedCount = 0;
  
  session.segments.forEach(seg => {
    if (!seg.reviewed) unreviewedCount++;
    else reviewedCount++;
    
    const pct = ((seg.endSec - seg.startSec) / session.durationSec) * 100;
    const segDiv = document.createElement('div');
    segDiv.className = `state-segment seg-${seg.family}`;
    if (seg.id === state.selectedSegmentId) {
      segDiv.classList.add('selected');
    }
    segDiv.style.width = `${pct.toFixed(2)}%`;
    segDiv.dataset.segId = seg.id;
    segDiv.title = `${seg.startStr} - ${seg.endStr} · ${seg.constructName}`;
    
    segDiv.innerHTML = `
      <span class="seg-label">${seg.constructName}</span>
      ${seg.id === state.selectedSegmentId ? '<span class="seg-active-indicator"></span>' : ''}
    `;
    
    segDiv.addEventListener('click', (e) => {
      e.stopPropagation();
      selectSegment(seg.id);
      seekToTime(seg.startSec);
    });
    
    el.segmentsTrack.appendChild(segDiv);
  });
  
  // Append playhead
  el.segmentsTrack.appendChild(el.playhead);
  
  // Update progress
  el.validationProgressText.textContent = `${reviewedCount} / ${session.segments.length} Segments Confirmed`;
  if (unreviewedCount > 0) {
    el.unreviewedBadge.textContent = `${unreviewedCount} Flagged`;
    el.unreviewedBadge.style.display = 'inline-block';
  } else {
    el.unreviewedBadge.textContent = 'All Verified';
    el.unreviewedBadge.style.display = 'inline-block';
  }
}

function renderClickMarkers() {
  const session = SESSIONS[state.activeSessionId];
  if (!session || !session.clickEvents) return;
  
  el.clicksMarkersTrack.innerHTML = '';
  session.clickEvents.forEach(evt => {
    const pct = (evt.timeSec / session.durationSec) * 100;
    const marker = document.createElement('div');
    marker.className = 'click-marker-dot';
    marker.style.left = `${pct.toFixed(2)}%`;
    marker.title = `${formatTimecode(evt.timeSec)}: ${evt.label}`;
    el.clicksMarkersTrack.appendChild(marker);
  });
}

function selectSegment(segmentId) {
  state.selectedSegmentId = segmentId;
  renderTimelineSegments();
  updateDetailPanel();
}

function updateDetailPanel() {
  const session = SESSIONS[state.activeSessionId];
  const seg = session.segments.find(s => s.id === state.selectedSegmentId);
  if (!seg) return;
  
  el.detailSegCode.textContent = seg.code;
  el.detailSegInterval.textContent = `${seg.startStr} — ${seg.endStr} (${seg.durationStr})`;
  
  if (seg.reviewed) {
    el.detailStatusPill.className = 'detail-status-pill status-ready';
    el.detailStatusPill.textContent = seg.userDecision === 'corrected' ? 'Researcher Corrected' : 'Verified';
  } else {
    el.detailStatusPill.className = 'detail-status-pill status-flagged';
    el.detailStatusPill.textContent = 'Under Review';
  }
  
  el.detailConstructName.textContent = seg.constructName;
  el.detailConfidence.textContent = `p = ${seg.confidence.toFixed(2)}`;
  el.detailJustification.textContent = seg.justification;
  
  // Metrics Readout across Video, Heart Rate, and Click Logs
  el.metricHR.innerHTML = seg.metrics.hr;
  el.metricHRV.innerHTML = seg.metrics.hrv;
  el.metricClicks.innerHTML = seg.metrics.clicks;
  el.metricLastClick.textContent = seg.metrics.lastClick;
  el.metricFacs.textContent = seg.metrics.facs;
  el.metricGaze.textContent = seg.metrics.gaze;
  
  // Synchronized HUD updates
  if (seg.family === 'frustration') {
    el.facsP1.className = 'facs-overlay facs-impasse';
    el.hudFacsBadge.textContent = 'AU04 [0.88] BROW FURROW';
    el.hudGazeState.textContent = 'GAZE: EQUATION STALL';
    el.hudClickState.textContent = 'LAST CLICK: UNDO [ERROR]';
    el.screenCurrentStep.textContent = 'Step 2: Error in (3x - 3)(x - 3)';
    el.screenCurrentStep.style.borderColor = 'var(--state-frustration-base)';
  } else if (seg.family === 'confusion') {
    el.facsP1.className = 'facs-overlay';
    el.hudFacsBadge.textContent = 'AU04+AU07 [0.72] SQUINT';
    el.hudGazeState.textContent = 'GAZE: HINT MODAL';
    el.hudClickState.textContent = 'LAST CLICK: HINT BUTTON';
    el.screenCurrentStep.textContent = 'Prompt: Factor by grouping coefficients';
    el.screenCurrentStep.style.borderColor = 'var(--state-confusion-base)';
  } else if (seg.family === 'boredom') {
    el.facsP1.className = 'facs-overlay';
    el.hudFacsBadge.textContent = 'AU43 [0.82] EYELID DROP';
    el.hudGazeState.textContent = 'GAZE: OFF-SCREEN';
    el.hudClickState.textContent = 'LAST CLICK: IDLE (48s)';
    el.screenCurrentStep.textContent = 'Workspace Idle: Waiting for input...';
    el.screenCurrentStep.style.borderColor = 'var(--state-boredom-base)';
  } else {
    el.facsP1.className = 'facs-overlay';
    el.hudFacsBadge.textContent = 'AU12 [0.84] ATTENTIVE';
    el.hudGazeState.textContent = 'GAZE: ACTIVE WORKSPACE';
    el.hudClickState.textContent = 'LAST CLICK: STEP INPUT';
    el.screenCurrentStep.textContent = 'Step 3: Roots x = 1, x = 3 Verified';
    el.screenCurrentStep.style.borderColor = 'var(--accent-primary)';
  }
}

// Timeline Scrubbing
function handleTimelineScrub(e) {
  const rect = el.segmentsTrack.getBoundingClientRect();
  const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const pct = clickX / rect.width;
  const time = pct * state.totalTimeSec;
  
  seekToTime(time);
  
  const session = SESSIONS[state.activeSessionId];
  const matched = session.segments.find(s => time >= s.startSec && time <= s.endSec);
  if (matched && matched.id !== state.selectedSegmentId) {
    selectSegment(matched.id);
  }
}

let isScrubbing = false;
el.timelineTrack.addEventListener('mousedown', (e) => {
  isScrubbing = true;
  handleTimelineScrub(e);
});

window.addEventListener('mousemove', (e) => {
  if (isScrubbing) {
    handleTimelineScrub(e);
  }
  
  const rect = el.segmentsTrack.getBoundingClientRect();
  if (e.clientY >= rect.top - 20 && e.clientY <= rect.bottom + 20 && e.clientX >= rect.left && e.clientX <= rect.right) {
    const pct = Math.max(0, Math.min(e.clientX - rect.left, rect.width)) / rect.width;
    const hoverTime = pct * state.totalTimeSec;
    el.cursorTimestamp.textContent = `Scrub: ${formatTimecode(hoverTime)}`;
  } else {
    el.cursorTimestamp.textContent = `Scrub: ${formatTimecode(state.currentTimeSec)}`;
  }
});

window.addEventListener('mouseup', () => {
  isScrubbing = false;
});

// ---------------------------------------------------------------------------
// 7. Synchronized Playback Engine
// ---------------------------------------------------------------------------
function updatePlayheadPosition() {
  const pct = (state.currentTimeSec / state.totalTimeSec) * 100;
  el.playhead.style.left = `${pct.toFixed(3)}%`;
  
  const formatted = formatTimecode(state.currentTimeSec);
  el.currentTimecode.textContent = formatted;
  el.hudTimecode.innerHTML = `${formatted} <span class="fps-tag">60.0 fps</span>`;
  
  // Real-time instantaneous Heart Rate & Click Readout updates
  const session = SESSIONS[state.activeSessionId];
  const activeSeg = session.segments.find(s => state.currentTimeSec >= s.startSec && state.currentTimeSec <= s.endSec);
  
  if (activeSeg) {
    if (activeSeg.family === 'frustration') {
      const hrDynamic = 88 + Math.round(Math.sin(state.currentTimeSec * 2) * 5);
      el.liveHRReadout.textContent = `${hrDynamic} bpm (High)`;
      el.liveClickReadout.textContent = 'Click: Undo [Stall]';
    } else if (activeSeg.family === 'confusion') {
      const hrDynamic = 78 + Math.round(Math.cos(state.currentTimeSec * 2) * 4);
      el.liveHRReadout.textContent = `${hrDynamic} bpm`;
      el.liveClickReadout.textContent = 'Click: Hint Request';
    } else if (activeSeg.family === 'boredom') {
      const hrDynamic = 62 + Math.round(Math.sin(state.currentTimeSec * 1.5) * 3);
      el.liveHRReadout.textContent = `${hrDynamic} bpm (Low)`;
      el.liveClickReadout.textContent = 'Idle (No Clicks)';
    } else {
      const hrDynamic = 72 + Math.round(Math.sin(state.currentTimeSec * 1.8) * 3);
      el.liveHRReadout.textContent = `${hrDynamic} bpm (Optimal)`;
      el.liveClickReadout.textContent = 'Click: Step Input';
    }
  }
  
  // Animated simulated cursor on screen workspace
  if (state.isPlaying) {
    const curX = 48 + Math.sin(state.currentTimeSec * 1.6) * 18;
    const curY = 56 + Math.cos(state.currentTimeSec * 1.2) * 12;
    el.simCursor.style.left = `${curX}%`;
    el.simCursor.style.top = `${curY}%`;
  }
}

function seekToTime(seconds) {
  state.currentTimeSec = Math.max(0, Math.min(seconds, state.totalTimeSec));
  updatePlayheadPosition();
}

function togglePlayPause() {
  state.isPlaying = !state.isPlaying;
  
  if (state.isPlaying) {
    el.playIcon.className = 'ti ti-player-pause';
    el.btnPlayPause.title = 'Pause (Space)';
    
    const tickInterval = 50;
    state.timerInterval = setInterval(() => {
      let nextTime = state.currentTimeSec + (tickInterval / 1000) * state.playbackSpeed;
      
      const session = SESSIONS[state.activeSessionId];
      const activeSeg = session.segments.find(s => s.id === state.selectedSegmentId);
      
      if (state.isLooping && activeSeg && nextTime >= activeSeg.endSec) {
        nextTime = activeSeg.startSec;
      } else if (nextTime >= state.totalTimeSec) {
        nextTime = 0;
        togglePlayPause();
      }
      
      seekToTime(nextTime);
      
      if (activeSeg && (nextTime < activeSeg.startSec || nextTime > activeSeg.endSec)) {
        const matched = session.segments.find(s => nextTime >= s.startSec && nextTime <= s.endSec);
        if (matched) selectSegment(matched.id);
      }
    }, tickInterval);
  } else {
    el.playIcon.className = 'ti ti-player-play';
    el.btnPlayPause.title = 'Play (Space)';
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }
}

el.btnPlayPause.addEventListener('click', togglePlayPause);
el.btnStepBack.addEventListener('click', () => seekToTime(state.currentTimeSec - 0.05));
el.btnStepForward.addEventListener('click', () => seekToTime(state.currentTimeSec + 0.05));

el.speedBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    el.speedBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.playbackSpeed = parseFloat(btn.dataset.speed);
  });
});

el.btnLoopSegment.addEventListener('click', () => {
  state.isLooping = !state.isLooping;
  el.btnLoopSegment.style.backgroundColor = state.isLooping ? 'var(--accent-tint)' : '';
  el.btnLoopSegment.style.color = state.isLooping ? 'var(--accent-text)' : '';
  showToast(state.isLooping ? 'Looping active segment' : 'Loop disabled');
});

// ---------------------------------------------------------------------------
// 8. Accept / Correct Validation Controls
// ---------------------------------------------------------------------------
el.btnAccept.addEventListener('click', () => {
  const session = SESSIONS[state.activeSessionId];
  const seg = session.segments.find(s => s.id === state.selectedSegmentId);
  if (!seg) return;
  
  seg.reviewed = true;
  seg.userDecision = 'accepted';
  
  renderTimelineSegments();
  updateDetailPanel();
  showToast(`Accepted classification for ${seg.code}: ${seg.constructName}`);
});

el.btnCorrect.addEventListener('click', () => {
  const session = SESSIONS[state.activeSessionId];
  const seg = session.segments.find(s => s.id === state.selectedSegmentId);
  if (!seg) return;
  
  el.modalSegName.textContent = `${seg.code} (${seg.startStr} — ${seg.endStr})`;
  el.correctionRationale.value = '';
  
  el.reclassifyOptions.innerHTML = '';
  RUBRIC_TAXONOMY.forEach(tax => {
    const isCurrent = tax.name === seg.constructName;
    const opt = document.createElement('div');
    opt.className = `reclassify-opt ${isCurrent ? 'selected' : ''}`;
    opt.dataset.constructId = tax.id;
    
    let dotClass = 'dot-engagement';
    if (tax.family === 'confusion') dotClass = 'dot-confusion';
    if (tax.family === 'boredom') dotClass = 'dot-boredom';
    if (tax.family === 'frustration') dotClass = 'dot-frustration';
    
    opt.innerHTML = `
      <div class="reclassify-opt-left">
        <span class="chip-dot ${dotClass}"></span>
        <span>${tax.name}</span>
      </div>
      <span class="chip-code mono">${tax.code}</span>
    `;
    
    opt.addEventListener('click', () => {
      el.reclassifyOptions.querySelectorAll('.reclassify-opt').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
    
    el.reclassifyOptions.appendChild(opt);
  });
  
  el.modalCorrect.showModal();
});

el.btnCloseCorrect.addEventListener('click', () => el.modalCorrect.close());
el.btnCancelCorrect.addEventListener('click', () => el.modalCorrect.close());

el.btnSaveCorrection.addEventListener('click', () => {
  const selectedOpt = el.reclassifyOptions.querySelector('.reclassify-opt.selected');
  if (!selectedOpt) return;
  
  const constructId = selectedOpt.dataset.constructId;
  const tax = RUBRIC_TAXONOMY.find(t => t.id === constructId);
  if (!tax) return;
  
  const session = SESSIONS[state.activeSessionId];
  const seg = session.segments.find(s => s.id === state.selectedSegmentId);
  if (!seg) return;
  
  seg.constructName = tax.name;
  seg.constructId = tax.id;
  seg.family = tax.family;
  seg.reviewed = true;
  seg.userDecision = 'corrected';
  
  const rationale = el.correctionRationale.value.trim();
  if (rationale) {
    seg.justification = `[Researcher Corrected] ${rationale}`;
  }
  
  renderTimelineSegments();
  updateDetailPanel();
  el.modalCorrect.close();
  showToast(`Reclassified ${seg.code} as "${tax.name}"`, 'ti-check');
});

// Shortcuts Modal
el.btnShortcuts.addEventListener('click', () => el.modalShortcuts.showModal());
el.btnCloseShortcuts.addEventListener('click', () => el.modalShortcuts.close());

// Export Functionality
el.btnExport.addEventListener('click', () => {
  const session = SESSIONS[state.activeSessionId];
  const exportPayload = {
    sessionId: session.id,
    study: session.cohort,
    streams: session.streams,
    exportedAt: new Date().toISOString(),
    segments: session.segments
  };
  
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${session.id}_multimodal_annotations.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast(`Exported ${session.segments.length} segment annotations (.json)`, 'ti-download');
});

// ---------------------------------------------------------------------------
// 9. Keyboard Shortcuts
// ---------------------------------------------------------------------------
window.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  
  if (e.key === '1') switchPage('page1');
  else if (e.key === '2') switchPage('page2');
  else if (e.code === 'Space') {
    e.preventDefault();
    if (state.activePage === 'page2') togglePlayPause();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (state.activePage === 'page2') seekToTime(state.currentTimeSec - 0.05);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    if (state.activePage === 'page2') seekToTime(state.currentTimeSec + 0.05);
  } else if (e.key === 'a' || e.key === 'A') {
    if (state.activePage === 'page2') el.btnAccept.click();
  } else if (e.key === 'c' || e.key === 'C') {
    if (state.activePage === 'page2') el.btnCorrect.click();
  } else if (e.key === 'l' || e.key === 'L') {
    if (state.activePage === 'page2') el.btnLoopSegment.click();
  } else if (e.key === '?') {
    el.modalShortcuts.showModal();
  }
});

// ---------------------------------------------------------------------------
// 10. Precision Custom Teal Dot Cursor Controller
// ---------------------------------------------------------------------------
function initCustomCursor() {
  const cursorEl = document.getElementById('custom-cursor');
  if (!cursorEl) return;
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorEl.classList.add('visible');
    
    // Direct transform for immediate crisp tracking
    cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });
  
  window.addEventListener('mousedown', () => cursorEl.classList.add('active'));
  window.addEventListener('mouseup', () => cursorEl.classList.remove('active'));
  
  document.addEventListener('mouseleave', () => cursorEl.classList.remove('visible'));
  document.addEventListener('mouseenter', () => cursorEl.classList.add('visible'));
  
  // Interactive element hover detection
  const interactiveSelectors = 'a, button, input, textarea, select, [role="button"], [role="slider"], [role="option"], [role="tab"], .rubric-chip, .state-segment, .stream-slot-card, .session-card, .transport-btn, .speed-btn, .overlay-toggle, .btn-close, .key-hint';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      cursorEl.classList.add('hovering');
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      cursorEl.classList.remove('hovering');
    }
  });
}

// ---------------------------------------------------------------------------
// 11. Initialization
// ---------------------------------------------------------------------------
function init() {
  renderRubricChips();
  renderTimelineSegments();
  renderClickMarkers();
  updateDetailPanel();
  updatePlayheadPosition();
  initCustomCursor();
}

init();

