import { FoodAnalysisData, GeneratedRecipe, FssaiLookupResult, UserProfile } from '../types';
import { SAMPLE_PRODUCTS } from '../data/mockData';

export async function scanFoodImageOrText(params: {
  imageBase64?: string;
  mimeType?: string;
  rawText?: string;
  userProfile?: Partial<UserProfile>;
}): Promise<{ data: FoodAnalysisData; isSampleMode?: boolean; notice?: string }> {
  try {
    const res = await fetch('/api/scan-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.error || `Server error (Status ${res.status})`);
    }

    const json = await res.json();
    return {
      data: json.data,
      isSampleMode: json.isSampleMode || false,
      notice: json.notice,
    };
  } catch (err: any) {
    // If the user actually provided an image or text, throw the real error so it can be handled
    if (params.imageBase64 || params.rawText) {
      console.error('Scan API failed:', err.message);
      throw err;
    }
    console.warn('API call failed, falling back to local dataset:', err.message);
    // Return sample product for resilience only when no input was provided
    return {
      data: SAMPLE_PRODUCTS[0],
      isSampleMode: true,
      notice: 'Offline/Demo Mode: Using demonstration product analysis.',
    };
  }
}

export async function generateRecipeApi(params: {
  dietaryPreference: string;
  allergies: string[];
  goal: string;
  budgetPerMeal: number;
  servings: number;
  availableIngredients?: string;
  preferredCuisine?: string;
  maxCookingTime?: number;
  mealType?: string;
  healthConditions?: string[];
  reduceCost?: boolean;
}): Promise<{ recipe: GeneratedRecipe; isSampleMode?: boolean }> {
  try {
    const res = await fetch('/api/generate-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const json = await res.json();
    return { recipe: json.recipe, isSampleMode: json.source === 'sample-mode' };
  } catch (err: any) {
    console.warn('Recipe API error:', err.message);
    const s = params.servings || 2;
    return {
      recipe: {
        recipeName: 'Sprouted Moong & Vegetable Poha',
        tagline: 'Light, nutrient-dense breakfast rich in b-vitamins and plant fiber',
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        difficulty: 'Easy',
        servings: s,
        estimatedCostInr: 25 * s,
        estimatedCostPerServingInr: 25,
        nutritionPerServing: {
          caloriesKcal: 260,
          proteinG: 9.5,
          carbsG: 44,
          fatG: 5.0,
          fiberG: 5.5,
        },
        ingredients: [
          { name: 'Thick Poha (Flattened Rice)', quantity: `${50 * s}g`, category: 'Grains & Cereals', estimatedCostInr: 10 * s },
          { name: 'Sprouted Green Moong', quantity: `${40 * s}g`, category: 'Pulses & Legumes', estimatedCostInr: 8 * s },
          { name: 'Green Peas, Carrots & Onions', quantity: `${50 * s}g`, category: 'Vegetables & Fruits', estimatedCostInr: 5 * s },
          { name: 'Mustard Seeds, Curry Leaves & Turmeric', quantity: '1 tsp', category: 'Spices & condiments', estimatedCostInr: 2 * s },
        ],
        instructions: [
          'Wash flattened rice gently in a colander and drain completely.',
          'Steam sprouted moong and diced carrots for 5 minutes until tender-crisp.',
          'Heat oil, add mustard seeds, curry leaves, and green chillies.',
          'Add onions, turmeric, steamed moong, and soaked poha with salt.',
          'Toss gently on low flame for 3 minutes. Finish with fresh lemon juice and chopped coriander.',
        ],
        substitutions: ['Use red poha or rolled oats for lower glycemic index.'],
        storageGuidance: 'Best consumed fresh. Reheat covered with a sprinkle of water if needed.',
        nutritionNotes: 'Adding sprouted legumes to flattened rice nearly triples the bio-available protein and balances the carbohydrate load.',
      },
      isSampleMode: true,
    };
  }
}

export async function askNutritionAi(
  messages: { role: 'user' | 'model'; content: string }[],
  userProfile?: Partial<UserProfile>
): Promise<string> {
  try {
    const res = await fetch('/api/nutrition-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, userProfile }),
    });

    if (!res.ok) throw new Error('Chat API returned error');
    const json = await res.json();
    return json.reply;
  } catch (err: any) {
    return 'I am currently operating in educational assistance mode. For medical dietary management regarding diabetes, hypertension, or kidney disease, please book a consultation with our verified clinical dietitians.';
  }
}

export async function verifyFssaiNumber(licenseNumber: string): Promise<FssaiLookupResult> {
  try {
    const res = await fetch('/api/fssai-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseNumber }),
    });
    if (!res.ok) throw new Error('FSSAI lookup failed');
    return await res.json();
  } catch (err: any) {
    const clean = licenseNumber.replace(/\D/g, '');
    return {
      licenseNumber: clean,
      validFormat: clean.length === 14,
      status: clean.length === 14 ? 'Format Verified — Official Verification Required' : 'Invalid Format',
      message: clean.length === 14 ? '14 digits format standard met.' : 'FSSAI license must be 14 digits.',
      source: 'FoSCoS Regulatory Schema',
      officialPortalUrl: 'https://foscos.fssai.gov.in/',
      guidance: 'FSSAI mandates checking validity on the official portal to ensure real-time regulatory compliance.',
      lastCheckedDate: new Date().toISOString().split('T')[0],
    };
  }
}
