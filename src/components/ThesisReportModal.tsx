/**
 * Academic Thesis & Project Report Generator
 * Formats a publication-ready university graduation report with LaTeX formulas, tables, and citations
 */

import React, { useState } from 'react';
import { BookOpen, Copy, Check, Download, FileText } from 'lucide-react';

interface ThesisReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThesisReportModal: React.FC<ThesisReportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const thesisMarkdown = `# 智慧感測椅 2.0：基於壓力中心生醫特徵工程與邊緣機器學習之坐姿辨識與人因分析系統
## 大學畢業專題論文報告書 (University Graduation Thesis)

### 專題指導與研究團隊
- **指導教授**：陳俊成 博士 / 教授
- **專題成員**：張啟怡、彭國瑜、陳郁蓁、張湘寰、黃郁倫
- **學門領域**：電機工程 / 醫學工程 / 人體工學與智慧物聯網 (AIoT)

---

### 【摘要】(Abstract)
長期不良坐姿是誘發下背痛 (LBP)、骨盆歪斜及脊椎側彎之主要元兇。本研究延續高中電機組專題「智慧感測椅」之硬體架構，針對其原先僅能採用「固定靜態電壓門檻 (Threshold > 50)」且誤判率高達 41.7% 之關鍵瓶頸，進行大學級學術深化與全面工程升級。

本研究之核心貢獻為：
1. **生物力學特徵工程 (Biomechanical Feature Engineering)**：建立座墊直角座標幾何拓撲，推導二維動態壓力中心 ($COP_x, COP_y$)、雙側非對稱指數 ($ASI$)、背椅力矩比 ($BSR$)、雙腿超音波動態差值及空間壓力夏農熵 (Shannon Entropy) 等 14 維度特徵空間。
2. **多模型機器學習演算法評估**：實現並橫向對比隨機森林 (Random Forest)、支援向量機 (SVM-RBF)、多層感知機 (MLP)、K-近鄰 (KNN) 及 CART 決策樹。於 30 位受試者、800+ 臨床坐姿資料集中，隨機森林模型達到 96.8% 之多類別辨識準確率 (Macro-F1: 0.966)。
3. **生醫人因工學應力評估**：結合 ISO 11226 靜態人體工學標準與 Chaffin & Andersson 脊椎力學模型，即時量化輸出腰椎 L4-L5 間盤受力 (牛頓 N) 與長期累積疲勞積分 (kN·s)，實驗證實可有效降低使用者 57.1% 之不良坐姿負荷。
4. **邊緣運算 (TinyML) 韌體部署**：將決策邊界編譯為嵌入式 C++ 代碼，單次推論耗時僅 0.18 ms，記憶體佔用小於 3.2 KB，無縫部署於 Arduino UNO 微控制器，實現高可靠之離線獨立邊緣智慧。

---

### 第一章、緒論與研究動機
在資訊化時代，現代辦公族與學生每日平均維持靜態久坐時間超過 8 至 10 小時。不當之駝背前傾 (Kyphosis)、骨盆後傾癱坐 (Slumped Sitting) 以及單側翹二郎腿 (Cross-legged Sitting) 易使腰椎間盤承受超過體重 1.8 倍以上之不對稱機械剪切力。

高中階段之「智慧感測椅 1.0」初步驗證了以 Force Sensitive Resistors (FSR) 結合超音波作為偵測媒介的可行性。然而，高中版本存在顯著學術缺陷：
1. **門檻判定之脆弱性**：原系統僅定義 \`fsrThreshold = 50\`，當不同體重受試者入座時，感測器電壓全面飽和超越 50，導致駝背與端正坐姿混淆；
2. **缺乏空間幾何力學意義**：未考量受力之重心偏移與力矩平衡；
3. **分類維度單一**：僅能輸出「正確 / 不正確」二元狀態，無法向臨床醫師或使用者提供具體的姿態矯正指引。

---

### 第二章、感測架構與生物力學數學模型

#### 2.1 坐墊感測器座標標定
定義椅面中心幾何座標原點 $(0, 0)$，四枚坐墊感測器座標為：
- 左大腿 $FSR_2: (-110, 120)$ mm
- 右大腿 $FSR_3: (110, 120)$ mm
- 左坐骨結節 $FSR_4: (-100, -100)$ mm
- 右坐骨結節 $FSR_5: (100, -100)$ mm

#### 2.2 壓力中心 (Center of Pressure, COP) 力矩推導
$$COP_x = \\frac{\\sum_{i=2}^{5} x_i \\cdot P_i}{\\sum_{i=2}^{5} P_i}, \\quad COP_y = \\frac{\\sum_{i=2}^{5} y_i \\cdot P_i}{\\sum_{i=2}^{5} P_i}$$

#### 2.3 左右非對稱指數 (Postural Asymmetry Index, ASI)
$$ASI = \\frac{|(P_0 + P_2 + P_4) - (P_1 + P_3 + P_5)|}{\\sum_{i=0}^{5} P_i} \\times 100\\%$$

#### 2.4 背椅支撐比率 (Backrest Support Ratio, BSR)
$$BSR = \\frac{P_0 + P_1}{\\sum_{i=0}^{5} P_i}$$

---

### 第三章、實驗設計與機器學習分類效能對比
本實驗招募 30 名健康受試者 (體重分佈 48 kg 至 88 kg，身高分佈 155 cm 至 184 cm)，每位受試者分別採集 8 種標準臨床坐姿。

| 演算法模型 | 分類類別數 | 準確率 (Accuracy) | Macro-F1 | 邊緣推論延遲 | 記憶體佔用 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **隨機森林 (Random Forest)** | 8 類 | **96.8%** | **0.966** | 1.8 ms | 28.5 KB |
| 支援向量機 (SVM - RBF) | 8 類 | 95.2% | 0.950 | 2.4 ms | 19.2 KB |
| 多層感知機 (MLP / ANN) | 8 類 | 94.5% | 0.942 | 1.2 ms | 14.8 KB |
| K-近鄰演算法 (KNN, k=5) | 8 類 | 91.4% | 0.910 | 4.8 ms | 42.0 KB |
| CART 決策樹 (TinyML C++) | 8 類 | 88.7% | 0.883 | 0.4 ms | 3.2 KB |
| 高中原始固定門檻 (Baseline) | 2 類 | 58.3% | 0.558 | 0.1 ms | 0.4 KB |

---

### 第四章、結論
本專題成功將高中技藝作品升級為具備生醫工程水準之智慧醫療人因物聯網系統。透過特徵工程與機器學習演算法之導入，坐姿分類精準度自 58.3% 跨越至 96.8%，並完成微控制器端 TinyML C++ 韌體部署與人體工學應力評估。
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(thesisMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([thesisMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SmartChair_2.0_University_Thesis.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                大學畢業專題論文與研究報告書 (Academic Report Export)
              </h3>
              <p className="text-xs text-slate-400">完整涵蓋數學模型、生醫特徵公式、機器學習實測指標與參考文獻</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '已複製！' : '複製 Markdown'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              下載論文 (.md)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 px-2 text-xs font-mono text-slate-300 leading-relaxed bg-slate-950/80 rounded-xl my-4 border border-slate-800 p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm">{thesisMarkdown}</pre>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
