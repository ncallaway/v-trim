import { parseNumber } from "../parser/parseNumber";
import { shell } from "./shell";

const inputDuration = async (input: string): Promise<number> => {
  const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${input}`;

  const { stdout } = await shell(cmd);
  const resDuration = parseNumber(stdout.trim());

  if (resDuration.isErr()) {
    console.log(`failed to calculate the duration of ${input}`);
    process.exit(1);
  }

  if (!resDuration.value) {
    console.log(`failed to calculate the duration of ${input}`);
    process.exit(1);
  }

  return resDuration.value;
};

const inputHasAudio = async (input: string): Promise<boolean> => {
  const cmd = `ffprobe -i ${input} -show_streams -select_streams a -loglevel error`;

  const { stdout } = await shell(cmd);
  const hasAudio = Boolean(stdout.trim());

  return hasAudio;
};

export const Probe = {
  inputDuration,
  inputHasAudio,
};
