import { AnalyzedFile, runFta as runFtaOld } from "fta-cli";

export function runFta(projectPath: string): AnalyzedFile[] {
  return JSON.parse(runFtaOld(projectPath, { json: true }));
}
