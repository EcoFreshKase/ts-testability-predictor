import assert from "assert";
import {
  createResultDir,
  downloadProjects,
  getGitURLs,
} from "../../main/lib/projectUtils";
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

    it("should throw an error if a project failed to be cloned", async () => {
      let failed = false;
      try {
        await downloadProjects([
          "https://github.com/EcoFreshKase/does-not-exist.git",
        ]);
      } catch (error) {
        failed = true;
        assert.ok(error);
      }
      if (!failed) {
        assert.fail("Expected an error but didn't receive one.");
      }
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
  describe("getGitURLs", () => {
    it("should return an array of git URLs", async () => {
      const amtOfProjects = 10;
      const gitUrls = await getGitURLs(amtOfProjects);
      assert.ok(gitUrls);
      assert.equal(gitUrls.length, amtOfProjects);
      gitUrls.every((url) => assert.match(url, /https:\/\/*.git/));
    });
  });
});
