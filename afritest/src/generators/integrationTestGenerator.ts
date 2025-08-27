import { writeTests } from './writer';
import { AIClient } from '../utils/aiClient';

export class IntegrationTestGenerator {
    private dependencies: string[];
    private aiClient: AIClient;

    constructor(dependencies: string[]) {
        this.dependencies = dependencies;
        this.aiClient = new AIClient();
    }

   public async generate(): Promise<void> {
    const tests: { dir: string, fileName: string, content: string }[] = [];
    for (const dep of this.dependencies) {
        const testCode = await this.aiClient.generateIntegrationTests(dep);
        if (testCode) {
            // Write to your Todo app's test/integration directory
            const testFileName = `${dep.replace(/\W/g, '_')}.ai.spec.ts`;
            tests.push({ dir: '../todo-app/test/integration', fileName: testFileName, content: testCode });
        }
    }
    writeTests(tests);
}

    // For testing
     public async generateTestCode(dependencies: string[]): Promise<string> {
        // For demonstration, just use the first dependency string
        if (dependencies.length === 0) {
            return '// AI generation failed: No dependencies provided';
        }
        return await this.aiClient.generateIntegrationTests(dependencies[0]);
    }
}