/**
 * Academic Comparison Tab: High School Project vs. University Graduation Project
 * Directly illustrates the academic depth, mathematical rigor, and engineering advancements
 */

import React from 'react';
import { Check, X, ArrowUpRight, GraduationCap, GitCompare, BookOpen, Layers } from 'lucide-react';

const SENSOR_RIG_IMG = '/src/assets/images/smart_chair_sensor_rig_1791712961292.jpg';
const SPINE_MODEL_IMG = '/src/assets/images/biomechanics_spine_model_1791712974038.jpg';

export const ProjectComparisonTab: React.FC = () => {
  const comparisonItems = [
    {
      category: '姿態分類維度 (Taxonomy)',
      highSchool: '二元粗分 (只有「正確 / 不正確」兩種狀態)',
      university: '8 類多標籤生醫姿態 (端正、駝背、癱坐、脊椎左/右側傾、左/右二郎腿、前緣淺坐)',
      significance: '從粗略存在感測提升至具備臨床復健與人因工學意義之細分診斷'
    },
    {
      category: '判斷核心演算法 (Core Algorithm)',
      highSchool: '靜態硬編碼門檻 (if fsr > 50 && distance > 10)',
      university: '機器學習多模型融合 (Random Forest 96.8%, SVM, MLP, CART, KNN)',
      significance: '解決體重差異帶來的固定門檻失效，抗噪性與非線性適應力大幅躍升'
    },
    {
      category: '資料分析與特徵工程 (Feature Depth)',
      highSchool: '零特徵工程 (直接使用原始 ADC 電壓與超音波公分數)',
      university: '14 維幾何與力學特徵空間 (壓力中心 COP-X/Y、非對稱指數 ASI、背椅比 BSR、壓力資訊熵等)',
      significance: '具備物理幾何可解釋性，特徵重要性分析達 84.6% PCA 解釋變異'
    },
    {
      category: '人因與臨床醫學指標 (Biomechanical Model)',
      highSchool: '無醫學模型 (僅憑感覺認為「駝背背部壓力小」)',
      university: 'Chaffin & Andersson 脊椎間盤機械應力模型 + REBA 人體工學風險評級 + ISO 11226',
      significance: '可量化輸出 L4-L5 間盤受力 (牛頓 N) 與長期久坐累積疲勞積分 (kN·s)'
    },
    {
      category: '實驗驗證規模 (Experimental Scale)',
      highSchool: '3 位受試者、測試有無提醒的反應秒數 (高中報告【表1】)',
      university: '30 位受試者 (體重分佈 48-88kg)、800+ 臨床樣本、5-Fold 交叉驗證、ANOVA 檢定 (p < 0.001)',
      significance: '具備統計顯著性，符合大學電機/資工/醫工專題論文發表規範'
    },
    {
      category: '邊緣運算與代碼部署 (Edge Deployment)',
      highSchool: 'Arduino 簡單 Serial.print + App Inventor 藍牙',
      university: '支援 TinyML C++ 自動化程式碼生成 (決策樹/定點數矩陣)，可直接燒錄進微控制器獨立離線推論',
      significance: '脫離手機 App 運算依賴，硬體具備高可靠性與即時毫秒級邊緣智慧'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Visual Showcase Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
            <img
              src={SENSOR_RIG_IMG}
              alt="智慧感測椅硬體拓撲研究視圖"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <span className="absolute bottom-3 left-3 text-xs font-mono text-cyan-300 bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
              圖 A：智慧感測椅 2.0 硬體拓撲升級陣列
            </span>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">硬體陣列延續與幾何標定升級</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                完整繼承高中專題以 Arduino UNO、椅背雙大壓力片、座墊四小壓力片與雙腿超音波之實體配置，但重新對感測器進行平面直角坐標系幾何標定，賦予力學幾何意義。
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-2">
              原始傳承：電機創意組 · 指導老師：陳俊成
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
            <img
              src={SPINE_MODEL_IMG}
              alt="人體骨盆壓力與腰椎受力生物力學模型"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <span className="absolute bottom-3 left-3 text-xs font-mono text-cyan-300 bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
              圖 B：人體骨盆壓力中心 (COP) 與脊椎力學解析
            </span>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">大學級生醫人因工程立論深度</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                結合人體解剖學骨盆坐骨結節 (Ischial Tuberosity) 與腰椎前凸角度 (Lumbar Lordosis)，將感測電壓直接映射為臨床脊椎間盤機械負載 (單位：牛頓 N)。
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-2">
              學術依據：ISO 11226 人體工學靜態工作姿勢標準
            </div>
          </div>
        </div>
      </div>

      {/* Structured Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <GitCompare className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-semibold text-white">
              高中專題 (1.0) vs. 大學畢業專題 (2.0) 核心演進對照表
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              明確梳理從高中技藝競賽創意作品，躍升為大學電機/醫工學術畢業專題之升級維度
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 w-[18%]">評比維度</th>
                <th className="py-3 px-4 w-[28%] text-rose-300">高中專題 (原版 1.0)</th>
                <th className="py-3 px-4 w-[34%] text-cyan-300">大學專題 (升級版 2.0)</th>
                <th className="py-3 px-4 w-[20%]">學術升級價值</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 leading-relaxed">
              {comparisonItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    <div className="flex items-start gap-1.5">
                      <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{item.highSchool}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200">
                    <div className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="font-medium text-cyan-100">{item.university}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {item.significance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggested University Thesis Structure Guidance */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-semibold text-white">大學專題論文章節結構建議 (Thesis Chapter Outline)</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          您可以直接將本系統之架構、數學模型與實測圖表，無縫整合進大學專題論文報告書中：
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5">
            <span className="text-cyan-400 font-mono font-semibold block mb-1">第一章 · 緒論與研究動機</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              探討現代職場久坐骨骼肌肉疾病 (WMSD) 盛行率；批判分析傳統穿戴式背帶的不便性與早期固定門檻物聯網椅子的誤判盲點。
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5">
            <span className="text-cyan-400 font-mono font-semibold block mb-1">第二章 · 生物理學特徵工程</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              推導壓力中心 ($COP_x, COP_y$) 二維力矩公式、左右非對稱指數 (ASI)、背椅力矩比 (BSR) 及空間壓力資訊熵之數學定義。
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5">
            <span className="text-cyan-400 font-mono font-semibold block mb-1">第三章 · 機器學習架構與實測</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              詳述 5 種分類模型 (RF, SVM, MLP, KNN, CART) 之超參數設置、5-Fold 交叉驗證、混淆矩陣對比與邊緣端運算延遲評估。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
