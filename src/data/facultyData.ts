import { SubjectType } from '../types';

export interface FacultyAssignment {
  id: string; // e.g. 'FA-01'
  grade: number;
  section: string;
  subject: SubjectType;
  competency_count: number;
  class_student_count: number;
  target_passing_pct: number;
  description_en: string;
  description_mr: string;
}

export interface FacultyProfile {
  id: string; // e.g. 'TCH-01'
  teacher_id: string; // UDISE National Code
  name: string;
  name_mr: string;
  name_hi: string;
  designation: string;
  qualification: string;
  experience_years: number;
  email: string;
  phone: string;
  avatar_bg: string;
  bio_en: string;
  bio_mr: string;
  assignments: FacultyAssignment[];
}

export const SCHOOL_FACULTY: FacultyProfile[] = [
  {
    id: 'TCH-01',
    teacher_id: 'UDISE-TCH-272605-01',
    name: 'Mrs. S. A. Patil',
    name_mr: 'श्रीमती एस. ए. पाटील',
    name_hi: 'श्रीमती एस. ए. पाटिल',
    designation: 'Senior Assistant Teacher (FLN Lead)',
    qualification: 'M.Sc. (Maths), B.Ed., State Best Teacher Awardee',
    experience_years: 14,
    email: 's.patil.zp@mahagov.in',
    phone: '+91 98220 12341',
    avatar_bg: 'from-blue-600 to-indigo-700',
    bio_en: 'Pioneered activity-based fraction and numeracy modules in Kopargaon block. Leads FLN classroom interventions.',
    bio_mr: 'कोपरगाव तालुक्यात कृतीशील गणित व संख्याज्ञान अध्यापनात उल्लेखनीय योगदान. FLN उपचारात्मक वर्गप्रमुख.',
    assignments: [
      {
        id: 'FA-01-MATH',
        grade: 5,
        section: 'A',
        subject: 'Mathematics',
        competency_count: 3,
        class_student_count: 10,
        target_passing_pct: 60,
        description_en: 'Multi-digit arithmetic, fractions equivalence and surface perimeter measuring.',
        description_mr: 'स्थानिक किंमत, अपૂર્ણાંક व भौमितिक रचना अध्यापन.'
      },
      {
        id: 'FA-01-MAR',
        grade: 5,
        section: 'A',
        subject: 'Marathi',
        competency_count: 2,
        class_student_count: 10,
        target_passing_pct: 60,
        description_en: 'Foundational joint-letter orthography, expressive prose reading and phonics.',
        description_mr: 'मराठी जोडाक्षरे, शुद्धलेखन व भावपूर्ण उतारा वाचन.'
      }
    ]
  },
  {
    id: 'TCH-02',
    teacher_id: 'UDISE-TCH-272605-02',
    name: 'Mr. M. R. Kulkarni',
    name_mr: 'श्री. एम. आर. कुलकर्णी',
    name_hi: 'श्री एम. आर. कुलकर्णी',
    designation: 'Graduate Science & Mathematics Teacher',
    qualification: 'M.Sc. (Physics), B.Ed., DSM',
    experience_years: 16,
    email: 'm.kulkarni.zp@mahagov.in',
    phone: '+91 98220 12342',
    avatar_bg: 'from-emerald-600 to-teal-700',
    bio_en: 'Designs zero-cost experiential science toys and hands-on force/friction ramp models.',
    bio_mr: 'कमी खर्चातील विज्ञान प्रयोग व भौतिकशास्त्र मॉडेल्सचे रचनाकार. वर्ग ६ वीचे वर्गशिक्षक.',
    assignments: [
      {
        id: 'FA-02-PHY',
        grade: 6,
        section: 'A',
        subject: 'Physics',
        competency_count: 2,
        class_student_count: 10,
        target_passing_pct: 60,
        description_en: 'Forces, friction measurement and straight-line light propagation/reflection.',
        description_mr: 'घर्षण बल, प्रकाश परावर्तन व सावलीचे खेळ.'
      },
      {
        id: 'FA-02-MATH',
        grade: 6,
        section: 'A',
        subject: 'Mathematics',
        competency_count: 3,
        class_student_count: 10,
        target_passing_pct: 60,
        description_en: 'Fractions Part-whole relationships, decimal equivalence and regrouping.',
        description_mr: 'अपूर्णाંક, दशांश व हातच्याची वजाबाकी सराव.'
      }
    ]
  },
  {
    id: 'TCH-03',
    teacher_id: 'UDISE-TCH-272605-03',
    name: 'Mrs. K. S. Shinde',
    name_mr: 'श्रीमती के. एस. शिंदे',
    name_hi: 'श्रीमती के. एस. शिंदे',
    designation: 'Assistant Teacher (Languages & Civics)',
    qualification: 'M.A. (English), M.A. (History), B.Ed.',
    experience_years: 10,
    email: 'k.shinde.zp@mahagov.in',
    phone: '+91 98220 12343',
    avatar_bg: 'from-amber-600 to-rose-700',
    bio_en: 'Conducts interactive bilingual English mystery reading flashcards and mock Gram Sabha civics roleplays.',
    bio_mr: 'द्वିભાષી इंग्रजी वाचन कार्ड व बाल ग्रामसभा नाट्यीकरणातून सामाजिक शास्त्र अध्यापन.',
    assignments: [
      {
        id: 'FA-03-ENG',
        grade: 7,
        section: 'A',
        subject: 'English',
        competency_count: 2,
        class_student_count: 10,
        target_passing_pct: 60,
        description_en: 'Contextual inference vocabulary and subject-verb agreement tenses.',
        description_mr: 'इंग्रजी परिच्छेद वाचन, संदर्भ शब्दसंग्रह व व्याकरण.'
      },
      {
        id: 'FA-03-SOC',
        grade: 7,
        section: 'A',
        subject: 'Social Science',
        competency_count: 2,
        class_student_count: 10,
        target_passing_pct: 60,
        description_en: 'Map reading cardinal directions, scales, and democratic Gram Panchayat duties.',
        description_mr: 'नकाशा वाचन, सांकेतिक चिन्हे व ग्रामपंचायत कार्यपद्धती.'
      }
    ]
  },
  {
    id: 'TCH-04',
    teacher_id: 'UDISE-TCH-272605-04',
    name: 'Mr. V. P. Chavan',
    name_mr: 'श्री. व्ही. पी. चव्हाण',
    name_hi: 'श्री वी. पी. चव्हाण',
    designation: 'Assistant Teacher (Chemistry & Hindi)',
    qualification: 'M.Sc. (Organic Chemistry), M.A. (Hindi), B.Ed.',
    experience_years: 11,
    email: 'v.chavan.zp@mahagov.in',
    phone: '+91 98220 12344',
    avatar_bg: 'from-purple-600 to-indigo-800',
    bio_en: 'Specializes in safe kitchen chemistry litmus indicators and Hindi phonetics/matra drills.',
    bio_mr: 'नैसर्गिक दर्शक (हळद/लिटमस) प्रयोग व हिंदी शुद्ध वर्तनी-मात्रा तज्ज्ञ.',
    assignments: [
      {
        id: 'FA-04-CHEM',
        grade: 8,
        section: 'A',
        subject: 'Chemistry',
        competency_count: 2,
        class_student_count: 10,
        target_passing_pct: 60,
        description_en: 'Physical vs. chemical reversible changes and acid-base turmeric tests.',
        description_mr: 'भौतिक-रासायनिक बदल व आम्ल-आम्लारी नैसर्गिक दर्शक चाचणी.'
      },
      {
        id: 'FA-04-HIN',
        grade: 8,
        section: 'A',
        subject: 'Hindi',
        competency_count: 2,
        class_student_count: 10,
        target_passing_pct: 60,
        description_en: 'Standard Hindi spelling, opposite words, and sentence relay conjugation.',
        description_mr: 'हिंदी शुद्ध वर्तनी, विलोम शब्द व काल-लिंग वाक्य रचना.'
      }
    ]
  },
  {
    id: 'TCH-05',
    teacher_id: 'UDISE-TCH-272605-05',
    name: 'Mr. P. R. Jadhav',
    name_mr: 'श्री. पी. आर. जाधव (प्रणव जाधव)',
    name_hi: 'श्री पी. आर. जाधव',
    designation: 'Primary Remedial Coordinator & Grade 6 Teacher',
    qualification: 'D.El.Ed., B.A. (English), State FLN Trainer',
    experience_years: 8,
    email: 'p.jadhav.zp@mahagov.in',
    phone: '+91 98220 12345',
    avatar_bg: 'from-brand-600 to-cyan-700',
    bio_en: 'Coordinates school-wide FLN remedial schedules and multi-tiered diagnostic tracking.',
    bio_mr: 'शालेय उपचारात्मक शिक्षण समन्वयक व निपुण भारत कृती आराखडा प्रमुख.',
    assignments: [
      {
        id: 'FA-05-ENG',
        grade: 6,
        section: 'A',
        subject: 'English',
        competency_count: 2,
        class_student_count: 10,
        target_passing_pct: 60,
        description_en: 'Grade 6 foundational English literacy and sentence construction.',
        description_mr: 'इयत्ता ६ वी इंग्रजी पायाभूत साक्षरਤਾ व वाक्यरचना.'
      },
      {
        id: 'FA-05-SOC',
        grade: 6,
        section: 'A',
        subject: 'Social Science',
        competency_count: 2,
        class_student_count: 10,
        target_passing_pct: 60,
        description_en: 'District geography map orientation and civic participation.',
        description_mr: 'जिल्हा नकाशा वाचन व स्थानिक स्वराज्य संस्था परिचय.'
      }
    ]
  }
];
