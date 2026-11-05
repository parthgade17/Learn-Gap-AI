import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ExternalLink, School, FileCheck } from 'lucide-react';
import { EmblemOfIndia } from './EmblemOfIndia';
import { GovPolicyModal, GovPolicyType } from './GovPolicyModal';

export const GovFooter: React.FC = () => {
  const { t } = useTranslation();
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<GovPolicyType>('terms');

  const openPolicy = (type: GovPolicyType) => {
    setSelectedPolicy(type);
    setPolicyModalOpen(true);
  };

  // Live dynamic formatted date in IST
  const currentDateFormatted = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <>
      <footer className="no-print bg-[#0B2545] text-slate-300 text-xs mt-auto border-t border-slate-700">
        
        {/* 1. National Tricolor Divider Line */}
        <div className="h-1.5 w-full grid grid-cols-3">
          <div className="bg-[#FF9933]" />
          <div className="bg-[#FFFFFF]" />
          <div className="bg-[#138808]" />
        </div>

        {/* 2. Main 4-Column Government Footer Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Institutional Portal Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <EmblemOfIndia size={38} variant="gold" />
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base tracking-tight">
                    {t('appName')}
                  </h3>
                  <p className="text-[11px] text-amber-300 font-medium">
                    {t('gov.nipunMission') || 'NIPUN Bharat & FLN Mission'}
                  </p>
                </div>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {t('gov.disclaimer') ||
                  'National foundational learning decision-support system turning classroom assessment data into targeted competency remedial action plans under NEP 2020.'}
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{t('gov.vskIntegration') || 'Vidya Samiksha Kendra (VSK) Connected'}</span>
              </div>
            </div>

            {/* Column 2: Government & Education Portals */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-700 pb-1.5">
                शासकीय दुवे • Government Portals
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a
                    href="https://dsel.education.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300 transition flex items-center justify-between group"
                  >
                    <span>Ministry of Education (शिक्षा मंत्रालय, भारत)</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://maa.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300 transition flex items-center justify-between group"
                  >
                    <span>SCERT Maharashtra (विद्या प्राधिकरण, पुणे)</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://ncert.nic.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300 transition flex items-center justify-between group"
                  >
                    <span>PARAKH / NCERT Assessment Framework</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://udiseplus.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300 transition flex items-center justify-between group"
                  >
                    <span>UDISE+ School Statistics Portal</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://diksha.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300 transition flex items-center justify-between group"
                  >
                    <span>DIKSHA National Education Platform</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: GIGW Mandatory Policies & Legal */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-700 pb-1.5">
                वैधानिक धोरणे • GIGW Compliance
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button
                    onClick={() => openPolicy('terms')}
                    className="hover:text-amber-300 transition text-left"
                  >
                    {t('gov.termsOfUse') || 'नियम आणि अटी (Terms & Conditions)'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openPolicy('privacy')}
                    className="hover:text-amber-300 transition text-left text-emerald-300 font-semibold"
                  >
                    {t('gov.privacyPolicy') || 'गोपनीयता धोरण (DPDP Act 2023)'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openPolicy('copyright')}
                    className="hover:text-amber-300 transition text-left"
                  >
                    {t('gov.copyrightPolicy') || 'कॉपीराइट धोरण (Copyright Policy)'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openPolicy('hyperlink')}
                    className="hover:text-amber-300 transition text-left"
                  >
                    {t('gov.hyperlinkPolicy') || 'हायपरलिंकिंग धोरण (Hyperlinking Policy)'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openPolicy('accessibility')}
                    className="hover:text-amber-300 transition text-left text-amber-300 font-semibold"
                  >
                    {t('gov.accessibilityStatement') || 'सुलभता विधान (Accessibility Statement)'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: School Identification & Verification */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-700 pb-1.5">
                शाळा पडताळणी • Verification
              </h4>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <School className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t('schoolName')}</span>
                </div>
                <div className="text-[10px] text-slate-300 space-y-0.5">
                  <p className="font-mono text-emerald-400 font-bold">
                    UDISE+ Code: 27260501234
                  </p>
                  <p>Kopargaon Block, Ahilyanagar District</p>
                  <p>Maharashtra State, India</p>
                </div>
                <div className="pt-1.5 border-t border-slate-700 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Portal Version:</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-700 text-amber-300 font-mono font-bold">
                    v2.4.0 FLN
                  </span>
                </div>
              </div>

              {/* Technical Audit Badge */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <FileCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('gov.complianceBadge') || 'GIGW 3.0 & WCAG 2.1 AA Compliant'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Bottom Legal & Last Updated Strip */}
        <div className="bg-[#07172C] border-t border-slate-800 py-4 px-4 text-center sm:text-left text-[11px] text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div>
              <span>
                © {new Date().getFullYear()} {t('appName')} • शालेय शिक्षण व क्रीडा विभाग, महाराष्ट्र शासन (Govt. of Maharashtra). All Rights Reserved.
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500">
                {t('gov.lastUpdated') || 'Last Updated:'}
              </span>
              <span className="font-mono font-medium text-amber-300">
                {currentDateFormatted} (IST)
              </span>
            </div>
          </div>
        </div>

      </footer>

      {/* Interactive Policy Modal */}
      <GovPolicyModal
        isOpen={policyModalOpen}
        initialPolicy={selectedPolicy}
        onClose={() => setPolicyModalOpen(false)}
      />
    </>
  );
};