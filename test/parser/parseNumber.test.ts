import { ok } from "neverthrow";
import { parseNumber } from "../../src/parser/parseNumber";
import { parseSlice } from "../../src/parser/parseSlice";

describe("parseNumber", () => {
  describe("valid", () => {
    it("integer", () => expect(parseNumber("5")).toEqual(ok(5)));
    it("float", () => expect(parseNumber("2.78")).toEqual(ok(2.78)));
    it("zero prefix", () => expect(parseNumber("0.3")).toEqual(ok(0.3)));
  });

  describe("invalid", () => {
    it("empty string", () => expect(parseSlice("").isOk()).toEqual(false));
    it("too many periods", () => expect(parseSlice("3.4.5").isOk()).toEqual(false));
    it("too many periods ish", () => expect(parseSlice("3.4.").isOk()).toEqual(false));
    it("words", () => expect(parseSlice("asdf,").isOk()).toEqual(false));
    it("partial words", () => expect(parseSlice("23a,").isOk()).toEqual(false));
  });
});
