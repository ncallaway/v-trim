import { ok } from "neverthrow";
import { parseSlice } from "../../src/parser/parseSlice";

describe("parseSlice", () => {
  describe("starting slice", () => {
    it("parses as expected", () => {
      expect(parseSlice(",3")).toEqual(ok({ end: 3 }));
    });
    it("parses various numbers", () => {
      expect(parseSlice(",3.5")).toEqual(ok({ end: 3.5 }));
      expect(parseSlice(",20021.2")).toEqual(ok({ end: 20021.2 }));
    });
  });

  describe("ending slice", () => {
    it("parses as expected", () => {
      expect(parseSlice("16,")).toEqual(ok({ start: 16 }));
    });
  });

  describe("middle slice", () => {
    it("parses as expected", () => {
      expect(parseSlice("15,18")).toEqual(ok({ start: 15, end: 18 }));
    });
  });

  describe("throws errors for", () => {
    it("empty string", () => expect(parseSlice("").isOk()).toEqual(false));
    it("too many values", () => expect(parseSlice("3,4,5").isOk()).toEqual(false));
    it("invalid value", () => expect(parseSlice("asdf,").isOk()).toEqual(false));
    it("partially invalid value", () => expect(parseSlice("23a,").isOk()).toEqual(false));
    it("both empty", () => expect(parseSlice(",").isOk()).toEqual(false));
    it("inverted slice", () => expect(parseSlice("17,15").isOk()).toEqual(false));
  });
});
