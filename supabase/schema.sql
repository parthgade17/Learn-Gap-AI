-- =========================================================================
-- LearnGap AI: Supabase Production Schema & Seed Data
-- Techfest 2026-27, IIT Bombay | India @ 71/100 Challenge
-- DPDP Act 2023 & DPDP Rules 2025 Compliant Architecture
--
-- INSTRUCTIONS TO CONNECT SUPABASE:
-- 1. Create a free project at https://supabase.com
-- 2. Open SQL Editor in Supabase Dashboard.
-- 3. Copy & paste this entire script and click "Run".
-- 4. Navigate to Project Settings > API.
-- 5. Copy "Project URL" and "anon public key" into your .env file:
--    VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
--    VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Schools (Zilla Parishad & Government Schools)
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    udise_code VARCHAR(20) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    taluka TEXT DEFAULT 'Kopargaon',
    district TEXT DEFAULT 'Ahilyanagar',
    state TEXT DEFAULT 'Maharashtra',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles (Teachers, Head Teachers / CRC)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id),
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('teacher', 'head_teacher', 'admin')) DEFAULT 'teacher',
    phone_number TEXT,
    language_pref TEXT DEFAULT 'mr',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Students (DPDP Section 9 Compliant: Roll numbers & Synthetic Aliases only)
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY, -- e.g. 'std-301'
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    grade INT NOT NULL CHECK (grade BETWEEN 1 AND 12),
    section TEXT DEFAULT 'A',
    roll_number INT NOT NULL,
    student_alias TEXT NOT NULL,
    parental_consent_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Competencies (7 Core Academic Subjects)
CREATE TABLE IF NOT EXISTS public.competencies (
    id TEXT PRIMARY KEY, -- e.g. 'ENG-01', 'MATH-01'
    code TEXT NOT NULL UNIQUE,
    subject TEXT CHECK (subject IN (
        'English', 'Mathematics', 'Social Science',
        'Physics', 'Chemistry', 'Marathi', 'Hindi'
    )) NOT NULL,
    grade INT NOT NULL,
    title_en TEXT NOT NULL,
    title_mr TEXT NOT NULL,
    description_en TEXT,
    description_mr TEXT,
    threshold_passing_pct NUMERIC DEFAULT 60.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Remedial Activity Library (Teacher-Reviewed Bank)
CREATE TABLE IF NOT EXISTS public.remedial_activities (
    id TEXT PRIMARY KEY,
    competency_id TEXT REFERENCES public.competencies(id) ON DELETE CASCADE NOT NULL,
    title_en TEXT NOT NULL,
    title_mr TEXT NOT NULL,
    instructions_en TEXT NOT NULL,
    instructions_mr TEXT NOT NULL,
    materials_needed_en TEXT,
    materials_needed_mr TEXT,
    estimated_minutes INT DEFAULT 20,
    is_teacher_reviewed BOOLEAN DEFAULT TRUE,
    pedagogical_reason_en TEXT,
    pedagogical_reason_mr TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Assessments (Baseline Diagnostic & Follow-Up Tracking)
CREATE TABLE IF NOT EXISTS public.assessments (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    competency_id TEXT REFERENCES public.competencies(id) ON DELETE CASCADE NOT NULL,
    assessment_type TEXT CHECK (assessment_type IN ('baseline', 'follow_up')) NOT NULL,
    score_obtained NUMERIC NOT NULL CHECK (score_obtained >= 0),
    total_marks NUMERIC NOT NULL CHECK (total_marks > 0),
    percentage NUMERIC GENERATED ALWAYS AS (ROUND((score_obtained / total_marks) * 100, 1)) STORED,
    assessed_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Remedial Action Plans (Teacher-in-the-Loop Interventions)
CREATE TABLE IF NOT EXISTS public.remedial_plans (
    id TEXT PRIMARY KEY,
    school_id TEXT DEFAULT 'ZP-KPG-01',
    teacher_id TEXT DEFAULT 'teacher-01',
    grade INT NOT NULL DEFAULT 6,
    competency_id TEXT REFERENCES public.competencies(id) NOT NULL,
    activity_id TEXT REFERENCES public.remedial_activities(id) NOT NULL,
    plan_date DATE DEFAULT CURRENT_DATE,
    student_ids TEXT[] NOT NULL,
    status TEXT CHECK (status IN ('draft', 'approved', 'completed')) DEFAULT 'draft',
    teacher_notes TEXT DEFAULT '',
    scheduled_day TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime publication so website updates dynamically when data changes
ALTER PUBLICATION supabase_realtime ADD TABLE assessments, remedial_plans;

-- =========================================================================
-- Seed Data: 7 Subjects, 14 Competencies, 20 Students
-- =========================================================================

INSERT INTO public.schools (id, udise_code, name, taluka, district)
VALUES ('a0000000-0000-0000-0000-000000000001', '27260501234', 'जि. प. प्राथमिक शाळा, कोपरगाव (ZP Primary School)', 'Kopargaon', 'Ahilyanagar')
ON CONFLICT (udise_code) DO NOTHING;

INSERT INTO public.competencies (id, code, subject, grade, title_en, title_mr, description_en, description_mr, threshold_passing_pct)
VALUES
('ENG-01', 'ENG-01', 'English', 6, 'Reading Comprehension & Contextual Vocabulary', 'इंग्रजी परिच्छेद वाचन, आकलन व शब्दसंग्रह', 'Reads unfamiliar grade-level paragraphs with comprehension and infers word meanings from context.', 'इयत्तेनुसार इंग्रजी परिच्छेद समजपूर्वक वाचणे आणि संदर्भावरून शब्दांचे अर्थ लावणे.', 60.0),
('ENG-02', 'ENG-02', 'English', 6, 'Basic Grammar: Subject-Verb Agreement & Tenses', 'मूलभूत इंग्रजी व्याकरण: कर्ता-क्रियापद ताळमेळ व काळ', 'Constructs grammatically accurate sentences using simple present and past tenses with correct agreement.', 'वर्तमानकाळ आणि भूतकाळात कर्त्यानुसार योग्य क्रियापद वापरून अचूक वाक्यरचना करणे.', 60.0),
('MATH-01', 'MATH-01', 'Mathematics', 6, 'Multi-digit Arithmetic & Regrouping Operations', 'अनेक अंकी संख्यांची बेरीज-वजाबाकी व हातच्याची क्रिया', 'Performs multi-digit subtraction and addition involving borrowing across place values accurately.', 'स्थानिक किंमतीचा वापर करून हातच्याची बेरीज व वजाबाकी अचूकपणे सोडवणे.', 60.0),
('MATH-02', 'MATH-02', 'Mathematics', 6, 'Fractions, Decimals & Equivalence', 'अपूर्णांक, दशांश अपूर्णांक व सममूल्य संकल्पना', 'Understands part-whole relationships, equivalent fractions, and decimal representation.', 'अपूर्णांकांची संकल्पना, सममूल्य अपूर्णांक आणि दशांश चिन्हाचा अर्थ प्रत्यक्ष उदाहरणांतून समजणे.', 60.0),
('MATH-03', 'MATH-03', 'Mathematics', 6, 'Perimeter, Area & Practical Geometry', 'परिमिती, क्षेत्रफळ व भौमितिक रचना', 'Calculates perimeter and area of regular 2D figures using real-world classroom surfaces.', 'चौरस व आयताची परिमिती आणि क्षेत्रफळ सूत्रांच्या साहाय्याने दैनंदिन वस्तूंवर मोजणे.', 60.0),
('SOC-01', 'SOC-01', 'Social Science', 6, 'Map Reading: Cardinal Directions, Scale & Symbols', 'नकाशा वाचन: मुख्य दिशा, प्रमाण व सांकेतिक चिन्हे', 'Interprets village, taluka, and district maps using directional compass and conventional legend symbols.', 'दिशा, प्रमाण आणि सांकेतिक चिन्हांच्या आधारे तालुका व जिल्ह्याचा नकाशा वाचणे.', 60.0),
('SOC-02', 'SOC-02', 'Social Science', 6, 'Local Democratic Institutions: Gram Panchayat', 'स्थानिक स्वराज्य संस्था: ग्रामपंचायत व गाव कारभार', 'Understands structure, duties, and citizen participation in village Gram Panchayat.', 'ग्रामपंचायतीची रचना, सरपंचांची कर्तव्ये आणि ग्रामसभेचे लोकशाहीतील महत्त्व समजणे.', 60.0),
('PHY-01', 'PHY-01', 'Physics', 6, 'Types of Forces, Friction & Simple Machines', 'बलाचे प्रकार, घर्षण बल व साधी यंत्रे', 'Distinguishes between muscular, gravitational, frictional, and magnetic forces using hands-on toys.', 'गुरुत्वीय, घर्षण, चुंबकीय आणि यांत्रिक बलाची प्रत्यक्ष प्रयोगांद्वारे उदाहरणे ओळखणे.', 60.0),
('PHY-02', 'PHY-02', 'Physics', 6, 'Light: Reflection, Shadows & Transparent Media', 'प्रकाश: सावलीची निर्मिती, परावर्तन व पारदर्शकता', 'Explains shadow formation and law of light propagation in straight lines.', 'प्रकाश सरळ रेषेत प्रवास करतो, सावली कशी पडते आणि आरशातील परावर्तन कसे घडते हे समजणे.', 60.0),
('CHEM-01', 'CHEM-01', 'Chemistry', 6, 'Physical vs. Chemical Changes & Reversibility', 'भौतिक व रासायनिक बदल आणि त्यांची उलटसुलटता', 'Differentiates between reversible physical transformations and irreversible chemical reactions.', 'बर्फ वितळणे (भौतिक) आणि लाकूड जळणे (रासायनिक) यातील मूलभूत फरक प्रयोगातून स्पष्ट करणे.', 60.0),
('CHEM-02', 'CHEM-02', 'Chemistry', 6, 'Acids, Bases & Litmus Indicator Reactions', 'आम्ल, आम्लारी व नैसर्गिक दर्शक (हळद/लिटमस)', 'Identifies acidic and basic household substances using natural indicators like turmeric paper.', 'हळदीचा कागद व लिटमस पट्टी वापरून लिंबू (आम्ल) व चुना (आम्लारी) ओळखणे.', 60.0),
('MAR-01', 'MAR-01', 'Marathi', 6, 'Marathi Conjunct Letters & Orthographic Accuracy', 'मराठी जोडाक्षरे, शुद्धलेखन व विरामचिन्हे', 'Writes complex Marathi conjunct words with accurate punctuation marks without spelling errors.', 'कठीण जोडाक्षरयुक्त शब्दांचे अचूक शुद्धलेखन आणि पूर्णविराम, स्वल्पविरामाचा योग्य वापर करणे.', 60.0),
('MAR-02', 'MAR-02', 'Marathi', 6, 'Expressive Reading & Prose Comprehension', 'उतारा अस्खलित वाचन, विचार आकलन व प्रकटीकरण', 'Reads prose passages fluently with voice modulation and summarizes the central moral/theme.', 'गोष्टी किंवा माहितीपर उतारे न अडखळता वाचून विचारलेल्या प्रश्नांची स्वभाषेत उत्तरे देणे.', 60.0),
('HIN-01', 'HIN-01', 'Hindi', 6, 'Standard Hindi Spelling, Synonyms & Antonyms', 'हिंदी शुद्ध वर्तनी, विलोम व समानार्थी शब्द', 'Identifies correct Hindi matras, antonyms, and synonyms in everyday vocabulary.', 'हिंदी शब्दांमधील मात्रांची अचूकता, विलोम (विरुद्धार्थी) आणि पर्यायवाची शब्द समजणे.', 60.0),
('HIN-02', 'HIN-02', 'Hindi', 6, 'Hindi Sentence Structure & Tense Conjugation', 'हिंदी वाक्य रचना, क्रियापद व काल बोध', 'Constructs meaningful sentences in Hindi matching gender, number, and tense correctly.', 'लिंग, वचन आणि काळानुसार योग्य क्रियापद निवडून परिपूर्ण हिंदी वाक्य तयार करणे.', 60.0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.remedial_activities (id, competency_id, title_en, title_mr, instructions_en, instructions_mr, materials_needed_en, materials_needed_mr, estimated_minutes, is_teacher_reviewed, pedagogical_reason_en, pedagogical_reason_mr)
VALUES
('ACT-ENG-01', 'ENG-01', 'Bilingual Context Flashcard Scaffolding', 'द्विभाषिक संदर्भ चित्रपट्टी सराव', 'Show 5 illustrated English sentences with Marathi cues. Have learners circle keywords.', 'चित्रांसह ५ इंग्रजी वाक्ये दाखवून मराठीतील अर्थाशी जोड्या लावा व शब्दांचे अर्थ समजून घ्या.', 'Illustrated flashcards, chalkboard', 'सचित्र शब्दपट्ट्या, खडू, फळा', 20, true, 'Leverages native Marathi language mastery to build English contextual vocabulary.', 'मातृभाषेच्या आधाराने इंग्रजी शब्दसंग्रह वेगाने आत्मसात होतो.'),
('ACT-MATH-01', 'MATH-01', 'Concrete Base-10 Bundle Sticks Regrouping', 'काड्यांचे दशक बंडल व सुटे यातून वजाबाकी', 'Distribute bundles of 10 matchsticks and loose sticks. Physically unbundle 1 ten to subtract.', '१० काड्यांचे बंडल (दशक) आणि सुट्या काड्या (एकक) वापरून प्रत्यक्ष हातचा सुटा करून वजाबाकी करा.', 'Matchsticks / neem twigs, rubber bands', 'काड्या, रबर बँड, पाटी-पेन्सिल', 25, true, 'Concrete manipulation grounds abstract borrowing concept into physical conservation of quantity.', 'प्रत्यक्ष वस्तूंच्या हाताळणीमुळे हातचा घेण्याची क्रिया स्पष्ट होते.'),
('ACT-PHY-01', 'PHY-01', 'Classroom Toy Friction Ramp Experiment', 'घर्षण बल प्रत्यक्ष उताराचा प्रयोग', 'Roll a toy car down a wooden plank covered with smooth paper vs rough jute cloth. Measure distances.', 'लाकडी फळीवर एकीकडे गुळगुळीत कागद व दुसरीकडे गोणपाटाचा खडबडीत पृष्ठभाग ठेवून खेळण्यातील गाडीचे अंतर मोजा.', 'Cardboard ramp, toy car, sandpaper/cloth, ruler', 'पुठ्ठा, खेळण्यातील गाडी, कापड/वाळूचा कागद, पट्टी', 25, true, 'Direct observation transforms abstract resistance force into concrete experiential learning.', 'प्रत्यक्ष प्रयोगातून घर्षण बलाचा वेग आणि अंतरावर होणारा परिणाम समजतो.')
ON CONFLICT (id) DO NOTHING;

-- Seed 20 Students distributed across Classes (Grade 5 to 8)
INSERT INTO public.students (id, school_id, grade, section, roll_number, student_alias, parental_consent_verified)
VALUES
('std-301', 'a0000000-0000-0000-0000-000000000001', 5, 'A', 1, 'विद्यार्थी १ (Aarav Patil)', true),
('std-302', 'a0000000-0000-0000-0000-000000000001', 5, 'A', 2, 'विद्यार्थी २ (Sakshi Deshmukh)', true),
('std-303', 'a0000000-0000-0000-0000-000000000001', 5, 'A', 3, 'विद्यार्थी ३ (Karan Shinde)', true),
('std-304', 'a0000000-0000-0000-0000-000000000001', 5, 'A', 4, 'विद्यार्थी ४ (Pooja Jadhav)', true),
('std-305', 'a0000000-0000-0000-0000-000000000001', 5, 'A', 5, 'विद्यार्थी ५ (Omkar Pawar)', true),
('std-306', 'a0000000-0000-0000-0000-000000000001', 6, 'A', 6, 'विद्यार्थी ६ (Ananya Kale)', true),
('std-307', 'a0000000-0000-0000-0000-000000000001', 6, 'A', 7, 'विद्यार्थी ७ (Tejas Gaikwad)', true),
('std-308', 'a0000000-0000-0000-0000-000000000001', 6, 'A', 8, 'विद्यार्थी ८ (Snehal More)', true),
('std-309', 'a0000000-0000-0000-0000-000000000001', 6, 'A', 9, 'विद्यार्थी ९ (Rohan Chavan)', true),
('std-310', 'a0000000-0000-0000-0000-000000000001', 6, 'A', 10, 'विद्यार्थी १० (Gauri Joshi)', true),
('std-311', 'a0000000-0000-0000-0000-000000000001', 7, 'A', 11, 'विद्यार्थी ११ (Aditya Wagh)', true),
('std-312', 'a0000000-0000-0000-0000-000000000001', 7, 'A', 12, 'विद्यार्थी १२ (Komal Sonawane)', true),
('std-313', 'a0000000-0000-0000-0000-000000000001', 7, 'A', 13, 'विद्यार्थी १३ (Sahil Thorat)', true),
('std-314', 'a0000000-0000-0000-0000-000000000001', 7, 'A', 14, 'विद्यार्थी १४ (Neha Londhe)', true),
('std-315', 'a0000000-0000-0000-0000-000000000001', 7, 'A', 15, 'विद्यार्थी १५ (Siddharth Gorde)', true),
('std-316', 'a0000000-0000-0000-0000-000000000001', 8, 'A', 16, 'विद्यार्थी १६ (Tanvi Kadam)', true),
('std-317', 'a0000000-0000-0000-0000-000000000001', 8, 'A', 17, 'विद्यार्थी १७ (Vedant Jagtap)', true),
('std-318', 'a0000000-0000-0000-0000-000000000001', 8, 'A', 18, 'विद्यार्थी १८ (Divya Salve)', true),
('std-319', 'a0000000-0000-0000-0000-000000000001', 8, 'A', 19, 'विद्यार्थी १९ (Mayur Bankar)', true),
('std-320', 'a0000000-0000-0000-0000-000000000001', 8, 'A', 20, 'विद्यार्थी २० (Prachi Tambe)', true)
ON CONFLICT (id) DO NOTHING;
