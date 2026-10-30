import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { verifyFssaiNumber } from '../../services/api';
import { FssaiLookupResult } from '../../types';
import { BackButton } from '../common/BackButton';
import {
  ShieldCheck,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Copy,
  Check,
  Award,
} from 'lucide-react';

export const FssaiVerificationSection: React.FC = () => {
  const { activeScan } = useApp();
  const [inputLicense, setInputLicense] = useState(activeScan?.fssaiLicenseNumber || '10014022002789');
  const [result, setResult] = useState<FssaiLookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputLicense) return;

    setLoading(true);
    try {
      const res = await verifyFssaiNumber(inputLicense);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputLicense.replace(/\D/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Back Button */}
      <BackButton fallbackTab="scanner" label="Back to Scanner" />

      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 bg-[#FFF0E3] text-[#F58220] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F58220]" />
          <span>Statutory Compliance</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#252525] tracking-tight">
          FSSAI & Certification Verification
        </h1>
        <p className="text-xs text-[#77716B] mt-1">
          Verify the statutory 14-digit Food Safety and Standards Authority of India (FSSAI) license or registration number against regulatory structure and the official FoSCoS portal.
        </p>
      </div>

      {/* Input / Search Box */}
      <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-6 bg-white">
        <form onSubmit={handleLookup} className="space-y-3">
          <label className="block text-xs font-bold text-[#252525]">
            Enter 14-Digit FSSAI License / Registration Number
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                maxLength={14}
                value={inputLicense}
                onChange={(e) => setInputLicense(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 10014022002789"
                className="w-full text-sm font-mono tracking-widest px-3.5 py-2.5 border border-[#252525]/20 rounded-xl focus:ring-1 focus:ring-[#F58220] focus:border-[#F58220] outline-none bg-[#FFFAF5]"
              />
              <span className="absolute right-3 top-3 text-[11px] text-[#77716B]">
                {inputLicense.length}/14 digits
              </span>
            </div>
            <button
              type="submit"
              disabled={loading || inputLicense.length !== 14}
              className="px-5 py-2.5 bg-[#F58220] hover:bg-[#e07114] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Checking...' : 'Verify License'}</span>
            </button>
          </div>
          <p className="text-[11px] text-[#77716B]">
            Every packaged food product sold in India must mandatorily declare a 14-digit FSSAI license number on the back of pack.
          </p>
        </form>

        {/* Verification Result Card */}
        {result && (
          <div className="mt-6 pt-6 border-t border-[#252525]/8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FFFAF5] p-4 rounded-xl border border-[#252525]/8">
              <div>
                <span className="text-[10px] text-[#77716B] font-bold uppercase tracking-wider block">
                  License Number Checked
                </span>
                <span className="text-base font-mono font-bold text-[#252525] tracking-widest">
                  {result.licenseNumber}
                </span>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center space-x-1 ${
                  result.validFormat
                    ? 'bg-[#EAF8EE] text-[#22A447] border border-[#22A447]/30'
                    : 'bg-red-50 text-[#E65A50] border border-red-200'
                }`}
              >
                {result.validFormat ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22A447]" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-[#E65A50]" />
                )}
                <span>{result.status}</span>
              </span>
            </div>

            {result.validFormat && result.details && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#FFFAF5] rounded-xl border border-[#252525]/8">
                  <span className="text-[10px] text-[#77716B] font-semibold block">Category</span>
                  <span className="font-bold text-[#252525] mt-0.5 block">
                    {result.details.category}
                  </span>
                </div>
                <div className="p-3 bg-[#FFFAF5] rounded-xl border border-[#252525]/8">
                  <span className="text-[10px] text-[#77716B] font-semibold block">Jurisdiction</span>
                  <span className="font-bold text-[#252525] mt-0.5 block">
                    {result.details.jurisdiction}
                  </span>
                </div>
                <div className="p-3 bg-[#FFFAF5] rounded-xl border border-[#252525]/8">
                  <span className="text-[10px] text-[#77716B] font-semibold block">Issue Year</span>
                  <span className="font-bold text-[#252525] mt-0.5 block">
                    {result.details.enrolledYear}
                  </span>
                </div>
                <div className="p-3 bg-[#FFFAF5] rounded-xl border border-[#252525]/8">
                  <span className="text-[10px] text-[#77716B] font-semibold block">Serial / Authority</span>
                  <span className="font-mono font-bold text-[#252525] mt-0.5 block">
                    {result.details.authorityCode}-{result.details.serialNumber}
                  </span>
                </div>
              </div>
            )}

            {/* Direct Official FoSCoS Verification CTA */}
            <div className="bg-[#FFF0E3]/50 border border-[#FFAB66]/30 p-5 rounded-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#F58220]">
                    Verify Active Status on Official FoSCoS Portal
                  </h4>
                  <p className="text-xs text-[#252525] mt-0.5 leading-relaxed">
                    Under Indian regulations, live license validity, registered premises, and approved product lists are hosted securely on the Food Safety Compliance System (FoSCoS).
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 bg-white text-[#F58220] border border-[#FFAB66]/40 rounded-lg text-xs font-bold hover:bg-[#FFF0E3] flex items-center space-x-1 shrink-0 ml-3"
                  title="Copy 14-digit number"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#22A447]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={result.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#F58220] hover:bg-[#e07114] text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  <span>Open Official FoSCoS Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-[11px] text-[#77716B]">
                  Official Govt Source • Last Schema Checked: {result.lastCheckedDate}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Certification Verification (Organic / Jaivik Bharat / Agmark) */}
      <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-6 space-y-4 bg-white">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-[#F58220]" />
          <h3 className="text-sm font-bold text-[#252525]">
            Organic & Quality Certification Standards
          </h3>
        </div>
        <p className="text-xs text-[#77716B]">
          In India, products claiming to be "Organic" must carry the <strong>Jaivik Bharat</strong> logo and be certified under the National Programme for Organic Production (NPOP) or Participatory Guarantee System (PGS-India).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl border border-[#252525]/8 bg-[#FFFAF5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#252525]">Jaivik Bharat / NPOP (APEDA)</span>
              <span className="text-[10px] bg-[#EAF8EE] text-[#22A447] px-2 py-0.5 rounded font-bold">
                Official Standard
              </span>
            </div>
            <p className="text-[11px] text-[#77716B] leading-relaxed">
              Mandatory for all packaged organic foods. Verifiable via the APEDA Tracenet database.
            </p>
            <a
              href="https://apeda.gov.in/apedawebsite/organic/organic_products.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#F58220] font-bold hover:underline inline-flex items-center space-x-1"
            >
              <span>APEDA Organic Registry</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl border border-[#252525]/8 bg-[#FFFAF5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#252525]">Agmark Quality Grading</span>
              <span className="text-[10px] bg-stone-100 text-[#252525] px-2 py-0.5 rounded font-bold">
                Agricultural Standard
              </span>
            </div>
            <p className="text-[11px] text-[#77716B] leading-relaxed">
              Certification mark for agricultural products in India (edible oils, pulses, honey, ghee) issued by the Directorate of Marketing & Inspection.
            </p>
            <a
              href="https://dmi.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#F58220] font-bold hover:underline inline-flex items-center space-x-1"
            >
              <span>DMI Agmark Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
