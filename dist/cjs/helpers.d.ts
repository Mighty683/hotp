import { AlgorithmOption, OCRAOptions, OCRASuiteConfig, OCRASuiteString } from "./types";
export declare function nodeHmac(secret: string, input: number | Int8Array | Uint8Array, algorithm?: AlgorithmOption): Promise<Uint8Array>;
export declare function browserHmac(secret: string, input: number | Int8Array | Uint8Array, algorithm?: AlgorithmOption): Promise<Uint8Array>;
export declare function stringToByteArray(source: string): Uint8Array;
export declare function hexStringToByteArray(source: string): Uint8Array;
export declare function integerToByteArray(integer: number, byteSize?: number): Uint8Array;
export declare function padZeroStart(source: string, length: number): string;
export declare function isNodeEnv(): boolean;
export declare function dynamicTruncate(source: ArrayBuffer): number;
export declare function hmac(secret: string, input: number | Uint8Array | Int8Array, algorithm: AlgorithmOption): Promise<Uint8Array>;
export declare function parseOCRASuite(suite: OCRASuiteString): OCRASuiteConfig;
export declare function createOCRADataInput({ suite, question, counter, session, passwordHash, timestamp }: OCRAOptions, config: OCRASuiteConfig): Uint8Array;
