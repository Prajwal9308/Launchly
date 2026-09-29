import { describe, expect, it } from "vitest";
import { countryLabel, formatMoney, isCountry } from "@/domain/country";

describe("country and currency", () => {
  it("formats Canadian prices with CA$, never a bare dollar sign", () => {
    expect(formatMoney(1500, "CA")).toBe("CA$1,500");
    expect(formatMoney(20000, "CA")).toBe("CA$20,000");
  });

  it("formats Indian prices in rupees with Indian digit grouping", () => {
    expect(formatMoney(75000, "IN")).toBe("₹75,000");
    expect(formatMoney(150000, "IN")).toBe("₹1,50,000");
  });

  it("only accepts the two served countries", () => {
    expect(isCountry("CA")).toBe(true);
    expect(isCountry("IN")).toBe(true);
    expect(isCountry("US")).toBe(false);
    expect(isCountry("")).toBe(false);
  });

  it("labels the selector with the currency", () => {
    expect(countryLabel("CA")).toBe("Canada · CAD");
    expect(countryLabel("IN")).toBe("India · INR");
  });
});
