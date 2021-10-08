#! /usr/bin/env node

import { argv } from "process";
import { parseSpeed } from "./parser/parseSpeed";
import { parseTrim } from "./parser/parseTrim";

const main = () => {
  const { input, actions, output } = proccessArgs(argv);

  console.log("input file: ", input);
  console.log("done actions: ", JSON.stringify(actions, null, 2));
  console.log("done output: ", output);
};

// v-trim [input] --trim "5,16" --speed "[6,7]" .25 --speed "[10,11]" .4 --rm "[8,9]" [output]

// --trim "5,16" => eqivalent to `--rm ",5" --rm "16,`
const extRegex = /^.*\.(.*?)$/;

type Args = {
  input: string;
  actions: Action[];
  output: string;
};

const proccessArgs = (args: string[]): Args => {
  let remaining = args.slice(2);
  if (remaining.length == 0 || !remaining[0]) {
    console.log("An input file must be provided");
    process.exit(1);
  }

  let input = remaining.shift() as string;
  let { actions, output } = parseActions(remaining);

  let defaultOutput = `${input}.trim`;

  const m = input.match(extRegex);
  if (m && m[1]) {
    console.log("m is: ", m[1]);
    const lastIdx = input.lastIndexOf(m[1]);
    defaultOutput = input.slice(0, lastIdx - 1) + `.trim.${m[1]}`;
    console.log("default output is: ", defaultOutput);
  }

  if (!output) {
    output = defaultOutput;
  }

  return {
    input,
    actions,
    output,
  };
};

const parseActions = (remaining: string[]) => {
  const actions: Action[] = [];
  let output: string | null = null;

  while (remaining.length > 0) {
    const action = remaining.shift();
    switch (action) {
      case "-t":
      case "--trim":
        const resTrim = parseTrim(remaining);
        if (resTrim.isErr()) {
          console.log("An error occurred while processing --trim\n\t", resTrim.error);
          process.exit(1);
        }
        actions.push(resTrim.value);
        break;
      case "-s":
      case "--speed":
        const resSpeed = parseSpeed(remaining);
        if (resSpeed.isErr()) {
          console.log("An error occurred while processing --speed\n\t", resSpeed.error);
          process.exit(1);
        }
        actions.push(resSpeed.value);
        break;
      default:
        if (remaining.length == 0) {
          output = action as string;
        } else {
          console.log(`An argument was not recognized (${action})`);
          process.exit(1);
        }
    }
  }

  return { actions, output };
};

// v-trim file.mp4 --trim 5,16 --speed 6,7 .25 --speed 10,11 .4 out.mp4

main();
