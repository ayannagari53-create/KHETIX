import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  CloudSun,
  Droplets,
  Wind,
  Layers,
  Wheat,
  TrendingUp,
  ShieldCheck,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Compass,
  Info,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';
import {
  INDIAN_STATES_DB,
  CENTRAL_SCHEMES,
  buildLocationProfile,
  LocationProfile,
} from '../../lib/data/locationDatabase';

interface WeatherApiResponse {
  source: string;
  latitude: number;
  longitude: number;
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    advisory: string;
    rainProbabilityTomorrow: number;
  };
  forecast: {
    day: string;
    date: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainProbability: number;
    precipitationMm?: number;
    humidity?: number;
    advisory?: string;
  }[];
}

// ─── Empty State Panel ──────────────────────────────────────────────────────
const EmptyLocationPanel: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div className="lg:col-span-12">
      <div className="p-10 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-white mb-1">Select Your Farm Location</h3>
          <p className="text-sm text-slate-400 max-w-md">
            Choose a State and District above to unlock live agro-meteorology, soil chemistry, nearby mandi rates,
            regional crop risks, and applicable government schemes for your exact location.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {['🌦 Live Weather', '🌱 Soil Chemistry', '📈 Mandi Prices', '🛡 Crop Disease Alerts', '🏛 Govt Schemes'].map((item) => (
            <span key={item} className="px-3 py-1.5 rounded-xl bg-[#0d2e20] border border-emerald-500/20 text-xs font-semibold text-emerald-300">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export const UniversalLocationSelector: React.FC = () => {
  const { activeFarm, updateActiveFarm, setActiveModule } = useFarm();

  // Administrative hierarchy states — start empty/unselected
  const [country] = useState<string>('India');
  const [selectedStateName, setSelectedStateName] = useState<string>(activeFarm?.state || '');
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(
    activeFarm?.district || ''
  );
  const [selectedTalukName, setSelectedTalukName] = useState<string>(activeFarm?.taluk || '');
  const [villageName, setVillageName] = useState<string>(activeFarm?.village || '');
  const [khasraNumber, setKhasraNumber] = useState<string>(activeFarm?.khasraNumber || '');

  // Search autocomplete
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // ── CRITICAL: locationProfile is null until a real state+district is chosen ──
  const [locationProfile, setLocationProfile] = useState<LocationProfile | null>(() => {
    if (activeFarm?.state && activeFarm?.district) {
      try {
        return buildLocationProfile(
          activeFarm.state,
          activeFarm.district,
          activeFarm.taluk || '',
          activeFarm.village || ''
        );
      } catch {
        return null;
      }
    }
    return null;
  });

  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<boolean>(false);
  const [isGpsLocating, setIsGpsLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Available districts/taluks derived safely
  const currentStateObj = selectedStateName
    ? INDIAN_STATES_DB.find((s) => s.stateName.toLowerCase() === selectedStateName.toLowerCase()) ?? null
    : null;

  const currentDistrictObj =
    currentStateObj && selectedDistrictName
      ? currentStateObj.districts.find(
          (d) => d.districtName.toLowerCase() === selectedDistrictName.toLowerCase()
        ) ?? null
      : null;

  // Refresh profile & weather when state/district change (only if real values chosen)
  useEffect(() => {
    if (!selectedStateName || !selectedDistrictName) {
      // Clear profile when selection is cleared
      setLocationProfile(null);
      setWeatherData(null);
      return;
    }

    try {
      const distObj = currentStateObj?.districts.find(
        (d) => d.districtName.toLowerCase() === selectedDistrictName.toLowerCase()
      );
      const profile = buildLocationProfile(
        selectedStateName,
        selectedDistrictName,
        selectedTalukName,
        villageName,
        distObj?.latitude,
        distObj?.longitude
      );
      setLocationProfile(profile);
      if (distObj?.latitude && distObj?.longitude) {
        fetchRealtimeWeather(distObj.latitude, distObj.longitude);
      }
    } catch (err) {
      console.warn('Failed to build location profile:', err);
      setLocationProfile(null);
    }
  }, [selectedStateName, selectedDistrictName, selectedTalukName]);

  const fetchRealtimeWeather = async (lat: number, lon: number) => {
    setIsLoadingWeather(true);
    setWeatherError(false);
    try {
      const res = await fetch(`/api/location/weather?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
      } else {
        setWeatherError(true);
      }
    } catch (err) {
      console.warn('Weather fetch failed:', err);
      setWeatherError(true);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Autocomplete search
  const handleSearchChange = async (val: string) => {
    setSearchQuery(val);
    if (val.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/location/search?q=${encodeURIComponent(val)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
        setShowDropdown(true);
      }
    } catch (err) {
      console.warn('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    setSelectedStateName(result.state || '');
    setSelectedDistrictName(result.district || '');
    if (result.taluk) setSelectedTalukName(result.taluk);
    setSearchQuery('');
    setShowDropdown(false);

    try {
      const profile = buildLocationProfile(
        result.state,
        result.district,
        result.taluk,
        villageName,
        result.latitude,
        result.longitude
      );
      setLocationProfile(profile);
      if (result.latitude && result.longitude) {
        fetchRealtimeWeather(result.latitude, result.longitude);
      }
    } catch (err) {
      console.warn('Profile build failed for search result:', err);
    }
  };

  // Browser GPS — only runs on user action, never during render
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsLocating(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          fetchRealtimeWeather(lat, lon);
          setSaveToast(`📍 GPS coordinates locked: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
          setTimeout(() => setSaveToast(null), 4000);
        } catch (e) {
          console.warn('GPS weather fetch error:', e);
        }
        setIsGpsLocating(false);
      },
      (error) => {
        console.warn('Geolocation failed:', error);
        setIsGpsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('Location permission was not granted. Please allow access in browser settings.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsError('GPS location unavailable on this device.');
        } else {
          setGpsError('Unable to determine your location. Please try again.');
        }
        setTimeout(() => setGpsError(null), 5000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Apply to active farm — only if a real location has been chosen
  const handleApplyToFarm = () => {
    if (!selectedStateName || !selectedDistrictName) {
      setSaveToast('⚠️ Please select a State and District before saving.');
      setTimeout(() => setSaveToast(null), 3000);
      return;
    }
    updateActiveFarm({
      location: [villageName, selectedTalukName, selectedDistrictName, selectedStateName]
        .filter(Boolean)
        .join(', '),
      state: selectedStateName,
      district: selectedDistrictName,
      taluk: selectedTalukName || undefined,
      village: villageName || undefined,
      khasraNumber: khasraNumber || undefined,
      ...(locationProfile
        ? {
            soilType: locationProfile.regionalSoil.soilType,
            soilPH:
              parseFloat(locationProfile.regionalSoil.phRange.split('-')[0]) || 7.2,
          }
        : {}),
    });

    setSaveToast(
      `✓ Farm location updated to ${[selectedDistrictName, selectedStateName]
        .filter(Boolean)
        .join(', ')}! Agronomic modules synced.`
    );
    setTimeout(() => setSaveToast(null), 4000);
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Universal Farm Location &amp; Agro-Climatic Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              All India Support
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Select or search any Indian State, District, Taluk, or Village. KHETIX automatically
            synchronizes live weather, soil chemistry, local crop risks, mandi markets, and government
            subsidies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGetCurrentLocation}
            disabled={isGpsLocating}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 transition disabled:opacity-60"
          >
            {isGpsLocating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>Use My GPS Location</span>
          </button>

          <button
            onClick={handleApplyToFarm}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply to Active Farm</span>
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      {saveToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* GPS Error */}
      {gpsError && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Global Location Search Bar */}
      <div className="relative">
        <div className="p-4 rounded-2xl bg-[#0a2318] border border-emerald-500/20 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search any Village, Taluk, City or District in India (e.g. Lasalgaon, Gondal, Unjha, Kolar, Khanna, Guntur)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {isSearching && <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />}
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-[#0a2318] border border-emerald-500/30 shadow-2xl z-30 max-h-72 overflow-y-auto space-y-1">
            {searchResults.map((res, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSearchResult(res)}
                className="w-full p-2.5 rounded-lg text-left hover:bg-[#0d2e20] flex items-center justify-between transition group"
              >
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300">
                    {res.title}
                  </p>
                  <p className="text-[11px] text-slate-400">{res.subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Administrative 6-Level Hierarchy Picker */}
      <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Country → State → District → Taluk → Village → Farm Hierarchy</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Level 1: Country (fixed: India only) */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">1. Country</label>
            <div className="px-3.5 py-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white flex items-center justify-between">
              <span>🇮🇳 India (Republic of India)</span>
              <span className="text-[10px] text-emerald-400">All India</span>
            </div>
          </div>

          {/* Level 2: State */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              2. State / Union Territory
            </label>
            <select
              value={selectedStateName}
              onChange={(e) => {
                const sName = e.target.value;
                setSelectedStateName(sName);
                setSelectedDistrictName('');
                setSelectedTalukName('');
                setVillageName('');
                // locationProfile is cleared by the useEffect above
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="">— Select State / Union Territory —</option>
              {INDIAN_STATES_DB.map((st) => (
                <option key={st.stateCode} value={st.stateName}>
                  {st.stateName} ({st.hindiName})
                </option>
              ))}
            </select>
          </div>

          {/* Level 3: District */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">3. District</label>
            <select
              value={selectedDistrictName}
              disabled={!currentStateObj}
              onChange={(e) => {
                const dName = e.target.value;
                setSelectedDistrictName(dName);
                setSelectedTalukName('');
                setVillageName('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white focus:outline-none focus:border-emerald-400 disabled:opacity-50"
            >
              <option value="">— Select District —</option>
              {(currentStateObj?.districts ?? []).map((dst) => (
                <option key={dst.districtName} value={dst.districtName}>
                  {dst.districtName} ({dst.hindiName})
                </option>
              ))}
            </select>
          </div>

          {/* Level 4: Taluk / Tehsil / Block */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              4. Taluk / Block / Mandal
            </label>
            {currentDistrictObj && currentDistrictObj.taluks.length > 0 ? (
              <select
                value={selectedTalukName}
                onChange={(e) => setSelectedTalukName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="">— Select Taluk / Block —</option>
                {currentDistrictObj.taluks.map((tlk) => (
                  <option key={tlk} value={tlk}>
                    {tlk}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={selectedTalukName}
                onChange={(e) => setSelectedTalukName(e.target.value)}
                placeholder={
                  selectedDistrictName
                    ? 'Enter Taluk / Block / Mandal'
                    : '— Select District first —'
                }
                disabled={!selectedDistrictName}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 disabled:opacity-50"
              />
            )}
          </div>

          {/* Level 5: Village / Gram Panchayat */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              5. Village / Gram Panchayat
            </label>
            <input
              type="text"
              value={villageName}
              onChange={(e) => setVillageName(e.target.value)}
              placeholder="e.g. Pimpalgaon Khurd, Sukene"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Level 6: Farm Coordinates & Survey/Khasra */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              6. Farm Plot / Khasra / Coordinates
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={khasraNumber}
                onChange={(e) => setKhasraNumber(e.target.value)}
                placeholder="Survey / Khasra No."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
              />
              <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[10px] text-emerald-400 font-mono shrink-0 whitespace-nowrap">
                {locationProfile
                  ? `${locationProfile.latitude.toFixed(4)}°N, ${locationProfile.longitude.toFixed(4)}°E`
                  : 'Not selected'}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/5">
          <span>
            Agro-Climatic Zone:{' '}
            <strong className="text-white">
              {locationProfile?.agroZone ?? 'Select a location above'}
            </strong>
          </span>
          <span className="text-emerald-400">
            {locationProfile
              ? `Coordinates: ${locationProfile.latitude.toFixed(4)}°N, ${locationProfile.longitude.toFixed(4)}°E`
              : 'Farm coordinates not available'}
          </span>
        </div>
      </div>

      {/* ── Intelligence Panels: only shown when a location is selected ─────── */}
      {!locationProfile ? (
        <EmptyLocationPanel />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 cols: Weather Forecast & Soil Properties */}
          <div className="lg:col-span-7 space-y-6">
            {/* Real-time Weather & 7-Day Forecast */}
            <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                    Live Agro-Meteorology ({selectedDistrictName || 'Selected District'})
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  {weatherData?.source === 'open-meteo-realtime'
                    ? 'Open-Meteo Satellite Feed'
                    : 'Regional Model'}
                </span>
              </div>

              {isLoadingWeather ? (
                <div className="flex items-center justify-center gap-2 py-8 text-slate-400 text-xs">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Fetching live weather data…</span>
                </div>
              ) : weatherError ? (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Unable to load weather data. Check your connection and try again.</span>
                  <button
                    onClick={() => {
                      if (currentDistrictObj) {
                        fetchRealtimeWeather(currentDistrictObj.latitude, currentDistrictObj.longitude);
                      }
                    }}
                    className="ml-auto font-bold text-red-200 underline shrink-0"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {/* Current Day Metrics */}
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#0d2e20] border border-emerald-500/20">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block uppercase">Temperature</span>
                      <span className="text-2xl font-extrabold text-white">
                        {weatherData ? weatherData.current.temperature : '—'}°C
                      </span>
                      <span className="text-[10px] text-amber-300 block">
                        {weatherData ? weatherData.current.condition : 'Select location for live data'}
                      </span>
                    </div>

                    <div className="text-center border-x border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase">Relative Humidity</span>
                      <span className="text-2xl font-extrabold text-sky-400">
                        {weatherData ? `${weatherData.current.humidity}%` : '—'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Canopy vapor</span>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block uppercase">Rain Tomorrow</span>
                      <span className="text-2xl font-extrabold text-blue-400">
                        {weatherData ? `${weatherData.current.rainProbabilityTomorrow}%` : '—'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Precipitation prob.</span>
                    </div>
                  </div>

                  {/* Agronomic Advisory */}
                  {weatherData && (
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2">
                      <Droplets className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Local Irrigation Rule: </strong>
                        <span>{weatherData.current.advisory}</span>
                      </div>
                    </div>
                  )}

                  {/* 7-Day Forecast Strip */}
                  {weatherData && weatherData.forecast && weatherData.forecast.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        7-Day Precipitation &amp; Thermal Outlook
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {weatherData.forecast.slice(0, 7).map((fc, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-black/40 border border-white/5 text-center space-y-1"
                          >
                            <p className="text-[10px] font-bold text-slate-300 truncate">
                              {fc.day?.slice(0, 3) ?? '—'}
                            </p>
                            <p className="text-xs font-extrabold text-white">{fc.tempMax}°</p>
                            <span
                              className={`text-[9px] font-bold block px-1 py-0.5 rounded ${
                                fc.rainProbability > 50
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'text-slate-400'
                              }`}
                            >
                              {fc.rainProbability}% 🌧
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No weather data yet (loading complete, no API error, just not fetched) */}
                  {!weatherData && !isLoadingWeather && !weatherError && (
                    <div className="text-center py-4 text-xs text-slate-400">
                      <Info className="w-4 h-4 inline mr-1 text-slate-500" />
                      Live weather data will appear after location is selected with valid coordinates.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Regional Soil Information — safe: locationProfile is confirmed non-null here */}
            <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-400" />
                  <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                    Regional Soil Chemistry ({selectedStateName} Belt)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">ICAR / NBSS&amp;LUP</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0d2e20] border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 block uppercase">Primary Soil Type</span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {locationProfile.regionalSoil.soilType}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Texture: {locationProfile.regionalSoil.texture}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0d2e20] border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 block uppercase">pH &amp; Organic Carbon</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">
                    pH Range: {locationProfile.regionalSoil.phRange}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Organic Carbon: {locationProfile.regionalSoil.organicCarbon}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                <strong>Drainage &amp; Aeration: </strong>
                <span>{locationProfile.regionalSoil.drainage}</span>
              </div>
            </div>
          </div>

          {/* Right 5 cols: Crops, Mandis, Risks & Schemes */}
          <div className="lg:col-span-5 space-y-6">
            {/* Suitable Crops */}
            <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                  Agronomically Suitable Crops ({selectedDistrictName})
                </h3>
              </div>

              {locationProfile.suitableCrops.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {locationProfile.suitableCrops.map((crop, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{crop}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No crop data available for this region.</p>
              )}
            </div>

            {/* Nearby Mandi Prices & APMC Markets */}
            <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                    Nearby APMC Mandi Hubs
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModule('market')}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>Live Rates</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {locationProfile.nearbyMandis.length > 0 ? (
                <div className="space-y-2.5">
                  {locationProfile.nearbyMandis.map((mandi, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0d2e20] border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{mandi.name}</h4>
                        <p className="text-[11px] text-slate-400">
                          Benchmark: {(mandi.primaryCommodities ?? []).join(', ')}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                        {mandi.distanceKm} km
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No mandi data available for this district.</p>
              )}
            </div>

            {/* Local Crop Disease Risks */}
            <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                  Regional Pest &amp; Disease Early Warnings
                </h3>
              </div>

              {locationProfile.localCropRisks.length > 0 ? (
                <div className="space-y-2">
                  {locationProfile.localCropRisks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-slate-200"
                    >
                      <div className="flex items-center justify-between font-bold text-red-300 mb-0.5">
                        <span>{risk.crop}</span>
                        <span className="text-[10px] text-slate-400">{risk.season}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{risk.risk}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No risk alerts for this region.</p>
              )}
            </div>

            {/* Applicable Government Schemes */}
            <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-400" />
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                  Applicable Subsidies &amp; Govt Schemes ({selectedStateName})
                </h3>
              </div>

              {locationProfile.governmentSchemes.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {locationProfile.governmentSchemes.map((scheme, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0d2e20] border border-emerald-500/20 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{scheme.name}</h4>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            scheme.type === 'Central'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {scheme.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">{scheme.benefit}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No scheme data available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
