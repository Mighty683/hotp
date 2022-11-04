export type AlgorithmOption = "sha-1" | "sha-256";

export type HOTPOptions = {
  digitsCount?: number;
  algorithm?: AlgorithmOption;
};
export type TOTPOptions = HOTPOptions & {
  stepTime?: number;
  t0?: number;
  timestamp: number;
};

export type SelectAlgorithmMap = Record<AlgorithmOption, string>;
