import { writeTests } from "./writer";
import { AIClient } from "../utils/aiClient";
import * as fs from "fs";
import * as path from "path";

export class IntegrationTestGenerator {
  private dependencies: string[];
  private aiClient: AIClient;

  constructor(dependencies: string[]) {
    this.dependencies = dependencies;
    this.aiClient = new AIClient();
  }

  public async generate(outputDir: string): Promise<void> {
    const tests: { dir: string; fileName: string; content: string }[] = [];
    for (const dep of this.dependencies) {
      let code = "";
      if (dep.startsWith(".") || dep.startsWith("/") || dep.match(/[\\\/]/)) {
        try {
          if (fs.existsSync(dep)) {
            code = fs.readFileSync(dep, "utf-8");
          } else if (fs.existsSync(path.join(process.cwd(), dep))) {
            code = fs.readFileSync(path.join(process.cwd(), dep), "utf-8");
          }
        } catch {
          code = "";
        }
      }
      const testCode = await this.aiClient.generateIntegrationTests(code, dep);
      if (testCode) {
        const importStatement = `import app from '/app';\nimport request from 'supertest';\n\n`;
        const testFileName = `${dep.replace(/\W/g, "_")}.ai.spec.ts`;
        tests.push({
          dir: outputDir,
          fileName: testFileName,
          content: importStatement + testCode,
        });
      } else {
        console.warn(`Skipped integration test for dependency: ${dep}`);
      }
    }
    writeTests(tests);
  }
  public async generateTestCode(dependencies: string[]): Promise<string> {
    if (dependencies.length === 0) {
      return "// AI generation failed: No dependencies provided";
    }
    let code = "";
    try {
      code = require("fs").readFileSync(dependencies[0], "utf-8");
    } catch {
      code = "";
    }
    return await this.aiClient.generateIntegrationTests(code, dependencies[0]);
  }
}
