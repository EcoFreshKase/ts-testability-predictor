import { runFta as runFtaOld } from "fta-cli";

export function runFta(projectPath: string): Object {
  return runFtaOld(projectPath, { json: true });
}
