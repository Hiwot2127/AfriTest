import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export class AIClient {
    async generateUnitTests(code: string): Promise<string> {
        console.log("HERE IS THE CODE", code)
         const prompt = `
You are an expert backend engineer and test writer.
Generate Jest unit tests ONLY for the public, exported functions, classes, or methods in the following TypeScript code.

Guidelines:
- Ignore private/internal helpers, types, or configuration code.
- Focus on realistic scenarios and edge cases for each exported member.
- Do NOT generate tests for trivial getters/setters, type definitions, or constants.
- Use modern Jest syntax and best practices.
- Do NOT include any explanation, comments, or extra text outside the code block.

Here is the code to test:
---
${code}
---
`;
        try {
            const response = await axios.post(
                `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
                { contents: [{ parts: [{ text: prompt }] }] }
            );
            return response.data.candidates[0].content.parts[0].text;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            console.error(`AIClient UnitTest Error: ${errorMessage}`); // Use console.error
            return `// AI generation failed: ${errorMessage}`;
        }
    }

    async generateIntegrationTests(code: string): Promise<string> {
        console.log("THE DEPENDECNY GRAPH", code)
        const prompt = `
You are an expert backend engineer and test writer.
Generate a Jest integration test for a Node.js/Express API endpoint related to "${code}".

Guidelines:
- Focus on realistic API scenarios (success, validation error, not found, unauthorized).
- Do NOT generate tests for internal helpers, types, or configuration.
- Use 'supertest' for HTTP requests.
- Do NOT include any explanation, comments, or extra text outside the code block.

The endpoint to test is related to: "${code}".
`;
        try {
            const response = await axios.post(
                `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
                { contents: [{ parts: [{ text: prompt }] }] }
            );
            return response.data.candidates[0].content.parts[0].text;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            console.error(`AIClient IntegrationTest Error: ${errorMessage}`); // Use console.error
            return `// AI generation failed: ${errorMessage}`;
        }
    }
}