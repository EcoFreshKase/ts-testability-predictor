import { exec } from "child_process";
import { mkdir, access } from "fs/promises";
import { dirSync } from "tmp";
import { promisify } from "util";

const execPromise = promisify(exec);

/**
 * Downloads multiple Git projects in parallel and stores them in a temporary directory.
 *
 * @param gitUrls - An array of Git repository URLs to be cloned.
 * @param log - A boolean flag to enable logging of the download process. Defaults to `false`.
 * @returns A promise that resolves to the path of the temporary directory containing the cloned projects.
 *
 * @throws Will log an error message if any of the projects fail to download.
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

    // return execPromise(`cd ${tmpDir.name} && git clone ${gitUrl}`);
    return (async () => {
      await execPromise(`cd ${tmpDir.name} && git clone ${gitUrl}`);

      const dirName = gitUrl.split("/").pop()?.replace(".git", "");
      const dirPath = `${tmpDir.name}/${dirName}`;
      await access(dirPath).catch((err) => {
        console.log("threw error while cloning");
        throw new Error(`Error while cloning ${gitUrl}`);
      });
      if (log) {
        console.log(`successfully cloned: ${gitUrl}`);
      }
    })();
  });

  await Promise.all(clonePromises).catch((err) => {
    throw new Error(err);
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

/**
 * Fetches the GitHub URLs of the most starred TypeScript projects.
 *
 * @param amtOfProjects - The number of projects to fetch. Must be between 1 and 100.
 * @returns A promise that resolves to an array of GitHub URLs.
 * @throws Will throw an error if the amount of projects is not between 1 and 100.
 */
export async function getGitURLs(amtOfProjects: number): Promise<string[]> {
  if (amtOfProjects < 1 && amtOfProjects > 100) {
    throw new Error("The amount of projects must be between 1 and 100");
  }

  const { Octokit } = await import("@octokit/rest");

  const octokit = new Octokit({});

  return octokit.rest.search
    .repos({
      q: "language:typescript",
      sort: "stars",
      order: "desc",
    })
    .then((repos) => {
      return repos.data.items
        .slice(0, amtOfProjects)
        .map((repo) => repo.clone_url);
    })
    .catch((err) => {
      throw new Error(err);
    });
}
