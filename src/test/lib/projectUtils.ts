import assert from "assert";
import { createResultDir, downloadProjects } from "../../main/lib/projectUtils";
import fs from "fs";
import { dirSync } from "tmp";

describe("projectUtils", () => {
  describe("downloadProjects", () => {
    const projects = [
      "https://github.com/EcoFreshKase/create-typescript-eco.git",
      "https://github.com/EcoFreshKase/CodeAttach.git",
    ];

    it("should download the projects", async () => {
      const projectDir = await downloadProjects(projects);
      assert.ok(projectDir);

      const expectedDirs = ["create-typescript-eco", "CodeAttach"];
      const actualDirs = fs.readdirSync(projectDir);

      assert.deepStrictEqual(actualDirs.sort(), expectedDirs.sort());
    });
  });
  describe("createResultDir", () => {
    let tmpDir = dirSync();

    it("should create a result directory", async () => {
      const resultDir = await createResultDir(tmpDir.name);
      assert.ok(resultDir);
      assert.equal(resultDir, `${tmpDir.name}/results`);
    });
    it("should create a result directory with a suffix if the directory already exists", async () => {
      const resultDir = await createResultDir(tmpDir.name);
      assert.ok(resultDir);

      const resultDir2 = await createResultDir(tmpDir.name);
      assert.ok(resultDir2);
      assert.equal(resultDir, `${tmpDir.name}/results (1)`);

      assert.notStrictEqual(resultDir, resultDir2);
    });
  });
});
