import { parseNumber } from "./parser/parseNumber";
import { shell } from "./shell";

export const reifyActions = async (args: Args) => {
  const duration = await calculateDuration(args.input);

  // map actions to concrete actions
  const actions = mapInputActions(args.actions, duration);

  // clamp actions to 0
  clampActions(actions, duration);

  // sort by start
  sortActions(actions);

  // find gaps
  const gaps = findGaps(actions, duration);

  // ensure no overlaps
  validateOverlaps(gaps);

  // fill gaps with nulls
  fillNulls(actions, gaps);

  // sort the nulls into place
  sortActions(actions);

  return actions;
};

const fillNulls = (actions: Action[], gaps: Slice[]) => {
  gaps.forEach((gap) => {
    const act: NullAction = {
      action: "null",
      slice: gap,
    };
    actions.push(act);
  });
};

const clampActions = (actions: Action[], duration: number) => {
  actions.forEach((a) => {
    if (a.slice.start < 0) {
      a.slice.start = 0;
    }
    if (a.slice.end > duration) {
      a.slice.end = duration;
    }
  });
};

const validateOverlaps = (gaps: Slice[]) => {
  // if any gaps *end* before they  *start*, there is an overlap between sections
  const anyOverlaps = gaps.some((g) => g.end < g.start);

  if (anyOverlaps) {
    console.log("an overlap was detected.");
    process.exit(1);
  }
};

const findGaps = (actions: Action[], duration: number) => {
  const gaps: Slice[] = [];

  let priorEnd = 0;

  for (let idx = 0; idx < actions.length; idx++) {
    const action = actions[idx];

    if (action.slice.start != priorEnd) {
      // this is a gap!
      const gap: Slice = {
        start: priorEnd,
        end: action.slice.start,
      };
      gaps.push(gap);
    }

    priorEnd = action.slice.end;
  }

  // check for an ending gap
  if (priorEnd != duration) {
    gaps.push({
      start: priorEnd,
      end: duration,
    });
  }

  return gaps;
};

const sortActions = (actions: Action[]) => {
  actions.sort((a, b) => a.slice.start - b.slice.start);
};

const mapInputActions = (actions: InputAction[], duration: number): Action[] => {
  return actions.flatMap((action) => {
    switch (action.action) {
      case "speed":
        const act: SpeedAction = {
          action: "speed",
          slice: {
            start: action.slice.start || 0,
            end: action.slice.end || duration,
          },
          speed: action.speed,
        };
        return [act] as Action[];
      case "rm":
        const rm: RemoveAction = {
          action: "rm",
          slice: {
            start: action.slice.start || 0,
            end: action.slice.end || duration,
          },
        };
        return [rm] as Action[];
      case "trim":
        const slice: Slice = {
          start: action.slice.start || 0,
          end: action.slice.end || duration,
        };

        const head: RemoveAction = {
          action: "rm",
          slice: {
            start: 0,
            end: slice.start,
          },
        };
        const tail: RemoveAction = {
          action: "rm",
          slice: {
            start: slice.end,
            end: duration,
          },
        };
        return [head, tail] as Action[];
      default:
        // @ts-ignore
        console.log("unrecognized input action: ", action.action);
        process.exit(1);
    }
  });
};

const calculateDuration = async (input: string): Promise<number> => {
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
