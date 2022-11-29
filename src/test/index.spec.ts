import { generateHOTP, generateOCRA, generateTOTP } from "../index";
import {
  OCRASuiteString,
  OCRASuiteStringWithCounter,
  OCRASuiteStringWithoutCounter,
} from "../types";

const secret = "12345678901234567890";
describe("generateHOTP", () => {
  it("should proper generate HOTP", async () => {
    expect(await generateHOTP(secret, 0)).toBe("755224");
    expect(await generateHOTP(secret, 1)).toBe("287082");
    expect(await generateHOTP(secret, 2)).toBe("359152");
    expect(await generateHOTP(secret, 3)).toBe("969429");
    expect(await generateHOTP(secret, 4)).toBe("338314");
    expect(await generateHOTP(secret, 5)).toBe("254676");
    expect(await generateHOTP(secret, 6)).toBe("287922");
    expect(await generateHOTP(secret, 9)).toBe("520489");
  });
  it("should generate proper HOTP sha256", async () => {
    expect(
      await generateHOTP(secret, 0, {
        algorithm: "sha-256",
      })
    ).toBe("875740");
  });
});

describe("generateOCRA", () => {
  let OCRA_TEST_KEY = "12345678901234567890";
  let OCRA_32BYTE_TEST_KEY = "12345678901234567890123456789012";
  let pinSHA1 = "7110eda4d09e062aa5e4a390b0a572ac0d2c0220";

  test.concurrent.each<[OCRASuiteStringWithoutCounter, string, string]>([
    ["OCRA-1:HOTP-SHA1-6:QN08", "00000000", "237653"],
    ["OCRA-1:HOTP-SHA1-6:QN08", "11111111", "243178"],
    ["OCRA-1:HOTP-SHA1-6:QN08", "99999999", "294470"],
  ])("OCRA-1:HOTP-SHA1-6:QN08", async (suite, question, response) => {
    expect(
      await generateOCRA(OCRA_TEST_KEY, {
        suite,
        question,
      })
    ).toBe(response);
  });

  test.concurrent.each<[OCRASuiteStringWithoutCounter, string, string]>([
    ["OCRA-1:HOTP-SHA256-8:QN08-PSHA1", "00000000", "83238735"],
    ["OCRA-1:HOTP-SHA256-8:QN08-PSHA1", "11111111", "01501458"],
    ["OCRA-1:HOTP-SHA256-8:QN08-PSHA1", "44444444", "86807031"],
  ])("OCRA-1:HOTP-SHA256-8:QN08-PSHA1", async (suite, question, response) => {
    expect(
      await generateOCRA(OCRA_32BYTE_TEST_KEY, {
        suite,
        question,
        passwordHash: pinSHA1,
      })
    ).toBe(response);
  });

  test.concurrent.each<[OCRASuiteStringWithCounter, string, number, string]>([
    ["OCRA-1:HOTP-SHA256-8:C-QN08-PSHA1", "12345678", 0, "65347737"],
    ["OCRA-1:HOTP-SHA256-8:C-QN08-PSHA1", "12345678", 1, "86775851"],
    ["OCRA-1:HOTP-SHA256-8:C-QN08-PSHA1", "12345678", 2, "78192410"],
  ])(
    "OCRA-1:HOTP-SHA256-8:C-QN08-PSHA1",
    async (suite, question, counter, response) => {
      expect(
        await generateOCRA(OCRA_32BYTE_TEST_KEY, {
          suite,
          question,
          counter,
          passwordHash: pinSHA1,
        })
      ).toBe(response);
    }
  );
});

describe("generateTOTP", () => {
  const t0 = 0;
  it("should generate proper TOTP", async () => {
    expect(
      await generateTOTP(secret, {
        t0,
        timestamp: new Date("1970-01-01T00:00:58Z").valueOf(),
        stepTime: 30,
      })
    ).toBe("287082");
    expect(
      await generateTOTP(secret, {
        t0,
        timestamp: new Date("1970-01-01T00:00:59Z").valueOf(),
        stepTime: 30,
      })
    ).toBe("287082");
    expect(
      await generateTOTP(secret, {
        t0,
        timestamp: new Date("2005-03-18T01:58:29Z").valueOf(),
        stepTime: 30,
      })
    ).toBe("081804");
  });
  it("should generate proper TOTP sha256", async () => {
    expect(
      await generateTOTP(secret, {
        t0,
        timestamp: new Date("1970-01-01T00:00:58Z").valueOf(),
        stepTime: 30,
        algorithm: "sha-256",
      })
    ).toBe("247374");
  });
});
