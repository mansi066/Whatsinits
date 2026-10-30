import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, DietaryPreference, WellnessGoal, UserProfile, DietitianProfile } from '../../types';
import {
  ShieldCheck,
  User,
  Briefcase,
  X,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Mail,
  Award,
  Sparkles,
} from 'lucide-react';
import { VERIFIED_DIETITIANS } from '../../data/mockData';

export const RoleAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalRole, loginUser, loginDietitian } = useApp();

  const [step, setStep] = useState<'choose-role' | 'auth-form'>('auth-form');
  const [selectedRole, setSelectedRole] = useState<UserRole>(authModalRole || 'user');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password'>('login');

  // User form states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [ageRange, setAgeRange] = useState('26 - 35');
  const [dietaryPref, setDietaryPref] = useState<DietaryPreference>('Vegetarian');
  const [goal, setGoal] = useState<WellnessGoal>('General Wellness');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [healthConditionsInput, setHealthConditionsInput] = useState('');
  const [consentHealth, setConsentHealth] = useState(false);

  // Dietitian form states
  const [dietitianName, setDietitianName] = useState('');
  const [dietitianEmail, setDietitianEmail] = useState('');
  const [dietitianPassword, setDietitianPassword] = useState('');
  const [qualification, setQualification] = useState('');
  const [institution, setInstitution] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [councilRegNo, setCouncilRegNo] = useState('');
  const [specializations, setSpecializations] = useState('Diabetes Management, Weight Management');
  const [languages, setLanguages] = useState('English, Hindi');
  const [consultationFee, setConsultationFee] = useState(699);
  const [dietitianBio, setDietitianBio] = useState('');

  // UI status
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleChooseRole = (role: UserRole) => {
    setSelectedRole(role);
    setStep('auth-form');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleUserAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMode === 'login') {
      if (!userEmail) {
        setErrorMsg('Please enter your email.');
        return;
      }
      const existingUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: userEmail.split('@')[0].replace('.', ' ').toUpperCase(),
        email: userEmail,
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
        createdAt: new Date().toISOString(),
      };
      loginUser(existingUser);
    } else if (authMode === 'signup') {
      if (!userName || !userEmail || !userPassword) {
        setErrorMsg('Name, email, and password are required.');
        return;
      }

      const allergies = allergiesInput
        ? allergiesInput.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const healthConditions = healthConditionsInput
        ? healthConditionsInput.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: userName,
        email: userEmail,
        role: 'user',
        ageRange,
        dietaryPreference: dietaryPref,
        allergies,
        budgetPerMealInr: 120,
        preferredServings: 2,
        goal,
        healthConditions,
        consentProvided: consentHealth,
        isPremium: false,
        createdAt: new Date().toISOString(),
      };
      loginUser(newUser);
    }
  };

  const handleDietitianAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMode === 'login') {
      if (!dietitianEmail) {
        setErrorMsg('Please enter your professional email.');
        return;
      }
      const existing = VERIFIED_DIETITIANS.find((d) => d.email.toLowerCase() === dietitianEmail.toLowerCase()) || {
        ...VERIFIED_DIETITIANS[0],
        email: dietitianEmail,
      };
      loginDietitian(existing);
    } else if (authMode === 'signup') {
      if (!dietitianName || !dietitianEmail || !qualification) {
        setErrorMsg('Full name, email, and clinical qualification are required.');
        return;
      }

      const newDietitian: DietitianProfile = {
        id: `rd-${Date.now()}`,
        name: dietitianName.startsWith('Dr.') ? dietitianName : `Dr. ${dietitianName}`,
        email: dietitianEmail,
        role: 'dietitian',
        title: 'Clinical Nutritionist & Dietitian',
        qualification,
        institution: institution || 'Accredited University',
        experienceYears: Number(experienceYears) || 3,
        specializations: specializations.split(',').map((s) => s.trim()).filter(Boolean),
        languages: languages.split(',').map((s) => s.trim()).filter(Boolean),
        consultationFeeInr: Number(consultationFee) || 599,
        consultationFormats: ['Video Call', 'Voice Call'],
        registrationCouncilNumber: councilRegNo || 'IDA-REG-PENDING',
        bio: dietitianBio || 'Evidence-based clinical nutrition guidance for Indian households.',
        verificationStatus: 'Pending Verification',
        location: 'India',
        rating: 5.0,
        reviewsCount: 0,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: ['10:00 AM', '02:00 PM', '05:00 PM'],
        createdAt: new Date().toISOString(),
      };
      loginDietitian(newDietitian);
    }
  };

  const handleQuickDemoUser = () => {
    loginUser({
      id: 'usr-demo',
      name: 'Mansi Singhal',
      email: 'mansisinghal623@gmail.com',
      role: 'user',
      ageRange: '26 - 35',
      dietaryPreference: 'Vegetarian',
      allergies: ['Peanuts'],
      budgetPerMealInr: 120,
      preferredServings: 2,
      goal: 'General Wellness',
      healthConditions: ['Pre-diabetes awareness'],
      consentProvided: true,
      isPremium: true,
      createdAt: '2026-10-01T00:00:00Z',
    });
  };

  const handleQuickDemoDietitian = () => {
    loginDietitian(VERIFIED_DIETITIANS[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#252525]/10 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#FFFAF5] border-b border-[#252525]/8 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {step === 'auth-form' && (
              <button
                onClick={() => setStep('choose-role')}
                className="text-[#77716B] hover:text-[#252525] p-1.5 rounded-lg hover:bg-[#FFF0E3] transition-colors"
                title="Switch Role"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF0E3] flex items-center justify-center text-[#F58220] border border-[#FFAB66]/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#252525]">WhatsInit Authentication</h3>
                <p className="text-[11px] text-[#77716B]">
                  {step === 'choose-role'
                    ? 'Select your account type to proceed'
                    : selectedRole === 'user'
                    ? 'Consumer & Food Scanner Portal'
                    : 'Professional Dietitian Portal'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="text-[#77716B] hover:text-[#252525] p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 'choose-role' ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h4 className="text-lg font-extrabold text-[#252525]">How will you use WhatsInit?</h4>
                <p className="text-xs text-[#77716B] mt-1">
                  We maintain strictly separate workflows for food consumers and verified clinical dietitians.
                </p>
              </div>

              {/* Option 1: Continue as User */}
              <div
                onClick={() => handleChooseRole('user')}
                className="p-5 rounded-2xl border-2 border-[#252525]/10 hover:border-[#F58220] bg-[#FFFAF5] hover:bg-[#FFF0E3]/30 cursor-pointer transition-all flex items-start space-x-4 group spotlight-card"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-[#252525]/10 flex items-center justify-center text-[#F58220] group-hover:bg-[#F58220] group-hover:text-white transition-colors shrink-0 shadow-xs">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-[#252525] group-hover:text-[#F58220] transition-colors">Continue as Food Consumer</h5>
                  <p className="text-xs text-[#77716B] mt-1 leading-relaxed">
                    For individuals and families scanning packaged food, checking FSSAI claims, generating personalized recipes, and discovering healthier alternatives.
                  </p>
                </div>
              </div>

              {/* Option 2: Continue as Dietitian */}
              <div
                onClick={() => handleChooseRole('dietitian')}
                className="p-5 rounded-2xl border-2 border-[#252525]/10 hover:border-[#F58220] bg-[#FFFAF5] hover:bg-[#FFF0E3]/30 cursor-pointer transition-all flex items-start space-x-4 group spotlight-card"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-[#252525]/10 flex items-center justify-center text-[#F58220] group-hover:bg-[#F58220] group-hover:text-white transition-colors shrink-0 shadow-xs">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-[#252525] group-hover:text-[#F58220] transition-colors">Continue as Dietitian</h5>
                  <p className="text-xs text-[#77716B] mt-1 leading-relaxed">
                    For qualified or beginner clinical dietitians looking to publish verified credentials, manage client appointments, and upload customized meal plans.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Role Indicator Banner */}
              <div className="mb-4 flex items-center justify-between p-3 rounded-xl bg-[#FFF0E3]/50 border border-[#FFAB66]/30">
                <div className="flex items-center space-x-2">
                  {selectedRole === 'user' ? (
                    <User className="w-4 h-4 text-[#F58220]" />
                  ) : (
                    <Briefcase className="w-4 h-4 text-[#F58220]" />
                  )}
                  <span className="text-xs font-bold text-[#252525]">
                    {selectedRole === 'user' ? 'Consumer Account' : 'Dietitian Professional Account'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('choose-role')}
                  className="text-xs text-[#F58220] hover:underline font-bold"
                >
                  Switch Role
                </button>
              </div>

              {/* Auth Mode Tabs */}
              <div className="flex border-b border-[#252525]/10 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg('');
                  }}
                  className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
                    authMode === 'login'
                      ? 'border-[#F58220] text-[#F58220]'
                      : 'border-transparent text-[#77716B] hover:text-[#252525]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMsg('');
                  }}
                  className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
                    authMode === 'signup'
                      ? 'border-[#F58220] text-[#F58220]'
                      : 'border-transparent text-[#77716B] hover:text-[#252525]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 text-xs text-[#E65A50] bg-red-50 rounded-xl border border-red-200 font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Form for Consumer User */}
              {selectedRole === 'user' ? (
                <form onSubmit={handleUserAuth} className="space-y-3.5">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-[#252525] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Mansi Singhal"
                        className="w-full text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl focus:ring-2 focus:ring-[#F58220] focus:border-[#F58220] outline-none bg-[#FFFAF5]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="e.g. mansi@example.com"
                      className="w-full text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl focus:ring-2 focus:ring-[#F58220] focus:border-[#F58220] outline-none bg-[#FFFAF5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl focus:ring-2 focus:ring-[#F58220] focus:border-[#F58220] outline-none bg-[#FFFAF5]"
                    />
                  </div>

                  {authMode === 'signup' && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-[#252525] mb-1">Diet Preference</label>
                          <select
                            value={dietaryPref}
                            onChange={(e) => setDietaryPref(e.target.value as DietaryPreference)}
                            className="w-full text-xs px-3 py-2.5 border border-[#252525]/15 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#F58220]"
                          >
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Egg-based">Egg-based</option>
                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                            <option value="Jain">Jain (No root veg)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#252525] mb-1">Goal</label>
                          <select
                            value={goal}
                            onChange={(e) => setGoal(e.target.value as WellnessGoal)}
                            className="w-full text-xs px-3 py-2.5 border border-[#252525]/15 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#F58220]"
                          >
                            <option value="General Wellness">General Wellness</option>
                            <option value="Weight Management">Weight Management</option>
                            <option value="Muscle Gain">Muscle Gain</option>
                            <option value="Heart & BP Health">Heart & BP Health</option>
                            <option value="Blood Sugar Management">Blood Sugar</option>
                            <option value="Student / Budget Health">Student / Budget</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#252525] mb-1">
                          Food Allergies & Intolerances (Optional)
                        </label>
                        <input
                          type="text"
                          value={allergiesInput}
                          onChange={(e) => setAllergiesInput(e.target.value)}
                          placeholder="e.g. Peanuts, Gluten, Dairy"
                          className="w-full text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl focus:ring-2 focus:ring-[#F58220] focus:border-[#F58220] outline-none bg-[#FFFAF5]"
                        />
                      </div>

                      <div className="p-3 bg-[#FFF0E3]/50 rounded-xl border border-[#FFAB66]/30">
                        <label className="flex items-start space-x-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consentHealth}
                            onChange={(e) => setConsentHealth(e.target.checked)}
                            className="mt-0.5 rounded text-[#F58220] focus:ring-[#F58220] accent-[#F58220]"
                          />
                          <span className="text-[11px] text-[#252525] leading-relaxed">
                            <strong>Privacy Consent:</strong> I voluntarily share optional wellness goals solely to personalize label insights. Health data is strictly confidential and never sold or made public.
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#F58220] hover:bg-[#e07116] text-white text-xs font-bold rounded-xl shadow-md shadow-[#F58220]/20 transition-all hover:scale-[1.01]"
                  >
                    {authMode === 'login' ? 'Sign In as Consumer' : 'Complete Registration'}
                  </button>

                  {/* 1-Click Demo Shortcut */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleQuickDemoUser}
                      className="w-full py-2.5 border border-[#FFAB66]/50 bg-[#FFF0E3]/40 hover:bg-[#FFF0E3] text-[#F58220] text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#F58220]" />
                      <span>One-Click Demo Consumer Login</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Form for Dietitian Professional */
                <form onSubmit={handleDietitianAuth} className="space-y-3.5">
                  {authMode === 'signup' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-[#252525] mb-1">
                          Full Name with Title
                        </label>
                        <input
                          type="text"
                          required
                          value={dietitianName}
                          onChange={(e) => setDietitianName(e.target.value)}
                          placeholder="e.g. Dr. Ananya Sharma"
                          className="w-full text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl focus:ring-2 focus:ring-[#F58220] outline-none bg-[#FFFAF5]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-[#252525] mb-1">Qualification</label>
                          <input
                            type="text"
                            required
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            placeholder="e.g. M.Sc. Clinical Nutrition"
                            className="w-full text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl outline-none focus:ring-2 focus:ring-[#F58220] bg-[#FFFAF5]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#252525] mb-1">Institution</label>
                          <input
                            type="text"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            placeholder="e.g. AIIMS / SNDT"
                            className="w-full text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl outline-none focus:ring-2 focus:ring-[#F58220] bg-[#FFFAF5]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-[#252525] mb-1">Council / Reg. No.</label>
                          <input
                            type="text"
                            value={councilRegNo}
                            onChange={(e) => setCouncilRegNo(e.target.value)}
                            placeholder="e.g. IDA-REG-2021-998"
                            className="w-full text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl outline-none focus:ring-2 focus:ring-[#F58220] bg-[#FFFAF5]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#252525] mb-1">Fee (₹ per session)</label>
                          <input
                            type="number"
                            value={consultationFee}
                            onChange={(e) => setConsultationFee(Number(e.target.value))}
                            className="w-full text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl outline-none focus:ring-2 focus:ring-[#F58220] bg-[#FFFAF5]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Professional Email</label>
                    <input
                      type="email"
                      required
                      value={dietitianEmail}
                      onChange={(e) => setDietitianEmail(e.target.value)}
                      placeholder="e.g. dr.ananya@clinicaldiet.in"
                      className="w-full text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl outline-none focus:ring-2 focus:ring-[#F58220] bg-[#FFFAF5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#252525] mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={dietitianPassword}
                      onChange={(e) => setDietitianPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl outline-none focus:ring-2 focus:ring-[#F58220] bg-[#FFFAF5]"
                    />
                  </div>

                  {authMode === 'signup' && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-[11px] text-amber-900 leading-relaxed">
                        <strong>Dietitian Verification Policy:</strong> Submitted credentials will be reviewed against regulatory registers (e.g. Indian Dietetic Association). Verified badge is granted upon administrative audit.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#F58220] hover:bg-[#e07116] text-white text-xs font-bold rounded-xl shadow-md shadow-[#F58220]/20 transition-all hover:scale-[1.01]"
                  >
                    {authMode === 'login' ? 'Sign In to Dietitian Portal' : 'Submit Dietitian Profile'}
                  </button>

                  {/* 1-Click Demo Shortcut */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleQuickDemoDietitian}
                      className="w-full py-2.5 border border-[#FFAB66]/50 bg-[#FFF0E3]/40 hover:bg-[#FFF0E3] text-[#F58220] text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Award className="w-4 h-4 text-[#F58220]" />
                      <span>One-Click Demo Dietitian Login (Dr. Ananya Sharma)</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
