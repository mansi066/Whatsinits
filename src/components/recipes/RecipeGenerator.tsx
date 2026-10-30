import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateRecipeApi } from '../../services/api';
import { GeneratedRecipe, DietaryPreference, WellnessGoal } from '../../types';
import { BackButton } from '../common/BackButton';
import {
  Utensils,
  Sparkles,
  Clock,
  Users,
  DollarSign,
  Plus,
  Minus,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  TrendingDown,
  ChefHat,
  Flame,
} from 'lucide-react';

export const RecipeGenerator: React.FC = () => {
  const { user, addIngredientsToGroceryList, setActiveTab } = useApp();

  // Generator inputs
  const [dietaryPref, setDietaryPref] = useState<DietaryPreference>(user?.dietaryPreference || 'Vegetarian');
  const [mealType, setMealType] = useState('Lunch / Dinner');
  const [servings, setServings] = useState(user?.preferredServings || 2);
  const [budgetPerMeal, setBudgetPerMeal] = useState(user?.budgetPerMealInr || 100);
  const [maxCookingTime, setMaxCookingTime] = useState(30);
  const [preferredCuisine, setPreferredCuisine] = useState('Indian Homestyle');
  const [availableIngredients, setAvailableIngredients] = useState('Sprouted moong, spinach (palak), brown rice, tomatoes');
  const [allergies, setAllergies] = useState<string[]>(user?.allergies || []);
  const [healthConditions, setHealthConditions] = useState<string[]>(user?.healthConditions || []);
  const [goal, setGoal] = useState<WellnessGoal>(user?.goal || 'General Wellness');

  // Loading & Result
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [addedGrocerySuccess, setAddedGrocerySuccess] = useState(false);

  // Dynamic serving adjustment factor relative to initial generated servings
  const [baseServings, setBaseServings] = useState(2);
  const [currentServings, setCurrentServings] = useState(2);

  const handleGenerate = async (reduceCostMode = false) => {
    setLoading(true);
    setAddedGrocerySuccess(false);

    try {
      const res = await generateRecipeApi({
        dietaryPreference: dietaryPref,
        allergies,
        goal,
        budgetPerMeal,
        servings,
        availableIngredients,
        preferredCuisine,
        maxCookingTime,
        mealType,
        healthConditions,
        reduceCost: reduceCostMode,
      });

      setRecipe(res.recipe);
      setBaseServings(res.recipe.servings || servings);
      setCurrentServings(res.recipe.servings || servings);
    } catch (err) {
      console.error(err);
      alert('Could not generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleServingChange = (newCount: number) => {
    if (newCount < 1 || newCount > 12) return;
    setCurrentServings(newCount);
  };

  const scaleFactor = recipe ? currentServings / baseServings : 1;

  const getScaledQuantity = (qtyStr: string): string => {
    return qtyStr.replace(/([\d.]+)/g, (match) => {
      const num = parseFloat(match);
      if (isNaN(num)) return match;
      const scaled = num * scaleFactor;
      return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1);
    });
  };

  const handleAddGrocery = () => {
    if (!recipe) return;
    const scaledIngredients = recipe.ingredients.map((ing) => ({
      name: ing.name,
      quantity: getScaledQuantity(ing.quantity),
      category: ing.category,
      estimatedCostInr: Math.round(ing.estimatedCostInr * scaleFactor),
    }));

    addIngredientsToGroceryList(scaledIngredients, recipe.recipeName);
    setAddedGrocerySuccess(true);
    setTimeout(() => setAddedGrocerySuccess(false), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Back Button */}
      <BackButton fallbackTab="home" label="Back to Home" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 bg-[#FFF0E3] text-[#F58220] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <ChefHat className="w-3.5 h-3.5 text-[#F58220]" />
          <span>Nutritional Culinary AI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
          Personalized AI Recipe Generator
        </h1>
        <p className="text-xs sm:text-sm text-[#77716B] mt-1">
          Turn pantry ingredients into authentic, macro-balanced Indian meals with dynamic serving recalculation and automatic grocery sync.
        </p>
      </div>

      {/* Inputs Form */}
      <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-7 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Meal Type */}
          <div>
            <label className="block font-semibold text-[#252525] mb-1">Meal Required</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg bg-[#FFFAF5] outline-none focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch / Dinner">Lunch / Dinner</option>
              <option value="Evening Healthy Snack">Evening Healthy Snack</option>
              <option value="Post-Workout Meal">Post-Workout Meal</option>
            </select>
          </div>

          {/* Dietary Preference */}
          <div>
            <label className="block font-semibold text-[#252525] mb-1">Dietary Preference</label>
            <select
              value={dietaryPref}
              onChange={(e) => setDietaryPref(e.target.value as DietaryPreference)}
              className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg bg-[#FFFAF5] outline-none focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Egg-based">Egg-based</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Jain">Jain (No onion/garlic/root veg)</option>
            </select>
          </div>

          {/* Number of Servings */}
          <div>
            <label className="block font-semibold text-[#252525] mb-1">Initial Servings</label>
            <select
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg bg-[#FFFAF5] outline-none focus:ring-1 focus:ring-[#F58220]"
            >
              {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'person' : 'people'}
                </option>
              ))}
            </select>
          </div>

          {/* Cooking Time */}
          <div>
            <label className="block font-semibold text-[#252525] mb-1">Max Cooking Time</label>
            <select
              value={maxCookingTime}
              onChange={(e) => setMaxCookingTime(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg bg-[#FFFAF5] outline-none focus:ring-1 focus:ring-[#F58220]"
            >
              <option value={15}>15 mins (Quick)</option>
              <option value={30}>30 mins (Standard)</option>
              <option value={45}>45 mins (Homestyle)</option>
              <option value={60}>60 mins (Elaborate)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mt-4">
          {/* Target Goal */}
          <div>
            <label className="block font-semibold text-[#252525] mb-1">Nutritional Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as WellnessGoal)}
              className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg bg-[#FFFAF5] outline-none focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="General Wellness">General Wellness</option>
              <option value="Weight Management">Weight Management</option>
              <option value="Muscle Gain">Muscle Gain (High Protein)</option>
              <option value="Heart & BP Health">Low Sodium / Heart Health</option>
              <option value="Blood Sugar Management">Low Glycemic (Diabetes Care)</option>
              <option value="Student / Budget Health">Budget / Pocket-friendly</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block font-semibold text-[#252525] mb-1">
              Budget Per Meal (₹ Total)
            </label>
            <input
              type="number"
              value={budgetPerMeal}
              onChange={(e) => setBudgetPerMeal(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg bg-[#FFFAF5] outline-none focus:ring-1 focus:ring-[#F58220]"
              placeholder="e.g. 100"
            />
          </div>

          {/* Preferred Cuisine */}
          <div>
            <label className="block font-semibold text-[#252525] mb-1">Preferred Cuisine</label>
            <input
              type="text"
              value={preferredCuisine}
              onChange={(e) => setPreferredCuisine(e.target.value)}
              className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg bg-[#FFFAF5] outline-none focus:ring-1 focus:ring-[#F58220]"
              placeholder="e.g. Indian Homestyle, South Indian, Maharashtrian"
            />
          </div>
        </div>

        {/* Available Ingredients */}
        <div className="mt-4 text-xs">
          <label className="block font-semibold text-[#252525] mb-1">
            Available Ingredients in Your Kitchen / Pantry
          </label>
          <input
            type="text"
            value={availableIngredients}
            onChange={(e) => setAvailableIngredients(e.target.value)}
            className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg bg-[#FFFAF5] outline-none focus:ring-1 focus:ring-[#F58220]"
            placeholder="e.g. Sprouted moong, palak, atta, paneer, tomatoes, mustard seeds"
          />
        </div>

        {/* Generate Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#252525]/8">
          <p className="text-[11px] text-[#77716B]">
            Ingredients and nutritional values are scaled to your exact serving count.
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleGenerate(true)}
              disabled={loading}
              className="px-4 py-2 border border-[#F58220]/40 text-[#F58220] hover:bg-[#FFF0E3] text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Prioritize Low Cost</span>
            </button>
            <button
              onClick={() => handleGenerate(false)}
              disabled={loading}
              className="px-5 py-2.5 bg-[#F58220] hover:bg-[#e07114] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-xs transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Recipe...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Personalized Recipe</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Recipe Presentation */}
      {recipe && (
        <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-6 sm:p-8 space-y-6 bg-white animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#252525]/8">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="text-[10px] font-bold bg-[#FFF0E3] text-[#F58220] px-2 py-0.5 rounded">
                  {recipe.difficulty} Level
                </span>
                <span className="text-[10px] text-[#77716B] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-[#77716B]" />
                  <span>
                    Prep: {recipe.prepTimeMinutes}m • Cook: {recipe.cookTimeMinutes}m
                  </span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#252525] tracking-tight">
                {recipe.recipeName}
              </h2>
              <p className="text-xs text-[#77716B] mt-0.5 leading-relaxed">{recipe.tagline}</p>
            </div>

            {/* Dynamic Servings Adjuster Bar */}
            <div className="bg-[#FFFAF5] p-3 rounded-xl border border-[#252525]/10 flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#77716B] mb-1">
                Servings Recalculator
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleServingChange(currentServings - 1)}
                  disabled={currentServings <= 1}
                  className="w-7 h-7 rounded-lg bg-white border border-[#252525]/15 hover:bg-[#FFF0E3] disabled:opacity-40 flex items-center justify-center text-xs font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-extrabold text-[#F58220] min-w-[50px] text-center">
                  {currentServings} {currentServings === 1 ? 'serving' : 'servings'}
                </span>
                <button
                  onClick={() => handleServingChange(currentServings + 1)}
                  disabled={currentServings >= 12}
                  className="w-7 h-7 rounded-lg bg-white border border-[#252525]/15 hover:bg-[#FFF0E3] disabled:opacity-40 flex items-center justify-center text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {currentServings !== baseServings && (
                <span className="text-[9px] text-[#F58220] font-semibold mt-1">
                  Quantities scaled {scaleFactor.toFixed(1)}x
                </span>
              )}
            </div>
          </div>

          {/* Cost & Macros Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="p-3 bg-[#FFFAF5] rounded-xl border border-[#252525]/8">
              <span className="text-[10px] text-[#77716B] block font-medium">Estimated Cost</span>
              <span className="text-sm font-extrabold text-[#F58220]">
                ₹{Math.round(recipe.estimatedCostInr * scaleFactor)}
              </span>
              <span className="text-[9px] text-[#77716B] block">
                (₹{recipe.estimatedCostPerServingInr}/serving)
              </span>
            </div>

            <div className="p-3 bg-[#FFFAF5] rounded-xl border border-[#252525]/8">
              <span className="text-[10px] text-[#77716B] block font-medium">Calories / serving</span>
              <span className="text-sm font-extrabold text-[#252525]">
                {recipe.nutritionPerServing.caloriesKcal} kcal
              </span>
            </div>

            <div className="p-3 bg-[#FFFAF5] rounded-xl border border-[#252525]/8">
              <span className="text-[10px] text-[#77716B] block font-medium">Protein / serving</span>
              <span className="text-sm font-extrabold text-[#22A447]">
                {recipe.nutritionPerServing.proteinG}g
              </span>
            </div>

            <div className="p-3 bg-[#FFFAF5] rounded-xl border border-[#252525]/8">
              <span className="text-[10px] text-[#77716B] block font-medium">Carbohydrates</span>
              <span className="text-sm font-extrabold text-[#252525]">
                {recipe.nutritionPerServing.carbsG}g
              </span>
            </div>

            <div className="p-3 bg-[#FFFAF5] rounded-xl border border-[#252525]/8">
              <span className="text-[10px] text-[#77716B] block font-medium">Dietary Fiber</span>
              <span className="text-sm font-extrabold text-[#252525]">
                {recipe.nutritionPerServing.fiberG}g
              </span>
            </div>
          </div>

          {/* Ingredients & Cooking Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Ingredients Col */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                  Ingredients ({currentServings} Servings)
                </h3>
                <span className="text-[10px] text-[#77716B]">Dynamic amounts</span>
              </div>
              <ul className="space-y-2 text-xs">
                {recipe.ingredients.map((ing, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 bg-[#FFFAF5] rounded-lg border border-[#252525]/6 flex items-start justify-between"
                  >
                    <div>
                      <span className="font-semibold text-[#252525] block">{ing.name}</span>
                      <span className="text-[10px] text-[#77716B]">{ing.category}</span>
                    </div>
                    <span className="font-mono font-bold text-[#F58220] text-xs">
                      {getScaledQuantity(ing.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                Step-by-Step Cooking Instructions
              </h3>
              <ol className="space-y-2.5 text-xs text-[#252525]">
                {recipe.instructions.map((step, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-[#FFFAF5] rounded-xl border border-[#252525]/6 flex items-start space-x-3 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#F58220] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              {/* Substitutions & Storage */}
              <div className="mt-4 pt-4 border-t border-[#252525]/8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-[#252525]/8">
                  <h4 className="font-semibold text-[#252525] mb-1">Substitutions</h4>
                  <ul className="list-disc list-inside text-[11px] text-[#77716B] space-y-0.5">
                    {recipe.substitutions.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#252525]/8">
                  <h4 className="font-semibold text-[#252525] mb-1">Storage Guidance</h4>
                  <p className="text-[11px] text-[#77716B] leading-relaxed">
                    {recipe.storageGuidance}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-[#252525]/8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleAddGrocery}
                className="px-4 py-2 bg-[#F58220] hover:bg-[#e07114] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {addedGrocerySuccess
                    ? 'Added to Grocery List!'
                    : `Add Ingredients to Grocery List (${currentServings} Servings)`}
                </span>
              </button>

              <button
                onClick={() => handleGenerate(false)}
                className="px-3.5 py-2 border border-[#252525]/15 hover:bg-[#FFFAF5] text-[#252525] text-xs font-semibold rounded-xl flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate Another Recipe</span>
              </button>

              <button
                onClick={() => handleGenerate(true)}
                className="px-3.5 py-2 border border-[#F58220]/40 bg-[#FFF0E3] text-[#F58220] hover:bg-[#ffdcc1] text-xs font-bold rounded-xl flex items-center space-x-1"
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Reduce Cost</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('grocery')}
              className="text-xs text-[#F58220] font-bold hover:underline flex items-center space-x-1"
            >
              <span>View Master Grocery List</span>
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
