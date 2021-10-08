import { ok } from "neverthrow";
import { parseTrim } from "../../src/parser/parseTrim";

describe("parseTrim", () => {
  describe("returns trim", () => {
    it("is valid", () => {
      expect(parseTrim([",5"])).toEqual(
        ok({
          action: "trim",
          slice: {
            end: 5,
          },
        })
      );
    });
  });
  describe("throws errors for", () => {
    it("no other things", () => {
      expect(parseTrim([]).isErr()).toEqual(true);
    });
    it("invalid slice", () => {
      expect(parseTrim(["21"]).isErr()).toEqual(true);
    });
  });
});
