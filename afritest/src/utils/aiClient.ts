import axios from "axios";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export class AIClient {
  async generateUnitTests(code: string): Promise<string> {
    const prompt = `
You are an expert backend engineer and test writer.

Generate a Jest unit test file for the following TypeScript module from a Node.js/Express backend API project.

**Project Context:**
- The codebase uses TypeScript, Node.js, and Express.

**Instructions:**
- Return ONLY the TypeScript code for the test file—do NOT wrap it in a markdown code block or add any comments, explanations, or extra text outside the code.
- Test ONLY public, exported functions, classes, or methods.
- SKIP: type aliases, interfaces, DTOs, Zod schemas, trivial constants, private/internal helpers.
- For each exported function/class:
  - Cover a realistic success case.
  - Cover at least one error/edge case (e.g., invalid input, dependency throws, not found).
  - Mock external dependencies (repositories, DB, JWT, etc.) using jest.fn().
- Use modern Jest syntax (describe, it, expect).
- Use ESM imports (import ... from ...).
- If the module only exports types/constants, return: "// Skipped: no testable exported members".
- Do NOT generate tests for trivial getters/setters, type definitions, or constants.
- Do NOT include any explanation, comments, or extra text outside the code.

Here is the code to test:
---
${code}
---
Return ONLY the TypeScript code for the test file.
`;
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );
      return response.data.candidates[0].content.parts[0].text;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message;
      console.error(`AIClient UnitTest Error: ${errorMessage}`); // Use console.error
      return `// AI generation failed: ${errorMessage}`;
    }
  }

  async generateIntegrationTests(
    code: string,
    dependency: string
  ): Promise<string> {
    const prompt = `
You are an expert backend engineer and test writer.

Generate a Jest integration test file for a Node.js/Express backend API endpoint.
You will receive both the code of the module and the dependency name.

**Project Context:**
- The codebase uses TypeScript, Node.js, and Express.

**Instructions:**
- Use TypeScript and ESM imports (import ... from ...).
- Assume the Express app is imported as 'app' from an absolute path (e.g., import app from '/app';).
- Use 'supertest' for HTTP requests.
- Test realistic scenarios: success (2xx), validation error (400), unauthorized (401/403), not found (404).
- Mock external dependencies if needed.
- Limit to 3-4 meaningful test cases per endpoint.
- If the dependency is not an API route (e.g., a utility or config), return: "// Skipped: not an API dependency".
- Do NOT include any explanation, comments, or extra text outside the code.

Here is the code to test:
---
${code}
---
The dependency to test is: "${dependency}"

Return ONLY the TypeScript code for the test file.
`;
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );
      return response.data.candidates[0].content.parts[0].text;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || error.message;
      console.error(`AIClient IntegrationTest Error: ${errorMessage}`); // Use console.error
      return `// AI generation failed: ${errorMessage}`;
    }
  }
}
