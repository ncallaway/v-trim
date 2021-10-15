import { executePlan } from "../src/execute";
import { shell } from "../src/lib/shell";
import { mockedFn, nul, rm, speed } from "./util";
import { unlinkSync } from "fs";

jest.mock("fs");
jest.mock("../src/lib/shell");

const mockedSh = mockedFn(shell);

describe("executePlan", () => {
  describe("successful video only", () => {
    it("should call both shell calls", async () => {
      const args: Args = {
        input: "./samples/sample-video.mp4",
        actions: [],
        output: "./output/sample-video.trim.mp4",
      };

      const plan = {
        actions: [nul(0, 30)],
        includeAudio: false,
      };

      await executePlan(args, plan);

      expect(mockedSh.mock.calls.length).toEqual(2);

      // first call should transcode
      const shTrans = mockedSh.mock.calls[0][0];
      expect(shTrans).toContain("ffmpeg -y"); // ffmpeg
      expect(shTrans).toContain(`-i ./samples/sample-video.mp4`); // input file
      expect(shTrans).toContain(`-vcodec libx265`); // h.265 codec
      expect(shTrans).toContain(`-vf "scale='min(1000,iw)':-2"`); // scale to max width of 1000
      expect(shTrans).toContain(`-crf 30`); // set a high crf
      expect(shTrans).toContain(`-r 20`); // set a low frame-rate

      // second call should apply actions (super boring for include-audio with a single null action)
      const shTrim = mockedSh.mock.calls[1][0];
      expect(shTrim).toContain("ffmpeg -y");
      expect(shTrim).toContain("-filter_complex");
      expect(shTrim).toContain(`[0:v]trim=0:30,setpts=PTS-STARTPTS[v1]`);
      expect(shTrim).toContain(`[v1]concat=n=1:v=1`);
    });

    it("should remove a trimmed section", async () => {
      const args: Args = {
        input: "./samples/sample-video.mp4",
        actions: [],
        output: "./output/sample-video.trim.mp4",
      };

      const plan = {
        actions: [nul(10, 20), rm(20, 25), nul(25, 30)],
        includeAudio: false,
      };

      await executePlan(args, plan);

      expect(mockedSh.mock.calls.length).toEqual(2);

      // second call should apply actions (super boring for include-audio with a single null action)
      const shTrim = mockedSh.mock.calls[1][0];
      expect(shTrim).toContain(`[0:v]trim=10:20,setpts=PTS-STARTPTS[v1]`);
      expect(shTrim).toContain(`[0:v]trim=25:30,setpts=PTS-STARTPTS[v2]`);
      expect(shTrim).toContain(`[v1][v2]concat=n=2:v=1`);
    });

    it("should speed up a given section", async () => {
      const args: Args = {
        input: "./samples/sample-video.mp4",
        actions: [],
        output: "./output/sample-video.trim.mp4",
      };

      const plan = {
        actions: [nul(10, 20), speed(20, 30, 2)],
        includeAudio: false,
      };

      await executePlan(args, plan);

      expect(mockedSh.mock.calls.length).toEqual(2);

      // second call should apply actions (super boring for include-audio with a single null action)
      const shTrim = mockedSh.mock.calls[1][0];
      expect(shTrim).toContain(`[0:v]trim=10:20,setpts=PTS-STARTPTS[v1]`);
      expect(shTrim).toContain(`[0:v]trim=20:30,setpts=(PTS-STARTPTS)/2[v2]`);
      expect(shTrim).toContain(`[v1][v2]concat=n=2:v=1`);
    });
  });
});
