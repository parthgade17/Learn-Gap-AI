import { Competency, RemedialActivity, SubjectType } from '../types';
import { LOCALIZED_COMPETENCIES, LOCALIZED_ACTIVITIES } from './localizedCurriculum';

export const ALL_SUBJECTS: SubjectType[] = [
  'English',
  'Mathematics',
  'Social Science',
  'Physics',
  'Chemistry',
  'Marathi',
  'Hindi'
];

export const FLN_COMPETENCIES: Competency[] = [
  // 1. ENGLISH
  {
    id: 'ENG-01',
    code: 'ENG-01',
    subject: 'English',
    grade: 6,
    title_en: 'Reading Comprehension & Contextual Vocabulary',
    title_mr: 'इंग्रजी परिच्छेद वाचन, आकलन व शब्दसंग्रह',
    description_en: 'Reads unfamiliar grade-level paragraphs with comprehension and infers word meanings from context.',
    description_mr: 'इयत्तेनुसार इंग्रजी परिच्छेद समजपूर्वक वाचणे आणि संदर्भावरून शब्दांचे अर्थ लावणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'ENG-02',
    code: 'ENG-02',
    subject: 'English',
    grade: 6,
    title_en: 'Basic Grammar: Subject-Verb Agreement & Tenses',
    title_mr: 'मूलभूत इंग्रजी व्याकरण: कर्ता-क्रियापद ताळमेळ व काळ',
    description_en: 'Constructs grammatically accurate sentences using simple present and past tenses with correct agreement.',
    description_mr: 'वर्तमानकाळ आणि भूतकाळात कर्त्यानुसार योग्य क्रियापद वापरून अचूक वाक्यरचना करणे.',
    threshold_passing_pct: 60,
  },

  // 2. MATHEMATICS
  {
    id: 'MATH-01',
    code: 'MATH-01',
    subject: 'Mathematics',
    grade: 6,
    title_en: 'Multi-digit Arithmetic & Regrouping Operations',
    title_mr: 'अनेक अंकी संख्यांची बेरीज-वजाबाकी व हातच्याची क्रिया',
    description_en: 'Performs multi-digit subtraction and addition involving borrowing across place values accurately.',
    description_mr: 'स्थानिक किंमतीचा वापर करून हातच्याची बेरीज व वजाबाकी अचूकपणे सोडवणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'MATH-02',
    code: 'MATH-02',
    subject: 'Mathematics',
    grade: 6,
    title_en: 'Fractions, Decimals & Equivalence',
    title_mr: 'अपूर्णांक, दशांश अपूर्णांक व सममूल्य संकल्पना',
    description_en: 'Understands part-whole relationships, equivalent fractions, and decimal representation.',
    description_mr: 'अपूर्णांकांची संकल्पना, सममूल्य अपूर्णांक आणि दशांश चिन्हाचा अर्थ प्रत्यक्ष उदाहरणांतून समजणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'MATH-03',
    code: 'MATH-03',
    subject: 'Mathematics',
    grade: 6,
    title_en: 'Perimeter, Area & Practical Geometry',
    title_mr: 'परिमिती, क्षेत्रफळ व भौमितिक रचना',
    description_en: 'Calculates perimeter and area of regular 2D figures using real-world classroom surfaces.',
    description_mr: 'चौरस व आयताची परिमिती आणि क्षेत्रफळ सूत्रांच्या साहाय्याने दैनंदिन वस्तूंवर मोजणे.',
    threshold_passing_pct: 60,
  },

  // 3. SOCIAL SCIENCE
  {
    id: 'SOC-01',
    code: 'SOC-01',
    subject: 'Social Science',
    grade: 6,
    title_en: 'Map Reading: Cardinal Directions, Scale & Symbols',
    title_mr: 'नकाशा वाचन: मुख्य दिशा, प्रमाण व सांकेतिक चिन्हे',
    description_en: 'Interprets village, taluka, and district maps using directional compass and conventional legend symbols.',
    description_mr: 'दिशा, प्रमाण आणि सांकेतिक चिन्हांच्या आधारे तालुका व जिल्ह्याचा नकाशा वाचणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'SOC-02',
    code: 'SOC-02',
    subject: 'Social Science',
    grade: 6,
    title_en: 'Local Democratic Institutions: Gram Panchayat',
    title_mr: 'स्थानिक स्वराज्य संस्था: ग्रामपंचायत व गाव कारभार',
    description_en: 'Understands structure, duties, and citizen participation in village Gram Panchayat.',
    description_mr: 'ग्रामपंचायतीची रचना, सरपंचांची कर्तव्ये आणि ग्रामसभेचे लोकशाहीतील महत्त्व समजणे.',
    threshold_passing_pct: 60,
  },

  // 4. PHYSICS
  {
    id: 'PHY-01',
    code: 'PHY-01',
    subject: 'Physics',
    grade: 6,
    title_en: 'Types of Forces, Friction & Simple Machines',
    title_mr: 'बलाचे प्रकार, घर्षण बल व साधी यंत्रे',
    description_en: 'Distinguishes between muscular, gravitational, frictional, and magnetic forces using hands-on toys.',
    description_mr: 'गुरुत्वीय, घर्षण, चुंबकीय आणि यांत्रिक बलाची प्रत्यक्ष प्रयोगांद्वारे उदाहरणे ओळखणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'PHY-02',
    code: 'PHY-02',
    subject: 'Physics',
    grade: 6,
    title_en: 'Light: Reflection, Shadows & Transparent Media',
    title_mr: 'प्रकाश: सावलीची निर्मिती, परावर्तन व पारदर्शकता',
    description_en: 'Explains shadow formation and law of light propagation in straight lines.',
    description_mr: 'प्रकाश सरळ रेषेत प्रवास करतो, सावली कशी पडते आणि आरशातील परावर्तन कसे घडते हे समजणे.',
    threshold_passing_pct: 60,
  },

  // 5. CHEMISTRY
  {
    id: 'CHEM-01',
    code: 'CHEM-01',
    subject: 'Chemistry',
    grade: 6,
    title_en: 'Physical vs. Chemical Changes & Reversibility',
    title_mr: 'भौतिक व रासायनिक बदल आणि त्यांची उलटसुलटता',
    description_en: 'Differentiates between reversible physical transformations and irreversible chemical reactions.',
    description_mr: 'बर्फ वितळणे (भौतिक) आणि लाकूड जळणे (रासायनिक) यातील मूलभूत फरक प्रयोगातून स्पष्ट करणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'CHEM-02',
    code: 'CHEM-02',
    subject: 'Chemistry',
    grade: 6,
    title_en: 'Acids, Bases & Litmus Indicator Reactions',
    title_mr: 'आम्ल, आम्लारी व नैसर्गिक दर्शक (हळद/लिटमस)',
    description_en: 'Identifies acidic and basic household substances using natural indicators like turmeric paper.',
    description_mr: 'हळदीचा कागद व लिटमस पट्टी वापरून लिंबू (आम्ल) व चुना (आम्लारी) ओळखणे.',
    threshold_passing_pct: 60,
  },

  // 6. MARATHI
  {
    id: 'MAR-01',
    code: 'MAR-01',
    subject: 'Marathi',
    grade: 6,
    title_en: 'Marathi Conjunct Letters & Orthographic Accuracy',
    title_mr: 'मराठी जोडाक्षरे, शुद्धलेखन व विरामचिन्हे',
    description_en: 'Writes complex Marathi conjunct words with accurate punctuation marks without spelling errors.',
    description_mr: 'कठीण जोडाक्षरयुक्त शब्दांचे अचूक शुद्धलेखन आणि पूर्णविराम, स्वल्पविरामाचा योग्य वापर करणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'MAR-02',
    code: 'MAR-02',
    subject: 'Marathi',
    grade: 6,
    title_en: 'Expressive Reading & Prose Comprehension',
    title_mr: 'उतारा अस्खलित वाचन, विचार आकलन व प्रकटीकरण',
    description_en: 'Reads prose passages fluently with voice modulation and summarizes the central moral/theme.',
    description_mr: 'गोष्टी किंवा माहितीपर उतारे न अडखळता वाचून विचारलेल्या प्रश्नांची स्वभाषेत उत्तरे देणे.',
    threshold_passing_pct: 60,
  },

  // 7. HINDI
  {
    id: 'HIN-01',
    code: 'HIN-01',
    subject: 'Hindi',
    grade: 6,
    title_en: 'Standard Hindi Spelling, Synonyms & Antonyms',
    title_mr: 'हिंदी शुद्ध वर्तनी, विलोम व समानार्थी शब्द',
    description_en: 'Identifies correct Hindi matras, antonyms, and synonyms in everyday vocabulary.',
    description_mr: 'हिंदी शब्दांमधील मात्रांची अचूकता, विलोम (विरुद्धार्थी) आणि पर्यायवाची शब्द समजणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'HIN-02',
    code: 'HIN-02',
    subject: 'Hindi',
    grade: 6,
    title_en: 'Hindi Sentence Structure & Tense Conjugation',
    title_mr: 'हिंदी वाक्य रचना, क्रियापद व काल बोध',
    description_en: 'Constructs meaningful sentences in Hindi matching gender, number, and tense correctly.',
    description_mr: 'लिंग, वचन आणि काळानुसार योग्य क्रियापद निवडून परिपूर्ण हिंदी वाक्य तयार करणे.',
    threshold_passing_pct: 60,
  }
];

export const REMEDIAL_ACTIVITIES: RemedialActivity[] = [
  // English activities
  {
    id: 'ACT-ENG-01',
    competency_id: 'ENG-01',
    title_en: 'Context Clue Mystery Reading Cards',
    title_mr: 'संदर्भ शोध वाचन कार्ड खेळ (Context Clues)',
    instructions_en: 'Distribute short 3-sentence mystery cards with one underlined new word. Students discuss in pairs what clue words in the sentence give away its meaning.',
    instructions_mr: 'विद्यार्थ्यांना ३ वाक्यांचे कार्ड द्या. वाक्यातील इतर शब्दांवरून अधोरेखित इंग्रजी शब्दाचा अर्थ शोधण्याचा जोडीने सराव घ्या.',
    materials_needed_en: 'Flashcards, highlighter pens, small English dictionary.',
    materials_needed_mr: 'शब्द कार्डे, हायलाइटर पेन्सिल.',
    estimated_minutes: 25,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Teaches contextual inference instead of rote vocabulary memorization.',
    pedagogical_reason_mr: 'पाठांतराऐवजी संदर्भावरून अर्थ लावण्याची क्षमता विकसित होते.'
  },
  {
    id: 'ACT-ENG-02',
    competency_id: 'ENG-02',
    title_en: 'Subject-Verb Domino Matching Game',
    title_mr: 'कर्ता व क्रियापद डोमिनो खेळ (Subject-Verb Domino)',
    instructions_en: 'Students match singular/plural subject tiles (He, They, The cats) with appropriate verb tiles (runs, run, was, were) on a puzzle board.',
    instructions_mr: 'विद्यार्थी एकवचनी व अनेकवचनी कर्त्यानुसार योग्य क्रियापदाची कार्डे जोडून सराव करतात.',
    materials_needed_en: 'Cardboard domino tiles with subjects and verbs.',
    materials_needed_mr: 'कार्डबोर्डवरील कर्ता व क्रियापद पट्ट्या.',
    estimated_minutes: 20,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Visual tile pairing solidifies grammatical agreement rules through active play.',
    pedagogical_reason_mr: 'प्रत्यक्ष खेळातून एकवचन-अनेकवचन क्रियापदाचा गोंधळ दूर होतो.'
  },

  // Mathematics activities
  {
    id: 'ACT-MATH-01',
    competency_id: 'MATH-01',
    title_en: 'Currency Exchange Regrouping Stall',
    title_mr: 'दुकानदार व सुटे नाणी: हातचा वजाबाकी सराव',
    instructions_en: 'Students roleplay a village grocery counter exchanging 100-rupee notes for 10-rupee notes to make change, solving borrowing deficits physically.',
    instructions_mr: 'खेळातील १०० व १० रुपयांच्या नोटा वापरून सुटे घेण्याची क्रिया प्रत्यक्ष करून हातच्याची वजाबाकी स्पष्ट करणे.',
    materials_needed_en: 'Play money notes (Rs 100, Rs 10, Rs 1) and slate.',
    materials_needed_mr: 'खेळातील कागदी नोटा व पाटी-पेन्सिल.',
    estimated_minutes: 30,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'CPA (Concrete-Pictorial-Abstract) removes subtraction regrouping errors permanently.',
    pedagogical_reason_mr: 'दशकाकडून सुटे घेण्याची संकल्पना प्रत्यक्ष नोटांच्या देवाणघेवाणीतून पक्की होते.'
  },
  {
    id: 'ACT-MATH-02',
    competency_id: 'MATH-02',
    title_en: 'Paper Folding Fraction Strips & Decimal Mat',
    title_mr: 'कागदी पट्ट्या दुमडून अपूर्णांक व दशांश शोध',
    instructions_en: 'Fold equal strips into halves, quarters, and eighths. Color parts to visualize 1/2 = 2/4 = 0.50. Compare lengths directly.',
    instructions_mr: 'रंगीत कागदाच्या समान पट्ट्या दुमडून १/२, १/४ आणि दशांश ०.५० सममूल्य कसे आहेत हे मोजून दाखवा.',
    materials_needed_en: 'Coloured rectangular paper strips, ruler, markers.',
    materials_needed_mr: 'रंगीत कागदी पट्ट्या, पट्टी आणि स्केचपेन.',
    estimated_minutes: 25,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Transforms abstract fraction numbers into tangible geometric lengths.',
    pedagogical_reason_mr: 'अपूर्णांकांची तुलना दृश्य स्वरूपात पाहिल्याने समज सुलभ होते.'
  },
  {
    id: 'ACT-MATH-03',
    competency_id: 'MATH-03',
    title_en: 'Classroom Surface Area & Perimeter Measuring Tape Project',
    title_mr: 'वर्गखोलीतील बाक व फळ्याचे क्षेत्रफळ व परिमिती मापन',
    instructions_en: 'Teams measure the perimeter and area of benches, blackboards, and classroom door frames using tailor tape.',
    instructions_mr: 'विद्यार्थ्यांच्या गटाने फळा, टेबल आणि दरवाजाची लांबी-रुंदी मोजपट्टीने मोजून परिमिती व क्षेत्रफळ काढणे.',
    materials_needed_en: 'Measuring tape (मीटर पट्टी), chalk, recording chart.',
    materials_needed_mr: 'मापन टेप, खडू, नोंद वही.',
    estimated_minutes: 30,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Applies geometric formulas to immediate physical surroundings.',
    pedagogical_reason_mr: 'सूत्रांचे पाठांतर न करता प्रत्यक्ष मापनातून क्षेत्रफळ समजते.'
  },

  // Social Science activities
  {
    id: 'ACT-SOC-01',
    competency_id: 'SOC-01',
    title_en: 'Classroom Treasure Hunt Map & Compass Navigation',
    title_mr: 'दिशा चक्र व वर्गातील खजिना शोध नकाशा (Treasure Hunt)',
    instructions_en: 'Hide an object in the schoolyard. Give students a directional sketch using North arrow, step count, and symbol legend to navigate.',
    instructions_mr: 'उत्तर दिशेचा बाण, पावलांचे मोजमाप आणि सांकेतिक चिन्हे असलेला नकाशा देऊन लपवलेली वस्तू शोधून काढणे.',
    materials_needed_en: 'Hand-drawn school map, magnetic toy compass, direction chart.',
    materials_needed_mr: 'शाळेचा नकाशा, दिशा दर्शक होकायंत्र.',
    estimated_minutes: 25,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Kinesthetic exploration connects spatial reasoning with symbolic cartography.',
    pedagogical_reason_mr: 'प्रत्यक्ष हालचालीतून नकाशातील दिशा व प्रमाणाची समज पक्की होते.'
  },
  {
    id: 'ACT-SOC-02',
    competency_id: 'SOC-02',
    title_en: 'Mock Gram Sabha Roleplay & Village Problem Resolution',
    title_mr: 'बाल ग्रामसभा नाट्यीकरण व गाव समस्या सोडवणूक',
    instructions_en: 'Students roleplay Sarpanch, Gram Sevak, and villagers to discuss drinking water and clean school surroundings.',
    instructions_mr: 'सरपंच, ग्रामसेवक आणि गावकरी यांची भूमिका घेऊन गावातील पाण्याच्या समस्येवर चर्चा करणे.',
    materials_needed_en: 'Badges (Sarpanch, Citizen), pretend resolution register.',
    materials_needed_mr: 'सरपंच व नागरिक बिल्ले, ग्रामसभा नोंदवही.',
    estimated_minutes: 30,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Experiential civics deepens understanding of democratic governance.',
    pedagogical_reason_mr: 'नाट्यीकरणातून स्थानिक स्वराज्य संस्थांची कार्यपद्धती लक्षात राहते.'
  },

  // Physics activities
  {
    id: 'ACT-PHY-01',
    competency_id: 'PHY-01',
    title_en: 'Ramp Friction Race: Smooth vs. Sandpaper Surface',
    title_mr: 'घर्षण बल शर्यत: गुळगुळीत लाकूड वि. सँडपेपर उतार',
    instructions_en: 'Roll toy cars down two ramps: one covered with smooth tile, another with rough sandpaper. Measure travel distance.',
    instructions_mr: 'गुळगुळीत फरशी आणि खडबडीત सँडपेपरवर खेळण्यातील गाडी सोडून घर्षणामुळे गती कशी मंदावते ते पाहणे.',
    materials_needed_en: 'Slanted cardboard ramp, toy cars, sandpaper, measuring scale.',
    materials_needed_mr: 'उताराची फळी, खेळण्यातील गाडी, सँडपेपर व पट्टी.',
    estimated_minutes: 25,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Empirical experimentation reveals friction as an opposing force.',
    pedagogical_reason_mr: 'गाडी थांबण्याचे कारण घर्षण बल आहे हे प्रयोगातून स्पष्ट होते.'
  },
  {
    id: 'ACT-PHY-02',
    competency_id: 'PHY-02',
    title_en: 'Torch Shadow Puppet Theater & Light Beam Reflection',
    title_mr: 'विजेरी, सावली नाट्य व आरशातील प्रकाश परावर्तन',
    instructions_en: 'Use a flashlight and plane mirror. Show how light bounces off the mirror and how moving the object closer to the light source changes shadow size.',
    instructions_mr: 'टॉर्च आणि आरशाचा वापर करून प्रकाशाचे परावर्तन आणि वस्तू जवळ आणल्यास सावली मोठी कशी होते हे दाखवणे.',
    materials_needed_en: 'Torch flashlight, plane mirror, cardboard cutout animals.',
    materials_needed_mr: 'टॉर्च, लहान आरसा, पुठ्ठ्याचे प्राणी.',
    estimated_minutes: 20,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Visual shadow play demonstrates straight-line light travel and reflection laws.',
    pedagogical_reason_mr: 'सावलीच्या खेळाद्वारे प्रकाशाचे सरळ रेषेतील वहन समजते.'
  },

  // Chemistry activities
  {
    id: 'ACT-CHEM-01',
    competency_id: 'CHEM-01',
    title_en: 'Candle Wax Melting vs. Sugar Caramelization Experiment',
    title_mr: 'मेण वितळणे (भौतिक) वि. साखर जळणे (रासायनिक बदल)',
    instructions_en: 'Demonstrate melting candle wax (solidifies back = physical) vs. heating sugar until black caramel forms (cannot reverse = chemical).',
    instructions_mr: 'मेण वितळल्यावर पुन्हा मेण बनते (भौतिक); पण साखर करपल्यावर काळा कोळसा बनतो (रासायनिक बदल) हा प्रयोग दाखवणे.',
    materials_needed_en: 'Spoon, candle, pinch of sugar, matchbox.',
    materials_needed_mr: 'मेणबत्ती, चमचा, थोडी साखर, काडेपेटी.',
    estimated_minutes: 25,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Concrete observation teaches reversibility as a test of chemical transformation.',
    pedagogical_reason_mr: 'उलटवता येणारे व न उलटवता येणारे बदल डोळ्यांसमोर पाहिल्याने फरक स्पष्ट होतो.'
  },
  {
    id: 'ACT-CHEM-02',
    competency_id: 'CHEM-02',
    title_en: 'Natural Turmeric Paper Acid-Base Indicator Testing',
    title_mr: 'हळद पट्टी नैसर्गिक दर्शक: लिंबू पाणी व साबण द्रावण चाचणी',
    instructions_en: 'Dip homemade turmeric filter paper strips into lemon juice (remains yellow = acid) and soap/lime water (turns bright red = base).',
    instructions_mr: 'हळद लावलेली कागदाची पट्टी लिंबाच्या रसात पिवळीच राहते, तर साबणाच्या पाण्यात लाल होते हे तपासून आम्ल-आम्लारी ओळखणे.',
    materials_needed_en: 'Paper strips coated with turmeric, lemon water, detergent water, dropper.',
    materials_needed_mr: 'हळदीच्या पट्ट्या, लिंबू पाणी, डिटर्जंट पाणी.',
    estimated_minutes: 25,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Safe kitchen chemistry introduces pH indicators without expensive laboratory kits.',
    pedagogical_reason_mr: 'परिसरातील साहित्यातून आम्ल व आम्लारी संकल्पना सुरक्षितपणे शिकता येते.'
  },

  // Marathi activities
  {
    id: 'ACT-MAR-01',
    competency_id: 'MAR-01',
    title_en: 'Marathi Joint-Letter Rail Express Flashcards',
    title_mr: 'जोडाक्षर आगगाडी व शब्द पट्टी खेळ',
    instructions_en: 'Cards with half-letters (क्, त्, स्) and base letters (य, व, त) joined to sound out "क्य", "स्त" and write complete words on blackboards.',
    instructions_mr: 'अर्धी अक्षरे व पूर्ण अक्षरे जोडून जोडाक्षर शब्द तयार करून फळ्यावर अचूक शुद्धलेखनाचा सराव घेणे.',
    materials_needed_en: 'Flashcards, chalk, printed Marathi word chart.',
    materials_needed_mr: 'अक्षर कार्डे, खडू, शब्द तक्ता.',
    estimated_minutes: 25,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Phonics-based physical association eliminates orthographic errors in conjunct consonants.',
    pedagogical_reason_mr: 'उच्चार आणि लेखनाचा ताळमेळ साधून जोडाक्षरांचे शुद्धलेखन सुधारते.'
  },
  {
    id: 'ACT-MAR-02',
    competency_id: 'MAR-02',
    title_en: 'Paired Expressive Story Reading & Moral Questioning',
    title_mr: 'जोडीने गोष्टीचे वाचन व विचार प्रकटीकरण चर्चा',
    instructions_en: 'Student pairs read an engaging folk tale with expression, pause for punctuation, and answer interpretive "Why" questions.',
    instructions_mr: 'दोन मुलांनी मिळून गोष्ट आवाजातील चढउतारासह वाचणे व गोष्टीवर स्वतःच्या भाषेत प्रश्नोत्तरे करणे.',
    materials_needed_en: 'Illustrated Marathi storybook reader.',
    materials_needed_mr: 'चित्रमय गोष्टीचे पुस्तक.',
    estimated_minutes: 20,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Develops oral expression and high-order critical comprehension.',
    pedagogical_reason_mr: 'वाचनासोबतच विचार मांडण्याची आणि अर्थ समजून घेण्याची क्षमता वाढते.'
  },

  // Hindi activities
  {
    id: 'ACT-HIN-01',
    competency_id: 'HIN-01',
    title_en: 'Hindi Matra Magic Card Substitution Drill',
    title_mr: 'हिंदी मात्रा जादू कार्ड व विलोम शब्द सराव',
    instructions_en: 'Use vowel sign cards (ि vs ी, ु vs ू) to demonstrate how changing matras alters word meaning (दिन = day, दीन = poor). Practice opposite word pairs.',
    instructions_mr: 'ह्रस्व आणि दीर्घ मात्रा बदलल्याने शब्दाचा अर्थ कसा बदलतो (दिन = दिवस, दीन = गरीब) हे कार्डांद्वारे दाखवणे व विरुद्धार्थी शब्दांचा सराव घेणे.',
    materials_needed_en: 'Matra flashcards, Hindi vocabulary chart.',
    materials_needed_mr: 'मात्रा कार्डे, हिंदी शब्द तक्ता.',
    estimated_minutes: 25,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Resolves common vowel-length phonetic confusion in elementary Hindi writing.',
    pedagogical_reason_mr: 'मात्रांच्या उच्चारातील सूक्ष्म फरक प्रत्यक्ष उदाहरणातून स्पष्ट होतो.'
  },
  {
    id: 'ACT-HIN-02',
    competency_id: 'HIN-02',
    title_en: 'Hindi Sentence Scramble Relay & Tense Agreement',
    title_mr: 'हिंदी वाक्य जुळवा शर्यत व काल-लिंग मेळ',
    instructions_en: 'Give scrambled word strips (लड़का, किताब, पढ़ता है). Teams arrange them correctly and transform them into past tense (लड़के ने किताब पढ़ी).',
    instructions_mr: 'विस्कळीत शब्दांच्या पट्ट्या जोडून योग्य वाक्य बनवणे आणि त्याचे भूतकाळात रूपांतर करण्याचा गट सराव घेणे.',
    materials_needed_en: 'Laminated sentence strip puzzles, marker.',
    materials_needed_mr: 'शब्द पट्ट्या, मार्कर पेन.',
    estimated_minutes: 25,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Kinesthetic sentence assembly internalizes SOV (Subject-Object-Verb) grammar rules.',
    pedagogical_reason_mr: 'वाक्यातील लिंग व काळानुसार क्रियापद बदलण्याचे नियम प्रत्यक्ष सरावातून समजतात.'
  }
];

// Helper to get fallback language based on linguistic family
function getFamilyFallbackLang(lang: string): string {
  // Devanagari based tribal & regional languages
  if (['gon', 'bhi', 'kru', 'unr', 'brx', 'korku'].includes(lang)) return 'hi';
  // Bengali script based
  if (['as', 'trp'].includes(lang)) return 'bn';
  // Santali
  if (lang === 'sat') return 'hi';
  return 'en';
}

export function getCompetencyTitle(comp: Competency, lang: string): string {
  if (lang === 'mr') return comp.title_mr || comp.title_en;
  
  // Check exact language in localized dictionary
  const direct = LOCALIZED_COMPETENCIES[lang]?.[comp.id]?.title;
  if (direct) return direct;

  // Check language family fallback
  const fallback = getFamilyFallbackLang(lang);
  if (fallback !== 'en') {
    const familyTitle = LOCALIZED_COMPETENCIES[fallback]?.[comp.id]?.title;
    if (familyTitle) return familyTitle;
  }

  return comp.title_en;
}

export function getCompetencyDescription(comp: Competency, lang: string): string {
  if (lang === 'mr') return comp.description_mr || comp.description_en;

  const direct = LOCALIZED_COMPETENCIES[lang]?.[comp.id]?.description;
  if (direct) return direct;

  const fallback = getFamilyFallbackLang(lang);
  if (fallback !== 'en') {
    const familyDesc = LOCALIZED_COMPETENCIES[fallback]?.[comp.id]?.description;
    if (familyDesc) return familyDesc;
  }

  return comp.description_en;
}

export function getActivityTitle(act: RemedialActivity, lang: string): string {
  if (lang === 'mr') return act.title_mr || act.title_en;

  const direct = LOCALIZED_ACTIVITIES[lang]?.[act.id]?.title;
  if (direct) return direct;

  const fallback = getFamilyFallbackLang(lang);
  if (fallback !== 'en') {
    const familyTitle = LOCALIZED_ACTIVITIES[fallback]?.[act.id]?.title;
    if (familyTitle) return familyTitle;
  }

  return act.title_en;
}

export function getActivityInstructions(act: RemedialActivity, lang: string): string {
  if (lang === 'mr') return act.instructions_mr || act.instructions_en;

  const direct = LOCALIZED_ACTIVITIES[lang]?.[act.id]?.instructions;
  if (direct) return direct;

  const fallback = getFamilyFallbackLang(lang);
  if (fallback !== 'en') {
    const familyInst = LOCALIZED_ACTIVITIES[fallback]?.[act.id]?.instructions;
    if (familyInst) return familyInst;
  }

  return act.instructions_en;
}

export function getActivityMaterials(act: RemedialActivity, lang: string): string {
  if (lang === 'mr') return act.materials_needed_mr || act.materials_needed_en;

  const direct = LOCALIZED_ACTIVITIES[lang]?.[act.id]?.materials;
  if (direct) return direct;

  const fallback = getFamilyFallbackLang(lang);
  if (fallback !== 'en') {
    const familyMat = LOCALIZED_ACTIVITIES[fallback]?.[act.id]?.materials;
    if (familyMat) return familyMat;
  }

  return act.materials_needed_en;
}

export function getActivityReasoning(act: RemedialActivity, lang: string): string {
  if (lang === 'mr') return act.pedagogical_reason_mr || act.pedagogical_reason_en;

  const direct = LOCALIZED_ACTIVITIES[lang]?.[act.id]?.reasoning;
  if (direct) return direct;

  const fallback = getFamilyFallbackLang(lang);
  if (fallback !== 'en') {
    const familyReas = LOCALIZED_ACTIVITIES[fallback]?.[act.id]?.reasoning;
    if (familyReas) return familyReas;
  }

  return act.pedagogical_reason_en;
}

export function formatStudentDisplay(
  student: { roll_number: number; student_alias: string },
  lang: string
): string {
  const match = student.student_alias.match(/\((.*?)\)/);
  const rawName = match ? match[1] : student.student_alias.replace(/विद्यार्थी\s*\d+\s*/, '').trim();
  const name = rawName || `Learner ${student.roll_number}`;

  const prefixes: Record<string, { roll: string; student: string }> = {
    mr: { roll: 'हजेरी क्र.', student: 'विद्यार्थी' },
    hi: { roll: 'रोल नं.', student: 'विद्यार्थी' },
    gu: { roll: 'રોલ નં.', student: 'વિદ્યાર્થી' },
    bn: { roll: 'রোল নং', student: 'শিক্ষার্থী' },
    ta: { roll: 'வரிசை எண்', student: 'மாணவர்' },
    te: { roll: 'రోల్ నం.', student: 'విద్యార్థి' },
    kn: { roll: 'ರೋಲ್ ನಂ.', student: 'ವಿದ್ಯಾರ್ಥಿ' },
    ml: { roll: 'റോൾ നമ്പർ', student: 'വിദ്യാർത്ഥി' },
    or: { roll: 'ରୋଲ୍ ନଂ', student: 'ଛାତ୍ର/ଛାତ୍ରୀ' },
    pa: { roll: 'ਰੋਲ ਨੰ.', student: 'ਵਿਦਿਆਰਥੀ' },
    as: { roll: 'ৰোল নং', student: 'শিক্ষাৰ্থী' },
    ur: { roll: 'رول نمبر', student: 'طالب علم' },
    sat: { roll: 'ᱨᱳᱞ ᱱᱚ.', student: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ' },
    gon: { roll: 'रोल नं.', student: 'चेला' },
    bhi: { roll: 'रोल नं.', student: 'भणाविया' },
    kru: { roll: 'रोल नं.', student: 'पढ़ुआ' },
    hoc: { roll: 'ᱨᱳᱞ ᱱᱚ.', student: 'ᱤᱛᱩᱱᱤᱭᱟᱹ' },
    unr: { roll: 'रोल नं.', student: 'पढ़ुआ' },
    brx: { roll: 'र’ल नम्बर', student: 'सोलोंगो' },
    trp: { roll: 'রোল নং', student: 'ফোরোংনাই' },
    lus: { roll: 'Roll No.', student: 'Zirlai' },
    kha: { roll: 'Roll No.', student: 'Khynnah Pule' },
    korku: { roll: 'रोल नं.', student: 'पढ़नया' },
    en: { roll: 'Roll No.', student: 'Learner' }
  };

  const p = prefixes[lang] || prefixes.en;
  return `${p.roll} ${student.roll_number} - ${p.student} ${student.roll_number} (${name})`;
}

export function getSubjectName(subject: SubjectType, lang: string): string {
  const subjectMap: Record<string, Partial<Record<SubjectType, string>>> = {
    mr: {
      English: 'इंग्रजी',
      Mathematics: 'गणित',
      'Social Science': 'सामाजिक शास्त्रे',
      Physics: 'भौतिकशास्त्र',
      Chemistry: 'रसायनशास्त्र',
      Marathi: 'मराठी',
      Hindi: 'हिंदी'
    },
    hi: {
      English: 'अंग्रेज़ी',
      Mathematics: 'गणित',
      'Social Science': 'सामाजिक विज्ञान',
      Physics: 'भौतिक विज्ञान',
      Chemistry: 'रसायन विज्ञान',
      Marathi: 'मराठी',
      Hindi: 'हिन्दी'
    },
    gu: {
      English: 'અંગ્રેજી',
      Mathematics: 'ગણિત',
      'Social Science': 'સામાજિક વિજ્ઞાન',
      Physics: 'ભૌતિક વિજ્ઞાન',
      Chemistry: 'રસાયણ વિજ્ઞાન',
      Marathi: 'મરાઠી',
      Hindi: 'હિન્દી'
    },
    bn: {
      English: 'ইংরেজি',
      Mathematics: 'গণিত',
      'Social Science': 'সমাজ বিজ্ঞান',
      Physics: 'পদার্থবিজ্ঞান',
      Chemistry: 'রসায়ন',
      Marathi: 'মারাঠি',
      Hindi: 'হিন্দি'
    },
    ta: {
      English: 'ஆங்கிலம்',
      Mathematics: 'கணிதம்',
      'Social Science': 'சமூக அறிவியல்',
      Physics: 'இயற்பியல்',
      Chemistry: 'வேதியியல்',
      Marathi: 'மராத்தி',
      Hindi: 'இந்தி'
    },
    te: {
      English: 'ఇంగ్లీష్',
      Mathematics: 'గణితం',
      'Social Science': 'సాంఘిక శాస్త్రం',
      Physics: 'భౌతిక శాస్త్రం',
      Chemistry: 'రసాయన శాస్త్రం',
      Marathi: 'మరాఠీ',
      Hindi: 'హిందీ'
    },
    kn: {
      English: 'ಇಂಗ್ಲಿಷ್',
      Mathematics: 'ಗಣಿತ',
      'Social Science': 'ಸಮಾಜ ವಿಜ್ಞಾನ',
      Physics: 'ಭೌತಶಾಸ್ತ್ರ',
      Chemistry: 'ರಸಾಯನಶಾಸ್ತ್ರ',
      Marathi: 'ಮರಾಠಿ',
      Hindi: 'ಹಿಂದಿ'
    },
    ml: {
      English: 'ഇംഗ്ലീഷ്',
      Mathematics: 'ഗണിതം',
      'Social Science': 'സാമൂഹിക ശാസ്ത്രം',
      Physics: 'ഭൗതികശാസ്ത്രം',
      Chemistry: 'രസതന്ത്രം',
      Marathi: 'മറാഠി',
      Hindi: 'ഹിന്ദി'
    },
    or: {
      English: 'ଇଂରାଜୀ',
      Mathematics: 'ଗଣିତ',
      'Social Science': 'ସାମାଜିକ ବିଜ୍ଞାନ',
      Physics: 'ପଦାର୍ଥ ବିଜ୍ଞାନ',
      Chemistry: 'ରସାୟନ ବିଜ୍ଞାନ',
      Marathi: 'ମରାଠୀ',
      Hindi: 'ହିନ୍ଦୀ'
    },
    pa: {
      English: 'ਅੰਗਰੇਜ਼ੀ',
      Mathematics: 'ਗਣਿਤ',
      'Social Science': 'ਸਮਾਜਿਕ ਵਿਗਿਆਨ',
      Physics: 'ਭੌਤਿਕ ਵਿਗਿਆਨ',
      Chemistry: 'ਰਸਾਇਣ ਵਿਗਿਆਨ',
      Marathi: 'ਮਰਾਠੀ',
      Hindi: 'ਹਿੰਦੀ'
    },
    as: {
      English: 'ইংৰাজী',
      Mathematics: 'গণিত',
      'Social Science': 'সমাজ বিজ্ঞান',
      Physics: 'পদাৰ্থ বিজ্ঞান',
      Chemistry: 'ৰসায়ন বিজ্ঞান',
      Marathi: 'মাৰাঠী',
      Hindi: 'হিন্দী'
    },
    ur: {
      English: 'انگریزی',
      Mathematics: 'ریاضی',
      'Social Science': 'سماجی علوم',
      Physics: 'طبیعیات',
      Chemistry: 'کیمیا',
      Marathi: 'مراٹھی',
      Hindi: 'ہندی'
    },
    sat: {
      English: 'ᱤᱝᱞᱤᱥ (English)',
      Mathematics: 'ᱞᱮᱠᱷᱟ (Math)',
      'Social Science': 'ᱥᱟᱶᱛᱟ ᱥᱟᱬᱮᱥ',
      Physics: 'ᱯᱷᱤᱡᱤᱠᱥ',
      Chemistry: 'ᱠᱮᱢᱤᱥᱴᱨᱤ',
      Marathi: 'ᱢᱟᱨᱟᱴᱷᱤ',
      Hindi: 'ᱦᱤᱱᱫᱤ'
    }
  };

  const familyLang = getFamilyFallbackLang(lang);
  return subjectMap[lang]?.[subject] || (familyLang !== 'en' ? subjectMap[familyLang]?.[subject] : undefined) || subject;
}

export function formatClassDisplay(grade: number | string, lang: string): string {
  if (grade === 'ALL' || grade === 'all') {
    const allLabels: Record<string, string> = {
      mr: 'सर्व वर्ग',
      hi: 'सभी कक्षाएँ',
      gu: 'બધા વર્ગો',
      bn: 'সকল শ্রেণি',
      ta: 'அனைத்து வகுப்புகள்',
      te: 'అన్ని తరగతులు',
      kn: 'ಎಲ್ಲಾ ತರಗತಿಗಳು',
      ml: 'എല്ലാ ക്ലാസുകളും',
      or: 'ସମସ୍ତ ଶ୍ରେଣୀ',
      pa: 'ਸਾਰੀਆਂ ਜਮਾਤਾਂ',
      as: 'সকলো শ্ৰেণী',
      ur: 'تمام جماعتیں',
      sat: 'ᱡᱚᱛᱚ ᱪᱟᱱᱟᱪ',
      gon: 'सब्बो ककसा',
      bhi: 'बधी कक्षाओ',
      kru: 'हुर्मि ककसा',
      hoc: 'ᱡᱚᱛᱚ ᱪᱟᱱᱟᱪ',
      unr: 'सबेन ककसा',
      brx: 'गासै थाखो',
      trp: 'জত ক্লাস',
      lus: 'Class Zawng Zawng',
      kha: 'Baroh ki Klas',
      korku: 'सब्बो ककसा',
      en: 'All Classes'
    };
    return allLabels[lang] || allLabels.en;
  }

  const gradeStr = grade.toString();
  const classPatterns: Record<string, (g: string) => string> = {
    mr: (g) => `इयत्ता ${g} वी - अ`,
    hi: (g) => `कक्षा ${g} - अ`,
    gu: (g) => `ધોરણ ${g} - અ`,
    bn: (g) => `শ্রেণি ${g} - ক`,
    ta: (g) => `வகுப்பு ${g} - அ`,
    te: (g) => `తరగతి ${g} - ఎ`,
    kn: (g) => `ತರಗತಿ ${g} - ಎ`,
    ml: (g) => `ക്ലാസ് ${g} - എ`,
    or: (g) => `ଶ୍ରେଣୀ ${g} - କ`,
    pa: (g) => `ਜਮਾਤ ${g} - ਏ`,
    as: (g) => `শ্ৰেণী ${g} - ক`,
    ur: (g) => `جماعت ${g} - الف`,
    sat: (g) => `ᱪᱟᱱᱟᱪ ${g} - ᱮ`,
    gon: (g) => `ककसा ${g} - अ`,
    bhi: (g) => `कक्षा ${g} - अ`,
    kru: (g) => `ककसा ${g} - अ`,
    hoc: (g) => `ᱪᱟᱱᱟᱪ ${g} - ᱮ`,
    unr: (g) => `ककसा ${g} - अ`,
    brx: (g) => `थाखो ${g} - ए`,
    trp: (g) => `ক্লাস ${g} - ক`,
    lus: (g) => `Class ${g} - A`,
    kha: (g) => `Klas ${g} - A`,
    korku: (g) => `ककसा ${g} - अ`,
    en: (g) => `Class ${g}th - A`
  };

  const pattern = classPatterns[lang] || classPatterns.en;
  return pattern(gradeStr);
}

