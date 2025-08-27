import axios from 'axios';
import { logError } from '../utils/logger';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

export class AIClient {
    async generateUnitTests(code: string): Promise<string> {
        const prompt = `Generate Jest unit tests for the following code:\n\n${code}`;
        try {
            const response = await axios.post(
                `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
                {
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            logError(`AIClient UnitTest Error: ${errorMessage}`); // <-- FIX HERE
            return `// AI generation failed: ${errorMessage}`;
        }
    }

    async generateIntegrationTests(code: string): Promise<string> {
        const prompt = `Generate Jest integration tests for the following code:\n\n${code}`;
        try {
            const response = await axios.post(
                `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
                {
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } catch (error: any) {
            logError(`AIClient IntegrationTest Error: ${error.message}`);
            return '// AI generation failed: ' + error.message;
        }
    }
}