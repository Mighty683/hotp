import { generateHOTP, generateTOTP } from "../index";

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
