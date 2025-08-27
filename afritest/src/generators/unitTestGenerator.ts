import { ProjectScanner } from '../analyzer/projectScanner';
import { writeTests } from './writer';
import { AIClient } from '../utils/aiClient';

export class UnitTestGenerator {
    private scanner: ProjectScanner;
    private aiClient: AIClient;

    constructor(projectPath: string) {
        this.scanner = new ProjectScanner(projectPath);
        this.aiClient = new AIClient();
    }

 public async generate(): Promise<void> {
    const files = this.scanner.scan();
    const tests: { dir: string, fileName: string, content: string }[] = [];
    for (const filePath of files) {
        if (!filePath.endsWith('.ts') || filePath.endsWith('.spec.ts')) continue;
        const fs = await import('fs');
        const code = fs.readFileSync(filePath, 'utf-8');
        const testCode = await this.aiClient.generateUnitTests(code);
        if (testCode) {
            // Write to your Todo app's test/unit directory
            const testFileName = `${filePath.split('/').pop()?.replace('.ts', '')}.ai.spec.ts`;
            tests.push({ dir: '../todo-app/test/unit', fileName: testFileName, content: testCode });
        }
    }
    writeTests(tests);
}

    // For testing
    public async generateTestCode(moduleCode: string): Promise<string> {
        return await this.aiClient.generateUnitTests(moduleCode);
    }
}