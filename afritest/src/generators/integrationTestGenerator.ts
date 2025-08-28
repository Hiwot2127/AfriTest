import { writeTests } from './writer';
import { AIClient } from '../utils/aiClient';

export class IntegrationTestGenerator {
    private dependencies: string[];
    private aiClient: AIClient;

    constructor(dependencies: string[]) {
        this.dependencies = dependencies;
        this.aiClient = new AIClient();
    }


   public async generate(outputDir: string): Promise<void> {
    const tests: { dir: string, fileName: string, content: string }[] = [];
    for (const dep of this.dependencies) {
        const testCode = await this.aiClient.generateIntegrationTests(dep);
        if (testCode) {
            const testFileName = `${dep.replace(/\W/g, '_')}.ai.spec.ts`;
            tests.push({ dir: outputDir, fileName: testFileName, content: testCode });
        }
    }
    writeTests(tests);
}
     public async generateTestCode(dependencies: string[]): Promise<string> {
        if (dependencies.length === 0) {
            return '// AI generation failed: No dependencies provided';
        }
        return await this.aiClient.generateIntegrationTests(dependencies[0]);
    }
}