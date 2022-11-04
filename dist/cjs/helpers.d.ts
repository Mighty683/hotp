import { AlgorithmOption } from "./types";
export declare function nodeHmac(secret: string, counter: number, algorithm?: AlgorithmOption): Promise<Uint8Array>;
export declare function browserHmac(secret: string, counter: number, algorithm?: AlgorithmOption): Promise<Uint8Array>;
export declare function convertIntegerIntoByteBuffer(integer: number): Int8Array;
export declare function padZeroStart(source: string, length: number): string;
export declare function isNodeEnv(): boolean;
