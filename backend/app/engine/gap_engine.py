from typing import List, Dict, Tuple
from ..models import (
    Student, Competency, RemedialActivity, AssessmentRecord,
    GapDiagnosis, StudentGroup, GroupedStudent, CompetencyMetric,
    DashboardMetricsResponse, ValidationResponse
)

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
            entry = asmt_map.get(key)
            if entry and 'baseline' in entry:
                base_pct = entry['baseline'].percentage or (entry['baseline'].score_obtained / entry['baseline'].total_marks * 100.0)
                fol_pct = None
                if 'followup' in entry:
                    fol_pct = entry['followup'].percentage or (entry['followup'].score_obtained / entry['followup'].total_marks * 100.0)
                    
                current_pct = fol_pct if fol_pct is not None else base_pct
                threshold = comp.threshold_passing_pct
                needs_remediation = current_pct < threshold
                
                if current_pct < 40.0:
                    severity = 'high'
                    reasoning = f"गुण ({round(current_pct)}%) निपुण निकषाच्या ({threshold}%) खूप खाली आहेत. तातडीने उपचारात्मक प्रत्यक्ष कृतीची गरज आहे."
                elif current_pct < threshold:
                    severity = 'moderate'
                    reasoning = f"गुण ({round(current_pct)}%) उत्तीर्ण निकषाच्या जवळ आहेत ({threshold}%). निर्देशित सरावाची गरज आहे."
                else:
                    severity = 'mastered'
                    reasoning = f"क्षमता प्राप्त झाली आहे ({round(current_pct)}% >= {threshold}%)."

                diagnoses.append(GapDiagnosis(
                    student_id=student.id,
                    student_alias=student.student_alias,
                    roll_number=student.roll_number,
                    grade=student.grade,
                    competency_id=comp.id,
                    competency_title=comp.title_en,
                    subject=comp.subject,
                    baseline_pct=round(base_pct, 1),
                    followup_pct=round(fol_pct, 1) if fol_pct is not None else None,
                    threshold_pct=threshold,
                    needs_remediation=needs_remediation,
                    severity=severity,
                    reasoning=reasoning
                ))
                
    return diagnoses

def cluster_students_by_competency(
    diagnoses: List[GapDiagnosis],
    students: List[Student],
    competencies: List[Competency],
    activities: List[RemedialActivity]
) -> List[StudentGroup]:
    groups: List[StudentGroup] = []
    student_dict = {s.id: s for s in students}
    activity_dict = {a.competency_id: a for a in activities}

    for comp in competencies:
        struggling = [d for d in diagnoses if d.competency_id == comp.id and d.needs_remediation]
        if struggling:
            grouped_students = [
                GroupedStudent(
                    student=student_dict.get(d.student_id, Student(
                        id=d.student_id, school_id="UNKNOWN", grade=d.grade,
                        section="A", roll_number=d.roll_number,
                        student_alias=d.student_alias, parental_consent_verified=True
                    )),
                    score_pct=d.followup_pct if d.followup_pct is not None else d.baseline_pct
                )
                for d in struggling
            ]

            matched_act = activity_dict.get(comp.id, RemedialActivity(
                id=f"ACT-DEF-{comp.id}",
                competency_id=comp.id,
                title_en=f"{comp.title_en} Targeted Drill",
                title_mr=f"{comp.title_mr} सराव कृती",
                instructions_en="Conduct peer group learning.",
                instructions_mr="विद्यार्थ्यांचा जोडीने सराव घ्या.",
                materials_needed_en="Slate and chalk.",
                materials_needed_mr="पाटी आणि खडू.",
                estimated_minutes=20,
                is_teacher_reviewed=True,
                pedagogical_reason_en="Scaffolds fundamental competency.",
                pedagogical_reason_mr="पायाभूत संकल्पना दृढ होते."
            ))

            high_severity = sum(1 for d in struggling if d.severity == 'high')
            urgency = 'high' if high_severity >= len(struggling) / 2 else 'moderate'

            groups.append(StudentGroup(
                competency=comp,
                students=grouped_students,
                suggested_activity=matched_act,
                urgency=urgency,
                reasoning_en=f"{len(struggling)} learners scored below {comp.threshold_passing_pct}%. Suggested: {matched_act.title_en}.",
                reasoning_mr=f"{len(struggling)} विद्यार्थ्यांना {comp.threshold_passing_pct}% पेक्षा कमी गुण मिळाले आहेत. संकल्पना स्पष्टतेसाठी '{matched_act.title_mr}' ही कृती सुचवली आहे."
            ))

    # Sort high urgency first
    groups.sort(key=lambda g: (0 if g.urgency == 'high' else 1, -len(g.students)))
    return groups

def compute_dashboard_metrics(
    students: List[Student],
    competencies: List[Competency],
    assessments: List[AssessmentRecord],
    plans_count: int
) -> DashboardMetricsResponse:
    total_students = len(students)
    baseline_asmts = [a for a in assessments if a.assessment_type == 'baseline']
    assessed_students_count = len(set(a.student_id for a in baseline_asmts))
    coverage_pct = round((assessed_students_count / total_students * 100.0), 1) if total_students > 0 else 0.0

    comp_metrics: List[CompetencyMetric] = []
    total_remediated = 0
    total_persistent = 0

    for comp in competencies:
        c_base = [a for a in baseline_asmts if a.competency_id == comp.id]
        c_fol = [a for a in assessments if a.competency_id == comp.id and a.assessment_type == 'follow_up']
        
        base_pass_count = sum(1 for a in c_base if (a.percentage or 0) >= comp.threshold_passing_pct)
        base_pass_rate = round((base_pass_count / len(c_base) * 100.0), 1) if c_base else 0.0
        
        fol_pass_rate = 0.0
        remediated_count = 0
        persistent_count = 0
        has_fol = len(c_fol) > 0

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
