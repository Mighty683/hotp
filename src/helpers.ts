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
  counter: number | Int8Array,
  algorithm?: AlgorithmOption
): Promise<Uint8Array> {
  let _algorithm = NodeAlgorithmsMap[algorithm] || NodeAlgorithmsMap["sha-1"];
  let byteArray =
    typeof counter === "number"
      ? convertIntegerIntoByteBuffer(counter)
      : counter;
  return new Uint8Array(
    (await import("crypto"))
      .createHmac(_algorithm, Buffer.from(secret))
      .update(byteArray)
      .digest()
  );
}

export async function browserHmac(
  secret: string,
  counter: number | Int8Array,
  algorithm?: AlgorithmOption
): Promise<Uint8Array> {
  let _algorithm = WebAlgorithmsMap[algorithm] || WebAlgorithmsMap["sha-1"];
  let crypto = window.crypto;
  let byteArray =
    typeof counter === "number"
      ? convertIntegerIntoByteBuffer(counter)
      : counter;
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

export function convertStringIntoByteBuffer(source: string) {
  let bytes = [];
  for (let i = 0; i < source.length; i++) {
    bytes.push(source.charCodeAt(i));
  }
  return new Int8Array(bytes);
}

export function convertHexStringIntoByteBuffer(source: string) {
  let bytes = [];
  for (let i = 0; i < source.length; i += 2) {
    bytes.push(parseInt(source.slice(i, i + 2), 16));
  }

  return new Int8Array(bytes);
}

export function convertIntegerIntoByteBuffer(integer: number, byteSize = 8) {
  let hexInteger = padZeroStart(integer.toString(16), byteSize * 2);
  let bytes = [];
  for (let counter = 0; counter < hexInteger.length; counter += 2) {
    bytes.push(
      parseInt(hexInteger.substring(counter, counter + 2), byteSize * 2)
    );
  }
  return new Int8Array(bytes);
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
  counter: number | Int8Array,
  algorithm: AlgorithmOption
): Promise<Uint8Array> {
  if (isNodeEnv()) {
    return nodeHmac(secret, counter, algorithm);
  } else {
    return browserHmac(secret, counter, algorithm);
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
  let counterEnabled = suiteQuestionDataParts.length === 3;
  let suiteQuestionPart = counterEnabled
    ? suiteQuestionDataParts[1]
    : suiteQuestionDataParts[0];
  let questionType = suiteQuestionPart[1] as OCRAQuestionTypes;
  let questionLength = parseInt(suiteQuestionPart.match(/\d+/)[0]);
  // Data
  let dataInput = (
    counterEnabled ? suiteQuestionDataParts[2] : suiteQuestionDataParts[1]
  ) as OCRADataInput;

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
  let suiteByteArray = convertStringIntoByteBuffer(suite);
  let questionByteArray: Int8Array;
  if (typeof question === "number") {
    questionByteArray = convertIntegerIntoByteBuffer(
      question,
      OCRA_QUESTION_BYTE_LENGTH
    );
  } else if (typeof question === "string") {
    if (config.questionType === "A") {
      questionByteArray = new Int8Array(OCRA_QUESTION_BYTE_LENGTH);
      questionByteArray.set(convertStringIntoByteBuffer(question), 0);
    } else if (config.questionType === "N") {
      questionByteArray = new Int8Array(OCRA_QUESTION_BYTE_LENGTH);
      questionByteArray.set(
        convertHexStringIntoByteBuffer(
          parseInt(question, 10).toString(16).padEnd(128, "0")
        ),
        0
      );
    }
  } else {
    questionByteArray = new Int8Array(OCRA_QUESTION_BYTE_LENGTH);
    questionByteArray.set(question, 0);
  }

  let separatorByteArray = new Int8Array([0]);
  let counterArray = counter && convertIntegerIntoByteBuffer(counter);
  let sessionArray = session && convertStringIntoByteBuffer(session);
  let passwordArray = passwordHash && convertStringIntoByteBuffer(passwordHash);
  let timestampArray = timestamp && convertIntegerIntoByteBuffer(timestamp);
  let dataInput = new Int8Array([
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
