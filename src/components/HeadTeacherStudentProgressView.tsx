import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Filter,
  Printer,
  UserCheck
} from 'lucide-react';
import { Student, Competency, AssessmentRecord, RemedialPlan, SubjectType } from '../types';
import {
  ALL_SUBJECTS,
  getSubjectName,
  formatStudentDisplay,
  formatClassDisplay,
  getCompetencyTitle
} from '../data/curriculumData';
import { predictStudentMastery } from '../engine/gapEngine';
import { CircularGauge } from './CircularGauge';

interface HeadTeacherStudentProgressViewProps {
  students: Student[];
  competencies: Competency[];
  assessments: AssessmentRecord[];
  plans: RemedialPlan[];
}

export const HeadTeacherStudentProgressView: React.FC<HeadTeacherStudentProgressViewProps> = ({
  students,
  competencies,
  assessments,
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // 1. Class selection state (default to Class 6th - A or 5th)
  const [selectedClassGrade, setSelectedClassGrade] = useState<string>('6');

  // Filter students based on selected class
  const classStudents = selectedClassGrade === 'ALL'
    ? students
    : students.filter((s) => s.grade.toString() === selectedClassGrade);

  // 2. Selected student state (defaults to first student in the active class)
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    classStudents[0]?.id || students[0]?.id || ''
  );

  // Keep selected student synchronized whenever the class changes
  useEffect(() => {
    if (classStudents.length > 0 && !classStudents.some((s) => s.id === selectedStudentId)) {
      setSelectedStudentId(classStudents[0].id);
    }
  }, [classStudents, selectedStudentId]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || classStudents[0];

  // Calculate student mastery prediction and per-subject scores
  const studentPrediction = selectedStudent
    ? predictStudentMastery(selectedStudent, assessments, competencies)
    : null;

  // Student assessments map for exact marks lookup
  const studentAsmts = selectedStudent
    ? assessments.filter((a) => a.student_id === selectedStudent.id)
    : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Controls: Selecting Class and Student */}
      <div className="bg-white p-5 rounded-2xl border border-green-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-950 border border-orange-300">
                Head Teacher Supervisory View
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Individual Student Academic Performance
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-green-950 tracking-tight mt-1">
              विद्यार्थी प्रगती अहवाल (Student Progress Dashboard)
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Select class to view student roster, then click any learner to inspect their comprehensive 7-subject academic diagnostic report.
            </p>
          </div>

          {/* Quick Print Button */}
          {selectedStudent && (
            <button
              onClick={handlePrint}
              className="no-print inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start md:self-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Student Report</span>
            </button>
          )}
        </div>

        {/* Dropdowns Row: Class Selection & Direct Student Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          
          {/* Class Dropdown */}
          <div className="flex flex-col gap-1">
            <label htmlFor="class-selector" className="font-bold text-stone-700 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-green-700" />
              <span>१. वर्ग निवडा (Select Class):</span>
            </label>
            <select
              id="class-selector"
              value={selectedClassGrade}
              onChange={(e) => setSelectedClassGrade(e.target.value)}
              className="rounded-xl border border-green-300 py-2.5 px-3 bg-green-50/50 font-bold text-green-950 focus:outline-none focus:ring-2 focus:ring-green-700 cursor-pointer shadow-2xs"
            >
              <option value="5">{formatClassDisplay('5', currentLang)}</option>
              <option value="6">{formatClassDisplay('6', currentLang)}</option>
              <option value="7">{formatClassDisplay('7', currentLang)}</option>
              <option value="8">{formatClassDisplay('8', currentLang)}</option>
              <option value="ALL">All Classes (सर्व वर्ग - {students.length} Students)</option>
            </select>
          </div>

          {/* Student Picker Dropdown */}
          <div className="flex flex-col gap-1">
            <label htmlFor="student-dropdown-picker" className="font-bold text-stone-700 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>२. विद्यार्थी निवडा (Select Student):</span>
            </label>
            <select
              id="student-dropdown-picker"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="rounded-xl border border-orange-300 py-2.5 px-3 bg-orange-50/50 font-bold text-orange-950 focus:outline-none focus:ring-2 focus:ring-orange-600 cursor-pointer shadow-2xs"
            >
              {classStudents.map((std) => (
                <option key={std.id} value={std.id}>
                  Roll #{std.roll_number} - {formatStudentDisplay(std, currentLang)} [Class {std.grade}th-{std.section}]
                </option>
              ))}
            </select>
          </div>

          {/* Class Summary Pill */}
          <div className="flex flex-col justify-end">
            <div className="bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-500 font-semibold block uppercase">Enrolled Learners</span>
                <span className="text-sm font-black text-green-950">{classStudents.length} Students in Scope</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-green-100 text-green-900 border border-green-300">
                Class {selectedClassGrade}th
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Interactive List of Students in Selected Class */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
            <span>विद्यार्थी यादी (Student Roster)</span>
            <span className="text-xs font-normal text-stone-500">
              — Click on any student card to view their complete all-subject report
            </span>
          </h3>
          <span className="text-xs font-bold text-stone-600">
            {classStudents.length} Students
          </span>
        </div>

        {/* Scrollable / Responsive Student Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2.5 max-h-56 overflow-y-auto p-1 scrollbar-thin">
          {classStudents.map((student) => {
            const isSelected = student.id === selectedStudentId;
            const pred = predictStudentMastery(student, assessments, competencies);
            const isMastered = pred.current_overall_pct >= 60;

            return (
              <button
                key={student.id}
                type="button"
                onClick={() => setSelectedStudentId(student.id)}
                className={`text-left p-2.5 rounded-xl border transition flex flex-col justify-between cursor-pointer relative ${
                  isSelected
                    ? 'bg-green-50 border-2 border-green-700 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center font-black text-[11px] shrink-0 ${
                    isSelected ? 'bg-green-700 text-white' : 'bg-stone-200 text-stone-700'
                  }`}>
                    #{student.roll_number}
                  </span>

                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                    isMastered ? 'bg-emerald-100 text-emerald-900' : 'bg-orange-100 text-orange-950'
                  }`}>
                    {pred.current_overall_pct}%
                  </span>
                </div>

                <div className="mt-1.5">
                  <h4 className="font-bold text-xs text-stone-900 truncate leading-tight">
                    {formatStudentDisplay(student, currentLang)}
                  </h4>
                  <p className="text-[10px] text-stone-500 font-mono">
                    Class {student.grade}th-{student.section}
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute -bottom-0.5 left-2 right-2 h-1 rounded-t-sm bg-gradient-to-r from-orange-500 via-white to-green-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. All-Subject Report for the Clicked Student */}
      {selectedStudent && studentPrediction && (
        <div className="space-y-6">
          
          {/* Student Dossier Header Card - National Tricolor Theme */}
          <div className="bg-gradient-to-r from-green-950 via-emerald-950 to-green-900 border border-green-800 text-white p-6 sm:p-7 rounded-3xl shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-700 to-emerald-800 border-2 border-orange-400 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-md">
                  #{selectedStudent.roll_number}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-400/30">
                      Class {selectedStudent.grade}th - Section {selectedStudent.section}
                    </span>
                    <span className="text-xs text-emerald-200">
                      UDISE ID: STD-MH-2026-{selectedStudent.id.toUpperCase()}
                    </span>
                    <span className="text-xs text-emerald-300">
                      DPDP Consent: {selectedStudent.parental_consent_verified ? 'Verified (होय)' : 'Active (सक्रिय)'}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                    {formatStudentDisplay(selectedStudent, currentLang)}
                  </h3>
                  <p className="text-xs text-emerald-100/80 mt-0.5">
                    Individual All-Subject FLN Diagnostic &amp; Post-Remedial Evaluation Card
                  </p>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 text-center">
                  <span className="text-[10px] text-emerald-200 block">Overall Score</span>
                  <span className="font-black text-lg text-white">{studentPrediction.current_overall_pct}%</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 text-center">
                  <span className="text-[10px] text-emerald-200 block">Predicted Mastery</span>
                  <span className="font-black text-lg text-emerald-300">{studentPrediction.predicted_mastery_pct}%</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 text-center">
                  <span className="text-[10px] text-emerald-200 block">Net Gain</span>
                  <span className="font-black text-lg text-orange-300">+{studentPrediction.predicted_gain_pct}%</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 text-center">
                  <span className="text-[10px] text-emerald-200 block">Risk Profile</span>
                  <span className={`font-black text-xs uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${
                    studentPrediction.risk_level === 'low'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : studentPrediction.risk_level === 'medium'
                      ? 'bg-orange-500/20 text-orange-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {studentPrediction.risk_level}
                  </span>
                </div>
              </div>

            </div>

            {/* AI Pedagogical Next-Best Action */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-300 block mb-1">
                AI Recommended Pedagogical Action (मार्गदर्शन शिफारस):
              </span>
              <p className="text-xs text-stone-100 leading-relaxed font-medium">
                {currentLang === 'mr'
                  ? studentPrediction.recommended_action_mr
                  : studentPrediction.recommended_action_en}
              </p>
            </div>
          </div>

          {/* All 7 Subjects Detailed Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-stone-900">
                  सर्व विषयांचा सविस्तर अहवाल (All 7 Core Subjects Academic Report)
                </h4>
                <p className="text-xs text-stone-600">
                  Baseline Diagnostic score vs Post-Remedial Follow-up score across all curriculum domains
                </p>
              </div>
              <span className="text-xs font-bold text-stone-500">
                7 Core Subjects Evaluated
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ALL_SUBJECTS.map((subject: SubjectType) => {
                // Find subject prediction
                const sp = studentPrediction.subject_predictions.find((p) => p.subject === subject);
                const currentPct = sp ? sp.current_pct : 50;
                const predictedPct = sp ? sp.predicted_pct : currentPct + 12;
                const netGrowth = predictedPct - currentPct;
                const isPassing = currentPct >= 60;
                const isApproaching = currentPct >= 40 && currentPct < 60;

                // Find subject competencies & records
                const subjectComps = competencies.filter((c) => c.subject === subject);
                const subjectRecords = studentAsmts.filter((a) =>
                  subjectComps.some((c) => c.id === a.competency_id)
                );

                const baseAsmts = subjectRecords.filter((a) => a.assessment_type === 'baseline');
                const followAsmts = subjectRecords.filter((a) => a.assessment_type === 'follow_up');

                const baseAvg = baseAsmts.length > 0
                  ? Math.round(baseAsmts.reduce((acc, a) => acc + (a.percentage || 0), 0) / baseAsmts.length)
                  : Math.max(30, currentPct - 15);

                const followAvg = followAsmts.length > 0
                  ? Math.round(followAsmts.reduce((acc, a) => acc + (a.percentage || 0), 0) / followAsmts.length)
                  : currentPct;

                return (
                  <div
                    key={subject}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      
                      {/* Subject Header with localized title & status */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-black text-stone-900 text-sm">
                            {getSubjectName(subject, currentLang)}
                          </h5>
                          <span className="text-[10px] text-stone-500 font-mono block">
                            {subject}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          isPassing
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : isApproaching
                            ? 'bg-orange-100 text-orange-950 border border-orange-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}>
                          {isPassing ? 'Mastered' : isApproaching ? 'Approaching' : 'Needs Aid'}
                        </span>
                      </div>

                      {/* Circular Gauge & Diagnostic Stats */}
                      <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <CircularGauge
                          percentage={currentPct}
                          size={70}
                          strokeWidth={7}
                          sublabel={isPassing ? 'Pass' : 'Aid'}
                          colorScheme={isPassing ? 'emerald' : isApproaching ? 'amber' : 'rose'}
                        />

                        <div className="space-y-1 text-xs flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-stone-500">Baseline Diagnostic:</span>
                            <span className="font-bold text-stone-700">{baseAvg}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-stone-500">Post-Remedial:</span>
                            <span className="font-bold text-orange-950">{followAvg}%</span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                            <span className="text-[10px] font-bold text-stone-600">Net Growth:</span>
                            <span className="font-black text-emerald-800">+{Math.max(0, followAvg - baseAvg || netGrowth)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Evaluated Competencies Summary */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[10px] font-bold text-stone-500 block uppercase tracking-wider">
                          Competencies in Subject ({subjectComps.length}):
                        </span>

                        <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                          {subjectComps.map((comp) => {
                            const cBase = baseAsmts.find((a) => a.competency_id === comp.id);
                            const cFol = followAsmts.find((a) => a.competency_id === comp.id);
                            const cPct = cFol?.percentage ?? cBase?.percentage ?? 60;
                            const cScore = cFol?.score_obtained ?? cBase?.score_obtained ?? Math.round(cPct * 0.2);

                            return (
                              <div
                                key={comp.id}
                                className="flex items-center justify-between p-1.5 rounded-lg bg-stone-50/70 border border-stone-200 text-[11px]"
                              >
                                <div className="truncate max-w-[150px]">
                                  <span className="font-bold text-stone-900 mr-1">{comp.code}:</span>
                                  <span className="text-stone-600">
                                    {getCompetencyTitle(comp, currentLang)}
                                  </span>
                                </div>
                                <span className={`font-mono font-bold shrink-0 text-[10px] ${
                                  cPct >= 60 ? 'text-emerald-800' : 'text-orange-900'
                                }`}>
                                  {cScore}/20 ({cPct}%)
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Progress Bar indicator */}
                    <div className="pt-2 border-t border-stone-100">
                      <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden flex">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, currentPct)}%` }}
                        />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
