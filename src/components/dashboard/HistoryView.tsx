import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  Trash2,
  Calendar,
  ChevronRight,
  Sparkles,
  Scan,
} from 'lucide-react';
import { BackButton } from '../common/BackButton';

export const HistoryView: React.FC = () => {
  const { scanHistory, deleteScanFromHistory, setActiveScan, setActiveTab, consultationBookings } = useApp();

  const handleOpenScan = (scan: any) => {
    setActiveScan(scan);
    setActiveTab('report');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="dashboard" label="Back to Dashboard" />
      </div>

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-[#FFF0E3] text-[#F58220] px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-2 border border-[#FFAB66]/30">
            <History className="w-3.5 h-3.5" />
            <span>Activity Archives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
            Scan & Consultation History
          </h1>
          <p className="text-xs sm:text-sm text-[#77716B] mt-1">
            Review past packaged food intelligence reports and upcoming clinical dietitian appointments.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('scanner')}
          className="px-5 py-2.5 bg-[#F58220] text-white text-xs font-bold rounded-xl hover:bg-[#e07116] shadow-md shadow-[#F58220]/20 self-start sm:self-auto flex items-center space-x-2 transition-all hover:scale-[1.02]"
        >
          <Scan className="w-4 h-4" />
          <span>Scan New Food Item</span>
        </button>
      </div>

      {/* Booked Consultations */}
      {consultationBookings.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-7 space-y-4 spotlight-card">
          <div className="flex items-center space-x-2.5 text-[#F58220]">
            <Calendar className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#252525]">
              Clinical Dietitian Consultations ({consultationBookings.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {consultationBookings.map((bk) => (
              <div
                key={bk.id}
                className="p-4 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#252525] text-sm">{bk.dietitianName}</span>
                    <span className="text-[10px] bg-[#EAF8EE] text-[#22A447] px-2.5 py-0.5 rounded-full font-bold border border-[#22A447]/20">
                      {bk.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#77716B] mt-1">
                    {bk.consultationDate} at {bk.timeSlot} • {bk.format} • Ref: <span className="font-mono text-[#252525]">{bk.id}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-extrabold text-[#252525] text-sm">₹{bk.feeInr}</span>
                  <button
                    onClick={() => setActiveTab('dietitians')}
                    className="text-xs text-[#F58220] hover:underline font-bold"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scanned Food Products List */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#252525]/10 p-5 sm:p-7 space-y-5 spotlight-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
          Scanned Food Products ({scanHistory.length})
        </h3>

        {scanHistory.length === 0 ? (
          <div className="text-center py-12 text-xs sm:text-sm text-[#77716B] space-y-3">
            <p>No scans recorded yet.</p>
            <button
              onClick={() => setActiveTab('scanner')}
              className="px-4 py-2 bg-[#FFF0E3] text-[#F58220] font-bold rounded-xl text-xs hover:bg-[#ffe3cc] transition-colors"
            >
              Scan your first packaged food
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {scanHistory.map((scan) => (
              <div
                key={scan.id}
                className="p-4 sm:p-5 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 hover:border-[#F58220]/50 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs group"
              >
                <div
                  onClick={() => handleOpenScan(scan)}
                  className="cursor-pointer flex-1 space-y-1.5"
                >
                  <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                    <span className="font-bold text-[#252525] text-sm group-hover:text-[#F58220] transition-colors">
                      {scan.productName}
                    </span>
                    <span className="text-[10px] bg-[#FFF0E3] text-[#F58220] px-2.5 py-0.5 rounded-full font-bold border border-[#FFAB66]/30">
                      {scan.category}
                    </span>
                    {scan.fssaiLicenseNumber && (
                      <span className="text-[10px] font-mono text-[#77716B] bg-white px-2 py-0.5 rounded border border-[#252525]/10">
                        FSSAI: {scan.fssaiLicenseNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#77716B]">{scan.brand} • Serving: {scan.servingSize}</p>
                  <div className="flex items-center space-x-3 text-xs text-[#252525] flex-wrap">
                    <span className="font-bold">{scan.nutritionSnapshot.energyKcal} kcal</span>
                    <span>•</span>
                    <span>Sat Fat: {scan.nutritionSnapshot.saturatedFatG}g</span>
                    <span>•</span>
                    <span className="text-[#F2B544] font-bold">Sodium: {scan.nutritionSnapshot.sodiumMg}mg</span>
                    <span>•</span>
                    <span className="text-[#22A447] font-bold">Protein: {scan.nutritionSnapshot.proteinG}g</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 self-start sm:self-auto">
                  <button
                    onClick={() => handleOpenScan(scan)}
                    className="px-4 py-2 bg-[#F58220] text-white rounded-xl text-xs font-bold hover:bg-[#e07116] flex items-center space-x-1.5 transition-all shadow-xs"
                  >
                    <span>View Report</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteScanFromHistory(scan.id!)}
                    className="p-2 text-[#77716B] hover:text-[#E65A50] hover:bg-red-50 rounded-xl transition-colors"
                    title="Remove scan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
