import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Sprout,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Globe,
  KeyRound,
  ChevronDown,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';
import { INDIAN_STATES_DB } from '../../lib/data/locationDatabase';
import { MAJOR_CROPS } from '../../lib/data/cropsDatabase';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../lib/i18n';
import { AppLanguage } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const {
    login,
    signup,
    requestPasswordReset,
    resetPassword,
    setActiveModule,
    language,
    setLanguage,
  } = useFarm();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Login inputs
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot Password inputs
  const [forgotContact, setForgotContact] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtpNotice, setDemoOtpNotice] = useState<string | null>(null);

  // Farm Onboarding Location inputs
  const [farmName, setFarmName] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Nashik');
  const [taluk, setTaluk] = useState('Dindori');
  const [village, setVillage] = useState('Pimpalgaon Baswant');
  const [totalAcres, setTotalAcres] = useState('10');
  const [primaryCrop, setPrimaryCrop] = useState('Tomato');

  const selectedStateData =
    INDIAN_STATES_DB.find((s) => s.stateName === state) || INDIAN_STATES_DB[0];
  const availableDistricts = selectedStateData?.districts.map((d) => d.districtName) || [];
  const selectedDistrictData =
    selectedStateData?.districts.find((d) => d.districtName === district) ||
    selectedStateData?.districts[0];
  const availableTaluks = selectedDistrictData?.taluks || [];

  if (!isOpen) return null;

  // Real Google OAuth Redirect - Preserving Selected Language
  const handleContinueWithGoogle = () => {
    // Passes the selected KHETIX language to the server OAuth flow
    // The server passes it in the OAuth state, saves to user preference, and restores in Dashboard
    window.location.href = `/api/auth/google?lang=${encodeURIComponent(language)}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setError('Please enter your mobile number or email, and password.');
      return;
    }

    setSubmitting(true);
    const res = await login(loginIdentifier, loginPassword);
    setSubmitting(false);

    if (res.success) {
      setSuccess('Signed in successfully! Launching your farm dashboard...');
      setTimeout(() => {
        onClose();
        setActiveModule('dashboard');
      }, 600);
    } else {
      setError(res.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your mobile number.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    const res = await signup({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      password,
      farmName: farmName.trim() || `${name}'s Precision Farm`,
      state,
      district,
      taluk,
      village,
      totalAcres: parseFloat(totalAcres) || 10,
      primaryCrop,
      language,
    });
    setSubmitting(false);

    if (res.success) {
      setSuccess('Account and farm created successfully! Opening your dashboard...');
      setTimeout(() => {
        onClose();
        setActiveModule('dashboard');
      }, 700);
    } else {
      setError(res.error || 'Failed to create farmer account.');
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setDemoOtpNotice(null);

    if (!forgotContact.trim()) {
      setError('Please provide your registered mobile number or email.');
      return;
    }

    setSubmitting(true);
    const res = await requestPasswordReset(forgotContact.trim());
    setSubmitting(false);

    if (res.success) {
      setOtpSent(true);
      setSuccess(res.message || 'Verification code sent.');
      if (res.otp) {
        setDemoOtpNotice(`Verification Code: ${res.otp}`);
      }
    } else {
      setError(res.error || 'No account found with this contact.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!forgotOtp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setSubmitting(true);
    const res = await resetPassword(forgotContact.trim(), forgotOtp.trim(), newPassword);
    setSubmitting(false);

    if (res.success) {
      setSuccess('Password updated successfully! Please sign in with your new password.');
      setLoginIdentifier(forgotContact.trim());
      setLoginPassword('');
      setTimeout(() => {
        setMode('login');
        setOtpSent(false);
        setDemoOtpNotice(null);
      }, 1200);
    } else {
      setError(res.error || 'Password update failed.');
    }
  };

  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0a2318] border border-emerald-500/30 p-6 md:p-8 shadow-2xl text-slate-100 scrollbar-thin scrollbar-thumb-emerald-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Title */}
        <div className="text-center space-y-1 mb-5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 text-2xl mb-2">
            🌾
          </div>
          <h2 className="text-2xl font-extrabold text-white font-display">
            {mode === 'login' && 'Farmer Sign In'}
            {mode === 'signup' && 'Farmer Registration & Holding'}
            {mode === 'forgot' && 'Reset Account Password'}
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            {mode === 'login' && 'Sign in to access your registered farm, IoT telemetry, and advisory logs.'}
            {mode === 'signup' && 'Register your agricultural holding with village microclimate and crop monitoring.'}
            {mode === 'forgot' && 'Enter your verified mobile or email to securely reset your credentials.'}
          </p>
        </div>

        {/* Language Selector Bar (Preserves language across Google OAuth & Normal Login) */}
        <div className="mb-5 p-2.5 rounded-2xl bg-[#06150f] border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold hidden sm:inline">KHETIX Language:</span>
            <span className="font-bold text-emerald-300">{currentLangMeta.nativeName}</span>
          </div>

          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              className="px-3 py-1.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Action: Continue with Google (OAuth 2.0 with Language Preservation) */}
        {mode !== 'forgot' && (
          <div className="space-y-4 mb-6">
            <button
              type="button"
              onClick={handleContinueWithGoogle}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 transition shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.01] cursor-pointer"
            >
              {/* Official Google G Logo SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                {currentLangMeta.code.toUpperCase()}
              </span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-emerald-500/20 w-full" />
              <span className="bg-[#0a2318] px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                or sign in with password
              </span>
              <div className="border-t border-emerald-500/20 w-full" />
            </div>
          </div>
        )}

        {/* Mode Selector Tabs */}
        {mode !== 'forgot' && (
          <div className="flex bg-[#06150f] p-1 rounded-xl border border-emerald-500/20 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                mode === 'login'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                mode === 'signup'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error & Success Banners */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-200 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {demoOtpNotice && (
          <div className="p-2.5 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
            <span className="font-bold">{demoOtpNotice}</span>
            <button
              type="button"
              onClick={() => setForgotOtp(demoOtpNotice.replace(/\D/g, ''))}
              className="text-[11px] underline hover:text-amber-200 font-semibold"
            >
              Auto-fill OTP
            </button>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1.5">
                Registered Mobile Number or Email
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="+91 98220 12345 or farmer@khetix.in"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#06150f] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-300 font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setError(null);
                    setSuccess(null);
                    setForgotContact(loginIdentifier);
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#06150f] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>{submitting ? 'Verifying...' : 'Sign In to KHETIX'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. SIGN UP & ONBOARDING FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Farmer Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patil"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#06150f] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Mobile Number (Kisan Link) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#06150f] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="farmer@khetix.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#06150f] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Secure Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#06150f] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Farm Location Hierarchy */}
            <div className="p-3.5 rounded-2xl bg-[#06150f] border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Farm Location & Microclimate Hierarchy
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">State *</label>
                  <select
                    value={state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setState(newState);
                      const st = INDIAN_STATES_DB.find((s) => s.stateName === newState);
                      if (st && st.districts.length > 0) {
                        setDistrict(st.districts[0].districtName);
                        if (st.districts[0].taluks.length > 0) {
                          setTaluk(st.districts[0].taluks[0]);
                        }
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a2318] border border-emerald-500/30 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    {INDIAN_STATES_DB.map((s) => (
                      <option key={s.stateCode} value={s.stateName}>
                        {s.stateName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">District *</label>
                  <select
                    value={district}
                    onChange={(e) => {
                      const newDist = e.target.value;
                      setDistrict(newDist);
                      const distObj = selectedStateData?.districts.find(
                        (d) => d.districtName === newDist
                      );
                      if (distObj && distObj.taluks.length > 0) {
                        setTaluk(distObj.taluks[0]);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a2318] border border-emerald-500/30 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Taluk / Tehsil *</label>
                  {availableTaluks.length > 0 ? (
                    <select
                      value={taluk}
                      onChange={(e) => setTaluk(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0a2318] border border-emerald-500/30 text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      {availableTaluks.map((tk) => (
                        <option key={tk} value={tk}>
                          {tk}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dindori / Haveli"
                      value={taluk}
                      onChange={(e) => setTaluk(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0a2318] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  )}
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Village *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pimpalgaon Baswant"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a2318] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Farm Holding & Crop Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Farm Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Patil Farm"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#06150f] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Total Acres *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  placeholder="10"
                  value={totalAcres}
                  onChange={(e) => setTotalAcres(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#06150f] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Primary Crop *
                </label>
                <select
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#06150f] border border-emerald-500/30 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  {MAJOR_CROPS.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer mt-2"
            >
              <Sprout className="w-4 h-4" />
              <span>{submitting ? 'Registering Farm...' : 'Create Account & Launch Farm'}</span>
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD & OTP RESET FLOW */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1.5">
                    Registered Mobile or Email
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="+91 98220 12345 or farmer@khetix.in"
                      value={forgotContact}
                      onChange={(e) => setForgotContact(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#06150f] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{submitting ? 'Sending Code...' : 'Request Verification Code'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    6-Digit Verification Code (OTP) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 583921"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06150f] border border-emerald-500/30 text-center text-lg font-mono tracking-widest text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06150f] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06150f] border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Updating...' : 'Set New Password'}</span>
                </button>
              </form>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccess(null);
                  setOtpSent(false);
                }}
                className="text-xs text-slate-400 hover:text-white transition underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
