import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MealPlanDay } from '../../types';
import { BackButton } from '../common/BackButton';
import {
  Calendar,
  Utensils,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Info,
  DollarSign,
  Flame,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const MealPlannerView: React.FC = () => {
  const { weeklyMealPlan, replaceMealInPlan, addIngredientsToGroceryList, setActiveTab, user } = useApp();
  const [selectedDay, setSelectedDay] = useState<MealPlanDay['dayName']>('Monday');
  const [addedGroceryFeedback, setAddedGroceryFeedback] = useState(false);

  const activeDayPlan = weeklyMealPlan.find((d) => d.dayName === selectedDay) || weeklyMealPlan[0];

  const totalWeeklyCost = weeklyMealPlan.reduce(
    (acc, d) =>
      acc + (d.breakfast.cost + d.lunch.cost + d.dinner.cost + d.snack.cost),
    0
  );

  const dayTotalCalories =
    activeDayPlan.breakfast.calories +
    activeDayPlan.lunch.calories +
    activeDayPlan.dinner.calories +
    activeDayPlan.snack.calories;

  const dayTotalProtein =
    activeDayPlan.breakfast.protein +
    activeDayPlan.lunch.protein +
    activeDayPlan.dinner.protein +
    activeDayPlan.snack.protein;

  const handleSwapMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const alternateMeals = [
      { name: 'Moong Dal & Palak Chilla', calories: 290, protein: 13.5, cost: 35 },
      { name: 'Sprouted Methi Khichdi with Curd', calories: 340, protein: 12.0, cost: 40 },
      { name: 'Ragi Roti with Paneer Bhurji', calories: 380, protein: 17.0, cost: 55 },
      { name: 'Roasted Spiced Foxnuts & Green Tea', calories: 105, protein: 3.0, cost: 20 },
      { name: 'Steamed Idlis with Vegetable Sambar', calories: 310, protein: 10.0, cost: 35 },
      { name: 'Oats & Sprouted Moong Upma', calories: 280, protein: 9.0, cost: 30 },
    ];
    const picked = alternateMeals[Math.floor(Math.random() * alternateMeals.length)];
    replaceMealInPlan(selectedDay, mealType, picked);
  };

  const handleAddWeekToGrocery = () => {
    const weeklyEssentials = [
      { name: 'Stoneground Whole Wheat Atta', quantity: '2 kg', category: 'Grains & Cereals', estimatedCostInr: 90 },
      { name: 'Foxtail Millet & Brown Rice', quantity: '1 kg', category: 'Grains & Cereals', estimatedCostInr: 85 },
      { name: 'Whole Sprouted Green Moong', quantity: '1 kg', category: 'Pulses & Legumes', estimatedCostInr: 150 },
      { name: 'Toor & Masoor Dal', quantity: '1 kg', category: 'Pulses & Legumes', estimatedCostInr: 140 },
      { name: 'Fresh Paneer / Low-Fat Tofu', quantity: '600 g', category: 'Dairy or alternatives', estimatedCostInr: 195 },
      { name: 'Cow Curd / Natural Dahi', quantity: '1.5 kg', category: 'Dairy or alternatives', estimatedCostInr: 105 },
      { name: 'Assorted Seasonal Sabzi (Spinach, Bottle Gourd, Carrots)', quantity: '3 kg', category: 'Vegetables & Fruits', estimatedCostInr: 160 },
      { name: 'Raw Foxnuts (Makhana) & Roasted Chana', quantity: '250 g', category: 'Other essentials', estimatedCostInr: 110 },
    ];

    addIngredientsToGroceryList(weeklyEssentials, `Weekly Meal Plan (${user?.dietaryPreference || 'Indian Homestyle'})`);
    setAddedGroceryFeedback(true);
    setTimeout(() => setAddedGroceryFeedback(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Back Button */}
      <BackButton fallbackTab="recipes" label="Back to Recipes" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-[#FFF0E3] text-[#F58220] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#F58220]" />
            <span>Weekly Nutrition Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
            Personalized Indian Meal Planner
          </h1>
          <p className="text-xs sm:text-sm text-[#77716B] mt-0.5">
            Balanced weekly menus matching your dietary lifestyle ({user?.dietaryPreference || 'Vegetarian'}) with predictable grocery cost.
          </p>
        </div>

        <button
          onClick={handleAddWeekToGrocery}
          className="px-4 py-2.5 bg-[#F58220] hover:bg-[#e07114] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors self-start sm:self-auto active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {addedGroceryFeedback ? 'Added to Grocery List!' : 'Add Week to Grocery List'}
          </span>
        </button>
      </div>

      {/* Clinical Disclaimer Notice */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Important Clinical Nutrition Notice:</strong> This meal plan offers general nutritional guidance grounded in ICMR-NIN dietary standards. If you manage medical conditions like Type 2 Diabetes, Hypertension, PCOS, or Chronic Kidney Disease, personalized clinical medical nutrition therapy must be supervised by a licensed dietitian.
        </div>
      </div>

      {/* Week Cost Summary Card */}
      <div className="bg-gradient-to-br from-[#252525] to-[#38332E] text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#FFD2AC] uppercase tracking-wider font-bold">
            Estimated Weekly Grocery Cost
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5 text-[#FFAB66]">
            ₹{totalWeeklyCost}
          </div>
          <p className="text-xs text-white/80">
            Average ₹{(totalWeeklyCost / 7).toFixed(0)} per day for {user?.preferredServings || 2} persons
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-xs border border-white/10">
          <div>
            <span className="text-[10px] text-[#FFD2AC] block font-medium">Selected Day Balance</span>
            <span className="text-sm font-bold text-white">
              {dayTotalCalories} kcal • {dayTotalProtein.toFixed(1)}g Protein
            </span>
          </div>
        </div>
      </div>

      {/* Days Selector Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-[#252525]/8">
        {weeklyMealPlan.map((d) => (
          <button
            key={d.dayName}
            onClick={() => setSelectedDay(d.dayName)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDay === d.dayName
                ? 'bg-[#F58220] text-white shadow-xs'
                : 'bg-white text-[#77716B] hover:text-[#252525] border border-[#252525]/10'
            }`}
          >
            {d.dayName}
          </button>
        ))}
      </div>

      {/* Active Day Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Breakfast */}
        <div className="spotlight-card rounded-2xl p-5 border border-[#252525]/10 shadow-xs flex flex-col justify-between space-y-4 bg-white">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F58220] bg-[#FFF0E3] px-2 py-0.5 rounded">
                Breakfast (Morning)
              </span>
              <span className="text-xs font-mono font-bold text-[#252525]">
                ₹{activeDayPlan.breakfast.cost}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#252525] mt-3 leading-snug">
              {activeDayPlan.breakfast.name}
            </h3>
            <div className="mt-2 text-xs text-[#77716B] flex items-center space-x-2">
              <span>{activeDayPlan.breakfast.calories} kcal</span>
              <span>•</span>
              <span className="text-[#22A447] font-semibold">
                {activeDayPlan.breakfast.protein}g protein
              </span>
            </div>
          </div>
          <button
            onClick={() => handleSwapMeal('breakfast')}
            className="w-full py-1.5 border border-[#252525]/15 hover:bg-[#FFFAF5] hover:text-[#F58220] text-[#252525] text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-[#77716B]" />
            <span>Swap Breakfast</span>
          </button>
        </div>

        {/* Lunch */}
        <div className="spotlight-card rounded-2xl p-5 border border-[#252525]/10 shadow-xs flex flex-col justify-between space-y-4 bg-white">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F58220] bg-[#FFF0E3] px-2 py-0.5 rounded">
                Lunch (Mid-day)
              </span>
              <span className="text-xs font-mono font-bold text-[#252525]">
                ₹{activeDayPlan.lunch.cost}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#252525] mt-3 leading-snug">
              {activeDayPlan.lunch.name}
            </h3>
            <div className="mt-2 text-xs text-[#77716B] flex items-center space-x-2">
              <span>{activeDayPlan.lunch.calories} kcal</span>
              <span>•</span>
              <span className="text-[#22A447] font-semibold">
                {activeDayPlan.lunch.protein}g protein
              </span>
            </div>
          </div>
          <button
            onClick={() => handleSwapMeal('lunch')}
            className="w-full py-1.5 border border-[#252525]/15 hover:bg-[#FFFAF5] hover:text-[#F58220] text-[#252525] text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-[#77716B]" />
            <span>Swap Lunch</span>
          </button>
        </div>

        {/* Evening Snack */}
        <div className="spotlight-card rounded-2xl p-5 border border-[#252525]/10 shadow-xs flex flex-col justify-between space-y-4 bg-white">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F58220] bg-[#FFF0E3] px-2 py-0.5 rounded">
                4 PM Healthy Snack
              </span>
              <span className="text-xs font-mono font-bold text-[#252525]">
                ₹{activeDayPlan.snack.cost}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#252525] mt-3 leading-snug">
              {activeDayPlan.snack.name}
            </h3>
            <div className="mt-2 text-xs text-[#77716B] flex items-center space-x-2">
              <span>{activeDayPlan.snack.calories} kcal</span>
              <span>•</span>
              <span className="text-[#22A447] font-semibold">
                {activeDayPlan.snack.protein}g protein
              </span>
            </div>
          </div>
          <button
            onClick={() => handleSwapMeal('snack')}
            className="w-full py-1.5 border border-[#252525]/15 hover:bg-[#FFFAF5] hover:text-[#F58220] text-[#252525] text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-[#77716B]" />
            <span>Swap Snack</span>
          </button>
        </div>

        {/* Dinner */}
        <div className="spotlight-card rounded-2xl p-5 border border-[#252525]/10 shadow-xs flex flex-col justify-between space-y-4 bg-white">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F58220] bg-[#FFF0E3] px-2 py-0.5 rounded">
                Dinner (Night)
              </span>
              <span className="text-xs font-mono font-bold text-[#252525]">
                ₹{activeDayPlan.dinner.cost}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#252525] mt-3 leading-snug">
              {activeDayPlan.dinner.name}
            </h3>
            <div className="mt-2 text-xs text-[#77716B] flex items-center space-x-2">
              <span>{activeDayPlan.dinner.calories} kcal</span>
              <span>•</span>
              <span className="text-[#22A447] font-semibold">
                {activeDayPlan.dinner.protein}g protein
              </span>
            </div>
          </div>
          <button
            onClick={() => handleSwapMeal('dinner')}
            className="w-full py-1.5 border border-[#252525]/15 hover:bg-[#FFFAF5] hover:text-[#F58220] text-[#252525] text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-[#77716B]" />
            <span>Swap Dinner</span>
          </button>
        </div>
      </div>
    </div>
  );
};
