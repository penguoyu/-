/**
 * Chair & Sensor Visualizer Component
 * Accurately models the hardware rig from the PDF report:
 * 2 large FSRs on Backrest, 4 small FSRs on Seat, 2 Ultrasonic sensors at calf
 */

import React from 'react';
import { RawSensorData, BiomechanicalFeatures } from '../types/chair';

interface ChairVisualizerProps {
  sensors: RawSensorData;
  features: BiomechanicalFeatures;
  onSensorChange?: (key: keyof RawSensorData, value: number) => void;
  isInteractive?: boolean;
}

export const ChairVisualizer: React.FC<ChairVisualizerProps> = ({
  sensors,
  features,
  onSensorChange,
  isInteractive = true
}) => {
  // Pressure to color helper (0-1023)
  const getPressureColor = (val: number) => {
    const ratio = Math.min(1, Math.max(0, val / 1023));
    if (ratio < 0.05) return 'rgb(30, 41, 59)'; // Dark slate
    if (ratio < 0.25) return 'rgb(6, 182, 212)'; // Cyan
    if (ratio < 0.55) return 'rgb(34, 197, 94)'; // Green
    if (ratio < 0.8) return 'rgb(234, 179, 8)'; // Amber / Yellow
    return 'rgb(239, 68, 68)'; // Crimson Red
  };

  const getPressureBgGradient = (val: number) => {
    const ratio = Math.min(1, Math.max(0, val / 1023));
    const opacity = Math.max(0.15, ratio);
    if (ratio < 0.25) return `rgba(6, 182, 212, ${opacity})`;
    if (ratio < 0.55) return `rgba(34, 197, 94, ${opacity})`;
    if (ratio < 0.8) return `rgba(234, 179, 8, ${opacity})`;
    return `rgba(239, 68, 68, ${opacity})`;
  };

  // Convert COP (-100 to +100 mm) to SVG seat percentage (50% is center)
  // Seat width: 220px, seat depth: 220px
  const copSvgX = 140 + (features.copX / 100) * 80;
  // Notice Y: front is positive Y (+100mm = bottom of seat in view, -100mm = rear of seat / top of seat in view)
  const copSvgY = 240 + (features.copY / 100) * 70;

  return (
    <div className="flex flex-col gap-4">
      {/* Visual Canvas Container */}
      <div className="relative bg-slate-900/90 border border-slate-800 rounded-xl p-5 overflow-hidden">
        {/* Top Status Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">硬體感測陣列拓撲視圖</span>
            <span className="text-slate-500 font-mono">Arduino 10-bit ADC (0-1023)</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono">
            <span>COP: [{features.copX > 0 ? `+${features.copX}` : features.copX}, {features.copY > 0 ? `+${features.copY}` : features.copY}] mm</span>
            <span className="text-slate-600">|</span>
            <span>非對稱率 ASI: {features.lateralAsymmetryIndex}%</span>
          </div>
        </div>

        {/* Chair Graphic Stage */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
          {/* 2D Plan View of Backrest & Seat */}
          <div className="relative w-[300px] h-[380px] bg-slate-950/80 rounded-xl border border-slate-800/80 p-3 shadow-inner flex flex-col items-center">
            
            {/* 1. Backrest Section (椅背 - 2 Large FSRs) */}
            <div className="w-[240px] h-[100px] rounded-lg border-2 border-slate-700 bg-slate-900/60 p-2 relative flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-1">
                <span>椅背支撐面 (Backrest)</span>
                <span>FSR [0, 1]</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 h-[60px]">
                {/* Back Left FSR 0 */}
                <div 
                  className="rounded-md border border-slate-700 p-1 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: getPressureBgGradient(sensors.fsr0_backLeft) }}
                  onClick={() => onSensorChange && onSensorChange('fsr0_backLeft', sensors.fsr0_backLeft > 500 ? 50 : 750)}
                  title="點擊切換左背受力"
                >
                  <span className="text-[10px] text-slate-300 font-mono">左背 FSR 0</span>
                  <span className="text-xs font-mono font-bold text-white tabular-nums">{sensors.fsr0_backLeft}</span>
                </div>

                {/* Back Right FSR 1 */}
                <div 
                  className="rounded-md border border-slate-700 p-1 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: getPressureBgGradient(sensors.fsr1_backRight) }}
                  onClick={() => onSensorChange && onSensorChange('fsr1_backRight', sensors.fsr1_backRight > 500 ? 50 : 750)}
                  title="點擊切換右背受力"
                >
                  <span className="text-[10px] text-slate-300 font-mono">右背 FSR 1</span>
                  <span className="text-xs font-mono font-bold text-white tabular-nums">{sensors.fsr1_backRight}</span>
                </div>
              </div>
            </div>

            {/* Gap hinge */}
            <div className="w-12 h-2.5 bg-slate-800 rounded-sm my-1 border-x border-slate-700"></div>

            {/* 2. Seat Pan Section (座墊 - 4 Small FSRs + COP) */}
            <div className="w-[240px] h-[190px] rounded-xl border-2 border-slate-700 bg-slate-900/60 p-2 relative flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-1">
                <span>座墊承重面 (Seat Cushion)</span>
                <span>FSR [4, 5, 2, 3]</span>
              </div>

              {/* Rear Ischial Tuberosity (坐骨支撐點 FSR 4, 5) */}
              <div className="grid grid-cols-2 gap-3 h-[56px] mt-1">
                <div 
                  className="rounded-md border border-slate-700 p-1 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: getPressureBgGradient(sensors.fsr4_seatRearLeft) }}
                  onClick={() => onSensorChange && onSensorChange('fsr4_seatRearLeft', sensors.fsr4_seatRearLeft > 500 ? 120 : 850)}
                  title="左坐骨支撐"
                >
                  <span className="text-[10px] text-slate-300 font-mono">左坐骨 FSR 4</span>
                  <span className="text-xs font-mono font-bold text-white tabular-nums">{sensors.fsr4_seatRearLeft}</span>
                </div>

                <div 
                  className="rounded-md border border-slate-700 p-1 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: getPressureBgGradient(sensors.fsr5_seatRearRight) }}
                  onClick={() => onSensorChange && onSensorChange('fsr5_seatRearRight', sensors.fsr5_seatRearRight > 500 ? 120 : 850)}
                  title="右坐骨支撐"
                >
                  <span className="text-[10px] text-slate-300 font-mono">右坐骨 FSR 5</span>
                  <span className="text-xs font-mono font-bold text-white tabular-nums">{sensors.fsr5_seatRearRight}</span>
                </div>
              </div>

              {/* Front Thigh Support (大腿支撐點 FSR 2, 3) */}
              <div className="grid grid-cols-2 gap-3 h-[56px] mt-2">
                <div 
                  className="rounded-md border border-slate-700 p-1 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: getPressureBgGradient(sensors.fsr2_seatFrontLeft) }}
                  onClick={() => onSensorChange && onSensorChange('fsr2_seatFrontLeft', sensors.fsr2_seatFrontLeft > 500 ? 100 : 750)}
                  title="左大腿支撐"
                >
                  <span className="text-[10px] text-slate-300 font-mono">左大腿 FSR 2</span>
                  <span className="text-xs font-mono font-bold text-white tabular-nums">{sensors.fsr2_seatFrontLeft}</span>
                </div>

                <div 
                  className="rounded-md border border-slate-700 p-1 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: getPressureBgGradient(sensors.fsr3_seatFrontRight) }}
                  onClick={() => onSensorChange && onSensorChange('fsr3_seatFrontRight', sensors.fsr3_seatFrontRight > 500 ? 100 : 750)}
                  title="右大腿支撐"
                >
                  <span className="text-[10px] text-slate-300 font-mono">右大腿 FSR 3</span>
                  <span className="text-xs font-mono font-bold text-white tabular-nums">{sensors.fsr3_seatFrontRight}</span>
                </div>
              </div>

              {/* Dynamic Center of Pressure (COP) crosshair indicator overlay */}
              <div 
                className="absolute w-5 h-5 pointer-events-none transition-all duration-150 ease-out z-10"
                style={{
                  left: `calc(50% + ${(features.copX / 100) * 85}px - 10px)`,
                  top: `calc(50% + ${(features.copY / 100) * 65}px - 10px)`
                }}
              >
                <div className="w-5 h-5 rounded-full border-2 border-cyan-400 bg-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-200"></div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-300 bg-slate-900/90 px-1 rounded whitespace-nowrap border border-cyan-500/30">
                  COP
                </div>
              </div>
            </div>

            {/* Front Label */}
            <span className="text-[10px] text-slate-500 font-mono mt-1">▲ 椅面朝前 (Front)</span>
          </div>

          {/* 3. Ultrasonic Calf Sensors & Leg Clearances */}
          <div className="flex flex-col gap-4 w-full max-w-[320px]">
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-slate-200">雙側小腿超音波測距</span>
                <span className="text-slate-400 font-mono text-[11px]">HC-SR04 (cm)</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                安裝於椅腿下方，用於監測小腿垂直距離與翹二郎腿偏位：
              </p>

              {/* Left Calf Distance */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">左小腿距離 (US 0):</span>
                  <span className="text-white font-bold">{sensors.us0_leftCalfDist} cm</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${sensors.us0_leftCalfDist > 14 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                    style={{ width: `${Math.min(100, (sensors.us0_leftCalfDist / 30) * 100)}%` }}
                  />
                </div>
                {isInteractive && (
                  <input
                    type="range"
                    min="2"
                    max="35"
                    step="0.5"
                    value={sensors.us0_leftCalfDist}
                    onChange={(e) => onSensorChange && onSensorChange('us0_leftCalfDist', parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer h-1 bg-slate-800"
                  />
                )}
              </div>

              {/* Right Calf Distance */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">右小腿距離 (US 1):</span>
                  <span className="text-white font-bold">{sensors.us1_rightCalfDist} cm</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${sensors.us1_rightCalfDist > 14 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                    style={{ width: `${Math.min(100, (sensors.us1_rightCalfDist / 30) * 100)}%` }}
                  />
                </div>
                {isInteractive && (
                  <input
                    type="range"
                    min="2"
                    max="35"
                    step="0.5"
                    value={sensors.us1_rightCalfDist}
                    onChange={(e) => onSensorChange && onSensorChange('us1_rightCalfDist', parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer h-1 bg-slate-800"
                  />
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] font-mono text-slate-400">
                <span>兩腿差值 Δ:</span>
                <span className={features.calfClearanceDelta > 6 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                  {features.calfClearanceDelta} cm {features.calfClearanceDelta > 6 ? '(二郎腿警示)' : '(正常平行)'}
                </span>
              </div>
            </div>

            {/* Quick Metrics Badge Strip */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5">
                <span className="text-[10px] text-slate-400 font-mono block">背椅受力比 (BSR)</span>
                <span className="text-base font-bold font-mono text-slate-100">
                  {(features.backrestSupportRatio * 100).toFixed(1)}%
                </span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5">
                <span className="text-[10px] text-slate-400 font-mono block">總體壓力負荷</span>
                <span className="text-base font-bold font-mono text-slate-100">
                  {features.totalPressure} ADC
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Ramp Legend */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
          <span className="font-mono">壓力負載等級規約:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-800 inline-block"></span>
            <span>無負重 (0)</span>
            <span className="w-3 h-3 rounded bg-cyan-500 inline-block ml-2"></span>
            <span>輕度 (250)</span>
            <span className="w-3 h-3 rounded bg-green-500 inline-block ml-2"></span>
            <span>適度 (550)</span>
            <span className="w-3 h-3 rounded bg-amber-500 inline-block ml-2"></span>
            <span>顯著 (800)</span>
            <span className="w-3 h-3 rounded bg-red-500 inline-block ml-2"></span>
            <span>重載 (1023)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
