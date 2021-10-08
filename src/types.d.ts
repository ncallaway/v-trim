type Slice = StartingSlice | EndingSlice | MiddleSlice;

type StartingSlice = {
  end: number;
};

type EndingSlice = {
  start: number;
};

type MiddleSlice = {
  start: number;
  end: number;
};

type Trim = {
  action: "trim";
  slice: Slice;
};

type Speed = {
  action: "speed";
  slice: Slice;
  speed: number;
};

type Action = Trim | Speed;
