import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export class AIClient {
    async generateUnitTests(code: string): Promise<string> {
         const prompt = `
You are an expert backend engineer and test writer.
Generate a **Jest unit test file only**.  

Guidelines:
- Use **TypeScript** and return a **.test.ts** file content.
- Wrap the code in a single markdown code block with typescript.  
- Ignore private/internal helpers, types, or configuration code.
- Focus on realistic scenarios and edge cases for each exported member.
- Mock dependencies properly.  
- Do NOT generate tests for trivial getters/setters, type definitions, or constants.
- **Do not include any explanations, comments, or extra text outside the code block**.  
- When generating import statements, use correct relative paths as if the test file is located in the project root folder.
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