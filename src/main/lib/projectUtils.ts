import { exec } from "child_process";
import { mkdir } from "fs/promises";
import { dirSync } from "tmp";
import { promisify } from "util";

const execPromise = promisify(exec);

/**
 *
 * @param gitUrls
 * @returns The path to the temporary directory where the projects were downloaded
 */
export async function downloadProjects(
  gitUrls: string[],
  log = false
): Promise<string> {
  let tmpDir = dirSync();

  // Clone all projects in parallel
  const clonePromises = gitUrls.map((gitUrl) => {
    if (log) {
      console.log(`Downloading project from ${gitUrl}`);
    }

    return execPromise(`cd ${tmpDir.name} && git clone ${gitUrl}`);
  });

  await Promise.all(clonePromises).catch((err) => {
    console.error("Error downloading projects:", err);
  });
  if (log) {
    console.log("All projects downloaded successfully.");
  }

  return tmpDir.name;
}

/**
 * Creates a result directory at the specified path.
 * If the directory already exists, it appends a suffix "(1)" to the directory name and tries again.
 * @param path - The path where the result directory should be created.
 * @returns The path of the created result directory.
 */
export async function createResultDir(path: string) {
  let resultsDir = `${path}/results`;
  let dirCreated = false;
  while (!dirCreated) {
    await mkdir(resultsDir)
      .then(() => {
        dirCreated = true;
      })
      .catch((error) => {
        resultsDir += " (1)";
      });
  }
  return resultsDir;
}
