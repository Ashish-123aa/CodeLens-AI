import fs from "node:fs/promises";
import path from "node:path";

export interface RepositoryFile {
  path: string;
  type: "file" | "dir";
}

const ignoredDirectories = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
]);

export async function getRepositoryFiles(
  repositoryPath: string,
): Promise<RepositoryFile[]> {
  const files: RepositoryFile[] = [];

  async function walk(currentPath: string, relativePath = ""): Promise<void> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
        continue;
      }

      const absolutePath = path.join(currentPath, entry.name);
      const filePath = relativePath
        ? path.join(relativePath, entry.name)
        : entry.name;

      if (entry.isDirectory()) {
        files.push({
          path: filePath,
          type: "dir",
        });

        await walk(absolutePath, filePath);
      } else {
        files.push({
          path: filePath,
          type: "file",
        });
      }
    }
  }

  await walk(repositoryPath);

  return files;
}