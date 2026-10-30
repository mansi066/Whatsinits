import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HEALTHY_ALTERNATIVES } from '../../data/mockData';
import { AlternativeProduct } from '../../types';
import { NutrientComparisonChart } from './NutrientComparisonChart';
import { BackButton } from '../common/BackButton';
import {
  Sparkles,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Scale,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Plus,
} from 'lucide-react';

export const AlternativesView: React.FC = () => {
  const {
    activeScan,
    savedAlternatives,
    toggleSaveAlternative,
    setActiveTab,
    addIngredientsToGroceryList,
  } = useApp();

  const [basis, setBasis] = useState<'per100g' | 'perServing'>('per100g');
  const [selectedAltIds, setSelectedAltIds] = useState<string[]>(['alt-makhana', 'alt-roasted-chana']);
  const [addedGroceryFeedback, setAddedGroceryFeedback] = useState<string | null>(null);

  // Fallback product if no active scan
  const currentProduct = activeScan || {
    productName: 'Kurkure Masala Munch',
    servingSize: '30 g',
    nutritionSnapshot: {
      energyKcal: 168,
      totalFatG: 10.5,
      saturatedFatG: 4.8,
      transFatG: 0.05,
      carbohydratesG: 16.2,
      totalSugarG: 1.8,
      addedSugarG: 1.2,
      proteinG: 1.8,
      sodiumMg: 280,
      dietaryFiberG: 1.1,
    },
  };

  // Convert current scanned product to 100g normalized if needed
  const scannedMultiplier = basis === 'per100g' ? (100 / 30) : 1;
  const scannedNutrients = {
    energyKcal: Math.round(currentProduct.nutritionSnapshot.energyKcal * scannedMultiplier),
    totalFatG: +(currentProduct.nutritionSnapshot.totalFatG * scannedMultiplier).toFixed(1),
    saturatedFatG: +(currentProduct.nutritionSnapshot.saturatedFatG * scannedMultiplier).toFixed(1),
    totalSugarG: +(currentProduct.nutritionSnapshot.totalSugarG * scannedMultiplier).toFixed(1),
    sodiumMg: Math.round(currentProduct.nutritionSnapshot.sodiumMg * scannedMultiplier),
    proteinG: +(currentProduct.nutritionSnapshot.proteinG * scannedMultiplier).toFixed(1),
    price: basis === 'per100g' ? 33 : 10,
  };

  const handleToggleCompare = (id: string) => {
    setSelectedAltIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 2) return [prev[1], id];
        return [...prev, id];
      }
    });
  };

  const selectedAlternatives = HEALTHY_ALTERNATIVES.filter((a) => selectedAltIds.includes(a.id));

  const handleAddToGrocery = (alt: AlternativeProduct) => {
    addIngredientsToGroceryList(
      [
        {
          name: alt.name,
          quantity: `${alt.packageSizeG}g pack`,
          category: alt.category.includes('Pulse') ? 'Pulses & Legumes' : 'Other essentials',
          estimatedCostInr: alt.priceInr,
        },
      ],
      'Healthy Alternatives'
    );
    setAddedGroceryFeedback(`Added ${alt.name} to your Grocery List!`);
    setTimeout(() => setAddedGroceryFeedback(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Back Button */}
      <BackButton fallbackTab="report" label="Back to Product Analysis" />

      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-[#FFF0E3] text-[#F58220] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#F58220]" />
            <span>Smart Nutritional Swaps</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
            Want a Better Alternative?
          </h1>
          <p className="text-xs sm:text-sm text-[#77716B] mt-1">
            Compare <strong>{currentProduct.productName}</strong> against wholesome, budget-friendly Indian snacks with evidence-based nutrition and real pricing.
          </p>
        </div>

        {/* Serving Basis Switcher */}
        <div className="bg-white p-1 rounded-xl border border-[#252525]/12 shadow-2xs flex items-center space-x-1 self-start sm:self-auto">
          <button
            onClick={() => setBasis('per100g')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              basis === 'per100g'
                ? 'bg-[#F58220] text-white shadow-xs'
                : 'text-[#77716B] hover:text-[#252525]'
            }`}
          >
            Per 100g Basis
          </button>
          <button
            onClick={() => setBasis('perServing')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              basis === 'perServing'
                ? 'bg-[#F58220] text-white shadow-xs'
                : 'text-[#77716B] hover:text-[#252525]'
            }`}
          >
            Per Serving
          </button>
        </div>
      </div>

      {addedGroceryFeedback && (
        <div className="p-3 bg-[#EAF8EE] text-[#22A447] text-xs font-bold rounded-xl border border-[#22A447]/30 flex items-center justify-between animate-in fade-in">
          <span>{addedGroceryFeedback}</span>
          <button
            onClick={() => setActiveTab('grocery')}
            className="underline font-bold hover:text-emerald-950"
          >
            View Grocery List
          </button>
        </div>
      )}

      {/* Normalization Note */}
      <div className="p-3.5 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 text-xs text-[#77716B] flex items-center space-x-2">
        <Scale className="w-4 h-4 text-[#F58220] shrink-0" />
        <span>
          {basis === 'per100g'
            ? 'Values normalized per 100g provide a strict apples-to-apples comparison of nutrient and sodium density independent of packaging sizes.'
            : 'Values displayed per typical single portion as declared on packaging or traditional culinary recipe.'}
        </span>
      </div>

      {/* Comparison Grid with Charts */}
      <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-7 space-y-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#252525]/8 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#252525]">Side-by-Side Nutritional Comparison</h3>
            <p className="text-xs text-[#77716B]">
              Scanned item vs. selected healthy alternatives ({basis === 'per100g' ? 'Per 100g' : 'Per Serving'})
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[#77716B]">Select to compare:</span>
            {HEALTHY_ALTERNATIVES.map((alt) => (
              <button
                key={alt.id}
                onClick={() => handleToggleCompare(alt.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                  selectedAltIds.includes(alt.id)
                    ? 'border-[#F58220] bg-[#FFF0E3] text-[#F58220]'
                    : 'border-[#252525]/15 text-[#77716B] hover:bg-[#FFFAF5]'
                }`}
              >
                {alt.name.split(' ')[0]} {alt.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Responsive SVG Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Sugar Chart */}
          <NutrientComparisonChart
            title="Total Sugar (Lower is Better)"
            unit="g"
            items={[
              {
                name: currentProduct.productName,
                value: scannedNutrients.totalSugarG,
                color: '#F58220',
                isPrimaryScanned: true,
              },
              ...selectedAlternatives.map((alt) => ({
                name: alt.name,
                value:
                  basis === 'per100g'
                    ? alt.nutritionPer100g.totalSugarG
                    : alt.nutritionPerServing.totalSugarG,
                color: '#22A447',
              })),
            ]}
          />

          {/* Sodium Chart */}
          <NutrientComparisonChart
            title="Sodium (Lower is Better)"
            unit="mg"
            items={[
              {
                name: currentProduct.productName,
                value: scannedNutrients.sodiumMg,
                color: '#E65A50',
                isPrimaryScanned: true,
              },
              ...selectedAlternatives.map((alt) => ({
                name: alt.name,
                value:
                  basis === 'per100g'
                    ? alt.nutritionPer100g.sodiumMg
                    : alt.nutritionPerServing.sodiumMg,
                color: '#22A447',
              })),
            ]}
          />

          {/* Saturated / Total Fat Chart */}
          <NutrientComparisonChart
            title="Total Fat (Lower is Better)"
            unit="g"
            items={[
              {
                name: currentProduct.productName,
                value: scannedNutrients.totalFatG,
                color: '#F2B544',
                isPrimaryScanned: true,
              },
              ...selectedAlternatives.map((alt) => ({
                name: alt.name,
                value:
                  basis === 'per100g'
                    ? alt.nutritionPer100g.totalFatG
                    : alt.nutritionPerServing.totalFatG,
                color: '#22A447',
              })),
            ]}
          />

          {/* Protein Chart */}
          <NutrientComparisonChart
            title="Protein (Higher is Better)"
            unit="g"
            items={[
              {
                name: currentProduct.productName,
                value: scannedNutrients.proteinG,
                color: '#77716B',
                isPrimaryScanned: true,
              },
              ...selectedAlternatives.map((alt) => ({
                name: alt.name,
                value:
                  basis === 'per100g'
                    ? alt.nutritionPer100g.proteinG
                    : alt.nutritionPerServing.proteinG,
                color: '#22A447',
              })),
            ]}
          />

          {/* Calories Chart */}
          <NutrientComparisonChart
            title="Energy (Calories)"
            unit="kcal"
            items={[
              {
                name: currentProduct.productName,
                value: scannedNutrients.energyKcal,
                color: '#77716B',
                isPrimaryScanned: true,
              },
              ...selectedAlternatives.map((alt) => ({
                name: alt.name,
                value:
                  basis === 'per100g'
                    ? alt.nutritionPer100g.energyKcal
                    : alt.nutritionPerServing.energyKcal,
                color: '#22A447',
              })),
            ]}
          />

          {/* Price Chart */}
          <NutrientComparisonChart
            title={basis === 'per100g' ? 'Price per 100g (₹)' : 'Approx Cost per Pack (₹)'}
            unit="₹"
            items={[
              {
                name: currentProduct.productName,
                value: scannedNutrients.price,
                color: '#77716B',
                isPrimaryScanned: true,
              },
              ...selectedAlternatives.map((alt) => ({
                name: alt.name,
                value: basis === 'per100g' ? alt.pricePer100gInr : alt.priceInr,
                color: '#F58220',
              })),
            ]}
          />
        </div>
      </div>

      {/* Alternative Product Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#252525]">
          Recommended Indian Food Alternatives Detailed Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HEALTHY_ALTERNATIVES.map((alt) => {
            const isSaved = savedAlternatives.some((s) => s.id === alt.id);
            const nut = basis === 'per100g' ? alt.nutritionPer100g : alt.nutritionPerServing;

            return (
              <div
                key={alt.id}
                className="spotlight-card rounded-2xl p-5 border border-[#252525]/10 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#F58220] transition-colors bg-white"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-2xl p-2 bg-[#FFFAF5] rounded-xl border border-[#252525]/8">
                        {alt.imageEmoji || '🥗'}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#252525] leading-tight">
                          {alt.name}
                        </h4>
                        <span className="text-[11px] text-[#77716B]">{alt.brandOrType}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveAlternative(alt)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-[#FFF0E3] border-[#F58220] text-[#F58220]'
                          : 'border-[#252525]/15 text-[#77716B] hover:bg-[#FFFAF5]'
                      }`}
                      title={isSaved ? 'Saved to profile' : 'Save alternative'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Price & Serving pills */}
                  <div className="mt-3 flex items-center space-x-2 text-xs">
                    <span className="bg-[#FFF0E3] text-[#F58220] px-2.5 py-0.5 rounded font-bold">
                      ₹{alt.priceInr} ({alt.packageSizeG}g)
                    </span>
                    <span className="bg-[#FFFAF5] text-[#77716B] border border-[#252525]/8 px-2 py-0.5 rounded">
                      ₹{alt.pricePer100gInr}/100g
                    </span>
                    <span className="text-[10px] text-[#22A447] font-semibold">
                      {alt.isPackaged ? 'Packaged Snack' : 'Whole Food / Homemade'}
                    </span>
                  </div>

                  {/* Nutrition row */}
                  <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs bg-[#FFFAF5] p-2.5 rounded-xl border border-[#252525]/6">
                    <div>
                      <span className="text-[10px] text-[#77716B] block">Energy</span>
                      <span className="font-bold text-[#252525]">{nut.energyKcal} kcal</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#77716B] block">Protein</span>
                      <span className="font-bold text-[#22A447]">{nut.proteinG}g</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#77716B] block">Sodium</span>
                      <span className="font-bold text-[#252525]">{nut.sodiumMg}mg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#77716B] block">Total Fat</span>
                      <span className="font-bold text-[#252525]">{nut.totalFatG}g</span>
                    </div>
                  </div>

                  {/* Why Suitable */}
                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex items-start space-x-1.5 text-[#252525]">
                      <CheckCircle2 className="w-4 h-4 text-[#22A447] shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong>Why suitable:</strong> {alt.whySuitable}
                      </p>
                    </div>
                    <div className="flex items-start space-x-1.5 text-[#77716B]">
                      <AlertCircle className="w-4 h-4 text-[#F2B544] shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong>Limitations:</strong> {alt.limitations}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#252525]/6 flex items-center justify-between">
                  <button
                    onClick={() => handleAddToGrocery(alt)}
                    className="text-xs font-bold text-[#F58220] hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Grocery List</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('recipes')}
                    className="text-xs text-[#77716B] hover:text-[#252525] flex items-center space-x-1"
                  >
                    <span>Cook at home</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
