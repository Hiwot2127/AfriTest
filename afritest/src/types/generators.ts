export interface TestGeneratorOptions {
    includeIntegrationTests: boolean;
    testDirectory: string;
    coverageThreshold?: number;
}

export interface GeneratedTest {
    filePath: string;
    content: string;
}

export interface UnitTestGenerator {
    generateUnitTests(sourceFilePath: string, options: TestGeneratorOptions): GeneratedTest[];
}

export interface IntegrationTestGenerator {
    generateIntegrationTests(sourceFilePath: string, options: TestGeneratorOptions): GeneratedTest[];
}