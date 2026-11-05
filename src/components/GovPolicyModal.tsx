import React, { useState } from 'react';
import { X, Scale } from 'lucide-react';

export type GovPolicyType = 'terms' | 'privacy' | 'copyright' | 'hyperlink' | 'accessibility';

interface GovPolicyModalProps {
  isOpen: boolean;
  initialPolicy?: GovPolicyType;
  onClose: () => void;
}

export const GovPolicyModal: React.FC<GovPolicyModalProps> = ({
  isOpen,
  initialPolicy = 'terms',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<GovPolicyType>(initialPolicy);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gov-policy-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B2545] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="gov-policy-modal-title" className="text-base sm:text-lg font-bold">
                वैधानिक धोरणे व मार्गदर्शक तत्त्वे • Legal &amp; Compliance Policies
              </h2>
              <p className="text-xs text-slate-300">
                Guidelines for Indian Government Websites (GIGW 3.0) &amp; DPDP Act 2023
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close policy dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 flex space-x-2 overflow-x-auto text-xs font-semibold py-2">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-white text-[#0B2545] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            नियम व अटी (Terms)
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-white text-[#0B2545] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            गोपनीयता (DPDP 2023)
          </button>
          <button
            onClick={() => setActiveTab('copyright')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'copyright'
                ? 'bg-white text-[#0B2545] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            कॉपीराइट (Copyright)
          </button>
          <button
            onClick={() => setActiveTab('hyperlink')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'hyperlink'
                ? 'bg-white text-[#0B2545] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            हायपरलिंकिंग (Hyperlinking)
          </button>
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'accessibility'
                ? 'bg-white text-[#0B2545] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            सुलभता (Accessibility)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">नियम आणि अटी • Terms of Use</h3>
              <p>
                हे पोर्टल (LearnGap AI) हे राष्ट्रीय शैक्षणिक धोरण (NEP 2020) आणि निपुण भारत व FLN अभियानांतर्गत
                शालेय शिक्षक आणि मुख्याध्यापकांना पायाभूत अध्ययन मूल्यमापनाच्या आधारे उपचारात्मक वर्ग कृती आराखडा
                तयार करण्यासाठी निर्णय-सहाय्य साधन म्हणून विकसित करण्यात आले आहे.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600">
                <li>हे साधन शिक्षकांच्या व्यावसायिक निर्णयास सहाय्य करते; शिक्षकांचा अंतिम निर्णय सर्वोच्च मानला जाईल.</li>
                <li>प्रणालीमधील सर्व विद्यार्थ्यांचे निकाल स्थानिक स्तरावर उपचारात्मक अध्यापनासाठीच वापरले जावेत.</li>
                <li>हे पोर्टल व्यावसायिक जाहिराती किंवा व्यापारी उपयोगापासून पूर्णतः मुक्त आहे.</li>
              </ul>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">गोपनीयता धोरण • Privacy Policy (DPDP Act 2023 Compliant)</h3>
              <p>
                हे संकेतस्थळ भारताचा <strong>डिजिटल वैयक्तिक डेटा संरक्षण कायदा, २०२३ (DPDP Act 2023)</strong> आणि नियम, २०२५
                मधील बालकांच्या डेटा संरक्षणाचे (कलम ९) काटेकोर पालन करते.
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                <strong>डेटा न्यूनीकरण (Data Minimization):</strong> प्रणाली केवळ हजेरी क्रमांक, इयत्ता आणि अध्ययन निष्पत्ती
                गुण साठवते. कोणत्याही विद्यार्थ्यांची संवेदनशील ओळख (आधार क्रमांक, बायोमेट्रिक्स) घेतली जात नाही.
              </div>
              <p className="text-slate-600">
                सध्याच्या प्रात्यक्षिकामध्ये कोपरगाव तालुक्यातील प्राथमिक शाळांच्या गोपनीयतेसाठी १००% काल्पनिक (Synthetic) डेटा
                वापरला आहे.
              </p>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">कॉपीराइट धोरण • Copyright Policy</h3>
              <p>
                या संकेतस्थळावरील सामग्री (पाठ्यपुस्तके, अध्ययन निष्पत्ती निकष व FLN उपक्रम) राज्य शैक्षणिक संशोधन व
                प्रशिक्षण परिषद (SCERT) महाराष्ट्र आणि निपुण भारत मार्गदर्शक तत्त्वांवर आधारित आहेत.
              </p>
              <p className="text-slate-600">
                शिक्षकांना उपचारात्मक वर्ग अध्यापनासाठी कृती आराखडे, कार्यपत्रिका व तक्ते मोफत डाउनलोड, प्रिंट व वितरित
                करण्याची पूर्ण मुभा आहे.
              </p>
            </div>
          )}

          {activeTab === 'hyperlink' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">हायपरलिंकिंग धोरण • Hyperlinking Policy</h3>
              <p>
                या पोर्टलवर दिलेल्या बाह्य शासकीय संकेतस्थळांचे दुवे (उदा. MoE, SCERT महाराष्ट्र, NCERT, UDISE+, Vidya Samiksha Kendra)
                शिक्षकांच्या व मुख्याध्यापकांच्या संदर्भासाठी आहेत. बाह्य संकेतस्थळांच्या गोपनीयतेची जबाबदारी त्या विभागांची असेल.
              </p>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">सुलभता विधान • Accessibility Statement</h3>
              <p>
                LearnGap AI पोर्टल हे दिव्यांग व्यक्तींचे हक्क कायदा २०१६ आणि GIGW 3.0 मानकांनुसार दृष्टिबाधित,
                अल्पदृष्टी व मोटर अपंगत्व असलेल्या वापरकर्त्यांसाठी पूर्णतः सुलभ (Accessible) केले गेले आहे.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA अनुपालन.</li>
                <li>स्क्रीन रीडर्स (NVDA, JAWS, TalkBack, VoiceOver) साठी ARIA लँडमार्क समर्थन.</li>
                <li>कीबोर्डद्वारे पूर्ण नेव्हिगेशन (Tab, Enter, Escape).</li>
                <li>मराठी, हिंदी आणि २२ इतर भारतीय भाषांमध्ये द्विभाषिक समर्थन.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0B2545] hover:bg-[#133E87] text-white font-semibold text-xs transition"
          >
            समजले / Close
          </button>
        </div>

      </div>
    </div>
  );
};