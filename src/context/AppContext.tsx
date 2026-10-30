import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  DietitianProfile,
  FoodAnalysisData,
  AlternativeProduct,
  GroceryItem,
  MealPlanDay,
  ConsultationBooking,
  UserRole,
} from '../types';
import {
  SAMPLE_PRODUCTS,
  HEALTHY_ALTERNATIVES,
  VERIFIED_DIETITIANS,
  SAMPLE_WEEKLY_MEAL_PLAN,
  INITIAL_GROCERY_ITEMS,
} from '../data/mockData';

interface AppContextType {
  user: UserProfile | null;
  dietitian: DietitianProfile | null;
  currentRole: UserRole | null;
  activeScan: FoodAnalysisData | null;
  scanHistory: FoodAnalysisData[];
  savedAlternatives: AlternativeProduct[];
  groceryList: GroceryItem[];
  weeklyMealPlan: MealPlanDay[];
  consultationBookings: ConsultationBooking[];
  dietitians: DietitianProfile[];
  activeTab: string;
  isAuthModalOpen: boolean;
  authModalRole: UserRole;
  isNutritionChatOpen: boolean;
  setActiveTab: (tab: string) => void;
  openAuthModal: (role?: UserRole) => void;
  closeAuthModal: () => void;
  toggleNutritionChat: () => void;
  loginUser: (user: UserProfile) => void;
  loginDietitian: (dietitian: DietitianProfile) => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateDietitianProfile: (profile: Partial<DietitianProfile>) => void;
  setActiveScan: (data: FoodAnalysisData | null) => void;
  addScanToHistory: (data: FoodAnalysisData) => void;
  deleteScanFromHistory: (id: string) => void;
  toggleSaveAlternative: (alt: AlternativeProduct) => void;
  addIngredientsToGroceryList: (ingredients: { name: string; quantity: string; category: string; estimatedCostInr: number }[], sourceRecipe?: string) => void;
  toggleGroceryItem: (id: string) => void;
  deleteGroceryItem: (id: string) => void;
  updateGroceryItemQuantity: (id: string, newQty: string) => void;
  addCustomGroceryItem: (name: string, category: string, estimatedCostInr: number) => void;
  clearPurchasedGrocery: () => void;
  bookConsultation: (booking: Omit<ConsultationBooking, 'id' | 'createdAt'>) => string;
  upgradeToPremium: () => void;
  replaceMealInPlan: (dayName: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', newMeal: { name: string; calories: number; protein: number; cost: number }) => void;
  navHistory: string[];
  goBack: (fallbackTab?: string) => void;
  canGoBack: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  id: 'usr-default',
  name: 'Mansi Singhal',
  email: 'mansisinghal623@gmail.com',
  role: 'user',
  ageRange: '26 - 35',
  dietaryPreference: 'Vegetarian',
  allergies: [],
  budgetPerMealInr: 120,
  preferredServings: 2,
  goal: 'General Wellness',
  healthConditions: [],
  consentProvided: true,
  isPremium: false,
  createdAt: '2026-10-01T00:00:00Z',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('user');
  const [isNutritionChatOpen, setIsNutritionChatOpen] = useState(false);

  // User & Dietitian state with localStorage persistence
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('whatsinit_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [dietitian, setDietitian] = useState<DietitianProfile | null>(() => {
    try {
      const saved = localStorage.getItem('whatsinit_dietitian');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    if (dietitian) return 'dietitian';
    if (user) return 'user';
    return 'user';
  });

  // Food Scan & Analysis State
  const [activeScan, setActiveScan] = useState<FoodAnalysisData | null>(SAMPLE_PRODUCTS[0]);

  const [scanHistory, setScanHistory] = useState<FoodAnalysisData[]>(() => {
    try {
      const saved = localStorage.getItem('whatsinit_scan_history');
      return saved ? JSON.parse(saved) : SAMPLE_PRODUCTS;
    } catch {
      return SAMPLE_PRODUCTS;
    }
  });

  // Saved Alternatives
  const [savedAlternatives, setSavedAlternatives] = useState<AlternativeProduct[]>(() => {
    try {
      const saved = localStorage.getItem('whatsinit_saved_alternatives');
      return saved ? JSON.parse(saved) : [HEALTHY_ALTERNATIVES[0], HEALTHY_ALTERNATIVES[1]];
    } catch {
      return [HEALTHY_ALTERNATIVES[0], HEALTHY_ALTERNATIVES[1]];
    }
  });

  // Grocery List
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() => {
    try {
      const saved = localStorage.getItem('whatsinit_grocery_list');
      return saved ? JSON.parse(saved) : INITIAL_GROCERY_ITEMS;
    } catch {
      return INITIAL_GROCERY_ITEMS;
    }
  });

  // Weekly Meal Plan
  const [weeklyMealPlan, setWeeklyMealPlan] = useState<MealPlanDay[]>(() => {
    try {
      const saved = localStorage.getItem('whatsinit_meal_plan');
      return saved ? JSON.parse(saved) : SAMPLE_WEEKLY_MEAL_PLAN;
    } catch {
      return SAMPLE_WEEKLY_MEAL_PLAN;
    }
  });

  // Dietitians list
  const [dietitians, setDietitians] = useState<DietitianProfile[]>(() => {
    try {
      const saved = localStorage.getItem('whatsinit_dietitians_list');
      return saved ? JSON.parse(saved) : VERIFIED_DIETITIANS;
    } catch {
      return VERIFIED_DIETITIANS;
    }
  });

  // Bookings
  const [consultationBookings, setConsultationBookings] = useState<ConsultationBooking[]>(() => {
    try {
      const saved = localStorage.getItem('whatsinit_bookings');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'bk-sample-1',
              dietitianId: 'rd-1',
              dietitianName: 'Dr. Ananya Sharma',
              dietitianSpecialization: 'Diabetes & PCOS Management',
              userId: 'usr-default',
              userName: 'Mansi Singhal',
              userEmail: 'mansisinghal623@gmail.com',
              consultationDate: '2026-11-04',
              timeSlot: '03:00 PM',
              format: 'Video Call',
              feeInr: 799,
              status: 'Confirmed',
              userBrief: 'Looking for a personalized vegetarian plan to balance blood sugar levels and curb evening snacking.',
              createdAt: '2026-10-28T09:00:00Z',
            },
          ];
    } catch {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('whatsinit_user', JSON.stringify(user));
    else localStorage.removeItem('whatsinit_user');
  }, [user]);

  useEffect(() => {
    if (dietitian) localStorage.setItem('whatsinit_dietitian', JSON.stringify(dietitian));
    else localStorage.removeItem('whatsinit_dietitian');
  }, [dietitian]);

  useEffect(() => {
    localStorage.setItem('whatsinit_scan_history', JSON.stringify(scanHistory));
  }, [scanHistory]);

  useEffect(() => {
    localStorage.setItem('whatsinit_saved_alternatives', JSON.stringify(savedAlternatives));
  }, [savedAlternatives]);

  useEffect(() => {
    localStorage.setItem('whatsinit_grocery_list', JSON.stringify(groceryList));
  }, [groceryList]);

  useEffect(() => {
    localStorage.setItem('whatsinit_meal_plan', JSON.stringify(weeklyMealPlan));
  }, [weeklyMealPlan]);

  useEffect(() => {
    localStorage.setItem('whatsinit_bookings', JSON.stringify(consultationBookings));
  }, [consultationBookings]);

  useEffect(() => {
    localStorage.setItem('whatsinit_dietitians_list', JSON.stringify(dietitians));
  }, [dietitians]);

  const [navHistory, setNavHistory] = useState<string[]>([]);

  const LOGICAL_PARENTS: Record<string, string> = {
    report: 'scanner',
    scanner: 'home',
    claims: 'report',
    fssai: 'scanner',
    alternatives: 'report',
    compare: 'alternatives',
    recipes: 'home',
    mealplan: 'recipes',
    grocery: 'mealplan',
    dietitians: 'home',
    'for-dietitians': 'dietitians',
    premium: 'home',
    dashboard: 'home',
    profile: 'dashboard',
    history: 'dashboard',
  };

  const setActiveTab = (tab: string, pushHistory = true) => {
    if (tab === activeTab) return;
    if (pushHistory) {
      setNavHistory((prev) => [...prev, activeTab]);
      try {
        window.history.pushState({ tab }, '', `#${tab}`);
      } catch (e) {
        // Safe fallback in restricted environments
      }
    }
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = (fallbackTab?: string) => {
    if (navHistory.length > 0) {
      const prevTab = navHistory[navHistory.length - 1];
      setNavHistory((prev) => prev.slice(0, -1));
      setActiveTabState(prevTab);
      try {
        window.history.replaceState({ tab: prevTab }, '', `#${prevTab}`);
      } catch (e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = fallbackTab || LOGICAL_PARENTS[activeTab] || 'home';
      setActiveTabState(target);
      try {
        window.history.replaceState({ tab: target }, '', `#${target}`);
      } catch (e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canGoBack = activeTab !== 'home';

  // Handle browser back and forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTabState(event.state.tab);
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash) setActiveTabState(hash);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openAuthModal = (role: UserRole = 'user') => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const toggleNutritionChat = () => setIsNutritionChatOpen((prev) => !prev);

  const loginUser = (newUser: UserProfile) => {
    setUser(newUser);
    setDietitian(null);
    setCurrentRole('user');
    setIsAuthModalOpen(false);
  };

  const loginDietitian = (newDietitian: DietitianProfile) => {
    setDietitian(newDietitian);
    setUser(null);
    setCurrentRole('dietitian');
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setDietitian(null);
    setCurrentRole(null);
    setActiveTab('home');
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const updateDietitianProfile = (updated: Partial<DietitianProfile>) => {
    setDietitian((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updated };
      // Also update in list
      setDietitians((list) => list.map((d) => (d.id === merged.id ? merged : d)));
      return merged;
    });
  };

  const addScanToHistory = (data: FoodAnalysisData) => {
    const withId = {
      ...data,
      id: data.id || `scan-${Date.now()}`,
      scannedAt: data.scannedAt || new Date().toISOString(),
    };
    setActiveScan(withId);
    setScanHistory((prev) => [withId, ...prev.filter((item) => item.productName !== data.productName)]);
  };

  const deleteScanFromHistory = (id: string) => {
    setScanHistory((prev) => prev.filter((s) => s.id !== id));
    if (activeScan?.id === id) {
      setActiveScan(scanHistory.find((s) => s.id !== id) || null);
    }
  };

  const toggleSaveAlternative = (alt: AlternativeProduct) => {
    setSavedAlternatives((prev) => {
      const exists = prev.some((a) => a.id === alt.id);
      if (exists) {
        return prev.filter((a) => a.id !== alt.id);
      } else {
        return [...prev, alt];
      }
    });
  };

  const addIngredientsToGroceryList = (
    ingredients: { name: string; quantity: string; category: string; estimatedCostInr: number }[],
    sourceRecipe?: string
  ) => {
    setGroceryList((prev) => {
      const updated = [...prev];
      for (const item of ingredients) {
        const existingIndex = updated.findIndex(
          (g) => g.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        );
        if (existingIndex >= 0) {
          // Merge quantity note
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: `${updated[existingIndex].quantity} + ${item.quantity}`,
            estimatedCostInr: updated[existingIndex].estimatedCostInr + item.estimatedCostInr,
          };
        } else {
          updated.push({
            id: `g-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: item.name,
            quantity: item.quantity,
            category: item.category || 'Other essentials',
            estimatedCostInr: item.estimatedCostInr || 20,
            purchased: false,
            sourceRecipe,
          });
        }
      }
      return updated;
    });
  };

  const toggleGroceryItem = (id: string) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, purchased: !item.purchased } : item))
    );
  };

  const deleteGroceryItem = (id: string) => {
    setGroceryList((prev) => prev.filter((item) => item.id !== id));
  };

  const updateGroceryItemQuantity = (id: string, newQty: string) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const addCustomGroceryItem = (name: string, category: string, estimatedCostInr: number) => {
    setGroceryList((prev) => [
      ...prev,
      {
        id: `g-${Date.now()}`,
        name,
        category: category || 'Other essentials',
        quantity: '1 standard unit',
        estimatedCostInr,
        purchased: false,
      },
    ]);
  };

  const clearPurchasedGrocery = () => {
    setGroceryList((prev) => prev.filter((item) => !item.purchased));
  };

  const bookConsultation = (bookingData: Omit<ConsultationBooking, 'id' | 'createdAt'>) => {
    const bookingId = `bk-${Date.now().toString().slice(-6)}`;
    const newBooking: ConsultationBooking = {
      ...bookingData,
      id: bookingId,
      createdAt: new Date().toISOString(),
    };
    setConsultationBookings((prev) => [newBooking, ...prev]);
    return bookingId;
  };

  const upgradeToPremium = () => {
    if (user) {
      setUser((prev) => (prev ? { ...prev, isPremium: true } : null));
    }
  };

  const replaceMealInPlan = (
    dayName: string,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    newMeal: { name: string; calories: number; protein: number; cost: number }
  ) => {
    setWeeklyMealPlan((prev) =>
      prev.map((day) => {
        if (day.dayName === dayName) {
          return {
            ...day,
            [mealType]: newMeal,
          };
        }
        return day;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        dietitian,
        currentRole,
        activeScan,
        scanHistory,
        savedAlternatives,
        groceryList,
        weeklyMealPlan,
        consultationBookings,
        dietitians,
        activeTab,
        isAuthModalOpen,
        authModalRole,
        isNutritionChatOpen,
        setActiveTab,
        openAuthModal,
        closeAuthModal,
        toggleNutritionChat,
        loginUser,
        loginDietitian,
        logout,
        updateUserProfile,
        updateDietitianProfile,
        setActiveScan,
        addScanToHistory,
        deleteScanFromHistory,
        toggleSaveAlternative,
        addIngredientsToGroceryList,
        toggleGroceryItem,
        deleteGroceryItem,
        updateGroceryItemQuantity,
        addCustomGroceryItem,
        clearPurchasedGrocery,
        bookConsultation,
        upgradeToPremium,
        replaceMealInPlan,
        navHistory,
        goBack,
        canGoBack,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
