import { exec } from "child_process";
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
