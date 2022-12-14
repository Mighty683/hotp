import { generateHOTP, generateOCRA, generateTOTP } from "../index";
import {
  OCRASuiteStringWithCounter,
  OCRASuiteStringWithoutCounter,
} from "../types";

const secret = "12345678901234567890";

describe("library", () => {
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
    const OCRA_20BYTE_TEST_KEY = "12345678901234567890";
    const OCRA_32BYTE_TEST_KEY = "12345678901234567890123456789012";
    const OCRA_64BYTE_TEST_KEY =
      "1234567890123456789012345678901234567890123456789012345678901234";
    const TEST_DATE = new Date("Mar 25 2008, 12:06:30 GMT");
    const MINUTES_COUNT = Math.floor(TEST_DATE.getTime() / 60000);
    const PIN_SHA1 = "7110eda4d09e062aa5e4a390b0a572ac0d2c0220";

    test.concurrent.each<[OCRASuiteStringWithoutCounter, string, string]>([
      ["OCRA-1:HOTP-SHA1-6:QN08", "00000000", "237653"],
      ["OCRA-1:HOTP-SHA1-6:QN08", "11111111", "243178"],
      ["OCRA-1:HOTP-SHA1-6:QN08", "99999999", "294470"],
    ])("OCRA-1:HOTP-SHA1-6:QN08", async (suite, question, response) => {
      expect(
        await generateOCRA(OCRA_20BYTE_TEST_KEY, {
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
          passwordHash: PIN_SHA1,
        })
      ).toBe(response);
    });

    test.concurrent.each<[OCRASuiteStringWithoutCounter, string, string]>([
      ["OCRA-1:HOTP-SHA256-8:QA08", "SIG10000", "53095496"],
      ["OCRA-1:HOTP-SHA256-8:QA08", "SIG11000", "04110475"],
      ["OCRA-1:HOTP-SHA256-8:QA08", "SIG12000", "31331128"],
    ])("OCRA-1:HOTP-SHA256-8:QA08", async (suite, question, response) => {
      expect(
        await generateOCRA(OCRA_32BYTE_TEST_KEY, {
          suite,
          question,
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
            passwordHash: PIN_SHA1,
          })
        ).toBe(response);
      }
    );

    test.concurrent.each<[OCRASuiteStringWithCounter, string, number, string]>([
      ["OCRA-1:HOTP-SHA512-8:C-QN08", "00000000", 0, "07016083"],
      ["OCRA-1:HOTP-SHA512-8:C-QN08", "11111111", 1, "63947962"],
      ["OCRA-1:HOTP-SHA512-8:C-QN08", "22222222", 2, "70123924"],
    ])(
      "OCRA-1:HOTP-SHA512-8:C-QN08",
      async (suite, question, counter, response) => {
        expect(
          await generateOCRA(OCRA_64BYTE_TEST_KEY, {
            suite,
            question,
            counter,
          })
        ).toBe(response);
      }
    );

    test.concurrent.each<
      [OCRASuiteStringWithoutCounter, string, number, string]
    >([
      ["OCRA-1:HOTP-SHA512-8:QN08-T1M", "00000000", MINUTES_COUNT, "95209754"],
      ["OCRA-1:HOTP-SHA512-8:QN08-T1M", "11111111", MINUTES_COUNT, "55907591"],
      ["OCRA-1:HOTP-SHA512-8:QN08-T1M", "22222222", MINUTES_COUNT, "22048402"],
    ])(
      "OCRA-1:HOTP-SHA512-8:QN08-T1M",
      async (suite, question, timestamp, response) =>
        expect(
          await generateOCRA(OCRA_64BYTE_TEST_KEY, {
            suite,
            timestamp,
            question,
          })
        ).toBe(response)
    );

    test.concurrent.each<
      [OCRASuiteStringWithoutCounter, string, number, string]
    >([
      [
        "OCRA-1:HOTP-SHA512-8:QA10-T1M",
        "SIG1000000",
        MINUTES_COUNT,
        "77537423",
      ],
      [
        "OCRA-1:HOTP-SHA512-8:QA10-T1M",
        "SIG1100000",
        MINUTES_COUNT,
        "31970405",
      ],
      [
        "OCRA-1:HOTP-SHA512-8:QA10-T1M",
        "SIG1200000",
        MINUTES_COUNT,
        "10235557",
      ],
    ])(
      "OCRA-1:HOTP-SHA512-8:QA10-T1M",
      async (suite, question, timestamp, response) => {
        expect(
          await generateOCRA(OCRA_64BYTE_TEST_KEY, {
            suite,
            question,
            timestamp,
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
});
