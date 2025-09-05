import fs from "fs";
import path from "path";

export class ProjectScanner {
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  public scan(): string[] {
    const files: string[] = [];
    if (!fs.existsSync(this.projectRoot)) {
      return [];
    }
    this.traverseDirectory(this.projectRoot, files);
    return files.filter(
      (f) => !f.includes("node_modules") && !f.endsWith(".spec.ts")
    );
  }

  private traverseDirectory(directory: string, files: string[]): void {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        this.traverseDirectory(fullPath, files);
      } else if (entry.isFile() && this.isRelevantFile(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  private isRelevantFile(fileName: string): boolean {
    return fileName.endsWith(".ts") || fileName.endsWith(".js");
  }
}
