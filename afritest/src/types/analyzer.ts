export interface ProjectAnalysis {
    projectName: string;
    files: string[];
    dependencies: string[];
    architecture: string;
}

export interface TestGenerationOptions {
    includeIntegrationTests: boolean;
    includeUnitTests: boolean;
    outputDirectory: string;
}

export interface TestResult {
    filePath: string;
    success: boolean;
    errors?: string[];
}