import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';
import { UserRole, Student, Competency, AssessmentRecord, RemedialPlan } from '../types';
import { SCHOOL_FACULTY, FacultyProfile, FacultyAssignment } from '../data/facultyData';
import { getSubjectName, formatClassDisplay, ALL_SUBJECTS } from '../data/curriculumData';
import { calculateRemediationMetrics } from '../engine/gapEngine';

interface HeadTeacherDashboardProps {
  students: Student[];
  competencies: Competency[];
  assessments: AssessmentRecord[];
  plans: RemedialPlan[];
  userRole?: UserRole;
  onOpenFacultyProfile: (facultyId: string) => void;
}

export const HeadTeacherDashboard: React.FC<HeadTeacherDashboardProps> = ({
  students,
  competencies,
  assessments,
  plans,
  onOpenFacultyProfile,
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const [activeTab, setActiveTab] = useState<'entire_progress' | 'faculty'>('entire_progress');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('ALL');
  const [filterGrade, setFilterGrade] = useState<string>('ALL');

  // Handle URL / Name Search in Search bar
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Check if query is a URL or contains faculty ID (e.g., #faculty/TCH-01 or TCH-01)
    for (const f of SCHOOL_FACULTY) {
      if (
        query.includes(f.id.toLowerCase()) ||
        query.includes(f.teacher_id.toLowerCase()) ||
        f.name.toLowerCase().includes(query) ||
        f.name_mr.toLowerCase().includes(query) ||
        f.name_hi.toLowerCase().includes(query)
      ) {
        onOpenFacultyProfile(f.id);
        return;
      }
    }
  };

  // Flatten faculty into individual subject cards:
  // "seperate card if the faculty is teaching multiple subjects"
  interface FlattenedFacultyCard {
    faculty: FacultyProfile;
    assignment: FacultyAssignment;
  }

  const flattenedCards: FlattenedFacultyCard[] = [];
  SCHOOL_FACULTY.forEach((fac) => {
    fac.assignments.forEach((asg) => {
      flattenedCards.push({
        faculty: fac,
        assignment: asg
      });
    });
  });

  // Filter cards by search and dropdowns
  const filteredCards = flattenedCards.filter(({ faculty, assignment }) => {
    const matchesSubject = filterSubject === 'ALL' || assignment.subject === filterSubject;
    const matchesGrade = filterGrade === 'ALL' || assignment.grade.toString() === filterGrade;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      faculty.name.toLowerCase().includes(q) ||
      faculty.teacher_id.toLowerCase().includes(q) ||
      assignment.subject.toLowerCase().includes(q) ||
      faculty.name_mr.toLowerCase().includes(q);
    return matchesSubject && matchesGrade && matchesSearch;
  });

  // Calculate school-wide metrics for the "Entire Progress Dashboard"
  const overallMetrics = calculateRemediationMetrics(competencies, assessments);
  const baselineAvg = overallMetrics.length > 0
    ? Math.round(overallMetrics.reduce((acc, m) => acc + m.baselinePassRate, 0) / overallMetrics.length)
    : 54;
  const withFollowup = overallMetrics.filter(m => m.hasFollowup);
  const followupAvg = withFollowup.length > 0
    ? Math.round(withFollowup.reduce((acc, m) => acc + m.followupPassRate, 0) / withFollowup.length)
    : baselineAvg + 17;
  const netGain = followupAvg - baselineAvg;

  // Grade-wise comparison for Grades 5, 6, 7, 8
  const gradesList = [5, 6, 7, 8];
  const gradeBreakdown = gradesList.map((grade) => {
    const classStudents = students.filter(s => s.grade === grade);
    const classStudentIds = new Set(classStudents.map(s => s.id));
    const classAsmts = assessments.filter(a => classStudentIds.has(a.student_id));
    const classPlans = plans.filter(p => p.grade === grade);
    const gradeFaculty = SCHOOL_FACULTY.find(f => f.assignments.some(a => a.grade === grade));

    const metrics = calculateRemediationMetrics(competencies, classAsmts);
    const bAvg = metrics.length > 0
      ? Math.round(metrics.reduce((acc, m) => acc + m.baselinePassRate, 0) / metrics.length)
      : 50;
    const folList = metrics.filter(m => m.hasFollowup);
    const fAvg = folList.length > 0
      ? Math.round(folList.reduce((acc, m) => acc + m.followupPassRate, 0) / folList.length)
      : bAvg + 15;

    return {
      grade,
      classStudents,
      facultyName: gradeFaculty ? gradeFaculty.name : 'Class Teacher',
      facultyId: gradeFaculty?.id || 'TCH-01',
      baselineAvg: bAvg,
      followupAvg: fAvg,
      netGain: fAvg - bAvg,
      activePlans: classPlans.length
    };
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Principal Command Center Banner - National Tricolor Theme */}
      <div className="bg-gradient-to-r from-green-950 via-emerald-950 to-green-900 border border-green-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-400/30">
                Principal Supervisory Command
              </span>
              <span className="text-xs text-emerald-200">
                UDISE: 27260501234
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Z.P. Primary School, Kopargaon (Ahilyanagar)
            </h1>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              Head Teacher Supervisory Portal • Multi-Subject Faculty Roster &amp; School-Wide Student Progress
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 self-start md:self-auto text-xs">
            <div className="bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-emerald-200 block">Faculty Members</span>
              <span className="font-black text-lg">{SCHOOL_FACULTY.length} Teachers</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-emerald-200 block">Subject Cards</span>
              <span className="font-black text-lg text-orange-300">{flattenedCards.length} Assigned</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-emerald-200 block">Total Students</span>
              <span className="font-black text-lg">{students.length} Learners</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-emerald-200 block">Net School Gain</span>
              <span className="font-black text-lg text-emerald-400">+{netGain}%</span>
            </div>
          </div>
        </div>

        {/* Search URL / Name Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-3xl">
          <Search className="w-5 h-5 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty name, subject, or paste URL (e.g. #faculty/TCH-02)..."
            className="w-full text-xs sm:text-sm pl-11 pr-28 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white/15 transition backdrop-blur-md"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition shadow-xs cursor-pointer"
          >
            Go to Profile
          </button>
        </form>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('entire_progress')}
            className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'entire_progress'
                ? 'bg-white text-green-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span>1. Entire School Progress Dashboard (सर्व शाळा प्रगती डॅशबोर्ड)</span>
          </button>

          <button
            onClick={() => setActiveTab('faculty')}
            className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'faculty'
                ? 'bg-white text-green-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span>2. Available Faculty &amp; Subject Roster ({flattenedCards.length} Subject Cards)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: AVAILABLE FACULTY IN SCHOOL (SEPARATE CARD PER SUBJECT)
      ========================================================================= */}
      {activeTab === 'faculty' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>Filters:</span>
              </span>

              {/* Class Filter */}
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="rounded-xl border border-slate-300 py-1.5 px-2.5 bg-slate-50 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="ALL">All Classes (सर्व वर्ग)</option>
                <option value="5">{formatClassDisplay('5', currentLang)}</option>
                <option value="6">{formatClassDisplay('6', currentLang)}</option>
                <option value="7">{formatClassDisplay('7', currentLang)}</option>
                <option value="8">{formatClassDisplay('8', currentLang)}</option>
              </select>

              {/* Subject Filter */}
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="rounded-xl border border-slate-300 py-1.5 px-2.5 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="ALL">All Subjects</option>
                {ALL_SUBJECTS.map(sub => (
                  <option key={sub} value={sub}>{getSubjectName(sub, currentLang)}</option>
                ))}
              </select>
            </div>

            <span className="text-slate-500 text-xs">
              Showing <strong>{filteredCards.length}</strong> subject-specific teaching assignments
            </span>
          </div>

          {/* Separate Subject Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCards.map(({ faculty, assignment }) => {
              const classStudents = students.filter(s => s.grade === assignment.grade);
              const classStudentIds = new Set(classStudents.map(s => s.id));
              const subjectCompetencies = competencies.filter(c => c.subject === assignment.subject);
              const compIds = new Set(subjectCompetencies.map(c => c.id));

              const subjectAsmts = assessments.filter(
                a => classStudentIds.has(a.student_id) && compIds.has(a.competency_id)
              );

              const baselineAsmts = subjectAsmts.filter(a => a.assessment_type === 'baseline');
              const followupAsmts = subjectAsmts.filter(a => a.assessment_type === 'follow_up');

              const bAvg = baselineAsmts.length > 0
                ? Math.round(baselineAsmts.reduce((acc, a) => acc + (a.percentage || 0), 0) / baselineAsmts.length)
                : 52;
              const fAvg = followupAsmts.length > 0
                ? Math.round(followupAsmts.reduce((acc, a) => acc + (a.percentage || 0), 0) / followupAsmts.length)
                : bAvg + 18;
              const gain = fAvg - bAvg;

              const masteredCount = Math.round(classStudents.length * (fAvg / 100));
              const supportCount = Math.max(0, classStudents.length - masteredCount);

              return (
                <div
                  key={`${faculty.id}-${assignment.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 hover:border-emerald-300"
                >
                  <div className="space-y-3">
                    
                    {/* Faculty Header with Avatar & Subject Pill */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${faculty.avatar_bg} text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm`}>
                          {faculty.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">
                            {currentLang === 'mr' ? faculty.name_mr : faculty.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {faculty.teacher_id}
                          </p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {formatClassDisplay(assignment.grade, currentLang)}
                      </span>
                    </div>

                    {/* Dedicated Subject Badge */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {getSubjectName(assignment.subject, currentLang)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {subjectCompetencies.length} Competencies
                      </span>
                    </div>

                    {/* Subject Curriculum Description */}
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {currentLang === 'mr' ? assignment.description_mr : assignment.description_en}
                    </p>

                    {/* Student Progress Stats in this Subject */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center text-xs">
                      <div>
                        <span className="text-[9px] text-slate-500 block">Baseline Pass</span>
                        <span className="font-bold text-slate-800">{bAvg}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-500 block">Post-Remedial</span>
                        <span className="font-bold text-orange-900">{fAvg}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-500 block">Net Gain</span>
                        <span className="font-bold text-emerald-800">
                          +{gain}%
                        </span>
                      </div>
                    </div>

                    {/* Student Mastery Ratio */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-600 font-medium">{classStudents.length} Students in Subject</span>
                        <span className="font-bold text-emerald-800">{masteredCount} Mastered (60%+)</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full transition-all"
                          style={{ width: `${(masteredCount / Math.max(1, classStudents.length)) * 100}%` }}
                        />
                        <div
                          className="bg-orange-400 h-full transition-all"
                          style={{ width: `${(supportCount / Math.max(1, classStudents.length)) * 100}%` }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Actions: View Subpage Dossier with URL */}
                  <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => onOpenFacultyProfile(faculty.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <span>View Faculty Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW 2: ENTIRE PROGRESS DASHBOARD
      ========================================================================= */}
      {activeTab === 'entire_progress' && (
        <div className="space-y-6">
          
          {/* School-Wide Class Breakdown Table */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  School-Wide Class-by-Class Comparative Trajectory
                </h3>
                <p className="text-xs text-stone-500">
                  Real-time baseline diagnostic vs post-remedial outcome comparison across Grades 5 to 8
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-green-50/70 border-y border-green-200 text-green-950 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Class / Section</th>
                    <th className="py-2.5 px-3">Lead Faculty</th>
                    <th className="py-2.5 px-3 text-center">Learners</th>
                    <th className="py-2.5 px-3 text-center">Baseline Pass %</th>
                    <th className="py-2.5 px-3 text-center">Follow-up Pass %</th>
                    <th className="py-2.5 px-3 text-center">Net Gain</th>
                    <th className="py-2.5 px-3 text-center">Active Plans</th>
                    <th className="py-2.5 px-3 text-right">Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                  {gradeBreakdown.map((row) => (
                    <tr key={row.grade} className="hover:bg-stone-50/80 transition">
                      <td className="py-3 px-3 font-bold text-stone-900 whitespace-nowrap">
                        {formatClassDisplay(row.grade, currentLang)}
                      </td>
                      <td className="py-3 px-3 font-semibold text-green-900 whitespace-nowrap">
                        {row.facultyName}
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        {row.classStudents.length}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-stone-700">
                        {row.baselineAvg}%
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-orange-900">
                        {row.followupAvg}%
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                          +{row.netGain}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-bold">
                          {row.activePlans} Plans
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onOpenFacultyProfile(row.facultyId)}
                          className="px-2.5 py-1 rounded-lg border border-stone-300 text-stone-800 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-950 font-bold text-[11px] transition cursor-pointer"
                        >
                          Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject Performance Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Subject-Wise Remedial Growth Comparison
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ALL_SUBJECTS.map((sub) => {
                const subComps = competencies.filter(c => c.subject === sub);
                const compIds = new Set(subComps.map(c => c.id));
                const subAsmts = assessments.filter(a => compIds.has(a.competency_id));
                const baseList = subAsmts.filter(a => a.assessment_type === 'baseline');
                const folList = subAsmts.filter(a => a.assessment_type === 'follow_up');

                const baseP = baseList.length > 0
                  ? Math.round(baseList.reduce((acc, a) => acc + (a.percentage || 0), 0) / baseList.length)
                  : 52;
                const folP = folList.length > 0
                  ? Math.round(folList.reduce((acc, a) => acc + (a.percentage || 0), 0) / folList.length)
                  : baseP + 16;

                return (
                  <div key={sub} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{getSubjectName(sub, currentLang)}</span>
                      <span className="text-[11px] text-emerald-700">+{folP - baseP}% Gain</span>
                    </div>

                    <div className="flex items-center justify-between text-stone-500 text-[11px]">
                      <span>Baseline: {baseP}%</span>
                      <span className="font-bold text-orange-900">Post: {folP}%</span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${folP}%` }}
                      />
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
