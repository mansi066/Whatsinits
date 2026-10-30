import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DietitianProfile } from '../../types';
import { DietitianBookingModal } from './DietitianBookingModal';
import { BackButton } from '../common/BackButton';
import {
  Users,
  Search,
  Filter,
  Star,
  CheckCircle2,
  Calendar,
  Languages,
  MapPin,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Video,
} from 'lucide-react';

export const DietitianMarketplace: React.FC = () => {
  const { dietitians, setActiveTab } = useApp();

  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [maxFee, setMaxFee] = useState<number>(1200);
  const [selectedDietitian, setSelectedDietitian] = useState<DietitianProfile | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const specializationsList = [
    'All',
    'Diabetes Management',
    'Weight Management',
    'PCOS / PCOD',
    'Sports Nutrition',
    'Gut Health',
    'Hypertension & Cardiac Care',
  ];

  const filteredDietitians = dietitians.filter((d) => {
    const matchSpec =
      selectedSpecialization === 'All' ||
      d.specializations.some((s) => s.toLowerCase().includes(selectedSpecialization.toLowerCase()));
    const matchLang =
      selectedLanguage === 'All' || d.languages.includes(selectedLanguage);
    const matchFee = d.consultationFeeInr <= maxFee;
    return matchSpec && matchLang && matchFee;
  });

  const handleOpenBooking = (dietitian: DietitianProfile) => {
    setSelectedDietitian(dietitian);
    setBookingModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Back Button */}
      <BackButton fallbackTab="home" label="Back to Home" />

      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-[#FFF0E3] text-[#F58220] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-[#F58220]" />
            <span>Clinical Nutrition Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
            Consult Verified Indian Clinical Dietitians
          </h1>
          <p className="text-xs sm:text-sm text-[#77716B] mt-1">
            Connect with certified nutrition professionals (IDA Registered) for personalized medical nutrition therapy, hormonal health, and clinical meal plans.
          </p>
        </div>

        {/* Join as Dietitian CTA */}
        <button
          onClick={() => setActiveTab('for-dietitians')}
          className="px-4 py-2.5 border border-[#F58220]/40 bg-[#FFF0E3]/50 hover:bg-[#FFF0E3] text-[#F58220] text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <Briefcase className="w-4 h-4 text-[#F58220]" />
          <span>Are You a Dietitian? Join Marketplace</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="spotlight-card rounded-2xl shadow-xs border border-[#252525]/10 p-4 sm:p-5 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Specialization Filter */}
          <div>
            <label className="block font-semibold text-[#252525] mb-1">Area of Expertise</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg bg-[#FFFAF5] outline-none focus:ring-1 focus:ring-[#F58220]"
            >
              {specializationsList.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block font-semibold text-[#252525] mb-1">Language Spoken</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg bg-[#FFFAF5] outline-none focus:ring-1 focus:ring-[#F58220]"
            >
              <option value="All">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
              <option value="Telugu">Telugu</option>
              <option value="Tamil">Tamil</option>
              <option value="Malayalam">Malayalam</option>
            </select>
          </div>

          {/* Fee Range Slider */}
          <div>
            <div className="flex justify-between font-semibold text-[#252525] mb-1">
              <span>Max Session Fee:</span>
              <span className="text-[#F58220] font-bold">₹{maxFee}</span>
            </div>
            <input
              type="range"
              min={400}
              max={1500}
              step={50}
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="w-full accent-[#F58220] mt-1.5 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Dietitians Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDietitians.map((dietitian) => (
          <div
            key={dietitian.id}
            className="spotlight-card rounded-2xl p-5 sm:p-6 border border-[#252525]/10 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#F58220] transition-colors bg-white"
          >
            <div>
              {/* Profile Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF0E3] text-[#F58220] font-bold text-lg flex items-center justify-center shrink-0 overflow-hidden border border-[#FFAB66]/30">
                    {dietitian.avatarUrl ? (
                      <img
                        src={dietitian.avatarUrl}
                        alt={dietitian.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      dietitian.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-sm font-bold text-[#252525]">{dietitian.name}</h3>
                      {dietitian.verificationStatus === 'Verified' && (
                        <span className="inline-flex items-center space-x-1 bg-[#EAF8EE] text-[#22A447] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#22A447]/30">
                          <CheckCircle2 className="w-3 h-3 text-[#22A447]" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#F58220] font-semibold mt-0.5">{dietitian.title}</p>
                    <p className="text-[11px] text-[#77716B]">{dietitian.qualification} • {dietitian.institution}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-[#F58220] block">
                    ₹{dietitian.consultationFeeInr}
                  </span>
                  <span className="text-[10px] text-[#77716B]">per session</span>
                </div>
              </div>

              {/* Badges: Council Registration & Experience */}
              <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="bg-[#FFF0E3] text-[#F58220] font-mono px-2 py-0.5 rounded font-bold">
                  {dietitian.registrationCouncilNumber}
                </span>
                <span className="bg-[#FFFAF5] text-[#77716B] px-2 py-0.5 rounded border border-[#252525]/8 font-medium">
                  {dietitian.experienceYears} Years Experience
                </span>
                <span className="bg-[#FFFAF5] text-[#77716B] px-2 py-0.5 rounded border border-[#252525]/8 flex items-center space-x-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{dietitian.rating} ({dietitian.reviewsCount})</span>
                </span>
                <span className="bg-[#FFFAF5] text-[#77716B] px-2 py-0.5 rounded border border-[#252525]/8 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{dietitian.location}</span>
                </span>
              </div>

              {/* Bio */}
              <p className="mt-3 text-xs text-[#252525] leading-relaxed line-clamp-2">
                {dietitian.bio}
              </p>

              {/* Specializations Pills */}
              <div className="mt-3 flex flex-wrap gap-1">
                {dietitian.specializations.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-stone-100 text-[#252525] px-2 py-0.5 rounded-full font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Languages */}
              <div className="mt-2.5 text-[11px] text-[#77716B] flex items-center space-x-1.5">
                <Languages className="w-3.5 h-3.5 text-slate-400" />
                <span>Languages: {dietitian.languages.join(', ')}</span>
              </div>
            </div>

            {/* Book Button */}
            <div className="pt-3 border-t border-[#252525]/8 flex items-center justify-between">
              <span className="text-[11px] text-[#77716B]">
                Formats: {dietitian.consultationFormats.join(' • ')}
              </span>
              <button
                onClick={() => handleOpenBooking(dietitian)}
                className="px-4 py-2 bg-[#F58220] hover:bg-[#e07114] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1 transition-colors active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Slot</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDietitians.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#252525]/10">
          <p className="text-xs text-[#77716B]">No dietitians match your chosen filters.</p>
          <button
            onClick={() => {
              setSelectedSpecialization('All');
              setSelectedLanguage('All');
              setMaxFee(1200);
            }}
            className="mt-2 text-xs text-[#F58220] font-bold underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {selectedDietitian && (
        <DietitianBookingModal
          dietitian={selectedDietitian}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
};
