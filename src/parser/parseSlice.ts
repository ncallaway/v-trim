import { err, ok, Result } from "neverthrow";
import { parseNumber } from "./parseNumber";

type SliceError = string;
type SliceResult = Result<InputSlice, SliceError>;
export const parseSlice = (rawSlice: string): SliceResult => {
  const sliced = rawSlice.split(",");

  if (sliced.length != 2) {
    return err("the slice was not formatted correctly");
  }

  const start = parseNumber(sliced[0]);

  if (start.isErr()) {
    return err(start.error);
  }

  const end = parseNumber(sliced[1]);

  if (end.isErr()) {
    return err(end.error);
  }

  if (start.value && end.value) {
    if (start.value > end.value) {
      return err("start and end values of a slice were reversed");
    }
    return ok({ start: start.value, end: end.value });
  }

  if (start.value && !end.value) {
    return ok({ start: start.value, end: undefined });
  }

  if (!start.value && end.value) {
    return ok({ start: undefined, end: end.value });
  }

  return err("both start and end values were omitted");
};
