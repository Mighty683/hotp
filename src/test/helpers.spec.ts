import { parseOCRASuite } from "../helpers";
import { OCRASuiteConfig, OCRASuiteString } from "../types";

describe("helpers", () => {
  describe("parseOCRASuite", () => {
    test.concurrent.each<[OCRASuiteString, OCRASuiteConfig]>([
      [
        "OCRA-1:HOTP-SHA512-8:C-QN08-PSHA1" as OCRASuiteString,
        {
          algorithm: "SHA512",
          digitsCount: 8,
          questionType: "N",
          questionLength: 8,
          dataInput: "PSHA1",
          counterEnabled: true,
        },
      ],
      [
        "OCRA-1:HOTP-SHA256-6:QA10-T1M" as OCRASuiteString,
        {
          algorithm: "SHA256",
          digitsCount: 6,
          questionType: "A",
          questionLength: 10,
          dataInput: "T1M",
          counterEnabled: false,
        },
      ],
      [
        "OCRA-1:HOTP-SHA1-4:QH8-S512" as OCRASuiteString,
        {
          algorithm: "SHA1",
          digitsCount: 4,
          questionType: "H",
          questionLength: 8,
          dataInput: "S512",
          counterEnabled: false,
        },
      ],
      // [, {}],
    ])("parseOCRASuite", (input: OCRASuiteString, output: OCRASuiteConfig) => {
      expect(parseOCRASuite(input)).toEqual(output);
    });
  });
});