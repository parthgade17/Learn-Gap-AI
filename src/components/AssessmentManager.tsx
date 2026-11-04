import React, { useState, useEffect } from 'react';
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
  Copy,
  Check,
  Zap,
  Clock,
  ShieldCheck,
  Users,
  BookOpen,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Student, Competency, AssessmentRecord, AssessmentType } from '../types';
import { validateAssessmentRecord } from '../engine/gapEngine';
import {
  getCompetencyTitle,
  formatStudentDisplay,
  ALL_SUBJECTS,
  formatClassDisplay,
  getSubjectName
} from '../data/curriculumData';
import { checkSupabaseConnection } from '../lib/supabaseClient';
import { StudentAllSubjectAssessmentModal } from './StudentAllSubjectAssessmentModal';
import {
  bufferAssessmentToRedis,
  bufferBatchToRedis,
  getRedisBufferStatus,
  forceFlushRedisToSupabase,
  RedisBufferStatusResponse
} from '../lib/redisBufferClient';

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

  // Modal State for Deduplicated Student All-Subject Manager
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // Student Dropdown Selection State for Quick All-Subject Launcher
  const [dropdownStudentId, setDropdownStudentId] = useState<string>(students[0]?.id || '');

  // Table View Mode: 'roster' (deduplicated per student) vs 'records' (raw audit log)
  const [tableMode, setTableMode] = useState<'roster' | 'records'>('roster');

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

  // Redis Middleman Buffer & Rate Limiting State
  const [redisStatus, setRedisStatus] = useState<RedisBufferStatusResponse | null>(null);
  const [isFlushingRedis, setIsFlushingRedis] = useState<boolean>(false);
  const [redisNotice, setRedisNotice] = useState<string | null>(null);
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
  useEffect(() => {
    if (selectedClassGrade) {
      setFilterClassGrade(selectedClassGrade);
      setFormClassGrade(selectedClassGrade === 'ALL' ? '5' : selectedClassGrade);
      const classStds = selectedClassGrade === 'ALL'
        ? students
        : students.filter(s => s.grade === parseInt(selectedClassGrade, 10));
      if (classStds.length > 0) {
        setSelectedStudentId(classStds[0].id);
        setDropdownStudentId(classStds[0].id);
      }
    }
  }, [selectedClassGrade, students]);

  // Periodic poll of Redis Buffer status (every 8 seconds) to reflect background sync flushes
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      const status = await getRedisBufferStatus();
      if (isMounted && status) {
        setRedisStatus(status);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

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
      setDropdownStudentId(classStds[0].id);
    }
  };

  const handleTableClassChange = (grade: string) => {
    setFilterClassGrade(grade);
    onClassGradeChange?.(grade);
    const classStds = grade === 'ALL'
      ? students
      : students.filter(s => s.grade === parseInt(grade, 10));
    if (classStds.length > 0) {
      setDropdownStudentId(classStds[0].id);
    }
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
      const newRec = {
        student_id: selectedStudentId || students[0].id,
        competency_id: selectedCompetencyId || competencies[0].id,
        assessment_type: assessmentType,
        score_obtained: numericScore,
        total_marks: numericTotal,
        percentage: currentPct,
        assessed_at: new Date().toISOString().split('T')[0],
        synced: false
      };

      // 1. Save locally to IndexedDB
      await onAddAssessment(newRec);

      // 2. Buffer into Redis Middleman (Auto-syncs to Supabase every 10-15s, rate limited)
      const bufferRes = await bufferAssessmentToRedis(newRec);
      if (bufferRes.success) {
        setRedisNotice(`⚡ Buffered to Redis (Queue: ${bufferRes.buffer_queue_length}) → Auto-syncing to Supabase in 10-15s`);
        const status = await getRedisBufferStatus();
        if (status) setRedisStatus(status);
        setTimeout(() => setRedisNotice(null), 5000);
      }

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
      const updates = {
        score_obtained: editNumScore,
        total_marks: editNumTotal,
        percentage: editPct,
        assessment_type: editType
      };

      // 1. Update local database
      await onUpdateAssessment(editingRecord.id, updates);

      // 2. Buffer updated score into Redis middleman
      await bufferAssessmentToRedis({
        student_id: editingRecord.student_id,
        competency_id: editingRecord.competency_id,
        assessment_type: editType,
        score_obtained: editNumScore,
        total_marks: editNumTotal,
        percentage: editPct,
        assessed_at: new Date().toISOString().split('T')[0]
      });

      const status = await getRedisBufferStatus();
      if (status) setRedisStatus(status);

      setEditingRecord(null);
      setSyncNotice({
        message: 'Marks updated locally and buffered in Redis → Auto-syncs to Supabase in 10-15s!',
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

  // Immediate manual flush from Redis to Supabase
  const handleFlushRedisNow = async () => {
    setIsFlushingRedis(true);
    try {
      const result = await forceFlushRedisToSupabase();
      if (result.error) {
        setSyncNotice({
          message: `Redis flush issue: ${result.error}`,
          type: 'error'
        });
      } else {
        setSyncNotice({
          message: `⚡ Successfully transferred ${result.synced} marks from Redis into Supabase, and cleared Redis cache!`,
          type: 'success'
        });
        const updatedStatus = await getRedisBufferStatus();
        if (updatedStatus) setRedisStatus(updatedStatus);
      }
      setTimeout(() => setSyncNotice(null), 5000);
    } catch {
      setSyncNotice({
        message: 'Error communicating with Redis buffer worker.',
        type: 'error'
      });
    } finally {
      setIsFlushingRedis(false);
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
          const scoreVal = parseFloat(scoreIdx !== -1 ? parts[scoreIdx] : parts[5]);
          const totalVal = parseFloat(totalIdx !== -1 ? parts[totalIdx] : parts[6]) || 10;

          if (isNaN(rollNo) || isNaN(scoreVal) || !compCode) {
            skippedRows++;
            continue;
          }

          let matchedStudent = students.find(s => {
            if (rowGrade !== undefined) {
              return s.roll_number === rollNo && s.grade === rowGrade;
            }
            if (filterClassGrade !== 'ALL') {
              return s.roll_number === rollNo && s.grade === parseInt(filterClassGrade, 10);
            }
            return s.roll_number === rollNo;
          });

          if (!matchedStudent && students.length > 0) {
            matchedStudent = students.find(s => s.roll_number === rollNo);
          }

          const matchedComp = competencies.find(
            c => c.id.toLowerCase() === compCode.toLowerCase() || c.code.toLowerCase() === compCode.toLowerCase()
          );

          if (!matchedStudent || !matchedComp) {
            skippedRows++;
            continue;
          }

          const pct = Math.round((scoreVal / totalVal) * 100);
          newRecords.push({
            student_id: matchedStudent.id,
            competency_id: matchedComp.id,
            assessment_type: asmtType,
            score_obtained: scoreVal,
            total_marks: totalVal,
            percentage: pct,
            assessed_at: new Date().toISOString().split('T')[0],
            synced: false
          });
        }

        if (newRecords.length === 0) {
          setCsvStatus({
            message: `Could not parse valid records. Skipped ${skippedRows} rows.`,
            type: 'error'
          });
          return;
        }

        // 1. Upload to local DB
        await onBatchUpload(newRecords);

        // 2. Buffer to Redis Middleman in batch
        bufferBatchToRedis(newRecords).then(async (res) => {
          if (res.success) {
            const status = await getRedisBufferStatus();
            if (status) setRedisStatus(status);
            setRedisNotice(`⚡ ${newRecords.length} marks buffered in Redis. Background worker is auto-syncing to Supabase.`);
            setTimeout(() => setRedisNotice(null), 6000);
          }
        }).catch(console.warn);

        setCsvStatus({
          message: `Successfully imported ${newRecords.length} marks! Buffered in Redis for auto-sync.`,
          type: 'success'
        });
      } catch {
        setCsvStatus({ message: 'Error parsing CSV file format.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  // Filtered raw assessment records for audit trail
  const filteredAssessments = assessments.filter(a => {
    const student = students.find(s => s.id === a.student_id);
    if (filterClassGrade !== 'ALL' && student?.grade !== parseInt(filterClassGrade, 10)) return false;
    const comp = competencies.find(c => c.id === a.competency_id);
    if (filterSubject !== 'ALL' && comp?.subject !== filterSubject) return false;
    if (filterCompetency !== 'ALL' && a.competency_id !== filterCompetency) return false;
    return true;
  });

  // Class Filtered Students for the Deduplicated Roster
  const classFilteredStudents = filterClassGrade === 'ALL'
    ? students
    : students.filter(s => s.grade === parseInt(filterClassGrade, 10));

  // Compute student stats across 7 subjects for the Deduplicated Roster View:
  // Each student appears EXACTLY ONCE, without repeated rows!
  const studentRosterData = classFilteredStudents.map(student => {
    const studentAsmts = assessments.filter(a => a.student_id === student.id);

    const assessedSubjectSet = new Set<string>();
    studentAsmts.forEach(a => {
      const comp = competencies.find(c => c.id === a.competency_id);
      if (comp) assessedSubjectSet.add(comp.subject);
    });

    const baselineCount = studentAsmts.filter(a => a.assessment_type === 'baseline').length;
    const followupCount = studentAsmts.filter(a => a.assessment_type === 'follow_up').length;

    const avgPct = studentAsmts.length > 0
      ? Math.round(studentAsmts.reduce((acc, a) => acc + a.percentage, 0) / studentAsmts.length)
      : null;

    return {
      student,
      assessedSubjectCount: assessedSubjectSet.size,
      totalSubjects: ALL_SUBJECTS.length,
      assessedSubjects: Array.from(assessedSubjectSet),
      baselineCount,
      followupCount,
      totalRecords: studentAsmts.length,
      avgPct
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Module Title Banner & Redis Middleman Buffer Indicator */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t('assessment.title')}</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Redis Buffer Active
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deduplicated Student Roster • All-Subject Assessment Modal • Redis Buffer with 12s Auto-Sync to Supabase
          </p>
        </div>

        {/* Redis Buffer & Rate Limiter Pill replacing the old manual button */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Redis Middleman Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-900 text-amber-300 border-slate-700 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
            <span>
              Redis Buffer:{' '}
              <strong className="text-white font-mono">{redisStatus?.buffered_marks_count ?? 0}</strong> pending
            </span>
            <span className="text-slate-500 text-[10px] hidden sm:inline">•</span>
            <span className="text-slate-300 text-[11px] hidden sm:inline flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              Auto-syncs every 12s
            </span>
          </div>

          {/* Architecture / DB Guide */}
          <button
            onClick={() => setIsDbGuideOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>DB &amp; Redis Guide</span>
          </button>
        </div>
      </div>

      {/* Redis Buffer Notification Alert */}
      {redisNotice && (
        <div className="p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm bg-amber-50 text-amber-950 border border-amber-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{redisNotice}</span>
          </div>
          <button
            onClick={() => setRedisNotice(null)}
            className="p-1 rounded hover:bg-amber-200/50 text-amber-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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

      {/* =========================================================================
          STUDENT DROPDOWN SELECTOR BAR FOR ALL-SUBJECT ASSESSMENT MODAL
          (Fulfills: "implement a dropdown for every student when the teacher clicks on drop down all the students must be visible and when teacher clicks on student name then his all subject assesment manager must be opened")
      ========================================================================= */}
      <div className="bg-gradient-to-r from-brand-50 via-indigo-50 to-purple-50 p-4 sm:p-5 rounded-2xl border-2 border-brand-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-600/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span>All-Subject Assessment Manager</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-200 text-brand-900 uppercase">
                7 Subjects
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Click the dropdown to view all students. Selecting a student opens their full 7-subject mark assessment sheet.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <select
              value={dropdownStudentId}
              onChange={(e) => {
                const stdId = e.target.value;
                setDropdownStudentId(stdId);
                const std = students.find(s => s.id === stdId);
                if (std) setSelectedStudentForModal(std);
              }}
              className="w-full sm:w-auto min-w-[260px] rounded-xl border-2 border-brand-300 bg-white py-2.5 px-3 text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="" disabled>-- Select Student from Dropdown --</option>
              {classFilteredStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  [{formatClassDisplay(s.grade, currentLang)}] #{s.roll_number} - {formatStudentDisplay(s, currentLang)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              const std = students.find(s => s.id === dropdownStudentId) || classFilteredStudents[0];
              if (std) setSelectedStudentForModal(std);
            }}
            disabled={classFilteredStudents.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition active:scale-95 cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open All Subjects Sheet</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quick Manual Entry Form & CSV Marksheet Import (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Manual Entry Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <PlusCircle className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Add / Record Single Competency Mark
              </h3>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              
              {/* Select Class */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('dashboard.selectClass')}
                </label>
                <select
                  value={formClassGrade}
                  onChange={(e) => handleFormClassChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-slate-50 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="5">{formatClassDisplay('5', currentLang)}</option>
                  <option value="6">{formatClassDisplay('6', currentLang)}</option>
                  <option value="7">{formatClassDisplay('7', currentLang)}</option>
                  <option value="8">{formatClassDisplay('8', currentLang)}</option>
                  <option value="ALL">{formatClassDisplay('ALL', currentLang)}</option>
                </select>
              </div>

              {/* Select Student */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('assessment.studentAlias')} ({formStudents.length} {t('gaps.studentsCount')})
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {formStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{formatClassDisplay(s.grade, currentLang)}] #{s.roll_number} - {formatStudentDisplay(s, currentLang)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Subject & Competency */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('assessment.selectCompetency')}
                </label>
                <select
                  value={selectedCompetencyId}
                  onChange={(e) => setSelectedCompetencyId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {competencies.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{getSubjectName(c.subject, currentLang)}] {c.code} - {getCompetencyTitle(c, currentLang)}
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
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                Save Record
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

        {/* Right Column: Deduplicated Student Roster & Live Audit Records (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            
            {/* Header with Mode Toggle & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>
                    {tableMode === 'roster'
                      ? `Student Roster (${studentRosterData.length} Students)`
                      : `Raw Assessment Entries (${filteredAssessments.length})`}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {tableMode === 'roster' ? 'Deduplicated' : 'Audit Trail'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  {tableMode === 'roster'
                    ? 'Every student is shown once. Click "Open All Subjects" to inspect or edit marks across all 7 subjects.'
                    : 'Individual competency assessment records and audit timestamps.'}
                </p>
              </div>

              {/* View Mode Toggle Button */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setTableMode('roster')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    tableMode === 'roster'
                      ? 'bg-white text-brand-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Deduplicated list showing each student once"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Student Roster</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTableMode('records')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    tableMode === 'records'
                      ? 'bg-white text-brand-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="View individual raw records"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Audit Entries</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <span>Filter:</span>
              </div>

              <select
                value={filterClassGrade}
                onChange={(e) => handleTableClassChange(e.target.value)}
                className="text-xs rounded-xl border border-slate-200 py-1.5 px-2 bg-slate-50 font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                <option value="ALL">{formatClassDisplay('ALL', currentLang)}</option>
                <option value="5">{formatClassDisplay('5', currentLang)}</option>
                <option value="6">{formatClassDisplay('6', currentLang)}</option>
                <option value="7">{formatClassDisplay('7', currentLang)}</option>
                <option value="8">{formatClassDisplay('8', currentLang)}</option>
              </select>

              {tableMode === 'records' && (
                <>
                  <select
                    value={filterSubject}
                    onChange={(e) => {
                      setFilterSubject(e.target.value);
                      setFilterCompetency('ALL');
                    }}
                    className="text-xs rounded-xl border border-slate-200 py-1.5 px-2 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="ALL">{t('subjects.all')}</option>
                    {ALL_SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>{getSubjectName(sub, currentLang)}</option>
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
                </>
              )}
            </div>

            {/* Architecture Info Banner on Rate Limiting */}
            <div className="flex flex-wrap items-center justify-between text-[11px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Rate Limiters: <strong>120 writes/min (Redis)</strong> • <strong>30 flushes/min (Supabase)</strong>
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Redis cache auto-clears on DB commit</span>
              </div>
            </div>

            {/* ===============================================================
                1. DEDUPLICATED STUDENT ROSTER VIEW (NO REPETITION)
            =============================================================== */}
            {tableMode === 'roster' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Roll &amp; Student</th>
                      <th className="py-2.5 px-3">Subject Progress (7 Subjects)</th>
                      <th className="py-2.5 px-3">Avg Score</th>
                      <th className="py-2.5 px-3">Milestones</th>
                      <th className="py-2.5 px-3 text-right">All-Subject Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentRosterData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No students found for this class grade filter.
                        </td>
                      </tr>
                    ) : (
                      studentRosterData.map(({ student, assessedSubjectCount, totalSubjects, avgPct, baselineCount, followupCount }) => {
                        const isPassing = avgPct !== null && avgPct >= 60;

                        return (
                          <tr key={student.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 font-mono font-bold mr-1.5 text-slate-700">
                                {student.grade}th-A
                              </span>
                              <span className="font-bold text-slate-700 mr-1">#{student.roll_number}</span>
                              <span className="font-bold text-slate-900">
                                {formatStudentDisplay(student, currentLang)}
                              </span>
                            </td>

                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">
                                  {assessedSubjectCount} / {totalSubjects} Subjects
                                </span>
                                <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${assessedSubjectCount === totalSubjects ? 'bg-emerald-500' : 'bg-brand-500'}`}
                                    style={{ width: `${(assessedSubjectCount / totalSubjects) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="py-2.5 px-3 whitespace-nowrap">
                              {avgPct !== null ? (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    isPassing
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {avgPct}% {isPassing ? 'Mastered' : 'Needs Support'}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[10px] italic">Not Assessed Yet</span>
                              )}
                            </td>

                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                  Base: {baselineCount}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Follow-up: {followupCount}
                                </span>
                              </div>
                            </td>

                            <td className="py-2.5 px-3 text-right whitespace-nowrap">
                              <button
                                onClick={() => setSelectedStudentForModal(student)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs border border-brand-200 transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                                <span>Open All Subjects</span>
                                <ChevronRight className="w-3 h-3 text-brand-400" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ===============================================================
                2. RAW ASSESSMENT ENTRIES TABLE (OPTIONAL AUDIT TRAIL)
            =============================================================== */}
            {tableMode === 'records' && (
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
                                {comp ? getSubjectName(comp.subject, currentLang) : ''}
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
                                {asmt.assessment_type === 'baseline' ? t('assessment.baseline') : t('assessment.followup')}
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
                                <button
                                  onClick={() => openEditModal(asmt)}
                                  className="p-1 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition cursor-pointer"
                                  title="Edit Marks"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteAssessment(asmt.id)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
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
            )}

          </div>
        </div>

      </div>

      {/* =========================================================================
          DYNAMIC STUDENT ALL-SUBJECT ASSESSMENT MODAL
          (Opens when teacher clicks dropdown or "Open All Subjects")
      ========================================================================= */}
      {selectedStudentForModal && (
        <StudentAllSubjectAssessmentModal
          isOpen={Boolean(selectedStudentForModal)}
          onClose={() => setSelectedStudentForModal(null)}
          student={selectedStudentForModal}
          competencies={competencies}
          assessments={assessments}
          onSaveAssessment={async (newRec) => {
            await onAddAssessment(newRec);
            const status = await getRedisBufferStatus();
            if (status) setRedisStatus(status);
          }}
        />
      )}

      {/* =========================================================================
          DYNAMIC EDIT MARKS MODAL (FOR AUDIT LOG)
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
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={!editValidation.isValid}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DATABASE & REDIS BUFFER ARCHITECTURE GUIDE MODAL
      ========================================================================= */}
      {isDbGuideOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Supabase &amp; Redis Middleman Buffer Architecture
                </h3>
              </div>
              <button
                onClick={() => setIsDbGuideOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Redis & DB Live Test Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Connection Status:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFlushRedisNow}
                    disabled={isFlushingRedis}
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>{isFlushingRedis ? 'Syncing...' : 'Flush Redis Buffer'}</span>
                  </button>
                  <button
                    onClick={handleTestDatabase}
                    disabled={testingDb}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] cursor-pointer"
                  >
                    {testingDb ? 'Testing...' : 'Test DB Connection'}
                  </button>
                </div>
              </div>

              {/* Status Display */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Redis Temporary Queue:</span>
                  <span className="font-mono font-bold text-amber-700">
                    {redisStatus?.buffered_marks_count ?? 0} marks pending
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Redis Rate Limiter:</span>
                  <span className="font-bold text-emerald-700">120 requests/minute max</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Supabase Rate Limiter:</span>
                  <span className="font-bold text-emerald-700">30 batch syncs/minute max</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Auto-Sync Cycle:</span>
                  <span className="font-bold text-indigo-700">Every 10-15 seconds (12s interval)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Cache Invalidation:</span>
                  <span className="font-bold text-slate-900">Automatically cleared from Redis upon DB commit</span>
                </div>
              </div>

              {dbStatus && (
                <div className={`p-2.5 rounded-lg border text-xs ${
                  dbStatus.connected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <p className="font-bold">{dbStatus.message}</p>
                </div>
              )}
            </div>

            {/* RLS Troubleshooting Box */}
            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Supabase RLS Policy Configuration:
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
              <pre className="bg-slate-900 text-amber-300 p-2 rounded-lg text-[10px] font-mono overflow-x-auto select-all">
{`ALTER TABLE public.assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedial_plans DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.assessments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.remedial_plans TO anon, authenticated, service_role;`}
              </pre>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsDbGuideOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Close (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
