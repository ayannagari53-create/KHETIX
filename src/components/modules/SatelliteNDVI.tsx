import React, { useState } from 'react';
import {
  Satellite,
  Layers,
  Sparkles,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useFarm } from '../../lib/context/FarmContext';

export const SatelliteNDVI: React.FC = () => {
  const { activeFarm } = useFarm();

  const [activeLayer, setActiveLayer] = useState<'NDVI' | 'NDRE' | 'NDWI' | 'Thermal'>('NDVI');
  const [selectedZone, setSelectedZone] = useState<string | null>('B-3');

  // Simulated 6x4 multispectral grid zones for Field A & B
  const gridCells = [
    { id: 'A-1', ndvi: 0.86, ndre: 0.74, ndwi: 0.62, temp: 24.1, status: 'Vigorous' },
    { id: 'A-2', ndvi: 0.84, ndre: 0.72, ndwi: 0.60, temp: 24.3, status: 'Vigorous' },
    { id: 'A-3', ndvi: 0.88, ndre: 0.76, ndwi: 0.64, temp: 23.9, status: 'Vigorous' },
    { id: 'A-4', ndvi: 0.82, ndre: 0.70, ndwi: 0.58, temp: 24.8, status: 'Normal' },
    { id: 'B-1', ndvi: 0.81, ndre: 0.69, ndwi: 0.57, temp: 25.0, status: 'Normal' },
    { id: 'B-2', ndvi: 0.78, ndre: 0.66, ndwi: 0.54, temp: 25.4, status: 'Normal' },
    { id: 'B-3', ndvi: 0.52, ndre: 0.44, ndwi: 0.32, temp: 28.2, status: 'Stress Anomaly' },
    { id: 'B-4', ndvi: 0.79, ndre: 0.67, ndwi: 0.55, temp: 25.2, status: 'Normal' },
    { id: 'C-1', ndvi: 0.85, ndre: 0.73, ndwi: 0.61, temp: 24.2, status: 'Vigorous' },
    { id: 'C-2', ndvi: 0.83, ndre: 0.71, ndwi: 0.59, temp: 24.5, status: 'Vigorous' },
    { id: 'C-3', ndvi: 0.87, ndre: 0.75, ndwi: 0.63, temp: 24.0, status: 'Vigorous' },
    { id: 'C-4', ndvi: 0.80, ndre: 0.68, ndwi: 0.56, temp: 25.1, status: 'Normal' },
  ];

  const getCellColor = (cell: typeof gridCells[0]) => {
    if (activeLayer === 'NDVI') {
      if (cell.ndvi > 0.82) return 'bg-emerald-500/80 border-emerald-400 text-slate-950';
      if (cell.ndvi > 0.70) return 'bg-emerald-600/60 border-emerald-500 text-white';
      return 'bg-amber-500/80 border-amber-400 text-slate-950';
    }
    if (activeLayer === 'NDWI') {
      if (cell.ndwi > 0.58) return 'bg-sky-500/80 border-sky-400 text-slate-950';
      if (cell.ndwi > 0.45) return 'bg-sky-600/60 border-sky-500 text-white';
      return 'bg-orange-500/80 border-orange-400 text-slate-950';
    }
    if (activeLayer === 'Thermal') {
      if (cell.temp > 27.0) return 'bg-red-500/80 border-red-400 text-white';
      if (cell.temp > 25.0) return 'bg-amber-500/80 border-amber-400 text-slate-950';
      return 'bg-teal-500/80 border-teal-400 text-slate-950';
    }
    return 'bg-emerald-500/70 border-emerald-400 text-slate-950';
  };

  const selectedCellData = gridCells.find((c) => c.id === selectedZone);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Satellite className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              Satellite NDVI & Drone Imagery Telemetry
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
              Sentinel-2 L2A (10m)
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Multispectral surface reflectance imagery for crop canopy vigor, chlorophyll absorption, and thermal water stress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-[#0d2e20] border border-emerald-500/30 text-xs">
            <span className="text-slate-400 block text-[10px]">Latest Orbit Pass</span>
            <span className="font-bold text-white">Yesterday, 11:24 AM (0% Cloud)</span>
          </div>
        </div>
      </div>

      {/* Spectral Layer Selector Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0a2318] border border-emerald-500/20 w-fit">
        {(['NDVI', 'NDRE', 'NDWI', 'Thermal'] as const).map((layer) => (
          <button
            key={layer}
            onClick={() => setActiveLayer(layer)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeLayer === layer
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {layer === 'NDVI'
              ? 'NDVI (Vigor)'
              : layer === 'NDRE'
              ? 'NDRE (Chlorophyll)'
              : layer === 'NDWI'
              ? 'NDWI (Moisture)'
              : 'Thermal Canopy'}
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive False-Color Grid + Zone Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* False Color Heatmap Canvas (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-white">
                Field Plot Multi-Spectral Raster Grid
              </h3>
              <p className="text-xs text-slate-400">Click individual zone block to inspect telemetry</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold">12 Sub-Zones</span>
          </div>

          {/* Interactive Zone Grid */}
          <div className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-black/60 border border-white/10">
            {gridCells.map((cell) => {
              const isSelected = selectedZone === cell.id;
              return (
                <div
                  key={cell.id}
                  onClick={() => setSelectedZone(cell.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between h-24 ${getCellColor(
                    cell
                  )} ${isSelected ? 'ring-4 ring-white scale-105 shadow-2xl' : 'hover:scale-[1.02]'}`}
                >
                  <div className="flex justify-between items-center text-xs font-black">
                    <span>{cell.id}</span>
                    <span className="text-[10px] font-bold">
                      {activeLayer === 'NDVI'
                        ? cell.ndvi
                        : activeLayer === 'NDWI'
                        ? cell.ndwi
                        : `${cell.temp}°`}
                    </span>
                  </div>
                  <div className="text-[10px] font-extrabold truncate">
                    {cell.status}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-emerald-500/10">
            <span>Low / Stress (0.2 - 0.5)</span>
            <div className="h-2 flex-1 mx-4 rounded-full bg-gradient-to-r from-amber-500 via-emerald-600 to-emerald-400" />
            <span>Optimal Vigor (0.8 - 0.95)</span>
          </div>
        </div>

        {/* Selected Zone Inspector (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0a2318] border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white">
              Zone {selectedCellData?.id} Telemetry Profile
            </h3>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                selectedCellData?.status === 'Stress Anomaly'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {selectedCellData?.status}
            </span>
          </div>

          {selectedCellData && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">NDVI Index</span>
                  <strong className="text-emerald-400 text-lg font-display">{selectedCellData.ndvi}</strong>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">NDWI Moisture</span>
                  <strong className="text-sky-400 text-lg font-display">{selectedCellData.ndwi}</strong>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">NDRE Chlorophyll</span>
                  <strong className="text-white text-lg font-display">{selectedCellData.ndre}</strong>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Canopy Temp</span>
                  <strong className="text-amber-400 text-lg font-display">{selectedCellData.temp}°C</strong>
                </div>
              </div>

              {selectedCellData.id === 'B-3' ? (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Thermal Stress & Moisture Deficit Detected</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Zone B-3 canopy temperature is 3.8°C higher than adjacent plots, with NDWI dropped to 0.32. Indicates possible clogged drip lateral or root compaction.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Healthy Vegetative Vigor</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Uniform vegetative biomass, active chlorophyll absorption, and balanced canopy transpiration.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
