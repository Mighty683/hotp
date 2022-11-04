export async function generateHOTP(
  secret: string,
  counter: number
): Promise<string> {
  let hmacResult = await hmac(secret, counter);

  let codeValue = dynamicTruncate(hmacResult) % 1000000;
  let codeString = codeValue.toString();
  while (codeString.length < 6) {
    codeString = "0" + codeString;
  }
  return codeString;
}

function dynamicTruncate(source: ArrayBuffer) {
  let offset = source[19] & 0xf;
  return (
    ((source[offset] & 0x7f) << 24) |
    ((source[offset + 1] & 0xff) << 16) |
    ((source[offset + 2] & 0xff) << 8) |
    (source[offset + 3] & 0xff)
  );
}

async function hmac(secret: string, counter: number): Promise<Buffer> {
  const crypto = await import("crypto");
  const hmacSha1 = crypto.createHmac("sha1", secret);
  return hmacSha1.update(convertCounterInto8ByteBuffer(counter)).digest();
}

function convertCounterInto8ByteBuffer(counter: number) {
  let counterString = counter.toString();
  while (counterString.length < 8) {
    counterString = "0" + counterString;
  }
  return Buffer.from(counterString.split("").map((el) => parseInt(el)));
}
