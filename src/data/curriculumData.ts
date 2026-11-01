import { Competency, RemedialActivity } from '../types';

export const FLN_COMPETENCIES: Competency[] = [
  {
    id: 'FLN-NUM-01',
    code: 'NUM-01',
    subject: 'Numeracy',
    grade: 3,
    title_en: '2 & 3-Digit Place Value',
    title_mr: 'दोन व तीन अंकी संख्यांची स्थानिक किंमत',
    description_en: 'Identifies unit, tens, and hundreds place value in numbers up to 999.',
    description_mr: '९९९ पर्यंतच्या संख्यांमधील एकक, दशक व शतक स्थान आणि त्यांची स्थानिक किंमत ओळखणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'FLN-NUM-02',
    code: 'NUM-02',
    subject: 'Numeracy',
    grade: 3,
    title_en: '2-Digit Subtraction with Regrouping (Borrowing)',
    title_mr: 'हातच्याची दोन अंकी वजाबाकी',
    description_en: 'Solves 2-digit subtraction problems requiring regrouping/borrowing across tens.',
    description_mr: 'दशकाकडून सुटा घेऊन हातच्याची वजाबाकी अचूकपणे सोडवणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'FLN-NUM-03',
    code: 'NUM-03',
    subject: 'Numeracy',
    grade: 3,
    title_en: 'Basic Addition & Subtraction Word Problems',
    title_mr: 'बेरीज व वजाबाकीची दैनंदिन शाब्दिक उदाहरणे',
    description_en: 'Translates real-life daily word problems into arithmetic equations.',
    description_mr: 'दैनंदिन व्यवहारातील साध्या शाब्दिक उदाहरणांचा अर्थ लावून बेरीज किंवा वजाबाकी करणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'FLN-NUM-04',
    code: 'NUM-04',
    subject: 'Numeracy',
    grade: 3,
    title_en: 'Multiplication as Repeated Addition',
    title_mr: 'समान गटांची मांडणी (गुणाकार संकल्पना)',
    description_en: 'Understands multiplication concept using concrete objects and grouped arrays.',
    description_mr: 'वस्तूंचे समान गट करून पुनरावृत्ती बेरीज म्हणजे गुणाकार ही संकल्पना समजणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'FLN-LIT-01',
    code: 'LIT-01',
    subject: 'Literacy',
    grade: 3,
    title_en: 'Conjunct Letters & Blend Decoding',
    title_mr: 'जोडाक्षरे आणि संयुक्त ध्वनी वाचन',
    description_en: 'Accurately decodes words containing Marathi conjunct consonants.',
    description_mr: 'मराठी भाषेतील विविध जोडाक्षरयुक्त शब्दांचे स्पष्ट व अस्खलित वाचन करणे.',
    threshold_passing_pct: 60,
  },
  {
    id: 'FLN-LIT-02',
    code: 'LIT-02',
    subject: 'Literacy',
    grade: 3,
    title_en: 'Standard II Level Text Reading (ASER Test)',
    title_mr: 'इयत्ता २ री पातळीचा उतारा अस्खलित वाचन व आकलन',
    description_en: 'Reads standard 2 paragraph at 40+ wpm with 75% comprehension (ASER/NIPUN criteria).',
    description_mr: '४-५ वाक्यांचा साधा उतारा न अडखळता वाचणे आणि विचारलेल्या प्रश्नांची उत्तरे देणे.',
    threshold_passing_pct: 65,
  },
  {
    id: 'FLN-LIT-03',
    code: 'LIT-03',
    subject: 'Literacy',
    grade: 3,
    title_en: 'Simple Sentence Construction',
    title_mr: 'साधी अर्थपूर्ण वाक्य रचना',
    description_en: 'Forms simple, grammatically complete sentences using prompt words.',
    description_mr: 'दिलेल्या चित्रावरून किंवा सूचक शब्दांवरून योग्य विरामचिन्हांसह स्वतःचे वाक्य तयार करणे.',
    threshold_passing_pct: 60,
  }
];

export const REMEDIAL_ACTIVITIES: RemedialActivity[] = [
  {
    id: 'ACT-NUM-01-A',
    competency_id: 'FLN-NUM-01',
    title_en: 'Bundle & Sticks Place Value Game',
    title_mr: 'दशकाची कांडी व एककाचे सुटे खेळ',
    instructions_en: 'Group children in pairs. Use bundles of 10 matchsticks and loose sticks. Teacher calls a 2-digit number (e.g., 47). Students represent it by showing 4 bundles and 7 loose sticks on place-value paper mats.',
    instructions_mr: 'विद्यार्थ्यांना जोड्यांमध्ये बसवा. १० काड्यांचे दशक गट्टे आणि सुट्या काड्या वापरा. शिक्षकांनी संख्या सांगितल्यावर (उदा. ४७) मुलांनी ४ दशक गट्टे आणि ७ सुटे ठेवून दाखवावेत व स्थानिक किंमत वहीत नोंदवावी.',
    materials_needed_en: 'Matchsticks/twigs tied with rubber bands into 10s, paper cups labeled Units/Tens.',
    materials_needed_mr: '१० च्या काड्यांचे गट्टे, सुट्या काड्या, एकक-दशक लिहिलेले कागदी कप.',
    estimated_minutes: 25,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Uses concrete-pictorial-abstract (CPA) progression to demystify place value without rote memorization.',
    pedagogical_reason_mr: 'मूर्त ते अमूर्त या अध्यापन पद्धतीचा वापर करून दशक व एकक संकल्पना प्रत्यक्ष कृतीतून पक्की होते.'
  },
  {
    id: 'ACT-NUM-02-A',
    competency_id: 'FLN-NUM-02',
    title_en: 'Shopkeeper "Exchange Ten" Remedial Drill',
    title_mr: 'दुकानदार व सुटे नाणी: हातचा वजाबाकी खेळ',
    instructions_en: 'Role-play a village grocery stall. A student has 4 ten-rupee notes and needs to pay 18 rupees. They physically exchange 1 ten-rupee note with the banker for 10 one-rupee coins, then pay 8 coins from the 10. Emphasize why the tens column decreases by 1.',
    instructions_mr: 'गावातील दुकानाचे नाट्यीकरण करा. विद्यार्थ्याकडे ४ दहाच्या नोटा आहेत आणि १८ रुपये द्यायचे आहेत. तो बँकेत जाऊन १ दहाची नोट देऊन १० एक रुपयांची नाणी घेतो. यामुळे दशकाचा एक कमी का होतो हे प्रत्यक्ष समजते.',
    materials_needed_en: 'Play currency (Rs 10 toy notes, Rs 1 toy coins or cardboard tokens).',
    materials_needed_mr: 'खेळातील कागदी नोटा (१० रुपये) आणि टोकन नाणी (१ रुपया).',
    estimated_minutes: 30,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Resolves the conceptual misconception where students subtract smaller digit from larger digit (e.g. 52 - 17 doing 7-2=5).',
    pedagogical_reason_mr: 'मुले अनेकदा ५२ - १७ करताना ७ मधून २ वजा करतात; ही त्रुटी सुटे करण्याच्या संकल्पनेमुळे कायमची दूर होते.'
  },
  {
    id: 'ACT-NUM-03-A',
    competency_id: 'FLN-NUM-03',
    title_en: 'Classroom Story Circle Problem Solving',
    title_mr: 'गोष्टीतील गणित: शाब्दिक उदाहरणांचा सराव',
    instructions_en: 'Teacher presents an oral story with names of local fruits or birds. Children enact the scenario with pebbles before writing the equation.',
    instructions_mr: 'स्थानिक परिसरातील उदाहरणे (उदा. पेरू, शेळ्या, पक्षांची चित्रे) वापरून तोंडी कथा सांगा. मुले खड्यांच्या साहाय्याने प्रत्यक्ष वाटणी करून दाखवतील आणि नंतर गणितीय चिन्हात मांडतील.',
    materials_needed_en: 'Pebbles, tamarind seeds, slate and chalk.',
    materials_needed_mr: 'चिंचोके/खडे, पाटी आणि पेन्सिल.',
    estimated_minutes: 20,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Bridges literacy barrier in numeracy by having students first visualize narrative context before calculating.',
    pedagogical_reason_mr: 'शाब्दिक उदाहरणात भाषिक अडचणीमुळे मुले गोंधळतात; गोष्टीमुळे संदर्भ स्पष्ट होऊन क्रिया निवडणे सोपे होते.'
  },
  {
    id: 'ACT-NUM-04-A',
    competency_id: 'FLN-NUM-04',
    title_en: 'Egg Carton Array Multiplication',
    title_mr: 'अंडी ट्रे व बिया: समान गटांचा गुणाकार',
    instructions_en: 'Use an egg tray or drawing circles on ground. Place 3 tamarind seeds in each of 4 cups. Count total: 3 + 3 + 3 + 3 = 12. Show this is 4 times 3, written as 4 × 3 = 12.',
    instructions_mr: 'जमिनीवर ४ गोल आखा. प्रत्येक गोलात ३-३ चिंचोके ठेवा. ३ + ३ + ३ + ३ = १२ म्हणजेच ४ वेळा ३ = ४ × ३ = १२ ही मांडणी मुलांकडून करून घ्या.',
    materials_needed_en: 'Chalk, 30 tamarind seeds or bottle caps.',
    materials_needed_mr: 'खडू, बाटल्यांची झाकणे किंवा चिंचोके.',
    estimated_minutes: 20,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Prevents mechanical memorization of tables by establishing multiplication as repeated grouping.',
    pedagogical_reason_mr: 'पाठांतराऐवजी समान गट एकत्र करणे म्हणजे गुणाकार हा पाया मजबूत होतो.'
  },
  {
    id: 'ACT-LIT-01-A',
    competency_id: 'FLN-LIT-01',
    title_en: 'Joint-Letter Train Game',
    title_mr: 'जोडाक्षर आगगाडी व शब्द पट्टी खेळ',
    instructions_en: 'Create flashcards of half-letters and main letters. Two students hold the halves and collide to sound out conjunct syllables. Then practice reading words containing them from printed word charts.',
    instructions_mr: 'कागदाच्या पट्ट्यांवर अर्धी अक्षरे आणि पूर्ण अक्षरे लिहा. दोन मुले मिळून आगगाडीसारखे जोडून उच्चार करतील व फलकावरील शब्दांचे एकत्रित वाचन करतील.',
    materials_needed_en: 'Bold flashcards, blackboard chalk, printed local word sheet.',
    materials_needed_mr: 'जोडाक्षर फ्लॅशकार्ड, फळा आणि खडू, शब्द तक्ता.',
    estimated_minutes: 25,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Phonics-based physical blending allows auditory and visual association for difficult conjunct sounds.',
    pedagogical_reason_mr: 'ध्वनी आणि दृश्य यांचा समन्वय साधून जोडाक्षरांचा उच्चार व वाचन सुलभ होते.'
  },
  {
    id: 'ACT-LIT-02-A',
    competency_id: 'FLN-LIT-02',
    title_en: 'Paired Echo Reading with Picture Storybook',
    title_mr: 'जोडीने वाचन (प्रतिध्वनी वाचन पद्धती)',
    instructions_en: 'Pair a struggling reader with a confident peer reader or teacher. Teacher reads one short sentence emphasizing expression and pauses; student echoes the sentence immediately while tracking words with index finger.',
    instructions_mr: 'किमान वाचन येणाऱ्या विद्यार्थ्याला शिक्षकांसोबत किंवा मित्रासोबत बसवा. शिक्षक एक ओळ बोट ठेवून सावकाश वाचतील; विद्यार्थी लगेच तिच्या मागे बोट फिरवत तोच उच्चार प्रतिध्वनीसारखा उच्चारेल.',
    materials_needed_en: 'Illustrated short story reader card.',
    materials_needed_mr: 'इयत्ता २ रीच्या गोष्टीचे चित्रमय पुस्तक किंवा निपुण भारत वाचन कार्ड.',
    estimated_minutes: 20,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Improves reading prosody and fluency without intimidation; tracking finger reduces word skipping.',
    pedagogical_reason_mr: 'अडकळणाऱ्या विद्यार्थ्याचा आत्मविश्वास वाढतो आणि बोट फिरवल्यामुळे शब्दांवर लक्ष केंद्रित राहते.'
  },
  {
    id: 'ACT-LIT-03-A',
    competency_id: 'FLN-LIT-03',
    title_en: 'Picture Cue Sentence Builder',
    title_mr: 'चित्र पाहून स्वतःचे वाक्य तयार करणे',
    instructions_en: 'Show an engaging picture of a village fair or rainy day. Ask three prompt questions: Who? What are they doing? Where? Help students combine the answers into one complete written sentence with full stop.',
    instructions_mr: 'जत्रा किंवा पावसाळ्याचे चित्र दाखवा. तीन प्रश्न विचारा: कोण आहे? काय करत आहे? कुठे आहे? विद्यार्थ्यांच्या तोंडी उत्तरांचे एक परिपूर्ण वाक्य फळ्यावर लिहून वहीत उतरवून घ्या.',
    materials_needed_en: 'Printed picture card, student notebooks.',
    materials_needed_mr: 'चित्र कार्ड, विद्यार्थ्यांची वही आणि पेन्सिल.',
    estimated_minutes: 25,
    is_teacher_reviewed: true,
    pedagogical_reason_en: 'Scaffolds syntactic sentence structure using simple semantic question cues.',
    pedagogical_reason_mr: 'प्रश्नोत्तरातून वाक्याची रचना शिकवल्याने विद्यार्थी अर्थपूर्ण लेखन करू लागतात.'
  }
];

// Multilingual competency title dictionaries
const COMPETENCY_TITLES: Record<string, Record<string, string>> = {
  'FLN-NUM-01': {
    en: '2 & 3-Digit Place Value',
    mr: 'दोन व तीन अंकी संख्यांची स्थानिक किंमत',
    hi: 'दो व तीन अंकों का स्थानीय मान',
    gu: 'બે અને ત્રણ અંકની સ્થાનકિંમત',
    bn: 'দুই ও তিন অঙ্কের স্থানীয় মান',
    ta: '2 மற்றும் 3 இலக்க இடமதிப்பு',
    te: '2 మరియు 3 అంకెల స్థాన విలువ',
    kn: '2 ಮತ್ತು 3 ಅಂಕಿಯ ಸ್ಥಾನಬೆಲೆ',
    ml: '2, 3 അക്കങ്ങളുടെ സ്ഥാനവില',
    or: '୨ ଏବଂ ୩ ଅଙ୍କର ସ୍ଥାନୀୟ ମାନ',
    pa: '2 ਅਤੇ 3 ਅੰਕਾਂ ਦਾ ਸਥਾਨਕ ਮੁੱਲ',
    as: '২ আৰু ৩ সংখ্যাৰ স্থানমান',
    ur: '2 اور 3 ہندسوں کی مقامی قیمت',
    sat: 'ᱵᱟᱨ ᱟᱨ ᱯᱮ ᱮᱞ ᱨᱮᱱᱟᱜ ᱴᱷᱟᱶ ᱢᱟᱹᱱ (Place Value)',
    gon: 'दोन अन तीन अंक ना स्थानिक किंमत',
    bhi: 'बे अन तीन अंक नी स्थानिक किंमत',
    kru: 'दो व तीन अंक गही स्थानीय मान',
    brx: '2 आरो 3 अनजिमानि जायगा मान',
    lus: 'Hmun Hlutna (Place Value)',
    kha: 'Ka Dor jong ki Dak Jingkhein'
  },
  'FLN-NUM-02': {
    en: '2-Digit Subtraction with Regrouping (Borrowing)',
    mr: 'हातच्याची दोन अंकी वजाबाकी',
    hi: 'हासिल वाली दो अंकों की घटाव',
    gu: 'દસકા વાળી બે અંકની બાદબાકી',
    bn: 'ধার নিয়ে দুই অঙ্কের বিয়োগ',
    ta: 'இடமாற்றத்துடன் கூடிய 2 இலக்கக் கழித்தல்',
    te: 'దశాంశ మార్పిడితో 2 అంకెల తీసివేత',
    kn: 'ದಶಕ ಪಡೆದು 2 ಅಂಕಿಯ ವ್ಯವಕಲನ',
    ml: 'കടം വാങ്ങിയുള്ള 2 അക്ക കുറയ്ക്കൽ',
    or: 'ଧାର ନେଇ ଦୁଇ ଅଙ୍କ ବିୟୋଗ',
    pa: 'ਹਾਸਲ ਵਾਲੀ ਦੋ ਅੰਕੀ ਘਟਾਓ',
    as: 'ধাৰ লোৱা ২ সংখ্যাৰ বিয়োগ',
    ur: 'حاصل والی 2 ہندسوں کی تفریق',
    sat: 'ᱫᱟᱦᱟᱠ ᱦᱟᱛᱟᱣ ᱠᱟᱛᱮ ᱵᱷᱮᱜᱟᱨ (Subtraction)',
    gon: 'उसना घेसी वजाबाकी (Subtraction)',
    bhi: 'उसना लेई ने बादबाकी (Subtraction)',
    kru: 'उसना नेरका घटाव (Subtraction)',
    brx: 'दानख नाय (Subtraction with Regrouping)',
    lus: 'Puk Chawpa Paihna (Borrowing Subtraction)',
    kha: 'Kut Jingkhein da kaba Pan'
  },
  'FLN-NUM-03': {
    en: 'Basic Addition & Subtraction Word Problems',
    mr: 'बेरीज व वजाबाकीची दैनंदिन शाब्दिक उदाहरणे',
    hi: 'दैनिक जीवन के शाब्दिक प्रश्न (जोड़ व घटाव)',
    gu: 'સરવાળા અને બાદબાકીના વ્યવહારિક દાખલા',
    bn: 'যোগ ও বিয়োগের দৈনন্দিন কথার অংক',
    ta: 'கூட்டல் & கழித்தல் தினசரி கணக்குகள்',
    te: 'కూడిక & తీసివేత రోజువారీ లెక్కలు',
    sat: 'ᱫᱤᱱᱟᱹᱢ ᱡᱤᱭᱚᱱ ᱨᱮᱱᱟᱜ ᱡᱚᱲ ᱟᱨ ᱵᱷᱮᱜᱟᱨ ᱠᱟᱛᱷᱟ',
    gon: 'रोज-बरोज ना शाब्दिक हिसाब (Word Problems)',
    bhi: 'रोज नी वात ना शाब्दिक दाखला'
  },
  'FLN-NUM-04': {
    en: 'Multiplication as Repeated Addition',
    mr: 'समान गटांची मांडणी (गुणाकार संकल्पना)',
    hi: 'समान समूहों का योग (गुणा की अवधारणा)',
    gu: 'સમાન જૂથોની ગણતરી (ગુણાકાર સંકલ્પના)',
    bn: 'বারংবার যোগ হিসেবে গুণের ধারণা',
    ta: 'தொடர் கூட்டலாக பெருக்கல்',
    sat: 'ᱵᱟᱨ ᱵᱟᱨ ᱡᱚᱲ ᱞᱮᱠᱟᱛᱮ ᱜᱩᱬᱟᱹᱱ (Multiplication)'
  },
  'FLN-LIT-01': {
    en: 'Conjunct Letters & Blend Decoding',
    mr: 'जोडाक्षरे आणि संयुक्त ध्वनी वाचन',
    hi: 'संयुक्ताक्षर एवं संयुक्त ध्वनि पठन',
    gu: 'જોડાક્ષરો અને સંયુક્ત ધ્વનિ વાંચન',
    bn: 'যুক্তাক্ষর ও সংযুক্ত ধ্বনি পঠন',
    ta: 'கூட்டெழுத்துக்கள் மற்றும் ஒலி உச்சரிப்பு',
    sat: 'ᱡᱚᱲ ᱟᱠᱷᱚᱨ ᱯᱟᱲᱦᱟᱣ (Conjunct Letters)'
  },
  'FLN-LIT-02': {
    en: 'Standard II Level Text Reading (ASER Test)',
    mr: 'इयत्ता २ री पातळीचा उतारा अस्खलित वाचन व आकलन',
    hi: 'कक्षा २ स्तर का गद्यांश धाराप्रवाह पठन व समझ',
    gu: 'ધોરણ ૨ કક્ષાનો ફકરો અસ્ખલિત વાંચન અને સમજ',
    bn: 'দ্বিতীয় শ্রেণি স্তরের অনুচ্ছেদ পাঠ ও বোধগম্যতা',
    ta: 'வகுப்பு 2 நிலை பத்தி வாசிப்பு',
    sat: 'ᱫᱚᱥᱟᱨ ᱪᱟᱱᱟᱪ ᱨᱮᱱᱟᱜ ᱯᱟᱲᱦᱟᱣ ᱟᱨ ᱵᱩᱡᱷᱟᱹᱣ'
  },
  'FLN-LIT-03': {
    en: 'Simple Sentence Construction',
    mr: 'साधी अर्थपूर्ण वाक्य रचना',
    hi: 'सरल एवं सार्थक वाक्य निर्माण',
    gu: 'સરળ અર્થપૂર્ણ વાક્ય રચના',
    bn: 'সহজ অর্থপূর্ণ বাক্য গঠন',
    ta: 'எளிய வாக்கிய அமைப்பு',
    sat: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱟᱹᱭᱟᱹᱛ ᱵᱮᱱᱟᱣ (Sentence Building)'
  }
};

/**
 * Clean localized lookup for competency title
 */
export function getCompetencyTitle(comp: Competency, lang: string): string {
  if (COMPETENCY_TITLES[comp.id]?.[lang]) {
    return COMPETENCY_TITLES[comp.id][lang];
  }
  if (lang === 'en') return comp.title_en;
  if (lang === 'mr') return comp.title_mr;
  return comp.title_en;
}

/**
 * Clean localized lookup for competency description
 */
export function getCompetencyDescription(comp: Competency, lang: string): string {
  if (lang === 'en') return comp.description_en;
  return comp.description_mr || comp.description_en;
}

/**
 * Clean localized lookup for remedial activity title
 */
export function getActivityTitle(act: RemedialActivity, lang: string): string {
  if (lang === 'en') return act.title_en;
  return act.title_mr || act.title_en;
}

export function getActivityInstructions(act: RemedialActivity, lang: string): string {
  if (lang === 'en') return act.instructions_en;
  return act.instructions_mr || act.instructions_en;
}

export function getActivityMaterials(act: RemedialActivity, lang: string): string {
  if (lang === 'en') return act.materials_needed_en;
  return act.materials_needed_mr || act.materials_needed_en;
}

export function getActivityReasoning(act: RemedialActivity, lang: string): string {
  if (lang === 'en') return act.pedagogical_reason_en;
  return act.pedagogical_reason_mr || act.pedagogical_reason_en;
}

/**
 * Clean localized display for student roll number and alias
 * Avoids mixing English / Marathi
 */
export function formatStudentDisplay(
  student: { roll_number: number; student_alias: string },
  lang: string
): string {
  // Extract simple student name if inside parentheses, e.g. "Aarav" from "विद्यार्थी १ (Aarav)"
  const match = student.student_alias.match(/\((.*?)\)/);
  const rawName = match ? match[1] : student.student_alias.replace(/विद्यार्थी\s*\d+\s*/, '').trim();
  const name = rawName || `Learner ${student.roll_number}`;

  if (lang === 'en') {
    return `Roll No. ${student.roll_number} - Learner ${student.roll_number} (${name})`;
  }
  if (lang === 'mr') {
    return `हजेरी क्र. ${student.roll_number} - विद्यार्थी ${student.roll_number} (${name})`;
  }
  if (lang === 'hi') {
    return `रोल नं. ${student.roll_number} - विद्यार्थी ${student.roll_number} (${name})`;
  }
  if (lang === 'gu') {
    return `રોલ નં. ${student.roll_number} - વિદ્યાર્થી ${student.roll_number} (${name})`;
  }
  if (lang === 'bn') {
    return `রোল নং ${student.roll_number} - শিক্ষার্থী ${student.roll_number} (${name})`;
  }
  if (lang === 'ta') {
    return `வரிசை எண் ${student.roll_number} - மாணவர் ${student.roll_number} (${name})`;
  }
  if (lang === 'te') {
    return `రోల్ నం. ${student.roll_number} - విద్యార్థి ${student.roll_number} (${name})`;
  }
  if (lang === 'sat') {
    return `ᱨᱳᱞ ᱮᱞ ${student.roll_number} - ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ${student.roll_number} (${name})`;
  }
  if (lang === 'gon') {
    return `रोल नंबर ${student.roll_number} - चेला ${student.roll_number} (${name})`;
  }
  if (lang === 'bhi') {
    return `रोल नं. ${student.roll_number} - टाबर ${student.roll_number} (${name})`;
  }

  return `Roll No. ${student.roll_number} - Learner ${student.roll_number} (${name})`;
}
