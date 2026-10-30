import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { scanFoodImageOrText } from '../../services/api';
import { FoodAnalysisData } from '../../types';
import { OcrCorrectionModal } from './OcrCorrectionModal';
import { BackButton } from '../common/BackButton';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Maximize2,
  FileText,
  ShieldCheck,
  ScanLine,
  SwitchCamera,
  Smartphone,
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../../data/mockData';

export const FoodScanner: React.FC = () => {
  const { setActiveScan, addScanToHistory, setActiveTab, user } = useApp();

  const [scanMode, setScanMode] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState<FoodAnalysisData | null>(null);
  const [manualText, setManualText] = useState('');

  // Camera facing mode: defaults to 'environment' (back camera for mobile)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [availableCamerasCount, setAvailableCamerasCount] = useState<number>(1);
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera when camera mode is active
  useEffect(() => {
    if (scanMode === 'camera') {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [scanMode]);

  const checkVideoDevices = async () => {
    if (navigator.mediaDevices?.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setAvailableCamerasCount(videoInputs.length);
      } catch (e) {
        console.warn('Could not enumerate media devices:', e);
      }
    }
  };

  const startCamera = async (targetFacing: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported on this device/browser.');
        setScanMode('upload');
        return;
      }

      // First attempt: Prefer target facing mode (environment = back/rear camera on mobile)
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: targetFacing },
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 },
          },
          audio: false,
        });
      } catch (firstErr) {
        console.warn('Exact constraints failed, trying simpler facingMode:', firstErr);
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: targetFacing },
            audio: false,
          });
        } catch (secondErr) {
          console.warn('Simpler facingMode failed, falling back to any available camera:', secondErr);
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video play issue:', playErr);
        }
      }
      setCameraActive(true);
      await checkVideoDevices();
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError('Camera access was denied or is unavailable. You can tap "Take Photo (Mobile Back Camera)" or upload an image.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleCameraFacing = async () => {
    setIsSwitchingCamera(true);
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    await startCamera(nextFacing);
    setIsSwitchingCamera(false);
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedImage(dataUrl);
    stopCamera();
    processImageScan(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
      processImageScan(dataUrl, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const processImageScan = async (imageBase64: string, customMimeType?: string) => {
    setIsAnalyzing(true);
    setAnalysisStep('Scanning label and running OCR extraction...');

    try {
      setTimeout(() => setAnalysisStep('Extracting ingredients list & nutrition facts...'), 800);
      setTimeout(() => setAnalysisStep('Cross-referencing FSSAI regulations & benchmarks...'), 1600);

      const result = await scanFoodImageOrText({
        imageBase64,
        mimeType: customMimeType || 'image/jpeg',
        userProfile: user || undefined,
      });

      if (result.data.isUnclearImage) {
        setIsAnalyzing(false);
        alert(
          result.data.unclearReason ||
            'The packaging text or nutrition label could not be clearly read. Please capture a clear, well-lit photo of the label.'
        );
        return;
      }

      setPendingAnalysis(result.data);
      setIsAnalyzing(false);
      setOcrModalOpen(true);
    } catch (err: any) {
      console.error('Scan error:', err);
      setIsAnalyzing(false);
      alert(err.message || 'Failed to analyze label image. Please try again with a clear photo of the packaging.');
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisStep('Analyzing label text with evidence-based intelligence...');

    try {
      const result = await scanFoodImageOrText({
        rawText: manualText,
        userProfile: user || undefined,
      });

      setPendingAnalysis(result.data);
      setIsAnalyzing(false);
      setOcrModalOpen(true);
    } catch (err) {
      setIsAnalyzing(false);
      alert('Could not parse text. Please check the content and retry.');
    }
  };

  const handleSelectPreset = (preset: FoodAnalysisData) => {
    setPendingAnalysis(preset);
    setOcrModalOpen(true);
  };

  const handleOcrConfirmed = (confirmed: FoodAnalysisData) => {
    setOcrModalOpen(false);
    addScanToHistory(confirmed);
    setActiveScan(confirmed);
    setActiveTab('report');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      {/* Back Button */}
      <BackButton fallbackTab="home" label="Back to Home" />

      {/* Hidden File Inputs for Native Camera and Uploads */}
      {/* 1. Native Mobile Back Camera trigger via capture="environment" */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />
      {/* 2. Standard Gallery / File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Title & Guidance Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-1.5 bg-[#FFF0E3] text-[#F58220] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-[#FFAB66]/30">
          <ScanLine className="w-4 h-4 text-[#F58220]" />
          <span>Real-Time Food Scanner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
          Scan Any Indian Packaged Food
        </h1>
        <p className="text-xs sm:text-sm text-[#77716B] mt-2 leading-relaxed">
          Position your phone's back camera over the nutrition table and ingredients list. We extract facts, verify marketing claims against FSSAI guidelines, and translate additives into plain English.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-1 rounded-xl border border-[#252525]/10 shadow-2xs inline-flex space-x-1">
          <button
            onClick={() => setScanMode('camera')}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors ${
              scanMode === 'camera'
                ? 'bg-[#F58220] text-white shadow-xs'
                : 'text-[#77716B] hover:text-[#252525]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Live Camera</span>
          </button>
          <button
            onClick={() => setScanMode('upload')}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors ${
              scanMode === 'upload'
                ? 'bg-[#F58220] text-white shadow-xs'
                : 'text-[#77716B] hover:text-[#252525]'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload or Mobile Photo</span>
          </button>
          <button
            onClick={() => setScanMode('manual')}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors ${
              scanMode === 'manual'
                ? 'bg-[#F58220] text-white shadow-xs'
                : 'text-[#77716B] hover:text-[#252525]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Label Text</span>
          </button>
        </div>
      </div>

      {/* Scanner Box / Viewport */}
      <div className="spotlight-card rounded-2xl shadow-sm border border-[#252525]/10 p-4 sm:p-6 mb-8 overflow-hidden bg-white">
        {isAnalyzing ? (
          /* Processing State */
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FFF0E3] flex items-center justify-center text-[#F58220] animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#252525]">Analyzing Food Label</h3>
              <p className="text-xs text-[#F58220] font-semibold mt-1">{analysisStep}</p>
            </div>
            <div className="max-w-xs mx-auto bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#F58220] h-full animate-[progress_2s_ease-in-out_infinite] w-2/3"></div>
            </div>
          </div>
        ) : scanMode === 'camera' ? (
          /* Camera Stream Viewfinder */
          <div className="space-y-4">
            {cameraError ? (
              <div className="p-6 text-center bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
                <p className="text-xs font-semibold text-amber-900">{cameraError}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#F58220] text-white text-xs font-bold rounded-xl hover:bg-[#e07114] flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Open Phone's Back Camera</span>
                  </button>
                  <button
                    onClick={() => setScanMode('upload')}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#252525]/15 text-[#252525] text-xs font-bold rounded-xl hover:bg-slate-50"
                  >
                    Upload Food Label
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black max-w-xl mx-auto aspect-4/3 flex items-center justify-center shadow-inner">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
                />

                {/* Top Viewfinder Bar with Camera Mode & Flip Control */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto z-10">
                  {/* Camera status badge */}
                  <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22A447] animate-pulse"></span>
                    <span>{facingMode === 'environment' ? 'Rear (Back) Camera' : 'Front Camera'}</span>
                  </span>

                  {/* Camera Flip / Switch Button */}
                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    disabled={isSwitchingCamera}
                    className="px-3 py-1.5 bg-black/60 hover:bg-black/80 active:scale-95 text-white backdrop-blur-md rounded-full border border-white/20 text-[11px] font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                    title={facingMode === 'environment' ? 'Switch to Front Camera' : 'Switch to Back Camera (Rear)'}
                  >
                    <SwitchCamera className={`w-4 h-4 text-[#FFAB66] ${isSwitchingCamera ? 'animate-spin' : ''}`} />
                    <span>{facingMode === 'environment' ? 'Flip to Front' : 'Flip to Back'}</span>
                  </button>
                </div>

                {/* Viewfinder Overlay Guides */}
                <div className="absolute inset-12 sm:inset-14 border-2 border-dashed border-[#FFAB66] rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between items-center text-[10px] text-white/90 font-medium bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded">
                    <span>Align Ingredients & Nutrition Table</span>
                    <Maximize2 className="w-3.5 h-3.5 text-[#FFAB66]" />
                  </div>
                  <div className="text-center text-[10px] text-white/90 bg-black/50 backdrop-blur-xs py-1 rounded">
                    Keep packaging flat and in clear focus
                  </div>
                </div>

                {/* Bottom Control Bar */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-10">
                  {/* Quick Shortcut to Native Phone Camera */}
                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="px-3 py-2 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md rounded-xl text-[11px] font-bold flex items-center space-x-1.5 border border-white/15 transition-all"
                    title="Launch native phone camera app for highest clarity"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#FFAB66]" />
                    <span className="hidden sm:inline">Phone Cam</span>
                  </button>

                  {/* Main Shutter Button */}
                  <button
                    type="button"
                    onClick={captureFrame}
                    className="w-16 h-16 rounded-full border-4 border-white bg-[#F58220] hover:bg-[#e07114] shadow-xl flex items-center justify-center text-white transition-transform active:scale-90 cursor-pointer shadow-[#F58220]/40"
                    title="Capture Label Photo"
                  >
                    <Camera className="w-7 h-7" />
                  </button>

                  {/* Quick Flip Button on mobile */}
                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    className="p-2.5 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md rounded-xl border border-white/15 transition-all"
                    title="Switch Camera (Back / Front)"
                  >
                    <SwitchCamera className="w-4 h-4 text-[#FFAB66]" />
                  </button>
                </div>
              </div>
            )}

            <div className="text-center text-xs text-[#77716B] space-y-1">
              <p>
                <strong>Back camera selected by default</strong> — ideal for capturing small nutrient prints and FSSAI license numbers.
              </p>
              <p className="text-[11px]">
                Tip: If your phone supports multiple lenses, you can also use{' '}
                <button
                  type="button"
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="text-[#F58220] font-bold underline hover:text-[#e07114]"
                >
                  Phone's Native Back Camera
                </button>{' '}
                for autofocus and macro clarity.
              </p>
            </div>
          </div>
        ) : scanMode === 'upload' ? (
          /* Upload Label / Native Phone Camera */
          <div className="max-w-xl mx-auto space-y-4">
            {/* Quick Mobile Native Camera Trigger */}
            <div className="p-4 bg-gradient-to-r from-[#FFF0E3] to-[#FFFAF5] rounded-2xl border border-[#FFAB66]/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#F58220] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#252525]">Mobile Back Camera Capture</h4>
                  <p className="text-[11px] text-[#77716B]">Directly open your phone's rear camera with high-res macro autofocus</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2 bg-[#F58220] hover:bg-[#e07114] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs shrink-0"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </button>
            </div>

            {/* Standard File Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#252525]/20 hover:border-[#F58220] bg-[#FFFAF5] hover:bg-[#FFF0E3]/40 rounded-2xl p-8 text-center cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF0E3] flex items-center justify-center text-[#F58220] mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#252525]">Or choose an existing photo from gallery</h4>
              <p className="text-xs text-[#77716B] mt-1">Select any saved picture of the food packet</p>
              <p className="text-[10px] text-[#77716B]/80 mt-2">Supports JPG, PNG, WebP up to 15MB</p>
            </div>
          </div>
        ) : (
          /* Manual Text Entry */
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <label className="block text-xs font-bold text-[#252525]">
                Paste Ingredients & Nutrition Facts from Food Label:
              </label>
              <textarea
                rows={6}
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Example:
Product: Masala Instant Noodles
Ingredients: Refined wheat flour (maida), palm oil, iodised salt...
Nutrition per 70g: Energy 312 kcal, Protein 6.8g, Total Fat 12.1g, Saturated fat 5.8g, Sodium 820mg..."
                className="w-full text-xs p-3.5 border border-[#252525]/15 rounded-xl focus:ring-2 focus:ring-[#F58220] outline-none font-mono bg-[#FFFAF5]"
              />
              <button
                type="submit"
                disabled={!manualText.trim()}
                className="w-full py-2.5 bg-[#F58220] text-white text-xs font-bold rounded-xl hover:bg-[#e07114] disabled:opacity-40 transition-colors shadow-xs"
              >
                Analyze Label Information
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Instant 1-Click Popular Presets */}
      <div className="border-t border-[#252525]/10 pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#F58220]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#252525]">
              Or Try Popular Indian Packaged Products Instantly
            </h3>
          </div>
          <span className="text-[11px] text-[#77716B]">One-click live demo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {SAMPLE_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              onClick={() => handleSelectPreset(prod)}
              className="spotlight-card p-3.5 rounded-xl border border-[#252525]/10 bg-white hover:border-[#F58220] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#F58220] bg-[#FFF0E3] px-2 py-0.5 rounded border border-[#FFAB66]/30">
                  {prod.category}
                </span>
                <span className="text-[10px] text-[#77716B] font-mono">
                  FSSAI: {prod.fssaiLicenseNumber.substring(0, 5)}...
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#252525] mt-2 group-hover:text-[#F58220] transition-colors">
                {prod.productName}
              </h4>
              <p className="text-[11px] text-[#77716B]">{prod.brand}</p>

              <div className="mt-2.5 pt-2 border-t border-[#252525]/5 flex items-center justify-between text-[11px]">
                <span className="text-[#252525] font-semibold">
                  {prod.nutritionSnapshot.energyKcal} kcal / {prod.servingSize}
                </span>
                <span className="text-[#F58220] font-bold flex items-center space-x-0.5">
                  <span>Analyze</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capturing Advice Card */}
      <div className="mt-8 bg-[#FFF0E3]/60 rounded-xl p-4 border border-[#FFAB66]/30 flex items-start space-x-3 text-xs text-[#77716B]">
        <Info className="w-5 h-5 text-[#F58220] shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold text-[#252525]">Tips for Best Mobile Scanning Results</h5>
          <p className="mt-0.5 text-[11px] leading-relaxed">
            Use your phone's <strong>rear/back camera</strong> in good lighting. Ensure both the <strong>Nutrition Information Table</strong> and the <strong>Ingredients List</strong> are sharp and legible. You can toggle between cameras or use your phone's native camera at any time.
          </p>
        </div>
      </div>

      {/* OCR Review & Correction Modal */}
      {pendingAnalysis && (
        <OcrCorrectionModal
          initialData={pendingAnalysis}
          isOpen={ocrModalOpen}
          onClose={() => setOcrModalOpen(false)}
          onConfirm={handleOcrConfirmed}
        />
      )}
    </div>
  );
};
