import { AnalyzedFile, runFta as runFtaOld } from "fta-cli";

export function runFta(projectPath: string): AnalyzedFile[] {
  return runFtaOld(projectPath, { json: true });
}
