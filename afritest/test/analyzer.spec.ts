/// <reference types="jest" />
import { ProjectScanner } from '../src/analyzer/projectScanner';
import { DependencyGraph } from '../src/analyzer/dependencyGraph';
import * as path from 'path';
import * as fs from 'fs';

describe('ProjectScanner', () => {
    let projectScanner: ProjectScanner;

    beforeEach(() => {
        projectScanner = new ProjectScanner('src');
    });

    it('should scan the project structure and identify relevant files', () => {
        const files = projectScanner.scan().map(f => f.replace(/\\/g, '/'));
        expect(files).toBeDefined();
        expect(files).toContain('src/index.ts');
        expect(files).toContain('src/cli/commands.ts');
    });

    it('should return an empty array if no relevant files are found', () => {
        const emptyDir = path.join(__dirname, 'empty_dir');
        if (!fs.existsSync(emptyDir)) {
            fs.mkdirSync(emptyDir);
        }
        const emptyScanner = new ProjectScanner(emptyDir);
        const files = emptyScanner.scan();
        expect(files).toHaveLength(0);
        fs.rmdirSync(emptyDir);
    });
});

describe('DependencyGraph', () => {
    let dependencyGraph: DependencyGraph;

    beforeEach(() => {
        // Use files from the src directory for dependency analysis
        const scanner = new ProjectScanner('src');
        const files = scanner.scan();
        dependencyGraph = new DependencyGraph(files);
    });

    it('should analyze code dependencies and return a graph', () => {
        const dependencies = dependencyGraph.analyze();
        expect(dependencies).toBeDefined();
        expect(Array.isArray(dependencies)).toBe(true);
    });

    it('should return an empty graph if no dependencies are found', () => {
        const emptyGraph = new DependencyGraph([]);
        const dependencies = emptyGraph.analyze();
        expect(dependencies).toHaveLength(0);
    });
});