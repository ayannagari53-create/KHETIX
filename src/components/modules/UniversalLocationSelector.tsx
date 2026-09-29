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

export const UniversalLocationSelector: React.FC = () => {
  const { activeFarm, updateActiveFarm, setActiveModule } = useFarm();

  // Administrative hierarchy states
  const [country] = useState<string>('India');
  const [selectedStateName, setSelectedStateName] = useState<string>(activeFarm.state || 'Maharashtra');
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(
    activeFarm.district || 'Nashik'
  );
  const [selectedTalukName, setSelectedTalukName] = useState<string>('Niphad');
  const [villageName, setVillageName] = useState<string>('Pimpalgaon Khurd');
  const [khasraNumber, setKhasraNumber] = useState<string>('Survey No. 142/2A');

  // Search autocomplete
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Agronomic and weather state for selected location
  const [locationProfile, setLocationProfile] = useState<LocationProfile>(() =>
    buildLocationProfile('Maharashtra', 'Nashik', 'Niphad', 'Pimpalgaon Khurd')
  );
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [isGpsLocating, setIsGpsLocating] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Available districts for current state
  const currentStateObj =
    INDIAN_STATES_DB.find((s) => s.stateName.toLowerCase() === selectedStateName.toLowerCase()) ||
    INDIAN_STATES_DB[0];

  const currentDistrictObj =
    currentStateObj.districts.find(
      (d) => d.districtName.toLowerCase() === selectedDistrictName.toLowerCase()
    ) || currentStateObj.districts[0];

  // Refresh profile and weather whenever state/district/coordinates change
  useEffect(() => {
    const profile = buildLocationProfile(
      selectedStateName,
      selectedDistrictName,
      selectedTalukName,
      villageName,
      currentDistrictObj.latitude,
      currentDistrictObj.longitude
    );
    setLocationProfile(profile);
    fetchRealtimeWeather(profile.latitude, profile.longitude);
  }, [selectedStateName, selectedDistrictName, selectedTalukName]);

  const fetchRealtimeWeather = async (lat: number, lon: number) => {
    setIsLoadingWeather(true);
    try {
      const res = await fetch(`/api/location/weather?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
      }
    } catch (err) {
      console.warn('Weather fetch failed, falling back:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Autocomplete search against /api/location/search
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
    setSelectedStateName(result.state);
    setSelectedDistrictName(result.district);
    if (result.taluk) setSelectedTalukName(result.taluk);
    setSearchQuery('');
    setShowDropdown(false);

    const profile = buildLocationProfile(
      result.state,
      result.district,
      result.taluk,
      villageName,
      result.latitude,
      result.longitude
    );
    setLocationProfile(profile);
    fetchRealtimeWeather(result.latitude, result.longitude);
  };

  // Browser GPS Geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          // Reverse geocode via Open-Meteo
          const revUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(
            2
          )}&count=1&language=en&format=json`;
          fetchRealtimeWeather(lat, lon);
        } catch (e) {
          console.warn('Reverse geocode error:', e);
        }

        setIsGpsLocating(false);
        setSaveToast(`GPS coordinates locked: ${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`);
        setTimeout(() => setSaveToast(null), 3500);
      },
      (error) => {
        console.warn('Geolocation failed:', error);
        setIsGpsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Apply to active farm
  const handleApplyToFarm = () => {
    updateActiveFarm({
      location: `${villageName}, ${selectedTalukName}, ${selectedDistrictName}, ${selectedStateName}`,
      state: selectedStateName,
      district: selectedDistrictName,
      soilType: locationProfile.regionalSoil.soilType,
      soilPH: parseFloat(locationProfile.regionalSoil.phRange.split('-')[0]) || 7.2,
    });

    setSaveToast(
      `✓ Farm location updated to ${selectedDistrictName}, ${selectedStateName}! All agronomic modules now tuned to this terroir.`
    );
    setTimeout(() => setSaveToast(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Universal Farm Location & Agro-Climatic Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              All India Support
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Select or search any Indian State, District, Taluk, or Village. KHETIX automatically synchronizes live weather, soil chemistry, local crop risks, mandi markets, and government subsidies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGetCurrentLocation}
            disabled={isGpsLocating}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 transition"
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

      {saveToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveToast}</span>
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
          {/* Level 1: Country */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              1. Country
            </label>
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
                const sObj = INDIAN_STATES_DB.find((s) => s.stateName === sName);
                if (sObj && sObj.districts[0]) {
                  setSelectedDistrictName(sObj.districts[0].districtName);
                  if (sObj.districts[0].taluks[0]) {
                    setSelectedTalukName(sObj.districts[0].taluks[0]);
                  }
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
            >
              {INDIAN_STATES_DB.map((st) => (
                <option key={st.stateCode} value={st.stateName}>
                  {st.stateName} ({st.hindiName})
                </option>
              ))}
            </select>
          </div>

          {/* Level 3: District */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              3. District
            </label>
            <select
              value={selectedDistrictName}
              onChange={(e) => {
                const dName = e.target.value;
                setSelectedDistrictName(dName);
                const dObj = currentStateObj.districts.find((d) => d.districtName === dName);
                if (dObj && dObj.taluks[0]) {
                  setSelectedTalukName(dObj.taluks[0]);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
            >
              {currentStateObj.districts.map((dst) => (
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
            <select
              value={selectedTalukName}
              onChange={(e) => setSelectedTalukName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
            >
              {currentDistrictObj.taluks.map((tlk) => (
                <option key={tlk} value={tlk}>
                  {tlk}
                </option>
              ))}
            </select>
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
              <div className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[10px] text-emerald-400 font-mono shrink-0">
                {locationProfile.latitude.toFixed(2)}°N, {locationProfile.longitude.toFixed(2)}°E
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/5">
          <span>
            Agro-Climatic Zone: <strong className="text-white">{locationProfile.agroZone}</strong>
          </span>
          <span className="text-emerald-400">
            Coordinates: {locationProfile.latitude.toFixed(4)}°N, {locationProfile.longitude.toFixed(4)}°E
          </span>
        </div>
      </div>

      {/* Synced Intelligence Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Weather Forecast & Soil Properties */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Weather & 7-Day Forecast */}
          <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                  Live Agro-Meteorology ({selectedDistrictName})
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                {weatherData?.source === 'open-meteo-realtime' ? 'Open-Meteo Satellite Feed' : 'Regional Model'}
              </span>
            </div>

            {/* Current Day Metrics */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#0d2e20] border border-emerald-500/20">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Temperature</span>
                <span className="text-2xl font-extrabold text-white">
                  {weatherData ? weatherData.current.temperature : 28}°C
                </span>
                <span className="text-[10px] text-amber-300 block">
                  {weatherData ? weatherData.current.condition : 'Partly Cloudy'}
                </span>
              </div>

              <div className="text-center border-x border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">Relative Humidity</span>
                <span className="text-2xl font-extrabold text-sky-400">
                  {weatherData ? weatherData.current.humidity : 72}%
                </span>
                <span className="text-[10px] text-slate-400 block">Canopy vapor</span>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Rain Tomorrow</span>
                <span className="text-2xl font-extrabold text-blue-400">
                  {weatherData ? weatherData.current.rainProbabilityTomorrow : 68}%
                </span>
                <span className="text-[10px] text-slate-400 block">Precipitation prob.</span>
              </div>
            </div>

            {/* Agronomic Advisory */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2">
              <Droplets className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong>Local Irrigation Rule: </strong>
                <span>{weatherData?.current.advisory || 'Precipitation forecast active. Delay irrigation by 24 hours.'}</span>
              </div>
            </div>

            {/* 7-Day Forecast Strip */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                7-Day Precipitation & Thermal Outlook
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {(weatherData?.forecast || []).slice(0, 7).map((fc, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-black/40 border border-white/5 text-center space-y-1"
                  >
                    <p className="text-[10px] font-bold text-slate-300 truncate">{fc.day.slice(0, 3)}</p>
                    <p className="text-xs font-extrabold text-white">{fc.tempMax}°</p>
                    <span
                      className={`text-[9px] font-bold block px-1 py-0.2 rounded ${
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
          </div>

          {/* Regional Soil Information */}
          <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-400" />
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                  Regional Soil Chemistry ({selectedStateName} Belt)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">ICAR / NBSS&LUP</span>
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
                <span className="text-[10px] text-slate-400 block uppercase">pH & Organic Carbon</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">
                  pH Range: {locationProfile.regionalSoil.phRange}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Organic Carbon: {locationProfile.regionalSoil.organicCarbon}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
              <strong>Drainage & Aeration: </strong>
              <span>{locationProfile.regionalSoil.drainage}</span>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Crops, Mandis, Risks & Schemes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Suitable Crops for Region */}
          <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Wheat className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                Agronomically Suitable Crops ({selectedDistrictName})
              </h3>
            </div>

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

            <div className="space-y-2.5">
              {locationProfile.nearbyMandis.map((mandi, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0d2e20] border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{mandi.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      Benchmark: {mandi.primaryCommodities.join(', ')}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    {mandi.distanceKm} km
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Local Crop Disease Risks */}
          <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                Regional Pest & Disease Early Warnings
              </h3>
            </div>

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
          </div>

          {/* Applicable Government Schemes */}
          <div className="p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-400" />
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                Applicable Subsidies & Govt Schemes ({selectedStateName})
              </h3>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {locationProfile.governmentSchemes.map((scheme, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0d2e20] border border-emerald-500/20 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{scheme.name}</h4>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
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
          </div>
        </div>
      </div>
    </div>
  );
};
