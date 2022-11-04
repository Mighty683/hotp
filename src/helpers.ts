import { AlgorithmOption } from "./types";
import { NodeAlgorithmsMap, WebAlgorithmsMap } from "./enums";

export async function nodeHmac(
  secret: string,
  counter: number,
  algorithm?: AlgorithmOption
): Promise<Uint8Array> {
  let _algorithm = NodeAlgorithmsMap[algorithm] || NodeAlgorithmsMap["sha-1"];
  return new Uint8Array(
    (await import("crypto"))
      .createHmac(_algorithm, Buffer.from(secret))
      .update(convertIntegerIntoByteBuffer(counter))
      .digest()
  );
}

export async function browserHmac(
  secret: string,
  counter: number,
  algorithm?: AlgorithmOption
): Promise<Uint8Array> {
  let _algorithm = WebAlgorithmsMap[algorithm] || WebAlgorithmsMap["sha-1"];
  let crypto = window.crypto;
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
      convertIntegerIntoByteBuffer(counter)
    )
  );
}

export function convertIntegerIntoByteBuffer(integer: number) {
  let hexInteger = padZeroStart(integer.toString(16), 16);
  let bytes = [];
  for (let counter = 0; counter < hexInteger.length; counter += 2) {
    bytes.push(parseInt(hexInteger.substring(counter, counter + 2), 16));
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
