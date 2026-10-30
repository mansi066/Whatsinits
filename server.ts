import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON with increased limit for base64 image uploads
app.use(express.json({ limit: '20mb' }));

// Initialize GoogleGenAI SDK safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// FSSAI State Code Mapping for realistic validation of 14-digit FSSAI licenses
const FSSAI_STATE_CODES: Record<string, string> = {
  '10': 'Delhi',
  '11': 'Haryana',
  '12': 'Punjab',
  '13': 'Himachal Pradesh',
  '14': 'Jammu & Kashmir',
  '15': 'Uttarakhand',
  '20': 'Uttar Pradesh',
  '21': 'Rajasthan',
  '22': 'Gujarat',
  '23': 'Madhya Pradesh',
  '24': 'Chhattisgarh',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh',
  '29': 'Karnataka',
  '30': 'Goa',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '36': 'Telangana',
  '19': 'West Bengal',
  '25': 'Bihar',
  '26': 'Jharkhand',
  '18': 'Assam',
  '00': 'Central Licensing',
  '01': 'Central Licensing Authority',
};

// --- FSSAI Verification Endpoint ---
app.post('/api/fssai-lookup', (req, res) => {
  try {
    const { licenseNumber } = req.body;
    if (!licenseNumber || typeof licenseNumber !== 'string') {
      return res.status(400).json({ error: 'License number is required' });
    }

    const cleanNum = licenseNumber.replace(/\D/g, '');
    const officialPortalUrl = `https://foscos.fssai.gov.in/`;

    if (cleanNum.length !== 14) {
      return res.json({
        licenseNumber: cleanNum,
        validFormat: false,
        status: 'Invalid Format',
        message: 'A valid FSSAI license / registration must be exactly 14 numerical digits.',
        officialPortalUrl,
        lastCheckedDate: new Date().toISOString().split('T')[0],
      });
    }

    // FSSAI 14-digit anatomy:
    // Digit 1: 1 = License, 2 = Registration
    // Digits 2-3: State Code
    // Digits 4-5: Year of issue / enrollment
    // Digits 6-8: Authority code
    // Digits 9-14: Serial number
    const typeCode = cleanNum[0];
    const stateCode = cleanNum.substring(1, 3);
    const yearCode = cleanNum.substring(3, 5);
    const authorityCode = cleanNum.substring(5, 8);
    const serialNumber = cleanNum.substring(8, 14);

    const typeDesc = typeCode === '1' ? 'Food Business License' : 'Registration Certificate';
    const stateName = FSSAI_STATE_CODES[stateCode] || `State Jurisdiction (Code ${stateCode})`;
    const approxYear = parseInt(yearCode, 10) > 50 ? `19${yearCode}` : `20${yearCode}`;

    return res.json({
      licenseNumber: cleanNum,
      validFormat: true,
      status: 'Format Verified — Official Verification Required',
      details: {
        category: typeDesc,
        jurisdiction: stateName,
        enrolledYear: approxYear,
        authorityCode,
        serialNumber,
      },
      source: 'FoSCoS Regulatory Schema Specification (FSSAI)',
      officialPortalUrl,
      guidance: 'FSSAI mandates verifying active validity directly on the official FoSCoS portal to prevent unauthorized tampering.',
      lastCheckedDate: new Date().toISOString().split('T')[0],
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error checking FSSAI license' });
  }
});

// --- Robust JSON Sanitizer ---
function sanitizeAndParseJson<T = any>(rawText: string): T {
  let cleaned = rawText.trim();
  // Strip markdown code fences if present
  const markdownMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch) {
    cleaned = markdownMatch[1].trim();
  }
  // Find first { or [ and last } or ]
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

// --- Multi-Model Resilient Content Generation with Fallback ---
async function generateMultimodalWithFallback(
  aiClient: GoogleGenAI,
  parts: any[],
  temperature = 0.2
): Promise<{ text: string; modelUsed: string }> {
  // Primary model is fast and highly available; secondary models act as fallbacks if primary suffers transient 503/429
  const candidateModels = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      console.log(`[WhatsInit AI] Attempting food vision inference with model: ${model}`);
      const response = await aiClient.models.generateContent({
        model,
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          temperature,
        },
      });

      if (response && response.text) {
        console.log(`[WhatsInit AI] Success with model: ${model}`);
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      console.warn(`[WhatsInit AI] Model ${model} failed or returned error:`, err?.message || err);
      lastError = err;
      // Brief pause before trying fallback model
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw lastError || new Error('All multimodal vision models failed to respond.');
}

// --- Food Scan / Label Analysis Endpoint ---
app.post('/api/scan-food', async (req, res) => {
  try {
    const { imageBase64, mimeType, userProfile, rawText } = req.body;

    if (!imageBase64 && !rawText) {
      return res.status(400).json({ error: 'Either a food package image or label text must be provided.' });
    }

    // If Gemini API is available, perform multimodal vision or text analysis
    if (ai) {
      const prompt = `
You are WhatsInit's senior clinical food and nutrition analyst and OCR computer vision engine specializing in Indian and global packaged food products and FSSAI regulations.

Analyze the attached packaged food image or text with maximum precision.
This system supports ANY packaged food item, including:
- Bread packets (White, Brown, 100% Whole Wheat, Multigrain, Pav)
- Ketchup & sauce bottles (Tomato Ketchup, Chilli Sauce, Mayonnaise)
- Biscuits and cookies (Glucose, Marie, Digestive, Cream biscuits)
- Chips, crisps, and Indian namkeen (Kurkure, Bhujia, Sev, Potato chips)
- Packaged fruit juices, drinks, and nectars
- Instant noodles and ready-to-eat pasta
- Cooking oils, mustard oil, and ghee
- Spices, turmeric, chili powders, and spice mixes
- Packaged dairy products (Milk pouches, paneer, curd/dahi, butter, cheese)
- Chocolates, breakfast cereals, protein bars, and health beverages.

INSTRUCTIONS FOR MULTIMODAL EXTRACTION:
1. Examine all visible packaging: front branding, back labels, nutrition panels, ingredient lists, Net Wt, dates, MRP, and FSSAI license.
2. Read text at any angle, curvature, or lighting condition (glossy reflections, wrinkles, curved bottles).
3. If text is in Hindi or bilingual (English + Hindi), interpret both accurately.
4. If BOTH the image text is completely blurry or unreadable AND no user label text is provided, OR if the image is an arbitrary non-food object, set "isUnclearImage": true and describe in "unclearReason" what the user should capture (e.g., "Please capture a clear, well-lit photo of the ingredients list or nutrition table on the back of the packet."). If either readable packaging is in the image OR user text is provided, set "isUnclearImage": false and perform full extraction.
5. DO NOT invent missing nutrition values. If a nutrient is not shown on the package, indicate reasonable benchmark estimates in numbers when possible.

User context (if provided):
- Dietary Preference: ${userProfile?.dietaryPreference || 'Not specified'}
- Allergies: ${(userProfile?.allergies || []).join(', ') || 'None declared'}
- Health Conditions: ${(userProfile?.healthConditions || []).join(', ') || 'None declared'}
- Fitness / Dietary Goal: ${userProfile?.goal || 'General health'}
- Age Range: ${userProfile?.ageRange || 'Adult'}

Extract and structure your analysis strictly according to this JSON structure:
{
  "isUnclearImage": false,
  "unclearReason": "",
  "productName": "Exact full product name as shown on packaging (e.g. Britannia 100% Whole Wheat Bread, Kissan Fresh Tomato Ketchup)",
  "brand": "Brand name (e.g. Britannia, Kissan, Nestle, Amul, Haldiram's)",
  "category": "Product category (e.g. Bakery & Breads, Condiments & Sauces, Snacks & Namkeen, Beverages & Juices, Instant Foods, Dairy, Spices & Seasonings)",
  "netQuantity": "Net quantity with unit (e.g. 400g, 1 kg, 500ml) or 'Not visible'",
  "manufacturerName": "Manufacturer / FBO name if visible, or 'Not visible'",
  "manufacturingDate": "Mfg date if visible, or 'Not visible'",
  "expiryDate": "Expiry / Best Before date or duration if visible, or 'Not visible'",
  "batchNumber": "Batch or Lot number if visible, or 'Not visible'",
  "mrp": "MRP in INR if visible (e.g. ₹45) or 'Not visible'",
  "servingSize": "Serving size string (e.g. 30g, 2 slices (50g), 15g / 1 tbsp)",
  "servingUnit": "g or ml",
  "servingQuantity": 30,
  "fssaiLicenseNumber": "14-digit FSSAI license number if visible, otherwise empty string",
  "certifications": ["array of detected certifications e.g. Green Dot (Vegetarian), Red Dot (Non-Veg), Organic India, Jaivik Bharat, Agmark, ISO, Halal"],
  "claims": ["Marketing claims on packaging e.g. 100% Whole Wheat, Zero Added Sugar, High Protein, Real Tomatoes, No Preservatives, Baked Not Fried"],
  "ingredientsList": ["Array of parsed ingredients strictly in descending order of weight"],
  "allergensDeclared": ["Array of allergens declared on pack e.g. Wheat (Gluten), Milk Solids, Soy, Peanuts, Sulphites"],
  "additivesBreakdown": {
    "preservatives": ["Identified preservatives, e.g. Sodium Benzoate (INS 211), Potassium Sorbate (INS 202)"],
    "artificialColours": ["Identified synthetic or artificial food colours, e.g. Tartrazine (INS 102), Sunset Yellow (INS 110)"],
    "artificialFlavours": ["Identified artificial or nature-identical flavouring substances"],
    "addedSweeteners": ["Identified added sugars and artificial sweeteners, e.g. Sugar, Invert Sugar Syrup, Liquid Glucose, High Fructose Corn Syrup, Sucralose (INS 955), Stevia"],
    "emulsifiersAndStabilizers": ["Identified emulsifiers, stabilizers, and thickeners, e.g. INS 471, Soy Lecithin (INS 322), Xanthan Gum (INS 415), Guar Gum (INS 412), Pectin (INS 440)"],
    "refinedFlourPresent": false,
    "palmOilPresent": false,
    "hydrogenatedFatsPresent": false,
    "concerningAdditives": [
      {
        "name": "Additive name with INS number (e.g. INS 211 - Sodium Benzoate)",
        "role": "Function (e.g. Class II Preservative)",
        "explanation": "Clear plain English description of what it is and what consumers should know",
        "safetyLevel": "Generally Safe | Caution | Moderate | Avoid Frequent"
      }
    ]
  },
  "nutritionSnapshot": {
    "energyKcal": 250,
    "totalFatG": 3.5,
    "saturatedFatG": 1.0,
    "transFatG": 0.0,
    "carbohydratesG": 48.0,
    "totalSugarG": 6.0,
    "addedSugarG": 4.0,
    "proteinG": 8.0,
    "sodiumMg": 320,
    "dietaryFiberG": 5.0
  },
  "nutritionPer100g": {
    "energyKcal": 250,
    "totalFatG": 3.5,
    "saturatedFatG": 1.0,
    "transFatG": 0.0,
    "carbohydratesG": 48.0,
    "totalSugarG": 6.0,
    "addedSugarG": 4.0,
    "proteinG": 8.0,
    "sodiumMg": 320,
    "dietaryFiberG": 5.0
  },
  "plainEnglishExplanations": {
    "sugar": {
      "definition": "What sugar is in plain language",
      "labelValue": "e.g. 6g total sugar (including 4g added sugar) per serving",
      "meaning": "Clear, balanced explanation. Include teaspoon conversion for sugar ONLY: approx X level teaspoons (using 4g per tsp). Distinguish total vs added sugar.",
      "practicalAction": "What the user can practically do (e.g., portion control, comparison)"
    },
    "sodium": {
      "definition": "What sodium is in plain language (part of salt, needed in moderation)",
      "labelValue": "e.g. 320 mg per serving",
      "meaning": "Balanced explanation. Do NOT use teaspoon conversion for sodium. Show estimated salt equivalent (Sodium mg * 2.5 / 1000 = grams of salt) clearly labeled as estimate.",
      "practicalAction": "Practical advice without alarmist tone"
    },
    "fat": {
      "definition": "What fat is, highlighting saturated and trans fats",
      "labelValue": "e.g. 3.5 g total fat (1.0 g saturated, 0 g trans fat)",
      "meaning": "Balanced explanation of fat roles and why saturated/trans fats should be watched",
      "practicalAction": "Practical portion or swap advice"
    },
    "protein": {
      "definition": "What protein is (builds and repairs tissues)",
      "labelValue": "e.g. 8.0 g per serving",
      "meaning": "How much it contributes to daily needs based on portion size",
      "practicalAction": "Practical pairing tip (e.g. pair with healthy vegetables or seeds)"
    },
    "calories": {
      "definition": "Energy measure from food",
      "labelValue": "e.g. 250 kcal per serving",
      "meaning": "How it fits into an average daily intake (2000 kcal benchmark)",
      "practicalAction": "Portion timing or meal context"
    }
  },
  "whatsGood": [
    "Array of 2-4 factual, non-exaggerated positive aspects based strictly on actual ingredients and nutrients"
  ],
  "whatToWatch": [
    "Array of 2-4 factual cautionary points (e.g., high sodium, presence of palm oil, added sugar, refined flour/maida, allergens)"
  ],
  "personalizedInsights": [
    "Array of 2-4 personalized insights tailored specifically to the user's provided profile (e.g., diabetes, hypertension, weight loss, student budget)"
  ],
  "portionGuidance": {
    "suggestedPortion": "e.g. 2 slices (50g) or 1 tablespoon (15g)",
    "comparisonWithLabeled": "e.g. Matches standard labeled serving; provides balanced energy without exceeding daily limits.",
    "portionCalories": 125,
    "disclaimer": "This is general nutritional guidance based on Indian dietary guidelines (ICMR-NIN) and not an individualized medical prescription."
  },
  "claimEvaluations": [
    {
      "claim": "Claim text found on the pack",
      "status": "Supported by Available Evidence | Potential Mismatch Detected | Insufficient Evidence",
      "evidenceReviewed": "What ingredients or nutrition figures were checked (e.g. Checked whole wheat flour percentage vs refined flour)",
      "applicableRule": "Relevant FSSAI / regulatory guideline or benchmark (e.g. FSSAI Advertising and Claims Regulations)",
      "reason": "Clear explanation of why the claim is supported, potentially misleading, or unverified",
      "informationStillRequired": "Any unlisted lab test or data needed"
    }
  ],
  "finalSummary": {
    "whatToKnow": "Key takeaway in 1-2 friendly sentences",
    "whatToWatch": "Main aspect to be mindful about",
    "alternativeAdvice": "Whether a cleaner, more nutritious or affordable alternative is recommended"
  }
}

CRITICAL: Return ONLY valid JSON.
`;

      const contents: any[] = [];
      if (imageBase64) {
        // Strip any data:image/*;base64, prefix cleanly
        let cleanBase64 = imageBase64;
        let resolvedMime = mimeType || 'image/jpeg';
        const dataUrlMatch = imageBase64.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/s);
        if (dataUrlMatch) {
          resolvedMime = dataUrlMatch[1];
          cleanBase64 = dataUrlMatch[2];
        }
        cleanBase64 = cleanBase64.trim().replace(/\s+/g, '');

        if (cleanBase64.length < 50) {
          return res.status(400).json({ error: 'Uploaded image payload is invalid or empty.' });
        }

        contents.push({
          inlineData: {
            mimeType: resolvedMime,
            data: cleanBase64,
          },
        });
      }

      if (rawText) {
        contents.push({
          text: `User-provided label text or manual ingredients input:\n${rawText}`,
        });
      }

      contents.push({ text: prompt });

      const { text, modelUsed } = await generateMultimodalWithFallback(ai, contents, 0.2);

      let parsed: any;
      try {
        parsed = sanitizeAndParseJson(text);
      } catch (parseErr) {
        console.error('[WhatsInit AI] Failed to parse JSON output:', text);
        return res.status(500).json({
          error: 'AI analysis output could not be parsed into structured food data. Please retry with a clearer photo.',
        });
      }

      // Check if the AI determined the image is unclear and no text was provided
      if (parsed.isUnclearImage && !rawText) {
        return res.json({
          success: true,
          source: modelUsed,
          data: {
            isUnclearImage: true,
            unclearReason: parsed.unclearReason || 'The food package text was not legible. Please capture a clear, well-lit photo of the label.',
          },
        });
      }

      // Guarantee fallback values for all required frontend fields
      const sanitizedData = {
        id: 'scan-' + Date.now(),
        scannedAt: new Date().toISOString(),
        productName: parsed.productName || 'Scanned Packaged Food',
        brand: parsed.brand || 'Packaged Product',
        category: parsed.category || 'Packaged Food',
        netQuantity: parsed.netQuantity || 'Not visible',
        manufacturerName: parsed.manufacturerName || 'Not visible',
        manufacturingDate: parsed.manufacturingDate || 'Not visible',
        expiryDate: parsed.expiryDate || 'Not visible',
        batchNumber: parsed.batchNumber || 'Not visible',
        mrp: parsed.mrp || 'Not visible',
        servingSize: parsed.servingSize || '30g',
        servingUnit: parsed.servingUnit || 'g',
        servingQuantity: Number(parsed.servingQuantity) || 30,
        fssaiLicenseNumber: parsed.fssaiLicenseNumber || '',
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
        claims: Array.isArray(parsed.claims) ? parsed.claims : [],
        ingredientsList: Array.isArray(parsed.ingredientsList) ? parsed.ingredientsList : [],
        allergensDeclared: Array.isArray(parsed.allergensDeclared) ? parsed.allergensDeclared : [],
        additivesBreakdown: parsed.additivesBreakdown || {
          preservatives: [],
          artificialColours: [],
          artificialFlavours: [],
          addedSweeteners: [],
          emulsifiersAndStabilizers: [],
          refinedFlourPresent: false,
          palmOilPresent: false,
          hydrogenatedFatsPresent: false,
          concerningAdditives: [],
        },
        nutritionSnapshot: {
          energyKcal: Number(parsed.nutritionSnapshot?.energyKcal) || 0,
          totalFatG: Number(parsed.nutritionSnapshot?.totalFatG) || 0,
          saturatedFatG: Number(parsed.nutritionSnapshot?.saturatedFatG) || 0,
          transFatG: Number(parsed.nutritionSnapshot?.transFatG) || 0,
          carbohydratesG: Number(parsed.nutritionSnapshot?.carbohydratesG) || 0,
          totalSugarG: Number(parsed.nutritionSnapshot?.totalSugarG) || 0,
          addedSugarG: Number(parsed.nutritionSnapshot?.addedSugarG) || 0,
          proteinG: Number(parsed.nutritionSnapshot?.proteinG) || 0,
          sodiumMg: Number(parsed.nutritionSnapshot?.sodiumMg) || 0,
          dietaryFiberG: Number(parsed.nutritionSnapshot?.dietaryFiberG) || 0,
        },
        nutritionPer100g: parsed.nutritionPer100g || undefined,
        plainEnglishExplanations: parsed.plainEnglishExplanations || {
          sugar: {
            definition: 'Simple carbohydrates providing quick calories.',
            labelValue: `${parsed.nutritionSnapshot?.totalSugarG || 0}g per serving`,
            meaning: `Contains approx ${((parsed.nutritionSnapshot?.totalSugarG || 0) / 4).toFixed(1)} teaspoons of sugar.`,
            practicalAction: 'Check portion sizes if managing daily caloric or blood sugar intake.',
          },
          sodium: {
            definition: 'Essential mineral in salt regulating fluids.',
            labelValue: `${parsed.nutritionSnapshot?.sodiumMg || 0}mg per serving`,
            meaning: `Estimated salt equivalent: ~${(((parsed.nutritionSnapshot?.sodiumMg || 0) * 2.5) / 1000).toFixed(2)}g of salt.`,
            practicalAction: 'Keep daily sodium intake below 2,000 mg per WHO guidelines.',
          },
          fat: {
            definition: 'Macronutrient providing sustained energy.',
            labelValue: `${parsed.nutritionSnapshot?.totalFatG || 0}g total fat`,
            meaning: 'Look for low saturated fats and zero trans fats.',
            practicalAction: 'Enjoy as part of a varied, balanced diet.',
          },
          protein: {
            definition: 'Building block of bodily muscles and tissues.',
            labelValue: `${parsed.nutritionSnapshot?.proteinG || 0}g per serving`,
            meaning: 'Contributes to daily requirements.',
            practicalAction: 'Pair with whole lentils, dahi, or nuts for a balanced plate.',
          },
          calories: {
            definition: 'Energy provided to fuel daily activities.',
            labelValue: `${parsed.nutritionSnapshot?.energyKcal || 0} kcal`,
            meaning: 'Contribution towards the typical 2,000 kcal daily reference benchmark.',
            practicalAction: 'Balance with physical activity throughout the day.',
          },
        },
        whatsGood: Array.isArray(parsed.whatsGood) && parsed.whatsGood.length > 0 ? parsed.whatsGood : ['Provides declared nutrition as per label'],
        whatToWatch: Array.isArray(parsed.whatToWatch) && parsed.whatToWatch.length > 0 ? parsed.whatToWatch : ['Check sodium and portion size'],
        personalizedInsights: Array.isArray(parsed.personalizedInsights) && parsed.personalizedInsights.length > 0 ? parsed.personalizedInsights : ['Consider your personal wellness goals and portion balance.'],
        portionGuidance: parsed.portionGuidance || {
          suggestedPortion: parsed.servingSize || '1 standard serving',
          comparisonWithLabeled: 'Matches standard packaging guidance.',
          portionCalories: Number(parsed.nutritionSnapshot?.energyKcal) || 100,
          disclaimer: 'General guidance based on ICMR-NIN dietary guidelines; not medical prescription.',
        },
        claimEvaluations: Array.isArray(parsed.claimEvaluations) ? parsed.claimEvaluations : [],
        finalSummary: parsed.finalSummary || {
          whatToKnow: 'Packaged food label parsed successfully.',
          whatToWatch: 'Check portion sizes and frequency of consumption.',
          alternativeAdvice: 'Whole home-cooked meals and fresh whole foods offer higher micronutrient density.',
        },
      };

      return res.json({
        success: true,
        source: modelUsed,
        data: sanitizedData,
      });
    } else {
      // Mock / fallback response if API key is not configured
      return res.json({
        success: true,
        source: 'sample-mode',
        isSampleMode: true,
        notice: 'Demonstration Mode: Connect GEMINI_API_KEY for dynamic real-time vision parsing.',
        data: getSampleFoodAnalysis(rawText),
      });
    }
  } catch (error: any) {
    console.error('Scan food error:', error);
    return res.status(500).json({ error: error.message || 'Error processing food scan' });
  }
});

// --- Recipe Generator Endpoint ---
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const {
      dietaryPreference,
      allergies,
      goal,
      budgetPerMeal,
      servings,
      availableIngredients,
      preferredCuisine,
      maxCookingTime,
      mealType,
      healthConditions,
      reduceCost,
    } = req.body;

    const servingCount = Number(servings) || 2;

    if (ai) {
      const prompt = `
You are an expert Indian culinary nutritionist at WhatsInit.
Generate a delicious, authentic, healthy, and budget-friendly recipe tailored to these exact requirements:
- Meal Type: ${mealType || 'Lunch / Dinner'}
- Dietary Preference: ${dietaryPreference || 'Vegetarian'}
- Servings: EXACTLY ${servingCount} serving(s).
  CRITICAL: You MUST dynamically scale and recalculate EVERY ingredient quantity strictly for ${servingCount} serving(s).
- Available Ingredients to use: ${availableIngredients || 'Common Indian pantry staples'}
- Preferred Cuisine: ${preferredCuisine || 'Indian Homestyle'}
- Max Cooking Time: ${maxCookingTime || '30'} minutes
- Budget Per Meal: ₹${budgetPerMeal || '120'} total for the meal ${reduceCost ? '(PRIORITIZE LOW COST / BUDGET OPTIMIZATION)' : ''}
- Allergies / Intolerances to STRICTLY avoid: ${(allergies || []).join(', ') || 'None'}
- Voluntary Health Goals/Conditions: ${(healthConditions || []).join(', ') || 'None'} (General Wellness Goal: ${goal || 'Healthy eating'})

Format response strictly in JSON:
{
  "recipeName": "string",
  "tagline": "A punchy, healthy description",
  "prepTimeMinutes": number,
  "cookTimeMinutes": number,
  "difficulty": "Easy | Moderate | Advanced",
  "servings": ${servingCount},
  "estimatedCostInr": number,
  "estimatedCostPerServingInr": number,
  "nutritionPerServing": {
    "caloriesKcal": number,
    "proteinG": number,
    "carbsG": number,
    "fatG": number,
    "fiberG": number
  },
  "ingredients": [
    {
      "name": "string",
      "quantity": "string with unit scaled for ${servingCount} servings, e.g. 150g or 1 cup",
      "category": "Vegetables & Fruits | Grains & Cereals | Pulses & Legumes | Dairy or alternatives | Protein sources | Spices & condiments | Other essentials",
      "estimatedCostInr": number,
      "optional": boolean
    }
  ],
  "instructions": [
    "Numbered clear, step-by-step cooking steps"
  ],
  "substitutions": [
    "2-3 smart ingredient swaps for lower cost or allergies"
  ],
  "storageGuidance": "How to store leftovers safely in Indian weather",
  "nutritionNotes": "Short clinical note explaining why this meal supports ${goal || 'balanced nutrition'}"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      return res.json({ success: true, recipe: parsed });
    } else {
      // Fallback recipe scaled for servings
      return res.json({
        success: true,
        source: 'sample-mode',
        recipe: getSampleRecipe(servingCount, dietaryPreference, reduceCost),
      });
    }
  } catch (error: any) {
    console.error('Recipe error:', error);
    return res.status(500).json({ error: error.message || 'Error generating recipe' });
  }
});

// --- AI Nutrition Assistant Chat Endpoint ---
app.post('/api/nutrition-chat', async (req, res) => {
  try {
    const { messages, userProfile } = req.body;

    const systemInstruction = `
You are the WhatsInit AI Nutrition Assistant.
Your mission is to provide clear, practical, balanced, and evidence-informed nutrition education for Indian consumers.

Guidelines:
1. ALWAYS identify yourself as an AI nutrition educational assistant, NOT a medical doctor or registered clinical dietitian.
2. If the user asks about diagnosing conditions, medical treatments, prescription drugs, or insulin dosing, provide general nutritional principles and explicitly advise them to consult a qualified physician or registered dietitian.
3. Be culturally grounded in Indian foods (e.g., dal, roti, millets like ragi and jowar, paneer, curd, local vegetables, spices like turmeric and cumin).
4. Tone: empathetic, clear, scientific, non-alarmist, practical, and respectful of dietary choices.
5. User Context: Dietary preference: ${userProfile?.dietaryPreference || 'General'}, Goals: ${userProfile?.goal || 'Wellness'}, Allergies: ${(userProfile?.allergies || []).join(', ') || 'None'}.
`;

    if (ai) {
      const formattedHistory = (messages || []).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const lastUserMsg = messages[messages.length - 1]?.content || 'Hello';

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedHistory,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });

      return res.json({
        success: true,
        reply: response.text || 'I am here to help you understand packaged food labels and everyday nutrition.',
      });
    } else {
      return res.json({
        success: true,
        source: 'sample-mode',
        reply: "Hello! I am WhatsInit's AI Nutrition Guide. I can help clarify ingredient lists, explain what sodium and added sugar mean for your body, suggest traditional Indian food swaps (like roasted makhana instead of fried namkeen), and help you balance your meals. Please note: I offer educational guidance and do not replace personalized consultation with a licensed clinical dietitian.",
      });
    }
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: error.message || 'Error in nutrition chat' });
  }
});

// Fallback sample data generator for robust offline / missing API key operation
function getSampleFoodAnalysis(inputPrompt?: string) {
  return {
    productName: 'Crunchy Corn & Lentil Masala Sticks',
    brand: 'Desi Munch',
    category: 'Packaged Savory Snack',
    servingSize: '30 g (approx. 1 small cup)',
    servingUnit: 'g',
    servingQuantity: 30,
    fssaiLicenseNumber: '10014022002789',
    certifications: ['ISO 22000 Certified', 'Agmark Grade A', 'Green Veg Dot'],
    claims: ['Zero Trans Fat', 'Made with Dal & Corn', 'No Added MSG', 'High Fiber'],
    ingredientsList: [
      'Rice Meal (43%)',
      'Edible Vegetable Oil (Palmolein)',
      'Corn Meal (14%)',
      'Gram Meal / Besan (3%)',
      'Spices & Condiments (Onion Powder, Chilli Powder, Dried Mango, Turmeric, Coriander, Black Pepper)',
      'Iodised Salt',
      'Sugar',
      'Acidity Regulator (INS 330)',
      'Flavor Enhancers (Natural & Nature Identical Flavours)',
    ],
    allergensDeclared: ['Manufactured on equipment that also processes Wheat, Soy and Milk products.'],
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
    plainEnglishExplanations: {
      sugar: {
        definition: 'Simple carbohydrates that provide quick energy.',
        labelValue: '1.8 g total sugar (with 1.2 g added sugar) per 30g serving',
        meaning: 'This is relatively modest for a savory snack, equating to about 0.3 level teaspoons (calculated at 4 g sugar per teaspoon). However, be aware of hidden added sugars in savory seasonings.',
        practicalAction: 'Check that savory snacks do not hide elevated added sugars.',
      },
      sodium: {
        definition: 'Sodium is a key component of common salt (NaCl). Your body requires some for fluid balance and nerve transmission.',
        labelValue: '280 mg sodium per 30g serving',
        meaning: '280 mg represents about 14% of the recommended daily maximum of 2,000 mg set by the WHO and ICMR. This equals an estimated salt equivalent of approx. 0.7 g of salt per single 30g portion.',
        practicalAction: 'Limit portion size, as eating the entire 70g pack would deliver over 650 mg of sodium in one sitting.',
      },
      fat: {
        definition: 'Fat provides concentrated energy and helps your body absorb fat-soluble vitamins (A, D, E, K).',
        labelValue: '10.5 g total fat, of which 4.8 g is saturated fat',
        meaning: 'Palmolein oil is rich in saturated fatty acids. Saturated fat accounts for nearly 46% of total fat here. The ICMR recommends keeping saturated fats low in daily diets.',
        practicalAction: 'Balance this snack with unrefined, un-fried whole foods like sprouted pulses or fresh fruit during the day.',
      },
      protein: {
        definition: 'Protein helps repair tissues, build muscle, and maintain satiety.',
        labelValue: '1.8 g per 30g serving',
        meaning: 'Despite front-pack claims emphasizing dal/lentils, the actual besan content is low (around 3%), resulting in a low protein density.',
        practicalAction: 'Do not rely on this snack as a primary source of dietary protein.',
      },
      calories: {
        definition: 'Calories represent the energy your body draws from digesting food.',
        labelValue: '168 kcal per 30g serving',
        meaning: 'This accounts for about 8.5% of an average adult 2,000 kcal daily diet. Because it is energy-dense, calories accumulate rapidly if multiple servings are eaten.',
        practicalAction: 'Pre-portion into a small katori rather than eating directly out of the large packet.',
      },
    },
    whatsGood: [
      'Contains zero added MSG and uses familiar spices like turmeric and dried mango.',
      'Trans fat is declared below 0.1g per 100g, complying with FSSAI zero-trans-fat regulations.',
      'Moderate serving calories if strictly adhered to 30g.',
    ],
    whatToWatch: [
      'High saturated fat content (4.8g per 30g) due to palmolein oil.',
      'High sodium density (over 930mg per 100g basis).',
      'Low protein contribution despite marketing imagery of pulses.',
      'Cross-contamination warning for gluten, soy, and dairy.',
    ],
    personalizedInsights: [
      'For Blood Pressure Management: Keep portions strictly to 1 small bowl to prevent exceeding sodium limits.',
      'For Weight Goals: High calorie density (560 kcal/100g) makes it easy to overconsume; pair with a glass of water or green tea.',
      'For Clean Eating: Look for air-popped or roasted whole seed snacks with cold-pressed oils or minimal oil.',
    ],
    portionGuidance: {
      suggestedPortion: '20 g – 25 g (about 1 small katori / approx 15 pieces)',
      comparisonWithLabeled: 'The pack specifies 30g, but a slightly smaller 20-25g portion keeps sodium below 200mg and saturated fat under 3.5g.',
      portionCalories: 120,
      disclaimer: 'General guidance based on standard ICMR-NIN nutritional benchmarks. Tailor to your specific medical goals.',
    },
    claimEvaluations: [
      {
        claim: 'Zero Trans Fat',
        status: 'Supported by Available Evidence',
        evidenceReviewed: 'Nutrition table indicates trans fat < 0.1g per 100g.',
        applicableRule: 'FSSAI limits trans fatty acids to not more than 2% by weight of total fatty acids and allows Zero Trans Fat claim when < 0.2g/100g.',
        reason: 'Laboratory declaration complies with current statutory limits.',
        informationStillRequired: 'Batch test COA (Certificate of Analysis) if verification for high temperature frying degradation is needed.',
      },
      {
        claim: 'Made with Dal & Corn',
        status: 'Potential Mismatch Detected',
        evidenceReviewed: 'Ingredients list shows Rice Meal is the primary ingredient (43%), followed by Palmolein oil, then Corn Meal (14%), while Gram Dal / Besan is only 3%.',
        applicableRule: 'FSSAI Advertising & Claims Regulations 2018 require ingredient emphasis on the front panel to reflect substantial proportion without misleading prominence.',
        reason: 'Highlighting dal when it only constitutes 3% of the product may mislead consumers regarding its actual pulse composition.',
        informationStillRequired: 'Exact percentage of total pulses vs refined rice meal.',
      },
      {
        claim: 'High Fiber',
        status: 'Insufficient Evidence',
        evidenceReviewed: 'Nutrition table shows 1.1g dietary fiber per 30g (3.6g per 100g).',
        applicableRule: 'Under FSSAI guidelines, a food can only be claimed as "Source of Fiber" if it contains >= 3g/100g, and "High in Fiber" requires >= 6g/100g.',
        reason: 'At 3.6g/100g, the product qualifies as a source of fiber, but does not meet the 6g/100g threshold required for a High Fiber claim.',
        informationStillRequired: 'Complete laboratory dietary fiber analysis breakdown (soluble vs insoluble).',
      },
    ],
    finalSummary: {
      whatToKnow: 'This is a fried, highly seasoned extruded cereal snack with familiar Indian spices.',
      whatToWatch: 'High saturated fat and high sodium. The pulse content is quite low despite the packaging tone.',
      alternativeAdvice: 'Better everyday snack alternatives include roasted makhana (foxnuts) or roasted chana, offering triple the protein and 80% less saturated fat.',
    },
  };
}

function getSampleRecipe(servings: number, pref?: string, reduceCost?: boolean) {
  const s = Math.max(1, servings);
  return {
    recipeName: 'High-Protein Sprouted Moong & Palak Khichdi',
    tagline: 'Light on the stomach, balanced in protein, and rich in natural dietary fiber',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    difficulty: 'Easy',
    servings: s,
    estimatedCostInr: reduceCost ? 25 * s : 40 * s,
    estimatedCostPerServingInr: reduceCost ? 25 : 40,
    nutritionPerServing: {
      caloriesKcal: 310,
      proteinG: 14.5,
      carbsG: 48,
      fatG: 5.2,
      fiberG: 7.8,
    },
    ingredients: [
      {
        name: 'Whole Sprouted Green Moong Dal',
        quantity: `${60 * s} g (${(0.5 * s).toFixed(1)} cup)`,
        category: 'Pulses & Legumes',
        estimatedCostInr: 12 * s,
        optional: false,
      },
      {
        name: 'Brown Rice or Millets (Foxtail / Kodo)',
        quantity: `${45 * s} g (${(0.4 * s).toFixed(1)} cup)`,
        category: 'Grains & Cereals',
        estimatedCostInr: 8 * s,
        optional: false,
      },
      {
        name: 'Fresh Chopped Spinach (Palak)',
        quantity: `${50 * s} g (${(0.75 * s).toFixed(1)} cup chopped)`,
        category: 'Vegetables & Fruits',
        estimatedCostInr: 6 * s,
        optional: false,
      },
      {
        name: 'Tomatoes & Carrots diced',
        quantity: `${40 * s} g (${(0.5 * s).toFixed(1)} cup)`,
        category: 'Vegetables & Fruits',
        estimatedCostInr: 5 * s,
        optional: false,
      },
      {
        name: 'Cumin seeds (Jeera) & Hing',
        quantity: `${(0.5 * s).toFixed(1)} tsp`,
        category: 'Spices & condiments',
        estimatedCostInr: 2 * s,
        optional: false,
      },
      {
        name: 'Turmeric powder, Ginger & Green chilli',
        quantity: `${(0.5 * s).toFixed(1)} inch ginger crushed`,
        category: 'Spices & condiments',
        estimatedCostInr: 2 * s,
        optional: false,
      },
      {
        name: 'Cow Ghee or Cold-Pressed Mustard Oil',
        quantity: `${(1 * s).toFixed(1)} tsp (${5 * s} ml)`,
        category: 'Other essentials',
        estimatedCostInr: 5 * s,
        optional: false,
      },
    ],
    instructions: [
      `Rinse ${45 * s}g rice/millets and ${60 * s}g sprouted green moong thoroughly. Soak in lukewarm water for 15 minutes.`,
      `Heat ${5 * s}ml ghee/oil in a pressure cooker or heavy pan. Add cumin seeds and a pinch of hing until aromatic.`,
      'Add crushed ginger, slit green chillies, and diced tomatoes. Sauté for 2 minutes until soft.',
      `Stir in turmeric powder, salt, diced carrots, and ${50 * s}g washed chopped spinach.`,
      `Add drained rice and sprouted moong. Pour in ${250 * s}ml water (about 3 cups per cup of grain mix).`,
      'Pressure cook for 3 whistles on medium heat (or simmer covered for 18 minutes). Allow steam to release naturally.',
      'Garnish with fresh coriander and a squeeze of fresh lemon juice. Serve warm with homemade curd.',
    ],
    substitutions: [
      'Substitute spinach with fenugreek leaves (methi) or bottle gourd (lauki) for variety.',
      'Replace ghee with cold-pressed mustard oil or sesame oil for a 100% vegan meal.',
    ],
    storageGuidance: 'Store in an airtight stainless steel container in the refrigerator for up to 24 hours. Reheat with 2 tablespoons of warm water.',
    nutritionNotes: 'Combining whole sprouted legumes with grains provides a complete amino acid profile, high dietary fiber to smooth glycemic response, and vital micronutrients like folate and iron.',
  };
}

// In development, integrate Vite middlewares
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`WhatsInit server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
