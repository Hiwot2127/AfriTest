/// <reference types="jest" />
import { execSync } from 'child_process';
import path from 'path';

describe('AfriTest CLI', () => {
    jest.setTimeout(60000); // Set timeout to 60 seconds

    const cliPath = path.resolve(__dirname, '../bin/afritest.ts');
    const srcPath = path.resolve(__dirname, '../src');

    it('should analyze the project structure and generate unit tests', () => {
        const output = execSync(`npx ts-node ${cliPath} analyze ${srcPath} --unit`, { encoding: 'utf-8' });
        expect(output).toContain('Unit tests generated successfully');
    });

    it('should analyze code dependencies and generate integration tests', () => {
        const output = execSync(`npx ts-node ${cliPath} analyze ${srcPath} --integration`, { encoding: 'utf-8' });
        expect(output).toContain('Integration tests generated successfully');
    });

    it('should handle invalid commands gracefully', () => {
        try {
            execSync(`npx ts-node ${cliPath} invalidCommand`, { encoding: 'utf-8' });
        } catch (error: any) {
            expect(error.stdout || error.message).toContain('Error: Invalid command');
        }
    });
});