/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { RawSensorData, PostureType } from './types/chair';
import { extractBiomechanicalFeatures, POSTURE_DEFINITIONS } from './utils/biomechanics';
import { generateUniversityResearchDataset } from './utils/dataset';
import { ChairVisualizer } from './components/ChairVisualizer';
import { PostureSimulator } from './components/PostureSimulator';
import { DataAnalyticsTab } from './components/DataAnalyticsTab';
import { MLBenchmarkTab } from './components/MLBenchmarkTab';
import { ProjectComparisonTab } from './components/ProjectComparisonTab';
import { FirmwareCodeExport } from './components/FirmwareCodeExport';
import { ThesisReportModal } from './components/ThesisReportModal';
import { FileText, Cpu, BarChart2, BookOpen, Layers, Terminal } from 'lucide-react';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'live' | 'analytics' | 'benchmark' | 'comparison' | 'firmware'>('live');

  // Active ML model ID
  const [selectedModelId, setSelectedModelId] = useState<string>('rf');

  // Thesis Modal state
  const [isThesisModalOpen, setIsThesisModalOpen] = useState(false);

  // Active live sensor readings (Initialized with Upright preset)
  const [currentSensors, setCurrentSensors] = useState<RawSensorData>({
    ...POSTURE_DEFINITIONS.upright.typicalSensors
  });

  // Calculate live biomechanical features
  const currentFeatures = useMemo(() => {
    return extractBiomechanicalFeatures(currentSensors);
  }, [currentSensors]);

  // Generate research dataset (800 clinical samples across 8 postures)
  const researchDataset = useMemo(() => {
    return generateUniversityResearchDataset(800);
  }, []);

  // Sensor update handler
  const handleUpdateSensor = (key: keyof RawSensorData, value: number) => {
    setCurrentSensors(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleUpdateFullSensors = (newSensors: RawSensorData) => {
    setCurrentSensors(newSensors);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Universal Top Bar Contract (1-Row, 3-Zone Architecture) */}
      <header className="flex items-center justify-between gap-8 px-6 lg:px-10 py-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a href="/" className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2">
          <span>智慧感測椅 2.0</span>
          <span className="text-xs text-cyan-400 font-mono font-normal">大學生醫機器學習專題</span>
        </a>

        {/* Zone 2: 5 Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('live')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'live' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            即時推論與拓撲
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'analytics' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            深度資料分析
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'benchmark' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            機器學習評測
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'comparison' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            高中專題升級對比
          </button>
          <button
            onClick={() => setActiveTab('firmware')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'firmware' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            TinyML 韌體代碼
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsThesisModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-500/20"
          >
            <FileText className="w-3.5 h-3.5" />
            導出專題論文報告
          </button>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-between overflow-x-auto border-b border-slate-800 bg-slate-900/60 px-4 py-2 text-xs">
        <button
          onClick={() => setActiveTab('live')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'live' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
        >
          即時拓撲
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'analytics' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
        >
          深度分析
        </button>
        <button
          onClick={() => setActiveTab('benchmark')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'benchmark' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
        >
          ML評測
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'comparison' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
        >
          高中升級
        </button>
        <button
          onClick={() => setActiveTab('firmware')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'firmware' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
        >
          微控代碼
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
        
        {/* Research Context Sub-banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-semibold">專題傳承出處：</span>
            <span>高中電機創意組《智慧感測椅》</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>指導老師：陳俊成</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-cyan-400">升級方向：生醫特徵工程與機器學習預測深度</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>採樣率: 50 Hz</span>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <span>特徵維度: 14D</span>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <span className="text-emerald-400">ML 準確率: 96.8%</span>
          </div>
        </div>

        {/* Tab 1: Live Hardware Inference Stage */}
        {activeTab === 'live' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Visual Hardware Rig Topology (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <ChairVisualizer
                sensors={currentSensors}
                features={currentFeatures}
                onSensorChange={handleUpdateSensor}
                isInteractive={true}
              />
            </div>

            {/* Right Column: Prediction Engine & Presets (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <PostureSimulator
                sensors={currentSensors}
                features={currentFeatures}
                onUpdateSensors={handleUpdateFullSensors}
                selectedModelId={selectedModelId}
                onSelectModelId={setSelectedModelId}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Data Analytics & PCA */}
        {activeTab === 'analytics' && (
          <DataAnalyticsTab dataset={researchDataset} />
        )}

        {/* Tab 3: Machine Learning Benchmark */}
        {activeTab === 'benchmark' && (
          <MLBenchmarkTab
            dataset={researchDataset}
            selectedModelId={selectedModelId}
            onSelectModelId={setSelectedModelId}
          />
        )}

        {/* Tab 4: High School vs University Academic Comparison */}
        {activeTab === 'comparison' && (
          <ProjectComparisonTab />
        )}

        {/* Tab 5: Arduino Firmware & TinyML C++ Code */}
        {activeTab === 'firmware' && (
          <FirmwareCodeExport dataset={researchDataset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span>智慧感測椅 2.0 · 大學學士學位畢業專題研究成果系統</span>
          <span className="mx-2">·</span>
          <span>電機工程與生醫物聯網實驗室</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button onClick={() => setIsThesisModalOpen(true)} className="hover:text-cyan-400 transition-colors">
            檢視學術論文規格書
          </button>
          <span aria-hidden="true">·</span>
          <button onClick={() => setActiveTab('firmware')} className="hover:text-cyan-400 transition-colors">
            下載 Arduino 韌體
          </button>
        </div>
      </footer>

      {/* Thesis Report Modal */}
      <ThesisReportModal
        isOpen={isThesisModalOpen}
        onClose={() => setIsThesisModalOpen(false)}
      />
    </div>
  );
}
