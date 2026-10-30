import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BackButton } from '../common/BackButton';
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Upload,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  AlertCircle,
  Plus,
} from 'lucide-react';

export const ForDietitiansView: React.FC = () => {
  const { dietitian, currentRole, consultationBookings, openAuthModal } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'mealplans' | 'profile'>('overview');
  const [uploadedPlans, setUploadedPlans] = useState<{ id: string; clientName: string; planTitle: string; date: string }[]>([
    {
      id: 'plan-1',
      clientName: 'Mansi Singhal',
      planTitle: 'Pre-Diabetes Reversal Low-GI Vegetarian Diet Plan.pdf',
      date: '2026-10-28',
    },
  ]);
  const [newPlanClient, setNewPlanClient] = useState('');
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [planUploadSuccess, setPlanUploadSuccess] = useState(false);

  // If not logged in as dietitian, show the Dietitian Portal Landing / Registration Prompt
  if (currentRole !== 'dietitian' || !dietitian) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
        {/* Back Button */}
        <BackButton fallbackTab="dietitians" label="Back to Dietitians Network" />

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 bg-[#FFF0E3] text-[#F58220] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-[#F58220]" />
            <span>WhatsInit for Clinical Dietitians</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#252525] tracking-tight">
            Grow Your Clinical Nutrition Practice in India
          </h1>
          <p className="text-sm text-[#77716B] leading-relaxed">
            Support newly qualified and independent registered dietitians. Publish verified credentials, manage client appointments, and deliver evidence-based meal plans with zero hidden cuts.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openAuthModal('dietitian')}
              className="px-6 py-3 bg-[#F58220] hover:bg-[#e07114] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Create Free Dietitian Profile
            </button>
            <button
              onClick={() => openAuthModal('dietitian')}
              className="px-5 py-3 border border-[#252525]/15 hover:bg-white text-[#252525] text-xs font-semibold rounded-xl"
            >
              Dietitian Log In
            </button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="spotlight-card p-6 rounded-2xl border border-[#252525]/10 shadow-xs space-y-2 bg-white">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#F58220] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-[#F58220]" />
            </div>
            <h3 className="text-sm font-bold text-[#252525]">Verified IDA Credentials</h3>
            <p className="text-xs text-[#77716B] leading-relaxed">
              Stand out from uncertified online influencers. Display your Indian Dietetic Association or state registration badge proudly.
            </p>
          </div>

          <div className="spotlight-card p-6 rounded-2xl border border-[#252525]/10 shadow-xs space-y-2 bg-white">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#F58220] flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5 text-[#F58220]" />
            </div>
            <h3 className="text-sm font-bold text-[#252525]">Flexible Client Scheduling</h3>
            <p className="text-xs text-[#77716B] leading-relaxed">
              Set your own consultation fees, available days, and preferred consultation formats (Video, Phone, or Clinic).
            </p>
          </div>

          <div className="spotlight-card p-6 rounded-2xl border border-[#252525]/10 shadow-xs space-y-2 bg-white">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#F58220] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-[#F58220]" />
            </div>
            <h3 className="text-sm font-bold text-[#252525]">Client Plan Uploads</h3>
            <p className="text-xs text-[#77716B] leading-relaxed">
              Upload PDF meal plans and lab reviews directly to your clients' WhatsInit personal dashboards.
            </p>
          </div>
        </div>

        {/* Transparent Pricing Table */}
        <div className="bg-[#FFFAF5] rounded-2xl p-6 sm:p-8 border border-[#252525]/10 text-center space-y-4">
          <h2 className="text-lg font-bold text-[#252525]">Transparent Practitioner Tiers</h2>
          <p className="text-xs text-[#77716B] max-w-xl mx-auto">
            Newly qualified dietitians can start with a 100% free basic profile. No commissions deducted from initial client consultations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left text-xs pt-2">
            <div className="bg-white p-5 rounded-xl border border-[#252525]/10 shadow-xs space-y-3">
              <span className="font-bold text-[#F58220] text-sm block">Basic Practitioner (Free)</span>
              <div className="text-2xl font-extrabold text-[#252525]">₹0</div>
              <ul className="space-y-1.5 text-[#77716B] text-[11px]">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22A447]" />
                  <span>Verified Public Profile</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22A447]" />
                  <span>Up to 10 Client Bookings/month</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22A447]" />
                  <span>Meal Plan Upload Tools</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border-2 border-[#F58220] shadow-xs space-y-3">
              <span className="font-bold text-[#F58220] text-sm block">Pro Clinical (Monthly)</span>
              <div className="text-2xl font-extrabold text-[#252525]">
                ₹499 <span className="text-xs text-[#77716B] font-normal">/month</span>
              </div>
              <ul className="space-y-1.5 text-[#77716B] text-[11px]">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22A447]" />
                  <span>Priority Placement in Search</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22A447]" />
                  <span>Unlimited Client Bookings</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22A447]" />
                  <span>Advanced Patient Analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Dietitian Dashboard View
  const handleUploadPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanClient || !newPlanTitle) return;
    setUploadedPlans((prev) => [
      {
        id: `plan-${Date.now()}`,
        clientName: newPlanClient,
        planTitle: newPlanTitle,
        date: new Date().toISOString().split('T')[0],
      },
      ...prev,
    ]);
    setNewPlanClient('');
    setNewPlanTitle('');
    setPlanUploadSuccess(true);
    setTimeout(() => setPlanUploadSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Back Button */}
      <BackButton fallbackTab="dietitians" label="Back to Dietitians Network" />

      {/* Dietitian Profile Banner */}
      <div className="spotlight-card bg-white rounded-2xl shadow-sm border border-[#252525]/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#F58220] text-white font-bold text-xl flex items-center justify-center">
            {dietitian.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-[#252525]">{dietitian.name}</h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  dietitian.verificationStatus === 'Verified'
                    ? 'bg-[#EAF8EE] text-[#22A447] border border-[#22A447]/30'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {dietitian.verificationStatus}
              </span>
            </div>
            <p className="text-xs text-[#F58220] font-semibold">{dietitian.qualification} • {dietitian.institution}</p>
            <p className="text-[11px] text-[#77716B]">Council Reg: {dietitian.registrationCouncilNumber}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto text-xs">
          <div className="text-right mr-2 hidden sm:block">
            <span className="text-[10px] text-[#77716B] block">Consultation Fee</span>
            <span className="text-sm font-extrabold text-[#F58220]">₹{dietitian.consultationFeeInr}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-[#252525]/10 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'overview'
              ? 'bg-[#F58220] text-white'
              : 'text-[#77716B] hover:text-[#252525] hover:bg-[#FFFAF5]'
          }`}
        >
          Practice Overview
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'bookings'
              ? 'bg-[#F58220] text-white'
              : 'text-[#77716B] hover:text-[#252525] hover:bg-[#FFFAF5]'
          }`}
        >
          Client Bookings ({consultationBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('mealplans')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'mealplans'
              ? 'bg-[#F58220] text-white'
              : 'text-[#77716B] hover:text-[#252525] hover:bg-[#FFFAF5]'
          }`}
        >
          Meal Plan Uploads ({uploadedPlans.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#252525]/10 shadow-xs">
              <span className="text-[11px] text-[#77716B] block">Total Inquiries</span>
              <span className="text-xl font-bold text-[#252525] mt-1 block">24</span>
              <span className="text-[10px] text-[#22A447]">↑ 18% this month</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#252525]/10 shadow-xs">
              <span className="text-[11px] text-[#77716B] block">Confirmed Sessions</span>
              <span className="text-xl font-bold text-[#252525] mt-1 block">{consultationBookings.length}</span>
              <span className="text-[10px] text-[#77716B]">Upcoming slots</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#252525]/10 shadow-xs">
              <span className="text-[11px] text-[#77716B] block">Client Rating</span>
              <span className="text-xl font-bold text-[#252525] mt-1 block">4.9 ★</span>
              <span className="text-[10px] text-[#77716B]">Based on 32 reviews</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#252525]/10 shadow-xs">
              <span className="text-[11px] text-[#77716B] block">Profile Status</span>
              <span className="text-sm font-bold text-[#22A447] mt-1 block">Active on Marketplace</span>
              <span className="text-[10px] text-[#77716B]">All verified</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-[#252525]/10 p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#252525]">Upcoming Consultation Appointments</h3>
          {consultationBookings.length === 0 ? (
            <p className="text-xs text-[#77716B]">No appointments booked yet.</p>
          ) : (
            <div className="space-y-3">
              {consultationBookings.map((bk) => (
                <div key={bk.id} className="p-4 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 flex items-start justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-[#252525]">{bk.userName} ({bk.userEmail})</h4>
                    <p className="text-[11px] text-[#77716B] mt-0.5">
                      {bk.consultationDate} at {bk.timeSlot} • Format: {bk.format}
                    </p>
                    {bk.userBrief && (
                      <p className="text-xs text-stone-700 mt-2 bg-white p-2 rounded border border-[#252525]/5">
                        Client note: "{bk.userBrief}"
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-[#F58220] bg-[#FFF0E3] px-2 py-0.5 rounded text-[10px]">
                    Fee: ₹{bk.feeInr}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'mealplans' && (
        <div className="bg-white rounded-2xl border border-[#252525]/10 p-6 space-y-6">
          <form onSubmit={handleUploadPlan} className="p-4 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 space-y-3 text-xs">
            <h4 className="font-bold text-[#252525]">Upload New Diet Plan / Clinical Review</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Client Name (e.g. Mansi Singhal)"
                value={newPlanClient}
                onChange={(e) => setNewPlanClient(e.target.value)}
                className="px-3 py-2 bg-white border border-[#252525]/15 rounded-lg outline-none focus:ring-1 focus:ring-[#F58220]"
              />
              <input
                type="text"
                placeholder="Plan File Title (e.g. 7-Day Diabetes Reversal Menu.pdf)"
                value={newPlanTitle}
                onChange={(e) => setNewPlanTitle(e.target.value)}
                className="px-3 py-2 bg-white border border-[#252525]/15 rounded-lg outline-none focus:ring-1 focus:ring-[#F58220]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#F58220] text-white font-bold rounded-xl hover:bg-[#e07114] shadow-xs"
            >
              Upload Plan to Client
            </button>
            {planUploadSuccess && (
              <span className="text-[#22A447] font-semibold text-xs ml-3">Plan successfully uploaded!</span>
            )}
          </form>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#77716B] uppercase tracking-wider">Previously Uploaded Client Plans</h4>
            {uploadedPlans.map((p) => (
              <div key={p.id} className="p-3 bg-white rounded-xl border border-[#252525]/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#252525] block">{p.planTitle}</span>
                  <span className="text-[11px] text-[#77716B]">Client: {p.clientName} • Date: {p.date}</span>
                </div>
                <span className="text-[10px] bg-[#EAF8EE] text-[#22A447] px-2 py-0.5 rounded font-bold">Delivered</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
