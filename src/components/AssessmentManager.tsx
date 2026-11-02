import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Upload,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2,
  Edit2,
  Database,
  HelpCircle,
  X,
  Save,
  CloudUpload,
  Copy,
  Check
} from 'lucide-react';
import { Student, Competency, AssessmentRecord, AssessmentType } from '../types';
import { validateAssessmentRecord } from '../engine/gapEngine';
import { getCompetencyTitle, formatStudentDisplay, ALL_SUBJECTS } from '../data/curriculumData';
import { isSupabaseConfigured, checkSupabaseConnection, syncAllAssessmentsToSupabase } from '../lib/supabaseClient';

interface AssessmentManagerProps {
  students: Student[];
  competencies: Competency[];
  assessments: AssessmentRecord[];
  selectedClassGrade?: string;
  onClassGradeChange?: (grade: string) => void;
  onAddAssessment: (asmt: Omit<AssessmentRecord, 'id'>) => Promise<void>;
  onUpdateAssessment: (id: string, updates: Partial<AssessmentRecord>) => Promise<void>;
  onBatchUpload: (asmts: Omit<AssessmentRecord, 'id'>[]) => Promise<void>;
  onDeleteAssessment: (id: string) => Promise<void>;
}

export const AssessmentManager: React.FC<AssessmentManagerProps> = ({
  students,
  competencies,
  assessments,
  selectedClassGrade,
  onClassGradeChange,
  onAddAssessment,
  onUpdateAssessment,
  onDeleteAssessment,
  onBatchUpload,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // Manual Form State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'std-501');
  const [selectedCompetencyId, setSelectedCompetencyId] = useState<string>(competencies[0]?.id || 'MATH-01');
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('baseline');
  const [score, setScore] = useState<string>('6');
  const [totalMarks, setTotalMarks] = useState<string>('10');
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Edit Marks Modal State
  const [editingRecord, setEditingRecord] = useState<AssessmentRecord | null>(null);
  const [editScore, setEditScore] = useState<string>('');
  const [editTotalMarks, setEditTotalMarks] = useState<string>('10');
  const [editType, setEditType] = useState<AssessmentType>('baseline');

  // Database Setup Instructions Modal State
  const [isDbGuideOpen, setIsDbGuideOpen] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string; rowCount?: number; isRlsIssue?: boolean } | null>(null);
  const [testingDb, setTestingDb] = useState<boolean>(false);

  // Batch DB Sync & Notification State
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<{ synced: number; total: number } | null>(null);
  const [syncNotice, setSyncNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // CSV Import State
  const [csvStatus, setCsvStatus] = useState<{ message: string; type: 'success' | 'error' | 'idle' }>({
    message: '',
    type: 'idle'
  });

  // Filter State
  const [filterSubject, setFilterSubject] = useState<string>('ALL');
  const [filterCompetency, setFilterCompetency] = useState<string>('ALL');
  const [filterClassGrade, setFilterClassGrade] = useState<string>(selectedClassGrade || 'ALL');

  // Class selection for manual entry form
  const [formClassGrade, setFormClassGrade] = useState<string>(selectedClassGrade === 'ALL' ? '5' : (selectedClassGrade || '5'));

  // Sync with global class selection from header or dashboard
  React.useEffect(() => {
    if (selectedClassGrade) {
      setFilterClassGrade(selectedClassGrade);
      setFormClassGrade(selectedClassGrade === 'ALL' ? '5' : selectedClassGrade);
      const classStds = selectedClassGrade === 'ALL'
        ? students
        : students.filter(s => s.grade === parseInt(selectedClassGrade, 10));
      if (classStds.length > 0) {
        setSelectedStudentId(classStds[0].id);
      }
    }
  }, [selectedClassGrade, students]);

  const formStudents = formClassGrade === 'ALL'
    ? students
    : students.filter(s => s.grade === parseInt(formClassGrade, 10));

  const handleFormClassChange = (grade: string) => {
    setFormClassGrade(grade);
    onClassGradeChange?.(grade);
    const classStds = grade === 'ALL'
      ? students
      : students.filter(s => s.grade === parseInt(grade, 10));
    if (classStds.length > 0) {
      setSelectedStudentId(classStds[0].id);
    }
  };

  const handleTableClassChange = (grade: string) => {
    setFilterClassGrade(grade);
    onClassGradeChange?.(grade);
  };

  // Real-time Data Validation for Manual Form
  const numericScore = parseFloat(score);
  const numericTotal = parseFloat(totalMarks);
  const validation = validateAssessmentRecord(numericScore, numericTotal);
  const currentPct = (!isNaN(numericScore) && !isNaN(numericTotal) && numericTotal > 0)
    ? Math.round((numericScore / numericTotal) * 100)
    : 0;

  // Validation for Edit Modal
  const editNumScore = parseFloat(editScore);
  const editNumTotal = parseFloat(editTotalMarks);
  const editValidation = validateAssessmentRecord(editNumScore, editNumTotal);
  const editPct = (!isNaN(editNumScore) && !isNaN(editNumTotal) && editNumTotal > 0)
    ? Math.round((editNumScore / editNumTotal) * 100)
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

  const openEditModal = (asmt: AssessmentRecord) => {
    setEditingRecord(asmt);
    setEditScore(String(asmt.score_obtained));
    setEditTotalMarks(String(asmt.total_marks));
    setEditType(asmt.assessment_type);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord || !editValidation.isValid) return;

    try {
      await onUpdateAssessment(editingRecord.id, {
        score_obtained: editNumScore,
        total_marks: editNumTotal,
        percentage: editPct,
        assessment_type: editType
      });
      setEditingRecord(null);
      setSyncNotice({
        message: isSupabaseConfigured
          ? 'Marks updated locally and dynamically synchronized to Supabase table (assessments)!'
          : 'Marks updated locally in IndexedDB.',
        type: 'success'
      });
      setTimeout(() => setSyncNotice(null), 4500);
    } catch (err) {
      console.error('Error updating assessment score:', err);
      setSyncNotice({
        message: 'Failed to update marks. Please check database permissions.',
        type: 'error'
      });
    }
  };

  const handleSyncAllToSupabase = async () => {
    if (assessments.length === 0) return;
    setIsSyncingAll(true);
    setSyncProgress({ synced: 0, total: assessments.length });

    const result = await syncAllAssessmentsToSupabase(assessments, (synced, total) => {
      setSyncProgress({ synced, total });
    });

    setIsSyncingAll(false);
    if (result.success) {
      setSyncNotice({
        message: `Successfully synchronized all ${result.count} student marks into Supabase DB!`,
        type: 'success'
      });
      // Refresh DB test status
      const updatedStatus = await checkSupabaseConnection();
      setDbStatus(updatedStatus);
      setTimeout(() => setSyncNotice(null), 5000);
    } else {
      setSyncNotice({
        message: `Database sync issue: ${result.error || 'Check Supabase RLS policies'}. Ensure RLS is disabled in Supabase.`,
        type: 'error'
      });
    }
  };

  const handleTestDatabase = async () => {
    setTestingDb(true);
    const result = await checkSupabaseConnection();
    setDbStatus(result);
    setTestingDb(false);
  };

  const downloadSampleCSV = () => {
    const csvContent =
      "roll_number,student_alias,grade,competency_code,assessment_type,score_obtained,total_marks\n" +
      "1,विद्यार्थी १ (Aarav Patil),6,MATH-01,baseline,7,10\n" +
      "2,विद्यार्थी २ (Sakshi Deshmukh),6,ENG-01,baseline,5,10\n" +
      "3,विद्यार्थी ३ (Karan Shinde),6,PHY-01,baseline,4,10\n" +
      "4,विद्यार्थी ४ (Pooja Jadhav),6,CHEM-01,baseline,6,10\n" +
      "1,विद्यार्थी १ (Aarav Patil),6,MATH-01,follow_up,9,10\n";

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'learngap_7subjects_sample_marks.csv');
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
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length <= 1) {
          setCsvStatus({ message: 'CSV file is empty or missing headers.', type: 'error' });
          return;
        }

        // Header-aware column parsing
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
        const rollIdx = headers.indexOf('roll_number') !== -1 ? headers.indexOf('roll_number') : 0;
        const gradeIdx = headers.indexOf('grade');
        const compIdx = headers.findIndex(h => h === 'competency_code' || h === 'competency_id' || h === 'code');
        const typeIdx = headers.indexOf('assessment_type');
        const scoreIdx = headers.findIndex(h => h === 'score_obtained' || h === 'score');
        const totalIdx = headers.findIndex(h => h === 'total_marks' || h === 'total');

        const newRecords: Omit<AssessmentRecord, 'id'>[] = [];
        let skippedRows = 0;

        for (let i = 1; i < lines.length; i++) {
          // Parse CSV line taking quotes into account
          const rowText = lines[i];
          const parts: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let c = 0; c < rowText.length; c++) {
            const char = rowText[c];
            if (char === '"' || char === "'") {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              parts.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          parts.push(current.trim());

          if (parts.length < 5) continue;

          const rollNo = parseInt(parts[rollIdx !== -1 ? rollIdx : 0], 10);
          const rowGrade = gradeIdx !== -1 ? parseInt(parts[gradeIdx], 10) : undefined;
          const compCode = compIdx !== -1 ? parts[compIdx] : parts[3];
          const rawType = typeIdx !== -1 ? parts[typeIdx].toLowerCase() : parts[4]?.toLowerCase();
          const asmtType: AssessmentType = rawType === 'follow_up' || rawType === 'followup' ? 'follow_up' : 'baseline';
          const scoreObt = parseFloat(scoreIdx !== -1 ? parts[scoreIdx] : parts[5]);
          const maxMarks = parseFloat(totalIdx !== -1 ? parts[totalIdx] : parts[6]);

          const student = students.find(s => {
            if (s.roll_number !== rollNo) return false;
            if (rowGrade !== undefined && !isNaN(rowGrade)) {
              return s.grade === rowGrade;
            }
            return true;
          });

          const comp = competencies.find(c => c.code === compCode || c.id === compCode);

          if (!student || !comp || isNaN(scoreObt) || isNaN(maxMarks)) {
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
            message: `No matching records found. Please check student roll numbers, grades, and competency codes.`,
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

  // Filtered Assessments
  const filteredAssessments = assessments.filter(a => {
    const student = students.find(s => s.id === a.student_id);
    if (filterClassGrade !== 'ALL' && student?.grade !== parseInt(filterClassGrade, 10)) return false;
    const comp = competencies.find(c => c.id === a.competency_id);
    if (filterSubject !== 'ALL' && comp?.subject !== filterSubject) return false;
    if (filterCompetency !== 'ALL' && a.competency_id !== filterCompetency) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Module Title Banner & Database Connection Pill */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('assessment.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dynamic assessment manager for 7 subjects • Inline marks editor • Supabase database connected
          </p>
        </div>

        {/* Database Quick Info Pill */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-50 text-slate-700">
            <Database className="w-4 h-4 text-brand-600" />
            <span>
              {isSupabaseConfigured ? 'Supabase Configured' : 'Offline IndexedDB Active'}
            </span>
          </div>

          {isSupabaseConfigured && (
            <button
              onClick={handleSyncAllToSupabase}
              disabled={isSyncingAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Push all student marks (all classes) to Supabase assessments table"
            >
              <CloudUpload className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-bounce' : ''}`} />
              <span>
                {isSyncingAll
                  ? `Syncing (${syncProgress?.synced || 0}/${syncProgress?.total || assessments.length})...`
                  : 'Sync All to DB'}
              </span>
            </button>
          )}

          <button
            onClick={() => setIsDbGuideOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>DB Connection Guide</span>
          </button>
        </div>
      </div>

      {/* Sync Status Toast Alert */}
      {syncNotice && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm transition animate-in fade-in ${
            syncNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {syncNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{syncNotice.message}</span>
          </div>
          <button
            onClick={() => setSyncNotice(null)}
            className="p-1 rounded hover:bg-slate-200/50 text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form & CSV Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Manual Entry Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <PlusCircle className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Add / Record Student Mark
              </h3>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              
              {/* Select Class (5th A, 6th A, 7th A, 8th A, All) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Class (इयत्ता)
                </label>
                <select
                  value={formClassGrade}
                  onChange={(e) => handleFormClassChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-slate-50 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="5">Class 5th - A (इयत्ता ५ वी - अ)</option>
                  <option value="6">Class 6th - A (इयत्ता ६ वी - अ)</option>
                  <option value="7">Class 7th - A (इयत्ता ७ वी - अ)</option>
                  <option value="8">Class 8th - A (इयत्ता ८ वी - अ)</option>
                  <option value="ALL">All Classes (सर्व वर्ग)</option>
                </select>
              </div>

              {/* Select Student */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Name ({formStudents.length} Learners in {formClassGrade === 'ALL' ? 'School' : `Class ${formClassGrade}th-A`})
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {formStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      [Class {s.grade}th-A] Roll #{s.roll_number} - {formatStudentDisplay(s, currentLang)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Subject & Competency */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Competency (Across 7 Subjects)
                </label>
                <select
                  value={selectedCompetencyId}
                  onChange={(e) => setSelectedCompetencyId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {competencies.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.subject}] {c.code} - {getCompetencyTitle(c, currentLang)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assessment Type Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assessment Milestone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAssessmentType('baseline')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      assessmentType === 'baseline'
                        ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Baseline (आरंभिक)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssessmentType('follow_up')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      assessmentType === 'follow_up'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Follow-Up (उपचारात्मक)
                  </button>
                </div>
              </div>

              {/* Score and Total Marks */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Score Obtained
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max={totalMarks}
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              {/* Calculated Real-Time Percentage Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Calculated Percentage:</span>
                <span className={`font-black text-sm ${currentPct >= 60 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {currentPct}% {currentPct >= 60 ? '(Mastered)' : '(Learning Gap)'}
                </span>
              </div>

              {/* Validation Errors */}
              {!validation.isValid && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{validation.errors[0]}</span>
                </div>
              )}

              {/* Success Notification */}
              {formSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!validation.isValid}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-xs transition"
              >
                Save Record to Database
              </button>
            </form>
          </div>

          {/* Bulk CSV Upload Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Bulk CSV Marksheet Import
              </h3>
              <button
                type="button"
                onClick={downloadSampleCSV}
                className="inline-flex items-center gap-1 text-xs text-brand-700 hover:text-brand-800 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Sample CSV</span>
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-2xl p-4 text-center cursor-pointer transition">
              <Upload className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
              <label className="cursor-pointer block">
                <span className="text-xs font-bold text-brand-600 hover:text-brand-700">
                  Select school CSV marksheet
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Automated offline validation for all 7 subjects
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
                className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
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

            {/* Quick-Download Pre-built Static Marksheets */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                Download Static Datasets for Testing &amp; Verification:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <a
                  href="/datasets/class_5th_A_marksheet.csv"
                  download="class_5th_A_marksheet.csv"
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition"
                >
                  <Download className="w-3 h-3 text-slate-500" />
                  <span>5th A (.csv)</span>
                </a>
                <a
                  href="/datasets/class_6th_A_marksheet.csv"
                  download="class_6th_A_marksheet.csv"
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition"
                >
                  <Download className="w-3 h-3 text-slate-500" />
                  <span>6th A (.csv)</span>
                </a>
                <a
                  href="/datasets/class_7th_A_marksheet.csv"
                  download="class_7th_A_marksheet.csv"
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition"
                >
                  <Download className="w-3 h-3 text-slate-500" />
                  <span>7th A (.csv)</span>
                </a>
                <a
                  href="/datasets/class_8th_A_marksheet.csv"
                  download="class_8th_A_marksheet.csv"
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition"
                >
                  <Download className="w-3 h-3 text-slate-500" />
                  <span>8th A (.csv)</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Assessment Records Table with Dynamic Inline Editing (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            
            {/* Filter and Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Active Assessment Records ({filteredAssessments.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Click the Edit (pencil) button to edit marks dynamically in real time
                </p>
              </div>

              {/* Class, Subject & Competency Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterClassGrade}
                  onChange={(e) => handleTableClassChange(e.target.value)}
                  className="text-xs rounded-xl border border-slate-200 py-1.5 px-2 bg-slate-50 font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="ALL">All Classes (सर्व वर्ग)</option>
                  <option value="5">Class 5th - A</option>
                  <option value="6">Class 6th - A</option>
                  <option value="7">Class 7th - A</option>
                  <option value="8">Class 8th - A</option>
                </select>

                <select
                  value={filterSubject}
                  onChange={(e) => {
                    setFilterSubject(e.target.value);
                    setFilterCompetency('ALL');
                  }}
                  className="text-xs rounded-xl border border-slate-200 py-1.5 px-2 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="ALL">All Subjects</option>
                  {ALL_SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>

                <select
                  value={filterCompetency}
                  onChange={(e) => setFilterCompetency(e.target.value)}
                  className="text-xs rounded-xl border border-slate-200 py-1.5 px-2 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 max-w-[130px] truncate"
                >
                  <option value="ALL">All Competencies</option>
                  {competencies
                    .filter(c => filterSubject === 'ALL' || c.subject === filterSubject)
                    .map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.code}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Roll &amp; Student</th>
                    <th className="py-2.5 px-3">Subject / Comp</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssessments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No assessment records found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredAssessments.slice(-25).reverse().map((asmt) => {
                      const student = students.find((s) => s.id === asmt.student_id);
                      const comp = competencies.find((c) => c.id === asmt.competency_id);
                      const isPassing = asmt.percentage >= (comp?.threshold_passing_pct || 60);

                      return (
                        <tr key={asmt.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 font-mono font-bold mr-1.5 text-slate-700">
                              {student?.grade}th-A
                            </span>
                            <span className="font-bold text-slate-700 mr-1">#{student?.roll_number}</span>
                            {student ? formatStudentDisplay(student, currentLang) : `Student ${asmt.student_id}`}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-semibold text-slate-800">[{comp?.code || asmt.competency_id}]</span>{' '}
                            <span className="text-slate-500 text-[11px] truncate inline-block max-w-[120px] align-bottom">
                              {comp?.subject}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                asmt.assessment_type === 'baseline'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {asmt.assessment_type === 'baseline' ? 'Baseline' : 'Follow-up'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap font-bold text-slate-900">
                            {asmt.score_obtained} / {asmt.total_marks}{' '}
                            <span className="text-slate-400 font-normal">({asmt.percentage}%)</span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isPassing
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : asmt.percentage < 40
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isPassing ? 'Mastered' : 'Gap Flagged'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit Button */}
                              <button
                                onClick={() => openEditModal(asmt)}
                                className="p-1 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition"
                                title="Edit Marks"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {/* Delete Button */}
                              <button
                                onClick={() => onDeleteAssessment(asmt.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
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

      {/* =========================================================================
          DYNAMIC EDIT MARKS MODAL
      ========================================================================= */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Edit Assessment Marks
                </h3>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Student info preserved */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Student (Preserved)</span>
                <span className="font-bold text-slate-900 text-sm">
                  {(() => {
                    const s = students.find(x => x.id === editingRecord.student_id);
                    return s ? `Roll #${s.roll_number} - ${s.student_alias}` : editingRecord.student_id;
                  })()}
                </span>
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  Competency: {editingRecord.competency_id}
                </span>
              </div>

              {/* Assessment Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Milestone Type
                </label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as AssessmentType)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white text-slate-800"
                >
                  <option value="baseline">Baseline (आरंभिक)</option>
                  <option value="follow_up">Follow-up (उपचारात्मक)</option>
                </select>
              </div>

              {/* Edit Score & Total Marks */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Score Obtained
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={editScore}
                    onChange={(e) => setEditScore(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editTotalMarks}
                    onChange={(e) => setEditTotalMarks(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Updated Percentage:</span>
                <span className={`font-black text-sm ${editPct >= 60 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {editPct}% {editPct >= 60 ? '(Mastered)' : '(Learning Gap)'}
                </span>
              </div>

              {!editValidation.isValid && (
                <p className="text-rose-600 text-[11px] font-medium">
                  {editValidation.errors[0]}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={!editValidation.isValid}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DATABASE CONNECTION GUIDE MODAL (Step 4 from user prompt)
      ========================================================================= */}
      {isDbGuideOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  How to Connect Supabase Database
                </h3>
              </div>
              <button
                onClick={() => setIsDbGuideOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Connection Test Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Connection Status:</span>
                <div className="flex items-center gap-2">
                  {isSupabaseConfigured && (
                    <button
                      onClick={handleSyncAllToSupabase}
                      disabled={isSyncingAll}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <CloudUpload className="w-3 h-3" />
                      <span>{isSyncingAll ? 'Syncing...' : 'Sync All Data Now'}</span>
                    </button>
                  )}
                  <button
                    onClick={handleTestDatabase}
                    disabled={testingDb}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] cursor-pointer"
                  >
                    {testingDb ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>
              </div>
              {dbStatus ? (
                <div className={`p-2.5 rounded-lg border text-xs ${
                  dbStatus.connected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <p className="font-bold">{dbStatus.message}</p>
                  {dbStatus.rowCount !== undefined && (
                    <p className="text-[11px] mt-0.5 opacity-90">
                      Current rows in Supabase <code>assessments</code> table: <strong>{dbStatus.rowCount}</strong>.
                      {dbStatus.rowCount === 0 && ' (Click "Sync All Data Now" above to populate all classroom marks).'}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-slate-500">
                  Click 'Test Connection' to test connectivity to your Supabase project.
                </p>
              )}
            </div>

            {/* RLS Troubleshooting Box */}
            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Marks edited but not showing in Supabase? (गुणांची नोंद न दिसल्यास):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const sql = `ALTER TABLE public.assessments DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.remedial_plans DISABLE ROW LEVEL SECURITY;\nGRANT ALL ON TABLE public.assessments TO anon, authenticated, service_role;\nGRANT ALL ON TABLE public.remedial_plans TO anon, authenticated, service_role;`;
                    navigator.clipboard.writeText(sql);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2500);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-[10px] transition cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? 'Copied!' : 'Copy SQL Fix'}</span>
                </button>
              </div>
              <p className="text-amber-900 text-[11px] leading-relaxed">
                Supabase <strong>Row Level Security (RLS)</strong> may block anonymous writes, or the table was initially empty. Run this in your Supabase <strong>SQL Editor</strong>:
              </p>
              <pre className="bg-slate-900 text-amber-300 p-2 rounded-lg text-[10px] font-mono overflow-x-auto select-all">
{`ALTER TABLE public.assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedial_plans DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.assessments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.remedial_plans TO anon, authenticated, service_role;`}
              </pre>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">
                Steps to Connect Supabase (प्रक्रिया व पायऱ्या):
              </h4>

              <div className="space-y-2">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <span className="font-bold text-indigo-950 block">पायरी १: Supabase मध्ये मोफत प्रोजेक्ट तयार करा</span>
                  <p className="text-slate-600 mt-0.5">
                    1. <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-brand-600 underline font-semibold">supabase.com</a> वर जा आणि नवीन प्रोजेक्ट तयार करा (उदा. <code>learngap-ai</code>).
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <span className="font-bold text-indigo-950 block">पायरी २: SQL Schema चालवा (Run Schema)</span>
                  <p className="text-slate-600 mt-0.5">
                    2. Supabase डॅशबोर्डमध्ये <strong>SQL Editor</strong> उघडा. आपल्या रिपॉझिटरीमधील <code>supabase/schema.sql</code> फाइलची संपूर्ण संहिता कॉपी करून SQL Editor मध्ये पेस्ट करा आणि <strong>Run</strong> बटनावर क्लिक करा.
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <span className="font-bold text-indigo-950 block">पायरी ३: API Credentials कॉपी करा</span>
                  <p className="text-slate-600 mt-0.5">
                    3. <strong>Project Settings &gt; API</strong> मध्ये जा आणि खालील माहिती कॉपी करा:
                    <br />• <strong>Project URL</strong> (उदा. <code>https://xyz.supabase.co</code>)
                    <br />• <strong>anon public API Key</strong>
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <span className="font-bold text-indigo-950 block">पायरी ४: .env फाइलमध्ये कीज भरा</span>
                  <p className="text-slate-600 mt-0.5">
                    4. प्रोजेक्टच्या मुख्य डिरेक्टरीमधील <code>.env</code> फाइल उघडा आणि या व्हॅल्यूज भरा:
                  </p>
                  <pre className="bg-slate-900 text-emerald-400 p-2 rounded-lg mt-1 text-[11px] font-mono overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c...`}
                  </pre>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <span className="font-bold text-indigo-950 block">पायरी ५: लाइव्ह रिअल-टाइम सिंक सुरू करा</span>
                  <p className="text-slate-600 mt-0.5">
                    5. प्रोजेक्ट रीस्टार्ट करा (<code>npm run dev</code>). सर्व गुण बदल, नवीन नोंदी आणि उपचारात्मक योजना थेट Supabase मध्ये रिअल-टाइम सिंक होतील!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsDbGuideOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                समजले (Got it)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
