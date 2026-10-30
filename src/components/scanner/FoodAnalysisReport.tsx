import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BackButton } from '../common/BackButton';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Info,
  Scale,
  ExternalLink,
  ChevronRight,
  Flame,
  Apple,
  Dumbbell,
  Waves,
  Candy,
} from 'lucide-react';

export const FoodAnalysisReport: React.FC = () => {
  const { activeScan, setActiveTab, user } = useApp();
  const [activeNutrientTab, setActiveNutrientTab] = useState<'sugar' | 'sodium' | 'fat' | 'protein' | 'calories'>('sugar');

  if (!activeScan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <BackButton fallbackTab="scanner" label="Back to Scanner" />
        <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF0E3] flex items-center justify-center text-[#F58220] mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[#252525]">No Food Analysis Selected</h3>
        <p className="text-xs text-[#77716B] mt-1">
          Scan a packaged food product or choose a demonstration product to view the detailed intelligence report.
        </p>
        <button
          onClick={() => setActiveTab('scanner')}
          className="mt-4 px-5 py-2.5 bg-[#F58220] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#e07114]"
        >
          Open Food Scanner
        </button>
      </div>
    );
  }

  const {
    productName,
    brand,
    category,
    servingSize,
    fssaiLicenseNumber,
    certifications,
    claims,
    ingredientsList,
    allergensDeclared,
    nutritionSnapshot,
    plainEnglishExplanations,
    whatsGood,
    whatToWatch,
    personalizedInsights,
    portionGuidance,
    claimEvaluations,
    finalSummary,
    netQuantity,
    manufacturerName,
    manufacturingDate,
    expiryDate,
    batchNumber,
    mrp,
    additivesBreakdown,
    nutritionPer100g,
  } = activeScan;

  // Salt equivalent calculation
  const saltEquivalentG = ((nutritionSnapshot.sodiumMg * 2.5) / 1000).toFixed(2);
  const sugarTeaspoonsNum = Number((nutritionSnapshot.totalSugarG / 4).toFixed(1));
  const fullSpoons = Math.floor(sugarTeaspoonsNum);
  const hasHalfSpoon = sugarTeaspoonsNum - fullSpoons >= 0.3;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Back Button */}
      <BackButton fallbackTab="scanner" label="Back to Scanner" />

      {/* Product Banner */}
      <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-7 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFF0E3] text-[#F58220] px-2.5 py-0.5 rounded-md">
                {category}
              </span>
              {fssaiLicenseNumber && (
                <span className="text-[10px] font-mono text-[#77716B] bg-[#FFFAF5] px-2 py-0.5 rounded border border-[#252525]/8 flex items-center space-x-1">
                  <span>FSSAI: {fssaiLicenseNumber}</span>
                </span>
              )}
              {netQuantity && netQuantity !== 'Not visible' && (
                <span className="text-[10px] font-medium text-[#77716B] bg-[#FFFAF5] px-2 py-0.5 rounded border border-[#252525]/8">
                  Net: {netQuantity}
                </span>
              )}
              {mrp && mrp !== 'Not visible' && (
                <span className="text-[10px] font-medium text-[#77716B] bg-[#FFFAF5] px-2 py-0.5 rounded border border-[#252525]/8">
                  MRP: {mrp}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1.5 tracking-tight">
              {productName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#77716B]">
              <span className="font-semibold text-[#252525]">{brand}</span>
              {manufacturerName && manufacturerName !== 'Not visible' && (
                <>
                  <span>•</span>
                  <span>Mfr: {manufacturerName}</span>
                </>
              )}
              {expiryDate && expiryDate !== 'Not visible' && (
                <>
                  <span>•</span>
                  <span>Exp/Best Before: {expiryDate}</span>
                </>
              )}
              {batchNumber && batchNumber !== 'Not visible' && (
                <>
                  <span>•</span>
                  <span>Batch: {batchNumber}</span>
                </>
              )}
            </div>
          </div>

          {/* Quick CTA to Alternatives */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <button
              onClick={() => setActiveTab('alternatives')}
              className="px-4 py-2.5 bg-[#FFF0E3] hover:bg-[#ffdcc1] text-[#F58220] text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Want a Better Alternative?</span>
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className="px-3.5 py-2.5 border border-[#252525]/15 text-[#252525] hover:bg-[#FFFAF5] text-xs font-semibold rounded-xl transition-colors"
            >
              Scan Another
            </button>
          </div>
        </div>

        {/* Quick Marketing Claims Ribbon */}
        {claims && claims.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#252525]/6 flex items-center flex-wrap gap-2">
            <span className="text-[11px] font-bold text-[#77716B]">Front-pack Claims:</span>
            {claims.map((claim, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#FFFAF5] text-[#252525] px-2.5 py-1 rounded-md border border-[#252525]/10 font-medium"
              >
                {claim}
              </span>
            ))}
            <button
              onClick={() => setActiveTab('claims')}
              className="text-xs text-[#F58220] font-bold hover:underline flex items-center space-x-0.5 ml-auto"
            >
              <span>Verify Claims</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* SECTION A: Nutrition Analysis Cards */}
      <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-7 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#252525]">A. Nutrition Analysis</h2>
            <p className="text-xs text-[#77716B]">
              Declared nutritional values per <strong>{servingSize}</strong>
            </p>
          </div>
          <span className="text-[11px] bg-[#FFFAF5] text-[#77716B] font-semibold px-2.5 py-1 rounded-lg border border-[#252525]/8">
            Serving Basis: {servingSize}
          </span>
        </div>

        {/* Nutrition Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Calories */}
          <div className="bg-[#FFFAF5] p-3 rounded-xl border border-[#252525]/8 text-center hover:border-[#FFAB66]/50 transition-colors">
            <span className="text-[10px] text-[#77716B] font-semibold flex items-center justify-center space-x-1">
              <Flame className="w-3 h-3 text-[#F58220]" />
              <span>Calories</span>
            </span>
            <span className="text-lg font-extrabold text-[#252525] block mt-0.5">
              {nutritionSnapshot.energyKcal}
            </span>
            <span className="text-[10px] text-[#77716B] block">kcal</span>
          </div>

          {/* Total Fat */}
          <div className="bg-[#FFFAF5] p-3 rounded-xl border border-[#252525]/8 text-center hover:border-[#FFAB66]/50 transition-colors">
            <span className="text-[10px] text-[#77716B] font-semibold flex items-center justify-center space-x-1">
              <Apple className="w-3 h-3 text-[#22A447]" />
              <span>Total Fat</span>
            </span>
            <span className="text-lg font-extrabold text-[#252525] block mt-0.5">
              {nutritionSnapshot.totalFatG}g
            </span>
            <span className="text-[10px] text-[#77716B] block">
              Sat: {nutritionSnapshot.saturatedFatG}g
            </span>
          </div>

          {/* Trans Fat */}
          <div className="bg-[#FFFAF5] p-3 rounded-xl border border-[#252525]/8 text-center hover:border-[#FFAB66]/50 transition-colors">
            <span className="text-[10px] text-[#77716B] font-semibold block">Trans Fat</span>
            <span className="text-lg font-extrabold text-[#252525] block mt-0.5">
              {nutritionSnapshot.transFatG}g
            </span>
            <span className={`text-[10px] font-bold block ${nutritionSnapshot.transFatG < 0.2 ? 'text-[#22A447]' : 'text-[#E65A50]'}`}>
              {nutritionSnapshot.transFatG < 0.2 ? 'Statutory Clean' : 'Present'}
            </span>
          </div>

          {/* Sugar */}
          <div className="bg-[#FFFAF5] p-3 rounded-xl border border-[#252525]/8 text-center hover:border-[#FFAB66]/50 transition-colors">
            <span className="text-[10px] text-[#77716B] font-semibold flex items-center justify-center space-x-1">
              <Candy className="w-3 h-3 text-[#F58220]" />
              <span>Total Sugar</span>
            </span>
            <span className="text-lg font-extrabold text-[#252525] block mt-0.5">
              {nutritionSnapshot.totalSugarG}g
            </span>
            <span className="text-[10px] text-[#F58220] font-bold block">
              ~{sugarTeaspoonsNum} tsp
            </span>
          </div>

          {/* Sodium */}
          <div className="bg-[#FFFAF5] p-3 rounded-xl border border-[#252525]/8 text-center hover:border-[#FFAB66]/50 transition-colors">
            <span className="text-[10px] text-[#77716B] font-semibold flex items-center justify-center space-x-1">
              <Waves className="w-3 h-3 text-[#F2B544]" />
              <span>Sodium</span>
            </span>
            <span className={`text-lg font-extrabold block mt-0.5 ${nutritionSnapshot.sodiumMg > 400 ? 'text-[#F2B544]' : 'text-[#252525]'}`}>
              {nutritionSnapshot.sodiumMg}
            </span>
            <span className="text-[10px] text-[#77716B] block">mg (~{saltEquivalentG}g salt)</span>
          </div>

          {/* Protein */}
          <div className="bg-[#FFFAF5] p-3 rounded-xl border border-[#252525]/8 text-center hover:border-[#FFAB66]/50 transition-colors">
            <span className="text-[10px] text-[#77716B] font-semibold flex items-center justify-center space-x-1">
              <Dumbbell className="w-3 h-3 text-[#22A447]" />
              <span>Protein</span>
            </span>
            <span className="text-lg font-extrabold text-[#22A447] block mt-0.5">
              {nutritionSnapshot.proteinG}g
            </span>
            <span className="text-[10px] text-[#77716B] block">Protein</span>
          </div>

          {/* Fiber */}
          <div className="bg-[#FFFAF5] p-3 rounded-xl border border-[#252525]/8 text-center hover:border-[#FFAB66]/50 transition-colors">
            <span className="text-[10px] text-[#77716B] font-semibold block">Dietary Fiber</span>
            <span className="text-lg font-extrabold text-[#252525] block mt-0.5">
              {nutritionSnapshot.dietaryFiberG || 0}g
            </span>
            <span className="text-[10px] text-[#77716B] block">Fiber</span>
          </div>
        </div>

        {/* Explain Nutrition in Everyday Language */}
        <div className="mt-6 pt-6 border-t border-[#252525]/8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F58220] mb-3">
            Explain Nutrition in Everyday Language
          </h3>

          {/* Nutrient Tab Selector */}
          <div className="flex space-x-1.5 overflow-x-auto pb-2 mb-4">
            {(['sugar', 'sodium', 'fat', 'protein', 'calories'] as const).map((nutrient) => (
              <button
                key={nutrient}
                onClick={() => setActiveNutrientTab(nutrient)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                  activeNutrientTab === nutrient
                    ? 'bg-[#F58220] text-white shadow-xs'
                    : 'bg-[#FFFAF5] text-[#77716B] hover:text-[#252525] border border-[#252525]/8'
                }`}
              >
                {nutrient === 'sugar' && `Sugar (${nutritionSnapshot.totalSugarG}g)`}
                {nutrient === 'sodium' && `Sodium (${nutritionSnapshot.sodiumMg}mg)`}
                {nutrient === 'fat' && `Fat (${nutritionSnapshot.totalFatG}g)`}
                {nutrient === 'protein' && `Protein (${nutritionSnapshot.proteinG}g)`}
                {nutrient === 'calories' && `Calories (${nutritionSnapshot.energyKcal} kcal)`}
              </button>
            ))}
          </div>

          {/* Active Nutrient Everyday Card */}
          {plainEnglishExplanations && plainEnglishExplanations[activeNutrientTab] && (
            <div className="bg-[#FFFAF5] rounded-xl p-4 sm:p-5 border border-[#252525]/10 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#77716B]">
                    1. What It Is
                  </h4>
                  <p className="text-xs text-[#252525] mt-0.5 leading-relaxed">
                    {plainEnglishExplanations[activeNutrientTab].definition}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#77716B]">
                    2. What The Label Declares
                  </h4>
                  <p className="text-xs font-bold text-[#252525] mt-0.5 leading-relaxed">
                    {plainEnglishExplanations[activeNutrientTab].labelValue}
                  </p>
                </div>
              </div>

              {/* Visual Teaspoon Indicator for Sugar */}
              {activeNutrientTab === 'sugar' && (
                <div className="p-3.5 bg-white rounded-xl border border-[#FFAB66]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-xl tracking-tighter text-[#F58220]">
                      {Array.from({ length: Math.min(fullSpoons, 8) }).map((_, i) => (
                        <span key={i} title="1 level teaspoon">🥄</span>
                      ))}
                      {hasHalfSpoon && <span title="Half teaspoon" className="opacity-60 text-base">🥄½</span>}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#252525]">
                        Approx. {sugarTeaspoonsNum} level teaspoons of sugar
                      </p>
                      <p className="text-[10px] text-[#77716B]">
                        Standard visual benchmark: approx. 4g of sugar per level teaspoon.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#FFF0E3] text-[#F58220] border border-[#FFAB66]/30 px-2.5 py-1 rounded-md font-bold self-start sm:self-auto">
                    Added Sugar: {nutritionSnapshot.addedSugarG}g
                  </span>
                </div>
              )}

              {/* Salt Equivalent Visual for Sodium */}
              {activeNutrientTab === 'sodium' && (
                <div className="p-3.5 bg-white rounded-xl border border-amber-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xl">🧂</span>
                      <div>
                        <p className="text-xs font-bold text-[#252525]">
                          Estimated Salt Equivalent: ~{saltEquivalentG} g of salt
                        </p>
                        <p className="text-[10px] text-[#77716B]">
                          Formula: Sodium mg × 2.5 / 1,000 = Grams of salt.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md font-bold self-start sm:self-auto">
                      {((nutritionSnapshot.sodiumMg / 2000) * 100).toFixed(0)}% of ICMR 2,000mg Daily Limit
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-[#252525]/8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#77716B]">
                  3. What It Means For Your Health
                </h4>
                <p className="text-xs text-[#252525] mt-0.5 leading-relaxed">
                  {plainEnglishExplanations[activeNutrientTab].meaning}
                </p>
              </div>

              <div className="pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                  4. Practical Action
                </h4>
                <p className="text-xs font-semibold text-[#F58220] mt-0.5 leading-relaxed">
                  {plainEnglishExplanations[activeNutrientTab].practicalAction}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION B: Ingredients & Additives Analysis */}
      <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-7 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#252525]">B. Ingredients & Additives Breakdown</h2>
            <p className="text-xs text-[#77716B]">
              Full formulation in descending order of weight & critical additive screening
            </p>
          </div>
          {allergensDeclared && allergensDeclared.length > 0 && (
            <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              Allergens: {allergensDeclared.join(', ')}
            </span>
          )}
        </div>

        {/* Key Ingredient Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="bg-[#FFFAF5] p-3 rounded-xl border border-[#252525]/8">
            <span className="text-[10px] text-[#77716B] font-semibold block">Refined Flour (Maida)</span>
            <span className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${additivesBreakdown?.refinedFlourPresent ? 'text-[#F58220]' : 'text-[#22A447]'}`}>
              {additivesBreakdown?.refinedFlourPresent ? 'Detected in product' : 'Not detected / Whole grain'}
            </span>
          </div>

          <div className="bg-[#FFFAF5] p-3 rounded-xl border border-[#252525]/8">
            <span className="text-[10px] text-[#77716B] font-semibold block">Palm Oil / Palmolein</span>
            <span className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${additivesBreakdown?.palmOilPresent ? 'text-[#F58220]' : 'text-[#22A447]'}`}>
              {additivesBreakdown?.palmOilPresent ? 'Present in product' : 'Not detected'}
            </span>
          </div>

          <div className="bg-[#FFFAF5] p-3 rounded-xl border border-[#252525]/8">
            <span className="text-[10px] text-[#77716B] font-semibold block">Preservatives</span>
            <span className="text-xs font-bold text-[#252525] mt-1 block">
              {additivesBreakdown?.preservatives && additivesBreakdown.preservatives.length > 0
                ? `${additivesBreakdown.preservatives.length} identified`
                : 'None detected'}
            </span>
          </div>

          <div className="bg-[#FFFAF5] p-3 rounded-xl border border-[#252525]/8">
            <span className="text-[10px] text-[#77716B] font-semibold block">Sweeteners & Added Sugars</span>
            <span className="text-xs font-bold text-[#252525] mt-1 block">
              {additivesBreakdown?.addedSweeteners && additivesBreakdown.addedSweeteners.length > 0
                ? `${additivesBreakdown.addedSweeteners.length} identified`
                : 'None declared'}
            </span>
          </div>
        </div>

        {/* Complete Ingredients List */}
        {ingredientsList && ingredientsList.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#77716B] mb-2">
              Complete Declared Ingredients ({ingredientsList.length} items)
            </h4>
            <div className="flex flex-wrap gap-1.5 p-3.5 bg-[#FFFAF5] rounded-xl border border-[#252525]/8">
              {ingredientsList.map((ing, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-white text-[#252525] px-2.5 py-1 rounded-md border border-[#252525]/10 font-medium"
                >
                  <span className="text-[#F58220] font-mono font-bold text-[10px] mr-1">#{idx + 1}</span>
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Concerning Additives & INS Explained */}
        {additivesBreakdown?.concerningAdditives && additivesBreakdown.concerningAdditives.length > 0 && (
          <div className="pt-4 border-t border-[#252525]/8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F58220] mb-2.5">
              Food Additives & Chemical Codes Explained in Plain English
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {additivesBreakdown.concerningAdditives.map((add, idx) => (
                <div key={idx} className="bg-[#FFFAF5] p-3.5 rounded-xl border border-[#252525]/8 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#252525]">{add.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      add.safetyLevel === 'Generally Safe'
                        ? 'bg-[#EAF8EE] text-[#22A447] border border-[#22A447]/30'
                        : add.safetyLevel === 'Caution' || add.safetyLevel === 'Moderate'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-stone-100 text-[#252525]'
                    }`}>
                      {add.safetyLevel || 'FSSAI Approved'}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-[#77716B]">{add.role}</p>
                  <p className="text-xs text-[#252525] leading-relaxed pt-1">{add.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION C & D: What's Good vs What to Watch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section C: What's Good */}
        <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-6 bg-white">
          <div className="flex items-center space-x-2 text-[#22A447] mb-3">
            <CheckCircle2 className="w-5 h-5 text-[#22A447]" />
            <h3 className="text-sm font-bold text-[#252525]">C. What's Good About This Food</h3>
          </div>
          <p className="text-xs text-[#77716B] mb-3">
            Potentially beneficial nutrients and authentic ingredients based strictly on label data.
          </p>
          <ul className="space-y-2">
            {whatsGood.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-[#252525] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22A447] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section D: What to Watch */}
        <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-6 bg-white">
          <div className="flex items-center space-x-2 text-amber-700 mb-3">
            <AlertTriangle className="w-5 h-5 text-[#F2B544]" />
            <h3 className="text-sm font-bold text-[#252525]">D. What Should You Be Careful About</h3>
          </div>
          <p className="text-xs text-[#77716B] mb-3">
            Identified concerns such as saturated fat, sodium density, or declared allergens.
          </p>
          <ul className="space-y-2">
            {whatToWatch.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-[#252525] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SECTION E: Personalized Food Insights */}
      <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-6 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#F58220]" />
            <h3 className="text-sm font-bold text-[#252525]">E. Personalized Food Insights</h3>
          </div>
          {user && (
            <span className="text-[11px] text-[#F58220] font-bold bg-[#FFF0E3] px-2.5 py-0.5 rounded-md">
              Tailored for: {user.goal} • {user.dietaryPreference}
            </span>
          )}
        </div>
        <p className="text-xs text-[#77716B] mb-4">
          Evidence-based explanations referencing your voluntary preferences, age range, and dietary goals. (Not medical diagnosis).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {personalizedInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#FFFAF5] border border-[#252525]/8 text-xs text-[#252525] leading-relaxed"
            >
              {insight}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION F: Portion Guidance */}
      <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-6 bg-white">
        <div className="flex items-center space-x-2 text-[#F58220] mb-2">
          <Scale className="w-5 h-5" />
          <h3 className="text-sm font-bold text-[#252525]">F. Portion Guidance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div className="bg-[#FFFAF5] p-4 rounded-xl border border-[#252525]/8">
            <span className="text-[10px] text-[#77716B] font-bold uppercase tracking-wider block">
              Suggested Portion
            </span>
            <p className="text-sm font-extrabold text-[#F58220] mt-1">{portionGuidance.suggestedPortion}</p>
            <p className="text-xs text-[#77716B] mt-1">Approx. {portionGuidance.portionCalories} kcal</p>
          </div>

          <div className="bg-[#FFFAF5] p-4 rounded-xl border border-[#252525]/8 md:col-span-2">
            <span className="text-[10px] text-[#77716B] font-bold uppercase tracking-wider block">
              Comparison with Labelled Serving
            </span>
            <p className="text-xs text-[#252525] mt-1 leading-relaxed">
              {portionGuidance.comparisonWithLabeled}
            </p>
            <p className="text-[10px] text-[#77716B] italic mt-2">
              Notice: {portionGuidance.disclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION G: Simple Final Summary & Action Next Steps */}
      <div className="bg-gradient-to-br from-[#252525] to-[#38332E] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-[#FFAB66]" />
          <span>G. Simple Final Summary</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-white/90">
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10">
            <h4 className="font-bold text-[#FFD2AC] uppercase text-[10px] tracking-wider mb-1">
              What To Know
            </h4>
            <p className="leading-relaxed">{finalSummary.whatToKnow}</p>
          </div>

          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10">
            <h4 className="font-bold text-[#FFAB66] uppercase text-[10px] tracking-wider mb-1">
              What To Watch
            </h4>
            <p className="leading-relaxed">{finalSummary.whatToWatch}</p>
          </div>

          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10">
            <h4 className="font-bold text-[#FFD2AC] uppercase text-[10px] tracking-wider mb-1">
              Cleaner Alternative Available?
            </h4>
            <p className="leading-relaxed">{finalSummary.alternativeAdvice}</p>
          </div>
        </div>

        {/* Action Buttons inside Summary */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('claims')}
              className="px-4 py-2 bg-white text-[#252525] hover:text-[#F58220] text-xs font-bold rounded-lg hover:bg-[#FFFAF5] shadow-xs transition-colors"
            >
              View Detailed Claim Verification
            </button>
            <button
              onClick={() => setActiveTab('alternatives')}
              className="px-4 py-2 bg-[#F58220] hover:bg-[#e07114] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              Compare with Healthier Indian Alternatives
            </button>
            {fssaiLicenseNumber && (
              <button
                onClick={() => setActiveTab('fssai')}
                className="px-4 py-2 bg-white/15 text-white hover:bg-white/25 text-xs font-semibold rounded-lg"
              >
                Verify FSSAI ({fssaiLicenseNumber})
              </button>
            )}
          </div>

          <button
            onClick={() => setActiveTab('scanner')}
            className="text-xs text-[#FFAB66] hover:underline font-semibold"
          >
            ← Scan Another Item
          </button>
        </div>
      </div>
    </div>
  );
};
