import { err, ok, Result } from "neverthrow";

const numericRegex = /^\d*(\.\d+)?$/;
export const parseNumber = (str: string): Result<number | undefined, string> => {
  if (!str) {
    return ok(undefined);
  }

  if (!numericRegex.test(str)) {
    return err(`a value was not formatted as a number (${str})`);
  }

  const value = parseFloat(str);
  if (Number.isNaN(value)) {
    return err(`a value was not formatted as a number (${str})`);
  }

  return ok(value);
};
