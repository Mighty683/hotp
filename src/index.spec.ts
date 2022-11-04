import { generateHOTP } from "./index";

describe("hotp", () => {
  describe("generateHOTP", () => {
    it("should generate HOTP", async () => {
      expect(await generateHOTP("12345678901234567890", 0)).toBe("755224");
      expect(await generateHOTP("12345678901234567890", 1)).toBe("287082");
      expect(await generateHOTP("12345678901234567890", 2)).toBe("359152");
      expect(await generateHOTP("12345678901234567890", 3)).toBe("969429");
      expect(await generateHOTP("12345678901234567890", 4)).toBe("338314");
      expect(await generateHOTP("12345678901234567890", 5)).toBe("254676");
      expect(await generateHOTP("12345678901234567890", 6)).toBe("287922");
    });
  });
});
