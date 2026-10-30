import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DietaryPreference, WellnessGoal } from '../../types';
import { User, ShieldCheck, Check, Save, Lock, AlertCircle } from 'lucide-react';
import { BackButton } from '../common/BackButton';

export const UserProfileSettings: React.FC = () => {
  const { user, updateUserProfile } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(user?.dietaryPreference || 'Vegetarian');
  const [goal, setGoal] = useState<WellnessGoal>(user?.goal || 'General Wellness');
  const [budget, setBudget] = useState(user?.budgetPerMealInr || 120);
  const [servings, setServings] = useState(user?.preferredServings || 2);
  const [allergiesText, setAllergiesText] = useState((user?.allergies || []).join(', '));
  const [healthConditionsText, setHealthConditionsText] = useState((user?.healthConditions || []).join(', '));
  const [consent, setConsent] = useState(user?.consentProvided ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      dietaryPreference,
      goal,
      budgetPerMealInr: Number(budget) || 120,
      preferredServings: Number(servings) || 2,
      allergies: allergiesText.split(',').map((s) => s.trim()).filter(Boolean),
      healthConditions: healthConditionsText.split(',').map((s) => s.trim()).filter(Boolean),
      consentProvided: consent,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Back Button Navigation */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="dashboard" label="Back to Dashboard" />
      </div>

      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-1.5 bg-[#FFF0E3] text-[#F58220] px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-2 border border-[#FFAB66]/30">
          <User className="w-3.5 h-3.5" />
          <span>Personal Dietary Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
          Profile & Health Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#77716B] mt-1">
          These settings power your personalized food scan insights, sodium warnings, allergen flags, and dynamic AI recipe recalculations.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-[#EAF8EE] text-[#22A447] text-xs font-bold rounded-xl border border-[#22A447]/30 flex items-center space-x-2.5 shadow-xs">
          <Check className="w-4 h-4 text-[#22A447] shrink-0" />
          <span>Your dietary profile preferences have been updated successfully!</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#252525]/10 p-6 sm:p-8 spotlight-card">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#252525] mb-1.5">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#252525]/15 rounded-xl outline-none focus:ring-2 focus:ring-[#F58220] focus:border-[#F58220] transition-all bg-[#FFFAF5]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#252525] mb-1.5">Account Email</label>
              <input
                type="email"
                disabled
                value={user?.email || 'user@whatsinit.health'}
                className="w-full px-3.5 py-2.5 border border-[#252525]/10 rounded-xl bg-slate-50 text-[#77716B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#252525] mb-1.5">Dietary Preference</label>
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
                className="w-full px-3.5 py-2.5 border border-[#252525]/15 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#F58220]"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Egg-based">Egg-based</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Jain">Jain (No root vegetables, onion, garlic)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#252525] mb-1.5">Primary Nutritional Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as WellnessGoal)}
                className="w-full px-3.5 py-2.5 border border-[#252525]/15 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#F58220]"
              >
                <option value="General Wellness">General Wellness</option>
                <option value="Weight Management">Weight Management</option>
                <option value="Muscle Gain">Muscle Gain (High Protein)</option>
                <option value="Heart & BP Health">Heart & BP Health (Low Sodium)</option>
                <option value="Blood Sugar Management">Blood Sugar Management</option>
                <option value="Student / Budget Health">Student / Budget Health</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#252525] mb-1.5">
                Typical Budget Per Meal (₹)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-[#252525]/15 rounded-xl outline-none focus:ring-2 focus:ring-[#F58220]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#252525] mb-1.5">
                Default Servings Count for Recipes
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-[#252525]/15 rounded-xl outline-none focus:ring-2 focus:ring-[#F58220]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#252525] mb-1.5">
              Food Allergies & Intolerances (Comma-separated)
            </label>
            <input
              type="text"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              placeholder="e.g. Peanuts, Gluten (Wheat), Cow Milk, Soy, Shellfish"
              className="w-full px-3.5 py-2.5 border border-[#252525]/15 rounded-xl outline-none focus:ring-2 focus:ring-[#F58220] bg-[#FFFAF5]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#252525] mb-1.5">
              Voluntary Health Information for Label Highlighting (Optional)
            </label>
            <input
              type="text"
              value={healthConditionsText}
              onChange={(e) => setHealthConditionsText(e.target.value)}
              placeholder="e.g. Pre-diabetes, High Blood Pressure, PCOS, High Triglycerides"
              className="w-full px-3.5 py-2.5 border border-[#252525]/15 rounded-xl outline-none focus:ring-2 focus:ring-[#F58220] bg-[#FFFAF5]"
            />
            <p className="text-[11px] text-[#77716B] mt-1.5">
              Used strictly to tailor cautionary alerts (e.g. flagging sodium for BP or added sugar for diabetes). Never shared publicly.
            </p>
          </div>

          {/* Privacy Consent Box */}
          <div className="p-4 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 flex items-start space-x-3">
            <input
              type="checkbox"
              id="consent-check"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 rounded text-[#F58220] focus:ring-[#F58220] accent-[#F58220]"
            />
            <label htmlFor="consent-check" className="text-xs text-[#252525] leading-relaxed cursor-pointer">
              <strong>Health Privacy Consent:</strong> I voluntarily share this optional health information exclusively to customize packaged food warnings and ingredient flags.
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#F58220] hover:bg-[#e07116] text-white font-bold rounded-xl shadow-md shadow-[#F58220]/20 flex items-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
