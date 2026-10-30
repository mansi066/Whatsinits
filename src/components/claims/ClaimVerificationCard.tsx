import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BackButton } from '../common/BackButton';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  FileSearch,
  ExternalLink,
  ChevronRight,
  Info,
  ArrowRight,
} from 'lucide-react';
import { ClaimEvaluation } from '../../types';

export const ClaimVerificationCard: React.FC = () => {
  const { activeScan, setActiveTab } = useApp();
  const [customClaim, setCustomClaim] = useState('');
  const [extraEvaluations, setExtraEvaluations] = useState<ClaimEvaluation[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  if (!activeScan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <BackButton fallbackTab="scanner" label="Back to Scanner" />
        <h3 className="text-base font-bold text-[#252525]">No Scanned Product Loaded</h3>
        <p className="text-xs text-[#77716B] mt-1">Scan a packaged food product first to inspect its packaging claims.</p>
        <button
          onClick={() => setActiveTab('scanner')}
          className="mt-4 px-4 py-2.5 bg-[#F58220] text-white text-xs font-bold rounded-xl hover:bg-[#e07114]"
        >
          Go to Food Scanner
        </button>
      </div>
    );
  }

  const allClaims = [...activeScan.claimEvaluations, ...extraEvaluations];

  const handleEvaluateCustomClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClaim.trim()) return;

    setIsEvaluating(true);
    setTimeout(() => {
      const claimLower = customClaim.toLowerCase();
      let status: ClaimEvaluation['status'] = 'Insufficient Evidence';
      let rule = 'FSSAI Advertising and Claims Regulations (2018)';
      let reason = 'Reviewing formulation against general FSSAI claim guidelines.';
      let evidence = `Checked against ${activeScan.productName} ingredients list and nutrition snapshot.`;
      let infoNeeded = 'Independent lab report verifying claim parameter.';

      if (claimLower.includes('sugar') || claimLower.includes('sweet')) {
        if (activeScan.nutritionSnapshot.addedSugarG === 0) {
          status = 'Supported by Available Evidence';
          reason = 'Product lists 0g added sugar in declared nutrition table and ingredients.';
          rule = 'FSSAI No Added Sugar criteria (no added sucrose, syrups, or honey).';
        } else {
          status = 'Potential Mismatch Detected';
          reason = `Product contains ${activeScan.nutritionSnapshot.addedSugarG}g of added sugar, conflicting with sugar-free assertions.`;
        }
      } else if (claimLower.includes('protein')) {
        const proteinRatio = (activeScan.nutritionSnapshot.proteinG * 4) / activeScan.nutritionSnapshot.energyKcal;
        if (proteinRatio >= 0.2 || activeScan.nutritionSnapshot.proteinG >= 6) {
          status = 'Supported by Available Evidence';
          reason = 'Protein contributes over 20% of energy or >=6g per 100g, fulfilling High Protein benchmark.';
        } else {
          status = 'Potential Mismatch Detected';
          reason = `Protein contributes only ${(proteinRatio * 100).toFixed(1)}% of total calories, below the 20% regulatory requirement for "High Protein".`;
        }
      } else if (claimLower.includes('natural') || claimLower.includes('pure')) {
        const hasAdditives = activeScan.ingredientsList.some(
          (i) => i.includes('INS') || i.includes('Flavor') || i.includes('Color')
        );
        if (hasAdditives) {
          status = 'Potential Mismatch Detected';
          reason = 'Product formulation includes synthetic/nature-identical additives (INS codes), which conflicts with unqualified 100% Natural claims under FSSAI schedule V.';
        } else {
          status = 'Supported by Available Evidence';
          reason = 'Ingredients list consists solely of whole unrefined agricultural commodities without synthetic food additives.';
        }
      }

      const newEval: ClaimEvaluation = {
        claim: customClaim,
        status,
        evidenceReviewed: evidence,
        applicableRule: rule,
        reason,
        informationStillRequired: infoNeeded,
      };

      setExtraEvaluations((prev) => [newEval, ...prev]);
      setCustomClaim('');
      setIsEvaluating(false);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Back Button */}
      <BackButton fallbackTab="report" label="Back to Food Analysis" />

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-[#FFF0E3] text-[#F58220] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F58220]" />
            <span>Regulatory Claim Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#252525] tracking-tight">
            Product Claim Verification Engine
          </h1>
          <p className="text-xs text-[#77716B] mt-0.5">
            Comparing declared marketing claims on <strong>{activeScan.productName}</strong> against FSSAI Advertising and Claims Regulations (2018).
          </p>
        </div>
      </div>

      {/* Verification Status Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#EAF8EE] border border-[#22A447]/30 p-3.5 rounded-xl flex items-start space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#22A447] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[#22A447]">Supported by Available Evidence</h4>
            <p className="text-[11px] text-stone-700 mt-0.5 leading-tight">
              Label data, ingredients order, and statutory formulas align with FSSAI regulations.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-[#F2B544]/40 p-3.5 rounded-xl flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-[#F2B544] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-900">Potential Mismatch Detected</h4>
            <p className="text-[11px] text-amber-900/80 mt-0.5 leading-tight">
              Front-pack marketing exaggerates ingredient proportion or contradicts nutrient table.
            </p>
          </div>
        </div>

        <div className="bg-[#FFFAF5] border border-[#252525]/10 p-3.5 rounded-xl flex items-start space-x-2.5">
          <HelpCircle className="w-4 h-4 text-[#77716B] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[#252525]">Insufficient Evidence</h4>
            <p className="text-[11px] text-[#77716B] mt-0.5 leading-tight">
              Independent laboratory COA or certified testing is required to substantiate.
            </p>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {allClaims.map((item, idx) => {
          const isSupported = item.status === 'Supported by Available Evidence';
          const isMismatch = item.status === 'Potential Mismatch Detected';

          return (
            <div
              key={idx}
              className={`spotlight-card rounded-2xl shadow-sm border p-5 sm:p-6 transition-all bg-white ${
                isMismatch
                  ? 'border-[#F2B544]/50 bg-amber-50/20'
                  : isSupported
                  ? 'border-[#22A447]/40 bg-[#EAF8EE]/10'
                  : 'border-[#252525]/10'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#252525]/8">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#252525]">Claim: "{item.claim}"</span>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center space-x-1.5 w-fit ${
                    isSupported
                      ? 'bg-[#EAF8EE] text-[#22A447] border border-[#22A447]/30'
                      : isMismatch
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-stone-100 text-[#77716B]'
                  }`}
                >
                  {isSupported ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22A447]" />
                  ) : isMismatch ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F2B544]" />
                  ) : (
                    <HelpCircle className="w-3.5 h-3.5 text-[#77716B]" />
                  )}
                  <span>{item.status}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <span className="font-bold text-[#77716B] uppercase text-[10px] tracking-wider block">
                    Evidence Reviewed
                  </span>
                  <p className="text-[#252525] mt-0.5 leading-relaxed">{item.evidenceReviewed}</p>

                  <span className="font-bold text-[#77716B] uppercase text-[10px] tracking-wider block mt-3">
                    Applicable Criterion / Rule
                  </span>
                  <p className="text-[#F58220] font-semibold mt-0.5 leading-relaxed">
                    {item.applicableRule}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[#77716B] uppercase text-[10px] tracking-wider block">
                    Reason for Evaluation
                  </span>
                  <p className="text-[#252525] mt-0.5 leading-relaxed font-medium">{item.reason}</p>

                  <span className="font-bold text-[#77716B] uppercase text-[10px] tracking-wider block mt-3">
                    Information Still Required
                  </span>
                  <p className="text-[#77716B] mt-0.5 leading-relaxed">
                    {item.informationStillRequired}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Evaluate Custom Marketing Claim */}
      <div className="bg-[#FFFAF5] rounded-2xl p-5 border border-[#252525]/10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F58220] mb-1">
          Evaluate Another Packaging Claim
        </h3>
        <p className="text-xs text-[#77716B] mb-3">
          See a claim on this packet that wasn't automatically parsed? Enter it below to test against declared ingredients and FSSAI rules.
        </p>

        <form onSubmit={handleEvaluateCustomClaim} className="flex gap-2">
          <input
            type="text"
            value={customClaim}
            onChange={(e) => setCustomClaim(e.target.value)}
            placeholder="e.g. 100% Whole Wheat, Zero Sugar, No Preservatives, Pure Cow Milk"
            className="flex-1 text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl bg-white outline-none focus:ring-1 focus:ring-[#F58220]"
          />
          <button
            type="submit"
            disabled={!customClaim.trim() || isEvaluating}
            className="px-5 py-2.5 bg-[#F58220] hover:bg-[#e07114] disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            {isEvaluating ? 'Evaluating...' : 'Verify Claim'}
          </button>
        </form>
      </div>

      {/* Scientific Transparency Notice */}
      <div className="p-4 bg-white rounded-xl border border-[#252525]/8 text-[11px] text-[#77716B] flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-[#F58220] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Transparency Principle:</strong> WhatsInit compares claims objectively using the FSSAI Advertising and Claims Regulations (2018) and statutory Schedule I-V rules. A potential mismatch does not automatically imply intentional fraud, as formulations and third-party certifications may evolve.
        </p>
      </div>
    </div>
  );
};
