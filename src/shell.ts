import { exec } from "child_process";

type ShellResult = {
  code: number;
  stdout: string;
};

export const shell = async (cmd: string) => {
  let stdout = "";
  return new Promise<ShellResult>((resolve, reject) => {
    const run = exec(cmd);

    if (!run) {
      reject(`failed to start cmd: ${cmd}`);
      return;
    }

    run.stdout?.on("data", function (data) {
      stdout += data;
      process.stdout.write(data);
    });

    run.stderr?.on("data", function (data) {
      process.stderr.write(data);
    });

    run.on("exit", (code) => {
      if (code == 0) {
        resolve({ code, stdout });
      } else {
        reject(`command failed with code ${code}`);
      }
    });
  });
};
