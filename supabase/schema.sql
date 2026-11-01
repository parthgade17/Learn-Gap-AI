-- =========================================================================
-- LearnGap AI: Supabase Schema with Row Level Security (RLS) & Seed Data
-- Aligned with: India @ 71/100 Challenge, Techfest 2026-27, IIT Bombay
-- Compliant with: DPDP Act 2023 & DPDP Rules 2025
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Schools (Zilla Parishad & Government Primary Schools)
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    udise_code VARCHAR(20) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    taluka TEXT DEFAULT 'Kopargaon',
    district TEXT DEFAULT 'Ahilyanagar',
    state TEXT DEFAULT 'Maharashtra',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles (Teachers, Head Teachers / CRC, Block Officers)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id),
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('teacher', 'head_teacher', 'block_officer', 'admin')) DEFAULT 'teacher',
    phone_number TEXT,
    language_pref TEXT DEFAULT 'mr',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Students (Data-minimized for DPDP Section 9 compliance: only Roll Numbers & Aliases)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    grade INT NOT NULL CHECK (grade BETWEEN 1 AND 5),
    section TEXT DEFAULT 'A',
    roll_number INT NOT NULL,
    student_alias TEXT NOT NULL, -- e.g. "Learner #01" or optional pseudonym
    parental_consent_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (school_id, grade, section, roll_number)
);

-- 4. Competencies (NIPUN Bharat & PARAKH Foundational Learning Outcomes)
CREATE TABLE IF NOT EXISTS public.competencies (
    id TEXT PRIMARY KEY, -- e.g. 'FLN-NUM-01'
    code TEXT NOT NULL UNIQUE, -- e.g. 'NUM-01'
    subject TEXT CHECK (subject IN ('Literacy', 'Numeracy')) NOT NULL,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    competency_id TEXT REFERENCES public.competencies(id) ON DELETE CASCADE NOT NULL,
    assessment_type TEXT CHECK (assessment_type IN ('baseline', 'follow_up')) NOT NULL,
    score_obtained NUMERIC NOT NULL CHECK (score_obtained >= 0),
    total_marks NUMERIC NOT NULL CHECK (total_marks > 0),
    percentage NUMERIC GENERATED ALWAYS AS (ROUND((score_obtained / total_marks) * 100, 1)) STORED,
    assessed_by UUID REFERENCES public.profiles(id),
    assessed_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Remedial Action Plans (Teacher-in-the-Loop Approved Interventions)
CREATE TABLE IF NOT EXISTS public.remedial_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id),
    grade INT NOT NULL,
    competency_id TEXT REFERENCES public.competencies(id) NOT NULL,
    activity_id TEXT REFERENCES public.remedial_activities(id) NOT NULL,
    plan_date DATE DEFAULT CURRENT_DATE,
    student_ids UUID[] NOT NULL,
    status TEXT CHECK (status IN ('draft', 'approved', 'completed')) DEFAULT 'draft',
    teacher_notes TEXT,
    scheduled_day TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Audit Logs (DPDP Act Accountability & Access Records)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- Row Level Security (RLS) Policies
-- =========================================================================

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedial_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedial_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Competencies and Activities are publicly readable by teachers
CREATE POLICY "Public read for competencies" ON public.competencies FOR SELECT USING (true);
CREATE POLICY "Public read for remedial activities" ON public.remedial_activities FOR SELECT USING (true);

-- Students: Only accessible by staff belonging to the same school
CREATE POLICY "School staff can view school students" ON public.students
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
    );

-- Assessments: Teachers can insert and view assessments for their school
CREATE POLICY "Staff can view school assessments" ON public.assessments
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE school_id IN (
                SELECT school_id FROM public.profiles WHERE profiles.id = auth.uid()
            )
        )
    );

CREATE POLICY "Staff can insert assessments" ON public.assessments
    FOR INSERT WITH CHECK (
        student_id IN (
            SELECT id FROM public.students WHERE school_id IN (
                SELECT school_id FROM public.profiles WHERE profiles.id = auth.uid()
            )
        )
    );

-- Remedial Plans: Teachers can manage plans for their school
CREATE POLICY "Staff can manage remedial plans" ON public.remedial_plans
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
    );

-- =========================================================================
-- Initial Seed: Kopargaon Primary School & Competency Bank
-- =========================================================================

INSERT INTO public.schools (id, udise_code, name, taluka, district)
VALUES ('a0000000-0000-0000-0000-000000000001', '27260501234', 'जि. प. प्राथमिक शाळा, कोपरगाव', 'Kopargaon', 'Ahilyanagar')
ON CONFLICT (udise_code) DO NOTHING;

INSERT INTO public.competencies (id, code, subject, grade, title_en, title_mr, description_en, description_mr, threshold_passing_pct)
VALUES
('FLN-NUM-01', 'NUM-01', 'Numeracy', 3, '2 & 3-Digit Place Value', 'दोन व तीन अंकी संख्यांची स्थानिक किंमत', 'Identifies unit, tens, and hundreds place value in numbers up to 999.', '९९९ पर्यंतच्या संख्यांमधील एकक, दशक व शतक स्थान ओळखणे.', 60.0),
('FLN-NUM-02', 'NUM-02', 'Numeracy', 3, '2-Digit Subtraction with Regrouping (Borrowing)', 'हातच्याची दोन अंकी वजाबाकी', 'Solves 2-digit subtraction problems requiring regrouping/borrowing across tens.', 'दशकाकडून सुटा घेऊन हातच्याची वजाबाकी अचूकपणे सोडवणे.', 60.0),
('FLN-NUM-03', 'NUM-03', 'Numeracy', 3, 'Basic Addition & Subtraction Word Problems', 'बेरीज व वजाबाकीची दैनंदिन शाब्दिक उदाहरणे', 'Translates real-life daily word problems into arithmetic equations.', 'दैनंदिन व्यवहारातील साध्या शाब्दिक उदाहरणांचा अर्थ लावून क्रिया करणे.', 60.0),
('FLN-NUM-04', 'NUM-04', 'Numeracy', 3, 'Multiplication as Repeated Addition', 'समान गटांची मांडणी (गुणाकार संकल्पना)', 'Understands multiplication concept using concrete objects and grouped arrays.', 'वस्तूंचे समान गट करून पुनरावृत्ती बेरीज म्हणजे गुणाकार ही संकल्पना समजणे.', 60.0),
('FLN-LIT-01', 'LIT-01', 'Literacy', 3, 'Conjunct Letters & Blend Decoding', 'जोडाक्षरे आणि संयुक्त ध्वनी वाचन', 'Accurately decodes words containing Marathi conjunct consonants.', 'मराठी भाषेतील विविध जोडाक्षरयुक्त शब्दांचे स्पष्ट व अस्खलित वाचन करणे.', 60.0),
('FLN-LIT-02', 'LIT-02', 'Literacy', 3, 'Standard II Level Text Reading (ASER Test)', 'इयत्ता २ री पातळीचा उतारा अस्खलित वाचन व आकलन', 'Reads standard 2 paragraph at 40+ wpm with 75% comprehension.', '४-५ वाक्यांचा साधा उतारा न अडखळता वाचणे आणि प्रश्नांची उत्तरे देणे.', 65.0),
('FLN-LIT-03', 'LIT-03', 'Literacy', 3, 'Simple Sentence Construction', 'साधी अर्थपूर्ण वाक्य रचना', 'Forms simple, grammatically complete sentences using prompt words.', 'दिलेल्या सूचक शब्दांवरून योग्य विरामचिन्हांसह स्वतःचे वाक्य तयार करणे.', 60.0)
ON CONFLICT (id) DO NOTHING;
