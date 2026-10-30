import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DietitianProfile } from '../../types';
import {
  X,
  Calendar,
  Clock,
  Video,
  Phone,
  Building,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

interface Props {
  dietitian: DietitianProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const DietitianBookingModal: React.FC<Props> = ({ dietitian, isOpen, onClose }) => {
  const { user, bookConsultation } = useApp();

  const [selectedDate, setSelectedDate] = useState('2026-11-04');
  const [selectedSlot, setSelectedSlot] = useState(dietitian.availableTimeSlots[0] || '10:00 AM');
  const [selectedFormat, setSelectedFormat] = useState<'Video Call' | 'Voice Call' | 'In-Clinic'>('Video Call');
  const [userBrief, setUserBrief] = useState('');
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const id = bookConsultation({
      dietitianId: dietitian.id,
      dietitianName: dietitian.name,
      dietitianSpecialization: dietitian.specializations[0] || 'Clinical Nutrition',
      userId: user?.id || 'guest-user',
      userName: user?.name || 'Mansi Singhal',
      userEmail: user?.email || 'mansi@example.com',
      consultationDate: selectedDate,
      timeSlot: selectedSlot,
      format: selectedFormat,
      feeInr: dietitian.consultationFeeInr,
      status: 'Confirmed',
      userBrief: userBrief || 'Consultation regarding personalized Indian diet and metabolic health goals.',
    });
    setConfirmedId(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#252525]/10">
        {/* Header with Back button option */}
        <div className="px-6 py-4 bg-[#FFFAF5] border-b border-[#252525]/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#77716B] hover:text-[#F58220] hover:bg-[#FFF0E3] transition-colors"
              title="Back to Dietitian Profile"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-[#F58220] text-white flex items-center justify-center font-bold text-xs">
              Rx
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#252525]">Book Dietitian Consultation</h3>
              <p className="text-[11px] text-[#77716B]">{dietitian.name} • {dietitian.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#77716B] hover:text-[#252525]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {confirmedId ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF8EE] text-[#22A447] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#252525]">Consultation Slot Confirmed!</h4>
                <p className="text-xs text-[#77716B] mt-1">
                  Booking Reference: <strong className="font-mono text-[#F58220]">{confirmedId}</strong>
                </p>
              </div>

              <div className="bg-[#FFFAF5] p-4 rounded-xl border border-[#252525]/8 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Dietitian:</span>
                  <span className="font-bold text-[#252525]">{dietitian.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Date & Time:</span>
                  <span className="font-bold text-[#252525]">{selectedDate} at {selectedSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Format:</span>
                  <span className="font-bold text-[#252525]">{selectedFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77716B]">Consultation Fee:</span>
                  <span className="font-bold text-[#F58220]">₹{dietitian.consultationFeeInr} (Pay at session)</span>
                </div>
              </div>

              <p className="text-[11px] text-[#77716B]">
                An appointment reminder has been added to your WhatsInit dashboard.
              </p>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-[#F58220] text-white text-xs font-bold rounded-xl hover:bg-[#e07114] shadow-xs"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              {/* Fee notice */}
              <div className="p-3 bg-[#FFF0E3]/60 rounded-xl border border-[#FFAB66]/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F58220] block">Consultation Fee</span>
                  <span className="text-[11px] text-[#77716B]">45-min dedicated clinical session</span>
                </div>
                <span className="text-base font-extrabold text-[#F58220]">
                  ₹{dietitian.consultationFeeInr}
                </span>
              </div>

              {/* Consultation Format */}
              <div>
                <label className="block font-semibold text-[#252525] mb-1.5">
                  Consultation Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFormat('Video Call')}
                    className={`py-2 px-2 rounded-lg border text-center font-bold flex flex-col items-center space-y-1 transition-colors ${
                      selectedFormat === 'Video Call'
                        ? 'border-[#F58220] bg-[#FFF0E3] text-[#F58220]'
                        : 'border-[#252525]/15 text-[#77716B]'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFormat('Voice Call')}
                    className={`py-2 px-2 rounded-lg border text-center font-bold flex flex-col items-center space-y-1 transition-colors ${
                      selectedFormat === 'Voice Call'
                        ? 'border-[#F58220] bg-[#FFF0E3] text-[#F58220]'
                        : 'border-[#252525]/15 text-[#77716B]'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Voice Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFormat('In-Clinic')}
                    className={`py-2 px-2 rounded-lg border text-center font-bold flex flex-col items-center space-y-1 transition-colors ${
                      selectedFormat === 'In-Clinic'
                        ? 'border-[#F58220] bg-[#FFF0E3] text-[#F58220]'
                        : 'border-[#252525]/15 text-[#77716B]'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>In-Clinic</span>
                  </button>
                </div>
              </div>

              {/* Date & Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#252525] mb-1">Select Date</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg outline-none bg-[#FFFAF5] focus:ring-1 focus:ring-[#F58220]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#252525] mb-1">Select Time Slot</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg bg-[#FFFAF5] outline-none focus:ring-1 focus:ring-[#F58220]"
                  >
                    {dietitian.availableTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pre-consultation Brief */}
              <div>
                <label className="block font-semibold text-[#252525] mb-1">
                  Health Context or Dietary Goals (Optional)
                </label>
                <textarea
                  rows={3}
                  value={userBrief}
                  onChange={(e) => setUserBrief(e.target.value)}
                  placeholder="e.g. Managing borderline HbA1c (prediabetes), vegetarian diet, looking to improve energy levels..."
                  className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg outline-none text-xs bg-[#FFFAF5] focus:ring-1 focus:ring-[#F58220]"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg text-[10px] text-[#77716B] leading-tight">
                <strong>Booking Assurance:</strong> You are booking a verified Indian Registered Dietitian (IDA). Payment is settled securely at the session.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#F58220] hover:bg-[#e07114] text-white font-bold rounded-xl shadow-xs transition-colors active:scale-95"
              >
                Confirm Appointment Slot
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
