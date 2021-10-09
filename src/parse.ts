import { ok, err, Result } from "neverthrow";
import { parseRemove } from "./parser/parseRemove";
import { parseSpeed } from "./parser/parseSpeed";
import { parseTrim } from "./parser/parseTrim";

const extRegex = /^.*\.(.*?)$/;

type ParseResult = Result<Args, string>;

export const parseCommandLine = (args: string[]): ParseResult => {
  let remaining = args.slice(2);
  if (remaining.length == 0 || !remaining[0]) {
    return err("An input file must be provided");
  }

  let input = remaining.shift() as string;

  return parseActions(remaining).map(({ actions, output }) => {
    let defaultOutput = `${input}.trim.mp4`;

    const m = input.match(extRegex);
    if (m && m[1]) {
      const lastIdx = input.lastIndexOf(m[1]);
      defaultOutput = input.slice(0, lastIdx - 1) + `.trim.${m[1]}`;
    }

    if (!output) {
      output = defaultOutput;
    }

    return {
      input,
      actions,
      output,
    };
  });
};

type ParsedActions = {
  actions: InputAction[];
  output: string | null;
};

type InputActionResult = Result<ParsedActions, string>;
const parseActions = (remaining: string[]): InputActionResult => {
  const actions: InputAction[] = [];
  let output: string | null = null;

  while (remaining.length > 0) {
    const action = remaining.shift();
    switch (action) {
      case "-t":
      case "--trim":
        const resTrim = parseTrim(remaining);
        if (resTrim.isErr()) {
          return err(`An error occurred while processing --trim: ${resTrim.error}`);
        }
        actions.push(resTrim.value);
        break;
      case "-s":
      case "--speed":
        const resSpeed = parseSpeed(remaining);
        if (resSpeed.isErr()) {
          return err(`An error occurred while processing --speed: ${resSpeed.error}`);
        }
        actions.push(resSpeed.value);
        break;
      case "--rm":
        const resRemove = parseRemove(remaining);
        if (resRemove.isErr()) {
          return err(`An error occurred while processing --rm: ${resRemove.error}`);
        }
        actions.push(resRemove.value);
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

  return ok({ actions, output });
};
