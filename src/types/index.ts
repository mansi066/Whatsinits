export type UserRole = 'user' | 'dietitian';

export type DietaryPreference = 'Vegetarian' | 'Vegan' | 'Egg-based' | 'Non-Vegetarian' | 'Jain';

export type WellnessGoal =
  | 'General Wellness'
  | 'Weight Management'
  | 'Muscle Gain'
  | 'Heart & BP Health'
  | 'Blood Sugar Management'
  | 'Student / Budget Health';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user';
  ageRange?: string;
  dietaryPreference: DietaryPreference;
  allergies: string[];
  budgetPerMealInr: number;
  preferredServings: number;
  goal: WellnessGoal;
  healthConditions: string[]; // voluntary with consent
  consentProvided: boolean;
  isPremium: boolean;
  createdAt: string;
}

export interface DietitianProfile {
  id: string;
  name: string;
  email: string;
  role: 'dietitian';
  title: string;
  qualification: string;
  institution: string;
  experienceYears: number;
  specializations: string[];
  languages: string[];
  consultationFeeInr: number;
  consultationFormats: ('Video Call' | 'Voice Call' | 'In-Clinic')[];
  registrationCouncilNumber: string; // e.g. IDA / State Medical
  bio: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Additional Information Required';
  avatarUrl?: string;
  location: string;
  rating: number;
  reviewsCount: number;
  availableDays: string[];
  availableTimeSlots: string[];
  createdAt: string;
}

export interface NutritionSnapshot {
  energyKcal: number;
  totalFatG: number;
  saturatedFatG: number;
  transFatG: number;
  carbohydratesG: number;
  totalSugarG: number;
  addedSugarG: number;
  proteinG: number;
  sodiumMg: number;
  dietaryFiberG?: number;
}

export interface PlainEnglishExplanation {
  definition: string;
  labelValue: string;
  meaning: string;
  practicalAction: string;
}

export interface ClaimEvaluation {
  claim: string;
  status: 'Supported by Available Evidence' | 'Potential Mismatch Detected' | 'Insufficient Evidence';
  evidenceReviewed: string;
  applicableRule: string;
  reason: string;
  informationStillRequired: string;
}

export interface PortionGuidance {
  suggestedPortion: string;
  comparisonWithLabeled: string;
  portionCalories: number;
  disclaimer: string;
}

export interface AdditiveInfo {
  name: string;
  role: string;
  explanation: string;
  safetyLevel?: 'Generally Safe' | 'Caution' | 'Moderate' | 'Avoid Frequent';
}

export interface AdditivesBreakdown {
  preservatives?: string[];
  artificialColours?: string[];
  artificialFlavours?: string[];
  addedSweeteners?: string[];
  emulsifiersAndStabilizers?: string[];
  refinedFlourPresent?: boolean;
  palmOilPresent?: boolean;
  hydrogenatedFatsPresent?: boolean;
  concerningAdditives?: AdditiveInfo[];
}

export interface FoodAnalysisData {
  id?: string;
  scannedAt?: string;
  productName: string;
  brand: string;
  category: string;
  servingSize: string;
  servingUnit: string;
  servingQuantity: number;
  fssaiLicenseNumber: string;
  certifications: string[];
  claims: string[];
  ingredientsList: string[];
  allergensDeclared: string[];
  nutritionSnapshot: NutritionSnapshot;
  nutritionPer100g?: NutritionSnapshot;
  // Packaging & manufacturing metadata
  netQuantity?: string;
  manufacturerName?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  batchNumber?: string;
  mrp?: string;
  additivesBreakdown?: AdditivesBreakdown;
  isUnclearImage?: boolean;
  unclearReason?: string;
  plainEnglishExplanations: {
    sugar: PlainEnglishExplanation;
    sodium: PlainEnglishExplanation;
    fat: PlainEnglishExplanation;
    protein: PlainEnglishExplanation;
    calories: PlainEnglishExplanation;
  };
  whatsGood: string[];
  whatToWatch: string[];
  personalizedInsights: string[];
  portionGuidance: PortionGuidance;
  claimEvaluations: ClaimEvaluation[];
  finalSummary: {
    whatToKnow: string;
    whatToWatch: string;
    alternativeAdvice: string;
  };
}

export interface AlternativeProduct {
  id: string;
  name: string;
  brandOrType: string;
  category: string;
  priceInr: number;
  packageSizeG: number;
  pricePer100gInr: number;
  servingSizeG: number;
  nutritionPerServing: NutritionSnapshot;
  nutritionPer100g: NutritionSnapshot;
  whySuitable: string;
  limitations: string;
  isPackaged: boolean;
  imageEmoji?: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  category: string;
  estimatedCostInr: number;
  optional?: boolean;
}

export interface GeneratedRecipe {
  id?: string;
  recipeName: string;
  tagline: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  servings: number;
  estimatedCostInr: number;
  estimatedCostPerServingInr: number;
  nutritionPerServing: {
    caloriesKcal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number;
  };
  ingredients: RecipeIngredient[];
  instructions: string[];
  substitutions: string[];
  storageGuidance: string;
  nutritionNotes: string;
  createdAt?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  estimatedCostInr: number;
  purchased: boolean;
  sourceRecipe?: string;
}

export interface MealPlanDay {
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: { name: string; calories: number; protein: number; cost: number; recipeId?: string };
  lunch: { name: string; calories: number; protein: number; cost: number; recipeId?: string };
  dinner: { name: string; calories: number; protein: number; cost: number; recipeId?: string };
  snack: { name: string; calories: number; protein: number; cost: number; recipeId?: string };
}

export interface ConsultationBooking {
  id: string;
  dietitianId: string;
  dietitianName: string;
  dietitianSpecialization: string;
  userId: string;
  userName: string;
  userEmail: string;
  consultationDate: string;
  timeSlot: string;
  format: 'Video Call' | 'Voice Call' | 'In-Clinic';
  feeInr: number;
  status: 'Confirmed' | 'Completed' | 'Pending Review';
  userBrief: string;
  createdAt: string;
}

export interface FssaiLookupResult {
  licenseNumber: string;
  validFormat: boolean;
  status: string;
  message?: string;
  details?: {
    category: string;
    jurisdiction: string;
    enrolledYear: string;
    authorityCode: string;
    serialNumber: string;
  };
  source: string;
  officialPortalUrl: string;
  guidance: string;
  lastCheckedDate: string;
}
