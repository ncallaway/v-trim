#! /usr/bin/env node

import { argv } from "process";
import { executePlan } from "./apply";
import { parseCommandLine } from "./parse";
import { generatePlan } from "./plan";

const main = async () => {
  const args = parseCommandLine(argv);

  if (args.isErr()) {
    console.log(`Argument error: ${args.error}`);
    process.exit(1);
  }

  // generate plan
  const plan = await generatePlan(args.value);

  // apply actions
  await executePlan(args.value, plan);
};



// v-trim file.mp4 --trim 5,16 --speed 6,7 .25 --speed 10,11 .4 out.mp4

main();
