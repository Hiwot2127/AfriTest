import * as ts from 'typescript';

export class TsParser {
    private fileContent: string;

    constructor(fileContent: string) {
        this.fileContent = fileContent;
    }

    public parse(): any {
        const functions: { name: string, params: string[], expected: string }[] = [];
        const sourceFile = ts.createSourceFile('temp.ts', this.fileContent, ts.ScriptTarget.Latest);

        ts.forEachChild(sourceFile, node => {
            if (ts.isFunctionDeclaration(node) && node.name) {
                const name = node.name.getText();
                const params = node.parameters.map(p => p.name.getText());
                // For demo, expected is a placeholder
                functions.push({ name, params, expected: 'undefined' });
            }
        });

        return { functions };
    }
}