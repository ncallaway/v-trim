export const argTrim = (start: number | undefined, end: number | undefined): InputAction => ({
  action: "trim",
  slice: { start, end } as any,
});

export const argRm = (start: number | undefined, end: number | undefined): InputAction => ({
  action: "rm",
  slice: { start, end } as any,
});

export const argSpeed = (start: number | undefined, end: number | undefined, speed: number = 2): InputAction => ({
  action: "speed",
  slice: { start, end } as any,
  speed,
});

export const rm = (start: number, end: number): Action => ({
  action: "rm",
  slice: { start, end },
});

export const nul = (start: number, end: number): Action => ({
  action: "null",
  slice: {
    start,
    end,
  },
});

export const speed = (start: number, end: number, speed: number): Action => ({
  action: "speed",
  slice: {
    start,
    end,
  },
  speed,
});

export const mockedFn = <T extends (...args: any[]) => any>(thing: T): jest.MockedFunction<T> => {
  return thing as unknown as jest.MockedFunction<T>;
};
