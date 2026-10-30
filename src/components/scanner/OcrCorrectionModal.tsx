import React, { useState } from 'react';
import { FoodAnalysisData } from '../../types';
import { X, Check, Edit3, AlertCircle } from 'lucide-react';

interface Props {
  initialData: FoodAnalysisData;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmedData: FoodAnalysisData) => void;
}

export const OcrCorrectionModal: React.FC<Props> = ({
  initialData,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [data, setData] = useState<FoodAnalysisData>(initialData);

  if (!isOpen) return null;

  const handleNutritionChange = (key: keyof typeof data.nutritionSnapshot, val: number) => {
    setData((prev) => ({
      ...prev,
      nutritionSnapshot: {
        ...prev.nutritionSnapshot,
        [key]: isNaN(val) ? 0 : val,
      },
    }));
  };

  const handleIngredientsChange = (text: string) => {
    setData((prev) => ({
      ...prev,
      ingredientsList: text.split(',').map((s) => s.trim()).filter(Boolean),
    }));
  };

  const handleClaimsChange = (text: string) => {
    setData((prev) => ({
      ...prev,
      claims: text.split(',').map((s) => s.trim()).filter(Boolean),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#252525]/12">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FFFAF5] border-b border-[#252525]/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFF0E3] text-[#F58220] flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#252525]">Review & Verify OCR Extracted Data</h3>
              <p className="text-[11px] text-[#77716B]">
                Confirm or correct extracted values before generating deep nutritional analysis
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#77716B] hover:text-[#252525]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-100 flex items-start space-x-2 text-[11px] text-amber-900 leading-tight">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            OCR accuracy depends on packaging curvature and lighting. Adjust any misread values (e.g. sodium or sugar) to guarantee evidence-based evaluation.
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Packaging details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#252525] mb-1">Product Name</label>
              <input
                type="text"
                value={data.productName}
                onChange={(e) => setData({ ...data, productName: e.target.value })}
                className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg focus:ring-1 focus:ring-[#F58220] outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#252525] mb-1">Brand</label>
              <input
                type="text"
                value={data.brand}
                onChange={(e) => setData({ ...data, brand: e.target.value })}
                className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg focus:ring-1 focus:ring-[#F58220] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#252525] mb-1">Category</label>
              <input
                type="text"
                value={data.category}
                onChange={(e) => setData({ ...data, category: e.target.value })}
                className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg focus:ring-1 focus:ring-[#F58220] outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#252525] mb-1">Serving Size</label>
              <input
                type="text"
                value={data.servingSize}
                onChange={(e) => setData({ ...data, servingSize: e.target.value })}
                placeholder="e.g. 30g, 1 piece"
                className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg focus:ring-1 focus:ring-[#F58220] outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#252525] mb-1">FSSAI License #</label>
              <input
                type="text"
                value={data.fssaiLicenseNumber}
                onChange={(e) => setData({ ...data, fssaiLicenseNumber: e.target.value })}
                placeholder="14-digit number"
                className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg focus:ring-1 focus:ring-[#F58220] outline-none font-mono"
              />
            </div>
          </div>

          {/* Net Quantity and MRP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#252525] mb-1">Net Quantity (if visible)</label>
              <input
                type="text"
                value={data.netQuantity || ''}
                onChange={(e) => setData({ ...data, netQuantity: e.target.value })}
                placeholder="e.g. 400g, 1L, 75g"
                className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg focus:ring-1 focus:ring-[#F58220] outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#252525] mb-1">MRP / Price (if visible)</label>
              <input
                type="text"
                value={data.mrp || ''}
                onChange={(e) => setData({ ...data, mrp: e.target.value })}
                placeholder="e.g. ₹45.00, Rs 20"
                className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg focus:ring-1 focus:ring-[#F58220] outline-none"
              />
            </div>
          </div>

          {/* Nutrition Numbers */}
          <div>
            <label className="block font-semibold text-[#252525] mb-1.5">
              Nutrition Values (Per Serving)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-[#FFFAF5] p-2 rounded-lg border border-[#252525]/8">
                <span className="text-[10px] text-[#77716B] block">Energy (kcal)</span>
                <input
                  type="number"
                  value={data.nutritionSnapshot.energyKcal}
                  onChange={(e) => handleNutritionChange('energyKcal', Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1 border border-[#252525]/10 rounded mt-1"
                />
              </div>

              <div className="bg-[#FFFAF5] p-2 rounded-lg border border-[#252525]/8">
                <span className="text-[10px] text-[#77716B] block">Total Fat (g)</span>
                <input
                  type="number"
                  step="0.1"
                  value={data.nutritionSnapshot.totalFatG}
                  onChange={(e) => handleNutritionChange('totalFatG', Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1 border border-[#252525]/10 rounded mt-1"
                />
              </div>

              <div className="bg-[#FFFAF5] p-2 rounded-lg border border-[#252525]/8">
                <span className="text-[10px] text-[#77716B] block">Saturated Fat (g)</span>
                <input
                  type="number"
                  step="0.1"
                  value={data.nutritionSnapshot.saturatedFatG}
                  onChange={(e) => handleNutritionChange('saturatedFatG', Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1 border border-[#252525]/10 rounded mt-1"
                />
              </div>

              <div className="bg-[#FFFAF5] p-2 rounded-lg border border-[#252525]/8">
                <span className="text-[10px] text-[#77716B] block">Carbohydrates (g)</span>
                <input
                  type="number"
                  step="0.1"
                  value={data.nutritionSnapshot.carbohydratesG}
                  onChange={(e) => handleNutritionChange('carbohydratesG', Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1 border border-[#252525]/10 rounded mt-1"
                />
              </div>

              <div className="bg-[#FFFAF5] p-2 rounded-lg border border-[#252525]/8">
                <span className="text-[10px] text-[#77716B] block">Total Sugar (g)</span>
                <input
                  type="number"
                  step="0.1"
                  value={data.nutritionSnapshot.totalSugarG}
                  onChange={(e) => handleNutritionChange('totalSugarG', Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1 border border-[#252525]/10 rounded mt-1"
                />
              </div>

              <div className="bg-[#FFFAF5] p-2 rounded-lg border border-[#252525]/8">
                <span className="text-[10px] text-[#77716B] block">Sodium (mg)</span>
                <input
                  type="number"
                  value={data.nutritionSnapshot.sodiumMg}
                  onChange={(e) => handleNutritionChange('sodiumMg', Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1 border border-[#252525]/10 rounded mt-1"
                />
              </div>

              <div className="bg-[#FFFAF5] p-2 rounded-lg border border-[#252525]/8">
                <span className="text-[10px] text-[#77716B] block">Protein (g)</span>
                <input
                  type="number"
                  step="0.1"
                  value={data.nutritionSnapshot.proteinG}
                  onChange={(e) => handleNutritionChange('proteinG', Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1 border border-[#252525]/10 rounded mt-1"
                />
              </div>

              <div className="bg-[#FFFAF5] p-2 rounded-lg border border-[#252525]/8">
                <span className="text-[10px] text-[#77716B] block">Dietary Fiber (g)</span>
                <input
                  type="number"
                  step="0.1"
                  value={data.nutritionSnapshot.dietaryFiberG || 0}
                  onChange={(e) => handleNutritionChange('dietaryFiberG', Number(e.target.value))}
                  className="w-full text-xs font-bold bg-white px-2 py-1 border border-[#252525]/10 rounded mt-1"
                />
              </div>
            </div>
          </div>

          {/* Ingredients list */}
          <div>
            <label className="block font-semibold text-[#252525] mb-1">
              Ingredients List (Comma-separated in descending order of weight)
            </label>
            <textarea
              rows={3}
              value={data.ingredientsList.join(', ')}
              onChange={(e) => handleIngredientsChange(e.target.value)}
              className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg focus:ring-1 focus:ring-[#F58220] outline-none text-xs bg-[#FFFAF5]"
            />
          </div>

          {/* Marketing Claims */}
          <div>
            <label className="block font-semibold text-[#252525] mb-1">
              Product Marketing Claims to Verify (Comma-separated)
            </label>
            <input
              type="text"
              value={data.claims.join(', ')}
              onChange={(e) => handleClaimsChange(e.target.value)}
              placeholder="e.g. Zero Trans Fat, High Protein, No Added Sugar"
              className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg focus:ring-1 focus:ring-[#F58220] outline-none bg-[#FFFAF5]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FFFAF5] border-t border-[#252525]/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#252525]/15 text-[#252525] rounded-lg text-xs font-semibold hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(data)}
            className="px-5 py-2.5 bg-[#F58220] text-white rounded-lg text-xs font-bold hover:bg-[#e07114] flex items-center space-x-1.5 shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Generate Verified Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
