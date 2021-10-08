import { ok, err, Result } from "neverthrow";
import { parseSlice } from "./parseSlice";

export type TrimResult = Result<Trim, string>;

export const parseTrim = (remaining: string[]): TrimResult => {
  if (remaining.length == 0) {
    return err("trim expected another argument, but none was present");
  }
  const rawSlice = remaining.shift() as string;
  const parseRes = parseSlice(rawSlice);

  if (parseRes.isErr()) {
    return err(`the slice given to trim was not valid (${rawSlice}: ${parseRes.error})`);
  }

  return ok({ action: "trim", slice: parseRes.value });
};
