import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

function extractTypeScriptBlock(content: string): string {
  const match = content.match(/```typescript([\s\S]*?)```/);
  return match ? match[1].trim() : content;
}

export function writeTests(
  tests: { dir: string; fileName: string; content: string }[]
): void {
  for (const test of tests) {
    try {
      if (!existsSync(test.dir)) {
        mkdirSync(test.dir, { recursive: true });
      }
      const filePath = join(test.dir, test.fileName);
      const code = extractTypeScriptBlock(test.content);
      writeFileSync(filePath, code, { encoding: "utf8" });
    } catch (error: any) {
      console.error(
        `Failed to write test file ${test.fileName}: ${error.message}`
      );
    }
  }
}
