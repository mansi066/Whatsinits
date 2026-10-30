import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ScanLine,
  Utensils,
  Sparkles,
  Users,
  ShieldCheck,
  Crown,
  LayoutDashboard,
  UserRound,
  LogOut,
  Menu,
  X,
  History,
  ShoppingBasket,
  Briefcase,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    dietitian,
    currentRole,
    logout,
    openAuthModal,
    groceryList,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const pendingGroceryCount = groceryList.filter((g) => !g.purchased).length;

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#252525]/8 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F58220] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#252525]">WhatsInit</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFF0E3] text-[#F58220] px-1.5 py-0.5 rounded-md">
                  Food Intelligence
                </span>
              </div>
              <p className="text-[11px] text-[#77716B] font-medium hidden sm:block">
                Before You Eat It, Know What's In It
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'home'
                  ? 'text-[#F58220] bg-[#FFF0E3]'
                  : 'text-[#252525]/80 hover:text-[#F58220] hover:bg-[#FFFAF5]'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('scanner')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'scanner' || activeTab === 'report'
                  ? 'text-[#F58220] bg-[#FFF0E3]'
                  : 'text-[#252525]/80 hover:text-[#F58220] hover:bg-[#FFFAF5]'
              }`}
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan Food</span>
            </button>

            <button
              onClick={() => handleNav('recipes')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'recipes'
                  ? 'text-[#F58220] bg-[#FFF0E3]'
                  : 'text-[#252525]/80 hover:text-[#F58220] hover:bg-[#FFFAF5]'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Recipes</span>
            </button>

            <button
              onClick={() => handleNav('alternatives')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'alternatives' || activeTab === 'compare'
                  ? 'text-[#F58220] bg-[#FFF0E3]'
                  : 'text-[#252525]/80 hover:text-[#F58220] hover:bg-[#FFFAF5]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Alternatives</span>
            </button>

            <button
              onClick={() => handleNav('mealplan')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'mealplan'
                  ? 'text-[#F58220] bg-[#FFF0E3]'
                  : 'text-[#252525]/80 hover:text-[#F58220] hover:bg-[#FFFAF5]'
              }`}
            >
              Meal Planner
            </button>

            <button
              onClick={() => handleNav('dietitians')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'dietitians'
                  ? 'text-[#F58220] bg-[#FFF0E3]'
                  : 'text-[#252525]/80 hover:text-[#F58220] hover:bg-[#FFFAF5]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Find a Dietitian</span>
            </button>

            <button
              onClick={() => handleNav('premium')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1 ${
                activeTab === 'premium'
                  ? 'text-[#F58220] bg-[#FFF0E3]'
                  : 'text-[#77716B] hover:text-[#F58220] hover:bg-[#FFFAF5]'
              }`}
            >
              <Crown className="w-4 h-4 text-[#F58220]" />
              <span>Premium</span>
              <span className="text-[10px] bg-[#FFF0E3] text-[#F58220] font-bold px-1.5 py-0.5 rounded-sm">
                ₹89
              </span>
            </button>

            <button
              onClick={() => handleNav('for-dietitians')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors flex items-center space-x-1 ${
                activeTab === 'for-dietitians'
                  ? 'border-[#F58220] bg-[#F58220] text-white'
                  : 'border-[#F58220]/30 text-[#F58220] hover:bg-[#FFF0E3]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>For Dietitians</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Grocery Shortcut */}
            <button
              onClick={() => handleNav('grocery')}
              className="relative p-2 text-[#252525]/70 hover:text-[#F58220] hover:bg-[#FFF0E3]/60 rounded-lg transition-colors"
              title="View Grocery List"
            >
              <ShoppingBasket className="w-5 h-5" />
              {pendingGroceryCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#F58220] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pendingGroceryCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNav('scanner')}
              className="hidden sm:inline-flex items-center space-x-2 bg-[#F58220] hover:bg-[#e07114] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan Your Food</span>
            </button>

            {/* User / Dietitian Profile or Login */}
            {currentRole === 'user' && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg border border-[#252525]/10 hover:bg-[#FFF0E3]/40 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FFF0E3] text-[#F58220] font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-[#252525] max-w-[90px] truncate hidden md:inline-block">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#77716B]" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#252525]/10 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3.5 py-2 border-b border-[#252525]/5">
                      <p className="text-xs font-bold text-[#252525]">{user.name}</p>
                      <p className="text-[11px] text-[#77716B] truncate">{user.email}</p>
                      <div className="mt-1 flex items-center space-x-1">
                        <span className="text-[10px] bg-[#FFF0E3] text-[#F58220] px-1.5 py-0.5 rounded font-semibold">
                          {user.isPremium ? 'Premium Consumer' : 'Free Member'}
                        </span>
                        <span className="text-[10px] bg-stone-100 text-[#77716B] px-1.5 py-0.5 rounded">
                          {user.dietaryPreference}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNav('dashboard')}
                      className="w-full text-left px-3.5 py-2 text-xs text-[#252525] hover:bg-[#FFFAF5] flex items-center space-x-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#77716B]" />
                      <span>User Dashboard</span>
                    </button>

                    <button
                      onClick={() => handleNav('history')}
                      className="w-full text-left px-3.5 py-2 text-xs text-[#252525] hover:bg-[#FFFAF5] flex items-center space-x-2"
                    >
                      <History className="w-4 h-4 text-[#77716B]" />
                      <span>Scan & Meal History</span>
                    </button>

                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full text-left px-3.5 py-2 text-xs text-[#252525] hover:bg-[#FFFAF5] flex items-center space-x-2"
                    >
                      <UserRound className="w-4 h-4 text-[#77716B]" />
                      <span>Dietary Preferences</span>
                    </button>

                    <div className="border-t border-[#252525]/5 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-[#E65A50] hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4 text-[#E65A50]" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : currentRole === 'dietitian' && dietitian ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg border border-[#F58220]/20 bg-[#FFF0E3]/40 hover:bg-[#FFF0E3] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#F58220] text-white font-bold text-xs flex items-center justify-center">
                    Dr
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-[#F58220] max-w-[90px] truncate leading-tight">
                      {dietitian.name.split(' ')[0]}
                    </p>
                    <span className="text-[9px] text-[#77716B] font-medium">Dietitian</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#F58220]" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-[#252525]/10 py-1.5 z-50">
                    <div className="px-3.5 py-2 border-b border-[#252525]/5">
                      <p className="text-xs font-bold text-[#252525]">{dietitian.name}</p>
                      <p className="text-[11px] text-[#77716B] truncate">{dietitian.qualification}</p>
                      <div className="mt-1 flex items-center space-x-1">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            dietitian.verificationStatus === 'Verified'
                              ? 'bg-[#EAF8EE] text-[#22A447]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {dietitian.verificationStatus}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNav('for-dietitians')}
                      className="w-full text-left px-3.5 py-2 text-xs text-[#252525] hover:bg-[#FFFAF5] flex items-center space-x-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#77716B]" />
                      <span>Professional Dashboard</span>
                    </button>

                    <div className="border-t border-[#252525]/5 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-[#E65A50] hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4 text-[#E65A50]" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('user')}
                  className="text-xs font-semibold text-[#252525] hover:text-[#F58220] px-3 py-1.5 rounded-lg transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('user')}
                  className="text-xs font-bold bg-[#FFF0E3] text-[#F58220] hover:bg-[#ffdcc1] px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#252525]/80 hover:bg-[#FFF0E3]/60"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#252525]/8 bg-white px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-[#252525]"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('scanner')}
            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg bg-[#FFF0E3] text-[#F58220] flex items-center space-x-2"
          >
            <ScanLine className="w-4 h-4" />
            <span>Scan Food</span>
          </button>
          <button
            onClick={() => handleNav('recipes')}
            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-[#252525] flex items-center space-x-2"
          >
            <Utensils className="w-4 h-4" />
            <span>AI Recipe Generator</span>
          </button>
          <button
            onClick={() => handleNav('alternatives')}
            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-[#252525] flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Healthy Alternatives & Compare</span>
          </button>
          <button
            onClick={() => handleNav('mealplan')}
            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-[#252525]"
          >
            Meal Planner
          </button>
          <button
            onClick={() => handleNav('dietitians')}
            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-[#252525] flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Find a Dietitian</span>
          </button>
          <button
            onClick={() => handleNav('premium')}
            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-[#F58220] flex items-center space-x-2"
          >
            <Crown className="w-4 h-4 text-[#F58220]" />
            <span>Premium Plan (₹89/mo)</span>
          </button>
          <button
            onClick={() => handleNav('for-dietitians')}
            className="w-full text-left px-3 py-2 text-xs font-bold rounded-lg bg-[#F58220] text-white flex items-center space-x-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>For Dietitians Portal</span>
          </button>

          {user && (
            <div className="pt-2 border-t border-[#252525]/10">
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-[#252525] flex items-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Dashboard</span>
              </button>
              <button
                onClick={() => handleNav('history')}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-[#252525] flex items-center space-x-2"
              >
                <History className="w-4 h-4" />
                <span>Scan History</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
