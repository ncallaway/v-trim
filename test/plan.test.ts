import { Probe } from "../src/lib/probe";
import { generatePlan } from "../src/plan";

jest.mock("../src/lib/probe");

describe("generatePlan", () => {
  describe("successful", () => {
    it("fills a no-op for an empty plan", async () => {
      // @ts-ignore
      Probe.inputDuration.mockResolvedValue(15);
      // @ts-ignore
      Probe.inputHasAudio.mockResolvedValue(true);

      const args: Args = {
        input: "./samples/sample-video.mp4",
        actions: [],
        output: "./output/sample-video.trim.mp4",
      };
      const plan = await generatePlan(args);
      expect(plan).toEqual<GenerationPlan>({
        actions: [
          {
            action: "null",
            slice: {
              start: 0,
              end: 15,
            },
          },
        ],
        includeAudio: true,
      });
    });
  });
});
