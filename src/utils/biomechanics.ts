/**
 * Biomechanical calculations, Ergonomics Metrics & Feature Engineering
 * Smart Sensing Chair 2.0 (University Level Upgrade)
 */

import { RawSensorData, BiomechanicalFeatures, PostureType, PostureDefinition } from '../types/chair';

export const POSTURE_DEFINITIONS: Record<PostureType, PostureDefinition> = {
  upright: {
    id: 'upright',
    labelZh: '標準端正坐姿',
    labelEn: 'Ergonomic Upright',
    description: '腰椎處於自然前凸生理曲度，背部均勻貼合椅背，雙腿平行著地，坐骨結節均勻承載上半身體重。',
    riskLevel: 'optimal',
    rebaScore: 1,
    spinalLoadFactor: 1.0, // Baseline load (approx 100% bodyweight)
    typicalSensors: {
      fsr0_backLeft: 460,
      fsr1_backRight: 455,
      fsr2_seatFrontLeft: 380,
      fsr3_seatFrontRight: 375,
      fsr4_seatRearLeft: 840,
      fsr5_seatRearRight: 835,
      us0_leftCalfDist: 8.5,
      us1_rightCalfDist: 8.4
    }
  },
  slouch_forward: {
    id: 'slouch_forward',
    labelZh: '駝背前傾 (Kyphosis)',
    labelEn: 'Slouching Forward Lean',
    description: '胸椎過度彎曲前傾，背部完全脫離椅背支撐，重心大幅前移，造成腰椎L4-L5間盤壓力劇增與頸背肌筋膜緊繃。',
    riskLevel: 'severe',
    rebaScore: 7,
    spinalLoadFactor: 1.85, // 185% compressive load on lumbar discs
    typicalSensors: {
      fsr0_backLeft: 12,
      fsr1_backRight: 15,
      fsr2_seatFrontLeft: 780,
      fsr3_seatFrontRight: 760,
      fsr4_seatRearLeft: 350,
      fsr5_seatRearRight: 340,
      us0_leftCalfDist: 4.2,
      us1_rightCalfDist: 4.5
    }
  },
  slump_reclined: {
    id: 'slump_reclined',
    labelZh: '骨盆後傾癱坐 (Slumped Reclining)',
    labelEn: 'Slumped Posterior Tilt',
    description: '臀部滑向前緣，腰部懸空，背部僅肩胛骨抵住椅背上緣，骨盆嚴重後傾，破壞脊椎S型自然曲度。',
    riskLevel: 'severe',
    rebaScore: 6,
    spinalLoadFactor: 1.65,
    typicalSensors: {
      fsr0_backLeft: 710,
      fsr1_backRight: 695,
      fsr2_seatFrontLeft: 180,
      fsr3_seatFrontRight: 190,
      fsr4_seatRearLeft: 420,
      fsr5_seatRearRight: 430,
      us0_leftCalfDist: 18.2,
      us1_rightCalfDist: 18.0
    }
  },
  left_tilt: {
    id: 'left_tilt',
    labelZh: '脊椎左傾 (Left Scoliotic Tilt)',
    labelEn: 'Left Asymmetrical Tilt',
    description: '身體重心過度偏向左側扶手或側身靠坐，左側坐骨承受過高壓迫，易誘發功能性脊椎側彎與骨盆傾斜。',
    riskLevel: 'moderate',
    rebaScore: 5,
    spinalLoadFactor: 1.45,
    typicalSensors: {
      fsr0_backLeft: 620,
      fsr1_backRight: 80,
      fsr2_seatFrontLeft: 640,
      fsr3_seatFrontRight: 190,
      fsr4_seatRearLeft: 960,
      fsr5_seatRearRight: 310,
      us0_leftCalfDist: 7.2,
      us1_rightCalfDist: 11.5
    }
  },
  right_tilt: {
    id: 'right_tilt',
    labelZh: '脊椎右傾 (Right Scoliotic Tilt)',
    labelEn: 'Right Asymmetrical Tilt',
    description: '重心明顯偏向右側，右側臀部與大腿過載，長時間將導致左右腰方肌張力失衡與骨盆代償。',
    riskLevel: 'moderate',
    rebaScore: 5,
    spinalLoadFactor: 1.45,
    typicalSensors: {
      fsr0_backLeft: 75,
      fsr1_backRight: 630,
      fsr2_seatFrontLeft: 185,
      fsr3_seatFrontRight: 650,
      fsr4_seatRearLeft: 290,
      fsr5_seatRearRight: 975,
      us0_leftCalfDist: 11.8,
      us1_rightCalfDist: 7.0
    }
  },
  cross_leg_left: {
    id: 'cross_leg_left',
    labelZh: '左翹二郎腿 (Left Cross-Leg)',
    labelEn: 'Left Leg Crossed',
    description: '左腿跨越於右腿之上，右側坐骨與大腿承受額外剪力與旋轉扭矩，左小腿距感測器拉遠，骨盆發生旋轉扭曲。',
    riskLevel: 'moderate',
    rebaScore: 5,
    spinalLoadFactor: 1.55,
    typicalSensors: {
      fsr0_backLeft: 310,
      fsr1_backRight: 380,
      fsr2_seatFrontLeft: 95,
      fsr3_seatFrontRight: 880,
      fsr4_seatRearLeft: 420,
      fsr5_seatRearRight: 890,
      us0_leftCalfDist: 16.5,
      us1_rightCalfDist: 6.8
    }
  },
  cross_leg_right: {
    id: 'cross_leg_right',
    labelZh: '右翹二郎腿 (Right Cross-Leg)',
    labelEn: 'Right Leg Crossed',
    description: '右腿跨越於左腿之上，左側坐骨承受大部分重力，右側大腿傳感器壓力驟減，右小腿距離大幅遠離椅腿。',
    riskLevel: 'moderate',
    rebaScore: 5,
    spinalLoadFactor: 1.55,
    typicalSensors: {
      fsr0_backLeft: 390,
      fsr1_backRight: 300,
      fsr2_seatFrontLeft: 870,
      fsr3_seatFrontRight: 110,
      fsr4_seatRearLeft: 895,
      fsr5_seatRearRight: 410,
      us0_leftCalfDist: 6.9,
      us1_rightCalfDist: 16.2
    }
  },
  edge_sitting: {
    id: 'edge_sitting',
    labelZh: '前緣淺坐 (Perched Sitting)',
    labelEn: 'Forward Edge Sitting',
    description: '僅坐在座墊前三分之一邊緣，椅背完全失去支撐效果，下肢小腿垂直或回縮，核心肌群長時間維持靜態張力。',
    riskLevel: 'mild',
    rebaScore: 4,
    spinalLoadFactor: 1.30,
    typicalSensors: {
      fsr0_backLeft: 5,
      fsr1_backRight: 8,
      fsr2_seatFrontLeft: 620,
      fsr3_seatFrontRight: 610,
      fsr4_seatRearLeft: 140,
      fsr5_seatRearRight: 135,
      us0_leftCalfDist: 3.5,
      us1_rightCalfDist: 3.4
    }
  }
};

/**
 * Coordinate mapping of sensors on the chair (in millimeters relative to seat center [0,0])
 * Seat coordinate: X is Left(-150mm) to Right(+150mm), Y is Rear(-150mm) to Front(+150mm)
 */
const SENSOR_COORDINATES = {
  // Seat cushion sensors (4 FSRs)
  seatFrontLeft:  { x: -110, y: 120 },  // FSR2 (Left Thigh)
  seatFrontRight: { x:  110, y: 120 },  // FSR3 (Right Thigh)
  seatRearLeft:   { x: -100, y: -100 }, // FSR4 (Left Ischium)
  seatRearRight:  { x:  100, y: -100 }, // FSR5 (Right Ischium)
};

/**
 * Extract 12 high-level biomechanical features from raw sensor readings
 */
export function extractBiomechanicalFeatures(raw: RawSensorData, bodyWeightKg = 65): BiomechanicalFeatures {
  const p0 = Math.max(0, raw.fsr0_backLeft);
  const p1 = Math.max(0, raw.fsr1_backRight);
  const p2 = Math.max(0, raw.fsr2_seatFrontLeft);
  const p3 = Math.max(0, raw.fsr3_seatFrontRight);
  const p4 = Math.max(0, raw.fsr4_seatRearLeft);
  const p5 = Math.max(0, raw.fsr5_seatRearRight);

  const seatTotal = p2 + p3 + p4 + p5;
  const backTotal = p0 + p1;
  const allTotal = seatTotal + backTotal;

  // 1. Center of Pressure (COP) calculation
  let copX = 0;
  let copY = 0;
  if (seatTotal > 10) {
    copX = (
      SENSOR_COORDINATES.seatFrontLeft.x * p2 +
      SENSOR_COORDINATES.seatFrontRight.x * p3 +
      SENSOR_COORDINATES.seatRearLeft.x * p4 +
      SENSOR_COORDINATES.seatRearRight.x * p5
    ) / seatTotal;

    copY = (
      SENSOR_COORDINATES.seatFrontLeft.y * p2 +
      SENSOR_COORDINATES.seatFrontRight.y * p3 +
      SENSOR_COORDINATES.seatRearLeft.y * p4 +
      SENSOR_COORDINATES.seatRearRight.y * p5
    ) / seatTotal;
  }

  // 2. Postural Asymmetry Index (ASI)
  // Left side sum = p0 + p2 + p4; Right side sum = p1 + p3 + p5
  const leftSum = p0 + p2 + p4;
  const rightSum = p1 + p3 + p5;
  const totalSum = leftSum + rightSum;
  const lateralAsymmetryIndex = totalSum > 20 ? (Math.abs(leftSum - rightSum) / totalSum) * 100 : 0;

  // 3. Backrest Support Ratio (BSR)
  const backrestSupportRatio = allTotal > 20 ? backTotal / allTotal : 0;

  // 4. Thigh vs Ischium Load Ratio (Front / Rear)
  const frontLoad = p2 + p3;
  const rearLoad = p4 + p5;
  const thighToIschiumRatio = rearLoad > 20 ? frontLoad / rearLoad : (frontLoad > 0 ? 3.0 : 0.0);

  // 5. Ultrasonic Calf Clearance Delta (|Left - Right|)
  const calfClearanceDelta = Math.abs(raw.us0_leftCalfDist - raw.us1_rightCalfDist);
  const calfMeanDistance = (raw.us0_leftCalfDist + raw.us1_rightCalfDist) / 2;

  // 6. Spatial Pressure Entropy
  // Shannon entropy of normalized sensor distributions (6 sensors)
  const sensorVals = [p0, p1, p2, p3, p4, p5];
  let pressureEntropy = 0;
  if (allTotal > 20) {
    for (const val of sensorVals) {
      if (val > 0) {
        const p = val / allTotal;
        pressureEntropy -= p * Math.log2(p);
      }
    }
  }

  // 7. Dynamic Sway / COP variance heuristic
  const copMagnitude = Math.sqrt(copX * copX + copY * copY);
  const copSwayVariance = Number((copMagnitude * (1 + lateralAsymmetryIndex / 50)).toFixed(2));

  // 8. Estimated Lumbar Compression Force (N)
  // Biomechanical model (Chaffin & Andersson): Upper body ~ 60% of total mass
  // Baseline standing lumbar load ~ 500 N; Ergonomic seated ~ 400-500 N;
  // Unsupported slouch lean can reach 800 - 1100 N.
  const upperBodyMassKg = bodyWeightKg * 0.62;
  const baseCompressionN = upperBodyMassKg * 9.81;
  
  // Forward lean multiplier + lack of backrest support penalty
  const forwardLeanPenalty = copY > 20 ? 1.0 + (copY / 120) * 0.6 : 1.0;
  const backrestRelief = backrestSupportRatio > 0.15 ? Math.max(0.7, 1.0 - backrestSupportRatio * 0.45) : 1.25;
  const asymmetryPenalty = 1.0 + (lateralAsymmetryIndex / 100) * 0.35;
  
  const estimatedLumbarLoadN = Number((baseCompressionN * forwardLeanPenalty * backrestRelief * asymmetryPenalty).toFixed(1));

  return {
    copX: Number(copX.toFixed(1)),
    copY: Number(copY.toFixed(1)),
    lateralAsymmetryIndex: Number(lateralAsymmetryIndex.toFixed(1)),
    backrestSupportRatio: Number(backrestSupportRatio.toFixed(3)),
    thighToIschiumRatio: Number(thighToIschiumRatio.toFixed(2)),
    totalPressure: Math.round(allTotal),
    calfClearanceDelta: Number(calfClearanceDelta.toFixed(1)),
    calfMeanDistance: Number(calfMeanDistance.toFixed(1)),
    pressureEntropy: Number(pressureEntropy.toFixed(3)),
    copSwayVariance,
    estimatedLumbarLoadN
  };
}

/**
 * Feature vector array for machine learning models (Normalized 0-1)
 */
export function featureVectorToArray(f: BiomechanicalFeatures, raw: RawSensorData): number[] {
  return [
    f.copX / 100,                     // normalized ~ -1 to 1
    f.copY / 100,                     // normalized ~ -1 to 1
    f.lateralAsymmetryIndex / 100,    // 0 to 1
    f.backrestSupportRatio,           // 0 to 1
    Math.min(3, f.thighToIschiumRatio) / 3, // 0 to 1
    Math.min(30, f.calfClearanceDelta) / 30, // 0 to 1
    Math.min(30, f.calfMeanDistance) / 30,   // 0 to 1
    f.pressureEntropy / 2.585,        // max log2(6) ≈ 2.585
    raw.fsr0_backLeft / 1023,
    raw.fsr1_backRight / 1023,
    raw.fsr2_seatFrontLeft / 1023,
    raw.fsr3_seatFrontRight / 1023,
    raw.fsr4_seatRearLeft / 1023,
    raw.fsr5_seatRearRight / 1023
  ];
}
