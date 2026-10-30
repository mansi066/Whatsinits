import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { RoleAuthModal } from './components/common/RoleAuthModal';
import { NutritionChatModal } from './components/common/NutritionChatModal';
import { LandingPage } from './components/landing/LandingPage';
import { FoodScanner } from './components/scanner/FoodScanner';
import { FoodAnalysisReport } from './components/scanner/FoodAnalysisReport';
import { ClaimVerificationCard } from './components/claims/ClaimVerificationCard';
import { FssaiVerificationSection } from './components/claims/FssaiVerificationSection';
import { AlternativesView } from './components/alternatives/AlternativesView';
import { RecipeGenerator } from './components/recipes/RecipeGenerator';
import { MealPlannerView } from './components/mealplan/MealPlannerView';
import { GroceryListView } from './components/grocery/GroceryListView';
import { DietitianMarketplace } from './components/dietitians/DietitianMarketplace';
import { ForDietitiansView } from './components/dietitians/ForDietitiansView';
import { PremiumSubscriptionView } from './components/premium/PremiumSubscriptionView';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { UserProfileSettings } from './components/dashboard/UserProfileSettings';
import { HistoryView } from './components/dashboard/HistoryView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="min-h-[calc(100vh-18rem)]">
      {activeTab === 'home' && <LandingPage />}
      {activeTab === 'scanner' && <FoodScanner />}
      {activeTab === 'report' && <FoodAnalysisReport />}
      {activeTab === 'claims' && <ClaimVerificationCard />}
      {activeTab === 'fssai' && <FssaiVerificationSection />}
      {activeTab === 'alternatives' && <AlternativesView />}
      {activeTab === 'recipes' && <RecipeGenerator />}
      {activeTab === 'mealplan' && <MealPlannerView />}
      {activeTab === 'grocery' && <GroceryListView />}
      {activeTab === 'dietitians' && <DietitianMarketplace />}
      {activeTab === 'for-dietitians' && <ForDietitiansView />}
      {activeTab === 'premium' && <PremiumSubscriptionView />}
      {activeTab === 'dashboard' && <UserDashboard />}
      {activeTab === 'profile' && <UserProfileSettings />}
      {activeTab === 'history' && <HistoryView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#FFFAF5] text-[#252525] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        <Navbar />
        <MainContent />
        <Footer />
        <NutritionChatModal />
        <RoleAuthModal />
      </div>
    </AppProvider>
  );
}

