import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ScanLine,
  Utensils,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Users,
  Crown,
  FileSearch,
  Scale,
  Award,
  ChevronRight,
  Flame,
  Candy,
  Waves,
  Apple,
  Camera,
  Check,
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../../data/mockData';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setActiveScan } = useApp();

  const sampleCard = SAMPLE_PRODUCTS[0]; // Kurkure Masala Munch

  const handleTestScan = (product = sampleCard) => {
    setActiveScan(product);
    setActiveTab('report');
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-[#252525]/6">
        {/* Soft peach radial glow accent */}
        <div
          aria-hidden="true"
          className="absolute -top-32 right-0 w-[550px] h-[550px] bg-gradient-to-br from-[#FFF0E3] to-[#FFFAF5] rounded-full blur-3xl opacity-70 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Tag */}
              <div className="inline-flex items-center space-x-2 bg-[#FFF0E3] text-[#F58220] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#F58220]" />
                <span>India's Food Intelligence Platform</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#252525] tracking-tight leading-[1.12]">
                Before You Eat It, <br className="hidden sm:inline" />
                <span className="text-[#F58220]">Know What's In It.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#77716B] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                WhatsInit empowers Indian families to decode packaged food labels in seconds. Understand hidden sugars in level teaspoons, audit marketing claims against FSSAI standards, and swap ultra-processed snacks for wholesome alternatives.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#F58220] hover:bg-[#e07114] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>Scan Your Food</span>
                </button>

                <button
                  onClick={scrollToHowItWorks}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#FFF0E3]/60 text-[#252525] text-sm font-bold rounded-xl border border-[#252525]/15 shadow-2xs transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Explore How It Works</span>
                  <ChevronRight className="w-4 h-4 text-[#77716B]" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#77716B]">
                <span className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#252525]/8 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                  <span>Real-Time AI Image Scanning</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#252525]/8 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                  <span>FSSAI Regulations 2018 Grounded</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#252525]/8 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                  <span>Simple Nutrition Insights</span>
                </span>
              </div>
            </div>

            {/* Right Side: Realistic Phone Scanning Packaged Food with Fresh Food Backdrop */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Natural Food Accents Floating Behind Spotlight */}
                <div className="absolute -top-6 -left-6 w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200/60 p-2 shadow-sm flex flex-col items-center justify-center text-center -rotate-6 z-0 hidden sm:flex">
                  <span className="text-2xl">🍅</span>
                  <span className="text-[9px] font-bold text-amber-900 mt-0.5">Fresh Farm</span>
                </div>
                <div className="absolute -bottom-5 -right-5 w-24 h-24 rounded-2xl bg-emerald-50 border border-emerald-200/60 p-2 shadow-sm flex flex-col items-center justify-center text-center rotate-6 z-0 hidden sm:flex">
                  <span className="text-2xl">🥑</span>
                  <span className="text-[9px] font-bold text-emerald-900 mt-0.5">Whole Nutrition</span>
                </div>

                {/* Main Spotlight Phone Scanning Card */}
                <div className="spotlight-card relative bg-white rounded-3xl shadow-xl border border-[#252525]/10 p-5 sm:p-6 overflow-hidden z-10">
                  {/* Phone Header / Status Bar */}
                  <div className="flex items-center justify-between border-b border-[#252525]/8 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#22A447] animate-pulse" />
                      <span className="text-xs font-bold text-[#252525]">AI Food Vision Scanner</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-[#F58220] bg-[#FFF0E3] px-2 py-0.5 rounded">
                      FSSAI 10014022002789
                    </span>
                  </div>

                  {/* Scanned Food Package Simulation */}
                  <div className="mt-4 space-y-3.5">
                    {/* Visual Packaging Viewfinder Preview */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFF0E3] via-white to-[#FFFAF5] border border-[#FFAB66]/30 p-4">
                      {/* Scanning Laser Beam */}
                      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#F58220] to-transparent shadow-[0_0_8px_#F58220] animate-pulse" />

                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F58220]">
                            Detected Indian Packaged Food
                          </span>
                          <h3 className="text-base font-extrabold text-[#252525]">Kurkure Masala Munch</h3>
                          <p className="text-xs text-[#77716B]">PepsiCo India • 30g serving</p>
                        </div>
                        <span className="text-xs font-extrabold bg-[#FFF0E3] text-[#F58220] px-2.5 py-1 rounded-lg border border-[#FFAB66]/40">
                          168 kcal
                        </span>
                      </div>
                    </div>

                    {/* Micro Nutritional Snapshot Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-[#FFFAF5] p-2.5 rounded-xl border border-[#252525]/6 hover:border-[#FFAB66]/40 transition-colors">
                        <span className="text-[10px] text-[#77716B] font-medium flex items-center justify-center space-x-1">
                          <Waves className="w-3 h-3 text-[#F2B544]" />
                          <span>Sodium</span>
                        </span>
                        <span className="font-extrabold text-[#252525] block mt-0.5">280 mg</span>
                        <span className="text-[9px] text-[#77716B] block">~0.7g salt equiv</span>
                      </div>

                      <div className="bg-[#FFFAF5] p-2.5 rounded-xl border border-[#252525]/6 hover:border-[#FFAB66]/40 transition-colors">
                        <span className="text-[10px] text-[#77716B] font-medium flex items-center justify-center space-x-1">
                          <Candy className="w-3 h-3 text-[#F58220]" />
                          <span>Sugar</span>
                        </span>
                        <span className="font-extrabold text-[#252525] block mt-0.5">1.8 g</span>
                        <span className="text-[9px] text-[#77716B] block">~0.45 tsp</span>
                      </div>

                      <div className="bg-[#FFFAF5] p-2.5 rounded-xl border border-[#252525]/6 hover:border-[#FFAB66]/40 transition-colors">
                        <span className="text-[10px] text-[#77716B] font-medium flex items-center justify-center space-x-1">
                          <Apple className="w-3 h-3 text-[#22A447]" />
                          <span>Sat Fat</span>
                        </span>
                        <span className="font-extrabold text-[#252525] block mt-0.5">4.8 g</span>
                        <span className="text-[9px] text-[#77716B] block">Palm oil used</span>
                      </div>
                    </div>

                    {/* Evidence-Based Claim Check Snippet */}
                    <div className="p-3 bg-amber-50 rounded-xl border border-[#F2B544]/30 text-xs text-amber-950 space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#F2B544]" />
                        <span>FSSAI Claim Check: "Made with Dal & Corn"</span>
                      </div>
                      <p className="text-[11px] text-amber-900/80 leading-tight">
                        Potential Mismatch: Ingredients list shows Rice Meal (43%) first, whereas Gram Dal is merely 3%.
                      </p>
                    </div>

                    {/* Healthy Indian Alternative Recommendation */}
                    <div className="p-3 bg-[#EAF8EE] rounded-xl border border-[#22A447]/20 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xl">🥣</span>
                        <div>
                          <span className="font-bold text-[#22A447] block">Healthier Swap</span>
                          <span className="text-[11px] text-[#252525]">Roasted Makhana (80% less sat fat)</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTestScan()}
                        className="text-xs font-bold text-[#22A447] hover:underline flex items-center space-x-0.5"
                      >
                        <span>Explore</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleTestScan()}
                      className="w-full py-2.5 bg-[#F58220] hover:bg-[#e07114] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <span>View Full Intelligence Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#F58220] uppercase tracking-wider">
            Step-by-Step Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1 tracking-tight">
            How WhatsInit Works
          </h2>
          <p className="text-xs sm:text-sm text-[#77716B] mt-1.5">
            From capturing a back-of-pack photo to personalized Indian diet swaps in under 10 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="spotlight-card p-6 rounded-2xl border border-[#252525]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#F58220] font-extrabold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-[#252525]">Scan or Upload Label</h3>
            <p className="text-xs text-[#77716B] leading-relaxed">
              Use your smartphone camera or upload an image of the nutrition table and ingredients list.
            </p>
          </div>

          {/* Step 2 */}
          <div className="spotlight-card p-6 rounded-2xl border border-[#252525]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#F58220] font-extrabold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-[#252525]">Review Extracted OCR</h3>
            <p className="text-xs text-[#77716B] leading-relaxed">
              Verify numbers before analysis. Nothing is fabricated or guessed; you inspect the evidence.
            </p>
          </div>

          {/* Step 3 */}
          <div className="spotlight-card p-6 rounded-2xl border border-[#252525]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#F58220] font-extrabold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-[#252525]">Plain-Language Analysis</h3>
            <p className="text-xs text-[#77716B] leading-relaxed">
              Understand sugars in level teaspoons, sodium in salt equivalents, and check marketing claims against FSSAI.
            </p>
          </div>

          {/* Step 4 */}
          <div className="spotlight-card p-6 rounded-2xl border border-[#252525]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#F58220] font-extrabold flex items-center justify-center text-sm">
              04
            </div>
            <h3 className="text-sm font-bold text-[#252525]">Smart Swaps & Recipes</h3>
            <p className="text-xs text-[#77716B] leading-relaxed">
              Discover cleaner Indian alternatives, generate budget-friendly recipes, or book verified dietitians.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE PILLARS & FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#F58220] uppercase tracking-wider">
            All-In-One Platform
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1 tracking-tight">
            Designed for Modern Indian Food Realities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="spotlight-card p-6 rounded-2xl border border-[#252525]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#F58220] flex items-center justify-center">
              <FileSearch className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#252525]">FSSAI Claim Verification</h3>
            <p className="text-xs text-[#77716B] leading-relaxed">
              We audit claims like "High Protein", "No Added Sugar", and "100% Whole Wheat" against the exact descending ingredient order and statutory thresholds.
            </p>
            <button
              onClick={() => setActiveTab('claims')}
              className="text-xs text-[#F58220] font-bold hover:underline flex items-center space-x-1 pt-1"
            >
              <span>Explore Claim Engine</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="spotlight-card p-6 rounded-2xl border border-[#252525]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#F58220] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#252525]">Healthier Indian Alternatives</h3>
            <p className="text-xs text-[#77716B] leading-relaxed">
              Swap fried namkeen for roasted makhana or bhuna chana. Compare prices, sodium density, and protein on normalized 100g charts.
            </p>
            <button
              onClick={() => setActiveTab('alternatives')}
              className="text-xs text-[#F58220] font-bold hover:underline flex items-center space-x-1 pt-1"
            >
              <span>View Product Comparisons</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="spotlight-card p-6 rounded-2xl border border-[#252525]/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#F58220] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#252525]">Dietitian Marketplace</h3>
            <p className="text-xs text-[#77716B] leading-relaxed">
              Connect directly with qualified clinical dietitians (IDA members) specializing in Diabetes reversal, PCOS, cardiac care, and sports nutrition.
            </p>
            <button
              onClick={() => setActiveTab('dietitians')}
              className="text-xs text-[#F58220] font-bold hover:underline flex items-center space-x-1 pt-1"
            >
              <span>Find a Dietitian</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: FOR CONSUMERS & CLINICAL DIETITIANS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#252525] to-[#38332E] text-white rounded-3xl p-8 sm:p-12 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFAB66]">
                Two Dedicated Ecosystems
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Empowering Indian Consumers & Nutrition Practitioners
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Whether you are a health-conscious shopper deciphering breakfast cereals or a newly qualified dietitian building your first clinical client base, WhatsInit provides the infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-xs space-y-2 border border-white/10">
                <span className="font-bold text-[#FFD2AC] block text-sm">For Consumers</span>
                <p className="text-white/80 leading-relaxed">
                  Decipher food packets, verify claims, get portion guidance, plan weekly menus, and generate smart grocery lists.
                </p>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="mt-2 text-[#FFAB66] hover:text-white font-bold flex items-center space-x-1 transition-colors"
                >
                  <span>Start Scanning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-xs space-y-2 border border-white/10">
                <span className="font-bold text-[#FFD2AC] block text-sm">For Dietitians</span>
                <p className="text-white/80 leading-relaxed">
                  Start with a 100% free basic profile, display verified council credentials, receive booking requests, and upload diet plans.
                </p>
                <button
                  onClick={() => setActiveTab('for-dietitians')}
                  className="mt-2 text-[#FFAB66] hover:text-white font-bold flex items-center space-x-1 transition-colors"
                >
                  <span>Join as Dietitian</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PREMIUM PREVIEW (₹89/month) */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs font-bold text-[#F58220] uppercase tracking-wider">
          Fair & Affordable
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252525]">
          Consumer Premium at Just ₹89/month
        </h2>
        <p className="text-xs sm:text-sm text-[#77716B] max-w-xl mx-auto">
          No heavy annual commitments. Cancel anytime. Unlocks unmetered scans, deep claim verifications, and weekly meal plan exports.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('premium')}
            className="px-6 py-3.5 bg-[#F58220] hover:bg-[#e07114] text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center space-x-2"
          >
            <Crown className="w-4 h-4 text-white" />
            <span>Explore Premium – ₹89/month</span>
          </button>
        </div>
      </section>

      {/* SECTION 6: SAMPLE TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#77716B] bg-[#FFF0E3] text-[#F58220] px-2.5 py-0.5 rounded border border-[#FFAB66]/30">
              Community Feedback
            </span>
            <h2 className="text-xl font-bold text-[#252525] mt-1">What Indian Families Are Saying</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="spotlight-card p-5 rounded-2xl border border-[#252525]/10 shadow-xs space-y-3">
            <p className="text-xs text-[#252525] italic leading-relaxed">
              "Finally an app that converts the 10g sugar on biscuit packets into level teaspoons (2.5 tsp)! It immediately made me rethink what I give my children before school."
            </p>
            <div className="text-[11px] pt-2 border-t border-[#252525]/5">
              <span className="font-bold text-[#252525] block">Priyanka Deshmukh</span>
              <span className="text-[#77716B]">Mother & Consumer, Pune</span>
            </div>
          </div>

          <div className="spotlight-card p-5 rounded-2xl border border-[#252525]/10 shadow-xs space-y-3">
            <p className="text-xs text-[#252525] italic leading-relaxed">
              "As someone managing hypertension, spotting that one instant noodle pack had over 820mg of sodium was eye-opening. The estimated salt breakdown is so useful."
            </p>
            <div className="text-[11px] pt-2 border-t border-[#252525]/5">
              <span className="font-bold text-[#252525] block">Rohan Mehta</span>
              <span className="text-[#77716B]">Software Engineer, Bengaluru</span>
            </div>
          </div>

          <div className="spotlight-card p-5 rounded-2xl border border-[#252525]/10 shadow-xs space-y-3">
            <p className="text-xs text-[#252525] italic leading-relaxed">
              "WhatsInit helps me connect with clients who are serious about nutritional science rather than fad starvation diets. The meal plan upload feature saves me hours."
            </p>
            <div className="text-[11px] pt-2 border-t border-[#252525]/5">
              <span className="font-bold text-[#252525] block">Dr. Ananya Sharma, R.D.</span>
              <span className="text-[#77716B]">Clinical Nutritionist, Mumbai</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#252525]">Frequently Asked Questions</h2>
          <p className="text-xs text-[#77716B] mt-1">Clear answers regarding data sources and regulations.</p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-white rounded-xl border border-[#252525]/10 space-y-1">
            <h4 className="font-bold text-[#252525]">How does WhatsInit verify packaging claims?</h4>
            <p className="text-[#77716B] leading-relaxed">
              We extract declared ingredients and nutritional values via OCR and compare them against the statutory benchmarks defined in the FSSAI Advertising and Claims Regulations (2018).
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#252525]/10 space-y-1">
            <h4 className="font-bold text-[#252525]">Does having an FSSAI license guarantee a food is 100% healthy?</h4>
            <p className="text-[#77716B] leading-relaxed">
              No. An FSSAI license indicates regulatory registration and manufacturing compliance; it does not mean the food is low in sugar, low in salt, or independently lab-tested for every batch.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#252525]/10 space-y-1">
            <h4 className="font-bold text-[#252525]">Can WhatsInit diagnose diabetes or medical conditions?</h4>
            <p className="text-[#77716B] leading-relaxed">
              No. WhatsInit is strictly an educational nutrition intelligence tool. We never diagnose illnesses or prescribe medication. We connect you with qualified clinical dietitians for individual medical nutrition therapy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
