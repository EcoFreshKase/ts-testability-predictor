import { runFta } from "./lib/fta-cli-ts";
import { downloadProjects } from "./lib/projectUtils";

let projects = [
  "https://github.com/EcoFreshKase/create-typescript-eco.git",
  "https://github.com/EcoFreshKase/CodeAttach.git",
  "https://github.com/mixn/carbon-now-cli.git",
  "https://github.com/EcoFreshKase/broken-access-controll-test.git",
];

let projectDir = downloadProjects(projects);
console.log(projectDir);
