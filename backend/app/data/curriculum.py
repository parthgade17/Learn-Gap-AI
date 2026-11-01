from typing import List
from ..models import Competency, RemedialActivity, Student, AssessmentRecord

FLN_COMPETENCIES: List[Competency] = [
    Competency(
        id='FLN-NUM-01',
        code='NUM-01',
        subject='Numeracy',
        grade=3,
        title_en='2 & 3-Digit Place Value',
        title_mr='दोन व तीन अंकी संख्यांची स्थानिक किंमत',
        description_en='Identifies unit, tens, and hundreds place value in numbers up to 999.',
        description_mr='९९९ पर्यंतच्या संख्यांमधील एकक, दशक व शतक स्थान आणि त्यांची स्थानिक किंमत ओळखणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='FLN-NUM-02',
        code='NUM-02',
        subject='Numeracy',
        grade=3,
        title_en='2-Digit Subtraction with Regrouping (Borrowing)',
        title_mr='हातच्याची दोन अंकी वजाबाकी',
        description_en='Solves 2-digit subtraction problems requiring regrouping/borrowing across tens.',
        description_mr='दशकाकडून सुटा घेऊन हातच्याची वजाबाकी अचूकपणे सोडवणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='FLN-NUM-03',
        code='NUM-03',
        subject='Numeracy',
        grade=3,
        title_en='Basic Addition & Subtraction Word Problems',
        title_mr='बेरीज व वजाबाकीची दैनंदिन शाब्दिक उदाहरणे',
        description_en='Translates real-life daily word problems into arithmetic equations.',
        description_mr='दैनंदिन व्यवहारातील साध्या शाब्दिक उदाहरणांचा अर्थ लावून बेरीज किंवा वजाबाकी करणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='FLN-NUM-04',
        code='NUM-04',
        subject='Numeracy',
        grade=3,
        title_en='Multiplication as Repeated Addition',
        title_mr='समान गटांची मांडणी (गुणाकार संकल्पना)',
        description_en='Understands multiplication concept using concrete objects and grouped arrays.',
        description_mr='वस्तूंचे समान गट करून पुनरावृत्ती बेरीज म्हणजे गुणाकार ही संकल्पना समजणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='FLN-LIT-01',
        code='LIT-01',
        subject='Literacy',
        grade=3,
        title_en='Conjunct Letters & Blend Decoding',
        title_mr='जोडाक्षरे आणि संयुक्त ध्वनी वाचन',
        description_en='Accurately decodes words containing Marathi conjunct consonants (जोडाक्षरे).',
        description_mr='मराठी भाषेतील विविध जोडाक्षरयुक्त शब्दांचे स्पष्ट व अस्खलित वाचन करणे.',
        threshold_passing_pct=60.0
    ),
    Competency(
        id='FLN-LIT-02',
        code='LIT-02',
        subject='Literacy',
        grade=3,
        title_en='Standard II Level Text Reading (ASER Test)',
        title_mr='इयत्ता २ री पातळीचा उतारा अस्खलित वाचन व आकलन',
        description_en='Reads standard 2 paragraph at 40+ wpm with 75% comprehension (ASER/NIPUN criteria).',
        description_mr='४-५ वाक्यांचा साधा उतारा न अडखळता वाचणे आणि विचारलेल्या प्रश्नांची उत्तरे देणे.',
        threshold_passing_pct=65.0
    ),
    Competency(
        id='FLN-LIT-03',
        code='LIT-03',
        subject='Literacy',
        grade=3,
        title_en='Simple Sentence Construction',
        title_mr='साधी अर्थपूर्ण वाक्य रचना',
        description_en='Forms simple, grammatically complete sentences using prompt words.',
        description_mr='दिलेल्या चित्रावरून किंवा सूचक शब्दांवरून योग्य विरामचिन्हांसह स्वतःचे वाक्य तयार करणे.',
        threshold_passing_pct=60.0
    )
]

REMEDIAL_ACTIVITIES: List[RemedialActivity] = [
    RemedialActivity(
        id='ACT-NUM-01-A',
        competency_id='FLN-NUM-01',
        title_en='Bundle & Sticks Place Value Game',
        title_mr='दशकाची कांडी व एककाचे सुटे खेळ',
        instructions_en='Group children in pairs. Use bundles of 10 matchsticks and loose sticks. Teacher calls a 2-digit number (e.g., 47). Students represent it by showing 4 bundles and 7 loose sticks on place-value paper mats.',
        instructions_mr='विद्यार्थ्यांना जोड्यांमध्ये बसवा. १० काड्यांचे दशक गट्टे आणि सुट्या काड्या वापरा. शिक्षकांनी संख्या सांगितल्यावर (उदा. ४७) मुलांनी ४ दशक गट्टे आणि ७ सुटे ठेवून दाखवावेत व स्थानिक किंमत वहीत नोंदवावी.',
        materials_needed_en='Matchsticks/twigs tied with rubber bands into 10s, paper cups labeled Units/Tens.',
        materials_needed_mr='१० च्या काड्यांचे गट्टे, सुट्या काड्या, एकक-दशक लिहिलेले कागदी कप.',
        estimated_minutes=25,
        is_teacher_reviewed=True,
        pedagogical_reason_en='Uses concrete-pictorial-abstract (CPA) progression to demystify place value without rote memorization.',
        pedagogical_reason_mr='मूर्त ते अमूर्त या अध्यापन पद्धतीचा वापर करून दशक व एकक संकल्पना प्रत्यक्ष कृतीतून पक्की होते.'
    ),
    RemedialActivity(
        id='ACT-NUM-02-A',
        competency_id='FLN-NUM-02',
        title_en='Shopkeeper "Exchange Ten" Remedial Drill',
        title_mr='दुकानदार व सुटे नाणी: हातचा वजाबाकी खेळ',
        instructions_en='Role-play a village grocery stall. A student has 4 ten-rupee notes and needs to pay 18 rupees. They physically exchange 1 ten-rupee note with the banker for 10 one-rupee coins, then pay 8 coins from the 10. Emphasize why the tens column decreases by 1.',
        instructions_mr='गावातील दुकानाचे नाट्यीकरण करा. विद्यार्थ्याकडे ४ दहाच्या नोटा आहेत आणि १८ रुपये द्यायचे आहेत. तो बँकेत जाऊन १ दहाची नोट देऊन १० एक रुपयांची नाणी घेतो. यामुळे दशकाचा एक कमी का होतो हे प्रत्यक्ष समजते.',
        materials_needed_en='Play currency (Rs 10 toy notes, Rs 1 toy coins or cardboard tokens).',
        materials_needed_mr='खेळातील कागदी नोटा (१० रुपये) आणि टोकन नाणी (१ रुपया).',
        estimated_minutes=30,
        is_teacher_reviewed=True,
        pedagogical_reason_en='Resolves the conceptual misconception where students subtract smaller digit from larger digit (e.g. 52 - 17 doing 7-2=5).',
        pedagogical_reason_mr='मुले अनेकदा ५२ - १७ करताना ७ मधून २ वजा करतात; ही त्रुटी सुटे करण्याच्या संकल्पनेमुळे कायमची दूर होते.'
    ),
    RemedialActivity(
        id='ACT-NUM-03-A',
        competency_id='FLN-NUM-03',
        title_en='Classroom Story Circle Problem Solving',
        title_mr='गोष्टीतील गणित: शाब्दिक उदाहरणांचा सराव',
        instructions_en='Teacher presents an oral story with names of local fruits or birds. Children enact the scenario with pebbles before writing the equation.',
        instructions_mr='स्थानिक परिसरातील उदाहरणे (उदा. पेरू, शेळ्या, पक्षांची चित्रे) वापरून तोंडी कथा सांगा. मुले खड्यांच्या साहाय्याने प्रत्यक्ष वाटणी करून दाखवतील.',
        materials_needed_en='Pebbles, tamarind seeds (चिंचोके), slate and chalk.',
        materials_needed_mr='चिंचोके/खडे, पाटी आणि पेन्सिल.',
        estimated_minutes=20,
        is_teacher_reviewed=True,
        pedagogical_reason_en='Bridges literacy barrier in numeracy by having students first visualize narrative context before calculating.',
        pedagogical_reason_mr='शाब्दिक उदाहरणात भाषिक अडचणीमुळे मुले गोंधळतात; गोष्टीमुळे संदर्भ स्पष्ट होऊन क्रिया निवडणे सोपे होते.'
    ),
    RemedialActivity(
        id='ACT-NUM-04-A',
        competency_id='FLN-NUM-04',
        title_en='Egg Carton Array Multiplication',
        title_mr='अंडी ट्रे व बिया: समान गटांचा गुणाकार',
        instructions_en='Use an egg tray or drawing circles on ground. Place 3 tamarind seeds in each of 4 cups. Count total: 3 + 3 + 3 + 3 = 12.',
        instructions_mr='जमिनीवर ४ गोल आखा. प्रत्येक गोलात ३-३ चिंचोके ठेवा. ३ + ३ + ३ + ३ = १२ म्हणजेच ४ वेळा ३ = ४ × ३ = १२ ही मांडणी मुलांकडून करून घ्या.',
        materials_needed_en='Chalk, 30 tamarind seeds or bottle caps.',
        materials_needed_mr='खडू, बाटल्यांची झाकणे किंवा चिंचोके.',
        estimated_minutes=20,
        is_teacher_reviewed=True,
        pedagogical_reason_en='Prevents mechanical memorization of tables by establishing multiplication as repeated grouping.',
        pedagogical_reason_mr='पाठांतराऐवजी समान गट एकत्र करणे म्हणजे गुणाकार हा पाया मजबूत होतो.'
    ),
    RemedialActivity(
        id='ACT-LIT-01-A',
        competency_id='FLN-LIT-01',
        title_en='Joint-Letter Train Game (जोडाक्षर आगगाडी)',
        title_mr='जोडाक्षर आगगाडी व शब्द पट्टी खेळ',
        instructions_en='Create flashcards of half-letters and main letters. Two students hold the halves and collide to sound out conjunct syllables.',
        instructions_mr='कागदाच्या पट्ट्यांवर अर्धी अक्षरे आणि पूर्ण अक्षरे लिहा. दोन मुले मिळून आगगाडीसारखे जोडून उच्चार करतील व फलकावरील शब्दांचे वाचन करतील.',
        materials_needed_en='Bold flashcards, blackboard chalk, printed local word sheet.',
        materials_needed_mr='जोडाक्षर फ्लॅशकार्ड, फळा आणि खडू, शब्द तक्ता.',
        estimated_minutes=25,
        is_teacher_reviewed=True,
        pedagogical_reason_en='Phonics-based physical blending allows auditory and visual association for difficult conjunct sounds.',
        pedagogical_reason_mr='ध्वनी आणि दृश्य यांचा समन्वय साधून जोडाक्षरांचा उच्चार व वाचन सुलभ होते.'
    ),
    RemedialActivity(
        id='ACT-LIT-02-A',
        competency_id='FLN-LIT-02',
        title_en='Paired Echo Reading with Picture Storybook',
        title_mr='जोडीने वाचन (प्रतिध्वनी वाचन पद्धती)',
        instructions_en='Pair a struggling reader with a confident peer reader or teacher. Teacher reads one short sentence emphasizing expression; student echoes immediately.',
        instructions_mr='किमान वाचन येणाऱ्या विद्यार्थ्याला शिक्षकांसोबत किंवा मित्रासोबत बसवा. शिक्षक एक ओळ वाचतील; विद्यार्थी लगेच तिच्या मागे बोट फिरवत तोच उच्चार करेल.',
        materials_needed_en='Illustrated Marathi Grade 2 short story (NIPUN Reader).',
        materials_needed_mr='इयत्ता २ रीच्या गोष्टीचे चित्रमय पुस्तक किंवा निपुण भारत वाचन कार्ड.',
        estimated_minutes=20,
        is_teacher_reviewed=True,
        pedagogical_reason_en='Improves reading prosody and fluency without intimidation.',
        pedagogical_reason_mr='अडकळणाऱ्या विद्यार्थ्याचा आत्मविश्वास वाढतो आणि बोट फिरवल्यामुळे शब्दांवर लक्ष केंद्रित राहते.'
    ),
    RemedialActivity(
        id='ACT-LIT-03-A',
        competency_id='FLN-LIT-03',
        title_en='Picture Cue Sentence Builder',
        title_mr='चित्र पाहून स्वतःचे वाक्य तयार करणे',
        instructions_en='Show an engaging picture of a village fair or rainy day. Ask three prompt questions: Who? What are they doing? Where? Help students write complete sentence.',
        instructions_mr='जत्रा किंवा पावसाळ्याचे चित्र दाखवा. तीन प्रश्न विचारा: कोण आहे? काय करत आहे? कुठे आहे? विद्यार्थ्यांच्या तोंडी उत्तरांचे वाक्य फळ्यावर लिहून घ्या.',
        materials_needed_en='Printed picture card, student notebooks.',
        materials_needed_mr='चित्र कार्ड, विद्यार्थ्यांची वही आणि पेन्सिल.',
        estimated_minutes=25,
        is_teacher_reviewed=True,
        pedagogical_reason_en='Scaffolds syntactic sentence structure using simple semantic question cues.',
        pedagogical_reason_mr='प्रश्नोत्तरातून वाक्याची रचना शिकवल्याने विद्यार्थी अर्थपूर्ण लेखन करू लागतात.'
    )
]

# 20 Synthetic students for Grade 3 (DPDP compliant)
SYNTHETIC_STUDENTS: List[Student] = [
    Student(id='std-301', school_id='ZP-KPG-01', grade=3, section='A', roll_number=1, student_alias='विद्यार्थी १ (Aarav)', parental_consent_verified=True),
    Student(id='std-302', school_id='ZP-KPG-01', grade=3, section='A', roll_number=2, student_alias='विद्यार्थी २ (Sakshi)', parental_consent_verified=True),
    Student(id='std-303', school_id='ZP-KPG-01', grade=3, section='A', roll_number=3, student_alias='विद्यार्थी ३ (Karan)', parental_consent_verified=True),
    Student(id='std-304', school_id='ZP-KPG-01', grade=3, section='A', roll_number=4, student_alias='विद्यार्थी ४ (Pooja)', parental_consent_verified=True),
    Student(id='std-305', school_id='ZP-KPG-01', grade=3, section='A', roll_number=5, student_alias='विद्यार्थी ५ (Omkar)', parental_consent_verified=True),
    Student(id='std-306', school_id='ZP-KPG-01', grade=3, section='A', roll_number=6, student_alias='विद्यार्थी ६ (Ananya)', parental_consent_verified=True),
    Student(id='std-307', school_id='ZP-KPG-01', grade=3, section='A', roll_number=7, student_alias='विद्यार्थी ७ (Tejas)', parental_consent_verified=True),
    Student(id='std-308', school_id='ZP-KPG-01', grade=3, section='A', roll_number=8, student_alias='विद्यार्थी ८ (Snehal)', parental_consent_verified=True),
    Student(id='std-309', school_id='ZP-KPG-01', grade=3, section='A', roll_number=9, student_alias='विद्यार्थी ९ (Rohan)', parental_consent_verified=True),
    Student(id='std-310', school_id='ZP-KPG-01', grade=3, section='A', roll_number=10, student_alias='विद्यार्थी १० (Gauri)', parental_consent_verified=True),
    Student(id='std-311', school_id='ZP-KPG-01', grade=3, section='A', roll_number=11, student_alias='विद्यार्थी ११ (Aditya)', parental_consent_verified=True),
    Student(id='std-312', school_id='ZP-KPG-01', grade=3, section='A', roll_number=12, student_alias='विद्यार्थी १२ (Komal)', parental_consent_verified=True),
    Student(id='std-313', school_id='ZP-KPG-01', grade=3, section='A', roll_number=13, student_alias='विद्यार्थी १३ (Sahil)', parental_consent_verified=True),
    Student(id='std-314', school_id='ZP-KPG-01', grade=3, section='A', roll_number=14, student_alias='विद्यार्थी १४ (Neha)', parental_consent_verified=True),
    Student(id='std-315', school_id='ZP-KPG-01', grade=3, section='A', roll_number=15, student_alias='विद्यार्थी १५ (Siddharth)', parental_consent_verified=True),
    Student(id='std-316', school_id='ZP-KPG-01', grade=3, section='A', roll_number=16, student_alias='विद्यार्थी १६ (Tanvi)', parental_consent_verified=True),
    Student(id='std-317', school_id='ZP-KPG-01', grade=3, section='A', roll_number=17, student_alias='विद्यार्थी १७ (Vedant)', parental_consent_verified=True),
    Student(id='std-318', school_id='ZP-KPG-01', grade=3, section='A', roll_number=18, student_alias='विद्यार्थी १८ (Divya)', parental_consent_verified=True),
    Student(id='std-319', school_id='ZP-KPG-01', grade=3, section='A', roll_number=19, student_alias='विद्यार्थी १९ (Mayur)', parental_consent_verified=True),
    Student(id='std-320', school_id='ZP-KPG-01', grade=3, section='A', roll_number=20, student_alias='विद्यार्थी २० (Prachi)', parental_consent_verified=True),
]
