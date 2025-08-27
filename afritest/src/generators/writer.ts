import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { logError } from '../utils/logger';

export function writeTests(tests: { dir: string, fileName: string, content: string }[]): void {
    for (const test of tests) {
        try {
            if (!existsSync(test.dir)) {
                mkdirSync(test.dir, { recursive: true });
            }
            const filePath = join(test.dir, test.fileName);
            writeFileSync(filePath, test.content, { encoding: 'utf8' });
        } catch (error: any) {
            logError(`Failed to write test file ${test.fileName}: ${error.message}`);
        }
    }
}