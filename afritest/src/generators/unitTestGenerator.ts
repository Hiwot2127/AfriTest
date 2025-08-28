import { ProjectScanner } from '../analyzer/projectScanner';
import { writeTests } from './writer';
import { AIClient } from '../utils/aiClient';
import * as fs from 'fs';

export class UnitTestGenerator {
    private scanner: ProjectScanner;
    private aiClient: AIClient;

    constructor(projectPath: string) {
        this.scanner = new ProjectScanner(projectPath);
        this.aiClient = new AIClient();
    }

 public async generate(outputDir: string): Promise<void> {
    const files = this.scanner.scan();
     const tests: { dir: string, fileName: string, content: string }[] = [];
    for (const filePath of files) {
        if (!filePath.endsWith('.ts') || filePath.endsWith('.spec.ts')) continue;
        const code = fs.readFileSync(filePath, 'utf-8');
        const testCode = await this.aiClient.generateUnitTests(code);
        if (testCode) {
            const testFileName = `${filePath.split(/[\\/]/).pop()?.replace('.ts', '')}.ai.spec.ts`;
            tests.push({ dir: outputDir, fileName: testFileName, content: testCode });
        }
    }
    writeTests(tests);
}
    public async generateTestCode(moduleCode: string): Promise<string> {
        return await this.aiClient.generateUnitTests(moduleCode);
    }
}