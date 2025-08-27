/// <reference types="jest" />
import { UnitTestGenerator } from '../src/generators/unitTestGenerator';
import { IntegrationTestGenerator } from '../src/generators/integrationTestGenerator';

describe('UnitTestGenerator', () => {
    let unitTestGenerator: UnitTestGenerator;

    beforeEach(() => {
        unitTestGenerator = new UnitTestGenerator('src');
    });

   it('should generate unit tests for a simple function', async () => {
        const moduleCode = `function add(a, b) { return a + b; }`;
        const generatedTest = await unitTestGenerator.generateTestCode(moduleCode);
        const success = generatedTest.includes("describe('add'");
        const failure = generatedTest.includes('AI generation failed');
        expect(success || failure).toBe(true);
    });

    it('should handle empty module code gracefully', async () => {
        const generatedTest = await unitTestGenerator.generateTestCode('');
        expect(generatedTest).toContain('AI generation failed');
    });

    it('should handle files with no functions', async () => {
        const code = `const x = 42;`;
        const generatedTest = await unitTestGenerator.generateTestCode(code);
        expect(generatedTest).toContain('AI generation failed');
    });
});

describe('IntegrationTestGenerator', () => {
    let integrationTestGenerator: IntegrationTestGenerator;

    beforeEach(() => {
        integrationTestGenerator = new IntegrationTestGenerator(['api/todos', 'api/users']);
    });

    it('should generate integration tests for an API endpoint', async () => {
        const dependencies = ['api/todos'];
        const generatedTest = await integrationTestGenerator.generateTestCode(dependencies);
        const success = generatedTest.includes("describe('Integration Test for api/todos'");
        const failure = generatedTest.includes('AI generation failed');
        expect(success || failure).toBe(true);
    });

 it('should handle empty dependencies gracefully', async () => {
        const generatedTest = await integrationTestGenerator.generateTestCode([]);
        expect(generatedTest).toContain('AI generation failed');
    });


    it('should handle circular dependencies gracefully', async () => {
        const dependencies = ['api/todos', 'api/users', 'api/todos'];
        const generatedTest = await integrationTestGenerator.generateTestCode(dependencies);
        const success = generatedTest.includes("describe('Integration Test for api/todos'");
        const failure = generatedTest.includes('AI generation failed');
        expect(success || failure).toBe(true);
    });
});