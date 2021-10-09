import { Probe } from "./lib/probe";

export const generatePlan = async (args: Args): Promise<GenerationPlan> => {
  const duration = await Probe.inputDuration(args.input);
  const hasAudio = await Probe.inputHasAudio(args.input);

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

  return { actions, includeAudio: hasAudio };
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
  ``;
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
