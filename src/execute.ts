import { unlinkSync } from "fs";
import path from "path";
import { shell } from "./lib/shell";

export const executePlan = async (args: Args, plan: GenerationPlan) => {
  const { actions } = plan;

  // tmp for dev iteration:
  const tmpFile = Math.random().toString(16).slice(2);
  const tmpPath = path.join("/tmp", `v-trim-${tmpFile}.mp4`);

  // create a temp file for the intermediate result
  try {
    // note: we make two separate calls to ffmpeg because I'm lazy and haven't investigated how to combined these options
    // with the filter string that we generate and this works well enough. These don't combine naively, but I'm sure
    // there's a better way to do this all in a single pass.

    // todo: trim start and end if possible with: -ss 5 (start) and -to 30 (end)
    const reduceCmd = `ffmpeg -y -i ${args.input} -vcodec libx265 -vf "scale='min(1000,iw)':-2" -crf 30 -r 20 ${tmpPath}`;
    await shell(reduceCmd);

    // now generate the filter and run it
    const filterString = generateFilterString(actions, plan.includeAudio);

    const concatCmd = `ffmpeg -y -i ${tmpPath} ${filterString} ${args.output}`;
    await shell(concatCmd);
  } finally {
    unlinkSync(tmpPath);
  }
};

const generateFilterString = (actions: Action[], includeAudio: boolean): string => {
  const filterActions = actions.filter((a) => a.action != "rm");

  const nodes: string[] = [];
  let streams = "";
  for (let idx = 0; idx < filterActions.length; idx++) {
    const a = filterActions[idx];

    const ptscoeff = a.action == "speed" ? a.speed : null;
    const atempo = a.action == "speed" ? generateAtempoString(a.speed) : null;

    const vprefix = "[0:v]";
    const vtrim = `trim=${a.slice.start}:${a.slice.end}`;
    const vsetpts = ptscoeff ? `setpts=(PTS-STARTPTS)/${ptscoeff}` : `setpts=PTS-STARTPTS`;
    const vsuffix = `[v${idx + 1}]`;
    nodes.push(`${vprefix}${vtrim},${vsetpts}${vsuffix}`);

    streams += `${vsuffix}`;

    if (includeAudio) {
      const aprefix = "[0:a]";
      const atrim = `atrim=${a.slice.start}:${a.slice.end}`;
      const asetpts = atempo ? `asetpts=PTS-STARTPTS,${atempo}` : `asetpts=PTS-STARTPTS`;
      const asuffix = `[a${idx + 1}]`;
      nodes.push(`${aprefix}${atrim},${asetpts}${asuffix}`);
      streams += `${asuffix}`;
    }
  }

  let concat = `concat=n=${filterActions.length}:v=1`;
  if (includeAudio) {
    concat += ":a=1";
  }
  nodes.push(`${streams}${concat}`);

  return `-filter_complex "${nodes.join(";")}"`;
};

const generateAtempoString = (speed: number) => {
  const tempos: string[] = [];
  while (speed < 0.5) {
    tempos.push(`atempo=${0.5}`);
    speed = speed * 2;
  }
  tempos.push(`atempo=${speed.toFixed(1)}`);

  return tempos.join(",");
};

// v-trim ~/Downloads/sample-video.mp4 --rm 15, --rm ,10 --speed 11,13 .5 test.mp4
