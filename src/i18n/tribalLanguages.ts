import { TranslationSchema, translations } from './translations';

const enBase = translations.en.translation;
const hiBase = translations.hi.translation;

function createResource(base: TranslationSchema, overrides: Partial<TranslationSchema>): TranslationSchema {
  return {
    ...base,
    ...overrides,
    roles: { ...base.roles, ...(overrides.roles || {}) },
    nav: { ...base.nav, ...(overrides.nav || {}) },
    subjects: { ...base.subjects, ...(overrides.subjects || {}) },
    urgency: { ...base.urgency, ...(overrides.urgency || {}) },
    assessment: { ...base.assessment, ...(overrides.assessment || {}) },
    gaps: { ...base.gaps, ...(overrides.gaps || {}) },
    planner: { ...base.planner, ...(overrides.planner || {}) },
    printable: { ...base.printable, ...(overrides.printable || {}) },
    dashboard: { ...base.dashboard, ...(overrides.dashboard || {}) },
    dpdp: { ...base.dpdp, ...(overrides.dpdp || {}) },
    common: { ...base.common, ...(overrides.common || {}) },
  };
}

// -----------------------------------------------------------------------------
// 1. SANTHALI (ᱥᱟᱱᱛᱟᱲᱤ / संथाली - Largest Tribal Language of India)
// -----------------------------------------------------------------------------
export const satTranslation: TranslationSchema = createResource(hiBase, {
  appName: 'ᱞᱟᱨᱱ-ᱜᱮᱯ ᱮᱟᱭ (LearnGap AI)',
  appTagline: 'ᱪᱮᱫᱚᱜ ᱠᱟᱛᱷᱟ ᱠᱷᱚᱱ ᱪᱟᱱᱟᱪ ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ (Adivasi FLN)',
  appSubtitle: 'ᱥᱟᱱᱛᱟᱲᱤ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱵᱩᱱᱤᱭᱟᱹᱫᱤ ᱥᱮᱪᱮᱫ ᱜᱚᱲᱚ',
  competitionBadge: 'IIT Bombay Techfest (ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱴᱚᱴᱷᱟ)',
  schoolName: 'ᱟᱹᱛᱩ ᱵᱩᱱᱤᱭᱟᱹᱫᱤ ᱟᱥᱲᱟ (Adivasi ZP School)',
  schoolSub: 'NIPUN Bharat & Adivasi FLN Remedial Engine',
  schoolLocation: 'Ahilyanagar & Santhal Pargana',
  offlineMode: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮᱰᱤ',
  onlineMode: 'ᱚᱱᱞᱟᱭᱤᱱ ᱟᱨ ᱥᱤᱝᱠ',
  syncing: 'ᱥᱤᱝᱠᱚᱜ ᱠᱟᱱᱟ...',
  selectLanguage: 'ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ (Language)',
  allLanguages: 'ᱡᱚᱛᱚ ᱯᱟᱹᱨᱥᱤ',
  regionalCategory: 'ᱢᱩᱬᱩᱛ ᱴᱚᱴᱷᱟ ᱯᱟᱹᱨᱥᱤ',
  tribalCategory: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱨᱥᱤ',
  searchLanguages: 'ᱯᱟᱹᱨᱥᱤ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ...',
  roles: {
    teacher: 'ᱪᱟᱱᱟᱪ ᱢᱟᱪᱮᱛ (Class Teacher)',
    head_teacher: 'ᱢᱟᱨᱟᱝ ᱢᱟᱪᱮᱛ (Headmaster)',
    block_officer: 'ᱵᱞᱚᱠ ᱥᱮᱪᱮᱫ ᱟᱹᱢᱟᱹᱞᱤᱭᱟᱹ (BEO)'
  },
  nav: {
    assessment: '᱑. ᱡᱚᱠᱷᱟ ᱠᱟᱛᱷᱟ (Assessment)',
    gapAnalysis: '᱒. ᱜᱮᱯ ᱤᱧᱡᱤᱱ (Gap Engine)',
    remedialPlan: '᱓. ᱥᱩᱫᱷᱟᱹᱨ ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ (Remedial Plan)',
    dashboard: '᱔. ᱞᱟᱦᱟᱱᱛᱤ ᱰᱮᱥᱵᱳᱨᱰ (Progress)',
    dpdp: '᱕. DPDP ᱜᱚᱯᱚᱱᱤᱭᱟᱹ (Privacy)'
  },
  subjects: {
    all: 'ᱡᱚᱛᱚ ᱥᱟᱛᱟᱢ (All Subjects)',
    numeracy: 'ᱞᱮᱠᱷᱟ ᱥᱮᱪᱮᱫ (Numeracy)',
    literacy: 'ᱨᱚᱲ ᱟᱨ ᱚᱞ (Literacy)'
  },
  urgency: {
    high: 'ᱞᱚᱜᱚᱱ ᱜᱚᱲᱚ ᱞᱟᱹᱠᱛᱤ',
    moderate: 'ᱛᱟᱞᱟᱢᱟᱞᱟ ᱜᱚᱲᱚ',
    mastered: 'ᱥᱮᱪᱮᱫ ᱯᱩᱨᱟᱹᱣ',
    highUrgency: 'ᱩᱥᱟᱹᱨᱟ ᱞᱟᱹᱠᱛᱤ',
    moderatePriority: 'ᱛᱟᱞᱟ ᱞᱟᱹᱠᱛᱤ'
  },
  assessment: {
    title: 'ᱡᱚᱠᱷᱟ ᱠᱟᱛᱷᱟ ᱥᱟᱢᱵᱽᱲᱟᱣ (Assessment Data)',
    subtitle: 'ᱢᱟᱨᱠ ᱚᱞ ᱢᱮ ᱥᱮ CSV ᱯᱷᱟᱭᱤᱞ ᱟᱯᱞᱚᱰ ᱢᱮ᱾ ᱡᱚᱛᱚ ᱯᱷᱚᱱ ᱨᱮᱜᱮ ᱛ جانᱪᱚᱜᱼᱟ᱾',
    manualEntry: 'ᱞᱚᱜᱚᱱ ᱮᱱᱴᱨᱤ (Manual)',
    csvUpload: 'CSV ᱯᱷᱟᱭᱤᱞ ᱟᱯᱞᱚᱰ',
    downloadSample: 'ᱥᱮᱢᱯᱩᱞ CSV ᱰᱟᱣᱩᱱᱞᱳᱰ',
    studentAlias: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ (ᱨᱳᱞ ᱮᱞ ᱟᱨ ᱧᱩᱛᱩᱢ)',
    selectCompetency: 'ᱪᱮᱫᱚᱜ ᱫᱟᱲᱮ / ᱦᱩᱱᱟᱹᱨ',
    asmtType: 'ᱡᱚᱠᱷᱟ ᱨᱮᱱᱟᱜ ᱞᱮᱠᱟᱱ',
    baseline: 'ᱯᱩᱭᱞᱩ ᱡᱚᱠᱷᱟ (Baseline)',
    followup: 'ᱫᱚᱥᱟᱨ ᱡᱚᱠᱷᱟ (Follow-up)',
    scoreObtained: 'ᱧᱟᱢ ᱟᱠᱟᱱ ᱢᱟᱨᱠ',
    totalMarks: 'ᱢᱩᱴᱷ ᱢᱟᱨᱠ',
    calculatedPct: 'ᱞᱮᱠᱷᱟ ᱥᱟᱭᱠᱚᱲᱟ:',
    gapFlagged: 'ᱪᱮᱫᱚᱜ ᱜᱮᱯ ᱧᱟᱢᱮᱱᱟ',
    mastered: 'ᱦᱩᱱᱟᱹᱨ ᱯᱩᱨᱟᱹᱣ',
    saveRecord: 'ᱥᱟᱧᱪᱟᱣ ᱢᱮ',
    savedSuccess: 'ᱠᱟᱛᱷᱟ ᱯᱷᱚᱱ ᱨᱮ ᱥᱟᱧᱪᱟᱣ ᱮᱱᱟ! ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮᱦᱚᱸ ᱠᱟᱹᱢᱤ ᱦᱩᱭᱩᱜᱼᱟ᱾',
    validationError: 'ᱵᱟᱹᱲᱤᱡ ᱰᱮᱴᱟ ᱦᱩᱥᱤᱭᱟᱹᱨ',
    recentRecords: 'ᱪᱟᱱᱟᱪ ᱨᱮᱱᱟᱜ ᱱᱟᱣᱟ ᱨᱮᱠᱚᱨᱰ',
    totalRecords: 'ᱢᱩᱴᱷ ᱨᱮᱠᱚᱨᱰ:',
    filterByCompetency: 'ᱡᱚᱛᱚ ᱦᱩᱱᱟᱹᱨ',
    noRecords: 'ᱪᱮᱫ ᱨᱮᱠᱚᱨᱰ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾',
    tableRoll: 'ᱨᱳᱞ / ᱯᱟᱹᱴᱷᱩᱣᱟᱹ',
    tableComp: 'ᱦᱩᱱᱟᱹᱨ',
    tableType: 'ᱞᱮᱠᱟᱱ',
    tableScore: 'ᱢᱟᱨᱠ',
    tableStatus: 'ᱦᱟᱞᱚᱛ',
    tableAction: 'ᱠᱟᱹᱢᱤ'
  },
  gaps: {
    title: 'ᱪᱮᱫᱚᱜ ᱠᱟᱹᱢᱤ ᱜᱮᱯ ᱤᱧᱡᱤᱱ (Santhali Transparent Rule Engine)',
    subtitle: 'ᱥᱟᱯᱷᱟ ᱟᱨ ᱥᱚᱦᱚᱡᱽ ᱱᱤᱭᱚᱢ᱾ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱜᱤᱫᱽᱨᱟᱹ ᱞᱟᱹᱜᱤᱫ ᱢᱟᱪᱮᱛ ᱵᱟᱪᱷᱟᱣ ᱠᱟᱹᱢᱤ᱾',
    thresholdNote: 'NIPUN Bharat ᱞᱮᱠᱟᱛᱮ ᱯᱟᱥ ᱢᱟᱨᱠ ᱖᱐% ᱴᱷᱟᱹᱣᱠᱟᱹ ᱟᱠᱟᱱᱟ᱾',
    urgentRemediation: 'ᱞᱚᱜᱚᱱ ᱥᱩᱫᱷᱟᱹᱨ ᱞᱟᱹᱠᱛᱤ (< ᱔᱐%)',
    urgentSub: 'ᱢᱟᱨᱠ ᱟᱹᱰᱤ ᱠᱚᱢ ᱢᱮᱱᱟᱜᱼᱟ',
    moderateRemediation: 'ᱛᱟᱞᱟᱢᱟᱞᱟ ᱜᱚᱲᱚ (᱔᱐% - ᱕᱙%)',
    moderateSub: 'ᱢᱟᱨᱠ ᱥᱩᱨ ᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ',
    mastered: 'ᱦᱩᱱᱟᱹᱨ ᱯᱩᱨᱟᱹᱣ (᱖᱐%+)',
    masteredSub: 'ᱜᱤᱫᱽᱨᱟᱹ ᱱᱟᱯᱟᱭ ᱠᱚ ᱪᱮᱫ ᱠᱮᱫᱟ',
    rulesTitle: 'ᱥᱟᱯᱷᱟ ᱱᱤᱭᱚᱢ ᱢᱟᱱᱚᱠ:',
    rulesBody: '᱖᱐% ᱠᱷᱚᱱ ᱠᱚᱢ ᱧᱟᱢ ᱟᱠᱟᱫ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱢᱤᱫ ᱥᱟᱶ ᱦᱟᱹᱴᱤᱧ ᱠᱟᱛᱮ ᱪᱮᱫᱚᱜ ᱠᱟᱹᱢᱤ ᱦᱩᱭᱩᱜᱼᱟ᱾',
    clustersTitle: 'ᱪᱤᱱᱦᱟᱹᱣ ᱟᱠᱟᱱ ᱜᱮᱯ ᱜᱩᱴ',
    studentsCount: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱜᱚᱲᱚ ᱞᱟᱹᱠᱛᱤ',
    targetPct: 'ᱴᱟᱨᱜᱮᱴ:',
    createPlanBtn: 'ᱱᱚᱣᱟ ᱜᱩᱴ ᱞᱟᱹᱜᱤᱫ ᱯᱞᱟᱱ ᱵᱮᱱᱟᱣ ᱢᱮ',
    noGapsMessage: 'ᱪᱟᱱᱟᱪ ᱨᱮ ᱡᱟᱦᱟᱸᱱ ᱜᱮᱯ ᱵᱟᱹᱱᱩᱜᱼᱟ! ᱡᱚᱛᱚ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱯᱟᱥ ᱮᱱᱟ᱾',
    suggestedActivityLabel: 'ᱥᱩᱡᱷᱟᱹᱣ ᱟᱠᱟᱱ ᱠᱟᱹᱢᱤ'
  },
  planner: {
    title: 'FLN ᱥᱩᱫᱷᱟᱹᱨ ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ (Remedial Action Planner)',
    subtitle: 'ᱢᱟᱪᱮᱛ ᱦᱚᱛᱮᱛᱮ ᱠᱟᱹᱢᱤ ᱯᱞᱟᱱ ᱵᱮᱱᱟᱣ, ᱪᱷᱟᱯᱟ ᱟᱨ ᱥᱮᱭᱟᱨ ᱢᱮ᱾',
    exportPdf: 'ᱯᱞᱟᱱ ᱪᱷᱟᱯᱟ / PDF',
    shareWhatsApp: 'ᱣᱟᱴᱥᱮᱯ ᱨᱮ ᱥᱮᱭᱟᱨ',
    step1Title: '᱑. ᱦᱩᱱᱟᱹᱨ ᱟᱨ ᱠᱟᱹᱢᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
    step2Title: '᱒. ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱞᱤᱥᱴ ᱥᱟᱹᱨᱤ ᱢᱮ',
    step3Title: '᱓. ᱚᱠᱛᱚ ᱟᱨ ᱱᱳᱴ',
    selectCompLabel: 'ᱴᱟᱨᱜᱮᱴ ᱦᱩᱱᱟᱹᱨ:',
    selectActivityLabel: 'ᱢᱟᱪᱮᱛ ᱵᱟᱪᱷᱟᱣ ᱠᱟᱹᱢᱤ:',
    activityDuration: 'ᱚᱠᱛᱚ:',
    minutes: 'ᱴᱤᱲᱤᱡ',
    materialsRequired: 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱡᱤᱱᱤᱥ:',
    pedagogicalReason: 'ᱪᱮᱫᱚᱜ ᱨᱮᱱᱟᱜ ᱠᱟᱨᱚᱱ:',
    scheduleForWeek: 'ᱦᱟᱯᱛᱟ ᱨᱮᱱᱟᱜ ᱚᱠᱛᱚ:',
    schedulePlaceholder: 'ᱡᱮᱞᱮᱠᱟ: ᱥᱚᱢᱵᱟᱨ ᱟᱨ ᱵᱩᱫᱷᱵᱟᱨ - ᱥᱮᱛᱟᱜ ᱑᱐:᱓᱐',
    teacherNotesLabel: 'ᱢᱟᱪᱮᱛᱟᱜ ᱱᱳᱴ:',
    teacherNotesPlaceholder: 'ᱪᱟᱱᱟᱪ ᱞᱮᱠᱟᱛᱮ ᱱᱳᱴ ᱚᱞ ᱢᱮ...',
    teacherReview: 'ᱢᱟᱪᱮᱛ ᱧᱮᱞ ᱟᱨ ᱦᱮᱸ ᱥᱟᱹᱨᱤ',
    approveNotice: 'ᱱᱚᱣᱟ ᱯᱞᱟᱱ ᱪᱟᱱᱟᱪ ᱢᱟᱪᱮᱛ ᱦᱚᱛᱮᱛᱮ ᱧᱮᱞ ᱟᱨ ᱯᱟᱥ ᱟᱠᱟᱱᱟ᱾',
    ethicsNoticeTitle: 'ᱱᱟᱯᱟᱭ AI ᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱨᱩᱠᱷᱤᱭᱟᱹ:',
    ethicsNoticeBody: 'ᱱᱚᱣᱟ ᱫᱚ ᱯᱩᱨᱟᱹᱯᱩᱨᱤ ᱢᱟᱪᱮᱛᱟᱜ ᱛᱤ ᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ᱾',
    approvePlanBtn: 'ᱯᱞᱟᱱ ᱦᱮᱸ ᱥᱟᱹᱨᱤ ᱟᱨ ᱥᱟᱧᱪᱟᱣ ᱢᱮ',
    planApproved: 'ᱯᱞᱟᱱ ᱦᱮᱸ ᱥᱟᱹᱨᱤ ᱮᱱᱟ',
    previewBanner: 'ᱚᱯᱷᱤᱥᱤᱭᱟᱞ ᱪᱷᱟᱯᱟ ᱯᱨᱤᱵᱷᱤᱣ',
    previewSub: 'ᱱᱚᱣᱟ ᱯᱷᱚᱨᱢᱮᱴ ᱪᱷᱟᱯᱟ ᱠᱟᱛᱮ ᱪᱟᱱᱟᱪ ᱨᱮ ᱠᱟᱹᱢᱤ ᱨᱮ ᱞᱟᱜᱟᱣᱜᱼᱟ᱾',
    loadSavedPlan: 'ᱥᱟᱧᱪᱟᱣ ᱟᱠᱟᱱ ᱯᱞᱟᱱ ᱠᱷᱩᱞᱟᱹᱭ ᱢᱮ:',
    createNewPlan: '-- ᱱᱟᱣᱟ ᱯᱞᱟᱱ ᱵᱮᱱᱟᱣ ᱢᱮ --',
    targetStudentsLabel: 'ᱴᱟᱨᱜᱮᱴ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ',
    planApprovedSuccess: 'ᱠᱟᱹᱢᱤ ᱯᱞᱟᱱ ᱱᱟᱯᱟᱭ ᱛᱮ ᱥᱟᱧᱪᱟᱣ ᱮᱱᱟ!'
  },
  printable: {
    officialHeading: 'ᱟᱹᱛᱩ ᱵᱩᱱᱤᱭᱟᱹᱫᱤ ᱟᱥᱲᱟ (SANTHALI TRIBAL PRIMARY SCHOOL)',
    planSubtitle: 'NIPUN Bharat Adivasi FLN Action Plan',
    competitionHeader: 'IIT Bombay Techfest',
    udiseCode: 'UDISE: 27260501234',
    gradeSectionLabel: 'ᱪᱟᱱᱟᱪ:',
    gradeSectionVal: 'ᱪᱟᱱᱟᱪ ᱖ (ᱛᱷᱚᱠ ᱮ)',
    subjectLabel: 'ᱥᱟᱛᱟᱢ:',
    scheduleLabel: 'ᱚᱠᱛᱚ:',
    statusLabel: 'ᱦᱟᱞᱚᱛ:',
    statusApproved: 'ᱢᱟᱪᱮᱛ ᱦᱚᱛᱮᱛᱮ ᱦᱮᱸ ᱥᱟᱹᱨᱤ',
    statusDraft: 'ᱠᱟᱪᱟ ᱰᱨᱟᱯᱷᱴ',
    targetCompHeading: 'ᱴᱟᱨᱜᱮᱴ ᱦᱩᱱᱟᱹᱨ',
    passThresholdLabel: 'ᱯᱟᱥ ᱢᱟᱨᱠ:',
    targetLearnersHeading: 'ᱜᱚᱲᱚ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ',
    tableRoll: 'ᱨᱳᱞ ᱮᱞ',
    tableLearner: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ',
    tableLevel: 'ᱞᱟᱹᱠᱛᱤ',
    tableConsent: 'ᱟᱭᱳ-ᱵᱟᱵᱟ ᱦᱮᱸ ᱥᱟᱹᱨᱤ',
    remedialNeeded: 'ᱥᱩᱫᱷᱟᱹᱨ ᱞᱟᱹᱠᱛᱤ',
    consentVerified: 'ᱦᱮᱸ ᱥᱟᱹᱨᱤ ᱮᱱᱟ',
    activityHeading: 'ᱥᱩᱫᱷᱟᱹᱨ ᱠᱟᱹᱢᱤ',
    procedureLabel: 'ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ:',
    materialsLabel: 'ᱡᱤᱱᱤᱥ:',
    reasoningLabel: 'ᱠᱟᱨᱚᱱ:',
    teacherNotesHeading: 'ᱢᱟᱪᱮᱛᱟᱜ ᱱᱳᱴ:',
    signOffTitle: 'ᱢᱟᱪᱮᱛᱟᱜ ᱥᱩᱦᱤ',
    signOffDeclaration: 'ᱤᱧ ᱱᱚᱣᱟ ᱯᱞᱟᱱ ᱧᱮᱞ ᱠᱮᱫᱟ ᱟᱨ FLN ᱞᱮᱠᱟᱛᱮ ᱴᱷᱤᱠ ᱜᱮᱭᱟ᱾',
    teacherSignatureLabel: 'ᱪᱟᱱᱟᱪ ᱢᱟᱪᱮᱛᱟᱜ ᱥᱩᱦᱤ',
    dateLabel: 'ᱢᱟᱹᱦᱤᱛ:'
  },
  dashboard: {
    title: 'FLN ᱥᱩᱫᱷᱟᱹᱨ ᱞᱟᱦᱟᱱᱛᱤ ᱰᱮᱥᱵᱳᱨᱰ',
    subtitle: 'ᱢᱟᱪᱮᱛ ᱟᱹᱭᱩᱨ ᱛᱮ ᱪᱮᱫᱚᱜ ᱞᱟᱦᱟᱱᱛᱤ ᱨᱮᱠᱚᱨᱰ',
    activeRoleLabel: 'ᱠᱟᱹᱢᱤ ᱨᱮ:',
    blockNotice: 'DPDP ᱞᱮᱠᱟᱛᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚᱣᱟᱜ ᱩᱯᱨᱩᱢ ᱫᱩᱜ ᱫᱚᱦᱚ ᱢᱮᱱᱟᱜᱼᱟ᱾',
    overallCoverage: 'ᱡᱚᱠᱷᱟ ᱠᱚᱵᱷᱟᱨᱮᱡ',
    coverageTarget: 'ᱴᱟᱨᱜᱮᱴ > ᱙᱐%',
    coverageSub: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚᱣᱟᱜ ᱨᱮᱠᱚᱨᱰ ᱚᱞ ᱮᱱᱟ',
    baselinePassAvg: 'ᱯᱩᱭᱞᱩ ᱯᱟᱥ ᱮᱵᱷᱨᱮᱡ',
    baselineSub: 'ᱥᱩᱫᱷᱟᱹᱨ ᱞᱟᱦᱟ ᱨᱮ',
    followupPassAvg: 'ᱫᱚᱥᱟᱨ ᱯᱟᱥ ᱮᱵᱷᱨᱮᱡ',
    gainBadge: 'ᱞᱟᱦᱟᱱᱛᱤ',
    followupSub: 'ᱠᱟᱹᱢᱤ ᱛᱟᱭᱚᱢ ᱱᱟᱣᱟ ᱮᱵᱷᱨᱮᱡ',
    actionOnGaps: 'ᱯᱞᱟᱱ ᱵᱮᱱᱟᱣ ᱫᱚᱨ',
    actionTargetMet: 'ᱴᱟᱨᱜᱮᱴ ᱯᱩᱨᱟᱹᱣ (>= ᱘᱐%)',
    actionSub: 'ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱ ᱠᱟᱹᱢᱤ ᱯᱞᱟᱱ',
    gapRecoverySummary: 'ᱦᱩᱱᱟᱹᱨ ᱞᱮᱠᱟᱛᱮ ᱞᱟᱦᱟᱱᱛᱤ ᱨᱤᱯᱳᱨᱴ',
    summarySub: 'ᱠᱟᱹᱢᱤ ᱛᱟᱭᱚᱢ ᱚᱨᱡᱚ ᱨᱮᱱᱟᱜ ᱥᱚᱡᱷᱮ ᱛᱩᱞᱟᱹᱡᱚᱠᱷᱟ᱾',
    legendBaseline: 'ᱯᱩᱭᱞᱩ ᱡᱚᱠᱷᱟ (Baseline)',
    legendFollowup: 'ᱫᱚᱥᱟᱨ ᱡᱚᱠᱷᱟ (Follow-up)',
    tableComp: 'ᱦᱩᱱᱟᱹᱨ',
    tableThreshold: 'ᱢᱟᱱᱚᱠ',
    tableBaselinePass: 'ᱯᱩᱭᱞᱩ %',
    tableFollowupPass: 'ᱫᱚᱥᱟᱨ %',
    tableNetGain: 'ᱞᱟᱦᱟᱱᱛᱤ',
    tableRecovered: 'ᱥᱩᱫᱷᱟᱹᱨ ᱮᱱᱟ',
    tableRemaining: 'ᱵᱟᱹᱠᱤ ᱢᱮᱱᱟᱜᱼᱟ',
    inProgressNotice: 'ᱥᱩᱫᱷᱟᱹᱨ ᱠᱟᱹᱢᱤ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ',
    recoveredBadge: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱞᱟᱦᱟᱭᱮᱱᱟ',
    persistentBadge: 'ᱫᱚᱥᱟᱨ ᱫᱷᱟᱣ ᱞᱟᱹᱠᱛᱤ',
    noneBadge: 'ᱪᱮᱫ ᱵᱟᱹᱱᱩᱜᱼᱟ',
    insightHeading: 'ᱱᱤᱯᱩᱱ ᱵᱷᱟᱨᱚᱛ ᱥᱩᱫᱷᱟᱹᱨ ᱚᱨᱡᱚ',
    insightBody: 'LearnGap AI ᱜᱚᱲᱚ ᱛᱮ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱛᱟᱞᱟ ᱨᱮ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱞᱟᱦᱟᱱᱛᱤ ᱧᱮᱞ ᱟᱠᱟᱱᱟ᱾',
    overallStudentsRecord: 'ᱡᱚᱛᱚ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱞᱟᱦᱟᱱᱛᱤ ᱨᱮᱠᱚᱨᱰ',
    individualStudentRecord: 'ᱢᱤᱫᱴᱟᱝ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱨᱮᱠᱚᱨᱰ',
    teacherCommandCenter: 'ᱪᱟᱱᱟᱪ ᱢᱟᱪᱮᱛ ᱠᱚᱢᱟᱱᱰ ᱥᱮᱱᱴᱟᱨ',
    headTeacherDashboard: 'ᱢᱟᱨᱟᱝ ᱢᱟᱪᱮᱛ ᱧᱮᱞ-ᱛᱚᱫᱟᱨᱚᱠ ᱰᱮᱥᱵᱳᱨᱰ',
    selectClass: 'ᱪᱟᱱᱟᱪ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:',
    inspectScope: 'ᱧᱮᱞ ᱴᱚᱴᱷᱟ:',
    allClasses: 'ᱡᱚᱛᱚ ᱪᱟᱱᱟᱪ',
    editMarks: '+ ᱢᱟᱨᱠ ᱥᱩᱫᱷᱟᱹᱨ',
    openRemedialPlan: 'ᱠᱟᱹᱢᱤ ᱯᱞᱟᱱ ᱠᱷᱩᱞᱟᱹᱭ ᱢᱮ'
  },
  dpdp: {
    title: 'DPDP ᱟᱹᱭᱤᱱ ᱒᱐᱒᱓ ᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱨᱩᱠᱷᱤᱭᱟᱹ',
    subtitle: 'ᱰᱤᱡᱤᱴᱟᱞ ᱱᱤᱡᱮᱨᱟᱜ ᱰᱮᱴᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱹᱭᱤᱱ ᱒᱐᱒᱓ ᱞᱮᱠᱟᱛᱮ',
    dataMinimization: 'ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱰᱮᱴᱟ ᱫᱚᱦᱚ',
    dataMinimizationDesc: 'ᱠᱷᱟᱹᱞᱤ ᱨᱳᱞ ᱮᱞ, ᱪᱟᱱᱟᱪ ᱟᱨ ᱢᱟᱨᱠ ᱜᱮ ᱥᱟᱧᱪᱟᱣᱜᱼᱟ᱾',
    purposeLimitation: 'ᱥᱩᱢᱩᱝ ᱥᱮᱪᱮᱫ ᱞᱟᱹᱜᱤᱫ',
    purposeLimitationDesc: 'ᱱᱚᱣᱟ ᱰᱮᱴᱟ ᱠᱷᱟᱹᱞᱤ ᱥᱮᱪᱮᱫ ᱥᱩᱫᱷᱟᱹᱨ ᱞᱟᱹᱜᱤᱫ ᱜᱮ ᱵᱮᱵᱷᱟᱨᱚᱜᱼᱟ᱾',
    parentalConsent: 'ᱟᱭᱳ-ᱵᱟᱵᱟ ᱦᱮᱸ ᱥᱟᱹᱨᱤ (ᱫᱷᱟᱨᱟ ᱙)',
    parentalConsentDesc: 'ᱥᱩᱫᱷᱟᱹᱨ ᱠᱟᱹᱢᱤ ᱞᱟᱦᱟ ᱨᱮ ᱟᱭᱳ-ᱵᱟᱵᱟ ᱴᱷᱮᱱ ᱠᱷᱚᱱ ᱦᱮᱸ ᱥᱟᱹᱨᱤ ᱦᱟᱛᱟᱣᱜᱼᱟ᱾',
    syntheticDemo: 'ᱰᱮᱢᱚ ᱰᱮᱴᱟ (Synthetic Data)',
    syntheticDemoDesc: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚᱣᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱞᱟᱹᱜᱤᱫ ᱱᱚᱣᱟ ᱰᱮᱢᱚ ᱨᱮ ᱟᱸᱫᱟᱡ ᱰᱮᱴᱟ ᱵᱮᱵᱷᱟᱨ ᱟᱠᱟᱱᱟ᱾',
    consentRegisterTitle: 'ᱟᱭᱳ-ᱵᱟᱵᱟ ᱦᱮᱸ ᱥᱟᱹᱨᱤ ᱠᱷᱟᱛᱟ',
    consentTarget: '᱑᱐᱐% ᱴᱟᱨᱜᱮᱴ',
    consentVerifiedBadge: 'ᱦᱮᱸ ᱥᱟᱹᱨᱤ ᱮᱱᱟ',
    consentPendingBadge: 'ᱵᱟᱹᱠᱤ ᱢᱮᱱᱟᱜᱼᱟ',
    closeBtn: 'ᱵᱚᱸᱫᱽ ᱢᱮ'
  },
  common: {
    rollPrefix: 'ᱨᱳᱞ ᱮᱞ',
    studentPrefix: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ',
    offlineBanner: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱢᱳᱰ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜᱼᱟ᱾ ᱤᱱᱴᱟᱨᱱᱮᱴ ᱵᱟᱹᱱᱩᱜ ᱨᱮᱦᱚᱸ ᱠᱟᱹᱢᱤ ᱪᱟᱞᱟᱜᱼᱟ᱾',
    deleteTitle: 'ᱜᱮᱫ ᱜᱤᱰᱤ',
    classLabel: 'ᱪᱟᱱᱟᱪ',
    allClasses: 'ᱡᱚᱛᱚ ᱪᱟᱱᱟᱪ',
    installApp: 'ᱮᱯ ᱤᱱᱥᱴᱚᱞ ᱢᱮ',
    appReady: 'ᱮᱯ ᱨᱮᱰᱤ ᱢᱮᱱᱟᱜᱼᱟ'
  }
});

// -----------------------------------------------------------------------------
// 2. GONDI (गोंडी / Gōndi - Central Indian Tribal Language)
// -----------------------------------------------------------------------------
export const gonTranslation: TranslationSchema = createResource(hiBase, {
  appName: 'लर्न-गैप एआई (LearnGap AI Gondi)',
  appTagline: 'करीके बातुन ककसा काम योजना (Gondi Tribal Decision Tool)',
  appSubtitle: 'गोंडी आदिवासी बुनियादी करीके सहायता प्रणाली',
  competitionBadge: 'आईआईटी बॉम्बे टेकफेस्ट (गोंडवाना)',
  schoolName: 'गोंडवाना आदिवासी प्राथमिक शाला',
  schoolSub: 'निपुण भारत व गोंडी आदिवासी उपचारात्मक शिक्षण',
  schoolLocation: 'कोया पुनेम, मध्य भारत',
  offlineMode: 'ऑफलाइन तैयार बा',
  onlineMode: 'ऑनलाइन अउर सिंक बा',
  syncing: 'सिंक होत बा...',
  selectLanguage: 'गोष्टी बाछा (Language)',
  allLanguages: 'सब्बो गोष्टी',
  regionalCategory: 'बड़ा इलाका गोष्टी',
  tribalCategory: 'आदिवासी गोष्टी',
  searchLanguages: 'गोष्टी सोधा...',
  roles: {
    teacher: 'ककसा गुरुजी (Class Teacher)',
    head_teacher: 'बडा गुरुजी (Headmaster)',
    block_officer: 'ब्लाक शिक्षा अधिकारी (BEO)'
  },
  nav: {
    assessment: '१. नाप-जोख डेटा (Assessment)',
    gapAnalysis: '२. कमी शोध इंजन (Gap Engine)',
    remedialPlan: '३. सुधार काम योजना (Plan)',
    dashboard: '४. तरक्की डैशबोर्ड (Progress)',
    dpdp: '५. डीपीडीपी गोपनीयता (DPDP)'
  },
  subjects: {
    all: 'सब्बो विषय',
    numeracy: 'गिनती करीके (Numeracy)',
    literacy: 'बोली अउर लिखाई (Literacy)'
  },
  urgency: {
    high: 'तुरते मदद चाहि',
    moderate: 'मझोला मदद',
    mastered: 'सीख लेत',
    highUrgency: 'पहिल काम',
    moderatePriority: 'मझोला काम'
  },
  assessment: {
    title: 'नाप-जोख डेटा प्रबंधक (Gondi Assessment)',
    subtitle: 'नंबर लिखा या CSV फाइल चढावा। फोन मा सब जांच होए।',
    manualEntry: 'हाथ से लिखा (Manual)',
    csvUpload: 'CSV फाइल चढावा',
    downloadSample: 'नमूना CSV लेवा',
    studentAlias: 'चेला (रोल नंबर अउर नाव)',
    selectCompetency: 'सीखने के गुण / दक्षता',
    asmtType: 'नाप-जोख के किसिम',
    baseline: 'पहिली जांच (Baseline)',
    followup: 'दोसरी जांच (Follow-up)',
    scoreObtained: 'मिले नंबर',
    totalMarks: 'सब्बो नंबर',
    calculatedPct: 'हिसाब लगायल टका:',
    gapFlagged: 'कमी देखायल बा',
    mastered: 'सीख लेत',
    saveRecord: 'बचावा (Save)',
    savedSuccess: 'डेटा फोन मा बच गयल! बिना नेट काम करी।',
    validationError: 'डेटा जांच मा गड़बड़ी',
    recentRecords: 'ककसा के नवा रिकॉर्ड',
    totalRecords: 'सब्बो रिकॉर्ड:',
    filterByCompetency: 'सब्बो गुण',
    noRecords: 'कौनो रिकॉर्ड नइखे।',
    tableRoll: 'रोल / चेला',
    tableComp: 'गुण',
    tableType: 'किसिम',
    tableScore: 'नंबर',
    tableStatus: 'हाल',
    tableAction: 'काम'
  },
  gaps: {
    title: 'कमी शोध इंजन (Gondi Rule Engine)',
    subtitle: 'सच्चा नियम। गुरुजी के जांचल काम ही AI बतावे।',
    thresholdNote: 'निपुण भारत नियम से ६०% नंबर जरूरी बा।',
    urgentRemediation: 'तुरते सुधार चाहि (< ४०%)',
    urgentSub: 'नंबर बहुत कम बा',
    moderateRemediation: 'थोड़ा मदद चाहि (४०% - ५९%)',
    moderateSub: 'नंबर पास होए के पास बा',
    mastered: 'सीख लेत (६०%+)',
    masteredSub: 'चेला लोग बढ़िया सीख गयल',
    rulesTitle: 'सच्चा नियम कानून:',
    rulesBody: '६०% से कम नंबर पावे वाला लइका लोगन के एक टोली मा रख के पढ़ावल जाई।',
    clustersTitle: 'पहचानल गयल कमी टोली',
    studentsCount: 'लइका लोगन के मदद चाहि',
    targetPct: 'लक्ष्य:',
    createPlanBtn: 'ई टोली खातिर योजना बनावा',
    noGapsMessage: 'ई ककसा मा कौनो कमी नइखे! सब्बो लइका पास बा।',
    suggestedActivityLabel: 'सुझावल सुधार काम'
  },
  planner: {
    title: 'गोंडी उपचारात्मक काम योजना',
    subtitle: 'गुरुजी के देख-रेख मा योजना बनावा, छापा अउर शेयर करा।',
    exportPdf: 'योजना छापा / PDF',
    shareWhatsApp: 'व्हाट्सएप मा भेजा',
    step1Title: '१. गुण अउर काम बाछा',
    step2Title: '२. लइका सूची देखा',
    step3Title: '३. समय अउर लिखाई',
    selectCompLabel: 'लक्ष्य गुण:',
    selectActivityLabel: 'गुरुजी के जांचल काम:',
    activityDuration: 'समय:',
    minutes: 'मिनट',
    materialsRequired: 'जरूरी सामान:',
    pedagogicalReason: 'सिखावे के कारण:',
    scheduleForWeek: 'हफ्ता के समय:',
    schedulePlaceholder: 'जैसे: सोमार अउर बुध - बिहान ۱۰:३०',
    teacherNotesLabel: 'गुरुजी के खास बात:',
    teacherNotesPlaceholder: 'ककसा अनुसार खास बात लिखा...',
    teacherReview: 'गुरुजी के जांच अउर मंजूरी',
    approveNotice: 'ई योजना ककसा गुरुजी द्वारा मंजूर बा।',
    ethicsNoticeTitle: 'सच्चा AI अउर लइका सुरक्षा:',
    ethicsNoticeBody: 'ई पूरा काम गुरुजी के हाथ मा बा।',
    approvePlanBtn: 'योजना मंजूर करा अउर बचावा',
    planApproved: 'योजना मंजूर हो गयल',
    previewBanner: 'सरकारी छपाई देखावा',
    previewSub: 'ई कागज छाप के ककसा मा काम आवेला।',
    loadSavedPlan: 'बचावल योजना खोला:',
    createNewPlan: '-- नवा योजना बनावा --',
    targetStudentsLabel: 'लक्ष्य चेला',
    planApprovedSuccess: 'काम योजना बढ़िया से बच गयल!'
  },
  printable: {
    officialHeading: 'गोंडवाना आदिवासी प्राथमिक शाला (GONDI TRIBAL SCHOOL)',
    planSubtitle: 'निपुण भारत आदिवासी उपचारात्मक कार्य योजना',
    competitionHeader: 'आईआईटी बॉम्बे टेकफेस्ट',
    udiseCode: 'UDISE: 27260501234',
    gradeSectionLabel: 'ककसा:',
    gradeSectionVal: 'ककसा ६ (तुकड़ी अ)',
    subjectLabel: 'विषय:',
    scheduleLabel: 'समय:',
    statusLabel: 'हाल:',
    statusApproved: 'गुरुजी द्वारा मंजूर',
    statusDraft: 'कच्चा',
    targetCompHeading: 'लक्ष्य गुण',
    passThresholdLabel: 'पास नंबर:',
    targetLearnersHeading: 'मदद चाहे वाला चेला',
    tableRoll: 'रोल नंबर',
    tableLearner: 'चेला',
    tableLevel: 'जरूरत',
    tableConsent: 'दाई-दादा मंजूरी',
    remedialNeeded: 'सुधार चाहि',
    consentVerified: 'मंजूर बा',
    activityHeading: 'सुधार काम',
    procedureLabel: 'काम के तरीका:',
    materialsLabel: 'सामान:',
    reasoningLabel: 'कारण:',
    teacherNotesHeading: 'गुरुजी के बात:',
    signOffTitle: 'गुरुजी के दस्तखत',
    signOffDeclaration: 'हम ई योजना देख लेली, ई नियम अनुसार ठीक बा।',
    teacherSignatureLabel: 'ककसा गुरुजी के दस्तखत',
    dateLabel: 'तारीख:'
  },
  dashboard: {
    title: 'FLN सुधार तरक्की डैशबोर्ड',
    subtitle: 'गुरुजी के अवाई मा लइका लोगन के तरक्की',
    activeRoleLabel: 'काम मा:',
    blockNotice: 'DPDP नियम से लइका लोगन के नाव सुरक्षित बा।',
    overallCoverage: 'नाप-जोख कवरेज',
    coverageTarget: 'लक्ष्य > ९०%',
    coverageSub: 'लइका लोगन के नाम दर्ज बा',
    baselinePassAvg: 'पहिली पास औसत',
    baselineSub: 'सुधार से पहिले',
    followupPassAvg: 'दोसरी पास औसत',
    gainBadge: 'बढ़ोतरी',
    followupSub: 'काम के बाद नवा औसत',
    actionOnGaps: 'योजना बने के दर',
    actionTargetMet: 'लक्ष्य पूरा (>= ८०%)',
    actionSub: 'बनावल गुरुजी योजना',
    gapRecoverySummary: 'गुण अनुसार सुधार रिपोर्ट',
    summarySub: 'काम के बाद के नतीजा सीधा देखा।',
    legendBaseline: 'पहिली जांच (Baseline)',
    legendFollowup: 'दोसरी जांच (Follow-up)',
    tableComp: 'गुण',
    tableThreshold: 'नियम',
    tableBaselinePass: 'पहिली %',
    tableFollowupPass: 'दोसरी %',
    tableNetGain: 'बढ़ोतरी',
    tableRecovered: 'सुधर गयल',
    tableRemaining: 'बाकी बा',
    inProgressNotice: 'सुधार पढ़ाई चलत बा',
    recoveredBadge: 'लइका सुधर गयल',
    persistentBadge: 'दोबारा चाहि',
    noneBadge: 'कौनो ना',
    insightHeading: 'निपुण भारत गोंडी सुधार नतीजा',
    insightBody: 'LearnGap AI से पढ़ाई करावला के बाद लइका लोग बहुत बढ़िया सीखत बा।',
    overallStudentsRecord: 'सब्बो चेला तरक्की रिकॉर्ड',
    individualStudentRecord: 'एक चेला रिकॉर्ड',
    teacherCommandCenter: 'ककसा गुरुजी कमान्ड सेंटर',
    headTeacherDashboard: 'बडा गुरुजी स्कूल डैशबोर्ड',
    selectClass: 'ककसा बाछा:',
    inspectScope: 'देखे के दायरा:',
    allClasses: 'सब्बो ककसा',
    editMarks: '+ नंबर सुधारा',
    openRemedialPlan: 'काम योजना खोला'
  },
  dpdp: {
    title: 'DPDP कानून २०२३ अउर लइका सुरक्षा',
    subtitle: 'डिजिटल डेटा सुरक्षा नियम अनुसार',
    dataMinimization: 'कम से कम डेटा राखब',
    dataMinimizationDesc: 'खाली रोल नंबर, ककसा अउर नंबर राखल जाला।',
    purposeLimitation: 'खाली पढ़ाई खातिर',
    purposeLimitationDesc: 'ई डेटा खाली पढ़ावे सुधारे खातिर बा।',
    parentalConsent: 'दाई-दादा मंजूरी (धारा ९)',
    parentalConsentDesc: 'पढ़ावे से पहिले घर के मंजूरी लिहल जाला।',
    syntheticDemo: 'नमूना डेटा (Demo)',
    syntheticDemoDesc: 'लइका लोगन के सुरक्षा खातिर नकली डेटा बा।',
    consentRegisterTitle: 'मंजूरी खाता',
    consentTarget: '۱००% मंजूरी लक्ष्य',
    consentVerifiedBadge: 'मंजूर बा',
    consentPendingBadge: 'बाकी बा',
    closeBtn: 'बंद करा'
  },
  common: {
    rollPrefix: 'रोल नंबर',
    studentPrefix: 'चेला',
    offlineBanner: 'ऑफलाइन मोड चालू बा। बिना नेट भी सब डेटा फोन मा सुरक्षित बा।',
    deleteTitle: 'हटाओ',
    classLabel: 'ककसा',
    allClasses: 'सब्बो ककसा',
    installApp: 'ऐप लगावा',
    appReady: 'ऐप तैयार बा'
  }
});

// -----------------------------------------------------------------------------
// 3. BHILI (भीली / Bhili - Western India Adivasi Belt)
// -----------------------------------------------------------------------------
export const bhiTranslation: TranslationSchema = createResource(hiBase, {
  appName: 'लर्न-गैप एआई (LearnGap AI Bhili)',
  appTagline: 'सिखवा नी वात थी क्लास नी काम योजना (Bhili Tribal FLN)',
  appSubtitle: 'भीली आदिवासी बुनियादी भणतर निर्णय प्रणाली',
  competitionBadge: 'आईआईटी बॉम्बे टेकफेस्ट (भील प्रदेश)',
  schoolName: 'भील सेवा मंडल प्राथमिक शाला',
  schoolSub: 'निपुण भारत आदिवासी FLN उपचारात्मक शिक्षण',
  schoolLocation: 'भील प्रदेश (गुजरात-महा-एमपी-राज)',
  offlineMode: 'ऑफलाइन तैयार छे',
  onlineMode: 'ऑनलाइन अने सिंक छे',
  syncing: 'सिंक थाय छे...',
  selectLanguage: 'भाषा पसंद करो (Language)',
  allLanguages: 'बधी भाषाओ',
  regionalCategory: 'मुख्य भाषाओ',
  tribalCategory: 'आदिवासी बोली',
  searchLanguages: 'भाषा शोधो...',
  roles: {
    teacher: 'वर्ग गुरुजी (Teacher)',
    head_teacher: 'मोटा गुरुजी (Headmaster)',
    block_officer: 'तालुका शिक्षा अधिकारी (BEO)'
  },
  nav: {
    assessment: '१. मूल्यांकन डेटा (Assessment)',
    gapAnalysis: '२. गैप शोध इंजन (Gap Engine)',
    remedialPlan: '३. सुधार काम योजना (Plan)',
    dashboard: '૪. प्रगति डैशबोर्ड (Progress)',
    dpdp: '૫. डीपीडीपी गोपनीयता (DPDP)'
  },
  subjects: {
    all: 'बधा विषय',
    numeracy: 'गणित (अंक ज्ञान)',
    literacy: 'भाषा (वांचन-लेखन)'
  },
  urgency: {
    high: 'तुरंत मदद जोईए',
    moderate: 'थोड़ी मदद',
    mastered: 'आवी गयुं',
    highUrgency: 'पहलो नंबर',
    moderatePriority: 'वचेट'
  },
  assessment: {
    ...hiBase.assessment,
    title: 'मूल्यांकन डेटा प्रबंधक (Bhili FLN)',
    subtitle: 'नंबर नाखो अने CSV फाइल चढावो। फोन मां बधी तपास थाय छे।',
    studentAlias: 'भणाविया (रोल नंबर अने नाम)',
    tableRoll: 'रोल / भणाविया'
  },
  gaps: {
    ...hiBase.gaps,
    title: 'भीली गैप इंजन (Transparent Bhili FLN)',
    subtitle: 'साचा नियम। गुरुजी ना तपास्या पछी ज काम बतावे छे।'
  },
  planner: {
    ...hiBase.planner,
    title: 'भीली उपचारात्मक काम योजना',
    subtitle: 'गुरुजी नी देखरेख मां योजना बनावो अने छापो।'
  },
  printable: {
    ...hiBase.printable,
    officialHeading: 'भील सेवा मंडल प्राथमिक शाला (BHILI TRIBAL SCHOOL)',
    planSubtitle: 'निपुण भारत भीली आदिवासी उपचारात्मक कार्य योजना',
    gradeSectionVal: 'कक्षा ६ (वर्ग अ)',
    tableLearner: 'भणाविया'
  },
  dashboard: {
    ...hiBase.dashboard,
    title: 'भीली FLN सुधार प्रगति डैशबोर्ड',
    subtitle: 'गुरुजी द्वारा लरनिंग गैप सुधार अने परिणाम'
  },
  dpdp: { ...hiBase.dpdp },
  common: {
    rollPrefix: 'रोल नं.',
    studentPrefix: 'भणाविया',
    offlineBanner: 'ऑफलाइन मोड चालू छे। बिना नेट पण डेटा फोन मां सुरक्षित छे।',
    deleteTitle: 'काढी नाखो',
    classLabel: 'कक्षा',
    allClasses: 'बधी कक्षाओ',
    installApp: 'ऐप नाखो',
    appReady: 'ऐप तैयार छे'
  }
});

// -----------------------------------------------------------------------------
// 4. KURUKH (कुडुख़ / Kurukh / Oraon Tribal Language)
// -----------------------------------------------------------------------------
export const kruTranslation: TranslationSchema = createResource(hiBase, {
  appName: 'लर्न-गैप एआई (LearnGap AI Kurukh)',
  appTagline: 'पढ़ना-सिखना डेटा ती ककसा काम योजना (Oraon FLN)',
  appSubtitle: 'कुडुख़ आदिवासी बुनियादी शिक्षा सहायता प्रणाली',
  competitionBadge: 'IIT Bombay Techfest (Oraon Edition)',
  schoolName: 'कुडुख़ आदिवासी प्राथमिक शाला',
  schoolSub: 'निपुण भारत FLN कुडुख़ उपचारात्मक शिक्षण',
  schoolLocation: 'छोटानागपुर एवं सरगुजा',
  roles: {
    teacher: 'ककसा गुरुजी (Teacher)',
    head_teacher: 'बड़ा गुरुजी (Headmaster)',
    block_officer: 'प्रखंड शिक्षा अधिकारी (BEO)'
  },
  subjects: {
    all: 'हुर्मि विषय (All Subjects)',
    numeracy: 'गिनती (Numeracy)',
    literacy: 'कत्था-पढ़ना (Literacy)'
  },
  common: {
    rollPrefix: 'रोल नं.',
    studentPrefix: 'पढ़ुआ (विद्यार्थी)',
    offlineBanner: 'ऑफलाइन मोड चालू रही। बिना नेट डेटा सुरक्षित रही।',
    deleteTitle: 'मिटावा',
    classLabel: 'ककसा',
    allClasses: 'हुर्मि ककसा',
    installApp: 'ऐप चढ़ावा',
    appReady: 'ऐप तैयार रही'
  }
});

// -----------------------------------------------------------------------------
// 5. HO (ᱦᱳ / हो - Kolhan Belt Indigenous Language)
// -----------------------------------------------------------------------------
export const hocTranslation: TranslationSchema = createResource(hiBase, {
  appName: 'ᱞᱟᱨᱱ-ᱜᱮᱯ ᱮᱟᱭ (LearnGap AI Ho)',
  appTagline: 'ᱤᱛᱩᱱ ᱠᱟᱛᱷᱟ ᱛᱮ ᱪᱟᱱᱟᱪ ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ (Ho Tribal FLN)',
  appSubtitle: 'ᱦᱳ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱵᱩᱱᱤᱭᱟᱹᱫᱤ ᱥᱮᱪᱮᱫ ᱜᱚᱲᱚ',
  competitionBadge: 'IIT Bombay Techfest (Kolhan Ho Belt)',
  schoolName: 'ᱠᱚᱞᱦᱟᱱ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱟᱥᱲᱟ (Ho Tribal Primary School)',
  schoolSub: 'NIPUN Bharat & Ho Indigenous FLN Engine',
  schoolLocation: 'Kolhan Belt, Jharkhand & Odisha',
  roles: {
    teacher: 'ᱪᱟᱱᱟᱪ ᱢᱟᱪᱮᱛ (Class Teacher)',
    head_teacher: 'ᱢᱟᱨᱟᱝ ᱢᱟᱪᱮᱛ (Headmaster)',
    block_officer: 'ᱵᱞᱚᱠ ᱥᱮᱪᱮᱫ ᱟᱹᱢᱟᱹᱞᱤᱭᱟᱹ (BEO)'
  },
  subjects: {
    all: 'ᱡᱚᱛᱚ ᱥᱟᱛᱟᱢ (All Subjects)',
    numeracy: 'ᱞᱮᱠᱷᱟ ᱥᱮᱪᱮᱫ (Numeracy)',
    literacy: 'ᱡᱟᱜᱟᱨ ᱟᱨ ᱚᱞ (Literacy)'
  },
  common: {
    rollPrefix: 'ᱨᱳᱞ ᱱᱚ.',
    studentPrefix: 'ᱤᱛᱩᱱᱤᱭᱟᱹ (Learner)',
    offlineBanner: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱢᱳᱰ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜᱼᱟ᱾ ᱯᱷᱚᱱ ᱨᱮ ᱰᱮᱴᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱮᱱᱟᱜᱼᱟ᱾',
    deleteTitle: 'ᱜᱮᱫ ᱜᱤᱰᱤ',
    classLabel: 'ᱪᱟᱱᱟᱪ',
    allClasses: 'ᱡᱚᱛᱚ ᱪᱟᱱᱟᱪ',
    installApp: 'ᱮᱯ ᱤᱱᱥᱴᱚᱞ ᱢᱮ',
    appReady: 'ᱮᱯ ᱨᱮᱰᱤ ᱢᱮᱱᱟᱜᱼᱟ'
  }
});

// -----------------------------------------------------------------------------
// 6. MUNDARI (मुण्डारी / Mundari - Munda Tribe of Chota Nagpur)
// -----------------------------------------------------------------------------
export const unrTranslation: TranslationSchema = createResource(hiBase, {
  appName: 'लर्न-गैप एआई (LearnGap AI Mundari)',
  appTagline: 'इतुन कजी ते ककसा काम योजना (Mundari Tribal FLN)',
  appSubtitle: 'मुण्डारी आदिवासी बुनियादी शिक्षा सहायता प्रणाली',
  competitionBadge: 'IIT Bombay Techfest (Mundari Chota Nagpur)',
  schoolName: 'मुण्डा आदिवासी प्राथमिक शाला',
  schoolSub: 'निपुण भारत FLN मुण्डारी उपचारात्मक शिक्षण',
  schoolLocation: 'खूंटी एवं राँची, छोटानागपुर',
  roles: {
    teacher: 'ककसा गुरुजी (Teacher)',
    head_teacher: 'मरांग गुरुजी (Headmaster)',
    block_officer: 'प्रखंड शिक्षा अधिकारी (BEO)'
  },
  subjects: {
    all: 'सबेन विषय (All Subjects)',
    numeracy: 'लेखा (Numeracy)',
    literacy: 'जगर अउर ओल (Literacy)'
  },
  common: {
    rollPrefix: 'रोल नं.',
    studentPrefix: 'पढ़ुआ (Mundari Learner)',
    offlineBanner: 'ऑफलाइन मोड चालू मेनाः। फोन रे डेटा सुरक्षित मेनाः।',
    deleteTitle: 'मिटावा',
    classLabel: 'ककसा',
    allClasses: 'सबेन ककसा',
    installApp: 'ऐप लगावा',
    appReady: 'ऐप तैयार मेनाः'
  }
});

// -----------------------------------------------------------------------------
// 7. BODO (बड़ो / Bodo - Bodoland Assam Indigenous Language)
// -----------------------------------------------------------------------------
export const brxTranslation: TranslationSchema = createResource(hiBase, {
  appName: 'लर्न-गेप एआइ (LearnGap AI Bodo)',
  appTagline: 'आनजाद खारिथि निफ्राय थाखो खथा हाबाफारि (Bodo FLN)',
  appSubtitle: 'बड़ो बिजों गुदि सोलोंथाय थिरांथा-मदद राहा',
  competitionBadge: 'IIT Bombay Techfest (Bodoland Assam)',
  schoolName: 'बड़ो गुदि सोलोंसालि (Bodo Primary School)',
  schoolSub: 'निपुण भारत आरो FLN फाहामथाय सोलोंथाय',
  schoolLocation: 'कोकराझार, बोडोल्याण्ड, आसाम',
  roles: {
    teacher: 'थाखो फोरोंगिरि (Class Teacher)',
    head_teacher: 'गाहाय फोरोंगिरि (Headmaster)',
    block_officer: 'ब्लोक सोलोंथाय बिफैनो (BEO)'
  },
  subjects: {
    all: 'गासै आयदा (All Subjects)',
    numeracy: 'सानखान्थि (Numeracy)',
    literacy: 'राव आरो लिरनाय (Literacy)'
  },
  common: {
    rollPrefix: 'र’ल नम्बर',
    studentPrefix: 'सोलोंगो (Learner)',
    offlineBanner: 'अफलाइन महਰ सालायबाय दं। डाटाया फोनाव रैखाथि जाना दं।',
    deleteTitle: 'बोखार',
    classLabel: 'थाखो',
    allClasses: 'गासै थाखो',
    installApp: 'एप्लिकेशन इनस्टल खालाम',
    appReady: 'एप्लिकेशन थियारि'
  }
});

// -----------------------------------------------------------------------------
// 8. KOKBOROK (ককবরক / Kokborok - Tripuri Indigenous Language)
// -----------------------------------------------------------------------------
export const trpTranslation: TranslationSchema = createResource(hiBase, {
  appName: 'লার্ন-গ্যাপ এআই (LearnGap AI Kokborok)',
  appTagline: 'রিমুং ডেটা তানি ক্লাস কাম পরিকল্পনা (Kokborok FLN)',
  appSubtitle: 'ককবরক আদিবাসী বুনিয়াদি শিক্ষা সাহায্য ব্যবস্থা',
  competitionBadge: 'IIT Bombay Techfest (Tripura Indigenous)',
  schoolName: 'ককবরক বুনিয়াদি বিদ্যালয় (Tripuri School)',
  schoolSub: 'নিপুণ ভারত ও ককবরক প্রতিকারমূলক শিক্ষা ব্যবস্থা',
  schoolLocation: 'ত্রিপুরা আদিবাসী স্বশাসিত এলাকা (TTAADC)',
  roles: {
    teacher: 'ক্লাস ফরুংনাই (Class Teacher)',
    head_teacher: 'প্রধান শিক্ষক (Headmaster)',
    block_officer: 'ব্লক শিক্ষা আধিকারিক (BEO)'
  },
  subjects: {
    all: 'জত বিষয় (All Subjects)',
    numeracy: 'লেখামুং (Numeracy)',
    literacy: 'ককবরক রিমুং (Literacy)'
  },
  common: {
    rollPrefix: 'রোল নং',
    studentPrefix: 'ফোরোংনাই (Learner)',
    offlineBanner: 'অফলাইন মোড চালু তংগো। ফোনো ডেটা সুরক্ষিত তংগো।',
    deleteTitle: 'মোছো',
    classLabel: 'ক্লাস',
    allClasses: 'জত ক্লাস',
    installApp: 'অ্যাপ ইনস্টল খিবো',
    appReady: 'অ্যাপ তৈরি তংগো'
  }
});

// -----------------------------------------------------------------------------
// 9. MIZO (Mizo ṭawng - Mizoram)
// -----------------------------------------------------------------------------
export const lusTranslation: TranslationSchema = createResource(enBase, {
  appName: 'LearnGap AI (Mizo ṭawng)',
  appTagline: 'Zirlai Tehna Data atanga Class Thawhhona Ruahmanna',
  appSubtitle: 'Bulthut Zirna Thutlukna Siam Puitu Khawl',
  competitionBadge: 'IIT Bombay Techfest (Mizoram Edition)',
  schoolName: 'Primary Sikul, Kopargaon & Mizoram',
  schoolSub: 'NIPUN Bharat & FLN Zirtirna Thutlukna Hmanraw Pui',
  schoolLocation: 'Aizawl & Kopargaon',
  roles: {
    teacher: 'Class Zirtirtu (Teacher)',
    head_teacher: 'Headmaster (CRC)',
    block_officer: 'Block Education Officer (BEO)'
  },
  subjects: {
    all: 'Subject Zawng Zawng',
    numeracy: 'Chhiarkawp (Numeracy)',
    literacy: 'Tawng Thiamna (Literacy)'
  },
  common: {
    rollPrefix: 'Roll No.',
    studentPrefix: 'Zirlai (Learner)',
    offlineBanner: 'Offline Mode a inhawng e. Data a him e.',
    deleteTitle: 'Nuaibo',
    classLabel: 'Class',
    allClasses: 'Class Zawng Zawng',
    installApp: 'App Install Rawh',
    appReady: 'App a inpeih e'
  }
});

// -----------------------------------------------------------------------------
// 10. KHASI (Ka Ktien Khasi - Meghalaya)
// -----------------------------------------------------------------------------
export const khaTranslation: TranslationSchema = createResource(enBase, {
  appName: 'LearnGap AI (Khasi)',
  appTagline: 'Na ka Jingtip Pule sha ka Jingpyntreikam ha Klas',
  appSubtitle: 'Ka Tieng Pynshai Jingmut ha ka Jinghikai',
  competitionBadge: 'IIT Bombay Techfest (Khasi Edition)',
  schoolName: 'Skul Primary, Kopargaon & Meghalaya',
  schoolSub: 'NIPUN Bharat & FLN Jinghikai Bakhmat',
  schoolLocation: 'Shillong & Kopargaon',
  roles: {
    teacher: 'Nonghikai Klas (Teacher)',
    head_teacher: 'Khlieh Nonghikai (Headmaster)',
    block_officer: 'Ophisar Pule Puthi (BEO)'
  },
  subjects: {
    all: 'Baroh ki Subject',
    numeracy: 'Khein Jingkhein (Numeracy)',
    literacy: 'Ktien bad Jingpule (Literacy)'
  },
  common: {
    rollPrefix: 'Roll No.',
    studentPrefix: 'Khynnah Pule (Learner)',
    offlineBanner: 'Offline Mode ka treikam. Ki data ki shngain.',
    deleteTitle: 'Pynduh',
    classLabel: 'Klas',
    allClasses: 'Baroh ki Klas',
    installApp: 'Buh App ha Phone',
    appReady: 'App la kloi'
  }
});

// -----------------------------------------------------------------------------
// 11. KORKU (कोर्कू / Korku - Melghat Maharashtra & Satpura MP)
// -----------------------------------------------------------------------------
export const korkuTranslation: TranslationSchema = createResource(hiBase, {
  appName: 'लर्न-गैप एआई (LearnGap AI Korku)',
  appTagline: 'पढ़ाई नाप-जोख से ककसा काम योजना (Korku FLN)',
  appSubtitle: 'कोर्कू आदिवासी बुनियादी शिक्षा सहायता प्रणाली',
  competitionBadge: 'IIT Bombay Techfest (Melghat Korku)',
  schoolName: 'मेळघाट आदिवासी प्राथमिक शाला (Korku School)',
  schoolSub: 'निपुण भारत व कोर्कू आदिवासी उपचारात्मक शिक्षण',
  schoolLocation: 'मेळघाट, धारणी (महाराष्ट्र) व सातपुड़ा',
  roles: {
    teacher: 'ककसा गुरुजी (Teacher)',
    head_teacher: 'मोटा गुरुजी (Headmaster)',
    block_officer: 'तालुका शिक्षा अधिकारी (BEO)'
  },
  subjects: {
    all: 'सब्बो विषय (All Subjects)',
    numeracy: 'गिनती (Numeracy)',
    literacy: 'कोर्कू बोली व लिखाई (Literacy)'
  },
  common: {
    rollPrefix: 'रोल नं.',
    studentPrefix: 'पढ़नया (Korku Learner)',
    offlineBanner: 'ऑफलाइन मोड चालू हे। फोन मा डेटा सुरक्षित हे।',
    deleteTitle: 'मिटावा',
    classLabel: 'ककसा',
    allClasses: 'सब्बो ककसा',
    installApp: 'ऐप लगावा',
    appReady: 'ऐप तैयार हे'
  }
});
