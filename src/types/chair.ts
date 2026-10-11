/**
 * Types and interfaces for Smart Sensing Chair 2.0
 * University Biomedical & Machine Learning Posture System
 */

export interface RawSensorData {
  // Backrest sensors (2 large FSRs)
  fsr0_backLeft: number;    // 0 - 1023 (Arduino 10-bit ADC)
  fsr1_backRight: number;   // 0 - 1023
  // Seat cushion sensors (4 small FSRs)
  fsr2_seatFrontLeft: number;  // 0 - 1023 (Left Thigh)
  fsr3_seatFrontRight: number; // 0 - 1023 (Right Thigh)
  fsr4_seatRearLeft: number;   // 0 - 1023 (Left Ischial Tuberosity / 坐骨)
  fsr5_seatRearRight: number;  // 0 - 1023 (Right Ischial Tuberosity / 坐骨)
  // Ultrasonic distance sensors (cm)
  us0_leftCalfDist: number;    // 0 - 50 cm (Calf to chair leg)
  us1_rightCalfDist: number;   // 0 - 50 cm
  timestamp?: number;
}

export type PostureType = 
  | 'upright'           // 0: 標準端正坐姿 (Ergonomic Upright)
  | 'slouch_forward'    // 1: 駝背前傾 (Kyphotic Forward Lean)
  | 'slump_reclined'    // 2: 骨盆後傾癱坐 (Slumped Reclining)
  | 'left_tilt'         // 3: 脊椎左傾 (Left Scoliotic Tilt)
  | 'right_tilt'        // 4: 脊椎右傾 (Right Scoliotic Tilt)
  | 'cross_leg_left'    // 5: 左翹二郎腿 (Left Leg Crossed)
  | 'cross_leg_right'   // 6: 右翹二郎腿 (Right Leg Crossed)
  | 'edge_sitting';     // 7: 前緣淺坐 (Forward Edge Sitting)

export interface PostureDefinition {
  id: PostureType;
  labelZh: string;
  labelEn: string;
  description: string;
  riskLevel: 'optimal' | 'mild' | 'moderate' | 'severe';
  rebaScore: number; // Rapid Entire Body Assessment (1-15)
  spinalLoadFactor: number; // Multiplier of upper body weight load on L4-L5 disc
  typicalSensors: RawSensorData;
}

export interface BiomechanicalFeatures {
  // Center of Pressure (COP) in mm (-100 to +100 mm from chair seat center)
  copX: number; // Lateral shift (Left < 0, Right > 0)
  copY: number; // Anteroposterior shift (Rear < 0, Front > 0)
  
  // Postural Asymmetry Index (ASI, 0% - 100%)
  lateralAsymmetryIndex: number;
  
  // Backrest Support Ratio (BSR, 0.0 - 1.0)
  backrestSupportRatio: number;
  
  // Thigh vs Ischium Load Ratio (Front / Rear)
  thighToIschiumRatio: number;
  
  // Total Pressure Load (Sum of all 6 FSRs)
  totalPressure: number;
  
  // Ultrasonic Calf Clearance Delta (|Left - Right| in cm)
  calfClearanceDelta: number;
  
  // Ultrasonic Mean Distance
  calfMeanDistance: number;
  
  // Spatial Pressure Entropy (Shannon entropy of normalized pressure distribution)
  pressureEntropy: number;
  
  // Dynamic Sway Index (Velocity/variance of COP, for fatigue detection)
  copSwayVariance: number;
  
  // Estimated Lumbar Compression Force (Newtons, N)
  estimatedLumbarLoadN: number;
}

export interface MLModelMetrics {
  id: string;
  name: string;
  category: string;
  accuracy: number;        // e.g. 0.968 (96.8%)
  precision: number;       // Macro precision
  recall: number;          // Macro recall
  f1Score: number;         // Macro F1
  inferenceLatencyMs: number; // Edge latency in ms
  memoryFootprintKb: number;  // Arduino/Microcontroller deployment RAM in KB
  cvScoreStd: number;      // 5-Fold Cross Validation standard deviation
  description: string;
  advantages: string[];
  limitations: string[];
}

export interface DatasetSample {
  id: string;
  subjectId: string;
  posture: PostureType;
  raw: RawSensorData;
  features: BiomechanicalFeatures;
  bodyWeightKg: number;
  sessionDurationMin: number;
}

export interface ConfusionMatrixCell {
  actual: PostureType;
  predicted: PostureType;
  count: number;
  percentage: number;
}
