from typing import List
from ..models import Competency, RemedialActivity, Student, AssessmentRecord

ALL_SUBJECTS = [
    'English',
    'Mathematics',
    'Social Science',
    'Physics',
    'Chemistry',
    'Marathi',
    'Hindi'
]

FLN_COMPETENCIES: List[Competency] = [
    # 1. ENGLISH
    Competency(
        id='ENG-01',
        code='ENG-01',
        subject='English',
        grade=6,
        title_en='Reading Comprehension & Contextual Vocabulary',
        title_mr='इंग्रजी परिच्छेद वाचन, आकलन व शब्दसंग्रह',
        description_en='Reads unfamiliar grade-level paragraphs with comprehension and infers word meanings from context.',
        description_mr='इयत्तेनुसार इंग्रजी परिच्छेद समजपूर्वक वाचणे आणि संदर्भावरून शब्दांचे अर्थ लावणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='ENG-02',
        code='ENG-02',
        subject='English',
        grade=6,
        title_en='Basic Grammar: Subject-Verb Agreement & Tenses',
        title_mr='मूलभूत इंग्रजी व्याकरण: कर्ता-क्रियापद ताळमेळ व काळ',
        description_en='Constructs grammatically accurate sentences using simple present and past tenses with correct agreement.',
        description_mr='वर्तमानकाळ आणि भूतकाळात कर्त्यानुसार योग्य क्रियापद वापरून अचूक वाक्यरचना करणे.',
        threshold_passing_pct=60.0
    ),

    # 2. MATHEMATICS
    Competency(
        id='MATH-01',
        code='MATH-01',
        subject='Mathematics',
        grade=6,
        title_en='Multi-digit Arithmetic & Regrouping Operations',
        title_mr='अनेक अंकी संख्यांची बेरीज-वजाबाकी व हातच्याची क्रिया',
        description_en='Performs multi-digit subtraction and addition involving borrowing across place values accurately.',
        description_mr='स्थानिक किंमतीचा वापर करून हातच्याची बेरीज व वजाबाकी अचूकपणे सोडवणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='MATH-02',
        code='MATH-02',
        subject='Mathematics',
        grade=6,
        title_en='Fractions, Decimals & Equivalence',
        title_mr='अपूर्णांक, दशांश अपूर्णांक व सममूल्य संकल्पना',
        description_en='Understands part-whole relationships, equivalent fractions, and decimal representation.',
        description_mr='अपूर्णांकांची संकल्पना, सममूल्य अपूर्णांक आणि दशांश चिन्हाचा अर्थ प्रत्यक्ष उदाहरणांतून समजणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='MATH-03',
        code='MATH-03',
        subject='Mathematics',
        grade=6,
        title_en='Perimeter, Area & Practical Geometry',
        title_mr='परिमिती, क्षेत्रफळ व भौमितिक रचना',
        description_en='Calculates perimeter and area of regular 2D figures using real-world classroom surfaces.',
        description_mr='चौरस व आयताची परिमिती आणि क्षेत्रफळ सूत्रांच्या साहाय्याने दैनंदिन वस्तूंवर मोजणे.',
        threshold_passing_pct=60.0
    ),

    # 3. SOCIAL SCIENCE
    Competency(
        id='SOC-01',
        code='SOC-01',
        subject='Social Science',
        grade=6,
        title_en='Map Reading: Cardinal Directions, Scale & Symbols',
        title_mr='नकाशा वाचन: मुख्य दिशा, प्रमाण व सांकेतिक चिन्हे',
        description_en='Interprets village, taluka, and district maps using directional compass and conventional legend symbols.',
        description_mr='दिशा, प्रमाण आणि सांकेतिक चिन्हांच्या आधारे तालुका व जिल्ह्याचा नकाशा वाचणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='SOC-02',
        code='SOC-02',
        subject='Social Science',
        grade=6,
        title_en='Local Democratic Institutions: Gram Panchayat',
        title_mr='स्थानिक स्वराज्य संस्था: ग्रामपंचायत व गाव कारभार',
        description_en='Understands structure, duties, and citizen participation in village Gram Panchayat.',
        description_mr='ग्रामपंचायतीची रचना, सरपंचांची कर्तव्ये आणि ग्रामसभेचे लोकशाहीतील महत्त्व समजणे.',
        threshold_passing_pct=60.0
    ),

    # 4. PHYSICS
    Competency(
        id='PHY-01',
        code='PHY-01',
        subject='Physics',
        grade=6,
        title_en='Types of Forces, Friction & Simple Machines',
        title_mr='बलाचे प्रकार, घर्षण बल व साधी यंत्रे',
        description_en='Distinguishes between muscular, gravitational, frictional, and magnetic forces using hands-on toys.',
        description_mr='गुरुत्वीय, घर्षण, चुंबकीय आणि यांत्रिक बलाची प्रत्यक्ष प्रयोगांद्वारे उदाहरणे ओळखणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='PHY-02',
        code='PHY-02',
        subject='Physics',
        grade=6,
        title_en='Light: Reflection, Shadows & Transparent Media',
        title_mr='प्रकाश: सावलीची निर्मिती, परावर्तन व पारदर्शकता',
        description_en='Explains shadow formation and law of light propagation in straight lines.',
        description_mr='प्रकाश सरळ रेषेत प्रवास करतो, सावली कशी पडते आणि आरशातील परावर्तन कसे घडते हे समजणे.',
        threshold_passing_pct=60.0
    ),

    # 5. CHEMISTRY
    Competency(
        id='CHEM-01',
        code='CHEM-01',
        subject='Chemistry',
        grade=6,
        title_en='Physical vs. Chemical Changes & Reversibility',
        title_mr='भौतिक व रासायनिक बदल आणि त्यांची उलटसुलटता',
        description_en='Differentiates between reversible physical transformations and irreversible chemical reactions.',
        description_mr='बर्फ वितळणे (भौतिक) आणि लाकूड जळणे (रासायनिक) यातील मूलभूत फरक प्रयोगातून स्पष्ट करणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='CHEM-02',
        code='CHEM-02',
        subject='Chemistry',
        grade=6,
        title_en='Acids, Bases & Litmus Indicator Reactions',
        title_mr='आम्ल, आम्लारी व नैसर्गिक दर्शक (हळद/लिटमस)',
        description_en='Identifies acidic and basic household substances using natural indicators like turmeric paper.',
        description_mr='हळदीचा कागद व लिटमस पट्टी वापरून लिंबू (आम्ल) व चुना (आम्लारी) ओळखणे.',
        threshold_passing_pct=60.0
    ),

    # 6. MARATHI
    Competency(
        id='MAR-01',
        code='MAR-01',
        subject='Marathi',
        grade=6,
        title_en='Marathi Conjunct Letters & Orthographic Accuracy',
        title_mr='मराठी जोडाक्षरे, शुद्धलेखन व विरामचिन्हे',
        description_en='Writes complex Marathi conjunct words with accurate punctuation marks without spelling errors.',
        description_mr='कठीण जोडाक्षरयुक्त शब्दांचे अचूक शुद्धलेखन आणि पूर्णविराम, स्वल्पविरामाचा योग्य वापर करणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='MAR-02',
        code='MAR-02',
        subject='Marathi',
        grade=6,
        title_en='Expressive Reading & Prose Comprehension',
        title_mr='उतारा अस्खलित वाचन, विचार आकलन व प्रकटीकरण',
        description_en='Reads prose passages fluently with voice modulation and summarizes the central moral/theme.',
        description_mr='गोष्टी किंवा माहितीपर उतारे न अडखळता वाचून विचारलेल्या प्रश्नांची स्वभाषेत उत्तरे देणे.',
        threshold_passing_pct=60.0
    ),

    # 7. HINDI
    Competency(
        id='HIN-01',
        code='HIN-01',
        subject='Hindi',
        grade=6,
        title_en='Standard Hindi Spelling, Synonyms & Antonyms',
        title_mr='हिंदी शुद्ध वर्तनी, विलोम व समानार्थी शब्द',
        description_en='Identifies correct Hindi matras, antonyms, and synonyms in everyday vocabulary.',
        description_mr='हिंदी शब्दांमधील मात्रांची अचूकता, विलोम (विरुद्धार्थी) आणि पर्यायवाची शब्द समजणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='HIN-02',
        code='HIN-02',
        subject='Hindi',
        grade=6,
        title_en='Hindi Sentence Structure & Tense Conjugation',
        title_mr='हिंदी वाक्य रचना, क्रियापद व काल बोध',
        description_en='Constructs meaningful sentences in Hindi matching gender, number, and tense correctly.',
        description_mr='लिंग, वचन आणि काळानुसार योग्य क्रियापद निवडून परिपूर्ण हिंदी वाक्य तयार करणे.',
        threshold_passing_pct=60.0
    )
]

REMEDIAL_ACTIVITIES: List[RemedialActivity] = [
    RemedialActivity(
        id='ACT-ENG-01',
        competency_id='ENG-01',
        title_en='Bilingual Context Flashcard Scaffolding',
        title_mr='द्विभाषिक संदर्भ चित्रपट्टी सराव',
        instructions_en='Show 5 illustrated English sentences with Marathi cues. Have learners circle keywords.',
        instructions_mr='चित्रांसह ५ इंग्रजी वाक्ये दाखवून मराठीतील अर्थाशी जोड्या लावा व शब्दांचे अर्थ समजून घ्या.',
        materials_needed_en='Illustrated flashcards, chalkboard',
        materials_needed_mr='सचित्र शब्दपट्ट्या, खडू, फळा',
        estimated_minutes=20,
        pedagogical_reason_en='Leverages native Marathi language mastery to build English contextual vocabulary.',
        pedagogical_reason_mr='मातृभाषेच्या आधाराने इंग्रजी शब्दसंग्रह वेगाने आत्मसात होतो.'
    ),
    RemedialActivity(
        id='ACT-MATH-01',
        competency_id='MATH-01',
        title_en='Concrete Base-10 Bundle Sticks Regrouping',
        title_mr='काड्यांचे दशक बंडल व सुटे यातून वजाबाकी',
        instructions_en='Distribute bundles of 10 matchsticks and loose sticks. Physically unbundle 1 ten to subtract.',
        instructions_mr='१० काड्यांचे बंडल (दशक) आणि सुट्या काड्या (एकक) वापरून प्रत्यक्ष हातचा सुटा करून वजाबाकी करा.',
        materials_needed_en='Matchsticks / neem twigs, rubber bands',
        materials_needed_mr='काड्या, रबर बँड, पाटी-पेन्सिल',
        estimated_minutes=25,
        pedagogical_reason_en='Concrete manipulation grounds abstract borrowing concept into physical conservation of quantity.',
        pedagogical_reason_mr='प्रत्यक्ष वस्तूंच्या हाताळणीमुळे हातचा घेण्याची क्रिया स्पष्ट होते.'
    ),
    RemedialActivity(
        id='ACT-PHY-01',
        competency_id='PHY-01',
        title_en='Classroom Toy Friction Ramp Experiment',
        title_mr='घर्षण बल प्रत्यक्ष उताराचा प्रयोग',
        instructions_en='Roll a toy car down a wooden plank covered with smooth paper vs rough jute cloth. Measure distances.',
        instructions_mr='लाकडी फळीवर एकीकडे गुळगुळीत कागद व दुसरीकडे गोणपाटाचा खडबडीत पृष्ठभाग ठेवून खेळण्यातील गाडीचे अंतर मोजा.',
        materials_needed_en='Cardboard ramp, toy car, sandpaper/cloth, ruler',
        materials_needed_mr='पुठ्ठा, खेळण्यातील गाडी, कापड/वाळूचा कागद, पट्टी',
        estimated_minutes=25,
        pedagogical_reason_en='Direct observation transforms abstract resistance force into concrete experiential learning.',
        pedagogical_reason_mr='प्रत्यक्ष प्रयोगातून घर्षण बलाचा वेग आणि अंतरावर होणारा परिणाम समजतो.'
    )
]

INITIAL_STUDENTS: List[Student] = [
    Student(id=f'std-3{i+1:02d}', school_id='ZP-KPG-01', grade=5 + (i // 5), section='A', roll_number=i+1, student_alias=name)
    for i, name in enumerate([
        'विद्यार्थी १ (Aarav Patil)', 'विद्यार्थी २ (Sakshi Deshmukh)', 'विद्यार्थी ३ (Karan Shinde)',
        'विद्यार्थी ४ (Pooja Jadhav)', 'विद्यार्थी ५ (Omkar Pawar)', 'विद्यार्थी ६ (Ananya Kale)',
        'विद्यार्थी ७ (Tejas Gaikwad)', 'विद्यार्थी ८ (Snehal More)', 'विद्यार्थी ९ (Rohan Chavan)',
        'विद्यार्थी १० (Gauri Joshi)', 'विद्यार्थी ११ (Aditya Wagh)', 'विद्यार्थी १२ (Komal Sonawane)',
        'विद्यार्थी १३ (Sahil Thorat)', 'विद्यार्थी १४ (Neha Londhe)', 'विद्यार्थी १५ (Siddharth Gorde)',
        'विद्यार्थी १६ (Tanvi Kadam)', 'विद्यार्थी १७ (Vedant Jagtap)', 'विद्यार्थी १८ (Divya Salve)',
        'विद्यार्थी १९ (Mayur Bankar)', 'विद्यार्थी २० (Prachi Tambe)'
    ])
]
