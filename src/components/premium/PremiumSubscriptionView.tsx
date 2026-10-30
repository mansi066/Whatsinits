import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BackButton } from '../common/BackButton';
import {
  Crown,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  HelpCircle,
  CreditCard,
  QrCode,
  Check,
} from 'lucide-react';

export const PremiumSubscriptionView: React.FC = () => {
  const { user, upgradeToPremium } = useApp();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('mansi@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      upgradeToPremium();
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setCheckoutOpen(false);
        setPaymentSuccess(false);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Back Button */}
      <BackButton fallbackTab="home" label="Back to Home" />

      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 bg-[#FFF0E3] text-[#F58220] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Crown className="w-4 h-4 text-[#F58220]" />
          <span>WhatsInit Premium Consumer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#252525] tracking-tight">
          Supercharge Your Family's Food Intelligence
        </h1>
        <p className="text-sm text-[#77716B] leading-relaxed">
          Upgrade to deeper FSSAI claim evaluations, unmetered food scans, personalized weekly meal planning, and access to verified clinical dietitians.
        </p>
      </div>

      {/* Pricing Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free Plan */}
        <div className="spotlight-card rounded-2xl p-6 sm:p-8 border border-[#252525]/10 shadow-xs flex flex-col justify-between space-y-6 bg-white">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-[#252525]">Standard Free</h3>
              <span className="text-[11px] text-[#77716B] bg-[#FFFAF5] px-2 py-0.5 rounded font-semibold">
                Always Free
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#252525]">
              ₹0 <span className="text-xs text-[#77716B] font-normal">/forever</span>
            </div>
            <p className="text-xs text-[#77716B] mt-2">
              Essential label reading and basic healthy alternatives for everyday grocery shoppers.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-[#252525]">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                <span>Basic Food Scanner (up to 5 scans/month)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                <span>Standard Nutrition Snapshot (Sugar, Salt, Fat)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                <span>Top 3 Healthy Food Alternatives</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                <span>Official FSSAI Portal Verification link</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-2.5 border border-[#252525]/15 bg-[#FFFAF5] text-[#77716B] text-xs font-semibold rounded-xl"
          >
            {user?.isPremium ? 'Included' : 'Current Active Plan'}
          </button>
        </div>

        {/* Premium Plan (₹89/month) */}
        <div className="spotlight-card rounded-2xl p-6 sm:p-8 border-2 border-[#F58220] shadow-lg flex flex-col justify-between space-y-6 relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 bg-[#F58220] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-bl-xl shadow-xs">
            Recommended
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-[#F58220]">WhatsInit Premium</h3>
                <Crown className="w-4 h-4 text-[#F58220] fill-[#F58220]" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#252525]">
              ₹89 <span className="text-xs text-[#77716B] font-normal">/month (Cancel anytime)</span>
            </div>
            <p className="text-xs text-[#77716B] mt-2">
              Unrestricted food intelligence, evidence-based claim verification, and full meal planning.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-[#252525]">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                <span><strong>Unlimited Camera & Label Scans</strong></span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                <span><strong>Advanced Food Claim Analysis</strong> (FSSAI Schedule V cross-check)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                <span>Personalized Weekly Meal Plans & Scaled Recipes</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                <span>Automatic Consolidated Grocery List with Budget Sync</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                <span>Full Scan & Consultation History Archive</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
                <span>Priority Access to Verified Dietitians Discovery</span>
              </li>
            </ul>
          </div>

          {user?.isPremium ? (
            <div className="p-3 bg-[#EAF8EE] border border-[#22A447]/30 rounded-xl text-center text-xs font-bold text-[#22A447] flex items-center justify-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22A447]" />
              <span>You are an Active Premium Member</span>
            </div>
          ) : (
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full py-3 bg-[#F58220] hover:bg-[#e07114] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Upgrade to Premium – ₹89/month</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Transparent Consultation Clarification */}
      <div className="max-w-3xl mx-auto p-4 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 text-[11px] text-[#77716B] flex items-start space-x-2.5">
        <HelpCircle className="w-4 h-4 text-[#F58220] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Transparent Practitioner Policy:</strong> The ₹89/month consumer tier grants full access to the AI label analysis tools, claim engine, weekly meal planners, and dietitian discovery platform. Dedicated 1-on-1 human dietitian consultations carry separate session fees (typically ₹499 - ₹999) paid directly for the professional's clinical time.
        </p>
      </div>

      {/* Simulated Indian Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-[#252525]/10">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FFFAF5] border-b border-[#252525]/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-[#F58220]" />
                <h3 className="text-sm font-bold text-[#252525]">WhatsInit Premium – ₹89/month</h3>
              </div>
              <button onClick={() => setCheckoutOpen(false)} className="text-[#77716B] text-xs hover:text-[#252525]">
                Cancel
              </button>
            </div>

            {paymentSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#EAF8EE] text-[#22A447] flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#252525]">Subscription Activated!</h4>
                <p className="text-xs text-[#77716B]">
                  Welcome to WhatsInit Premium. Unlimited food scanning and claim verification is now active on your account.
                </p>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} className="p-6 space-y-4 text-xs">
                {/* Order Summary */}
                <div className="p-3 bg-[#FFFAF5] rounded-xl border border-[#252525]/8 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#252525] block">WhatsInit Monthly Premium</span>
                    <span className="text-[11px] text-[#77716B]">Auto-renews monthly • Cancel anytime</span>
                  </div>
                  <span className="text-base font-extrabold text-[#F58220]">₹89.00</span>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block font-semibold text-[#252525] mb-1.5">
                    Select Indian Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-lg border text-center font-bold flex flex-col items-center space-y-1 transition-colors ${
                        paymentMethod === 'upi'
                          ? 'border-[#F58220] bg-[#FFF0E3] text-[#F58220]'
                          : 'border-[#252525]/15 text-[#77716B]'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>UPI / QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-lg border text-center font-bold flex flex-col items-center space-y-1 transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-[#F58220] bg-[#FFF0E3] text-[#F58220]'
                          : 'border-[#252525]/15 text-[#77716B]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>RuPay / Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-2.5 rounded-lg border text-center font-bold flex flex-col items-center space-y-1 transition-colors ${
                        paymentMethod === 'netbanking'
                          ? 'border-[#F58220] bg-[#FFF0E3] text-[#F58220]'
                          : 'border-[#252525]/15 text-[#77716B]'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>NetBanking</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'upi' ? (
                  <div>
                    <label className="block font-semibold text-[#252525] mb-1">
                      Enter UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi, name@okhdfcbank"
                      className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg outline-none focus:ring-1 focus:ring-[#F58220]"
                    />
                    <p className="text-[10px] text-[#77716B] mt-1">
                      Supported: Google Pay, PhonePe, Paytm, BHIM UPI
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold text-[#252525] mb-1">Card Details</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8821"
                      className="w-full px-3 py-2 border border-[#252525]/15 rounded-lg outline-none mb-2 focus:ring-1 focus:ring-[#F58220]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="px-3 py-2 border border-[#252525]/15 rounded-lg outline-none focus:ring-1 focus:ring-[#F58220]"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-3 py-2 border border-[#252525]/15 rounded-lg outline-none focus:ring-1 focus:ring-[#F58220]"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-1.5 text-[10px] text-[#77716B]">
                  <Lock className="w-3.5 h-3.5 text-[#22A447]" />
                  <span>256-Bit SSL Encrypted Indian Payment Gateway Simulator</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#F58220] hover:bg-[#e07114] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>{isProcessing ? 'Processing Payment...' : 'Pay ₹89 Securely'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
