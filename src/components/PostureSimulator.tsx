/**
 * Posture Simulator & Real-Time Hardware Predictor
 * Allows manual sensor tuning, posture presets, and pasting real Arduino serial monitor logs
 */

import React, { useState } from 'react';
import { RawSensorData, PostureType, BiomechanicalFeatures } from '../types/chair';
import { POSTURE_DEFINITIONS } from '../utils/biomechanics';
import { predictPosture, ML_MODELS, POSTURE_CLASSES, PredictionResult } from '../utils/mlEngine';
import { HIGH_SCHOOL_ORIGINAL_LOGS } from '../utils/dataset';
import { Activity, Cpu, Sliders, Terminal, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

interface PostureSimulatorProps {
  sensors: RawSensorData;
  features: BiomechanicalFeatures;
  onUpdateSensors: (newSensors: RawSensorData) => void;
  selectedModelId: string;
  onSelectModelId: (modelId: string) => void;
}

export const PostureSimulator: React.FC<PostureSimulatorProps> = ({
  sensors,
  features,
  onUpdateSensors,
  selectedModelId,
  onSelectModelId
}) => {
  const [serialLogInput, setSerialLogInput] = useState('');
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [parseMessage, setParseMessage] = useState<string | null>(null);

  // Run ML Prediction
  const prediction: PredictionResult = predictPosture(sensors, selectedModelId);
  const def = POSTURE_DEFINITIONS[prediction.predictedPosture];

  // Apply a posture preset
  const handleSelectPreset = (postureKey: PostureType) => {
    const base = POSTURE_DEFINITIONS[postureKey].typicalSensors;
    onUpdateSensors({ ...base });
  };

  // Apply original High School Arduino Log
  const handleSelectHighSchoolLog = (idx: number) => {
    onUpdateSensors({ ...HIGH_SCHOOL_ORIGINAL_LOGS[idx].raw });
  };

  // Parse raw Arduino Serial text pasted by user
  const handleParseSerialInput = () => {
    try {
      const text = serialLogInput.trim();
      const newSensors = { ...sensors };

      // Case 1: comma separated "465, 98, 958, 867, 511, 259, 3, 5"
      if (text.includes(',')) {
        const parts = text.split(',').map(s => parseFloat(s.trim()));
        if (parts.length >= 6) {
          newSensors.fsr0_backLeft = Math.round(parts[0]) || 0;
          newSensors.fsr1_backRight = Math.round(parts[1]) || 0;
          newSensors.fsr2_seatFrontLeft = Math.round(parts[2]) || 0;
          newSensors.fsr3_seatFrontRight = Math.round(parts[3]) || 0;
          newSensors.fsr4_seatRearLeft = Math.round(parts[4]) || 0;
          newSensors.fsr5_seatRearRight = Math.round(parts[5]) || 0;
          if (parts.length >= 8) {
            newSensors.us0_leftCalfDist = parts[6];
            newSensors.us1_rightCalfDist = parts[7];
          }
          onUpdateSensors(newSensors);
          setParseMessage('已成功解析逗號分隔格式並載入！');
          setShowSerialModal(false);
          return;
        }
      }

      // Case 2: Arduino Serial format like PDF Figure 7:
      // "壓力感測器[0]: 465\n壓力感測器[1]: 98..."
      const fsrRegex = /壓力感測器\[(\d)\]\s*:\s*(\d+)/g;
      const usRegex = /超音波感測器\[(\d)\]\s*:\s*(\d+(?:\.\d+)?)/g;

      let match;
      let matchedCount = 0;
      while ((match = fsrRegex.exec(text)) !== null) {
        const idx = parseInt(match[1]);
        const val = parseInt(match[2]);
        if (idx === 0) newSensors.fsr0_backLeft = val;
        if (idx === 1) newSensors.fsr1_backRight = val;
        if (idx === 2) newSensors.fsr2_seatFrontLeft = val;
        if (idx === 3) newSensors.fsr3_seatFrontRight = val;
        if (idx === 4) newSensors.fsr4_seatRearLeft = val;
        if (idx === 5) newSensors.fsr5_seatRearRight = val;
        matchedCount++;
      }

      while ((match = usRegex.exec(text)) !== null) {
        const idx = parseInt(match[1]);
        const val = parseFloat(match[2]);
        if (idx === 0) newSensors.us0_leftCalfDist = val;
        if (idx === 1) newSensors.us1_rightCalfDist = val;
        matchedCount++;
      }

      if (matchedCount > 0) {
        onUpdateSensors(newSensors);
        setParseMessage(`已成功辨識並更新 ${matchedCount} 項 Arduino 序列埠參數！`);
        setShowSerialModal(false);
      } else {
        setParseMessage('未能辨識格式，請確認是否為逗號分隔數值或專題報告中的序列埠文字。');
      }
    } catch (err) {
      setParseMessage('解析錯誤，請檢查輸入內容格式。');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Real-time Inference Result Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>邊緣機器學習即時推論核心</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">延遲 {prediction.inferenceLatencyMs} ms</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              {def.labelZh}
              <span className="text-sm font-normal text-slate-400 font-mono">({def.labelEn})</span>
            </h2>
          </div>

          {/* Model Selector Pill-free Segmented Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto">
            {ML_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelectModelId(m.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedModelId === m.id
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Prediction Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
          {/* Confidence */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
            <span className="text-xs text-slate-400 block mb-1">模型信心度 (Confidence)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                {(prediction.confidence * 100).toFixed(1)}%
              </span>
              <span className="text-xs text-slate-500">Softmax Posterior</span>
            </div>
          </div>

          {/* REBA Ergonomic Risk Score */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
            <span className="text-xs text-slate-400 block mb-1">人因人體工學 REBA 風險</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-mono tabular-nums ${
                def.riskLevel === 'optimal' ? 'text-emerald-400' :
                def.riskLevel === 'mild' ? 'text-blue-400' :
                def.riskLevel === 'moderate' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {def.rebaScore} / 15
              </span>
              <span className="text-xs capitalize font-medium text-slate-400">
                {def.riskLevel === 'optimal' ? '無危害 (標準)' :
                 def.riskLevel === 'mild' ? '低風險' :
                 def.riskLevel === 'moderate' ? '中度警示' : '高危險 (急需矯正)'}
              </span>
            </div>
          </div>

          {/* Spinal Disc Load */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
            <span className="text-xs text-slate-400 block mb-1">腰椎 L4-L5 承受壓力估算</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-200 tabular-nums">
                {features.estimatedLumbarLoadN} N
              </span>
              <span className={`text-xs font-mono ${def.spinalLoadFactor > 1.2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {def.spinalLoadFactor > 1 ? `+${Math.round((def.spinalLoadFactor - 1) * 100)}%` : '基準值'}
              </span>
            </div>
          </div>

          {/* Center of Pressure (COP) */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
            <span className="text-xs text-slate-400 block mb-1">壓力中心偏移 (COP Offset)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-slate-200 tabular-nums">
                X:{features.copX} Y:{features.copY}
              </span>
              <span className="text-xs font-mono text-slate-400">mm</span>
            </div>
          </div>
        </div>

        {/* Clinical Posture Description */}
        <p className="text-xs text-slate-300 bg-slate-950/50 p-3 rounded-lg border border-slate-800/70 leading-relaxed">
          <strong className="text-slate-100 font-semibold mr-1">生醫評估：</strong>
          {def.description}
        </p>

        {/* Multi-Class Probability Distribution */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <span className="text-xs font-mono text-slate-400 block mb-2.5">
            全類別多標籤後驗機率分佈 (Softmax Multi-Class Probability Distribution)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {POSTURE_CLASSES.map((postureKey) => {
              const pDef = POSTURE_DEFINITIONS[postureKey];
              const prob = prediction.probabilities[postureKey] || 0;
              const isTop = postureKey === prediction.predictedPosture;

              return (
                <div
                  key={postureKey}
                  className={`p-2 rounded-lg border text-xs transition-colors ${
                    isTop
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="truncate font-medium">{pDef.labelZh.split(' (')[0]}</span>
                    <span className="font-mono font-bold tabular-nums">{(prob * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${isTop ? 'bg-cyan-400' : 'bg-slate-600'}`}
                      style={{ width: `${Math.max(2, prob * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Interactive Presets & High School Log Loaders */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100">坐姿場景快速注入與實測數據載入</h3>
            <p className="text-xs text-slate-400">點擊模擬不同人體坐姿生理特徵，或直接載入專題原檔真實記錄進行演算法驗證</p>
          </div>
          <button
            onClick={() => setShowSerialModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <Terminal className="w-3.5 h-3.5" />
            貼上 Arduino 序列埠數據
          </button>
        </div>

        {/* 8 Posture Standard Presets */}
        <div className="mb-4">
          <span className="text-xs font-mono text-slate-400 block mb-2">大學級 8 種標準臨床坐姿拓撲預設：</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {POSTURE_CLASSES.map((postureKey) => {
              const pDef = POSTURE_DEFINITIONS[postureKey];
              const isCurrent = postureKey === prediction.predictedPosture;
              return (
                <button
                  key={postureKey}
                  onClick={() => handleSelectPreset(postureKey)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    isCurrent
                      ? 'border-cyan-500 bg-cyan-950/50 text-white font-medium'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span className="block font-semibold mb-0.5">{pDef.labelZh}</span>
                  <span className="text-[11px] text-slate-400 block truncate">{pDef.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* High School Original PDF Log Presets */}
        <div className="pt-3 border-t border-slate-800">
          <span className="text-xs font-mono text-amber-400 block mb-2">
            高中專題報告原檔【圖7】實測取樣數據驗證：
          </span>
          <div className="flex flex-col sm:flex-row gap-2">
            {HIGH_SCHOOL_ORIGINAL_LOGS.map((log, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectHighSchoolLog(idx)}
                className="flex-1 text-left p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <span className="font-semibold block text-slate-200 mb-1">{log.label}</span>
                <span className="font-mono text-[11px] text-slate-400 block">
                  背:[{log.raw.fsr0_backLeft}, {log.raw.fsr1_backRight}] 腿:[{log.raw.fsr2_seatFrontLeft}, {log.raw.fsr3_seatFrontRight}] 坐骨:[{log.raw.fsr4_seatRearLeft}, {log.raw.fsr5_seatRearRight}]
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Arduino Serial Paste Modal */}
      {showSerialModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>貼上 Arduino Serial Monitor 數據</span>
              </div>
              <button
                onClick={() => setShowSerialModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              支援直接貼上 Arduino 序列埠監視器輸出（如報告【圖7】格式）或 8 個感測器數值逗號分隔：
              <code className="text-cyan-300 block bg-slate-950 p-1.5 rounded mt-1 font-mono text-[11px]">
                壓力感測器[0]: 465 壓力感測器[1]: 98 ... 超音波感測器[0]: 3
              </code>
            </p>

            <textarea
              rows={6}
              value={serialLogInput}
              onChange={(e) => setSerialLogInput(e.target.value)}
              placeholder="請在此處貼上 Arduino 序列埠監視器輸出內容..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />

            {parseMessage && (
              <div className="mt-2 text-xs text-amber-400 font-mono">
                {parseMessage}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowSerialModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                取消
              </button>
              <button
                onClick={handleParseSerialInput}
                className="px-4 py-2 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                解析並更新感測器
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
