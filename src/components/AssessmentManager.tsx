import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, PlusCircle, CheckCircle2, AlertTriangle, Download, FileSpreadsheet, Trash2 } from 'lucide-react';
import { Student, Competency, AssessmentRecord, AssessmentType } from '../types';
import { validateAssessmentRecord } from '../engine/gapEngine';
import { getCompetencyTitle, formatStudentDisplay } from '../data/curriculumData';

interface AssessmentManagerProps {
  students: Student[];
  competencies: Competency[];
  assessments: AssessmentRecord[];
  onAddAssessment: (asmt: Omit<AssessmentRecord, 'id'>) => Promise<void>;
  onBatchUpload: (asmts: Omit<AssessmentRecord, 'id'>[]) => Promise<void>;
  onDeleteAssessment: (id: string) => Promise<void>;
}

export const AssessmentManager: React.FC<AssessmentManagerProps> = ({
  students,
  competencies,
  assessments,
  onAddAssessment,
  onBatchUpload,
  onDeleteAssessment,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // Manual Form State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedCompetencyId, setSelectedCompetencyId] = useState<string>(competencies[0]?.id || '');
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('baseline');
  const [score, setScore] = useState<string>('5');
  const [totalMarks, setTotalMarks] = useState<string>('10');
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // CSV Import State
  const [csvStatus, setCsvStatus] = useState<{ message: string; type: 'success' | 'error' | 'idle' }>({
    message: '',
    type: 'idle'
  });

  // Filter State
  const [filterCompetency, setFilterCompetency] = useState<string>('ALL');

  // Real-time Data Validation
  const numericScore = parseFloat(score);
  const numericTotal = parseFloat(totalMarks);
  const validation = validateAssessmentRecord(numericScore, numericTotal);
  const currentPct = (!isNaN(numericScore) && !isNaN(numericTotal) && numericTotal > 0)
    ? Math.round((numericScore / numericTotal) * 100)
    : 0;

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) return;

    try {
      await onAddAssessment({
        student_id: selectedStudentId || students[0].id,
        competency_id: selectedCompetencyId || competencies[0].id,
        assessment_type: assessmentType,
        score_obtained: numericScore,
        total_marks: numericTotal,
        percentage: currentPct,
        assessed_at: new Date().toISOString().split('T')[0],
        synced: false
      });

      setFormSuccess(t('assessment.savedSuccess'));
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent =
      "roll_number,student_alias,grade,competency_code,assessment_type,score_obtained,total_marks\n" +
      "1,Learner 1,3,NUM-01,baseline,8,10\n" +
      "2,Learner 2,3,NUM-02,baseline,3,10\n" +
      "3,Learner 3,3,NUM-02,baseline,4,10\n" +
      "4,Learner 4,3,LIT-01,baseline,2,10\n" +
      "2,Learner 2,3,NUM-02,follow_up,8,10\n";

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'learngap_sample_assessments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length <= 1) {
          setCsvStatus({ message: 'CSV file is empty or invalid header.', type: 'error' });
          return;
        }

        const newRecords: Omit<AssessmentRecord, 'id'>[] = [];
        let skippedRows = 0;

        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map(p => p.trim());
          if (parts.length < 7) continue;

          const rollNo = parseInt(parts[0], 10);
          const compCode = parts[3];
          const asmtType = parts[4] === 'follow_up' ? 'follow_up' : 'baseline';
          const scoreObt = parseFloat(parts[5]);
          const maxMarks = parseFloat(parts[6]);

          const student = students.find(s => s.roll_number === rollNo);
          const comp = competencies.find(c => c.code === compCode || c.id === compCode);

          if (!student || !comp) {
            skippedRows++;
            continue;
          }

          const recordValidation = validateAssessmentRecord(scoreObt, maxMarks);
          if (!recordValidation.isValid) {
            skippedRows++;
            continue;
          }

          newRecords.push({
            student_id: student.id,
            competency_id: comp.id,
            assessment_type: asmtType,
            score_obtained: scoreObt,
            total_marks: maxMarks,
            percentage: Math.round((scoreObt / maxMarks) * 100),
            assessed_at: new Date().toISOString().split('T')[0],
            synced: false
          });
        }

        if (newRecords.length > 0) {
          await onBatchUpload(newRecords);
          setCsvStatus({
            message: `Successfully validated and imported ${newRecords.length} records (${skippedRows} skipped/invalid).`,
            type: 'success'
          });
        } else {
          setCsvStatus({
            message: `No matching records found. Please check student roll numbers and competency codes.`,
            type: 'error'
          });
        }
      } catch (err) {
        console.error('Error parsing CSV', err);
        setCsvStatus({ message: 'Error parsing CSV file format.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const filteredAssessments = filterCompetency === 'ALL'
    ? assessments
    : assessments.filter(a => a.competency_id === filterCompetency);

  return (
    <div className="space-y-6">
      
      {/* Module Title Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {t('assessment.title')}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {t('assessment.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form & CSV Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Manual Entry Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <PlusCircle className="w-5 h-5 text-brand-600" />
              <h3 className="font-semibold text-slate-900">
                {t('assessment.manualEntry')}
              </h3>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              
              {/* Student Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('assessment.studentAlias')}
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {formatStudentDisplay(st, currentLang)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Competency Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('assessment.selectCompetency')}
                </label>
                <select
                  value={selectedCompetencyId}
                  onChange={(e) => setSelectedCompetencyId(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  {competencies.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      [{comp.code}] {getCompetencyTitle(comp, currentLang)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assessment Type Radio Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('assessment.asmtType')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAssessmentType('baseline')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition ${
                      assessmentType === 'baseline'
                        ? 'bg-blue-50 text-blue-800 border-blue-300 font-semibold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t('assessment.baseline')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssessmentType('follow_up')}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition ${
                      assessmentType === 'follow_up'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t('assessment.followup')}
                  </button>
                </div>
              </div>

              {/* Marks Entry with Live Validation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('assessment.scoreObtained')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={totalMarks}
                    step="0.5"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full text-sm font-semibold rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('assessment.totalMarks')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full text-sm font-semibold rounded-lg border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                </div>
              </div>

              {/* Data Quality Live Feedback */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-600">{t('assessment.calculatedPct')}</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-xs ${
                    currentPct < 40
                      ? 'bg-rose-100 text-rose-800'
                      : currentPct < 60
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentPct}% • {currentPct < 60 ? t('assessment.gapFlagged') : t('assessment.mastered')}
                </span>
              </div>

              {validation.errors.length > 0 && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{validation.errors[0]}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!validation.isValid}
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-sm transition"
              >
                {t('assessment.saveRecord')}
              </button>
            </form>
          </div>

          {/* Batch CSV Upload Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-900">
                  {t('assessment.csvUpload')}
                </h3>
              </div>
              <button
                type="button"
                onClick={downloadSampleCSV}
                className="inline-flex items-center gap-1 text-xs text-brand-700 hover:text-brand-800 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('assessment.downloadSample')}</span>
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-xl p-4 text-center cursor-pointer transition">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <label className="cursor-pointer">
                <span className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                  Click to select CSV file
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  Accepts standard school marksheets (.csv)
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFile}
                  className="hidden"
                />
              </label>
            </div>

            {csvStatus.message && (
              <div
                className={`mt-3 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  csvStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {csvStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{csvStatus.message}</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Assessment Records Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-900">
                  {t('assessment.recentRecords')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('assessment.totalRecords')} {assessments.length}
                </p>
              </div>

              {/* Filter Dropdown */}
              <select
                value={filterCompetency}
                onChange={(e) => setFilterCompetency(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 py-1.5 px-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="ALL">{t('assessment.filterByCompetency')}</option>
                {competencies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.code} - {getCompetencyTitle(comp, currentLang)}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">{t('assessment.tableRoll')}</th>
                    <th className="py-2.5 px-3">{t('assessment.tableComp')}</th>
                    <th className="py-2.5 px-3">{t('assessment.tableType')}</th>
                    <th className="py-2.5 px-3">{t('assessment.tableScore')}</th>
                    <th className="py-2.5 px-3">{t('assessment.tableStatus')}</th>
                    <th className="py-2.5 px-3 text-right">{t('assessment.tableAction')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssessments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        {t('assessment.noRecords')}
                      </td>
                    </tr>
                  ) : (
                    filteredAssessments.slice(-15).reverse().map((asmt) => {
                      const student = students.find((s) => s.id === asmt.student_id);
                      const comp = competencies.find((c) => c.id === asmt.competency_id);
                      const isPassing = asmt.percentage >= (comp?.threshold_passing_pct || 60);

                      return (
                        <tr key={asmt.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                            {student ? formatStudentDisplay(student, currentLang) : `Student ${asmt.student_id}`}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-semibold text-slate-800">[{comp?.code}]</span>{' '}
                            <span className="text-slate-500 text-[11px] truncate inline-block max-w-[140px] align-bottom">
                              {comp ? getCompetencyTitle(comp, currentLang) : ''}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                asmt.assessment_type === 'baseline'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {asmt.assessment_type === 'baseline' ? t('assessment.baseline') : t('assessment.followup')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap font-semibold">
                            {asmt.score_obtained} / {asmt.total_marks}{' '}
                            <span className="text-slate-400 font-normal">({asmt.percentage}%)</span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                isPassing
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : asmt.percentage < 40
                                  ? 'bg-rose-100 text-rose-800 font-semibold'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isPassing ? t('assessment.mastered') : t('assessment.gapFlagged')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => onDeleteAssessment(asmt.id)}
                              className="text-slate-400 hover:text-rose-600 transition p-1"
                              title={t('common.deleteTitle')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
