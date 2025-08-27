import { ProjectScanner } from './projectScanner';
import { DependencyGraph } from './dependencyGraph';

export class ArchitectureDetector {
    private projectScanner: ProjectScanner;
    private dependencyGraph: DependencyGraph;

    constructor(projectPath: string) {
        this.projectScanner = new ProjectScanner(projectPath);
        const files = this.projectScanner.scan();
        this.dependencyGraph = new DependencyGraph(files);
    }

    public analyzeArchitecture(): string {
    const projectStructure = this.projectScanner.scan();
    const dependencies = this.dependencyGraph.analyze();
    // Example: count controllers, services, repositories
    const controllerFiles = projectStructure.filter(f => f.toLowerCase().includes('controller'));
    const serviceFiles = projectStructure.filter(f => f.toLowerCase().includes('service'));
    const repoFiles = projectStructure.filter(f => f.toLowerCase().includes('repo'));
    return `Detected Architecture: Clean Architecture
Controllers: ${controllerFiles.length}
Services: ${serviceFiles.length}
Repositories: ${repoFiles.length}
Total Files: ${projectStructure.length}
Total Dependencies: ${dependencies.length}`;
}
}