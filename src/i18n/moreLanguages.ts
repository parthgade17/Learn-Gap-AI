import { TranslationSchema, translations } from './translations';

/**
 * Builds localized dictionary for other regional and tribal languages
 * with authentic scripts, educational terms, and cultural context.
 */
function createLanguageResource(
  base: TranslationSchema,
  overrides: Partial<TranslationSchema>
): TranslationSchema {
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

const enBase = translations.en.translation;
const hiBase = translations.hi.translation;

// 4. GUJARATI (ગુજરાતી)
export const guTranslation = createLanguageResource(hiBase, {
  appName: 'લર્ન-ગેપ એઆઈ (LearnGap AI)',
  appTagline: 'મૂલ્યાંકન ડેટાથી વર્ગખંડ કાર્ય યોજના સુધી',
  appSubtitle: 'પાયાનું શિક્ષણ નિર્ણય-સહાય પ્રણાલી',
  competitionBadge: 'આઈઆઈટી બોમ્બે ટેકફેસ્ટ',
  schoolName: 'પ્રાથમિક શાળા, કોપરગાંવ',
  schoolSub: 'નિપુણ ભારત અને FLN ઉપચારાત્મક વર્ગ નિર્ણય પ્રણાલી',
  selectLanguage: 'ભાષા પસંદ કરો',
  offlineMode: 'ઓફલાઇન તૈયાર',
  onlineMode: 'ઓનલાઇન અને સિંક',
  roles: {
    teacher: 'વર્ગ શિક્ષક',
    head_teacher: 'આચાર્યશ્રી (CRC)',
    block_officer: 'તાલુકા શિક્ષણ અધિકારી (TPO)'
  },
  nav: {
    assessment: '૧. મૂલ્યાંકન ડેટા',
    gapAnalysis: '૨. લર્નિંગ ગેપ એન્જિન',
    remedialPlan: '૩. ઉપચારાત્મક કાર્ય યોજના',
    dashboard: '૪. પ્રગતિ ડેશબોર્ડ',
    dpdp: 'ડીપીડીપી ગોપનીયતા'
  },
  subjects: {
    all: 'બધા વિષયો',
    numeracy: 'ગણિત (સંખ્યાજ્ઞાન)',
    literacy: 'ભાષા (સાક્ષરતા)'
  },
  printable: {
    ...hiBase.printable,
    officialHeading: 'પ્રાથમિક શાળા, કોપરગાંવ',
    planSubtitle: 'નિપુણ ભારત / FLN ઉપચારાત્મક કાર્ય યોજના',
    gradeSectionVal: 'ધોરણ ૩ (વર્ગ અ)',
    statusApproved: 'શિક્ષક માન્ય',
    teacherSignatureLabel: 'પ્રણવ જાધવ (વર્ગ શિક્ષક)',
  },
  common: {
    rollPrefix: 'રોલ નં.',
    studentPrefix: 'વિદ્યાર્થી',
    offlineBanner: 'ઓફલાઇન મોડ ચાલુ છે. બધી માહિતી ફોનમાં સુરક્ષિત છે.',
    deleteTitle: 'ડિલીટ કરો'
  }
});

// 5. BENGALI (বাংলা)
export const bnTranslation = createLanguageResource(enBase, {
  appName: 'লার্ন-গ্যাপ এআই (LearnGap AI)',
  appTagline: 'মূল্যায়ন ডেটা থেকে ক্লাসরুম কর্ম পরিকল্পনা',
  appSubtitle: 'প্রাথমিক শিক্ষা সিদ্ধান্ত সহায়তা ব্যবস্থা',
  competitionBadge: 'আইআইটি বোম্বে টেকফেস্ট',
  schoolName: 'প্রাথমিক বিদ্যালয়, কোপারগাঁও',
  schoolSub: 'নিপুণ ভারত ও FLN প্রতিকারমূলক সিদ্ধান্ত ব্যবস্থা',
  selectLanguage: 'ভাষা নির্বাচন করুন',
  offlineMode: 'অফলাইন প্রস্তুত',
  onlineMode: 'অনলাইন ও সিঙ্কড',
  roles: {
    teacher: 'শ্রেণি শিক্ষক',
    head_teacher: 'প্রধান শিক্ষক (CRC)',
    block_officer: 'ব্লক শিক্ষা আধিকারিক (BEO)'
  },
  nav: {
    assessment: '১. মূল্যায়ন ডেটা',
    gapAnalysis: '২. লার্নিং গ্যাপ ইঞ্জিন',
    remedialPlan: '৩. প্রতিকারমূলক পরিকল্পনা',
    dashboard: '৪. অগ্রগতি ড্যাশবোর্ড',
    dpdp: 'DPDP গোপনীয়তা'
  },
  subjects: {
    all: 'সকল বিষয়',
    numeracy: 'গণিত (সংখ্যাজ্ঞান)',
    literacy: 'ভাষা (সাক্ষরতা)'
  },
  printable: {
    ...enBase.printable,
    officialHeading: 'প্রাথমিক বিদ্যালয়, কোপারগাঁও',
    planSubtitle: 'নিপুণ ভারত / FLN প্রতিকারমূলক কর্মপরিকল্পনা',
    gradeSectionVal: 'শ্রেণি ৩ (বিভাগ ক)',
    statusApproved: 'শিক্ষক অনুমোদিত',
    teacherSignatureLabel: 'প্রণব যাদব (শ্রেণি শিক্ষক)',
  },
  common: {
    rollPrefix: 'রোল নং',
    studentPrefix: 'শিক্ষার্থী',
    offlineBanner: 'অফলাইন মোড সক্রিয়। সমস্ত তথ্য ডিভাইসে সুরক্ষিত সংরক্ষিত হচ্ছে।',
    deleteTitle: 'মুছে ফেলুন'
  }
});

// 6. TAMIL (தமிழ்)
export const taTranslation = createLanguageResource(enBase, {
  appName: 'லேர்ன்கேப் AI (LearnGap AI)',
  appTagline: 'கற்றல் மதிப்பீட்டிலிருந்து வகுப்பறை செயல் திட்டம் வரை',
  appSubtitle: 'அடிப்படை கற்றல் முடிவு ஆதரவு அமைப்பு',
  competitionBadge: 'ஐஐடி பாம்பே டெக்ஃபெஸ்ட்',
  schoolName: 'தொடக்கப் பள்ளி, கோபர்கான்',
  schoolSub: 'நிபுண் பாரத் மற்றும் FLN தீர்வு வகுப்பறை திட்டம்',
  selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
  offlineMode: 'ஆஃப்லைன் தயார்',
  onlineMode: 'ஆன்லைன் & ஒத்திசைக்கப்பட்டது',
  roles: {
    teacher: 'வகுப்பு ஆசிரியர்',
    head_teacher: 'தலைமை ஆசிரியர் (CRC)',
    block_officer: 'வட்டாரக் கல்வி அலுவலர் (BEO)'
  },
  nav: {
    assessment: '1. மதிப்பீட்டுத் தரவு',
    gapAnalysis: '2. கற்றல் இடைவெளி இயந்திரம்',
    remedialPlan: '3. தீர்வு செயல் திட்டம்',
    dashboard: '4. முன்னேற்ற டாஷ்போர்டு',
    dpdp: 'DPDP தனியுரிமை'
  },
  subjects: {
    all: 'அனைத்து பாடங்கள்',
    numeracy: 'கணிதம் (எண்ணறிவு)',
    literacy: 'மொழி (எழுத்தறிவு)'
  },
  printable: {
    ...enBase.printable,
    officialHeading: 'தொடக்கப் பள்ளி, கோபர்கான்',
    planSubtitle: 'நிபுண் பாரத் FLN வகுப்பறை செயல் திட்டம்',
    gradeSectionVal: 'வகுப்பு 3 (பிரிவு அ)',
    statusApproved: 'ஆசிரியர் ஒப்புதல் அளிக்கப்பட்டது',
    teacherSignatureLabel: 'பிரணவ் ஜாதவ் (வகுப்பு ஆசிரியர்)',
  },
  common: {
    rollPrefix: 'வரிசை எண்',
    studentPrefix: 'மாணவர்',
    offlineBanner: 'ஆஃப்லைன் முறை செயலில் உள்ளது. சாதனத்தில் தரவு பாதுகாப்பாக உள்ளது.',
    deleteTitle: 'நீக்கு'
  }
});

// 7. TELUGU (తెలుగు)
export const teTranslation = createLanguageResource(enBase, {
  appName: 'లెర్న్‌గ్యాప్ AI (LearnGap AI)',
  appTagline: 'అభ్యాస డేటా నుండి తరగతి గది కార్యాచరణ ప్రణాళిక వరకు',
  appSubtitle: 'పునాది అభ్యాస నిర్ణయ మద్దతు వ్యవస్థ',
  competitionBadge: 'ఐఐటీ బాంబే టెక్ఫెస్ట్',
  schoolName: 'ప్రాథమిక పాఠశాల, కోపర్‌గావ్',
  schoolSub: 'నిపుణ్ భారత్ FLN తరగతి గది కార్యాచరణ సాధనం',
  selectLanguage: 'భాషను ఎంచుకోండి',
  offlineMode: 'ఆఫ్‌లైన్ సిద్ధం',
  onlineMode: 'ఆన్‌లైన్ & సమకాలీకరించబడింది',
  roles: {
    teacher: 'తరగతి ఉపాధ్యాయుడు',
    head_teacher: 'ప్రధానోపాధ్యాయుడు (CRC)',
    block_officer: 'మండల విద్యాధికారి (MEO)'
  },
  nav: {
    assessment: '1. అంచనా డేటా',
    gapAnalysis: '2. లెర్నింగ్ గ్యాప్ ఇంజిన్',
    remedialPlan: '3. నివారణ కార్యాచరణ ప్రణాళిక',
    dashboard: '4. పురోగతి డ్యాష్‌బోర్డ్',
    dpdp: 'DPDP గోప్యత'
  },
  subjects: {
    all: 'అన్ని సబ్జెక్టులు',
    numeracy: 'గణితం (సంఖ్యాజ్ఞానం)',
    literacy: 'భాష (సాక్షరత)'
  },
  printable: {
    ...enBase.printable,
    officialHeading: 'ప్రాథమిక పాఠశాల, కోపర్‌గావ్',
    planSubtitle: 'నిపుణ్ భారత్ FLN తరగతి గది ప్రణాళిక',
    gradeSectionVal: 'తరగతి 3 (విభాగం ఎ)',
    statusApproved: 'ఉపాధ్యాయుడు ఆమోదించారు',
    teacherSignatureLabel: 'ప్రణవ్ జాధవ్ (తరగతి ఉపాధ్యాయుడు)',
  },
  common: {
    rollPrefix: 'రోల్ నం.',
    studentPrefix: 'విద్యార్థి',
    offlineBanner: 'ఆఫ్‌లైన్ మోడ్ సక్రియంగా ఉంది. సమాచారం ఫోన్‌లో భద్రపరచబడింది.',
    deleteTitle: 'తొలగించు'
  }
});

// 8. SANTHALI (ᱥᱟᱱᱛᱟᱲᱤ / संथाली - Largest Tribal Language of India)
export const satTranslation = createLanguageResource(hiBase, {
  appName: 'ᱞᱟᱨᱱ-ᱜᱮᱯ ᱮᱟᱭ (LearnGap AI)',
  appTagline: 'ᱪᱮᱫᱚᱜ ᱠᱟᱛᱷᱟ ᱠᱷᱚᱱ ᱪᱟᱱᱟᱪ ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ (Adivasi FLN)',
  appSubtitle: 'ᱥᱟᱱᱛᱟᱲᱤ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱵᱩᱱᱤᱭᱟᱹᱫᱤ ᱥᱮᱪᱮᱫ ᱜᱚᱲᱚ',
  competitionBadge: 'IIT Bombay Techfest (ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱴᱚᱴᱷᱟ)',
  schoolName: 'ᱟᱹᱛᱩ ᱵᱩᱱᱤᱭᱟᱹᱫᱤ ᱟᱥᱲᱟ (Adivasi ZP School)',
  schoolSub: 'NIPUN Bharat & Adivasi FLN Remedial Engine',
  selectLanguage: 'ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ (Language)',
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
    dpdp: 'DPDP ᱜᱚᱯᱚᱱᱤᱭᱟᱹ (Privacy)'
  },
  subjects: {
    all: 'ᱡᱚᱛᱚ ᱥᱟᱛᱟᱢ (All Subjects)',
    numeracy: 'ᱞᱮᱠᱷᱟ ᱥᱮᱪᱮᱫ (Numeracy)',
    literacy: 'ᱨᱚᱲ ᱟᱨ ᱚᱞ (Literacy)'
  },
  gaps: {
    ...hiBase.gaps,
    title: 'ᱪᱮᱫᱚᱜ ᱠᱟᱹᱢᱤ ᱜᱮᱯ ᱤᱧᱡᱤᱱ (Santhali Transparent Rule Engine)',
    subtitle: 'ᱥᱟᱯᱷᱟ ᱟᱨ ᱥᱚᱦᱚᱡᱽ ᱱᱤᱭᱚᱢ᱾ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱜᱤᱫᱽᱨᱟᱹ ᱞᱟᱹᱜᱤᱫ ᱢᱟᱪᱮᱛ ᱵᱟᱪᱷᱟᱣ ᱠᱟᱹᱢᱤ᱾',
  },
  printable: {
    ...hiBase.printable,
    officialHeading: 'ᱟᱹᱛᱩ ᱵᱩᱱᱤᱭᱟᱹᱫᱤ ᱟᱥᱲᱟ (SANTHALI TRIBAL PRIMARY SCHOOL)',
    planSubtitle: 'NIPUN Bharat Adivasi FLN Action Plan',
    gradeSectionVal: 'ᱪᱟᱱᱟᱪ ᱓ (ᱛᱷᱚᱠ ᱮ)',
    statusApproved: 'ᱢᱟᱪᱮᱛ ᱦᱚᱛᱮᱛᱮ ᱦᱮᱸ ᱥᱟᱹᱨᱤ',
    teacherSignatureLabel: 'ᱯᱨᱚᱬᱚᱵᱽ ᱡᱟᱫᱷᱚᱵᱽ (ᱪᱟᱱᱟᱪ ᱢᱟᱪᱮᱛ)',
  },
  common: {
    rollPrefix: 'ᱨᱳᱞ ᱮᱞ',
    studentPrefix: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ',
    offlineBanner: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱢᱳᱰ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜᱼᱟ᱾ ᱤᱱᱴᱟᱨᱱᱮᱴ ᱵᱟᱹᱱᱩᱜ ᱨᱮᱦᱚᱸ ᱠᱟᱹᱢᱤ ᱪᱟᱞᱟᱜᱼᱟ᱾',
    deleteTitle: 'ᱜᱮᱫ ᱜᱤᱰᱤ'
  }
});

// 9. GONDI (गोंडी / Gōndi - Major Central Indian Tribal Language)
export const gonTranslation = createLanguageResource(hiBase, {
  appName: 'लर्न-गैप एआई (LearnGap AI Gondi)',
  appTagline: 'करीके बातुन ककसा काम योजना (Gondi Tribal Decision Tool)',
  appSubtitle: 'गोंडी आदिवासी बुनियादी करीके सहायता प्रणाली',
  competitionBadge: 'आईआईटी बॉम्बे टेकफेस्ट (गोंडवाना)',
  schoolName: 'गोंडवाना आदिवासी प्राथमिक शाला',
  schoolSub: 'निपुण भारत व गोंडी आदिवासी उपचारात्मक शिक्षण',
  selectLanguage: 'गोष्टी बाछा (Language)',
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
    dpdp: 'डीपीडीपी गोपनीयता (DPDP)'
  },
  subjects: {
    all: 'सब्बो विषय',
    numeracy: 'गिनती करीके (Numeracy)',
    literacy: 'बोली अउर लिखाई (Literacy)'
  },
  printable: {
    ...hiBase.printable,
    officialHeading: 'गोंडवाना आदिवासी प्राथमिक शाला (GONDI TRIBAL SCHOOL)',
    planSubtitle: 'निपुण भारत आदिवासी उपचारात्मक कार्य योजना',
    gradeSectionVal: 'कक्षा ३ (तुकड़ी अ)',
    statusApproved: 'गुरुजी द्वारा मंजूर',
    teacherSignatureLabel: 'प्रणव जाधव (ककसा गुरुजी)',
  },
  common: {
    rollPrefix: 'रोल नंबर',
    studentPrefix: 'चेला (विद्यार्थी)',
    offlineBanner: 'ऑफलाइन मोड चालू बा। बिना नेट भी सब डेटा फोन मा सुरक्षित बा।',
    deleteTitle: 'हटाओ'
  }
});

// 10. BHILI (भीली / Bhili - Western India Adivasi Belt)
export const bhiTranslation = createLanguageResource(hiBase, {
  appName: 'लर्न-गैप एआई (LearnGap AI Bhili)',
  appTagline: 'सिखवा नी वात थी क्लास नी काम योजना (Bhili Tribal FLN)',
  appSubtitle: 'भीली आदिवासी बुनियादी भणतर निर्णय प्रणाली',
  competitionBadge: 'आईआईटी बॉम्बे टेकफेस्ट (भील प्रदेश)',
  schoolName: 'आदिवासी प्राथमिक शाला (Bhili School)',
  schoolSub: 'निपुण भारत भीली आदिवासी उपचारात्मक भणतर',
  selectLanguage: 'बोली पसंद करो (Language)',
  roles: {
    teacher: 'क्लास मास्तर (Class Teacher)',
    head_teacher: 'मोटा मास्तर (Headmaster)',
    block_officer: 'तालुका शिक्षा अधिकारी (BEO)'
  },
  nav: {
    assessment: '१. मूल्यांकन नोंद (Assessment)',
    gapAnalysis: '२. कमी शोधो (Gap Engine)',
    remedialPlan: '३. सुधार योजना (Remedial Plan)',
    dashboard: '४. प्रगति डैशबोर्ड (Progress)',
    dpdp: 'डीपीडीपी सुरक्षा (Privacy)'
  },
  subjects: {
    all: 'बधा विषय',
    numeracy: 'गिनती भणतर (Numeracy)',
    literacy: 'बोली वांचन (Literacy)'
  },
  printable: {
    ...hiBase.printable,
    officialHeading: 'आदिवासी प्राथमिक शाला (BHILI TRIBAL PRIMARY SCHOOL)',
    planSubtitle: 'निपुण भारत भीली आदिवासी कार्य योजना',
    gradeSectionVal: 'वर्ग ३ (तुकडी अ)',
    statusApproved: 'मास्तर मान्य',
    teacherSignatureLabel: 'प्रणव जाधव (क्लास मास्तर)',
  },
  common: {
    rollPrefix: 'रोल नं.',
    studentPrefix: 'टाबर (विद्यार्थी)',
    offlineBanner: 'ऑफलाइन चालू छे। फोन मां बधो डेटा साचवी ने राख्यो छे।',
    deleteTitle: 'काढी नाखो'
  }
});

// 11. KURUKH (कुडुख़ / Oraon Tribal Language of Jharkhand/Odisha)
export const kruTranslation = createLanguageResource(hiBase, {
  appName: 'लर्न-गैप एआई (Kurukh Oraon FLN)',
  appTagline: 'पड़हा-लिखा ले क्लास कार्य योजना (Kurukh Tribal)',
  appSubtitle: 'कुडुख़ आदिवासी बुनियादी शिक्षा निर्णय प्रणाली',
  competitionBadge: 'IIT Bombay Techfest (कुडुख़)',
  schoolName: 'कुडुख़ आदिवासी प्राथमिक विद्यालय',
  schoolSub: 'निपुण भारत कुडुख़ उपचारात्मक शिक्षण प्रणाली',
  roles: {
    teacher: 'क्लास मास्टर (Class Teacher)',
    head_teacher: 'बड़ा मास्टर (Headmaster)',
    block_officer: 'प्रखंड शिक्षा पदाधिकारी (BEO)'
  },
  common: {
    rollPrefix: 'रोल नं.',
    studentPrefix: 'आलर (विद्यार्थी)',
    offlineBanner: 'ऑफलाइन मोड सक्रिय। नेट बिना भी डेटा फोन में सुरक्षित है।',
    deleteTitle: 'मिटाएं'
  }
});

// 12. BODO (बड़ो - 8th Schedule Tribal Language of Assam)
export const brxTranslation = createLanguageResource(enBase, {
  appName: 'लार्न-गेप एआई (LearnGap AI Bodo)',
  appTagline: 'रोंगौथि डेटा निफ्राय थाखो खथा हाबाफारि (Bodo FLN)',
  appSubtitle: 'बड़ो फरायसाफोरनि गुदि सोलोंथाय बिथांखि',
  competitionBadge: 'IIT Bombay Techfest (Bodoland)',
  schoolName: 'गुदि फरायसालि, कोपरगाव (Bodo Tribal School)',
  schoolSub: 'NIPUN Bharat & Bodo Foundational Learning Tool',
  roles: {
    teacher: 'थाखो फोरोंगिरि (Class Teacher)',
    head_teacher: 'गाहाय फोरोंगिरि (Headmaster)',
    block_officer: 'ब्लक सोलोंथाय बिफान (BEO)'
  },
  subjects: {
    all: 'गासै आयदा (All Subjects)',
    numeracy: 'सानखौ (Numeracy)',
    literacy: 'राव (Literacy)'
  },
  common: {
    rollPrefix: 'रोल नं',
    studentPrefix: 'फरायसा',
    offlineBanner: 'अफ़लाइन मड। नेट गैयाब्लाबो डेटा फोनआव रैखाथि दं।',
    deleteTitle: 'हुगार'
  }
});

// 13. KANNDA (ಕನ್ನಡ)
export const knTranslation = createLanguageResource(enBase, {
  appName: 'ಲರ್ನ್‌ಗ್ಯಾಪ್ AI (LearnGap AI)',
  appTagline: 'ಕಲಿಕಾ ಡೇಟಾದಿಂದ ತರಗತಿಯ ಕ್ರಿಯಾ ಯೋಜನೆಗೆ',
  appSubtitle: 'ಮೂಲ ಕಲಿಕಾ ನಿರ್ಧಾರ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆ',
  competitionBadge: 'ಐಐಟಿ ಬಾಂಬೆ ಟೆಕ್‌ಫೆಸ್ಟ್',
  schoolName: 'ಪ್ರಾಥಮಿಕ ಶಾಲೆ, ಕೊಪರ್‌ಗಾಂವ್',
  schoolSub: 'ನಿಪುಣ್ ಭಾರತ್ FLN ತರಗತಿ ಪರಿಹಾರ ಸಾಧನ',
  roles: {
    teacher: 'ತರಗತಿ ಶಿಕ್ಷಕರು',
    head_teacher: 'ಮುಖ್ಯ ಶಿಕ್ಷಕರು (CRC)',
    block_officer: 'ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿ (BEO)'
  },
  subjects: {
    all: 'ಎಲ್ಲಾ ವಿಷಯಗಳು',
    numeracy: 'ಗಣಿತ (ಸಂಖ್ಯಾಜ್ಞಾನ)',
    literacy: 'ಭಾಷೆ (ಸಾಕ್ಷರತೆ)'
  },
  common: {
    rollPrefix: 'ರೋಲ್ ನಂ.',
    studentPrefix: 'ವಿದ್ಯಾರ್ಥಿ',
    offlineBanner: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ. ಡೇಟಾ ಸುರಕ್ಷಿತವಾಗಿದೆ.',
    deleteTitle: 'ಅಳಿಸಿ'
  }
});

// 14. MALAYALAM (മലയാളം)
export const mlTranslation = createLanguageResource(enBase, {
  appName: 'ലേൺഗാപ്പ് AI (LearnGap AI)',
  appTagline: 'പഠന ഡാറ്റയിൽ നിന്ന് ക്ലാസ് റൂം പ്രവർത്തന പദ്ധതിയിലേക്ക്',
  appSubtitle: 'അടിസ്ഥാന പഠന തീരുമാന സഹായ സംവിധാനം',
  competitionBadge: 'ഐഐടി ബോംബെ ടെക്ഫെസ്റ്റ്',
  schoolName: 'പ്രൈമറി സ്കൂൾ, കോപ്പർഗാവ്',
  schoolSub: 'നിപുൺ ഭാരത് FLN ക്ലാസ് റൂം ആക്ഷൻ പ്ലാനർ',
  roles: {
    teacher: 'ക്ലാസ് ടീച്ചർ',
    head_teacher: 'പ്രധാനാധ്യാപകൻ (CRC)',
    block_officer: 'ബ്ലോക്ക് വിദ്യാഭ്യാസ ഓഫീസർ (AEO)'
  },
  subjects: {
    all: 'എല്ലാ വിഷയങ്ങളും',
    numeracy: 'ഗണിതം (സംഖ്യാജ്ഞാനം)',
    literacy: 'ഭാഷ (സാക്ഷരത)'
  },
  common: {
    rollPrefix: 'റോൾ നമ്പർ',
    studentPrefix: 'വിദ്യാർത്ഥി',
    offlineBanner: 'ഓഫ്‌ലൈൻ മോഡ് സജീവമാണ്. ഡാറ്റ ഫോണിൽ സുരക്ഷിതമാണ്.',
    deleteTitle: 'നീക്കം ചെയ്യുക'
  }
});

// 15. ODIA (ଓଡ଼ିଆ)
export const orTranslation = createLanguageResource(enBase, {
  appName: 'ଲର୍ନଗ୍ୟାପ୍ AI (LearnGap AI)',
  appTagline: 'ମୂଲ୍ୟାଙ୍କନ ତଥ୍ୟରୁ ଶ୍ରେଣୀଗୃହ କାର୍ଯ୍ୟ ଯୋଜନା',
  appSubtitle: 'ମୌଳିକ ଶିକ୍ଷା ନିଷ୍ପତ୍ତି ସହାୟତା ପ୍ରଣାଳୀ',
  competitionBadge: 'ଆଇଆଇଟି ବମ୍ବେ ଟେକଫେଷ୍ଟ',
  schoolName: 'ପ୍ରାଥମିକ ବିଦ୍ୟାଳୟ, କୋପରଗାଓଁ',
  schoolSub: 'ନିପୁଣ ଭାରତ FLN ପ୍ରତିକାରମୂଳକ ଶିକ୍ଷଣ ଯୋଜନା',
  roles: {
    teacher: 'ଶ୍ରେଣୀ ଶିକ୍ଷକ',
    head_teacher: 'ପ୍ରଧାନ ଶିକ୍ଷକ (CRC)',
    block_officer: 'ବ୍ଲକ ଶିକ୍ଷା ଅଧିକାରୀ (BEO)'
  },
  subjects: {
    all: 'ସମସ୍ତ ବିଷୟ',
    numeracy: 'ଗଣିତ (ସଂଖ୍ୟାଜ୍ଞାନ)',
    literacy: 'ଭାଷା (ସାକ୍ଷରତା)'
  },
  common: {
    rollPrefix: 'ରୋଲ ନଂ',
    studentPrefix: 'ଛାତ୍ର / ଛାତ୍ରୀ',
    offlineBanner: 'ଅଫଲାଇନ୍ ମୋଡ୍ ସକ୍ରିୟ ଅଛି। ତଥ୍ୟ ସୁରକ୍ଷିତ ଭାବେ ରହିଛି।',
    deleteTitle: 'ହଟାନ୍ତୁ'
  }
});

// 16. PUNJABI (ਪੰਜਾਬੀ)
export const paTranslation = createLanguageResource(hiBase, {
  appName: 'ਲਰਨ-ਗੈਪ ਏਆਈ (LearnGap AI)',
  appTagline: 'ਮੁਲਾਂਕਣ ਡੇਟਾ ਤੋਂ ਕਲਾਸਰੂਮ ਕਾਰਜ ਯੋਜਨਾ ਤੱਕ',
  appSubtitle: 'ਮੁੱਢਲੀ ਸਿੱਖਿਆ ਫੈਸਲਾ-ਸਹਾਇਤਾ ਪ੍ਰਣਾਲੀ',
  competitionBadge: 'ਆਈਆਈਟੀ ਬੰਬਈ ਟੈੱਕਫੈਸਟ',
  schoolName: 'ਪ੍ਰਾਇਮਰੀ ਸਕੂਲ, ਕੋਪਰਗਾਓਂ',
  schoolSub: 'ਨਿਪੁੰਨ ਭਾਰਤ FLN ਉਪਚਾਰਕ ਕਲਾਸਰੂਮ ਯੋਜਨਾ',
  roles: {
    teacher: 'ਜਮਾਤ ਇੰਚਾਰਜ (Teacher)',
    head_teacher: 'ਮੁੱਖ ਅਧਿਆਪਕ (CRC)',
    block_officer: 'ਬਲਾਕ ਪ੍ਰਾਇਮਰੀ ਸਿੱਖਿਆ ਅਫ਼ਸਰ (BPEO)'
  },
  subjects: {
    all: 'ਸਾਰੇ ਵਿਸ਼ੇ',
    numeracy: 'ਗਣਿਤ (ਸੰਖਿਆ ਗਿਆਨ)',
    literacy: 'ਭਾਸ਼ਾ (ਸਾਖਰਤਾ)'
  },
  common: {
    rollPrefix: 'ਰੋਲ ਨੰ.',
    studentPrefix: 'ਵਿਦਿਆਰਥੀ',
    offlineBanner: 'ਆਫਲਾਈਨ ਮੋਡ ਸਰਗਰਮ ਹੈ। ਸਾਰਾ ਡੇਟਾ ਫ਼ੋਨ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਹੈ।',
    deleteTitle: 'ਮਿਟਾਓ'
  }
});

// 17. ASSAMESE (অসমীয়া)
export const asTranslation = createLanguageResource(enBase, {
  appName: 'লাৰ্ন-গেপ এআই (LearnGap AI)',
  appTagline: 'মূল্যায়ন তথ্যৰ পৰা শ্ৰেণীকোঠা কাৰ্য পৰিকল্পনালৈ',
  appSubtitle: 'প্ৰাথমিক শিক্ষা সিদ্ধান্ত সহায়তা ব্যৱস্থা',
  competitionBadge: 'আইআইটি বম্বে টেকফেষ্ট',
  schoolName: 'প্ৰাথমিক বিদ্যালয়, কোপাৰগাঁও',
  schoolSub: 'নিপুণ ভাৰত FLN প্ৰতিকাৰমূলক কাৰ্য পৰিকল্পনা',
  roles: {
    teacher: 'শ্ৰেণী শিক্ষক',
    head_teacher: 'প্ৰধান শিক্ষক (CRC)',
    block_officer: 'খণ্ড শিক্ষা বিষয়া (BEO)'
  },
  subjects: {
    all: 'সকলো বিষয়',
    numeracy: 'গণিত (সংখ্যাজ্ঞান)',
    literacy: 'ভাষা (সাক্ষৰতা)'
  },
  common: {
    rollPrefix: 'ৰোল নং',
    studentPrefix: 'শিক্ষাৰ্থী',
    offlineBanner: 'অফলাইন ম’ড সক্ৰিয়। তথ্যসমূহ সুৰক্ষিতভাৱে সংৰক্ষিত হৈছে।',
    deleteTitle: 'মচি পেলাওক'
  }
});

// 18. URDU (اردو)
export const urTranslation = createLanguageResource(hiBase, {
  appName: 'لرن گیپ اے آئی (LearnGap AI)',
  appTagline: 'تشخیصی نتائج سے تدریسی عمل تک',
  appSubtitle: 'بنیادی تعلیمی فیصلہ سازی نظام',
  competitionBadge: 'آئی آئی ٹی بمبئی ٹیک فیسٹ',
  schoolName: 'پرائمری اسکول، کوپرگاؤں',
  schoolSub: 'نپن بھارت بنیادی تعلیمی منصوبہ',
  roles: {
    teacher: 'کلاس ٹیچر',
    head_teacher: 'صدر مدرس (CRC)',
    block_officer: 'بلاک ایجوکیشن آفیسر (BEO)'
  },
  subjects: {
    all: 'تمام مضامین',
    numeracy: 'حساب (گنتی و اعداد)',
    literacy: 'زبان و فہم'
  },
  common: {
    rollPrefix: 'رول نمبر',
    studentPrefix: 'طالب علم',
    offlineBanner: 'آف لائن موڈ آن ہے۔ تمام ریکارڈ فون میں محفوظ ہیں۔',
    deleteTitle: 'حذف کریں'
  }
});

// 19. MIZO (Mizo ṭawng - Northeast Indigenous Language)
export const lusTranslation = createLanguageResource(enBase, {
  appName: 'LearnGap AI (Mizo)',
  appTagline: 'Zirlai Thiamna Atanga Class Hmalakna Ruahmanna',
  appSubtitle: 'Bulthut Zirna Hmalakpui Tu Tu Hmanrua',
  competitionBadge: 'IIT Bombay Techfest (Mizo Edition)',
  schoolName: 'Primary Sikul, Kopargaon',
  schoolSub: 'NIPUN Bharat & FLN Remedial Action Planner',
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
    studentPrefix: 'Zirlai',
    offlineBanner: 'Offline Mode a inhawng e. Data a him e.',
    deleteTitle: 'Nuaibo'
  }
});

// 20. KHASI (Ka Ktien Khasi - Indigenous Language of Meghalaya)
export const khaTranslation = createLanguageResource(enBase, {
  appName: 'LearnGap AI (Khasi)',
  appTagline: 'Na ka Jingtip Pule sha ka Jingpyntreikam ha Klas',
  appSubtitle: 'Ka Tieng Pynshai Jingmut ha ka Jinghikai',
  competitionBadge: 'IIT Bombay Techfest (Khasi Edition)',
  schoolName: 'Skul Primary, Kopargaon',
  schoolSub: 'NIPUN Bharat & FLN Jinghikai Bakhmat',
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
    studentPrefix: 'Khynnah Pule',
    offlineBanner: 'Offline Mode ka treikam. Ki data ki shngain.',
    deleteTitle: 'Pynduh'
  }
});

export const ALL_RESOURCES = {
  ...translations,
  gu: { translation: guTranslation },
  bn: { translation: bnTranslation },
  ta: { translation: taTranslation },
  te: { translation: teTranslation },
  kn: { translation: knTranslation },
  ml: { translation: mlTranslation },
  or: { translation: orTranslation },
  pa: { translation: paTranslation },
  as: { translation: asTranslation },
  ur: { translation: urTranslation },
  sat: { translation: satTranslation },
  gon: { translation: gonTranslation },
  bhi: { translation: bhiTranslation },
  kru: { translation: kruTranslation },
  brx: { translation: brxTranslation },
  lus: { translation: lusTranslation },
  kha: { translation: khaTranslation }
};
