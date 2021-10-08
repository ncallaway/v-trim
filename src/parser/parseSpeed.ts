import { ok, err, Result } from "neverthrow";
import { parseNumber } from "./parseNumber";
import { parseSlice } from "./parseSlice";

export type SpeedResult = Result<Speed, string>;

export const parseSpeed = (remaining: string[]): SpeedResult => {
  if (remaining.length < 2) {
    return err("speed expected two arguments");
  }
  const rawSlice = remaining.shift() as string;
  const resSlice = parseSlice(rawSlice);

  const rawSpeed = remaining.shift() as string;
  const resSpeed = parseNumber(rawSpeed);
  // deal with the speed

  if (resSlice.isErr()) {
    return err(`the slice given to speed was not valid (${rawSlice}: ${resSlice.error})`);
  }

  if (resSpeed.isErr()) {
    return err(`the speed given to speed was not valid (${rawSpeed}: ${resSpeed.error})`);
  }

  if (!resSpeed.value) {
    return err(`the speed cannot be empty`);
  }

  if (resSpeed.value < 0.1) {
    return err(`the speed cannot be < 0.1 (${rawSpeed})`);
  }

  if (resSpeed.value > 10) {
    return err(`the speed cannot be > 10 (${rawSpeed})`);
  }

  return ok({ action: "speed", slice: resSlice.value, speed: resSpeed.value });
};
