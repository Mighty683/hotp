export type AlgorithmOption = "sha-1" | "sha-256" | "sha-512";

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

export type SelectOCRAAlgorithmMap = Record<OCRAAlgorithms, AlgorithmOption>;

export type OCRAAlgorithms = "SHA1" | "SHA256" | "SHA512";

export type OCRAQuestionTypes = "N" | "A" | "H";

export type OCRAQuestionConfig = `Q${OCRAQuestionTypes}${number}`;

export type OCRACounterConfig = `C`;

export type OCRADataInput = `P${OCRAAlgorithms}` | `S${number}` | `T${number}M`;

export type OCRASuiteStringWithCounter =
  `OCRA-1:HOTP-${OCRAAlgorithms}-${number}:${`${OCRACounterConfig}-${OCRAQuestionConfig}${
    | `-${OCRADataInput}`
    | ""}`}`;

export type OCRASuiteStringWithoutCounter =
  `OCRA-1:HOTP-${OCRAAlgorithms}-${number}:${`${OCRAQuestionConfig}${
    | `-${OCRADataInput}`
    | ""}`}`;

export type OCRASuiteString =
  | OCRASuiteStringWithCounter
  | OCRASuiteStringWithoutCounter;

export type OCRAOptions = {
  session?: string;
  passwordHash?: string;
  timestamp?: number;
  question: string | number | Int8Array;
  suite: OCRASuiteString;
} & (
  | {
      suite: OCRASuiteStringWithCounter;
      counter: number;
    }
  | {
      suite: OCRASuiteStringWithoutCounter;
      counter?: undefined;
    }
);

export type OCRASuiteConfig = {
  algorithm: OCRAAlgorithms;
  digitsCount: number;
  questionType: OCRAQuestionTypes;
  questionLength: number;
  dataInput?: OCRADataInput;
  counterEnabled: boolean;
  timerEnabled: boolean;
};
