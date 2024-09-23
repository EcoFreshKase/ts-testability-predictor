import { readdir, writeFile } from "fs/promises";
import { runFta } from "./lib/fta-cli-ts";
import { downloadProjects, createResultDir } from "./lib/projectUtils";
import { exit } from "process";
import { AnalyzedFile } from "fta-cli";

let projects = [
  "https://github.com/EcoFreshKase/create-typescript-eco.git",
  "https://github.com/EcoFreshKase/CodeAttach.git",
  "https://github.com/mixn/carbon-now-cli.git",
  "https://github.com/EcoFreshKase/broken-access-controll-test.git",
];

async function main() {
  let downloadDir = downloadProjects(projects);
  let resultsDir = await createResultDir(".");

  let projectsAnalysis = [];
  let projectDir = await downloadDir;

  for (let project of await readdir(projectDir)) {
    const projectAnalysis = runFta(projectDir + "/" + project);

    projectsAnalysis.push(
      writeFile(
        `${resultsDir}/${project}.json`,
        JSON.stringify(projectAnalysis, null, 4)
      )
    );
  }

  await Promise.all(projectsAnalysis).catch((err) => {
    console.error("Error writing project analysis:", err);
    exit(1);
  });
}

async function filterResults() {
  let results = await readdir("./results");
  let finalResult: DataSet = [];

  for (let analysisResult of results) {
    const resultJSONs: AnalyzedFile[] = require(`../../results/${analysisResult}`);

    for (const result of resultJSONs)
      finalResult.push({
        project: analysisResult.replace(".json", ""),
        file_name: result.file_name,
        cyclo: result.cyclo,
        commandAmt: result.halstead.total_operators,
        linesOfCode: result.line_count,
        filesAmt: resultJSONs.length,
      });
  }

  writeFile("./results/finalResult.json", JSON.stringify(finalResult, null, 4));
}

// main();
filterResults();
