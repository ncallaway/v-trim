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

    it("should parse a valid trim", () => {
      const res = parseCommandLine([...i, "file.mp4", "--trim", ",5"])._unsafeUnwrap();
      expect(res.actions).toEqual<InputAction[]>([
        {
          action: "trim",
          slice: {
            start: undefined,
            end: 5,
          },
        },
      ]);
    });
  });

  describe("failure", () => {
    it("requires an input file", () => {
      const res = parseCommandLine([...i]);
      expect(res.isOk()).toEqual(false);
    });

    it("requires slice after --trim", () => {
      const res = parseCommandLine([...i, "file.mp4", "--trim"]);
      expect(res.isOk()).toEqual(false);
    });

    it("requires valid slice after --trim", () => {
      const res = parseCommandLine([...i, "file.mp4", "--trim", "out.mp4"]);
      expect(res.isOk()).toEqual(false);
    });
  });
});
