export declare type AlgorithmOption = "sha-1" | "sha-256" | "sha-512";
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
export declare type SelectOCRAAlgorithmMap = Record<OCRAAlgorithms, AlgorithmOption>;
export declare type OCRAAlgorithms = "SHA1" | "SHA256" | "SHA512";
export declare type OCRAQuestionTypes = "N" | "A" | "H";
export declare type OCRAQuestionConfig = `Q${OCRAQuestionTypes}${number}`;
export declare type OCRACounterConfig = `C`;
export declare type OCRADataInput = `P${OCRAAlgorithms}` | `S${number}` | `T${number}M`;
export declare type OCRASuiteStringWithCounter = `OCRA-1:HOTP-${OCRAAlgorithms}-${number}:${`${OCRACounterConfig}-${OCRAQuestionConfig}${`-${OCRADataInput}` | ""}`}`;
export declare type OCRASuiteStringWithoutCounter = `OCRA-1:HOTP-${OCRAAlgorithms}-${number}:${`${OCRAQuestionConfig}${`-${OCRADataInput}` | ""}`}`;
export declare type OCRASuiteString = OCRASuiteStringWithCounter | OCRASuiteStringWithoutCounter;
export declare type OCRAOptions = {
    session?: string;
    passwordHash?: string;
    timestamp?: number;
    question: string | number | Int8Array;
    suite: OCRASuiteString;
} & ({
    suite: OCRASuiteStringWithCounter;
    counter: number;
} | {
    suite: OCRASuiteStringWithoutCounter;
    counter?: undefined;
});
export declare type OCRASuiteConfig = {
    algorithm: OCRAAlgorithms;
    digitsCount: number;
    questionType: OCRAQuestionTypes;
    questionLength: number;
    dataInput?: OCRADataInput;
    counterEnabled: boolean;
    timerEnabled: boolean;
};
