import { parseCommandLine } from "../src/parse";

const i = ["/node", "v-trim"];

describe("parseCommandLine", () => {
  describe("successful", () => {
    it("should parse only an input file", () => {
      const res = parseCommandLine([...i, "file.mp4"])._unsafeUnwrap();

      expect(res.actions).toEqual([]);
      expect(res.input).toEqual("file.mp4");
      expect(res.output).toEqual("file.trim.mp4");
    });

    it("should generate a default output file extension", () => {
      const res = parseCommandLine([...i, "file"])._unsafeUnwrap();

      expect(res.actions).toEqual([]);
      expect(res.input).toEqual("file");
      expect(res.output).toEqual("file.trim.mp4");
    });

    it("should parse an output file", () => {
      const res = parseCommandLine([...i, "file", "~/result.mp4"])._unsafeUnwrap();

      expect(res.actions).toEqual([]);
      expect(res.input).toEqual("file");
      expect(res.output).toEqual("~/result.mp4");
    });
  });

  describe("failure", () => {
    it("requires an input file", () => {
      const res = parseCommandLine([...i]);
      expect(res.isOk()).toEqual(false);
    });
  });
});
