export interface TranslationSchema {
  appName: string;
  appTagline: string;
  appSubtitle: string;
  competitionBadge: string;
  schoolName: string;
  schoolSub: string;
  schoolLocation: string;
  offlineMode: string;
  onlineMode: string;
  syncing: string;
  selectLanguage: string;
  allLanguages: string;
  regionalCategory: string;
  tribalCategory: string;
  searchLanguages: string;
  roles: {
    teacher: string;
    head_teacher: string;
    block_officer: string;
  };
  nav: {
    assessment: string;
    gapAnalysis: string;
    remedialPlan: string;
    dashboard: string;
    dpdp: string;
  };
  subjects: {
    all: string;
    numeracy: string;
    literacy: string;
  };
  urgency: {
    high: string;
    moderate: string;
    mastered: string;
    highUrgency: string;
    moderatePriority: string;
  };
  assessment: {
    title: string;
    subtitle: string;
    manualEntry: string;
    csvUpload: string;
    downloadSample: string;
    studentAlias: string;
    selectCompetency: string;
    asmtType: string;
    baseline: string;
    followup: string;
    scoreObtained: string;
    totalMarks: string;
    calculatedPct: string;
    gapFlagged: string;
    mastered: string;
    saveRecord: string;
    savedSuccess: string;
    validationError: string;
    recentRecords: string;
    totalRecords: string;
    filterByCompetency: string;
    noRecords: string;
    tableRoll: string;
    tableComp: string;
    tableType: string;
    tableScore: string;
    tableStatus: string;
    tableAction: string;
  };
  gaps: {
    title: string;
    subtitle: string;
    thresholdNote: string;
    urgentRemediation: string;
    urgentSub: string;
    moderateRemediation: string;
    moderateSub: string;
    mastered: string;
    masteredSub: string;
    rulesTitle: string;
    rulesBody: string;
    clustersTitle: string;
    studentsCount: string;
    targetPct: string;
    createPlanBtn: string;
    noGapsMessage: string;
    suggestedActivityLabel: string;
  };
  planner: {
    title: string;
    subtitle: string;
    exportPdf: string;
    shareWhatsApp: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    selectCompLabel: string;
    selectActivityLabel: string;
    activityDuration: string;
    minutes: string;
    materialsRequired: string;
    pedagogicalReason: string;
    scheduleForWeek: string;
    schedulePlaceholder: string;
    teacherNotesLabel: string;
    teacherNotesPlaceholder: string;
    teacherReview: string;
    approveNotice: string;
    ethicsNoticeTitle: string;
    ethicsNoticeBody: string;
    approvePlanBtn: string;
    planApproved: string;
    previewBanner: string;
    previewSub: string;
    loadSavedPlan: string;
    createNewPlan: string;
    targetStudentsLabel: string;
    planApprovedSuccess: string;
  };
  printable: {
    officialHeading: string;
    planSubtitle: string;
    competitionHeader: string;
    udiseCode: string;
    gradeSectionLabel: string;
    gradeSectionVal: string;
    subjectLabel: string;
    scheduleLabel: string;
    statusLabel: string;
    statusApproved: string;
    statusDraft: string;
    targetCompHeading: string;
    passThresholdLabel: string;
    targetLearnersHeading: string;
    tableRoll: string;
    tableLearner: string;
    tableLevel: string;
    tableConsent: string;
    remedialNeeded: string;
    consentVerified: string;
    activityHeading: string;
    procedureLabel: string;
    materialsLabel: string;
    reasoningLabel: string;
    teacherNotesHeading: string;
    signOffTitle: string;
    signOffDeclaration: string;
    teacherSignatureLabel: string;
    dateLabel: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    activeRoleLabel: string;
    blockNotice: string;
    overallCoverage: string;
    coverageTarget: string;
    coverageSub: string;
    baselinePassAvg: string;
    baselineSub: string;
    followupPassAvg: string;
    gainBadge: string;
    followupSub: string;
    actionOnGaps: string;
    actionTargetMet: string;
    actionSub: string;
    gapRecoverySummary: string;
    summarySub: string;
    legendBaseline: string;
    legendFollowup: string;
    tableComp: string;
    tableThreshold: string;
    tableBaselinePass: string;
    tableFollowupPass: string;
    tableNetGain: string;
    tableRecovered: string;
    tableRemaining: string;
    inProgressNotice: string;
    recoveredBadge: string;
    persistentBadge: string;
    noneBadge: string;
    insightHeading: string;
    insightBody: string;
    selectClass?: string;
    overallStudentsRecord?: string;
    individualStudentRecord?: string;
    teacherCommandCenter?: string;
    headTeacherDashboard?: string;
    inspectScope?: string;
    allClasses?: string;
    editMarks?: string;
    openRemedialPlan?: string;
  };
  dpdp: {
    title: string;
    subtitle: string;
    dataMinimization: string;
    dataMinimizationDesc: string;
    purposeLimitation: string;
    purposeLimitationDesc: string;
    parentalConsent: string;
    parentalConsentDesc: string;
    syntheticDemo: string;
    syntheticDemoDesc: string;
    consentRegisterTitle: string;
    consentTarget: string;
    consentVerifiedBadge: string;
    consentPendingBadge: string;
    closeBtn: string;
  };
  common: {
    rollPrefix: string;
    studentPrefix: string;
    offlineBanner: string;
    deleteTitle: string;
    classLabel?: string;
    allClasses?: string;
    installApp?: string;
    appReady?: string;
  };
}

export const translations: Record<string, { translation: TranslationSchema }> = {
  // -------------------------------------------------------------
  // 1. ENGLISH (100% pure English, zero Marathi leakage)
  // -------------------------------------------------------------
  en: {
    translation: {
      appName: 'LearnGap AI',
      appTagline: 'From Learning Data to Classroom Action',
      appSubtitle: 'Foundational Learning Decision-Support System',
      competitionBadge: 'Techfest IIT Bombay',
      schoolName: 'Z.P. Primary School, Kopargaon (Ahilyanagar)',
      schoolSub: 'NIPUN Bharat & FLN Classroom Action Decision Tool',
      schoolLocation: 'Ahilyanagar, Maharashtra',
      offlineMode: 'Offline Ready',
      onlineMode: 'Online & Synced',
      syncing: 'Syncing with Supabase...',
      selectLanguage: 'Language',
      allLanguages: 'All Languages',
      regionalCategory: 'Major Regional Languages',
      tribalCategory: 'Adivasi & Tribal Languages',
      searchLanguages: 'Search regional or tribal language...',
      roles: {
        teacher: 'Class Teacher',
        head_teacher: 'Head Teacher (CRC)',
        block_officer: 'Block Education Officer (BEO)'
      },
      nav: {
        assessment: '1. Assessment Data',
        gapAnalysis: '2. Learning Gap Engine',
        remedialPlan: '3. Remedial Action Plan',
        dashboard: '4. Progress Dashboard',
        dpdp: 'DPDP Privacy & Consent'
      },
      subjects: {
        all: 'All Subjects',
        numeracy: 'Mathematics (Numeracy)',
        literacy: 'Language (Literacy)'
      },
      urgency: {
        high: 'High Urgency',
        moderate: 'Moderate Support',
        mastered: 'Mastered',
        highUrgency: 'High Urgency',
        moderatePriority: 'Moderate Priority'
      },
      assessment: {
        title: 'Assessment Data Manager',
        subtitle: 'Enter baseline or follow-up marks manually or upload CSV. Data is validated on-device.',
        manualEntry: 'Quick Manual Entry',
        csvUpload: 'Batch CSV Upload',
        downloadSample: 'Download Sample CSV',
        studentAlias: 'Learner (Roll No. & Alias)',
        selectCompetency: 'Competency / Learning Outcome',
        asmtType: 'Assessment Type',
        baseline: 'Baseline Diagnostic',
        followup: 'Follow-up (Post Remediation)',
        scoreObtained: 'Score Obtained',
        totalMarks: 'Total Marks',
        calculatedPct: 'Calculated Percentage:',
        gapFlagged: 'Gap Flagged',
        mastered: 'Mastered',
        saveRecord: 'Save Assessment Record',
        savedSuccess: 'Assessment saved locally! Ready for offline gap analysis.',
        validationError: 'Data Validation Warning',
        recentRecords: 'Recent Class Assessment Records',
        totalRecords: 'Total Records:',
        filterByCompetency: 'All Competencies',
        noRecords: 'No records found. Enter a student mark or use preloaded sample data.',
        tableRoll: 'Roll / Learner',
        tableComp: 'Competency',
        tableType: 'Type',
        tableScore: 'Score',
        tableStatus: 'Status',
        tableAction: 'Action'
      },
      gaps: {
        title: 'Learning Gap Engine (Rule-Based)',
        subtitle: 'Transparent, deterministic thresholding. AI explains suggestions but never replaces teacher judgement.',
        thresholdNote: 'Standard passing threshold is set at 60% per NIPUN Bharat guidelines.',
        urgentRemediation: 'Urgent Remediation Needed (< 40%)',
        urgentSub: 'Scores significantly below benchmark',
        moderateRemediation: 'Moderate Support Needed (40% - 59%)',
        moderateSub: 'Scores approaching benchmark',
        mastered: 'Mastered Benchmark (60%+)',
        masteredSub: 'Competency achieved successfully',
        rulesTitle: 'Transparent Rule-Based Criteria (Explainable AI Standard):',
        rulesBody: 'Gap detection operates on deterministic threshold rules rather than unverified AI guesses. When a student scores under 60% in a foundational assessment, they are grouped with peers needing identical remedial support. Every suggested activity comes from a teacher-reviewed bank and shows explicit pedagogical reasoning.',
        clustersTitle: 'Identified Skill-Gap Groups',
        studentsCount: 'learners needing support',
        targetPct: 'Target:',
        createPlanBtn: 'Create Action Plan for this Group',
        noGapsMessage: 'All learners have attained the competency benchmark for this filter!',
        suggestedActivityLabel: 'Suggested Teacher-Reviewed Activity:'
      },
      planner: {
        title: 'Remedial Action Planner',
        subtitle: 'Teacher-reviewed activity bank, scheduling, and 1-page printable / WhatsApp shareable export.',
        exportPdf: 'Print / 1-Page PDF',
        shareWhatsApp: 'Share on WhatsApp',
        step1Title: 'Target Competency & Activity',
        step2Title: 'Schedule & Classroom Adaptation',
        step3Title: 'Teacher-in-the-Loop Sign-off',
        selectCompLabel: 'Select Competency',
        selectActivityLabel: 'Teacher-Reviewed Activity',
        activityDuration: 'Duration',
        minutes: 'mins',
        materialsRequired: 'Materials Required:',
        pedagogicalReason: 'Pedagogical Reason:',
        scheduleForWeek: 'Target Schedule / Week',
        schedulePlaceholder: 'e.g. Monday to Thursday (2:00 PM to 2:30 PM)',
        teacherNotesLabel: 'Teacher Context Notes',
        teacherNotesPlaceholder: 'e.g. Group students in triads and use physical pebbles for concrete counting.',
        teacherReview: 'Teacher-in-the-Loop Verification',
        approveNotice: 'This remedial plan must be verified and approved by the class teacher prior to classroom implementation.',
        ethicsNoticeTitle: 'Pedagogical Safeguard:',
        ethicsNoticeBody: 'AI suggestions are bounded strictly to approved curriculum banks. The teacher holds final pedagogical authority.',
        approvePlanBtn: 'Approve & Finalize Plan',
        planApproved: 'Plan Approved by Teacher',
        previewBanner: 'One-Page A4 Preview (Print & WhatsApp Ready):',
        previewSub: 'Formatted to fit cleanly on a single printed sheet or mobile screen',
        loadSavedPlan: 'Load Saved Remedial Plan',
        createNewPlan: '-- Create New Action Plan --',
        targetStudentsLabel: 'Target Students in Group',
        planApprovedSuccess: 'Plan verified & approved by teacher successfully!'
      },
      printable: {
        officialHeading: 'ZILLA PARISHAD PRIMARY SCHOOL, KOPARGAON',
        planSubtitle: 'NIPUN Bharat / FLN Remedial Action Plan (Decision Support Output)',
        competitionHeader: 'Techfest 2026-27 • Team SuperNova',
        udiseCode: 'UDISE+: 27260501234',
        gradeSectionLabel: 'Grade / Section:',
        gradeSectionVal: 'Grade 3 (Section A)',
        subjectLabel: 'Subject:',
        scheduleLabel: 'Schedule:',
        statusLabel: 'Status:',
        statusApproved: 'Teacher Approved',
        statusDraft: 'Draft Plan',
        targetCompHeading: 'TARGET LEARNING COMPETENCY',
        passThresholdLabel: 'Passing Benchmark:',
        targetLearnersHeading: 'REMEDIAL GROUP LEARNERS',
        tableRoll: 'Roll No.',
        tableLearner: 'Learner Code',
        tableLevel: 'Diagnostic Level',
        tableConsent: 'Parental Consent',
        remedialNeeded: 'Needs Remediation (< 60%)',
        consentVerified: 'Verified on File',
        activityHeading: 'TEACHER-REVIEWED REMEDIAL ACTIVITY',
        procedureLabel: 'Step-by-Step Procedure:',
        materialsLabel: 'Materials Required:',
        reasoningLabel: 'Pedagogical Rationale:',
        teacherNotesHeading: 'Class Teacher Classroom Notes:',
        signOffTitle: 'Class Teacher Approval & Verification',
        signOffDeclaration: '"I have reviewed this remedial plan, verified the student grouping, and approve this intervention for classroom execution."',
        teacherSignatureLabel: 'Pranav Jadhav (Class Teacher)',
        dateLabel: 'Date:'
      },
      dashboard: {
        title: 'Progress & Outcome Dashboard',
        subtitle: 'Closed-loop comparison: Baseline vs Follow-up results showing actual learning recovery.',
        activeRoleLabel: 'Active Role:',
        blockNotice: 'Block Aggregate View: Student personal identifiers are strictly masked in compliance with DPDP Act 2023.',
        overallCoverage: 'Assessment Coverage',
        coverageTarget: 'Target > 90%',
        coverageSub: 'learners baseline recorded',
        baselinePassAvg: 'Baseline Pass Rate',
        baselineSub: 'Diagnostic baseline before intervention',
        followupPassAvg: 'Follow-up Pass Rate',
        gainBadge: 'Net Gain',
        followupSub: 'Measured post-intervention check',
        actionOnGaps: 'Action on Gaps',
        actionTargetMet: 'Target Met (>= 80%)',
        actionSub: 'documented remedial plans created',
        gapRecoverySummary: 'Competency-wise Learning Recovery Report',
        summarySub: 'Direct comparison of student pass rates before and after teacher-approved remedial activities.',
        legendBaseline: 'Baseline (Diagnostic)',
        legendFollowup: 'Follow-up (Post-Remediation)',
        tableComp: 'Competency',
        tableThreshold: 'Threshold',
        tableBaselinePass: 'Baseline Pass %',
        tableFollowupPass: 'Follow-up Pass %',
        tableNetGain: 'Net Gain',
        tableRecovered: 'Recovered',
        tableRemaining: 'Persistent Gap',
        inProgressNotice: 'Intervention in progress',
        recoveredBadge: 'learners recovered',
        persistentBadge: 'need 2nd cycle',
        noneBadge: 'None',
        insightHeading: 'NIPUN Bharat & FLN Closed-Loop Impact Summary',
        insightBody: 'Unlike traditional portals where assessment data remains a dormant compliance report, LearnGap AI completes the decision loop. Following targeted remedial intervention, students exhibited significant measured competency recovery, demonstrating verifiable learning gains.',
        selectClass: 'Select Class'
      },
      dpdp: {
        title: 'DPDP Act 2023 & Child Privacy Guard',
        subtitle: 'Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025 Architecture',
        dataMinimization: 'Data Minimization Principle',
        dataMinimizationDesc: 'Only Learner ID, Roll Number, Grade, and Competency Scores are stored. Student real names are optional and replaced with synthetic identifiers.',
        purposeLimitation: 'Purpose Limitation',
        purposeLimitationDesc: 'Data is strictly utilized for remedial teaching support. Zero behavioural profiling, zero tracking, and zero advertising.',
        parentalConsent: 'Parental Consent (Section 9)',
        parentalConsentDesc: 'Verifiable parental/guardian consent recorded via school register prior to any remedial tracking.',
        syntheticDemo: 'Synthetic Demo Datasets',
        syntheticDemoDesc: 'Current demonstration utilizes 100% synthetic records for Kopargaon rural primary schools to safeguard real learner identities.',
        consentRegisterTitle: 'Parental Consent Register',
        consentTarget: '100% Target Coverage',
        consentVerifiedBadge: 'Consent Verified',
        consentPendingBadge: 'Pending Consent',
        closeBtn: 'Close Privacy Overview'
      },
      common: {
        rollPrefix: 'Roll No.',
        studentPrefix: 'Learner',
        offlineBanner: 'Offline Mode Active. All records and action plans are saved safely on your device and will auto-sync with Supabase when internet is available.',
        deleteTitle: 'Delete assessment',
        installApp: 'Install App',
        appReady: 'App Ready',
        classLabel: 'Class',
        allClasses: 'All Classes'
      }
    }
  },

  // -------------------------------------------------------------
  // 2. MARATHI (100% pure Marathi, zero English leakage)
  // -------------------------------------------------------------
  mr: {
    translation: {
      appName: 'लर्न-गॅप एआय (LearnGap AI)',
      appTagline: 'मूल्यांकन माहितीकडून वर्ग कृती आराखड्याकडे',
      appSubtitle: 'पायाभूत अध्ययन निर्णय-सहाय्य प्रणाली',
      competitionBadge: 'आयआयटी मुंबई टेकफेस्ट',
      schoolName: 'जि. प. प्राथमिक शाळा, कोपरगाव (अहिल्यानगर)',
      schoolSub: 'निपुण भारत व FLN उपचारात्मक वर्ग निर्णय साधन',
      schoolLocation: 'अहिल्यानगर, महाराष्ट्र',
      offlineMode: 'ऑफलाईन तयार',
      onlineMode: 'ऑनलाईन व सिंक झाले',
      syncing: 'सुपाबेसशी सिंक होत आहे...',
      selectLanguage: 'भाषा निवडा',
      allLanguages: 'सर्व भाषा',
      regionalCategory: 'प्रमुख प्रादेशिक भाषा',
      tribalCategory: 'आदिवासी व स्थानिक बोलीभाषा',
      searchLanguages: 'प्रादेशिक किंवा आदिवासी भाषा शोधा...',
      roles: {
        teacher: 'वर्ग शिक्षक',
        head_teacher: 'मुख्याध्यापक (केंद्रप्रमुख)',
        block_officer: 'तालुका शिक्षण अधिकारी (BEO)'
      },
      nav: {
        assessment: '१. मूल्यांकन नोंदणी',
        gapAnalysis: '२. अध्ययन तूट शोध (Gap Engine)',
        remedialPlan: '३. उपचारात्मक कृती आराखडा',
        dashboard: '४. प्रगती डॅशबोर्ड',
        dpdp: 'डीपीडीपी गोपनीयता व संमती'
      },
      subjects: {
        all: 'सर्व विषय',
        numeracy: 'गणित (संख्याज्ञान)',
        literacy: 'भाषा (साक्षरता)'
      },
      urgency: {
        high: 'तातडीची गरज',
        moderate: 'मध्यम सहाय्य',
        mastered: 'क्षमता प्राप्त',
        highUrgency: 'उच्च प्राधान्य',
        moderatePriority: 'मध्यम प्राधान्य'
      },
      assessment: {
        title: 'मूल्यांकन माहिती व्यवस्थापक',
        subtitle: 'पायाभूत किंवा पाठपुरावा गुण थेट नोंदवा किंवा CSV फाईल अपलोड करा. डेटा मोबाईलवरच तपासला जातो.',
        manualEntry: 'जलद नोंदणी (Manual)',
        csvUpload: 'CSV फाईल अपलोड',
        downloadSample: 'नमुना CSV डाऊनलोड करा',
        studentAlias: 'विद्यार्थी (हजेरी क्र. व नाव)',
        selectCompetency: 'अध्ययन निष्पत्ती / क्षमता',
        asmtType: 'मूल्यांकन प्रकार',
        baseline: 'पायाभूत मूल्यांकन (Baseline)',
        followup: 'पाठपुरावा पुनर्मूल्यांकन (Follow-up)',
        scoreObtained: 'मिळालेले गुण',
        totalMarks: 'एकूण गुण',
        calculatedPct: 'हिशोब केलेली टक्केवारी:',
        gapFlagged: 'अध्ययन तूट आढळली',
        mastered: 'क्षमता प्राप्त',
        saveRecord: 'नोंद सेव्ह करा',
        savedSuccess: 'माहिती मोबाईलमध्ये सुरक्षित सेव्ह झाली! ऑफलाईन विश्लेषणासाठी तयार.',
        validationError: 'माहिती वैधता चेतावणी',
        recentRecords: 'वर्गातील ताज्या मूल्यांकन नोंदी',
        totalRecords: 'एकूण नोंदी:',
        filterByCompetency: 'सर्व क्षमता',
        noRecords: 'कोणतीही नोंद आढळली नाही. विद्यार्थ्यांचे गुण नोंदवा किंवा नमुना डेटा वापरा.',
        tableRoll: 'हजेरी क्र. / विद्यार्थी',
        tableComp: 'क्षमता',
        tableType: 'प्रकार',
        tableScore: 'गुण',
        tableStatus: 'स्थिती',
        tableAction: 'कृती'
      },
      gaps: {
        title: 'अध्ययन तूट शोध इंजिन (पारदर्शक नियम आधारित)',
        subtitle: 'पारदर्शक व स्पष्ट निकष. एआय केवळ शिक्षक-मान्य कृती सुचवतो, शिक्षकांच्या निर्णयाला पर्याय ठरत नाही.',
        thresholdNote: 'निपुण भारत मार्गदर्शक तत्त्वांनुसार किमान उत्तीर्ण प्रमाण ६०% निश्चित आहे.',
        urgentRemediation: 'तातडीने उपचारात्मक अध्यापनाची गरज (< ४०%)',
        urgentSub: 'गुण निकषापेक्षा खूप कमी आहेत',
        moderateRemediation: 'मध्यम सहाय्याची गरज (४०% - ५९%)',
        moderateSub: 'गुण उत्तीर्ण निकषाच्या जवळ आहेत',
        mastered: 'क्षमता प्राप्त (६०%+)',
        masteredSub: 'विद्यार्थ्यांनी निकष पूर्ण केला आहे',
        rulesTitle: 'पारदर्शक नियम आधारित निकष (स्पष्ट व पारदर्शक AI निकष):',
        rulesBody: 'गॅप शोध कोणत्याही अनपेक्षित AI अनुमानावर अवलंबून नाही. निपुण भारत निकषानुसार ६०% पेक्षा कमी गुण असल्यास विद्यार्थ्याला आपोआप उपचारात्मक गटात समाविष्ट केले जाते. प्रत्येक सुचवलेल्या कृतीमागील शैक्षणिक कारण शिक्षकांसमोर स्पष्ट मांडले जाते.',
        clustersTitle: 'समान अडचण असलेले विद्यार्थी गट',
        studentsCount: 'विद्यार्थ्यांना मदतीची गरज',
        targetPct: 'उद्दीष्ट:',
        createPlanBtn: 'या गटासाठी कृती आराखडा बनवा',
        noGapsMessage: 'या निवडीसाठी सर्व विद्यार्थ्यांनी अध्ययन उद्दिष्ट पूर्ण केले आहे!',
        suggestedActivityLabel: 'शिक्षक-मान्य सुचवलेली उपचारात्मक कृती:'
      },
      planner: {
        title: 'उपचारात्मक कृती आराखडा (Remedial Action Planner)',
        subtitle: 'शिक्षक-पुनरावलोकन केलेली कृती बँक, वेळापत्रक आणि १-पानी प्रिंट / व्हॉट्सॲप शेअर आराखडा.',
        exportPdf: '१-पानी प्रिंट / PDF',
        shareWhatsApp: 'व्हॉट्सॲपवर पाठवा',
        step1Title: 'लक्षित क्षमता व कृती निवड',
        step2Title: 'वेळापत्रक व वर्ग नियोजन',
        step3Title: 'शिक्षकांचे प्रत्यक्ष पुनरावलोकन व मंजुरी',
        selectCompLabel: 'क्षमता निवडा',
        selectActivityLabel: 'शिक्षक-मान्य कृती',
        activityDuration: 'कालावधी',
        minutes: 'मिनिटे',
        materialsRequired: 'आवश्यक साहित्य:',
        pedagogicalReason: 'शैक्षणिक कारण:',
        scheduleForWeek: 'नियोजित आठवडा / वेळ',
        schedulePlaceholder: 'उदा. सोमवार ते गुरुवार (दुपारी २:०० ते २:३०)',
        teacherNotesLabel: 'शिक्षकांच्या वर्ग नोंदी',
        teacherNotesPlaceholder: 'उदा. विद्यार्थ्यांना ३-३ च्या गटात बसवून प्रत्यक्ष साहित्याने सराव करून घेणे.',
        teacherReview: 'शिक्षकांची प्रत्यक्ष मंजुरी व पडताळणी',
        approveNotice: 'अंमलबजावणीपूर्वी वर्गशिक्षकाने हा आराखडा तपासून मंजूर करणे आवश्यक आहे.',
        ethicsNoticeTitle: 'शैक्षणिक सुरक्षा हमी:',
        ethicsNoticeBody: 'एआय केवळ शिक्षक-मान्य बँकेतील कृती सुचवतो. प्रत्यक्ष शिकवण्याचा अंतिम निर्णय शिक्षकांचाच असतो.',
        approvePlanBtn: 'आराखडा तपासून मंजूर करा',
        planApproved: 'शिक्षकांनी आराखडा मंजूर केला आहे',
        previewBanner: '१-पानी A4 आराखडा पूर्वावलोकन (प्रिंट व व्हॉट्सॲप तयार):',
        previewSub: 'एकाच पानावर आणि मोबाईल स्क्रीनवर अचूक मावेल अशी मांडणी',
        loadSavedPlan: 'पूर्वी तयार केलेले आराखडे पहा',
        createNewPlan: '-- नवीन कृती आराखडा तयार करा --',
        targetStudentsLabel: 'गटातील निवडलेले विद्यार्थी',
        planApprovedSuccess: 'शिक्षकांनी आराखडा तपासून यशस्वीरीत्या मंजूर केला!'
      },
      printable: {
        officialHeading: 'जिल्हा परिषद प्राथमिक शाळा, कोपरगाव',
        planSubtitle: 'निपुण भारत / FLN अध्ययन तूट उपचारात्मक कृती आराखडा',
        competitionHeader: 'आयआयटी मुंबई टेकफेस्ट २०२६-२७ • टीम सुपरनोव्हा',
        udiseCode: 'UDISE+: २७२६०५०१२३४',
        gradeSectionLabel: 'इयत्ता / तुकडी:',
        gradeSectionVal: 'इयत्ता ३ री (तुकडी अ)',
        subjectLabel: 'विषय:',
        scheduleLabel: 'वेळापत्रक:',
        statusLabel: 'स्थिती:',
        statusApproved: 'शिक्षक मान्यताप्राप्त',
        statusDraft: 'मसुदा (Draft)',
        targetCompHeading: 'लक्षित अध्ययन निष्पत्ती / क्षमता',
        passThresholdLabel: 'किमान उत्तीर्ण निकष:',
        targetLearnersHeading: 'उपचारात्मक गटातील विद्यार्थी',
        tableRoll: 'हजेरी क्र.',
        tableLearner: 'विद्यार्थी कोड / नाव',
        tableLevel: 'सध्याची पातळी',
        tableConsent: 'पालक संमती',
        remedialNeeded: 'उपचार आवश्यक (< ६०%)',
        consentVerified: 'नोंदवहीत उपलब्ध',
        activityHeading: 'शिक्षक-पुनरावलोकन केलेली उपचारात्मक कृती',
        procedureLabel: 'कृतीची प्रत्यक्ष पद्धत:',
        materialsLabel: 'आवश्यक शैक्षणिक साहित्य:',
        reasoningLabel: 'शैक्षणिक कारण व आधार:',
        teacherNotesHeading: 'शिक्षकांच्या विशेष वर्ग नोंदी:',
        signOffTitle: 'वर्ग शिक्षक स्वाक्षरी व मंजुरी',
        signOffDeclaration: '"मी या कृती आराखड्याची पडताळणी केली असून वर्गात अंमलबजावणीस मंजुरी देत आहे."',
        teacherSignatureLabel: 'प्रणव जाधव (वर्ग शिक्षक)',
        dateLabel: 'दिनांक:'
      },
      dashboard: {
        title: 'प्रगती व निष्पत्ती डॅशबोर्ड',
        subtitle: 'बंदिस्त-लूप तुलना: पायाभूत आणि उपचारात्मक नंतरची तुलना प्रत्यक्ष अध्ययन सुधारणा दाखवते.',
        activeRoleLabel: 'सक्रिय भूमिका:',
        blockNotice: 'तालुका/केंद्र स्तर एकत्रित माहिती: DPDP कायद्यानुसार विद्यार्थ्यांचे वैयक्तिक नाव गोपनीय ठेवले आहे.',
        overallCoverage: 'मूल्यांकन पूर्णता प्रमाण',
        coverageTarget: 'लक्ष्य > ९०%',
        coverageSub: 'विद्यार्थ्यांची पायाभूत नोंद पूर्ण',
        baselinePassAvg: 'पायाभूत उत्तीर्ण टक्केवारी',
        baselineSub: 'उपचारात्मक अध्यापनापूर्वीचे गुण',
        followupPassAvg: 'पाठपुरावा उत्तीर्ण टक्केवारी',
        gainBadge: 'निव्वळ वाढ',
        followupSub: 'उपचारात्मक कृतीनंतरचे मोजमाप',
        actionOnGaps: 'कृती आराखडा पूर्णता',
        actionTargetMet: 'लक्ष्य पूर्ण (>= ८०%)',
        actionSub: 'तयार केलेले शिक्षक कृती आराखडे',
        gapRecoverySummary: 'क्षमतानिहाय अध्ययन सुधारणा अहवाल',
        summarySub: 'शिक्षकांनी घेतलेल्या उपचारात्मक कृतींनंतरच्या निकालांची प्रत्यक्ष तुलना.',
        legendBaseline: 'पायाभूत चाचणी (Baseline)',
        legendFollowup: 'पाठपुरावा चाचणी (Follow-up)',
        tableComp: 'क्षमता',
        tableThreshold: 'निकष',
        tableBaselinePass: 'पायाभूत उत्तीर्ण %',
        tableFollowupPass: 'पाठपुरावा उत्तीर्ण %',
        tableNetGain: 'निव्वळ वाढ',
        tableRecovered: 'सुधारणा झाली',
        tableRemaining: 'अजूनही तूट',
        inProgressNotice: 'उपचारात्मक सराव चालू आहे',
        recoveredBadge: 'विद्यार्थी सुधारले',
        persistentBadge: '२ री फेरी आवश्यक',
        noneBadge: 'काहीही नाही',
        insightHeading: 'निपुण भारत व FLN उपचारात्मक निष्पत्ती सारांश',
        insightBody: 'पारंपारिक मूल्यमापनामध्ये चाचणीचे गुण केवळ अहवालापुरते मर्यादित राहतात. लर्न-गॅप एआय (LearnGap AI) च्या साहाय्याने शिक्षकांनी घेतलेल्या उपचारात्मक कृतीनंतर विद्यार्थ्यांच्या गुणवत्तेत प्रत्यक्ष व मोजता येणारी वाढ दिसून आली आहे.',
        selectClass: 'इयत्ता निवडा'
      },
      dpdp: {
        title: 'डीपीडीपी कायदा २०२३ व बाल गोपनीयता संरक्षण',
        subtitle: 'डिजिटल वैयक्तिक डेटा संरक्षण कायदा, २०२३ आणि नियम, २०२५ रचना',
        dataMinimization: 'डेटा न्यूनीकरण तत्त्व (Data Minimization)',
        dataMinimizationDesc: 'केवळ हजेरी क्रमांक, इयत्ता आणि क्षमतांचे गुण साठवले जातात. विद्यार्थ्यांचे मूळ नाव ऐच्छिक असून सांकेतिक क्रमांकाने दर्शवले जाते.',
        purposeLimitation: 'हेतू मर्यादा (Purpose Limitation)',
        purposeLimitationDesc: 'माहितीचा वापर केवळ उपचारात्मक अध्यापनासाठी होतो. कोणतेही जाहिरात, ट्रॅकिंग किंवा व्यावसायिक वापर केला जात नाही.',
        parentalConsent: 'पालक संमती (कलम ९)',
        parentalConsentDesc: 'उपचारात्मक अध्यापनापूर्वी शाळेच्या नोंदवहीत पालकांची पडताळणी केलेली संमती नोंदवली जाते.',
        syntheticDemo: 'नमुना प्रात्यक्षिक डेटा (Synthetic Data)',
        syntheticDemoDesc: 'बालकांच्या गोपनीयतेच्या रक्षणासाठी या प्रात्यक्षिकामध्ये कोपरगाव तालुक्यातील शाळांचा १००% काल्पनिक डेटा वापरला आहे.',
        consentRegisterTitle: 'पालक संमती नोंदवही',
        consentTarget: '१००% संमती लक्ष्य',
        consentVerifiedBadge: 'संमती पडताळली',
        consentPendingBadge: 'संमती प्रलंबित',
        closeBtn: 'गोपनीयता माहिती बंद करा'
      },
      common: {
        rollPrefix: 'हजेरी क्र.',
        studentPrefix: 'विद्यार्थी',
        offlineBanner: 'ऑफलाईन मोड सक्रिय आहे. सर्व मूल्यांकन नोंदी व कृती आराखडे फोनमध्ये सुरक्षित सेव्ह होत आहेत. इंटरनेट आल्यावर आपोआप सुपाबेसशी सिंक होतील.',
        deleteTitle: 'नोंद हटवा',
        installApp: 'ॲप इन्स्टॉल करा',
        appReady: 'ॲप इन्स्टॉल झाले',
        classLabel: 'इयत्ता',
        allClasses: 'सर्व इयत्ता'
      }
    }
  },

  // -------------------------------------------------------------
  // 3. HINDI (हिन्दी - 100% pure Hindi)
  // -------------------------------------------------------------
  hi: {
    translation: {
      appName: 'लर्न-गैप एआई (LearnGap AI)',
      appTagline: 'सीखने के डेटा से कक्षा कार्य योजना तक',
      appSubtitle: 'बुनियादी शिक्षा निर्णय-सहायता प्रणाली',
      competitionBadge: 'आईआईटी बॉम्बे टेकफेस्ट',
      schoolName: 'प्राथमिक विद्यालय, कोपरगांव (अहिल्यानगर)',
      schoolSub: 'निपुण भारत और FLN उपचारात्मक कक्षा निर्णय प्रणाली',
      schoolLocation: 'अहिल्यानगर, महाराष्ट्र',
      offlineMode: 'ऑफ़लाइन तैयार',
      onlineMode: 'ऑनलाइन और सिंक',
      syncing: 'सुपाबेस से सिंक हो रहा है...',
      selectLanguage: 'भाषा चुनें',
      allLanguages: 'सभी भाषाएं',
      regionalCategory: 'प्रमुख क्षेत्रीय भाषाएं',
      tribalCategory: 'आदिवासी और जनजातीय भाषाएं',
      searchLanguages: 'क्षेत्रीय या आदिवासी भाषा खोजें...',
      roles: {
        teacher: 'कक्षा शिक्षक',
        head_teacher: 'प्रधानाध्यापक (CRC)',
        block_officer: 'प्रखंड शिक्षा अधिकारी (BEO)'
      },
      nav: {
        assessment: '१. मूल्यांकन डेटा',
        gapAnalysis: '२. सीखने की कमी इंजन',
        remedialPlan: '३. उपचारात्मक कार्य योजना',
        dashboard: '४. प्रगति डैशबोर्ड',
        dpdp: 'डीपीडीपी गोपनीयता व सहमति'
      },
      subjects: {
        all: 'सभी विषय',
        numeracy: 'गणित (संख्या ज्ञान)',
        literacy: 'भाषा (साक्षरता)'
      },
      urgency: {
        high: 'अति आवश्यक',
        moderate: 'मध्यम सहायता',
        mastered: 'दक्षता प्राप्त',
        highUrgency: 'उच्च प्राथमिकता',
        moderatePriority: 'मध्यम प्राथमिकता'
      },
      assessment: {
        title: 'मूल्यांकन डेटा प्रबंधक',
        subtitle: 'आधारभूत या अनुवर्ती अंक दर्ज करें या CSV फ़ाइल अपलोड करें। डेटा फोन पर ही जांचा जाता है।',
        manualEntry: 'त्वरित प्रविष्टि (Manual)',
        csvUpload: 'बैच CSV अपलोड',
        downloadSample: 'नमूना CSV डाउनलोड करें',
        studentAlias: 'विद्यार्थी (रोल नं. व नाम)',
        selectCompetency: 'सीखने का प्रतिफल / दक्षता',
        asmtType: 'मूल्यांकन प्रकार',
        baseline: 'आधारभूत मूल्यांकन (Baseline)',
        followup: 'अनुवर्ती मूल्यांकन (Follow-up)',
        scoreObtained: 'प्राप्तांक',
        totalMarks: 'पूर्णांक',
        calculatedPct: 'गणना किया गया प्रतिशत:',
        gapFlagged: 'कमी चिन्हित',
        mastered: 'दक्षता प्राप्त',
        saveRecord: 'अंक सुरक्षित करें',
        savedSuccess: 'डेटा फोन में सुरक्षित हो गया! ऑफ़लाइन विश्लेषण के लिए तैयार।',
        validationError: 'डेटा वैधता चेतावनी',
        recentRecords: 'कक्षा के नवीनतम मूल्यांकन रिकॉर्ड',
        totalRecords: 'कुल रिकॉर्ड:',
        filterByCompetency: 'सभी दक्षताएँ',
        noRecords: 'कोई रिकॉर्ड नहीं मिला। विद्यार्थी अंक दर्ज करें या नमूना डेटा का उपयोग करें।',
        tableRoll: 'रोल नं. / विद्यार्थी',
        tableComp: 'दक्षता',
        tableType: 'प्रकार',
        tableScore: 'अंक',
        tableStatus: 'स्थिति',
        tableAction: 'कार्य'
      },
      gaps: {
        title: 'लर्निंग गैप इंजन (पारदर्शी नियम आधारित)',
        subtitle: 'स्पष्ट और पारदर्शी मानदंड। एआई केवल शिक्षक-समीक्षित गतिविधियां सुझाता है।',
        thresholdNote: 'निपुण भारत दिशानिर्देशों के अनुसार मानक उत्तीर्ण सीमा ६०% निर्धारित है।',
        urgentRemediation: 'अति आवश्यक उपचारात्मक शिक्षण (< ४०%)',
        urgentSub: 'अंक मानक सीमा से काफी नीचे हैं',
        moderateRemediation: 'मध्यम सहायता की आवश्यकता (४०% - ५९%)',
        moderateSub: 'अंक मानक सीमा के करीब हैं',
        mastered: 'दक्षता प्राप्त (६०%+)',
        masteredSub: 'विद्यार्थियों ने मानक पूरा कर लिया है',
        rulesTitle: 'पारदर्शी नियम आधारित मानदंड:',
        rulesBody: 'गैप पहचान किसी अप्रमाणित AI अनुमान पर निर्भर नहीं है। ६०% से कम अंक वाले विद्यार्थियों को समान कठिनाई वाले समूहों में रखा जाता है। प्रत्येक गतिविधि का शैक्षणिक कारण स्पष्ट रूप से दर्शाया जाता है।',
        clustersTitle: 'चिन्हित कौशल-कमी समूह',
        studentsCount: 'विद्यार्थियों को सहायता चाहिए',
        targetPct: 'लक्ष्य:',
        createPlanBtn: 'इस समूह के लिए कार्य योजना बनाएं',
        noGapsMessage: 'सभी विद्यार्थियों ने इस दक्षता में मानक प्राप्त कर लिया है!',
        suggestedActivityLabel: 'सुझाई गई शिक्षक-समीक्षित गतिविधि:'
      },
      planner: {
        title: 'उपचारात्मक कार्य योजना निर्माता',
        subtitle: 'शिक्षक-समीक्षित गतिविधि बैंक, समय सारणी और १-पृष्ठ प्रिंट / व्हाट्सएप साझा योजना।',
        exportPdf: '१-पृष्ठ प्रिंट / PDF',
        shareWhatsApp: 'व्हाट्सएप पर भेजें',
        step1Title: 'लक्षित दक्षता और गतिविधि चयन',
        step2Title: 'समय सारणी और कक्षा अनुकूलन',
        step3Title: 'शिक्षक सत्यापन और अनुमोदन',
        selectCompLabel: 'दक्षता चुनें',
        selectActivityLabel: 'शिक्षक-समीक्षित गतिविधि',
        activityDuration: 'अवधि',
        minutes: 'मिनट',
        materialsRequired: 'आवश्यक सामग्री:',
        pedagogicalReason: 'शैक्षणिक कारण:',
        scheduleForWeek: 'नियोजित समय / सप्ताह',
        schedulePlaceholder: 'उदा. सोमवार से गुरुवार (दोपहर २:०० से २:३०)',
        teacherNotesLabel: 'शिक्षक की कक्षा टिप्पणी',
        teacherNotesPlaceholder: 'उदा. विद्यार्थियों को छोटे समूहों में बैठाकर ठोस वस्तुओं से अभ्यास कराना।',
        teacherReview: 'शिक्षक द्वारा प्रत्यक्ष सत्यापन',
        approveNotice: 'कक्षा में लागू करने से पहले कक्षा शिक्षक द्वारा इस योजना का अनुमोदन अनिवार्य है।',
        ethicsNoticeTitle: 'शैक्षणिक सुरक्षा गारंटी:',
        ethicsNoticeBody: 'एआई सुझाव केवल अनुमोदित पाठ्यक्रम बैंक तक सीमित हैं। अंतिम निर्णय शिक्षक का ही होता है।',
        approvePlanBtn: 'योजना अनुमोदित करें',
        planApproved: 'शिक्षक द्वारा योजना अनुमोदित',
        previewBanner: '१-पृष्ठ A4 कार्य योजना पूर्वावलोकन (प्रिंट व व्हाट्सएप तैयार):',
        previewSub: 'एक ही पृष्ठ पर सटीक रूप से व्यवस्थित प्रारूप',
        loadSavedPlan: 'पहले से सुरक्षित योजनाएं देखें',
        createNewPlan: '-- नई कार्य योजना बनाएं --',
        targetStudentsLabel: 'समूह के चयनित विद्यार्थी',
        planApprovedSuccess: 'शिक्षक द्वारा कार्य योजना सफलतापूर्वक अनुमोदित!'
      },
      printable: {
        officialHeading: 'प्राथमिक विद्यालय, कोपरगांव',
        planSubtitle: 'निपुण भारत / FLN उपचारात्मक कार्य योजना',
        competitionHeader: 'आईआईटी बॉम्बे टेकफेस्ट २०२६-२७ • टीम सुपरनोवा',
        udiseCode: 'UDISE+: २७२६०५०१२३४',
        gradeSectionLabel: 'कक्षा / वर्ग:',
        gradeSectionVal: 'कक्षा ३ (वर्ग अ)',
        subjectLabel: 'विषय:',
        scheduleLabel: 'समय सारणी:',
        statusLabel: 'स्थिति:',
        statusApproved: 'शिक्षक अनुमोदित',
        statusDraft: 'प्रारूप (Draft)',
        targetCompHeading: 'लक्षित सीखने की दक्षता',
        passThresholdLabel: 'उत्तीर्ण मानक सीमा:',
        targetLearnersHeading: 'उपचारात्मक समूह के विद्यार्थी',
        tableRoll: 'रोल नं.',
        tableLearner: 'विद्यार्थी कोड / नाम',
        tableLevel: 'वर्तमान स्तर',
        tableConsent: 'अभिभावक सहमति',
        remedialNeeded: 'उपचार आवश्यक (< ६०%)',
        consentVerified: 'अभिलेख में उपलब्ध',
        activityHeading: 'शिक्षक-समीक्षित उपचारात्मक गतिविधि',
        procedureLabel: 'चरणबद्ध शिक्षण विधि:',
        materialsLabel: 'आवश्यक शिक्षण सामग्री:',
        reasoningLabel: 'शैक्षणिक आधार व कारण:',
        teacherNotesHeading: 'शिक्षक की विशेष कक्षा टिप्पणियां:',
        signOffTitle: 'कक्षा शिक्षक हस्ताक्षर एवं अनुमोदन',
        signOffDeclaration: '"मैंने इस उपचारात्मक योजना की समीक्षा की है और कक्षा में क्रियान्वयन हेतु इसे अनुमोदित करता हूँ।"',
        teacherSignatureLabel: 'प्रणव जाधव (कक्षा शिक्षक)',
        dateLabel: 'दिनांक:'
      },
      dashboard: {
        title: 'प्रगति एवं निष्पत्ति डैशबोर्ड',
        subtitle: 'क्लोज्ड-लूप तुलना: आधारभूत और अनुवर्ती परिणामों की प्रत्यक्ष तुलना।',
        activeRoleLabel: 'सक्रिय भूमिका:',
        blockNotice: 'प्रखंड स्तर एकत्रित डेटा: DPDP अधिनियम के तहत छात्रों की व्यक्तिगत पहचान सुरक्षित है।',
        overallCoverage: 'मूल्यांकन पूर्णता दर',
        coverageTarget: 'लक्ष्य > ९०%',
        coverageSub: 'विद्यार्थियों का आधारभूत रिकॉर्ड दर्ज',
        baselinePassAvg: 'आधारभूत उत्तीर्ण प्रतिशत',
        baselineSub: 'उपचारात्मक शिक्षण से पूर्व का औसत',
        followupPassAvg: 'अनुवर्ती उत्तीर्ण प्रतिशत',
        gainBadge: 'शुद्ध सुधार',
        followupSub: 'उपचारात्मक गतिविधि के बाद का औसत',
        actionOnGaps: 'कार्य योजना निर्माण दर',
        actionTargetMet: 'लक्ष्य पूर्ण (>= ८०%)',
        actionSub: 'तैयार की गई शिक्षक कार्य योजनाएं',
        gapRecoverySummary: 'दक्षतावार अधिगम सुधार रिपोर्ट',
        summarySub: 'शिक्षक-अनुमोदित गतिविधियों के बाद परिणामों की प्रत्यक्ष तुलना।',
        legendBaseline: 'आधारभूत परीक्षा (Baseline)',
        legendFollowup: 'अनुवर्ती परीक्षा (Follow-up)',
        tableComp: 'दक्षता',
        tableThreshold: 'मानक सीमा',
        tableBaselinePass: 'आधारभूत उत्तीर्ण %',
        tableFollowupPass: 'अनुवर्ती उत्तीर्ण %',
        tableNetGain: 'शुद्ध वृद्धि',
        tableRecovered: 'सुधार हुआ',
        tableRemaining: 'शेष कमी',
        inProgressNotice: 'उपचारात्मक शिक्षण जारी है',
        recoveredBadge: 'विद्यार्थी सुधरे',
        persistentBadge: 'द्वितीय चक्र आवश्यक',
        noneBadge: 'कोई नहीं',
        insightHeading: 'निपुण भारत व FLN उपचारात्मक परिणाम सारांश',
        insightBody: 'पारंपरिक पोर्टलों पर मूल्यांकन डेटा केवल कागजी रिपोर्ट तक सीमित रहता है। लर्न-गैप एआई की सहायता से शिक्षकों द्वारा लक्षित उपचारात्मक शिक्षण के बाद विद्यार्थियों में स्पष्ट और मापने योग्य सुधार देखा गया है।',
        selectClass: 'कक्षा चुनें'
      },
      dpdp: {
        title: 'डीपीडीपी अधिनियम २०२३ और बाल गोपनीयता सुरक्षा',
        subtitle: 'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम २०२३ और नियम २०२५ संरचना',
        dataMinimization: 'डेटा न्यूनीकरण सिद्धांत (Data Minimization)',
        dataMinimizationDesc: 'केवल रोल नंबर, कक्षा और दक्षता अंक संग्रहीत किए जाते हैं। वास्तविक नाम वैकल्पिक हैं।',
        purposeLimitation: 'उद्देश्य सीमा (Purpose Limitation)',
        purposeLimitationDesc: 'डेटा का उपयोग केवल उपचारात्मक शिक्षण हेतु होता है। कोई विज्ञापन या ट्रैकिंग नहीं की जाती।',
        parentalConsent: 'अभिभावक सहमति (धारा ९)',
        parentalConsentDesc: 'उपचारात्मक शिक्षण से पूर्व विद्यालय के पास अभिभावक की सत्यापित सहमति अनिवार्य है।',
        syntheticDemo: 'काल्पनिक प्रदर्शन डेटा (Synthetic Data)',
        syntheticDemoDesc: 'बाल गोपनीयता की रक्षा के लिए इस प्रदर्शन में शत-प्रतिशत काल्पनिक डेटा का उपयोग किया गया है।',
        consentRegisterTitle: 'अभिभावक सहमति पंजी',
        consentTarget: '१००% सहमति लक्ष्य',
        consentVerifiedBadge: 'सहमति सत्यापित',
        consentPendingBadge: 'सहमति लंबित',
        closeBtn: 'गोपनीयता विवरण बंद करें'
      },
      common: {
        rollPrefix: 'रोल नं.',
        studentPrefix: 'विद्यार्थी',
        offlineBanner: 'ऑफ़लाइन मोड सक्रिय है। सभी रिकॉर्ड आपके डिवाइस पर सुरक्षित हैं। इंटरनेट उपलब्ध होने पर स्वतः सिंक हो जाएंगे।',
        deleteTitle: 'रिकॉर्ड हटाएं',
        installApp: 'ऐप इंस्टॉल करें',
        appReady: 'ऐप तैयार है',
        classLabel: 'कक्षा',
        allClasses: 'सभी कक्षाएं'
      }
    }
  }
};
