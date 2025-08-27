import * as ts from 'typescript';

export class DependencyGraph {
    private files: string[];

    constructor(files: string[]) {
        this.files = files;
    }

    public analyze(): string[] {
        const dependencies: string[] = [];
        for (const filePath of this.files) {
            const code = require('fs').readFileSync(filePath, 'utf-8');
            const sourceFile = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest);
            ts.forEachChild(sourceFile, node => {
                if (
                    ts.isImportDeclaration(node) &&
                    node.moduleSpecifier &&
                    ts.isStringLiteral(node.moduleSpecifier)
                ) {
                    const moduleName = node.moduleSpecifier.text;
                    dependencies.push(moduleName);
                }
            });
        }
        return dependencies;
    }
}