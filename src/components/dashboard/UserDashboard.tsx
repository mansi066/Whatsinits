import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Scan,
  Sparkles,
  ShoppingBag,
  Calendar,
  Utensils,
  ChevronRight,
  Crown,
  Heart,
  TrendingUp,
  User as UserIcon,
} from 'lucide-react';
import { BackButton } from '../common/BackButton';

export const UserDashboard: React.FC = () => {
  const {
    user,
    scanHistory,
    savedAlternatives,
    groceryList,
    weeklyMealPlan,
    consultationBookings,
    setActiveTab,
    setActiveScan,
  } = useApp();

  const pendingGroceryCount = groceryList.filter((g) => !g.purchased).length;
  const todayMeal = weeklyMealPlan[0]; // Monday / current

  const handleOpenScan = (scan: any) => {
    setActiveScan(scan);
    setActiveTab('report');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Back Button Navigation */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="home" label="Back to Home" />
        <button
          onClick={() => setActiveTab('settings')}
          className="text-xs font-semibold text-[#77716B] hover:text-[#F58220] flex items-center space-x-1.5 transition-colors"
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Dietary Profile Settings</span>
        </button>
      </div>

      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#252525]/10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 spotlight-card">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
              Namaste, {user?.name?.split(' ')[0] || 'Health Seeker'}!
            </h1>
            {user?.isPremium ? (
              <span className="text-[11px] bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 font-bold px-3 py-1 rounded-full flex items-center space-x-1.5 border border-amber-300/60 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-amber-700" />
                <span>PREMIUM SUBSCRIBER (₹89/mo)</span>
              </span>
            ) : (
              <span className="text-[11px] bg-[#FFF0E3] text-[#F58220] font-bold px-3 py-1 rounded-full border border-[#FFAB66]/30">
                FREE PLAN
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#77716B]">
            Primary Goal: <strong className="text-[#252525] font-semibold">{user?.goal || 'General Wellness'}</strong> • Diet:{' '}
            <strong className="text-[#252525] font-semibold">{user?.dietaryPreference || 'Vegetarian'}</strong>
          </p>
        </div>

        {/* Quick Scan CTA */}
        <button
          onClick={() => setActiveTab('scanner')}
          className="px-6 py-3 bg-[#F58220] hover:bg-[#e07116] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center space-x-2.5 shadow-md shadow-[#F58220]/20 transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
        >
          <Scan className="w-4 h-4" />
          <span>Quick Scan Packaged Food</span>
        </button>
      </div>

      {/* Grid of Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Scans Total */}
        <div
          onClick={() => setActiveTab('history')}
          className="bg-white p-5 sm:p-6 rounded-2xl border border-[#252525]/10 shadow-xs cursor-pointer hover:border-[#F58220] transition-all space-y-2 spotlight-card group"
        >
          <div className="flex items-center justify-between text-[#77716B]">
            <span className="text-xs font-bold uppercase tracking-wider">Scans Conducted</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0E3] flex items-center justify-center text-[#F58220] group-hover:scale-110 transition-transform">
              <Scan className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#252525]">{scanHistory.length}</div>
          <p className="text-xs text-[#F58220] font-semibold flex items-center space-x-1">
            <span>View scan history</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        {/* Saved Alternatives */}
        <div
          onClick={() => setActiveTab('alternatives')}
          className="bg-white p-5 sm:p-6 rounded-2xl border border-[#252525]/10 shadow-xs cursor-pointer hover:border-[#F58220] transition-all space-y-2 spotlight-card group"
        >
          <div className="flex items-center justify-between text-[#77716B]">
            <span className="text-xs font-bold uppercase tracking-wider">Clean Alternatives</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0E3] flex items-center justify-center text-[#F58220] group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#252525]">{savedAlternatives.length}</div>
          <p className="text-xs text-[#F58220] font-semibold flex items-center space-x-1">
            <span>Explore smart swaps</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        {/* Grocery list shortcut */}
        <div
          onClick={() => setActiveTab('grocery')}
          className="bg-white p-5 sm:p-6 rounded-2xl border border-[#252525]/10 shadow-xs cursor-pointer hover:border-[#F58220] transition-all space-y-2 spotlight-card group"
        >
          <div className="flex items-center justify-between text-[#77716B]">
            <span className="text-xs font-bold uppercase tracking-wider">Pantry Basket</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0E3] flex items-center justify-center text-[#F58220] group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#252525]">
            {pendingGroceryCount} <span className="text-xs text-[#77716B] font-normal">items pending</span>
          </div>
          <p className="text-xs text-[#F58220] font-semibold flex items-center space-x-1">
            <span>Open grocery list</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>

        {/* Upcoming Dietitian Consultation */}
        <div
          onClick={() => setActiveTab('dietitians')}
          className="bg-white p-5 sm:p-6 rounded-2xl border border-[#252525]/10 shadow-xs cursor-pointer hover:border-[#F58220] transition-all space-y-2 spotlight-card group"
        >
          <div className="flex items-center justify-between text-[#77716B]">
            <span className="text-xs font-bold uppercase tracking-wider">Dietitian Sessions</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0E3] flex items-center justify-center text-[#F58220] group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#252525]">{consultationBookings.length}</div>
          <p className="text-xs text-[#F58220] font-semibold flex items-center space-x-1">
            <span>{consultationBookings.length > 0 ? `${consultationBookings[0].timeSlot}` : 'Book certified session'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </p>
        </div>
      </div>

      {/* Recent Scans Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-7 space-y-5 spotlight-card">
        <div className="flex items-center justify-between border-b border-[#252525]/8 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#252525]">Recently Scanned Packaged Foods</h2>
            <p className="text-xs text-[#77716B]">Quick access to your most recent label intelligence reports</p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs text-[#F58220] font-bold hover:underline flex items-center space-x-1"
          >
            <span>See all scans</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {scanHistory.slice(0, 3).map((scan) => (
            <div
              key={scan.id}
              onClick={() => handleOpenScan(scan)}
              className="p-4 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 hover:border-[#F58220] hover:shadow-xs cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#F58220] bg-[#FFF0E3] px-2.5 py-0.5 rounded-full border border-[#FFAB66]/30">
                  {scan.category}
                </span>
                <span className="text-[#77716B] font-medium">{scan.servingSize}</span>
              </div>
              <h3 className="text-sm font-bold text-[#252525] group-hover:text-[#F58220] transition-colors truncate">
                {scan.productName}
              </h3>
              <p className="text-xs text-[#77716B]">{scan.brand}</p>
              <div className="flex items-center justify-between pt-2.5 border-t border-[#252525]/6 text-xs">
                <span className="font-bold text-[#252525]">{scan.nutritionSnapshot.energyKcal} kcal</span>
                <span className="text-[#F2B544] font-mono font-bold">{scan.nutritionSnapshot.sodiumMg}mg sod</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Meal Plan Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-7 space-y-5 spotlight-card">
        <div className="flex items-center justify-between border-b border-[#252525]/8 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0E3] flex items-center justify-center text-[#F58220]">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#252525]">
                Today's Wholesome Meal Architecture ({todayMeal.dayName})
              </h2>
              <p className="text-xs text-[#77716B]">Balanced Indian home-cooked meals tailored to your diet</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('mealplan')}
            className="text-xs text-[#F58220] font-bold hover:underline"
          >
            Full Weekly Planner →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 space-y-1">
            <span className="text-[10px] text-[#F58220] font-bold block uppercase tracking-wider">Breakfast</span>
            <span className="font-bold text-[#252525] block truncate">{todayMeal.breakfast.name}</span>
            <span className="text-xs text-[#77716B]">{todayMeal.breakfast.calories} kcal</span>
          </div>

          <div className="p-3.5 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 space-y-1">
            <span className="text-[10px] text-[#F58220] font-bold block uppercase tracking-wider">Lunch</span>
            <span className="font-bold text-[#252525] block truncate">{todayMeal.lunch.name}</span>
            <span className="text-xs text-[#77716B]">{todayMeal.lunch.calories} kcal</span>
          </div>

          <div className="p-3.5 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 space-y-1">
            <span className="text-[10px] text-[#F58220] font-bold block uppercase tracking-wider">Snack</span>
            <span className="font-bold text-[#252525] block truncate">{todayMeal.snack.name}</span>
            <span className="text-xs text-[#77716B]">{todayMeal.snack.calories} kcal</span>
          </div>

          <div className="p-3.5 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 space-y-1">
            <span className="text-[10px] text-[#F58220] font-bold block uppercase tracking-wider">Dinner</span>
            <span className="font-bold text-[#252525] block truncate">{todayMeal.dinner.name}</span>
            <span className="text-xs text-[#77716B]">{todayMeal.dinner.calories} kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
