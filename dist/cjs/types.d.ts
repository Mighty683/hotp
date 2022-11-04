export declare type AlgorithmOption = "sha-1" | "sha-256";
export declare type HOTPOptions = {
    digitsCount?: number;
    algorithm?: AlgorithmOption;
};
export declare type TOTPOptions = HOTPOptions & {
    stepTime?: number;
    t0?: number;
    timestamp: number;
};
export declare type SelectAlgorithmMap = Record<AlgorithmOption, string>;
