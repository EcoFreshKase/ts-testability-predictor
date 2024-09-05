import assert from "assert";
import { downloadProjects } from "../../main/lib/projectUtils";
import fs from "fs";

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
});
