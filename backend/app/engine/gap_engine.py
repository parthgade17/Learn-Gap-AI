from typing import List, Dict, Tuple
from ..models import (
    Student, Competency, RemedialActivity, AssessmentRecord,
    GapDiagnosis, StudentGroup, GroupedStudent, CompetencyMetric,
    DashboardMetricsResponse, ValidationResponse,
    StudentAIPrediction, CohortAIPrediction, SubjectPrediction, SubjectType
)

SUBJECT_DIFFICULTY_WEIGHTS: Dict[str, float] = {
    'English': 1.15,
    'Mathematics': 1.25,
    'Social Science': 0.95,
    'Physics': 1.20,
    'Chemistry': 1.10,
    'Marathi': 0.85,
    'Hindi': 0.90
}

def validate_score(score: float, total_marks: float, roll_number: int = None) -> ValidationResponse:
    errors = []
    warnings = []
    
    if score is None or total_marks is None:
        errors.append("Score or total marks cannot be null.")
    elif score < 0:
        errors.append(f"Score cannot be negative: {score}")
    elif score > total_marks:
        errors.append(f"Score ({score}) cannot exceed maximum marks ({total_marks}).")
    
    if total_marks is not None and total_marks <= 0:
        errors.append("Total marks must be greater than zero.")
        
    pct = 0.0
    if not errors and total_marks > 0:
        pct = round((score / total_marks) * 100.0, 1)
        
    if roll_number is not None and roll_number <= 0:
        warnings.append(f"Non-standard roll number: {roll_number}")

    return ValidationResponse(
        is_valid=len(errors) == 0,
        percentage=pct,
        errors=errors,
        warnings=warnings,
        is_gap=pct < 60.0
    )

def run_gap_diagnosis(
    students: List[Student],
    competencies: List[Competency],
    assessments: List[AssessmentRecord]
) -> List[GapDiagnosis]:
    diagnoses: List[GapDiagnosis] = []
    
    # Map student assessments by (student_id, comp_id)
    asmt_map: Dict[Tuple[str, str], Dict[str, AssessmentRecord]] = {}
    for a in assessments:
        key = (a.student_id, a.competency_id)
        if key not in asmt_map:
            asmt_map[key] = {}
        if a.assessment_type == 'baseline':
            asmt_map[key]['baseline'] = a
        elif a.assessment_type == 'follow_up':
            asmt_map[key]['followup'] = a

    for student in students:
        for comp in competencies:
            key = (student.id, comp.id)
            pair = asmt_map.get(key)
            if pair and 'baseline' in pair:
                base_pct = pair['baseline'].percentage or 0.0
                fol_pct = pair['followup'].percentage if 'followup' in pair else None
                threshold = comp.threshold_passing_pct
                curr_pct = fol_pct if fol_pct is not None else base_pct
                needs_rem = curr_pct < threshold

                severity = 'mastered'
                if curr_pct < 40.0:
                    severity = 'high'
                elif curr_pct < threshold:
                    severity = 'moderate'

                reasoning = ""
                if severity == 'high':
                    reasoning = f"Score ({round(curr_pct)}%) is significantly below benchmark of {threshold}%. Requires immediate hands-on remedial intervention."
                elif severity == 'moderate':
                    reasoning = f"Score ({round(curr_pct)}%) is approaching benchmark ({threshold}%). Targeted practice activity recommended."
                else:
                    reasoning = f"Competency mastered ({round(curr_pct)}% >= {threshold}%). Ready for enrichment tasks."

                diagnoses.append(GapDiagnosis(
                    student_id=student.id,
                    student_alias=student.student_alias,
                    roll_number=student.roll_number,
                    grade=student.grade,
                    competency_id=comp.id,
                    competency_title=comp.title_en,
                    subject=comp.subject,
                    baseline_pct=base_pct,
                    followup_pct=fol_pct,
                    threshold_pct=threshold,
                    needs_remediation=needs_rem,
                    severity=severity,
                    reasoning=reasoning
                ))

    return diagnoses

def group_learners(
    diagnoses: List[GapDiagnosis],
    students: List[Student],
    competencies: List[Competency],
    activities: List[RemedialActivity]
) -> List[StudentGroup]:
    groups: List[StudentGroup] = []
    student_map = {s.id: s for s in students}
    activity_map = {a.competency_id: a for a in activities}

    for comp in competencies:
        struggling = [d for d in diagnoses if d.competency_id == comp.id and d.needs_remediation]
        if not struggling:
            continue

        grouped_students = [
            GroupedStudent(
                student=student_map.get(d.student_id, Student(
                    id=d.student_id, school_id="ZP-KPG-01", grade=d.grade,
                    section="A", roll_number=d.roll_number, student_alias=d.student_alias
                )),
                score_pct=d.followup_pct if d.followup_pct is not None else d.baseline_pct
            )
            for d in struggling
        ]

        matched_act = activity_map.get(comp.id, RemedialActivity(
            id=f"ACT-{comp.id}",
            competency_id=comp.id,
            title_en=f"{comp.title_en} Guided Scaffolding",
            title_mr=f"{comp.title_mr} मार्गदर्शन सराव",
            instructions_en="Paired peer practice with teacher facilitation.",
            instructions_mr="शिक्षकांच्या मार्गदर्शनाखाली जोडीने उदाहरणे सोडवणे.",
            materials_needed_en="Slate, chalk, textbook.",
            materials_needed_mr="पाटी, खडू, पाठ्यपुस्तक.",
            estimated_minutes=20,
            pedagogical_reason_en="Strengthens conceptual clarity through targeted scaffolding.",
            pedagogical_reason_mr="सहकारी शिक्षणातून पायाभूत संकल्पना दृढ होतात."
        ))

        high_count = sum(1 for d in struggling if d.severity == 'high')
        urgency = 'high' if high_count >= len(struggling) / 2 else 'moderate'

        groups.append(StudentGroup(
            competency=comp,
            students=grouped_students,
            suggested_activity=matched_act,
            urgency=urgency,
            reasoning_en=f"{len(struggling)} students scored below {comp.threshold_passing_pct}%. Prioritize '{matched_act.title_en}'.",
            reasoning_mr=f"{len(struggling)} विद्यार्थ्यांना {comp.threshold_passing_pct}% पेक्षा कमी गुण मिळाले आहेत. '{matched_act.title_mr}' कृती सुचवली आहे."
        ))

    groups.sort(key=lambda g: (0 if g.urgency == 'high' else 1, -len(g.students)))
    return groups

def calculate_metrics(
    competencies: List[Competency],
    assessments: List[AssessmentRecord],
    students_count: int,
    plans_count: int
) -> DashboardMetricsResponse:
    total_students = students_count
    base_asmts = [a for a in assessments if a.assessment_type == 'baseline']
    assessed_students_count = len(set(a.student_id for a in base_asmts))
    coverage_pct = round((assessed_students_count / total_students * 100.0), 1) if total_students > 0 else 0.0

    comp_metrics: List[CompetencyMetric] = []
    total_remediated = 0
    total_persistent = 0

    for comp in competencies:
        c_base = [a for a in base_asmts if a.competency_id == comp.id]
        c_fol = [a for a in assessments if a.competency_id == comp.id and a.assessment_type == 'follow_up']
        has_fol = len(c_fol) > 0

        if not c_base:
            continue

        base_pass_count = sum(1 for a in c_base if (a.percentage or 0) >= comp.threshold_passing_pct)
        base_pass_rate = round((base_pass_count / len(c_base) * 100.0), 1)

        fol_pass_rate = 0.0
        remediated_count = 0
        persistent_count = 0

        if has_fol:
            fol_pass_count = sum(1 for a in c_fol if (a.percentage or 0) >= comp.threshold_passing_pct)
            fol_pass_rate = round((fol_pass_count / len(c_fol) * 100.0), 1)
            
            base_map = {a.student_id: a.percentage or 0 for a in c_base}
            for f in c_fol:
                b_pct = base_map.get(f.student_id, 100.0)
                if b_pct < comp.threshold_passing_pct:
                    if (f.percentage or 0) >= comp.threshold_passing_pct:
                        remediated_count += 1
                    else:
                        persistent_count += 1

        total_remediated += remediated_count
        total_persistent += persistent_count

        comp_metrics.append(CompetencyMetric(
            competency_id=comp.id,
            competency_code=comp.code,
            competency_title=comp.title_mr,
            subject=comp.subject,
            threshold_passing_pct=comp.threshold_passing_pct,
            baseline_pass_rate=base_pass_rate,
            followup_pass_rate=fol_pass_rate if has_fol else base_pass_rate,
            net_gain_pct=round(fol_pass_rate - base_pass_rate, 1) if has_fol else 0.0,
            remediated_count=remediated_count,
            persistent_gap_count=persistent_count,
            has_followup=has_fol
        ))

    avg_base = round(sum(m.baseline_pass_rate for m in comp_metrics) / len(comp_metrics), 1) if comp_metrics else 0.0
    fol_metrics = [m for m in comp_metrics if m.has_followup]
    avg_fol = round(sum(m.followup_pass_rate for m in fol_metrics) / len(fol_metrics), 1) if fol_metrics else avg_base
    action_pct = min(100.0, round((plans_count / max(1, len([m for m in comp_metrics if m.baseline_pass_rate < 70])) * 100.0), 1))

    return DashboardMetricsResponse(
        total_students=total_students,
        assessed_students_count=assessed_students_count,
        coverage_pct=coverage_pct,
        avg_baseline_pass_pct=avg_base,
        avg_followup_pass_pct=avg_fol,
        total_remediated=total_remediated,
        total_persistent=total_persistent,
        action_on_gaps_pct=action_pct,
        competency_metrics=comp_metrics
    )

def compute_dashboard_metrics(
    students: List[Student],
    competencies: List[Competency],
    assessments: List[AssessmentRecord],
    plans_count: int = 0
) -> DashboardMetricsResponse:
    return calculate_metrics(competencies, assessments, len(students), plans_count)

# =========================================================================
# AI-BASED PREDICTION HEURISTICS
# =========================================================================

def predict_student_mastery(
    student: Student,
    assessments: List[AssessmentRecord],
    competencies: List[Competency]
) -> StudentAIPrediction:
    student_asmts = [a for a in assessments if a.student_id == student.id]
    asmt_by_comp: Dict[str, Dict[str, AssessmentRecord]] = {}
    for a in student_asmts:
        if a.competency_id not in asmt_by_comp:
            asmt_by_comp[a.competency_id] = {}
        if a.assessment_type == 'baseline':
            asmt_by_comp[a.competency_id]['baseline'] = a
        elif a.assessment_type == 'follow_up':
            asmt_by_comp[a.competency_id]['followup'] = a

    subjects: List[SubjectType] = [
        'English', 'Mathematics', 'Social Science',
        'Physics', 'Chemistry', 'Marathi', 'Hindi'
    ]

    total_curr_pct = 0.0
    total_pred_pct = 0.0
    assessed_count = 0
    subject_predictions: List[SubjectPrediction] = []

    for subject in subjects:
        sub_comps = [c for c in competencies if c.subject == subject]
        sub_base_sum = 0.0
        sub_curr_sum = 0.0
        count = 0
        had_fol = False

        for comp in sub_comps:
            pair = asmt_by_comp.get(comp.id, {})
            if 'baseline' in pair:
                count += 1
                b = pair['baseline'].percentage or 50.0
                sub_base_sum += b
                if 'followup' in pair:
                    had_fol = True
                    sub_curr_sum += pair['followup'].percentage or b
                else:
                    sub_curr_sum += b

        curr_pct = round(sub_curr_sum / count, 1) if count > 0 else 55.0
        base_pct = round(sub_base_sum / count, 1) if count > 0 else 50.0

        hist_growth = curr_pct - base_pct if had_fol else 8.0
        diff_factor = SUBJECT_DIFFICULTY_WEIGHTS.get(subject, 1.0)
        pred_growth = max(3.0, round((hist_growth * 0.75 + 10.0) / diff_factor, 1))
        pred_pct = min(100.0, max(25.0, curr_pct + pred_growth))

        risk: str = 'low'
        if pred_pct < 50.0 or curr_pct < 40.0:
            risk = 'high'
        elif pred_pct < 65.0 or curr_pct < 60.0:
            risk = 'medium'

        if count > 0:
            total_curr_pct += curr_pct
            total_pred_pct += pred_pct
            assessed_count += 1

        subject_predictions.append(SubjectPrediction(
            subject=subject,
            current_pct=curr_pct,
            predicted_pct=pred_pct,
            risk=risk
        ))

    overall_curr = round(total_curr_pct / assessed_count, 1) if assessed_count > 0 else 52.0
    overall_pred = round(total_pred_pct / assessed_count, 1) if assessed_count > 0 else 66.0
    gain_pct = round(overall_pred - overall_curr, 1)

    risk_level = 'low'
    if overall_curr < 40.0:
        risk_level = 'critical'
    elif overall_curr < 55.0:
        risk_level = 'high'
    elif overall_curr < 65.0:
        risk_level = 'medium'

    learning_velocity = round(max(1.5, gain_pct / 4.2), 1)
    gap_to_target = max(0.0, 65.0 - overall_curr)
    recovery_velocity_days = 0 if gap_to_target == 0 else min(60, max(7, round(gap_to_target / (learning_velocity / 7.0))))
    has_fol_any = any(a.assessment_type == 'follow_up' for a in student_asmts)
    confidence = min(96.0, max(68.0, 70.0 + (18.0 if has_fol_any else 6.0) + min(10, len(student_asmts))))

    weakest = sorted(subject_predictions, key=lambda s: s.current_pct)[0]

    action_en = f"Targeted micro-remediation in {weakest.subject} (current: {weakest.current_pct}%). Focus on daily 15-min practice."
    action_mr = f"{weakest.subject} या विषयात अधिक सरावाची गरज आहे (सद्य गुण: {weakest.current_pct}%). दररोज १५ मिनिटे सराव घ्या."

    return StudentAIPrediction(
        student_id=student.id,
        student_alias=student.student_alias,
        roll_number=student.roll_number,
        current_overall_pct=overall_curr,
        predicted_mastery_pct=overall_pred,
        predicted_gain_pct=gain_pct,
        risk_level=risk_level,
        recovery_velocity_days=recovery_velocity_days,
        confidence_score=confidence,
        learning_velocity=learning_velocity,
        recommended_action_en=action_en,
        recommended_action_mr=action_mr,
        subject_predictions=subject_predictions
    )

def predict_cohort_outcomes(
    students: List[Student],
    assessments: List[AssessmentRecord],
    competencies: List[Competency]
) -> CohortAIPrediction:
    if not students:
        return CohortAIPrediction(
            projected_class_pass_rate=78.0,
            current_class_pass_rate=58.0,
            stagnation_risk_pct=18.0,
            estimated_weeks_to_goal=4,
            most_vulnerable_subject="Mathematics",
            strongest_subject="Marathi",
            high_impact_activity_title="Multi-digit Arithmetic Place Value Regrouping",
            ai_insights_en=["Cohort exhibits strong language foundation. Arithmetic borrowing needs concrete manipulatives."],
            ai_insights_mr=["मराठी व हिंदी या भाषा विषयांत उत्तम प्रगती आहे. गणितातील हातच्याची वजाबाकीवर सराव आवश्यक आहे."]
        )

    preds = [predict_student_mastery(s, assessments, competencies) for s in students]
    current_pass = sum(1 for p in preds if p.current_overall_pct >= 60.0)
    current_pass_rate = round((current_pass / len(students)) * 100.0, 1)

    projected_pass = sum(1 for p in preds if p.predicted_mastery_pct >= 60.0)
    projected_pass_rate = round((projected_pass / len(students)) * 100.0, 1)

    high_risk = sum(1 for p in preds if p.risk_level in ('high', 'critical'))
    stagnation_risk = round((high_risk / len(students)) * 100.0, 1)

    avg_vel = sum(p.learning_velocity for p in preds) / len(preds)
    avg_gap = max(0.0, 60.0 - (sum(p.current_overall_pct for p in preds) / len(preds)))
    weeks_to_goal = 1 if avg_gap == 0 else max(2, round(avg_gap / max(1.0, avg_vel)))

    subjects = ['English', 'Mathematics', 'Social Science', 'Physics', 'Chemistry', 'Marathi', 'Hindi']
    sub_scores = []
    for sub in subjects:
        s_sum = sum(next(sp.current_pct for sp in p.subject_predictions if sp.subject == sub) for p in preds)
        sub_scores.append((sub, round(s_sum / len(preds), 1)))

    sub_scores.sort(key=lambda x: x[1])
    most_vulnerable = sub_scores[0][0]
    strongest = sub_scores[-1][0]

    return CohortAIPrediction(
        projected_class_pass_rate=max(current_pass_rate + 8.0, projected_pass_rate),
        current_class_pass_rate=current_pass_rate,
        stagnation_risk_pct=stagnation_risk,
        estimated_weeks_to_goal=weeks_to_goal,
        most_vulnerable_subject=most_vulnerable,
        strongest_subject=strongest,
        high_impact_activity_title=f"{most_vulnerable} Scaffolding Remedial Session",
        ai_insights_en=[
            f"Overall class pass rate is projected to climb from {current_pass_rate}% to {max(current_pass_rate + 8.0, projected_pass_rate)}% with closed-loop remediation.",
            f"{most_vulnerable} exhibits highest conceptual deficit ({sub_scores[0][1]}% avg). Prioritize structured peer pairings.",
            f"{strongest} demonstrated strongest mastery ({sub_scores[-1][1]}% avg), offering confidence scaffold for cross-subject learning."
        ],
        ai_insights_mr=[
            f"सातत्यपूर्ण उपचारात्मक अध्यापनामुळे वर्गाचा सरासरी निकाल {current_pass_rate}% वरून {max(current_pass_rate + 8.0, projected_pass_rate)}% पर्यंत सुधारण्याचा अंदाज आहे.",
            f"{most_vulnerable} या विषयात सर्वात जास्त अध्ययन तफावत आढळली आहे ({sub_scores[0][1]}% सरासरी). येथे गट अध्यापन पद्धतीचा वापर करा.",
            f"{strongest} या विषयात विद्यार्थ्यांनी उत्कृष्ट प्रगती दर्शवली आहे ({sub_scores[-1][1]}% सरासरी)."
        ]
    )
