type Args = {
  input: string;
  actions: InputAction[];
  output: string;
};

type InputSlice = StartingSlice | EndingSlice | Slice;

type StartingSlice = {
  start: undefined;
  end: number;
};

type EndingSlice = {
  start: number;
  end: undefined;
};

type Slice = {
  start: number;
  end: number;
};

type InputTrim = {
  action: "trim";
  slice: InputSlice;
};

type InputSpeed = {
  action: "speed";
  slice: InputSlice;
  speed: number;
};

type InputRemove = {
  action: "rm";
  slice: InputSlice;
};

type InputAction = InputTrim | InputSpeed | InputRemove;

type RemoveAction = {
  action: "rm";
  slice: Slice;
};

type SpeedAction = {
  action: "speed";
  slice: Slice;
  speed: number;
};

type NullAction = {
  action: "null";
  slice: Slice;
};

type Action = RemoveAction | SpeedAction | NullAction;

type GenerationPlan = {
  actions: Action[];
  includeAudio: boolean;
};