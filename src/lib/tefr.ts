export interface TefrInputs {
  xG90: number;
  xA90: number;
  keyPass90: number;
  shotsOnTarget90: number;
  yellowCards90: number;
  vBase: number;
  expectedSeasonMinutes: number;
  tacticalFit: number; // 0.5 - 1.5
  consistency: number; // 0 - 1 (1 = massima costanza)
  injuryRisk: number; // 0 - 1 (1 = massimo rischio)
}

export const TEFR_WEIGHTS = {
  fp90: 0.4,
  titScore: 0.25,
  tacticalFit: 0.15,
  consistency: 0.1,
  injuryRisk: 0.1,
};

export function calcFp90(inputs: TefrInputs): number {
  return (
    inputs.vBase +
    3.0 * inputs.xG90 +
    1.5 * inputs.xA90 +
    0.5 * inputs.keyPass90 +
    0.3 * inputs.shotsOnTarget90 -
    0.5 * inputs.yellowCards90
  );
}

export function calcTitScore(expectedSeasonMinutes: number): number {
  return Math.max(0, Math.min(1, expectedSeasonMinutes / 3420));
}

export function normalizeMinMax(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

export interface TefrResult {
  fp90: number;
  titScore: number;
  tefr: number;
  breakdown: {
    fp90Weighted: number;
    titScoreWeighted: number;
    tacticalFitWeighted: number;
    consistencyWeighted: number;
    injuryRiskWeighted: number;
  };
}

/**
 * TEFR = w1*FP90 + w2*TitScore + w3*Fit_tactical + w4*Consistency - w5*Risk_injury
 * FP90 e TitScore vengono normalizzati 0-10 prima di applicare i pesi, per essere
 * comparabili con Fit_tactical (0.5-1.5), Consistency (0-1) e Risk (0-1).
 */
export function calcTefr(inputs: TefrInputs): TefrResult {
  const fp90 = calcFp90(inputs);
  const titScore = calcTitScore(inputs.expectedSeasonMinutes);

  // Normalizzazione empirica: FP90 osservato tipicamente tra -1 e 12.
  const fp90Norm = Math.max(0, Math.min(10, normalizeMinMax(fp90, -1, 12) * 10));
  const titScoreNorm = titScore * 10;
  const tacticalFitNorm = normalizeMinMax(inputs.tacticalFit, 0.5, 1.5) * 10;
  const consistencyNorm = inputs.consistency * 10;
  const injuryRiskNorm = inputs.injuryRisk * 10;

  const fp90Weighted = TEFR_WEIGHTS.fp90 * fp90Norm;
  const titScoreWeighted = TEFR_WEIGHTS.titScore * titScoreNorm;
  const tacticalFitWeighted = TEFR_WEIGHTS.tacticalFit * tacticalFitNorm;
  const consistencyWeighted = TEFR_WEIGHTS.consistency * consistencyNorm;
  const injuryRiskWeighted = TEFR_WEIGHTS.injuryRisk * injuryRiskNorm;

  const tefr =
    fp90Weighted + titScoreWeighted + tacticalFitWeighted + consistencyWeighted - injuryRiskWeighted;

  return {
    fp90,
    titScore,
    tefr,
    breakdown: {
      fp90Weighted,
      titScoreWeighted,
      tacticalFitWeighted,
      consistencyWeighted,
      injuryRiskWeighted,
    },
  };
}
