import { ok } from "neverthrow";
import { Probe } from "../src/lib/probe";
import { generatePlan } from "../src/plan";
import { argRm, argSpeed, argTrim, nul, rm } from "./util";

jest.mock("../src/lib/probe");

describe("generatePlan", () => {
  // @ts-ignore
  Probe.inputDuration.mockResolvedValue(15);
  // @ts-ignore
  Probe.inputHasAudio.mockResolvedValue(true);

  describe("successful", () => {
    it("fills a no-op for an empty plan", async () => {
      const args: Args = {
        input: "./samples/sample-video.mp4",
        actions: [],
        output: "./output/sample-video.trim.mp4",
      };
      const plan = await generatePlan(args);
      expect(plan).toEqual(
        ok({
          actions: [nul(0, 15)],
          includeAudio: true,
        })
      );
    });

    it("converts trims to rm", async () => {
      const args: Args = {
        input: "./samples/sample-video.mp4",
        actions: [argTrim(5, 10)],
        output: "./output/sample-video.trim.mp4",
      };
      const plan = await generatePlan(args);
      expect(plan).toEqual(
        ok({
          actions: [rm(0, 5), nul(5, 10), rm(10, 15)],
          includeAudio: true,
        })
      );
    });
  });

  describe("failure", () => {
    it("rejects inputs with overlaps", async () => {
      const args: Args = {
        input: "./samples/sample-video.mp4",
        actions: [argRm(5, 10), argSpeed(7, 12)],
        output: "./output/sample-video.trim.mp4",
      };
      const plan = await generatePlan(args);
      expect(plan.isErr()).toEqual(true);
    });

    it("rejects unrecognized inputs", async () => {
      const args: Args = {
        input: "./samples/sample-video.mp4",
        actions: [
          {
            action: "baz",
            slice: { start: 5, end: 6 },
          } as any,
        ],
        output: "./output/sample-video.trim.mp4",
      };
      const plan = await generatePlan(args);
      expect(plan.isErr()).toEqual(true);
    });
  });
});

