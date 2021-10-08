import { err, ok, Result } from "neverthrow";
import { parseSlice } from "./parseSlice";

export type RemoveResult = Result<InputRemove, string>;

export const parseRemove = (remaining: string[]): RemoveResult => {
  if (remaining.length == 0) {
    return err("trim expected another argument, but none was present");
  }
  const rawSlice = remaining.shift() as string;
  const resSlice = parseSlice(rawSlice);

  if (resSlice.isErr()) {
    return err(`the slice given to speed was not valid (${rawSlice}: ${resSlice.error})`);
  }

  return ok({ action: "rm", slice: resSlice.value });
};
