import React from 'react';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-[#252525] text-white border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#F58220] flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">WhatsInit</span>
            </div>
            <p className="text-xs text-[#FFD2AC] font-medium leading-relaxed">
              Before You Eat It, Know What's In It.
            </p>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Demystifying Indian packaged food labels with transparent evidence, everyday language, and qualified dietitian connectivity.
            </p>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFAB66] mb-3">
              Food Intelligence
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button onClick={() => setActiveTab('scanner')} className="hover:text-[#FFAB66] transition-colors">
                  Smart Food Scanner
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('alternatives')} className="hover:text-[#FFAB66] transition-colors">
                  Healthy Alternatives & Compare
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('recipes')} className="hover:text-[#FFAB66] transition-colors">
                  AI Recipe Generator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('mealplan')} className="hover:text-[#FFAB66] transition-colors">
                  Personalized Meal Planner
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('grocery')} className="hover:text-[#FFAB66] transition-colors">
                  Consolidated Grocery List
                </button>
              </li>
            </ul>
          </div>

          {/* Regulatory & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFAB66] mb-3">
              Safety & Standards
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button onClick={() => setActiveTab('fssai')} className="hover:text-[#FFAB66] transition-colors">
                  FSSAI License Verification
                </button>
              </li>
              <li>
                <a
                  href="https://foscos.fssai.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFAB66] transition-colors inline-flex items-center space-x-1"
                >
                  <span>Official FoSCoS Portal</span>
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>
              </li>
              <li>
                <button onClick={() => setActiveTab('dietitians')} className="hover:text-[#FFAB66] transition-colors">
                  Dietitian Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('for-dietitians')} className="hover:text-[#FFAB66] transition-colors">
                  For Clinical Dietitians
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('premium')} className="hover:text-[#FFAB66] transition-colors">
                  Consumer Premium (₹89/mo)
                </button>
              </li>
            </ul>
          </div>

          {/* Regulatory Disclaimer */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFAB66]">
              Regulatory & Medical Notice
            </h4>
            <p className="text-[11px] text-white/60 leading-relaxed">
              WhatsInit extracts nutrition declarations directly from packaging and cross-references them against ICMR-NIN dietary guidelines and FSSAI standards.
            </p>
            <p className="text-[11px] text-[#FFD2AC]/80 leading-relaxed">
              Educational tool only. Does not replace professional clinical consultations or medical diagnosis. An FSSAI license indicates registration, not an endorsement of personal health suitability.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40">
          <p>© {new Date().getFullYear()} WhatsInit. Built for Indian Consumers & Nutrition Professionals.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span>Privacy First</span>
            <span>•</span>
            <span>Zero Alarmist Jargon</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-[#F58220] fill-[#F58220]" />
              <span>for Healthier India</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
