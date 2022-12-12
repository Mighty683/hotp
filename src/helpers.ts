import {
  AlgorithmOption,
  OCRAAlgorithms,
  OCRADataInput,
  OCRAOptions,
  OCRAQuestionTypes,
  OCRASuiteConfig,
  OCRASuiteString,
} from "./types";
import {
  NodeAlgorithmsMap,
  OCRA_QUESTION_BYTE_LENGTH,
  WebAlgorithmsMap,
} from "./enums";

export async function nodeHmac(
  secret: string,
  input: number | Int8Array | Uint8Array,
  algorithm?: AlgorithmOption
): Promise<Uint8Array> {
  let _algorithm = NodeAlgorithmsMap[algorithm] || NodeAlgorithmsMap["sha-1"];
  let byteArray =
    typeof input === "number" ? integerToByteArray(input) : input;
  return new Uint8Array(
    (await import("crypto"))
      .createHmac(_algorithm, Buffer.from(secret))
      .update(byteArray)
      .digest()
  );
}

export async function browserHmac(
  secret: string,
  input: number | Int8Array | Uint8Array,
  algorithm?: AlgorithmOption
): Promise<Uint8Array> {
  let _algorithm = WebAlgorithmsMap[algorithm] || WebAlgorithmsMap["sha-1"];
  let crypto = window.crypto;
  let byteArray =
    typeof input === "number" ? integerToByteArray(input) : input;
  let key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    {
      name: "HMAC",
      hash: {
        name: _algorithm,
      },
    },
    false,
    ["sign"]
  );
  return new Uint8Array(
    await crypto.subtle.sign(
      {
        name: "HMAC",
        hash: {
          name: _algorithm,
        },
      },
      key,
      byteArray
    )
  );
}

export function stringToByteArray(source: string) {
  let bytes = new Uint8Array(source.length);
  for (let i = 0; i < source.length; i++) {
    bytes.set([source.charCodeAt(i)], i);
  }
  return bytes;
}

export function hexStringToByteArray(source: string) {
  let bytes = new Uint8Array(source.length / 2);
  for (let i = 0; i < source.length; i += 2) {
    bytes.set([parseInt(source.slice(i, i + 2).toUpperCase(), 16)], i / 2);
  }

  return bytes;
}

export function integerToByteArray(integer: number, byteSize = 8) {
  let hexInteger = padZeroStart(integer.toString(16), byteSize * 2);
  let bytes = new Uint8Array(byteSize);
  for (let counter = 0; counter < hexInteger.length; counter += 2) {
    bytes.set(
      [parseInt(hexInteger.substring(counter, counter + 2), byteSize * 2)],
      counter / 2
    );
  }
  return bytes;
}

export function padZeroStart(source: string, length: number) {
  while (source.length < length) {
    source = "0" + source;
  }
  return source;
}

export function isNodeEnv() {
  try {
    return !!global;
  } catch {
    return false;
  }
}

export function dynamicTruncate(source: ArrayBuffer) {
  let offset = source[source.byteLength - 1] & 0xf;
  return (
    ((source[offset] & 0x7f) << 24) |
    ((source[offset + 1] & 0xff) << 16) |
    ((source[offset + 2] & 0xff) << 8) |
    (source[offset + 3] & 0xff)
  );
}

export async function hmac(
  secret: string,
  input: number | Uint8Array | Int8Array,
  algorithm: AlgorithmOption
): Promise<Uint8Array> {
  if (isNodeEnv()) {
    return nodeHmac(secret, input, algorithm);
  } else {
    return browserHmac(secret, input, algorithm);
  }
}

export function parseOCRASuite(suite: OCRASuiteString): OCRASuiteConfig {
  let suiteParts = suite.split(":");
  // Algorithm
  let suiteAlgorithmParts = suiteParts[1].split("-");
  let algorithm = suiteAlgorithmParts[1] as OCRAAlgorithms;
  let digitsCount = parseInt(suiteAlgorithmParts[2]);
  // Question
  let suiteQuestionDataParts = suiteParts[2].split("-");
  let counterEnabled = suiteQuestionDataParts.includes("C");
  let suiteQuestionPart = suiteQuestionDataParts[counterEnabled ? 1 : 0];
  let questionType = suiteQuestionPart[1] as OCRAQuestionTypes;
  let questionLength = parseInt(suiteQuestionPart.match(/\d+/)[0]);
  // Data
  let dataInput = suiteQuestionDataParts[counterEnabled ? 2 : 1] as
    | OCRADataInput
    | undefined;

  return {
    algorithm,
    digitsCount,
    questionType,
    questionLength,
    dataInput,
    counterEnabled,
  };
}

export function createOCRADataInput(
  { suite, question, counter, session, passwordHash, timestamp }: OCRAOptions,
  config: OCRASuiteConfig
) {
  let suiteByteArray = stringToByteArray(suite);
  let questionByteArray: Uint8Array;
  if (typeof question === "number") {
    questionByteArray = integerToByteArray(question, OCRA_QUESTION_BYTE_LENGTH);
  } else if (typeof question === "string") {
    if (config.questionType === "A") {
      questionByteArray = new Uint8Array(OCRA_QUESTION_BYTE_LENGTH);
      questionByteArray.set(stringToByteArray(question), 0);
    } else if (config.questionType === "N") {
      questionByteArray = new Uint8Array(OCRA_QUESTION_BYTE_LENGTH);
      questionByteArray.set(
        hexStringToByteArray(
          parseInt(question, 10).toString(16).padEnd(128, "0")
        ),
        0
      );
    }
  } else {
    questionByteArray = new Uint8Array(OCRA_QUESTION_BYTE_LENGTH);
    questionByteArray.set(question, 0);
  }

  let separatorByteArray = new Int8Array([0]);
  let counterArray =
    typeof counter === "number"
      ? integerToByteArray(counter)
      : new Uint8Array(0);
  let sessionArray = session && stringToByteArray(session);
  let passwordArray = passwordHash && hexStringToByteArray(passwordHash);
  let timestampArray = timestamp && integerToByteArray(timestamp);
  let dataInput = new Uint8Array([
    ...suiteByteArray,
    ...(separatorByteArray || []),
    ...(counterArray || []),
    ...(questionByteArray || []),
    ...(passwordArray || []),
    ...(sessionArray || []),
    ...(timestampArray || []),
  ]);
  return dataInput;
}
